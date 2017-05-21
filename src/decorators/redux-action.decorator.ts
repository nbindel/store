import { IReduxAction } from '../components/IReduxAction';
import { IReduxActionRestorer } from '../components/IReduxActionRestorer';
import { NgRedux } from '../components/ng-redux';

// @ReduxAction decorator
// -----------------------------
// This decorator stores the constructor of each class decorated with @ReduxAction inside of the action restorer.  The 
// purpose of this is to provide an automated way to register action classes so they can be restored after being serialized 
// into the Redux store.
export function ReduxAction<RootState>()
{
  return function (action: any) {//IReduxAction<RootState>) {
    let reduxActionRestorer: IReduxActionRestorer<RootState> = NgRedux.getReduxActionRestorer<RootState>();

    if (reduxActionRestorer != null) {
      let actionInstance: IReduxAction<RootState> = new action();

      reduxActionRestorer.registerActionConstructor(actionInstance.ActionName, (<{ new (): IReduxAction<RootState>; }>action));
    }
  };
}