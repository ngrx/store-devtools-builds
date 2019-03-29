/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable, Inject, ErrorHandler } from '@angular/core';
import { ActionsSubject, INITIAL_STATE, ReducerObservable, ScannedActionsSubject, } from '@ngrx/store';
import { merge, queueScheduler, ReplaySubject, } from 'rxjs';
import { map, observeOn, scan, skip, withLatestFrom } from 'rxjs/operators';
import * as Actions from './actions';
import { STORE_DEVTOOLS_CONFIG, StoreDevtoolsConfig } from './config';
import { DevtoolsExtension } from './extension';
import { liftInitialState, liftReducerWith } from './reducer';
import { liftAction, unliftState, shouldFilterActions, filterLiftedState, } from './utils';
import { DevtoolsDispatcher } from './devtools-dispatcher';
import { PERFORM_ACTION } from './actions';
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
            .pipe(withLatestFrom(liftedReducer$), scan((/**
         * @param {?} __0
         * @param {?} __1
         * @return {?}
         */
        ({ state: liftedState }, [action, reducer]) => {
            /** @type {?} */
            let reducedLiftedState = reducer(liftedState, action);
            // On full state update
            // If we have actions filters, we must filter completly our lifted state to be sync with the extension
            if (action.type !== PERFORM_ACTION && shouldFilterActions(config)) {
                reducedLiftedState = filterLiftedState(reducedLiftedState, config.predicate, config.actionsWhitelist, config.actionsBlacklist);
            }
            // Extension should be sent the sanitized lifted state
            extension.notify(action, reducedLiftedState);
            return { state: reducedLiftedState, action };
        }), { state: liftedInitialState, action: (/** @type {?} */ (null)) }))
            .subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ state, action }) => {
            liftedStateSubject.next(state);
            if (action.type === Actions.PERFORM_ACTION) {
                /** @type {?} */
                const unliftedAction = ((/** @type {?} */ (action))).action;
                scannedActions.next(unliftedAction);
            }
        }));
        /** @type {?} */
        const extensionStartSubscription = extension.start$.subscribe((/**
         * @return {?}
         */
        () => {
            this.refresh();
        }));
        /** @type {?} */
        const liftedState$ = (/** @type {?} */ (liftedStateSubject.asObservable()));
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
    /**
     * @type {?}
     * @private
     */
    StoreDevtools.prototype.stateSubscription;
    /**
     * @type {?}
     * @private
     */
    StoreDevtools.prototype.extensionStartSubscription;
    /** @type {?} */
    StoreDevtools.prototype.dispatcher;
    /** @type {?} */
    StoreDevtools.prototype.liftedState;
    /** @type {?} */
    StoreDevtools.prototype.state;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2dG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3N0b3JlLWRldnRvb2xzL3NyYy9kZXZ0b29scy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2pFLE9BQU8sRUFHTCxjQUFjLEVBQ2QsYUFBYSxFQUNiLGlCQUFpQixFQUNqQixxQkFBcUIsR0FDdEIsTUFBTSxhQUFhLENBQUM7QUFDckIsT0FBTyxFQUNMLEtBQUssRUFHTCxjQUFjLEVBQ2QsYUFBYSxHQUVkLE1BQU0sTUFBTSxDQUFDO0FBQ2QsT0FBTyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU1RSxPQUFPLEtBQUssT0FBTyxNQUFNLFdBQVcsQ0FBQztBQUNyQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDdEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ2hELE9BQU8sRUFBZSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDM0UsT0FBTyxFQUNMLFVBQVUsRUFDVixXQUFXLEVBQ1gsbUJBQW1CLEVBQ25CLGlCQUFpQixHQUNsQixNQUFNLFNBQVMsQ0FBQztBQUNqQixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBRzNDLE1BQU0sT0FBTyxhQUFhOzs7Ozs7Ozs7OztJQU94QixZQUNFLFVBQThCLEVBQzlCLFFBQXdCLEVBQ3hCLFNBQTRCLEVBQzVCLFNBQTRCLEVBQzVCLGNBQXFDLEVBQ3JDLFlBQTBCLEVBQ0gsWUFBaUIsRUFD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RXJyb3JIYW5kbGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBBY3Rpb24sXG4gIEFjdGlvblJlZHVjZXIsXG4gIEFjdGlvbnNTdWJqZWN0LFxuICBJTklUSUFMX1NUQVRFLFxuICBSZWR1Y2VyT2JzZXJ2YWJsZSxcbiAgU2Nhbm5lZEFjdGlvbnNTdWJqZWN0LFxufSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQge1xuICBtZXJnZSxcbiAgT2JzZXJ2YWJsZSxcbiAgT2JzZXJ2ZXIsXG4gIHF1ZXVlU2NoZWR1bGVyLFxuICBSZXBsYXlTdWJqZWN0LFxuICBTdWJzY3JpcHRpb24sXG59IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwLCBvYnNlcnZlT24sIHNjYW4sIHNraXAsIHdpdGhMYXRlc3RGcm9tIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgKiBhcyBBY3Rpb25zIGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgeyBTVE9SRV9ERVZUT09MU19DT05GSUcsIFN0b3JlRGV2dG9vbHNDb25maWcgfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgeyBEZXZ0b29sc0V4dGVuc2lvbiB9IGZyb20gJy4vZXh0ZW5zaW9uJztcbmltcG9ydCB7IExpZnRlZFN0YXRlLCBsaWZ0SW5pdGlhbFN0YXRlLCBsaWZ0UmVkdWNlcldpdGggfSBmcm9tICcuL3JlZHVjZXInO1xuaW1wb3J0IHtcbiAgbGlmdEFjdGlvbixcbiAgdW5saWZ0U3RhdGUsXG4gIHNob3VsZEZpbHRlckFjdGlvbnMsXG4gIGZpbHRlckxpZnRlZFN0YXRlLFxufSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IERldnRvb2xzRGlzcGF0Y2hlciB9IGZyb20gJy4vZGV2dG9vbHMtZGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBQRVJGT1JNX0FDVElPTiB9IGZyb20gJy4vYWN0aW9ucyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTdG9yZURldnRvb2xzIGltcGxlbWVudHMgT2JzZXJ2ZXI8YW55PiB7XG4gIHByaXZhdGUgc3RhdGVTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJpdmF0ZSBleHRlbnNpb25TdGFydFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwdWJsaWMgZGlzcGF0Y2hlcjogQWN0aW9uc1N1YmplY3Q7XG4gIHB1YmxpYyBsaWZ0ZWRTdGF0ZTogT2JzZXJ2YWJsZTxMaWZ0ZWRTdGF0ZT47XG4gIHB1YmxpYyBzdGF0ZTogT2JzZXJ2YWJsZTxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGRpc3BhdGNoZXI6IERldnRvb2xzRGlzcGF0Y2hlcixcbiAgICBhY3Rpb25zJDogQWN0aW9uc1N1YmplY3QsXG4gICAgcmVkdWNlcnMkOiBSZWR1Y2VyT2JzZXJ2YWJsZSxcbiAgICBleHRlbnNpb246IERldnRvb2xzRXh0ZW5zaW9uLFxuICAgIHNjYW5uZWRBY3Rpb25zOiBTY2FubmVkQWN0aW9uc1N1YmplY3QsXG4gICAgZXJyb3JIYW5kbGVyOiBFcnJvckhhbmRsZXIsXG4gICAgQEluamVjdChJTklUSUFMX1NUQVRFKSBpbml0aWFsU3RhdGU6IGFueSxcbiAgICBASW5qZWN0KFNUT1JFX0RFVlRPT0xTX0NPTkZJRykgY29uZmlnOiBTdG9yZURldnRvb2xzQ29uZmlnXG4gICkge1xuICAgIGNvbnN0IGxpZnRlZEluaXRpYWxTdGF0ZSA9IGxpZnRJbml0aWFsU3RhdGUoaW5pdGlhbFN0YXRlLCBjb25maWcubW9uaXRvcik7XG4gICAgY29uc3QgbGlmdFJlZHVjZXIgPSBsaWZ0UmVkdWNlcldpdGgoXG4gICAgICBpbml0aWFsU3RhdGUsXG4gICAgICBsaWZ0ZWRJbml0aWFsU3RhdGUsXG4gICAgICBlcnJvckhhbmRsZXIsXG4gICAgICBjb25maWcubW9uaXRvcixcbiAgICAgIGNvbmZpZ1xuICAgICk7XG5cbiAgICBjb25zdCBsaWZ0ZWRBY3Rpb24kID0gbWVyZ2UoXG4gICAgICBtZXJnZShhY3Rpb25zJC5hc09ic2VydmFibGUoKS5waXBlKHNraXAoMSkpLCBleHRlbnNpb24uYWN0aW9ucyQpLnBpcGUoXG4gICAgICAgIG1hcChsaWZ0QWN0aW9uKVxuICAgICAgKSxcbiAgICAgIGRpc3BhdGNoZXIsXG4gICAgICBleHRlbnNpb24ubGlmdGVkQWN0aW9ucyRcbiAgICApLnBpcGUob2JzZXJ2ZU9uKHF1ZXVlU2NoZWR1bGVyKSk7XG5cbiAgICBjb25zdCBsaWZ0ZWRSZWR1Y2VyJCA9IHJlZHVjZXJzJC5waXBlKG1hcChsaWZ0UmVkdWNlcikpO1xuXG4gICAgY29uc3QgbGlmdGVkU3RhdGVTdWJqZWN0ID0gbmV3IFJlcGxheVN1YmplY3Q8TGlmdGVkU3RhdGU+KDEpO1xuXG4gICAgY29uc3QgbGlmdGVkU3RhdGVTdWJzY3JpcHRpb24gPSBsaWZ0ZWRBY3Rpb24kXG4gICAgICAucGlwZShcbiAgICAgICAgd2l0aExhdGVzdEZyb20obGlmdGVkUmVkdWNlciQpLFxuICAgICAgICBzY2FuPFxuICAgICAgICAgIFthbnksIEFjdGlvblJlZHVjZXI8TGlmdGVkU3RhdGUsIEFjdGlvbnMuQWxsPl0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhdGU6IExpZnRlZFN0YXRlO1xuICAgICAgICAgICAgYWN0aW9uOiBhbnk7XG4gICAgICAgICAgfVxuICAgICAgICA+KFxuICAgICAgICAgICh7IHN0YXRlOiBsaWZ0ZWRTdGF0ZSB9LCBbYWN0aW9uLCByZWR1Y2VyXSkgPT4ge1xuICAgICAgICAgICAgbGV0IHJlZHVjZWRMaWZ0ZWRTdGF0ZSA9IHJlZHVjZXIobGlmdGVkU3RhdGUsIGFjdGlvbik7XG4gICAgICAgICAgICAvLyBPbiBmdWxsIHN0YXRlIHVwZGF0ZVxuICAgICAgICAgICAgLy8gSWYgd2UgaGF2ZSBhY3Rpb25zIGZpbHRlcnMsIHdlIG11c3QgZmlsdGVyIGNvbXBsZXRseSBvdXIgbGlmdGVkIHN0YXRlIHRvIGJlIHN5bmMgd2l0aCB0aGUgZXh0ZW5zaW9uXG4gICAgICAgICAgICBpZiAoYWN0aW9uLnR5cGUgIT09IFBFUkZPUk1fQUNUSU9OICYmIHNob3VsZEZpbHRlckFjdGlvbnMoY29uZmlnKSkge1xuICAgICAgICAgICAgICByZWR1Y2VkTGlmdGVkU3RhdGUgPSBmaWx0ZXJMaWZ0ZWRTdGF0ZShcbiAgICAgICAgICAgICAgICByZWR1Y2VkTGlmdGVkU3RhdGUsXG4gICAgICAgICAgICAgICAgY29uZmlnLnByZWRpY2F0ZSxcbiAgICAgICAgICAgICAgICBjb25maWcuYWN0aW9uc1doaXRlbGlzdCxcbiAgICAgICAgICAgICAgICBjb25maWcuYWN0aW9uc0JsYWNrbGlzdFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRXh0ZW5zaW9uIHNob3VsZCBiZSBzZW50IHRoZSBzYW5pdGl6ZWQgbGlmdGVkIHN0YXRlXG4gICAgICAgICAgICBleHRlbnNpb24ubm90aWZ5KGFjdGlvbiwgcmVkdWNlZExpZnRlZFN0YXRlKTtcbiAgICAgICAgICAgIHJldHVybiB7IHN0YXRlOiByZWR1Y2VkTGlmdGVkU3RhdGUsIGFjdGlvbiB9O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgeyBzdGF0ZTogbGlmdGVkSW5pdGlhbFN0YXRlLCBhY3Rpb246IG51bGwgYXMgYW55IH1cbiAgICAgICAgKVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoeyBzdGF0ZSwgYWN0aW9uIH0pID0+IHtcbiAgICAgICAgbGlmdGVkU3RhdGVTdWJqZWN0Lm5leHQoc3RhdGUpO1xuXG4gICAgICAgIGlmIChhY3Rpb24udHlwZSA9PT0gQWN0aW9ucy5QRVJGT1JNX0FDVElPTikge1xuICAgICAgICAgIGNvbnN0IHVubGlmdGVkQWN0aW9uID0gKGFjdGlvbiBhcyBBY3Rpb25zLlBlcmZvcm1BY3Rpb24pLmFjdGlvbjtcblxuICAgICAgICAgIHNjYW5uZWRBY3Rpb25zLm5leHQodW5saWZ0ZWRBY3Rpb24pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIGNvbnN0IGV4dGVuc2lvblN0YXJ0U3Vic2NyaXB0aW9uID0gZXh0ZW5zaW9uLnN0YXJ0JC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBsaWZ0ZWRTdGF0ZSQgPSBsaWZ0ZWRTdGF0ZVN1YmplY3QuYXNPYnNlcnZhYmxlKCkgYXMgT2JzZXJ2YWJsZTxcbiAgICAgIExpZnRlZFN0YXRlXG4gICAgPjtcbiAgICBjb25zdCBzdGF0ZSQgPSBsaWZ0ZWRTdGF0ZSQucGlwZShtYXAodW5saWZ0U3RhdGUpKTtcblxuICAgIHRoaXMuZXh0ZW5zaW9uU3RhcnRTdWJzY3JpcHRpb24gPSBleHRlbnNpb25TdGFydFN1YnNjcmlwdGlvbjtcbiAgICB0aGlzLnN0YXRlU3Vic2NyaXB0aW9uID0gbGlmdGVkU3RhdGVTdWJzY3JpcHRpb247XG4gICAgdGhpcy5kaXNwYXRjaGVyID0gZGlzcGF0Y2hlcjtcbiAgICB0aGlzLmxpZnRlZFN0YXRlID0gbGlmdGVkU3RhdGUkO1xuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZSQ7XG4gIH1cblxuICBkaXNwYXRjaChhY3Rpb246IEFjdGlvbikge1xuICAgIHRoaXMuZGlzcGF0Y2hlci5uZXh0KGFjdGlvbik7XG4gIH1cblxuICBuZXh0KGFjdGlvbjogYW55KSB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLm5leHQoYWN0aW9uKTtcbiAgfVxuXG4gIGVycm9yKGVycm9yOiBhbnkpIHt9XG5cbiAgY29tcGxldGUoKSB7fVxuXG4gIHBlcmZvcm1BY3Rpb24oYWN0aW9uOiBhbnkpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLlBlcmZvcm1BY3Rpb24oYWN0aW9uLCArRGF0ZS5ub3coKSkpO1xuICB9XG5cbiAgcmVmcmVzaCgpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLlJlZnJlc2goKSk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLlJlc2V0KCtEYXRlLm5vdygpKSk7XG4gIH1cblxuICByb2xsYmFjaygpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLlJvbGxiYWNrKCtEYXRlLm5vdygpKSk7XG4gIH1cblxuICBjb21taXQoKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5Db21taXQoK0RhdGUubm93KCkpKTtcbiAgfVxuXG4gIHN3ZWVwKCkge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuU3dlZXAoKSk7XG4gIH1cblxuICB0b2dnbGVBY3Rpb24oaWQ6IG51bWJlcikge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuVG9nZ2xlQWN0aW9uKGlkKSk7XG4gIH1cblxuICBqdW1wVG9BY3Rpb24oYWN0aW9uSWQ6IG51bWJlcikge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuSnVtcFRvQWN0aW9uKGFjdGlvbklkKSk7XG4gIH1cblxuICBqdW1wVG9TdGF0ZShpbmRleDogbnVtYmVyKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5KdW1wVG9TdGF0ZShpbmRleCkpO1xuICB9XG5cbiAgaW1wb3J0U3RhdGUobmV4dExpZnRlZFN0YXRlOiBhbnkpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLkltcG9ydFN0YXRlKG5leHRMaWZ0ZWRTdGF0ZSkpO1xuICB9XG5cbiAgbG9ja0NoYW5nZXMoc3RhdHVzOiBib29sZWFuKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5Mb2NrQ2hhbmdlcyhzdGF0dXMpKTtcbiAgfVxuXG4gIHBhdXNlUmVjb3JkaW5nKHN0YXR1czogYm9vbGVhbikge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuUGF1c2VSZWNvcmRpbmcoc3RhdHVzKSk7XG4gIH1cbn1cbiJdfQ==