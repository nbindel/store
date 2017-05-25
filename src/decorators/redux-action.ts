import { IReduxAction } from '../components/redux-actions/iredux-action';
import { ReduxActionRestorer } from '../components/redux-actions/redux-action-restorer';
import { NgRedux } from '../components/ng-redux';

/**
 * @ReduxAction decorator that registers a class as a redux action
 *
 * This decorator stores the constructor of each class decorated with @ReduxAction
 * inside of the action restorer.  The purpose of this is to provide an automated 
 * way to register action classes so they can be restored after being serialized 
 * into the Redux store.
 */
export function ReduxAction<RootState>()
{
  // Investigate why IReduxAction<RootState> doesn't seem to work here
  return function (action: any) { 
    let reduxActionRestorer: ReduxActionRestorer<RootState> = 
      ReduxActionRestorer.getInstance<RootState>();

    if (reduxActionRestorer != null) {
      let actionInstance: IReduxAction<RootState> = new action();

      reduxActionRestorer.registerActionConstructor(actionInstance.ActionName, 
        (<{ new (): IReduxAction<RootState>; }>action));
    }
  };
}