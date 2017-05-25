import { IDispatchAction } from './idispatch-action';

export interface IReduxAction<RootState> {
    ActionName: string;
    execute(state: RootState): RootState;
    dispatch() : IDispatchAction;
    toDispatchAction() : IDispatchAction;
}