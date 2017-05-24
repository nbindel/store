import {
  NgRedux,
  Comparator,
} from './components/ng-redux';
import {
  Selector,
  PathSelector,
  PropertySelector,
  FunctionSelector,
} from './components/selectors';
import { DevToolsExtension } from './components/dev-tools';
import { select, select$ } from './decorators/select';
import { dispatch } from './decorators/dispatch';
import { NgReduxModule } from './ng-redux.module';
import { BaseReduxAction } from './components/base-redux-action';
import { ReduxAction } from './decorators/redux-action.decorator';

// Warning: don't do this:
//  export * from './foo'
// ... because it breaks rollup. See
// https://github.com/rollup/rollup/wiki/Troubleshooting#name-is-not-exported-by-module
export {
  NgRedux,
  Selector,
  PathSelector,
  PropertySelector,
  FunctionSelector,
  Comparator,
  NgReduxModule,
  DevToolsExtension,
  select,
  select$,
  BaseReduxAction,
  ReduxAction,
  dispatch,
};
