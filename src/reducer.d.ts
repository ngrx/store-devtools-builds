import { ErrorHandler } from '@angular/core';
import { Action, ActionReducer, UPDATE, INIT } from '@ngrx/store';
import * as DevtoolsActions from './actions';
import { StoreDevtoolsConfig } from './config';
export declare type InitAction = {
    readonly type: typeof INIT;
};
export declare type UpdateReducerAction = {
    readonly type: typeof UPDATE;
};
export declare type CoreActions = InitAction | UpdateReducerAction;
export declare type Actions = DevtoolsActions.All | CoreActions;
export declare const INIT_ACTION: {
    type: "@ngrx/store/init";
};
export interface ComputedState {
    state: any;
    error: any;
}
export interface LiftedAction {
    type: string;
    action: Action;
}
export interface LiftedActions {
    [id: number]: LiftedAction;
}
export interface LiftedState {
    monitorState: any;
    nextActionId: number;
    actionsById: LiftedActions;
    stagedActionIds: number[];
    skippedActionIds: number[];
    committedState: any;
    currentStateIndex: number;
    computedStates: ComputedState[];
    isLocked: boolean;
    isPaused: boolean;
}
export declare function liftInitialState(initialCommittedState?: any, monitorReducer?: any): LiftedState;
/**
 * Creates a history state reducer from an app's reducer.
 */
export declare function liftReducerWith(initialCommittedState: any, initialLiftedState: LiftedState, errorHandler: ErrorHandler, monitorReducer?: any, options?: Partial<StoreDevtoolsConfig>): (reducer: ActionReducer<any, any>) => ActionReducer<LiftedState, Actions>;
