import { IReduxAction } from './IReduxAction';
import { IReduxActionRestorer } from './IReduxActionRestorer';

interface IDictionary<TValue> {
  [key: string]: TValue;
};

// Used to restore IReduxAction class instances
export class ReduxActionRestorer<RootState> implements IReduxActionRestorer<RootState> {
  private constructorMap: IDictionary<{ new (): IReduxAction<RootState>; }> = {};

  // Registers an action's constructor under the action's name for use during the restoration process
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

  // Restores a fully populated action object from the serialized action state.  This is necessary because 
  // when Javascript classes are serialized they lose their methods and become plain Javascript objects.  This process
  // creates a new instance of the class (restoring the methods) then copies the serialized object state into that new
  // class instance.
  public restoreAction(actionState: IReduxAction<RootState>): IReduxAction<RootState> {
    let actionConstructor: new () => IReduxAction<RootState> = this.constructorMap[actionState.ActionName];

    if (typeof actionConstructor !== 'function') {
      throw new Error("Unable to restore the action due to missing constructor. Name: " + actionState.ActionName + ", ActionState: " + actionState);
    }

    let actionObject: IReduxAction<RootState> = new actionConstructor();
    let restoredAction: IReduxAction<RootState> = Object.assign(actionObject, actionState);

    return restoredAction;
  }
}