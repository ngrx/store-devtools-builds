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
                reducedLiftedState = filterLiftedState(reducedLiftedState, config.predicate, config.actionsSafelist, config.actionsBlocklist);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2dG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3N0b3JlLWRldnRvb2xzL3NyYy9kZXZ0b29scy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2pFLE9BQU8sRUFHTCxjQUFjLEVBQ2QsYUFBYSxFQUNiLGlCQUFpQixFQUNqQixxQkFBcUIsR0FDdEIsTUFBTSxhQUFhLENBQUM7QUFDckIsT0FBTyxFQUNMLEtBQUssRUFHTCxjQUFjLEVBQ2QsYUFBYSxHQUVkLE1BQU0sTUFBTSxDQUFDO0FBQ2QsT0FBTyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU1RSxPQUFPLEtBQUssT0FBTyxNQUFNLFdBQVcsQ0FBQztBQUNyQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDdEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ2hELE9BQU8sRUFBZSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDM0UsT0FBTyxFQUNMLFVBQVUsRUFDVixXQUFXLEVBQ1gsbUJBQW1CLEVBQ25CLGlCQUFpQixHQUNsQixNQUFNLFNBQVMsQ0FBQztBQUNqQixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBRzNDLE1BQU0sT0FBTyxhQUFhOzs7Ozs7Ozs7OztJQU94QixZQUNFLFVBQThCLEVBQzlCLFFBQXdCLEVBQ3hCLFNBQTRCLEVBQzVCLFNBQTRCLEVBQzVCLGNBQXFDLEVBQ3JDLFlBQTBCLEVBQ0gsWUFBaUIsRUFD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cm9ySGFuZGxlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQWN0aW9uLFxuICBBY3Rpb25SZWR1Y2VyLFxuICBBY3Rpb25zU3ViamVjdCxcbiAgSU5JVElBTF9TVEFURSxcbiAgUmVkdWNlck9ic2VydmFibGUsXG4gIFNjYW5uZWRBY3Rpb25zU3ViamVjdCxcbn0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHtcbiAgbWVyZ2UsXG4gIE9ic2VydmFibGUsXG4gIE9ic2VydmVyLFxuICBxdWV1ZVNjaGVkdWxlcixcbiAgUmVwbGF5U3ViamVjdCxcbiAgU3Vic2NyaXB0aW9uLFxufSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG1hcCwgb2JzZXJ2ZU9uLCBzY2FuLCBza2lwLCB3aXRoTGF0ZXN0RnJvbSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0ICogYXMgQWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHsgU1RPUkVfREVWVE9PTFNfQ09ORklHLCBTdG9yZURldnRvb2xzQ29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgRGV2dG9vbHNFeHRlbnNpb24gfSBmcm9tICcuL2V4dGVuc2lvbic7XG5pbXBvcnQgeyBMaWZ0ZWRTdGF0ZSwgbGlmdEluaXRpYWxTdGF0ZSwgbGlmdFJlZHVjZXJXaXRoIH0gZnJvbSAnLi9yZWR1Y2VyJztcbmltcG9ydCB7XG4gIGxpZnRBY3Rpb24sXG4gIHVubGlmdFN0YXRlLFxuICBzaG91bGRGaWx0ZXJBY3Rpb25zLFxuICBmaWx0ZXJMaWZ0ZWRTdGF0ZSxcbn0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBEZXZ0b29sc0Rpc3BhdGNoZXIgfSBmcm9tICcuL2RldnRvb2xzLWRpc3BhdGNoZXInO1xuaW1wb3J0IHsgUEVSRk9STV9BQ1RJT04gfSBmcm9tICcuL2FjdGlvbnMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RvcmVEZXZ0b29scyBpbXBsZW1lbnRzIE9ic2VydmVyPGFueT4ge1xuICBwcml2YXRlIHN0YXRlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgZXh0ZW5zaW9uU3RhcnRTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHVibGljIGRpc3BhdGNoZXI6IEFjdGlvbnNTdWJqZWN0O1xuICBwdWJsaWMgbGlmdGVkU3RhdGU6IE9ic2VydmFibGU8TGlmdGVkU3RhdGU+O1xuICBwdWJsaWMgc3RhdGU6IE9ic2VydmFibGU8YW55PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBkaXNwYXRjaGVyOiBEZXZ0b29sc0Rpc3BhdGNoZXIsXG4gICAgYWN0aW9ucyQ6IEFjdGlvbnNTdWJqZWN0LFxuICAgIHJlZHVjZXJzJDogUmVkdWNlck9ic2VydmFibGUsXG4gICAgZXh0ZW5zaW9uOiBEZXZ0b29sc0V4dGVuc2lvbixcbiAgICBzY2FubmVkQWN0aW9uczogU2Nhbm5lZEFjdGlvbnNTdWJqZWN0LFxuICAgIGVycm9ySGFuZGxlcjogRXJyb3JIYW5kbGVyLFxuICAgIEBJbmplY3QoSU5JVElBTF9TVEFURSkgaW5pdGlhbFN0YXRlOiBhbnksXG4gICAgQEluamVjdChTVE9SRV9ERVZUT09MU19DT05GSUcpIGNvbmZpZzogU3RvcmVEZXZ0b29sc0NvbmZpZ1xuICApIHtcbiAgICBjb25zdCBsaWZ0ZWRJbml0aWFsU3RhdGUgPSBsaWZ0SW5pdGlhbFN0YXRlKGluaXRpYWxTdGF0ZSwgY29uZmlnLm1vbml0b3IpO1xuICAgIGNvbnN0IGxpZnRSZWR1Y2VyID0gbGlmdFJlZHVjZXJXaXRoKFxuICAgICAgaW5pdGlhbFN0YXRlLFxuICAgICAgbGlmdGVkSW5pdGlhbFN0YXRlLFxuICAgICAgZXJyb3JIYW5kbGVyLFxuICAgICAgY29uZmlnLm1vbml0b3IsXG4gICAgICBjb25maWdcbiAgICApO1xuXG4gICAgY29uc3QgbGlmdGVkQWN0aW9uJCA9IG1lcmdlKFxuICAgICAgbWVyZ2UoYWN0aW9ucyQuYXNPYnNlcnZhYmxlKCkucGlwZShza2lwKDEpKSwgZXh0ZW5zaW9uLmFjdGlvbnMkKS5waXBlKFxuICAgICAgICBtYXAobGlmdEFjdGlvbilcbiAgICAgICksXG4gICAgICBkaXNwYXRjaGVyLFxuICAgICAgZXh0ZW5zaW9uLmxpZnRlZEFjdGlvbnMkXG4gICAgKS5waXBlKG9ic2VydmVPbihxdWV1ZVNjaGVkdWxlcikpO1xuXG4gICAgY29uc3QgbGlmdGVkUmVkdWNlciQgPSByZWR1Y2VycyQucGlwZShtYXAobGlmdFJlZHVjZXIpKTtcblxuICAgIGNvbnN0IGxpZnRlZFN0YXRlU3ViamVjdCA9IG5ldyBSZXBsYXlTdWJqZWN0PExpZnRlZFN0YXRlPigxKTtcblxuICAgIGNvbnN0IGxpZnRlZFN0YXRlU3Vic2NyaXB0aW9uID0gbGlmdGVkQWN0aW9uJFxuICAgICAgLnBpcGUoXG4gICAgICAgIHdpdGhMYXRlc3RGcm9tKGxpZnRlZFJlZHVjZXIkKSxcbiAgICAgICAgc2NhbjxcbiAgICAgICAgICBbYW55LCBBY3Rpb25SZWR1Y2VyPExpZnRlZFN0YXRlLCBBY3Rpb25zLkFsbD5dLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YXRlOiBMaWZ0ZWRTdGF0ZTtcbiAgICAgICAgICAgIGFjdGlvbjogYW55O1xuICAgICAgICAgIH1cbiAgICAgICAgPihcbiAgICAgICAgICAoeyBzdGF0ZTogbGlmdGVkU3RhdGUgfSwgW2FjdGlvbiwgcmVkdWNlcl0pID0+IHtcbiAgICAgICAgICAgIGxldCByZWR1Y2VkTGlmdGVkU3RhdGUgPSByZWR1Y2VyKGxpZnRlZFN0YXRlLCBhY3Rpb24pO1xuICAgICAgICAgICAgLy8gT24gZnVsbCBzdGF0ZSB1cGRhdGVcbiAgICAgICAgICAgIC8vIElmIHdlIGhhdmUgYWN0aW9ucyBmaWx0ZXJzLCB3ZSBtdXN0IGZpbHRlciBjb21wbGV0bHkgb3VyIGxpZnRlZCBzdGF0ZSB0byBiZSBzeW5jIHdpdGggdGhlIGV4dGVuc2lvblxuICAgICAgICAgICAgaWYgKGFjdGlvbi50eXBlICE9PSBQRVJGT1JNX0FDVElPTiAmJiBzaG91bGRGaWx0ZXJBY3Rpb25zKGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgcmVkdWNlZExpZnRlZFN0YXRlID0gZmlsdGVyTGlmdGVkU3RhdGUoXG4gICAgICAgICAgICAgICAgcmVkdWNlZExpZnRlZFN0YXRlLFxuICAgICAgICAgICAgICAgIGNvbmZpZy5wcmVkaWNhdGUsXG4gICAgICAgICAgICAgICAgY29uZmlnLmFjdGlvbnNTYWZlbGlzdCxcbiAgICAgICAgICAgICAgICBjb25maWcuYWN0aW9uc0Jsb2NrbGlzdFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRXh0ZW5zaW9uIHNob3VsZCBiZSBzZW50IHRoZSBzYW5pdGl6ZWQgbGlmdGVkIHN0YXRlXG4gICAgICAgICAgICBleHRlbnNpb24ubm90aWZ5KGFjdGlvbiwgcmVkdWNlZExpZnRlZFN0YXRlKTtcbiAgICAgICAgICAgIHJldHVybiB7IHN0YXRlOiByZWR1Y2VkTGlmdGVkU3RhdGUsIGFjdGlvbiB9O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgeyBzdGF0ZTogbGlmdGVkSW5pdGlhbFN0YXRlLCBhY3Rpb246IG51bGwgYXMgYW55IH1cbiAgICAgICAgKVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoeyBzdGF0ZSwgYWN0aW9uIH0pID0+IHtcbiAgICAgICAgbGlmdGVkU3RhdGVTdWJqZWN0Lm5leHQoc3RhdGUpO1xuXG4gICAgICAgIGlmIChhY3Rpb24udHlwZSA9PT0gQWN0aW9ucy5QRVJGT1JNX0FDVElPTikge1xuICAgICAgICAgIGNvbnN0IHVubGlmdGVkQWN0aW9uID0gKGFjdGlvbiBhcyBBY3Rpb25zLlBlcmZvcm1BY3Rpb24pLmFjdGlvbjtcblxuICAgICAgICAgIHNjYW5uZWRBY3Rpb25zLm5leHQodW5saWZ0ZWRBY3Rpb24pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIGNvbnN0IGV4dGVuc2lvblN0YXJ0U3Vic2NyaXB0aW9uID0gZXh0ZW5zaW9uLnN0YXJ0JC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBsaWZ0ZWRTdGF0ZSQgPSBsaWZ0ZWRTdGF0ZVN1YmplY3QuYXNPYnNlcnZhYmxlKCkgYXMgT2JzZXJ2YWJsZTxcbiAgICAgIExpZnRlZFN0YXRlXG4gICAgPjtcbiAgICBjb25zdCBzdGF0ZSQgPSBsaWZ0ZWRTdGF0ZSQucGlwZShtYXAodW5saWZ0U3RhdGUpKTtcblxuICAgIHRoaXMuZXh0ZW5zaW9uU3RhcnRTdWJzY3JpcHRpb24gPSBleHRlbnNpb25TdGFydFN1YnNjcmlwdGlvbjtcbiAgICB0aGlzLnN0YXRlU3Vic2NyaXB0aW9uID0gbGlmdGVkU3RhdGVTdWJzY3JpcHRpb247XG4gICAgdGhpcy5kaXNwYXRjaGVyID0gZGlzcGF0Y2hlcjtcbiAgICB0aGlzLmxpZnRlZFN0YXRlID0gbGlmdGVkU3RhdGUkO1xuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZSQ7XG4gIH1cblxuICBkaXNwYXRjaChhY3Rpb246IEFjdGlvbikge1xuICAgIHRoaXMuZGlzcGF0Y2hlci5uZXh0KGFjdGlvbik7XG4gIH1cblxuICBuZXh0KGFjdGlvbjogYW55KSB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLm5leHQoYWN0aW9uKTtcbiAgfVxuXG4gIGVycm9yKGVycm9yOiBhbnkpIHt9XG5cbiAgY29tcGxldGUoKSB7fVxuXG4gIHBlcmZvcm1BY3Rpb24oYWN0aW9uOiBhbnkpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLlBlcmZvcm1BY3Rpb24oYWN0aW9uLCArRGF0ZS5ub3coKSkpO1xuICB9XG5cbiAgcmVmcmVzaCgpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLlJlZnJlc2goKSk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLlJlc2V0KCtEYXRlLm5vdygpKSk7XG4gIH1cblxuICByb2xsYmFjaygpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLlJvbGxiYWNrKCtEYXRlLm5vdygpKSk7XG4gIH1cblxuICBjb21taXQoKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5Db21taXQoK0RhdGUubm93KCkpKTtcbiAgfVxuXG4gIHN3ZWVwKCkge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuU3dlZXAoKSk7XG4gIH1cblxuICB0b2dnbGVBY3Rpb24oaWQ6IG51bWJlcikge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuVG9nZ2xlQWN0aW9uKGlkKSk7XG4gIH1cblxuICBqdW1wVG9BY3Rpb24oYWN0aW9uSWQ6IG51bWJlcikge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuSnVtcFRvQWN0aW9uKGFjdGlvbklkKSk7XG4gIH1cblxuICBqdW1wVG9TdGF0ZShpbmRleDogbnVtYmVyKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5KdW1wVG9TdGF0ZShpbmRleCkpO1xuICB9XG5cbiAgaW1wb3J0U3RhdGUobmV4dExpZnRlZFN0YXRlOiBhbnkpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLkltcG9ydFN0YXRlKG5leHRMaWZ0ZWRTdGF0ZSkpO1xuICB9XG5cbiAgbG9ja0NoYW5nZXMoc3RhdHVzOiBib29sZWFuKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5Mb2NrQ2hhbmdlcyhzdGF0dXMpKTtcbiAgfVxuXG4gIHBhdXNlUmVjb3JkaW5nKHN0YXR1czogYm9vbGVhbikge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuUGF1c2VSZWNvcmRpbmcoc3RhdHVzKSk7XG4gIH1cbn1cbiJdfQ==