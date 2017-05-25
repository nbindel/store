import { IReduxAction } from './iredux-action';
import { IDispatchAction } from './idispatch-action';

interface IDictionary<TValue> {
  [key: string]: TValue;
};

/**
 *  Used to restore ReduxAction class instances
 */
export class ReduxActionRestorer<RootState> { 
  private static reduxActionRestorer: ReduxActionRestorer<any> = undefined;
  
  private constructorMap: IDictionary<{ new (): IReduxAction<RootState>; }> = {};

  /**
   * Enforce singleton by making the constructor private
   */
  private constructor() {

  }

  /**
   * Retrieves the ReduxActionRestorer as a singleton.
   */
  public static getInstance<RootState>() : ReduxActionRestorer<RootState> {
    if(ReduxActionRestorer.reduxActionRestorer === undefined) {
      ReduxActionRestorer.reduxActionRestorer = new ReduxActionRestorer<RootState>();
    }

    return ReduxActionRestorer.reduxActionRestorer;
  } 

  /**
   * Reducer used to execute and restore ReduxActions.
   * 
   * This reducer will check the action to determine if it conforms to the ReduxAction
   * pattern of containing a "payload".  It will then determine if the object contains
   * the required execute method.  If it does not, it will attempt to restore the action
   * from the list of registered ReduxAction class constructors.
   *
   * @param state The application state
   * @param action The dispatched ReduxAction as the payload
   */
  public static reducer<RootState>(state: RootState, action: IDispatchAction) : RootState {
    let currentState: RootState = state;

    if (typeof (action.payload) === 'object') {
      let reduxAction: IReduxAction<RootState> = <IReduxAction<RootState>>action.payload;

      if(typeof reduxAction.ActionName !== 'undefined') {
        // If the execute method does not exist this is a plain Javascript object so 
        // we need to reconstitute the original ReduxAction class.      
        if (typeof reduxAction.execute === 'undefined') {
          reduxAction = ReduxActionRestorer.reduxActionRestorer.reconstituteAction(reduxAction);        
        }

        currentState = reduxAction.execute(state);
      }
    }

    return currentState;
  }

  /**
   * Registers an action's constructor under the action's name for use 
   * during the restoration process.
   *
   * @param actionName The name of the action
   * @param actionConstructor The constructor of the action
   */
  public registerActionConstructor(actionName: string,
                                   actionConstructor: { new (): IReduxAction<RootState>; }) {
    console.log("Registering action: " + actionName);                                       
    if(typeof(this.constructorMap[actionName]) == 'undefined') {
      this.constructorMap[actionName] = actionConstructor;
    }
    else {
      throw new Error("Unable to register duplicated action: " + actionName);
    }                                   
  }

  /**
   * Reconstitutes a ReduxAction object from the serialized action state.
   * 
   * This is necessary because when Javascript classes are serialized they 
   * lose their methods and become plain Javascript objects.  This process 
   * creates a new instance of the class (restoring the methods) then copies 
   * the serialized object state into that new class instance.
   *
   * @param actionState The state of the action to reconstitute
   */
  public reconstituteAction(actionState: IReduxAction<RootState>): IReduxAction<RootState> {
    let actionConstructor: new () => IReduxAction<RootState> = 
      this.constructorMap[actionState.ActionName];

    if (typeof actionConstructor !== 'function') {
      throw new Error("Unable to reconstitute the action due to missing constructor. Name: " + 
        actionState.ActionName + ", ActionState: " + actionState);
    }

    let actionObject: IReduxAction<RootState> = new actionConstructor();
    let reconstitutedAction: IReduxAction<RootState> = Object.assign(actionObject, actionState);

    return reconstitutedAction;
  }
}