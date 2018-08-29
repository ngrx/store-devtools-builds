/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable, Inject, ErrorHandler } from '@angular/core';
import { ActionsSubject, INITIAL_STATE, ReducerObservable, ScannedActionsSubject, } from '@ngrx/store';
import { merge, queueScheduler, ReplaySubject, } from 'rxjs';
import { map, observeOn, scan, skip, withLatestFrom } from 'rxjs/operators';
import * as Actions from './actions';
import { STORE_DEVTOOLS_CONFIG, StoreDevtoolsConfig } from './config';
import { DevtoolsExtension } from './extension';
import { liftInitialState, liftReducerWith } from './reducer';
import { liftAction, unliftState } from './utils';
import { DevtoolsDispatcher } from './devtools-dispatcher';
export class StoreDevtools {
    /**
     * @param {?} dispatcher
     * @param {?} actions$
     * @param {?} reducers$
     * @param {?} extension
     * @param {?} scannedActions
     * @param {?} errorHandler
     * @param {?} initialState
     * @param {?} config
     */
    constructor(dispatcher, actions$, reducers$, extension, scannedActions, errorHandler, initialState, config) {
        /** @type {?} */
        const liftedInitialState = liftInitialState(initialState, config.monitor);
        /** @type {?} */
        const liftReducer = liftReducerWith(initialState, liftedInitialState, errorHandler, config.monitor, config);
        /** @type {?} */
        const liftedAction$ = merge(merge(actions$.asObservable().pipe(skip(1)), extension.actions$).pipe(map(liftAction)), dispatcher, extension.liftedActions$).pipe(observeOn(queueScheduler));
        /** @type {?} */
        const liftedReducer$ = reducers$.pipe(map(liftReducer));
        /** @type {?} */
        const liftedStateSubject = new ReplaySubject(1);
        /** @type {?} */
        const liftedStateSubscription = liftedAction$
            .pipe(withLatestFrom(liftedReducer$), scan(({ state: liftedState }, [action, reducer]) => {
            /** @type {?} */
            const reducedLiftedState = reducer(liftedState, action);
            // // Extension should be sent the sanitized lifted state
            extension.notify(action, reducedLiftedState);
            return { state: reducedLiftedState, action };
        }, { state: liftedInitialState, action: /** @type {?} */ (null) }))
            .subscribe(({ state, action }) => {
            liftedStateSubject.next(state);
            if (action.type === Actions.PERFORM_ACTION) {
                /** @type {?} */
                const unliftedAction = (/** @type {?} */ (action)).action;
                scannedActions.next(unliftedAction);
            }
        });
        /** @type {?} */
        const extensionStartSubscription = extension.start$.subscribe(() => {
            this.refresh();
        });
        /** @type {?} */
        const liftedState$ = /** @type {?} */ (liftedStateSubject.asObservable());
        /** @type {?} */
        const state$ = liftedState$.pipe(map(unliftState));
        this.extensionStartSubscription = extensionStartSubscription;
        this.stateSubscription = liftedStateSubscription;
        this.dispatcher = dispatcher;
        this.liftedState = liftedState$;
        this.state = state$;
    }
    /**
     * @param {?} action
     * @return {?}
     */
    dispatch(action) {
        this.dispatcher.next(action);
    }
    /**
     * @param {?} action
     * @return {?}
     */
    next(action) {
        this.dispatcher.next(action);
    }
    /**
     * @param {?} error
     * @return {?}
     */
    error(error) { }
    /**
     * @return {?}
     */
    complete() { }
    /**
     * @param {?} action
     * @return {?}
     */
    performAction(action) {
        this.dispatch(new Actions.PerformAction(action, +Date.now()));
    }
    /**
     * @return {?}
     */
    refresh() {
        this.dispatch(new Actions.Refresh());
    }
    /**
     * @return {?}
     */
    reset() {
        this.dispatch(new Actions.Reset(+Date.now()));
    }
    /**
     * @return {?}
     */
    rollback() {
        this.dispatch(new Actions.Rollback(+Date.now()));
    }
    /**
     * @return {?}
     */
    commit() {
        this.dispatch(new Actions.Commit(+Date.now()));
    }
    /**
     * @return {?}
     */
    sweep() {
        this.dispatch(new Actions.Sweep());
    }
    /**
     * @param {?} id
     * @return {?}
     */
    toggleAction(id) {
        this.dispatch(new Actions.ToggleAction(id));
    }
    /**
     * @param {?} actionId
     * @return {?}
     */
    jumpToAction(actionId) {
        this.dispatch(new Actions.JumpToAction(actionId));
    }
    /**
     * @param {?} index
     * @return {?}
     */
    jumpToState(index) {
        this.dispatch(new Actions.JumpToState(index));
    }
    /**
     * @param {?} nextLiftedState
     * @return {?}
     */
    importState(nextLiftedState) {
        this.dispatch(new Actions.ImportState(nextLiftedState));
    }
    /**
     * @param {?} status
     * @return {?}
     */
    lockChanges(status) {
        this.dispatch(new Actions.LockChanges(status));
    }
    /**
     * @param {?} status
     * @return {?}
     */
    pauseRecording(status) {
        this.dispatch(new Actions.PauseRecording(status));
    }
}
StoreDevtools.decorators = [
    { type: Injectable }
];
/** @nocollapse */
StoreDevtools.ctorParameters = () => [
    { type: DevtoolsDispatcher },
    { type: ActionsSubject },
    { type: ReducerObservable },
    { type: DevtoolsExtension },
    { type: ScannedActionsSubject },
    { type: ErrorHandler },
    { type: undefined, decorators: [{ type: Inject, args: [INITIAL_STATE,] }] },
    { type: StoreDevtoolsConfig, decorators: [{ type: Inject, args: [STORE_DEVTOOLS_CONFIG,] }] }
];
if (false) {
    /** @type {?} */
    StoreDevtools.prototype.stateSubscription;
    /** @type {?} */
    StoreDevtools.prototype.extensionStartSubscription;
    /** @type {?} */
    StoreDevtools.prototype.dispatcher;
    /** @type {?} */
    StoreDevtools.prototype.liftedState;
    /** @type {?} */
    StoreDevtools.prototype.state;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2dG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3N0b3JlLWRldnRvb2xzL3NyYy9kZXZ0b29scy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2pFLE9BQU8sRUFHTCxjQUFjLEVBQ2QsYUFBYSxFQUNiLGlCQUFpQixFQUNqQixxQkFBcUIsR0FDdEIsTUFBTSxhQUFhLENBQUM7QUFDckIsT0FBTyxFQUNMLEtBQUssRUFHTCxjQUFjLEVBQ2QsYUFBYSxHQUVkLE1BQU0sTUFBTSxDQUFDO0FBQ2QsT0FBTyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU1RSxPQUFPLEtBQUssT0FBTyxNQUFNLFdBQVcsQ0FBQztBQUNyQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDdEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ2hELE9BQU8sRUFBZSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDM0UsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDbEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFHM0QsTUFBTTs7Ozs7Ozs7Ozs7SUFPSixZQUNFLFVBQThCLEVBQzlCLFFBQXdCLEVBQ3hCLFNBQTRCLEVBQzVCLFNBQTRCLEVBQzVCLGNBQXFDLEVBQ3JDLFlBQTBCLEVBQ0gsWUFBaUIsRUFDVCxNQUEyQjs7UUFFMUQsTUFBTSxrQkFBa0IsR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztRQUMxRSxNQUFNLFdBQVcsR0FBRyxlQUFlLENBQ2pDLFlBQVksRUFDWixrQkFBa0IsRUFDbEIsWUFBWSxFQUNaLE1BQU0sQ0FBQyxPQUFPLEVBQ2QsTUFBTSxDQUNQLENBQUM7O1FBRUYsTUFBTSxhQUFhLEdBQUcsS0FBSyxDQUN6QixLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUNuRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQ2hCLEVBQ0QsVUFBVSxFQUNWLFNBQVMsQ0FBQyxjQUFjLENBQ3pCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDOztRQUVsQyxNQUFNLGNBQWMsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDOztRQUV4RCxNQUFNLGtCQUFrQixHQUFHLElBQUksYUFBYSxDQUFjLENBQUMsQ0FBQyxDQUFDOztRQUU3RCxNQUFNLHVCQUF1QixHQUFHLGFBQWE7YUFDMUMsSUFBSSxDQUNILGNBQWMsQ0FBQyxjQUFjLENBQUMsRUFDOUIsSUFBSSxDQU9GLENBQUMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLEVBQUUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLEVBQUUsRUFBRTs7WUFDNUMsTUFBTSxrQkFBa0IsR0FBRyxPQUFPLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDOztZQUd4RCxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1lBRTdDLE9BQU8sRUFBRSxLQUFLLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxFQUFFLENBQUM7U0FDOUMsRUFDRCxFQUFFLEtBQUssRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG9CQUFFLElBQVcsQ0FBQSxFQUFFLENBQ25ELENBQ0Y7YUFDQSxTQUFTLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFO1lBQy9CLGtCQUFrQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUUvQixJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLGNBQWMsRUFBRTs7Z0JBQzFDLE1BQU0sY0FBYyxHQUFHLG1CQUFDLE1BQStCLEVBQUMsQ0FBQyxNQUFNLENBQUM7Z0JBRWhFLGNBQWMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7YUFDckM7U0FDRixDQUFDLENBQUM7O1FBRUwsTUFBTSwwQkFBMEIsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDakUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ2hCLENBQUMsQ0FBQzs7UUFFSCxNQUFNLFlBQVkscUJBQUcsa0JBQWtCLENBQUMsWUFBWSxFQUVuRCxFQUFDOztRQUNGLE1BQU0sTUFBTSxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFFbkQsSUFBSSxDQUFDLDBCQUEwQixHQUFHLDBCQUEwQixDQUFDO1FBQzdELElBQUksQ0FBQyxpQkFBaUIsR0FBRyx1QkFBdUIsQ0FBQztRQUNqRCxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsV0FBVyxHQUFHLFlBQVksQ0FBQztRQUNoQyxJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztLQUNyQjs7Ozs7SUFFRCxRQUFRLENBQUMsTUFBYztRQUNyQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUM5Qjs7Ozs7SUFFRCxJQUFJLENBQUMsTUFBVztRQUNkLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzlCOzs7OztJQUVELEtBQUssQ0FBQyxLQUFVLEtBQUk7Ozs7SUFFcEIsUUFBUSxNQUFLOzs7OztJQUViLGFBQWEsQ0FBQyxNQUFXO1FBQ3ZCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxPQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDL0Q7Ozs7SUFFRCxPQUFPO1FBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0tBQ3RDOzs7O0lBRUQsS0FBSztRQUNILElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUMvQzs7OztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDbEQ7Ozs7SUFFRCxNQUFNO1FBQ0osSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ2hEOzs7O0lBRUQsS0FBSztRQUNILElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztLQUNwQzs7Ozs7SUFFRCxZQUFZLENBQUMsRUFBVTtRQUNyQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzdDOzs7OztJQUVELFlBQVksQ0FBQyxRQUFnQjtRQUMzQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksT0FBTyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0tBQ25EOzs7OztJQUVELFdBQVcsQ0FBQyxLQUFhO1FBQ3ZCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7S0FDL0M7Ozs7O0lBRUQsV0FBVyxDQUFDLGVBQW9CO1FBQzlCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7S0FDekQ7Ozs7O0lBRUQsV0FBVyxDQUFDLE1BQWU7UUFDekIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUNoRDs7Ozs7SUFFRCxjQUFjLENBQUMsTUFBZTtRQUM1QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0tBQ25EOzs7WUFoSkYsVUFBVTs7OztZQUZGLGtCQUFrQjtZQXBCekIsY0FBYztZQUVkLGlCQUFpQjtZQWVWLGlCQUFpQjtZQWR4QixxQkFBcUI7WUFQTSxZQUFZOzRDQXlDcEMsTUFBTSxTQUFDLGFBQWE7WUFyQk8sbUJBQW1CLHVCQXNCOUMsTUFBTSxTQUFDLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdCwgRXJyb3JIYW5kbGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBBY3Rpb24sXG4gIEFjdGlvblJlZHVjZXIsXG4gIEFjdGlvbnNTdWJqZWN0LFxuICBJTklUSUFMX1NUQVRFLFxuICBSZWR1Y2VyT2JzZXJ2YWJsZSxcbiAgU2Nhbm5lZEFjdGlvbnNTdWJqZWN0LFxufSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQge1xuICBtZXJnZSxcbiAgT2JzZXJ2YWJsZSxcbiAgT2JzZXJ2ZXIsXG4gIHF1ZXVlU2NoZWR1bGVyLFxuICBSZXBsYXlTdWJqZWN0LFxuICBTdWJzY3JpcHRpb24sXG59IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwLCBvYnNlcnZlT24sIHNjYW4sIHNraXAsIHdpdGhMYXRlc3RGcm9tIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgKiBhcyBBY3Rpb25zIGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgeyBTVE9SRV9ERVZUT09MU19DT05GSUcsIFN0b3JlRGV2dG9vbHNDb25maWcgfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgeyBEZXZ0b29sc0V4dGVuc2lvbiB9IGZyb20gJy4vZXh0ZW5zaW9uJztcbmltcG9ydCB7IExpZnRlZFN0YXRlLCBsaWZ0SW5pdGlhbFN0YXRlLCBsaWZ0UmVkdWNlcldpdGggfSBmcm9tICcuL3JlZHVjZXInO1xuaW1wb3J0IHsgbGlmdEFjdGlvbiwgdW5saWZ0U3RhdGUgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IERldnRvb2xzRGlzcGF0Y2hlciB9IGZyb20gJy4vZGV2dG9vbHMtZGlzcGF0Y2hlcic7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTdG9yZURldnRvb2xzIGltcGxlbWVudHMgT2JzZXJ2ZXI8YW55PiB7XG4gIHByaXZhdGUgc3RhdGVTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJpdmF0ZSBleHRlbnNpb25TdGFydFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwdWJsaWMgZGlzcGF0Y2hlcjogQWN0aW9uc1N1YmplY3Q7XG4gIHB1YmxpYyBsaWZ0ZWRTdGF0ZTogT2JzZXJ2YWJsZTxMaWZ0ZWRTdGF0ZT47XG4gIHB1YmxpYyBzdGF0ZTogT2JzZXJ2YWJsZTxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGRpc3BhdGNoZXI6IERldnRvb2xzRGlzcGF0Y2hlcixcbiAgICBhY3Rpb25zJDogQWN0aW9uc1N1YmplY3QsXG4gICAgcmVkdWNlcnMkOiBSZWR1Y2VyT2JzZXJ2YWJsZSxcbiAgICBleHRlbnNpb246IERldnRvb2xzRXh0ZW5zaW9uLFxuICAgIHNjYW5uZWRBY3Rpb25zOiBTY2FubmVkQWN0aW9uc1N1YmplY3QsXG4gICAgZXJyb3JIYW5kbGVyOiBFcnJvckhhbmRsZXIsXG4gICAgQEluamVjdChJTklUSUFMX1NUQVRFKSBpbml0aWFsU3RhdGU6IGFueSxcbiAgICBASW5qZWN0KFNUT1JFX0RFVlRPT0xTX0NPTkZJRykgY29uZmlnOiBTdG9yZURldnRvb2xzQ29uZmlnXG4gICkge1xuICAgIGNvbnN0IGxpZnRlZEluaXRpYWxTdGF0ZSA9IGxpZnRJbml0aWFsU3RhdGUoaW5pdGlhbFN0YXRlLCBjb25maWcubW9uaXRvcik7XG4gICAgY29uc3QgbGlmdFJlZHVjZXIgPSBsaWZ0UmVkdWNlcldpdGgoXG4gICAgICBpbml0aWFsU3RhdGUsXG4gICAgICBsaWZ0ZWRJbml0aWFsU3RhdGUsXG4gICAgICBlcnJvckhhbmRsZXIsXG4gICAgICBjb25maWcubW9uaXRvcixcbiAgICAgIGNvbmZpZ1xuICAgICk7XG5cbiAgICBjb25zdCBsaWZ0ZWRBY3Rpb24kID0gbWVyZ2UoXG4gICAgICBtZXJnZShhY3Rpb25zJC5hc09ic2VydmFibGUoKS5waXBlKHNraXAoMSkpLCBleHRlbnNpb24uYWN0aW9ucyQpLnBpcGUoXG4gICAgICAgIG1hcChsaWZ0QWN0aW9uKVxuICAgICAgKSxcbiAgICAgIGRpc3BhdGNoZXIsXG4gICAgICBleHRlbnNpb24ubGlmdGVkQWN0aW9ucyRcbiAgICApLnBpcGUob2JzZXJ2ZU9uKHF1ZXVlU2NoZWR1bGVyKSk7XG5cbiAgICBjb25zdCBsaWZ0ZWRSZWR1Y2VyJCA9IHJlZHVjZXJzJC5waXBlKG1hcChsaWZ0UmVkdWNlcikpO1xuXG4gICAgY29uc3QgbGlmdGVkU3RhdGVTdWJqZWN0ID0gbmV3IFJlcGxheVN1YmplY3Q8TGlmdGVkU3RhdGU+KDEpO1xuXG4gICAgY29uc3QgbGlmdGVkU3RhdGVTdWJzY3JpcHRpb24gPSBsaWZ0ZWRBY3Rpb24kXG4gICAgICAucGlwZShcbiAgICAgICAgd2l0aExhdGVzdEZyb20obGlmdGVkUmVkdWNlciQpLFxuICAgICAgICBzY2FuPFxuICAgICAgICAgIFthbnksIEFjdGlvblJlZHVjZXI8TGlmdGVkU3RhdGUsIEFjdGlvbnMuQWxsPl0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhdGU6IExpZnRlZFN0YXRlO1xuICAgICAgICAgICAgYWN0aW9uOiBhbnk7XG4gICAgICAgICAgfVxuICAgICAgICA+KFxuICAgICAgICAgICh7IHN0YXRlOiBsaWZ0ZWRTdGF0ZSB9LCBbYWN0aW9uLCByZWR1Y2VyXSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVkdWNlZExpZnRlZFN0YXRlID0gcmVkdWNlcihsaWZ0ZWRTdGF0ZSwgYWN0aW9uKTtcblxuICAgICAgICAgICAgLy8gLy8gRXh0ZW5zaW9uIHNob3VsZCBiZSBzZW50IHRoZSBzYW5pdGl6ZWQgbGlmdGVkIHN0YXRlXG4gICAgICAgICAgICBleHRlbnNpb24ubm90aWZ5KGFjdGlvbiwgcmVkdWNlZExpZnRlZFN0YXRlKTtcblxuICAgICAgICAgICAgcmV0dXJuIHsgc3RhdGU6IHJlZHVjZWRMaWZ0ZWRTdGF0ZSwgYWN0aW9uIH07XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IHN0YXRlOiBsaWZ0ZWRJbml0aWFsU3RhdGUsIGFjdGlvbjogbnVsbCBhcyBhbnkgfVxuICAgICAgICApXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKCh7IHN0YXRlLCBhY3Rpb24gfSkgPT4ge1xuICAgICAgICBsaWZ0ZWRTdGF0ZVN1YmplY3QubmV4dChzdGF0ZSk7XG5cbiAgICAgICAgaWYgKGFjdGlvbi50eXBlID09PSBBY3Rpb25zLlBFUkZPUk1fQUNUSU9OKSB7XG4gICAgICAgICAgY29uc3QgdW5saWZ0ZWRBY3Rpb24gPSAoYWN0aW9uIGFzIEFjdGlvbnMuUGVyZm9ybUFjdGlvbikuYWN0aW9uO1xuXG4gICAgICAgICAgc2Nhbm5lZEFjdGlvbnMubmV4dCh1bmxpZnRlZEFjdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgY29uc3QgZXh0ZW5zaW9uU3RhcnRTdWJzY3JpcHRpb24gPSBleHRlbnNpb24uc3RhcnQkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnJlZnJlc2goKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGxpZnRlZFN0YXRlJCA9IGxpZnRlZFN0YXRlU3ViamVjdC5hc09ic2VydmFibGUoKSBhcyBPYnNlcnZhYmxlPFxuICAgICAgTGlmdGVkU3RhdGVcbiAgICA+O1xuICAgIGNvbnN0IHN0YXRlJCA9IGxpZnRlZFN0YXRlJC5waXBlKG1hcCh1bmxpZnRTdGF0ZSkpO1xuXG4gICAgdGhpcy5leHRlbnNpb25TdGFydFN1YnNjcmlwdGlvbiA9IGV4dGVuc2lvblN0YXJ0U3Vic2NyaXB0aW9uO1xuICAgIHRoaXMuc3RhdGVTdWJzY3JpcHRpb24gPSBsaWZ0ZWRTdGF0ZVN1YnNjcmlwdGlvbjtcbiAgICB0aGlzLmRpc3BhdGNoZXIgPSBkaXNwYXRjaGVyO1xuICAgIHRoaXMubGlmdGVkU3RhdGUgPSBsaWZ0ZWRTdGF0ZSQ7XG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlJDtcbiAgfVxuXG4gIGRpc3BhdGNoKGFjdGlvbjogQWN0aW9uKSB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLm5leHQoYWN0aW9uKTtcbiAgfVxuXG4gIG5leHQoYWN0aW9uOiBhbnkpIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIubmV4dChhY3Rpb24pO1xuICB9XG5cbiAgZXJyb3IoZXJyb3I6IGFueSkge31cblxuICBjb21wbGV0ZSgpIHt9XG5cbiAgcGVyZm9ybUFjdGlvbihhY3Rpb246IGFueSkge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuUGVyZm9ybUFjdGlvbihhY3Rpb24sICtEYXRlLm5vdygpKSk7XG4gIH1cblxuICByZWZyZXNoKCkge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuUmVmcmVzaCgpKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuUmVzZXQoK0RhdGUubm93KCkpKTtcbiAgfVxuXG4gIHJvbGxiYWNrKCkge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuUm9sbGJhY2soK0RhdGUubm93KCkpKTtcbiAgfVxuXG4gIGNvbW1pdCgpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLkNvbW1pdCgrRGF0ZS5ub3coKSkpO1xuICB9XG5cbiAgc3dlZXAoKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5Td2VlcCgpKTtcbiAgfVxuXG4gIHRvZ2dsZUFjdGlvbihpZDogbnVtYmVyKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5Ub2dnbGVBY3Rpb24oaWQpKTtcbiAgfVxuXG4gIGp1bXBUb0FjdGlvbihhY3Rpb25JZDogbnVtYmVyKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5KdW1wVG9BY3Rpb24oYWN0aW9uSWQpKTtcbiAgfVxuXG4gIGp1bXBUb1N0YXRlKGluZGV4OiBudW1iZXIpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLkp1bXBUb1N0YXRlKGluZGV4KSk7XG4gIH1cblxuICBpbXBvcnRTdGF0ZShuZXh0TGlmdGVkU3RhdGU6IGFueSkge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuSW1wb3J0U3RhdGUobmV4dExpZnRlZFN0YXRlKSk7XG4gIH1cblxuICBsb2NrQ2hhbmdlcyhzdGF0dXM6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLkxvY2tDaGFuZ2VzKHN0YXR1cykpO1xuICB9XG5cbiAgcGF1c2VSZWNvcmRpbmcoc3RhdHVzOiBib29sZWFuKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5QYXVzZVJlY29yZGluZyhzdGF0dXMpKTtcbiAgfVxufVxuIl19