import { IReduxAction } from './IReduxAction';

export interface IReduxActionRestorer<RootState> {
  registerActionConstructor(actionName: string, actionConstructor: { new (): IReduxAction<RootState>; });
  restoreAction(actionState: IReduxAction<RootState>): IReduxAction<RootState>;
}