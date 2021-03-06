﻿import { IReduxAction } from './iredux-action';
import { IDispatchAction } from './idispatch-action';
import { dispatch } from '../../decorators/dispatch';

export abstract class BaseReduxAction<RootState> implements IReduxAction<RootState> {
  /** 
  * Automatically store the action name of the derived class upon creation.  
  * The purpose of this field is to store the action name when the action is 
  * serialized within Redux.  It will also be used to restore the action object
  * by serving as the retrieval key in the action restorer.
  */ 
  public readonly ActionName: string;

  public abstract execute(state: RootState): RootState;

  public constructor(actionName: string) {
    this.ActionName = actionName;
  }

  @dispatch()
  public dispatch() : IDispatchAction
  {
    return this.toDispatchAction();
  } 

  /**
   * 
   */
  public toDispatchAction() : IDispatchAction {
    return <IDispatchAction> {
      type: this.ActionName,
      payload: this
    };
  }
}