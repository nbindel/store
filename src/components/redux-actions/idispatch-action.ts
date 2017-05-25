import { Action } from 'redux';

export interface IDispatchAction extends Action 
{
  payload: any;
}