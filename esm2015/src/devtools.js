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
import { liftAction, unliftState, shouldFilterActions, filterLiftedState } from './utils';
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
            .pipe(withLatestFrom(liftedReducer$), scan(({ state: liftedState }, [action, reducer]) => {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2dG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3N0b3JlLWRldnRvb2xzL3NyYy9kZXZ0b29scy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2pFLE9BQU8sRUFHTCxjQUFjLEVBQ2QsYUFBYSxFQUNiLGlCQUFpQixFQUNqQixxQkFBcUIsR0FDdEIsTUFBTSxhQUFhLENBQUM7QUFDckIsT0FBTyxFQUNMLEtBQUssRUFHTCxjQUFjLEVBQ2QsYUFBYSxHQUVkLE1BQU0sTUFBTSxDQUFDO0FBQ2QsT0FBTyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU1RSxPQUFPLEtBQUssT0FBTyxNQUFNLFdBQVcsQ0FBQztBQUNyQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDdEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ2hELE9BQU8sRUFBZSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDM0UsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDMUYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDM0QsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUczQyxNQUFNOzs7Ozs7Ozs7OztJQU9KLFlBQ0UsVUFBOEIsRUFDOUIsUUFBd0IsRUFDeEIsU0FBNEIsRUFDNUIsU0FBNEIsRUFDNUIsY0FBcUMsRUFDckMsWUFBMEIsRUFDSCxZQUFpQixFQUNULE1BQTJCOztRQUUx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QU8sQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUM3Qzs7Ozs7SUFFRCxZQUFZLENBQUMsUUFBZ0I7UUFDM0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztLQUNuRDs7Ozs7SUFFRCxXQUFXLENBQUMsS0FBYTtRQUN2QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0tBQy9DOzs7OztJQUVELFdBQVcsQ0FBQyxlQUFvQjtRQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO0tBQ3pEOzs7OztJQUVELFdBQVcsQ0FBQyxNQUFlO1FBQ3pCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7S0FDaEQ7Ozs7O0lBRUQsY0FBYyxDQUFDLE1BQWU7UUFDNUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUNuRDs7O1lBeEpGLFVBQVU7Ozs7WUFIRixrQkFBa0I7WUFwQnpCLGNBQWM7WUFFZCxpQkFBaUI7WUFlVixpQkFBaUI7WUFkeEIscUJBQXFCO1lBUE0sWUFBWTs0Q0EwQ3BDLE1BQU0sU0FBQyxhQUFhO1lBdEJPLG1CQUFtQix1QkF1QjlDLE1BQU0sU0FBQyxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3QsIEVycm9ySGFuZGxlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQWN0aW9uLFxuICBBY3Rpb25SZWR1Y2VyLFxuICBBY3Rpb25zU3ViamVjdCxcbiAgSU5JVElBTF9TVEFURSxcbiAgUmVkdWNlck9ic2VydmFibGUsXG4gIFNjYW5uZWRBY3Rpb25zU3ViamVjdCxcbn0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHtcbiAgbWVyZ2UsXG4gIE9ic2VydmFibGUsXG4gIE9ic2VydmVyLFxuICBxdWV1ZVNjaGVkdWxlcixcbiAgUmVwbGF5U3ViamVjdCxcbiAgU3Vic2NyaXB0aW9uLFxufSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG1hcCwgb2JzZXJ2ZU9uLCBzY2FuLCBza2lwLCB3aXRoTGF0ZXN0RnJvbSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0ICogYXMgQWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHsgU1RPUkVfREVWVE9PTFNfQ09ORklHLCBTdG9yZURldnRvb2xzQ29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgRGV2dG9vbHNFeHRlbnNpb24gfSBmcm9tICcuL2V4dGVuc2lvbic7XG5pbXBvcnQgeyBMaWZ0ZWRTdGF0ZSwgbGlmdEluaXRpYWxTdGF0ZSwgbGlmdFJlZHVjZXJXaXRoIH0gZnJvbSAnLi9yZWR1Y2VyJztcbmltcG9ydCB7IGxpZnRBY3Rpb24sIHVubGlmdFN0YXRlLCBzaG91bGRGaWx0ZXJBY3Rpb25zLCBmaWx0ZXJMaWZ0ZWRTdGF0ZSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgRGV2dG9vbHNEaXNwYXRjaGVyIH0gZnJvbSAnLi9kZXZ0b29scy1kaXNwYXRjaGVyJztcbmltcG9ydCB7IFBFUkZPUk1fQUNUSU9OIH0gZnJvbSAnLi9hY3Rpb25zJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0b3JlRGV2dG9vbHMgaW1wbGVtZW50cyBPYnNlcnZlcjxhbnk+IHtcbiAgcHJpdmF0ZSBzdGF0ZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcml2YXRlIGV4dGVuc2lvblN0YXJ0U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHB1YmxpYyBkaXNwYXRjaGVyOiBBY3Rpb25zU3ViamVjdDtcbiAgcHVibGljIGxpZnRlZFN0YXRlOiBPYnNlcnZhYmxlPExpZnRlZFN0YXRlPjtcbiAgcHVibGljIHN0YXRlOiBPYnNlcnZhYmxlPGFueT47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZGlzcGF0Y2hlcjogRGV2dG9vbHNEaXNwYXRjaGVyLFxuICAgIGFjdGlvbnMkOiBBY3Rpb25zU3ViamVjdCxcbiAgICByZWR1Y2VycyQ6IFJlZHVjZXJPYnNlcnZhYmxlLFxuICAgIGV4dGVuc2lvbjogRGV2dG9vbHNFeHRlbnNpb24sXG4gICAgc2Nhbm5lZEFjdGlvbnM6IFNjYW5uZWRBY3Rpb25zU3ViamVjdCxcbiAgICBlcnJvckhhbmRsZXI6IEVycm9ySGFuZGxlcixcbiAgICBASW5qZWN0KElOSVRJQUxfU1RBVEUpIGluaXRpYWxTdGF0ZTogYW55LFxuICAgIEBJbmplY3QoU1RPUkVfREVWVE9PTFNfQ09ORklHKSBjb25maWc6IFN0b3JlRGV2dG9vbHNDb25maWdcbiAgKSB7XG4gICAgY29uc3QgbGlmdGVkSW5pdGlhbFN0YXRlID0gbGlmdEluaXRpYWxTdGF0ZShpbml0aWFsU3RhdGUsIGNvbmZpZy5tb25pdG9yKTtcbiAgICBjb25zdCBsaWZ0UmVkdWNlciA9IGxpZnRSZWR1Y2VyV2l0aChcbiAgICAgIGluaXRpYWxTdGF0ZSxcbiAgICAgIGxpZnRlZEluaXRpYWxTdGF0ZSxcbiAgICAgIGVycm9ySGFuZGxlcixcbiAgICAgIGNvbmZpZy5tb25pdG9yLFxuICAgICAgY29uZmlnXG4gICAgKTtcblxuICAgIGNvbnN0IGxpZnRlZEFjdGlvbiQgPSBtZXJnZShcbiAgICAgIG1lcmdlKGFjdGlvbnMkLmFzT2JzZXJ2YWJsZSgpLnBpcGUoc2tpcCgxKSksIGV4dGVuc2lvbi5hY3Rpb25zJCkucGlwZShcbiAgICAgICAgbWFwKGxpZnRBY3Rpb24pXG4gICAgICApLFxuICAgICAgZGlzcGF0Y2hlcixcbiAgICAgIGV4dGVuc2lvbi5saWZ0ZWRBY3Rpb25zJFxuICAgICkucGlwZShvYnNlcnZlT24ocXVldWVTY2hlZHVsZXIpKTtcblxuICAgIGNvbnN0IGxpZnRlZFJlZHVjZXIkID0gcmVkdWNlcnMkLnBpcGUobWFwKGxpZnRSZWR1Y2VyKSk7XG5cbiAgICBjb25zdCBsaWZ0ZWRTdGF0ZVN1YmplY3QgPSBuZXcgUmVwbGF5U3ViamVjdDxMaWZ0ZWRTdGF0ZT4oMSk7XG5cbiAgICBjb25zdCBsaWZ0ZWRTdGF0ZVN1YnNjcmlwdGlvbiA9IGxpZnRlZEFjdGlvbiRcbiAgICAgIC5waXBlKFxuICAgICAgICB3aXRoTGF0ZXN0RnJvbShsaWZ0ZWRSZWR1Y2VyJCksXG4gICAgICAgIHNjYW48XG4gICAgICAgICAgW2FueSwgQWN0aW9uUmVkdWNlcjxMaWZ0ZWRTdGF0ZSwgQWN0aW9ucy5BbGw+XSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGF0ZTogTGlmdGVkU3RhdGU7XG4gICAgICAgICAgICBhY3Rpb246IGFueTtcbiAgICAgICAgICB9XG4gICAgICAgICAgPihcbiAgICAgICAgICAgICh7IHN0YXRlOiBsaWZ0ZWRTdGF0ZSB9LCBbYWN0aW9uLCByZWR1Y2VyXSkgPT4ge1xuICAgICAgICAgICAgICBsZXQgcmVkdWNlZExpZnRlZFN0YXRlID0gcmVkdWNlcihsaWZ0ZWRTdGF0ZSwgYWN0aW9uKTtcbiAgICAgICAgICAgICAgLy8gT24gZnVsbCBzdGF0ZSB1cGRhdGVcbiAgICAgICAgICAgICAgLy8gSWYgd2UgaGF2ZSBhY3Rpb25zIGZpbHRlcnMsIHdlIG11c3QgZmlsdGVyIGNvbXBsZXRseSBvdXIgbGlmdGVkIHN0YXRlIHRvIGJlIHN5bmMgd2l0aCB0aGUgZXh0ZW5zaW9uXG4gICAgICAgICAgICAgIGlmIChhY3Rpb24udHlwZSAhPT0gUEVSRk9STV9BQ1RJT04gJiYgc2hvdWxkRmlsdGVyQWN0aW9ucyhjb25maWcpKSB7XG4gICAgICAgICAgICAgICAgcmVkdWNlZExpZnRlZFN0YXRlID0gZmlsdGVyTGlmdGVkU3RhdGUoXG4gICAgICAgICAgICAgICAgICByZWR1Y2VkTGlmdGVkU3RhdGUsXG4gICAgICAgICAgICAgICAgICBjb25maWcucHJlZGljYXRlLFxuICAgICAgICAgICAgICAgICAgY29uZmlnLmFjdGlvbnNXaGl0ZWxpc3QsXG4gICAgICAgICAgICAgICAgICBjb25maWcuYWN0aW9uc0JsYWNrbGlzdFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gRXh0ZW5zaW9uIHNob3VsZCBiZSBzZW50IHRoZSBzYW5pdGl6ZWQgbGlmdGVkIHN0YXRlXG4gICAgICAgICAgICAgIGV4dGVuc2lvbi5ub3RpZnkoYWN0aW9uLCByZWR1Y2VkTGlmdGVkU3RhdGUpO1xuICAgICAgICAgICAgICByZXR1cm4geyBzdGF0ZTogcmVkdWNlZExpZnRlZFN0YXRlLCBhY3Rpb24gfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7IHN0YXRlOiBsaWZ0ZWRJbml0aWFsU3RhdGUsIGFjdGlvbjogbnVsbCBhcyBhbnkgfVxuICAgICAgICAgIClcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKHsgc3RhdGUsIGFjdGlvbiB9KSA9PiB7XG4gICAgICAgIGxpZnRlZFN0YXRlU3ViamVjdC5uZXh0KHN0YXRlKTtcblxuICAgICAgICBpZiAoYWN0aW9uLnR5cGUgPT09IEFjdGlvbnMuUEVSRk9STV9BQ1RJT04pIHtcbiAgICAgICAgICBjb25zdCB1bmxpZnRlZEFjdGlvbiA9IChhY3Rpb24gYXMgQWN0aW9ucy5QZXJmb3JtQWN0aW9uKS5hY3Rpb247XG5cbiAgICAgICAgICBzY2FubmVkQWN0aW9ucy5uZXh0KHVubGlmdGVkQWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICBjb25zdCBleHRlbnNpb25TdGFydFN1YnNjcmlwdGlvbiA9IGV4dGVuc2lvbi5zdGFydCQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMucmVmcmVzaCgpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgbGlmdGVkU3RhdGUkID0gbGlmdGVkU3RhdGVTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpIGFzIE9ic2VydmFibGU8XG4gICAgICBMaWZ0ZWRTdGF0ZVxuICAgICAgPjtcbiAgICBjb25zdCBzdGF0ZSQgPSBsaWZ0ZWRTdGF0ZSQucGlwZShtYXAodW5saWZ0U3RhdGUpKTtcblxuICAgIHRoaXMuZXh0ZW5zaW9uU3RhcnRTdWJzY3JpcHRpb24gPSBleHRlbnNpb25TdGFydFN1YnNjcmlwdGlvbjtcbiAgICB0aGlzLnN0YXRlU3Vic2NyaXB0aW9uID0gbGlmdGVkU3RhdGVTdWJzY3JpcHRpb247XG4gICAgdGhpcy5kaXNwYXRjaGVyID0gZGlzcGF0Y2hlcjtcbiAgICB0aGlzLmxpZnRlZFN0YXRlID0gbGlmdGVkU3RhdGUkO1xuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZSQ7XG4gIH1cblxuICBkaXNwYXRjaChhY3Rpb246IEFjdGlvbikge1xuICAgIHRoaXMuZGlzcGF0Y2hlci5uZXh0KGFjdGlvbik7XG4gIH1cblxuICBuZXh0KGFjdGlvbjogYW55KSB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLm5leHQoYWN0aW9uKTtcbiAgfVxuXG4gIGVycm9yKGVycm9yOiBhbnkpIHsgfVxuXG4gIGNvbXBsZXRlKCkgeyB9XG5cbiAgcGVyZm9ybUFjdGlvbihhY3Rpb246IGFueSkge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuUGVyZm9ybUFjdGlvbihhY3Rpb24sICtEYXRlLm5vdygpKSk7XG4gIH1cblxuICByZWZyZXNoKCkge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuUmVmcmVzaCgpKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuUmVzZXQoK0RhdGUubm93KCkpKTtcbiAgfVxuXG4gIHJvbGxiYWNrKCkge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuUm9sbGJhY2soK0RhdGUubm93KCkpKTtcbiAgfVxuXG4gIGNvbW1pdCgpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLkNvbW1pdCgrRGF0ZS5ub3coKSkpO1xuICB9XG5cbiAgc3dlZXAoKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5Td2VlcCgpKTtcbiAgfVxuXG4gIHRvZ2dsZUFjdGlvbihpZDogbnVtYmVyKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5Ub2dnbGVBY3Rpb24oaWQpKTtcbiAgfVxuXG4gIGp1bXBUb0FjdGlvbihhY3Rpb25JZDogbnVtYmVyKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5KdW1wVG9BY3Rpb24oYWN0aW9uSWQpKTtcbiAgfVxuXG4gIGp1bXBUb1N0YXRlKGluZGV4OiBudW1iZXIpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLkp1bXBUb1N0YXRlKGluZGV4KSk7XG4gIH1cblxuICBpbXBvcnRTdGF0ZShuZXh0TGlmdGVkU3RhdGU6IGFueSkge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuSW1wb3J0U3RhdGUobmV4dExpZnRlZFN0YXRlKSk7XG4gIH1cblxuICBsb2NrQ2hhbmdlcyhzdGF0dXM6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLkxvY2tDaGFuZ2VzKHN0YXR1cykpO1xuICB9XG5cbiAgcGF1c2VSZWNvcmRpbmcoc3RhdHVzOiBib29sZWFuKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5QYXVzZVJlY29yZGluZyhzdGF0dXMpKTtcbiAgfVxufVxuIl19