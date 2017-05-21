export interface IReduxAction<RootState> {
    ActionName: string;
    execute(state: RootState): RootState;
}