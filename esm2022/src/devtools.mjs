import { Injectable, Inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { INITIAL_STATE, } from '@ngrx/store';
import { merge, queueScheduler, ReplaySubject, } from 'rxjs';
import { map, observeOn, scan, skip, withLatestFrom } from 'rxjs/operators';
import * as Actions from './actions';
import { STORE_DEVTOOLS_CONFIG } from './config';
import { liftInitialState, liftReducerWith } from './reducer';
import { liftAction, unliftState, shouldFilterActions, filterLiftedState, } from './utils';
import { PERFORM_ACTION } from './actions';
import * as i0 from "@angular/core";
import * as i1 from "./devtools-dispatcher";
import * as i2 from "@ngrx/store";
import * as i3 from "./extension";
import * as i4 from "./config";
class StoreDevtools {
    constructor(dispatcher, actions$, reducers$, extension, scannedActions, errorHandler, initialState, config) {
        const liftedInitialState = liftInitialState(initialState, config.monitor);
        const liftReducer = liftReducerWith(initialState, liftedInitialState, errorHandler, config.monitor, config);
        const liftedAction$ = merge(merge(actions$.asObservable().pipe(skip(1)), extension.actions$).pipe(map(liftAction)), dispatcher, extension.liftedActions$).pipe(observeOn(queueScheduler));
        const liftedReducer$ = reducers$.pipe(map(liftReducer));
        const liftedStateSubject = new ReplaySubject(1);
        const liftedStateSubscription = liftedAction$
            .pipe(withLatestFrom(liftedReducer$), scan(({ state: liftedState }, [action, reducer]) => {
            let reducedLiftedState = reducer(liftedState, action);
            // On full state update
            // If we have actions filters, we must filter completely our lifted state to be sync with the extension
            if (action.type !== PERFORM_ACTION && shouldFilterActions(config)) {
                reducedLiftedState = filterLiftedState(reducedLiftedState, config.predicate, config.actionsSafelist, config.actionsBlocklist);
            }
            // Extension should be sent the sanitized lifted state
            extension.notify(action, reducedLiftedState);
            return { state: reducedLiftedState, action };
        }, { state: liftedInitialState, action: null }))
            .subscribe(({ state, action }) => {
            liftedStateSubject.next(state);
            if (action.type === Actions.PERFORM_ACTION) {
                const unliftedAction = action.action;
                scannedActions.next(unliftedAction);
            }
        });
        const extensionStartSubscription = extension.start$.subscribe(() => {
            this.refresh();
        });
        const liftedState$ = liftedStateSubject.asObservable();
        const state$ = liftedState$.pipe(map(unliftState));
        Object.defineProperty(state$, 'state', {
            value: toSignal(state$, { manualCleanup: true, requireSync: true }),
        });
        this.extensionStartSubscription = extensionStartSubscription;
        this.stateSubscription = liftedStateSubscription;
        this.dispatcher = dispatcher;
        this.liftedState = liftedState$;
        this.state = state$;
    }
    dispatch(action) {
        this.dispatcher.next(action);
    }
    next(action) {
        this.dispatcher.next(action);
    }
    error(error) { }
    complete() { }
    performAction(action) {
        this.dispatch(new Actions.PerformAction(action, +Date.now()));
    }
    refresh() {
        this.dispatch(new Actions.Refresh());
    }
    reset() {
        this.dispatch(new Actions.Reset(+Date.now()));
    }
    rollback() {
        this.dispatch(new Actions.Rollback(+Date.now()));
    }
    commit() {
        this.dispatch(new Actions.Commit(+Date.now()));
    }
    sweep() {
        this.dispatch(new Actions.Sweep());
    }
    toggleAction(id) {
        this.dispatch(new Actions.ToggleAction(id));
    }
    jumpToAction(actionId) {
        this.dispatch(new Actions.JumpToAction(actionId));
    }
    jumpToState(index) {
        this.dispatch(new Actions.JumpToState(index));
    }
    importState(nextLiftedState) {
        this.dispatch(new Actions.ImportState(nextLiftedState));
    }
    lockChanges(status) {
        this.dispatch(new Actions.LockChanges(status));
    }
    pauseRecording(status) {
        this.dispatch(new Actions.PauseRecording(status));
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: StoreDevtools, deps: [{ token: i1.DevtoolsDispatcher }, { token: i2.ActionsSubject }, { token: i2.ReducerObservable }, { token: i3.DevtoolsExtension }, { token: i2.ScannedActionsSubject }, { token: i0.ErrorHandler }, { token: INITIAL_STATE }, { token: STORE_DEVTOOLS_CONFIG }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: StoreDevtools }); }
}
export { StoreDevtools };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: StoreDevtools, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.DevtoolsDispatcher }, { type: i2.ActionsSubject }, { type: i2.ReducerObservable }, { type: i3.DevtoolsExtension }, { type: i2.ScannedActionsSubject }, { type: i0.ErrorHandler }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [INITIAL_STATE]
                }] }, { type: i4.StoreDevtoolsConfig, decorators: [{
                    type: Inject,
                    args: [STORE_DEVTOOLS_CONFIG]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2dG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3N0b3JlLWRldnRvb2xzL3NyYy9kZXZ0b29scy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBZ0IsTUFBTSxlQUFlLENBQUM7QUFDakUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3RELE9BQU8sRUFJTCxhQUFhLEdBSWQsTUFBTSxhQUFhLENBQUM7QUFDckIsT0FBTyxFQUNMLEtBQUssRUFHTCxjQUFjLEVBQ2QsYUFBYSxHQUVkLE1BQU0sTUFBTSxDQUFDO0FBQ2QsT0FBTyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU1RSxPQUFPLEtBQUssT0FBTyxNQUFNLFdBQVcsQ0FBQztBQUNyQyxPQUFPLEVBQUUscUJBQXFCLEVBQXVCLE1BQU0sVUFBVSxDQUFDO0FBRXRFLE9BQU8sRUFBZSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDM0UsT0FBTyxFQUNMLFVBQVUsRUFDVixXQUFXLEVBQ1gsbUJBQW1CLEVBQ25CLGlCQUFpQixHQUNsQixNQUFNLFNBQVMsQ0FBQztBQUVqQixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sV0FBVyxDQUFDOzs7Ozs7QUFFM0MsTUFDYSxhQUFhO0lBT3hCLFlBQ0UsVUFBOEIsRUFDOUIsUUFBd0IsRUFDeEIsU0FBNEIsRUFDNUIsU0FBNEIsRUFDNUIsY0FBcUMsRUFDckMsWUFBMEIsRUFDSCxZQUFpQixFQUNULE1BQTJCO1FBRTFELE1BQU0sa0JBQWtCLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxRSxNQUFNLFdBQVcsR0FBRyxlQUFlLENBQ2pDLFlBQVksRUFD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QUssRUFBRSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELFlBQVksQ0FBQyxFQUFVO1FBQ3JCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVELFlBQVksQ0FBQyxRQUFnQjtRQUMzQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksT0FBTyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCxXQUFXLENBQUMsS0FBYTtRQUN2QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxXQUFXLENBQUMsZUFBb0I7UUFDOUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRUQsV0FBVyxDQUFDLE1BQWU7UUFDekIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQsY0FBYyxDQUFDLE1BQWU7UUFDNUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNwRCxDQUFDO2lJQXpKVSxhQUFhLHFOQWNkLGFBQWEsYUFDYixxQkFBcUI7cUlBZnBCLGFBQWE7O1NBQWIsYUFBYTsyRkFBYixhQUFhO2tCQUR6QixVQUFVOzswQkFlTixNQUFNOzJCQUFDLGFBQWE7OzBCQUNwQixNQUFNOzJCQUFDLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdCwgRXJyb3JIYW5kbGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyB0b1NpZ25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUvcnhqcy1pbnRlcm9wJztcbmltcG9ydCB7XG4gIEFjdGlvbixcbiAgQWN0aW9uUmVkdWNlcixcbiAgQWN0aW9uc1N1YmplY3QsXG4gIElOSVRJQUxfU1RBVEUsXG4gIFJlZHVjZXJPYnNlcnZhYmxlLFxuICBTY2FubmVkQWN0aW9uc1N1YmplY3QsXG4gIFN0YXRlT2JzZXJ2YWJsZSxcbn0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHtcbiAgbWVyZ2UsXG4gIE9ic2VydmFibGUsXG4gIE9ic2VydmVyLFxuICBxdWV1ZVNjaGVkdWxlcixcbiAgUmVwbGF5U3ViamVjdCxcbiAgU3Vic2NyaXB0aW9uLFxufSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG1hcCwgb2JzZXJ2ZU9uLCBzY2FuLCBza2lwLCB3aXRoTGF0ZXN0RnJvbSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0ICogYXMgQWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHsgU1RPUkVfREVWVE9PTFNfQ09ORklHLCBTdG9yZURldnRvb2xzQ29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgRGV2dG9vbHNFeHRlbnNpb24gfSBmcm9tICcuL2V4dGVuc2lvbic7XG5pbXBvcnQgeyBMaWZ0ZWRTdGF0ZSwgbGlmdEluaXRpYWxTdGF0ZSwgbGlmdFJlZHVjZXJXaXRoIH0gZnJvbSAnLi9yZWR1Y2VyJztcbmltcG9ydCB7XG4gIGxpZnRBY3Rpb24sXG4gIHVubGlmdFN0YXRlLFxuICBzaG91bGRGaWx0ZXJBY3Rpb25zLFxuICBmaWx0ZXJMaWZ0ZWRTdGF0ZSxcbn0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBEZXZ0b29sc0Rpc3BhdGNoZXIgfSBmcm9tICcuL2RldnRvb2xzLWRpc3BhdGNoZXInO1xuaW1wb3J0IHsgUEVSRk9STV9BQ1RJT04gfSBmcm9tICcuL2FjdGlvbnMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RvcmVEZXZ0b29scyBpbXBsZW1lbnRzIE9ic2VydmVyPGFueT4ge1xuICBwcml2YXRlIHN0YXRlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgZXh0ZW5zaW9uU3RhcnRTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHVibGljIGRpc3BhdGNoZXI6IEFjdGlvbnNTdWJqZWN0O1xuICBwdWJsaWMgbGlmdGVkU3RhdGU6IE9ic2VydmFibGU8TGlmdGVkU3RhdGU+O1xuICBwdWJsaWMgc3RhdGU6IFN0YXRlT2JzZXJ2YWJsZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBkaXNwYXRjaGVyOiBEZXZ0b29sc0Rpc3BhdGNoZXIsXG4gICAgYWN0aW9ucyQ6IEFjdGlvbnNTdWJqZWN0LFxuICAgIHJlZHVjZXJzJDogUmVkdWNlck9ic2VydmFibGUsXG4gICAgZXh0ZW5zaW9uOiBEZXZ0b29sc0V4dGVuc2lvbixcbiAgICBzY2FubmVkQWN0aW9uczogU2Nhbm5lZEFjdGlvbnNTdWJqZWN0LFxuICAgIGVycm9ySGFuZGxlcjogRXJyb3JIYW5kbGVyLFxuICAgIEBJbmplY3QoSU5JVElBTF9TVEFURSkgaW5pdGlhbFN0YXRlOiBhbnksXG4gICAgQEluamVjdChTVE9SRV9ERVZUT09MU19DT05GSUcpIGNvbmZpZzogU3RvcmVEZXZ0b29sc0NvbmZpZ1xuICApIHtcbiAgICBjb25zdCBsaWZ0ZWRJbml0aWFsU3RhdGUgPSBsaWZ0SW5pdGlhbFN0YXRlKGluaXRpYWxTdGF0ZSwgY29uZmlnLm1vbml0b3IpO1xuICAgIGNvbnN0IGxpZnRSZWR1Y2VyID0gbGlmdFJlZHVjZXJXaXRoKFxuICAgICAgaW5pdGlhbFN0YXRlLFxuICAgICAgbGlmdGVkSW5pdGlhbFN0YXRlLFxuICAgICAgZXJyb3JIYW5kbGVyLFxuICAgICAgY29uZmlnLm1vbml0b3IsXG4gICAgICBjb25maWdcbiAgICApO1xuXG4gICAgY29uc3QgbGlmdGVkQWN0aW9uJCA9IG1lcmdlKFxuICAgICAgbWVyZ2UoYWN0aW9ucyQuYXNPYnNlcnZhYmxlKCkucGlwZShza2lwKDEpKSwgZXh0ZW5zaW9uLmFjdGlvbnMkKS5waXBlKFxuICAgICAgICBtYXAobGlmdEFjdGlvbilcbiAgICAgICksXG4gICAgICBkaXNwYXRjaGVyLFxuICAgICAgZXh0ZW5zaW9uLmxpZnRlZEFjdGlvbnMkXG4gICAgKS5waXBlKG9ic2VydmVPbihxdWV1ZVNjaGVkdWxlcikpO1xuXG4gICAgY29uc3QgbGlmdGVkUmVkdWNlciQgPSByZWR1Y2VycyQucGlwZShtYXAobGlmdFJlZHVjZXIpKTtcblxuICAgIGNvbnN0IGxpZnRlZFN0YXRlU3ViamVjdCA9IG5ldyBSZXBsYXlTdWJqZWN0PExpZnRlZFN0YXRlPigxKTtcblxuICAgIGNvbnN0IGxpZnRlZFN0YXRlU3Vic2NyaXB0aW9uID0gbGlmdGVkQWN0aW9uJFxuICAgICAgLnBpcGUoXG4gICAgICAgIHdpdGhMYXRlc3RGcm9tKGxpZnRlZFJlZHVjZXIkKSxcbiAgICAgICAgc2NhbjxcbiAgICAgICAgICBbYW55LCBBY3Rpb25SZWR1Y2VyPExpZnRlZFN0YXRlLCBBY3Rpb25zLkFsbD5dLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YXRlOiBMaWZ0ZWRTdGF0ZTtcbiAgICAgICAgICAgIGFjdGlvbjogYW55O1xuICAgICAgICAgIH1cbiAgICAgICAgPihcbiAgICAgICAgICAoeyBzdGF0ZTogbGlmdGVkU3RhdGUgfSwgW2FjdGlvbiwgcmVkdWNlcl0pID0+IHtcbiAgICAgICAgICAgIGxldCByZWR1Y2VkTGlmdGVkU3RhdGUgPSByZWR1Y2VyKGxpZnRlZFN0YXRlLCBhY3Rpb24pO1xuICAgICAgICAgICAgLy8gT24gZnVsbCBzdGF0ZSB1cGRhdGVcbiAgICAgICAgICAgIC8vIElmIHdlIGhhdmUgYWN0aW9ucyBmaWx0ZXJzLCB3ZSBtdXN0IGZpbHRlciBjb21wbGV0ZWx5IG91ciBsaWZ0ZWQgc3RhdGUgdG8gYmUgc3luYyB3aXRoIHRoZSBleHRlbnNpb25cbiAgICAgICAgICAgIGlmIChhY3Rpb24udHlwZSAhPT0gUEVSRk9STV9BQ1RJT04gJiYgc2hvdWxkRmlsdGVyQWN0aW9ucyhjb25maWcpKSB7XG4gICAgICAgICAgICAgIHJlZHVjZWRMaWZ0ZWRTdGF0ZSA9IGZpbHRlckxpZnRlZFN0YXRlKFxuICAgICAgICAgICAgICAgIHJlZHVjZWRMaWZ0ZWRTdGF0ZSxcbiAgICAgICAgICAgICAgICBjb25maWcucHJlZGljYXRlLFxuICAgICAgICAgICAgICAgIGNvbmZpZy5hY3Rpb25zU2FmZWxpc3QsXG4gICAgICAgICAgICAgICAgY29uZmlnLmFjdGlvbnNCbG9ja2xpc3RcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEV4dGVuc2lvbiBzaG91bGQgYmUgc2VudCB0aGUgc2FuaXRpemVkIGxpZnRlZCBzdGF0ZVxuICAgICAgICAgICAgZXh0ZW5zaW9uLm5vdGlmeShhY3Rpb24sIHJlZHVjZWRMaWZ0ZWRTdGF0ZSk7XG4gICAgICAgICAgICByZXR1cm4geyBzdGF0ZTogcmVkdWNlZExpZnRlZFN0YXRlLCBhY3Rpb24gfTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHsgc3RhdGU6IGxpZnRlZEluaXRpYWxTdGF0ZSwgYWN0aW9uOiBudWxsIGFzIGFueSB9XG4gICAgICAgIClcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKHsgc3RhdGUsIGFjdGlvbiB9KSA9PiB7XG4gICAgICAgIGxpZnRlZFN0YXRlU3ViamVjdC5uZXh0KHN0YXRlKTtcblxuICAgICAgICBpZiAoYWN0aW9uLnR5cGUgPT09IEFjdGlvbnMuUEVSRk9STV9BQ1RJT04pIHtcbiAgICAgICAgICBjb25zdCB1bmxpZnRlZEFjdGlvbiA9IChhY3Rpb24gYXMgQWN0aW9ucy5QZXJmb3JtQWN0aW9uKS5hY3Rpb247XG5cbiAgICAgICAgICBzY2FubmVkQWN0aW9ucy5uZXh0KHVubGlmdGVkQWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICBjb25zdCBleHRlbnNpb25TdGFydFN1YnNjcmlwdGlvbiA9IGV4dGVuc2lvbi5zdGFydCQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMucmVmcmVzaCgpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgbGlmdGVkU3RhdGUkID1cbiAgICAgIGxpZnRlZFN0YXRlU3ViamVjdC5hc09ic2VydmFibGUoKSBhcyBPYnNlcnZhYmxlPExpZnRlZFN0YXRlPjtcbiAgICBjb25zdCBzdGF0ZSQgPSBsaWZ0ZWRTdGF0ZSQucGlwZShtYXAodW5saWZ0U3RhdGUpKSBhcyBTdGF0ZU9ic2VydmFibGU7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHN0YXRlJCwgJ3N0YXRlJywge1xuICAgICAgdmFsdWU6IHRvU2lnbmFsKHN0YXRlJCwgeyBtYW51YWxDbGVhbnVwOiB0cnVlLCByZXF1aXJlU3luYzogdHJ1ZSB9KSxcbiAgICB9KTtcblxuICAgIHRoaXMuZXh0ZW5zaW9uU3RhcnRTdWJzY3JpcHRpb24gPSBleHRlbnNpb25TdGFydFN1YnNjcmlwdGlvbjtcbiAgICB0aGlzLnN0YXRlU3Vic2NyaXB0aW9uID0gbGlmdGVkU3RhdGVTdWJzY3JpcHRpb247XG4gICAgdGhpcy5kaXNwYXRjaGVyID0gZGlzcGF0Y2hlcjtcbiAgICB0aGlzLmxpZnRlZFN0YXRlID0gbGlmdGVkU3RhdGUkO1xuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZSQ7XG4gIH1cblxuICBkaXNwYXRjaChhY3Rpb246IEFjdGlvbikge1xuICAgIHRoaXMuZGlzcGF0Y2hlci5uZXh0KGFjdGlvbik7XG4gIH1cblxuICBuZXh0KGFjdGlvbjogYW55KSB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLm5leHQoYWN0aW9uKTtcbiAgfVxuXG4gIGVycm9yKGVycm9yOiBhbnkpIHt9XG5cbiAgY29tcGxldGUoKSB7fVxuXG4gIHBlcmZvcm1BY3Rpb24oYWN0aW9uOiBhbnkpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLlBlcmZvcm1BY3Rpb24oYWN0aW9uLCArRGF0ZS5ub3coKSkpO1xuICB9XG5cbiAgcmVmcmVzaCgpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLlJlZnJlc2goKSk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLlJlc2V0KCtEYXRlLm5vdygpKSk7XG4gIH1cblxuICByb2xsYmFjaygpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLlJvbGxiYWNrKCtEYXRlLm5vdygpKSk7XG4gIH1cblxuICBjb21taXQoKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5Db21taXQoK0RhdGUubm93KCkpKTtcbiAgfVxuXG4gIHN3ZWVwKCkge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuU3dlZXAoKSk7XG4gIH1cblxuICB0b2dnbGVBY3Rpb24oaWQ6IG51bWJlcikge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuVG9nZ2xlQWN0aW9uKGlkKSk7XG4gIH1cblxuICBqdW1wVG9BY3Rpb24oYWN0aW9uSWQ6IG51bWJlcikge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuSnVtcFRvQWN0aW9uKGFjdGlvbklkKSk7XG4gIH1cblxuICBqdW1wVG9TdGF0ZShpbmRleDogbnVtYmVyKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5KdW1wVG9TdGF0ZShpbmRleCkpO1xuICB9XG5cbiAgaW1wb3J0U3RhdGUobmV4dExpZnRlZFN0YXRlOiBhbnkpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLkltcG9ydFN0YXRlKG5leHRMaWZ0ZWRTdGF0ZSkpO1xuICB9XG5cbiAgbG9ja0NoYW5nZXMoc3RhdHVzOiBib29sZWFuKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5Mb2NrQ2hhbmdlcyhzdGF0dXMpKTtcbiAgfVxuXG4gIHBhdXNlUmVjb3JkaW5nKHN0YXR1czogYm9vbGVhbikge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuUGF1c2VSZWNvcmRpbmcoc3RhdHVzKSk7XG4gIH1cbn1cbiJdfQ==