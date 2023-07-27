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
export class StoreDevtools {
    constructor(dispatcher, actions$, reducers$, extension, scannedActions, errorHandler, initialState, config) {
        const liftedInitialState = liftInitialState(initialState, config.monitor);
        const liftReducer = liftReducerWith(initialState, liftedInitialState, errorHandler, config.monitor, config);
        const liftedAction$ = merge(merge(actions$.asObservable().pipe(skip(1)), extension.actions$).pipe(map(liftAction)), dispatcher, extension.liftedActions$).pipe(observeOn(queueScheduler));
        const liftedReducer$ = reducers$.pipe(map(liftReducer));
        const liftedStateSubject = new ReplaySubject(1);
        this.liftedStateSubscription = liftedAction$
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
        this.extensionStartSubscription = extension.start$.subscribe(() => {
            this.refresh();
        });
        const liftedState$ = liftedStateSubject.asObservable();
        const state$ = liftedState$.pipe(map(unliftState));
        Object.defineProperty(state$, 'state', {
            value: toSignal(state$, { manualCleanup: true, requireSync: true }),
        });
        this.dispatcher = dispatcher;
        this.liftedState = liftedState$;
        this.state = state$;
    }
    ngOnDestroy() {
        // Even though the store devtools plugin is recommended to be
        // used only in development mode, it can still cause a memory leak
        // in microfrontend applications that are being created and destroyed
        // multiple times during development. This results in excessive memory
        // consumption, as it prevents entire apps from being garbage collected.
        this.liftedStateSubscription.unsubscribe();
        this.extensionStartSubscription.unsubscribe();
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
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.6", ngImport: i0, type: StoreDevtools, deps: [{ token: i1.DevtoolsDispatcher }, { token: i2.ActionsSubject }, { token: i2.ReducerObservable }, { token: i3.DevtoolsExtension }, { token: i2.ScannedActionsSubject }, { token: i0.ErrorHandler }, { token: INITIAL_STATE }, { token: STORE_DEVTOOLS_CONFIG }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.1.6", ngImport: i0, type: StoreDevtools }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.6", ngImport: i0, type: StoreDevtools, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.DevtoolsDispatcher }, { type: i2.ActionsSubject }, { type: i2.ReducerObservable }, { type: i3.DevtoolsExtension }, { type: i2.ScannedActionsSubject }, { type: i0.ErrorHandler }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [INITIAL_STATE]
                }] }, { type: i4.StoreDevtoolsConfig, decorators: [{
                    type: Inject,
                    args: [STORE_DEVTOOLS_CONFIG]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2dG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3N0b3JlLWRldnRvb2xzL3NyYy9kZXZ0b29scy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBMkIsTUFBTSxlQUFlLENBQUM7QUFDNUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3RELE9BQU8sRUFJTCxhQUFhLEdBSWQsTUFBTSxhQUFhLENBQUM7QUFDckIsT0FBTyxFQUNMLEtBQUssRUFHTCxjQUFjLEVBQ2QsYUFBYSxHQUVkLE1BQU0sTUFBTSxDQUFDO0FBQ2QsT0FBTyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU1RSxPQUFPLEtBQUssT0FBTyxNQUFNLFdBQVcsQ0FBQztBQUNyQyxPQUFPLEVBQUUscUJBQXFCLEVBQXVCLE1BQU0sVUFBVSxDQUFDO0FBRXRFLE9BQU8sRUFBZSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDM0UsT0FBTyxFQUNMLFVBQVUsRUFDVixXQUFXLEVBQ1gsbUJBQW1CLEVBQ25CLGlCQUFpQixHQUNsQixNQUFNLFNBQVMsQ0FBQztBQUVqQixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sV0FBVyxDQUFDOzs7Ozs7QUFHM0MsTUFBTSxPQUFPLGFBQWE7SUFPeEIsWUFDRSxVQUE4QixFQUM5QixRQUF3QixFQUN4QixTQUE0QixFQUM1QixTQUE0QixFQUM1QixjQUFxQyxFQUNyQyxZQUEwQixFQUNILFlBQWlCLEVBQ1QsTUFBMkI7UUFFMUQsTUFBTSxrQkFBa0IsR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzFFLE1BQU0sV0FBVyxHQUFHLGVBQWUsQ0FDakMsWUFB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amVjdGFibGUsIEluamVjdCwgRXJyb3JIYW5kbGVyLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IHRvU2lnbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZS9yeGpzLWludGVyb3AnO1xuaW1wb3J0IHtcbiAgQWN0aW9uLFxuICBBY3Rpb25SZWR1Y2VyLFxuICBBY3Rpb25zU3ViamVjdCxcbiAgSU5JVElBTF9TVEFURSxcbiAgUmVkdWNlck9ic2VydmFibGUsXG4gIFNjYW5uZWRBY3Rpb25zU3ViamVjdCxcbiAgU3RhdGVPYnNlcnZhYmxlLFxufSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQge1xuICBtZXJnZSxcbiAgT2JzZXJ2YWJsZSxcbiAgT2JzZXJ2ZXIsXG4gIHF1ZXVlU2NoZWR1bGVyLFxuICBSZXBsYXlTdWJqZWN0LFxuICBTdWJzY3JpcHRpb24sXG59IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwLCBvYnNlcnZlT24sIHNjYW4sIHNraXAsIHdpdGhMYXRlc3RGcm9tIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgKiBhcyBBY3Rpb25zIGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgeyBTVE9SRV9ERVZUT09MU19DT05GSUcsIFN0b3JlRGV2dG9vbHNDb25maWcgfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgeyBEZXZ0b29sc0V4dGVuc2lvbiB9IGZyb20gJy4vZXh0ZW5zaW9uJztcbmltcG9ydCB7IExpZnRlZFN0YXRlLCBsaWZ0SW5pdGlhbFN0YXRlLCBsaWZ0UmVkdWNlcldpdGggfSBmcm9tICcuL3JlZHVjZXInO1xuaW1wb3J0IHtcbiAgbGlmdEFjdGlvbixcbiAgdW5saWZ0U3RhdGUsXG4gIHNob3VsZEZpbHRlckFjdGlvbnMsXG4gIGZpbHRlckxpZnRlZFN0YXRlLFxufSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IERldnRvb2xzRGlzcGF0Y2hlciB9IGZyb20gJy4vZGV2dG9vbHMtZGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBQRVJGT1JNX0FDVElPTiB9IGZyb20gJy4vYWN0aW9ucyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTdG9yZURldnRvb2xzIGltcGxlbWVudHMgT2JzZXJ2ZXI8YW55PiwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBsaWZ0ZWRTdGF0ZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcml2YXRlIGV4dGVuc2lvblN0YXJ0U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHB1YmxpYyBkaXNwYXRjaGVyOiBBY3Rpb25zU3ViamVjdDtcbiAgcHVibGljIGxpZnRlZFN0YXRlOiBPYnNlcnZhYmxlPExpZnRlZFN0YXRlPjtcbiAgcHVibGljIHN0YXRlOiBTdGF0ZU9ic2VydmFibGU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZGlzcGF0Y2hlcjogRGV2dG9vbHNEaXNwYXRjaGVyLFxuICAgIGFjdGlvbnMkOiBBY3Rpb25zU3ViamVjdCxcbiAgICByZWR1Y2VycyQ6IFJlZHVjZXJPYnNlcnZhYmxlLFxuICAgIGV4dGVuc2lvbjogRGV2dG9vbHNFeHRlbnNpb24sXG4gICAgc2Nhbm5lZEFjdGlvbnM6IFNjYW5uZWRBY3Rpb25zU3ViamVjdCxcbiAgICBlcnJvckhhbmRsZXI6IEVycm9ySGFuZGxlcixcbiAgICBASW5qZWN0KElOSVRJQUxfU1RBVEUpIGluaXRpYWxTdGF0ZTogYW55LFxuICAgIEBJbmplY3QoU1RPUkVfREVWVE9PTFNfQ09ORklHKSBjb25maWc6IFN0b3JlRGV2dG9vbHNDb25maWdcbiAgKSB7XG4gICAgY29uc3QgbGlmdGVkSW5pdGlhbFN0YXRlID0gbGlmdEluaXRpYWxTdGF0ZShpbml0aWFsU3RhdGUsIGNvbmZpZy5tb25pdG9yKTtcbiAgICBjb25zdCBsaWZ0UmVkdWNlciA9IGxpZnRSZWR1Y2VyV2l0aChcbiAgICAgIGluaXRpYWxTdGF0ZSxcbiAgICAgIGxpZnRlZEluaXRpYWxTdGF0ZSxcbiAgICAgIGVycm9ySGFuZGxlcixcbiAgICAgIGNvbmZpZy5tb25pdG9yLFxuICAgICAgY29uZmlnXG4gICAgKTtcblxuICAgIGNvbnN0IGxpZnRlZEFjdGlvbiQgPSBtZXJnZShcbiAgICAgIG1lcmdlKGFjdGlvbnMkLmFzT2JzZXJ2YWJsZSgpLnBpcGUoc2tpcCgxKSksIGV4dGVuc2lvbi5hY3Rpb25zJCkucGlwZShcbiAgICAgICAgbWFwKGxpZnRBY3Rpb24pXG4gICAgICApLFxuICAgICAgZGlzcGF0Y2hlcixcbiAgICAgIGV4dGVuc2lvbi5saWZ0ZWRBY3Rpb25zJFxuICAgICkucGlwZShvYnNlcnZlT24ocXVldWVTY2hlZHVsZXIpKTtcblxuICAgIGNvbnN0IGxpZnRlZFJlZHVjZXIkID0gcmVkdWNlcnMkLnBpcGUobWFwKGxpZnRSZWR1Y2VyKSk7XG5cbiAgICBjb25zdCBsaWZ0ZWRTdGF0ZVN1YmplY3QgPSBuZXcgUmVwbGF5U3ViamVjdDxMaWZ0ZWRTdGF0ZT4oMSk7XG5cbiAgICB0aGlzLmxpZnRlZFN0YXRlU3Vic2NyaXB0aW9uID0gbGlmdGVkQWN0aW9uJFxuICAgICAgLnBpcGUoXG4gICAgICAgIHdpdGhMYXRlc3RGcm9tKGxpZnRlZFJlZHVjZXIkKSxcbiAgICAgICAgc2NhbjxcbiAgICAgICAgICBbYW55LCBBY3Rpb25SZWR1Y2VyPExpZnRlZFN0YXRlLCBBY3Rpb25zLkFsbD5dLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YXRlOiBMaWZ0ZWRTdGF0ZTtcbiAgICAgICAgICAgIGFjdGlvbjogYW55O1xuICAgICAgICAgIH1cbiAgICAgICAgPihcbiAgICAgICAgICAoeyBzdGF0ZTogbGlmdGVkU3RhdGUgfSwgW2FjdGlvbiwgcmVkdWNlcl0pID0+IHtcbiAgICAgICAgICAgIGxldCByZWR1Y2VkTGlmdGVkU3RhdGUgPSByZWR1Y2VyKGxpZnRlZFN0YXRlLCBhY3Rpb24pO1xuICAgICAgICAgICAgLy8gT24gZnVsbCBzdGF0ZSB1cGRhdGVcbiAgICAgICAgICAgIC8vIElmIHdlIGhhdmUgYWN0aW9ucyBmaWx0ZXJzLCB3ZSBtdXN0IGZpbHRlciBjb21wbGV0ZWx5IG91ciBsaWZ0ZWQgc3RhdGUgdG8gYmUgc3luYyB3aXRoIHRoZSBleHRlbnNpb25cbiAgICAgICAgICAgIGlmIChhY3Rpb24udHlwZSAhPT0gUEVSRk9STV9BQ1RJT04gJiYgc2hvdWxkRmlsdGVyQWN0aW9ucyhjb25maWcpKSB7XG4gICAgICAgICAgICAgIHJlZHVjZWRMaWZ0ZWRTdGF0ZSA9IGZpbHRlckxpZnRlZFN0YXRlKFxuICAgICAgICAgICAgICAgIHJlZHVjZWRMaWZ0ZWRTdGF0ZSxcbiAgICAgICAgICAgICAgICBjb25maWcucHJlZGljYXRlLFxuICAgICAgICAgICAgICAgIGNvbmZpZy5hY3Rpb25zU2FmZWxpc3QsXG4gICAgICAgICAgICAgICAgY29uZmlnLmFjdGlvbnNCbG9ja2xpc3RcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEV4dGVuc2lvbiBzaG91bGQgYmUgc2VudCB0aGUgc2FuaXRpemVkIGxpZnRlZCBzdGF0ZVxuICAgICAgICAgICAgZXh0ZW5zaW9uLm5vdGlmeShhY3Rpb24sIHJlZHVjZWRMaWZ0ZWRTdGF0ZSk7XG4gICAgICAgICAgICByZXR1cm4geyBzdGF0ZTogcmVkdWNlZExpZnRlZFN0YXRlLCBhY3Rpb24gfTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHsgc3RhdGU6IGxpZnRlZEluaXRpYWxTdGF0ZSwgYWN0aW9uOiBudWxsIGFzIGFueSB9XG4gICAgICAgIClcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKHsgc3RhdGUsIGFjdGlvbiB9KSA9PiB7XG4gICAgICAgIGxpZnRlZFN0YXRlU3ViamVjdC5uZXh0KHN0YXRlKTtcblxuICAgICAgICBpZiAoYWN0aW9uLnR5cGUgPT09IEFjdGlvbnMuUEVSRk9STV9BQ1RJT04pIHtcbiAgICAgICAgICBjb25zdCB1bmxpZnRlZEFjdGlvbiA9IChhY3Rpb24gYXMgQWN0aW9ucy5QZXJmb3JtQWN0aW9uKS5hY3Rpb247XG5cbiAgICAgICAgICBzY2FubmVkQWN0aW9ucy5uZXh0KHVubGlmdGVkQWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB0aGlzLmV4dGVuc2lvblN0YXJ0U3Vic2NyaXB0aW9uID0gZXh0ZW5zaW9uLnN0YXJ0JC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBsaWZ0ZWRTdGF0ZSQgPVxuICAgICAgbGlmdGVkU3RhdGVTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpIGFzIE9ic2VydmFibGU8TGlmdGVkU3RhdGU+O1xuICAgIGNvbnN0IHN0YXRlJCA9IGxpZnRlZFN0YXRlJC5waXBlKG1hcCh1bmxpZnRTdGF0ZSkpIGFzIFN0YXRlT2JzZXJ2YWJsZTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc3RhdGUkLCAnc3RhdGUnLCB7XG4gICAgICB2YWx1ZTogdG9TaWduYWwoc3RhdGUkLCB7IG1hbnVhbENsZWFudXA6IHRydWUsIHJlcXVpcmVTeW5jOiB0cnVlIH0pLFxuICAgIH0pO1xuXG4gICAgdGhpcy5kaXNwYXRjaGVyID0gZGlzcGF0Y2hlcjtcbiAgICB0aGlzLmxpZnRlZFN0YXRlID0gbGlmdGVkU3RhdGUkO1xuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZSQ7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAvLyBFdmVuIHRob3VnaCB0aGUgc3RvcmUgZGV2dG9vbHMgcGx1Z2luIGlzIHJlY29tbWVuZGVkIHRvIGJlXG4gICAgLy8gdXNlZCBvbmx5IGluIGRldmVsb3BtZW50IG1vZGUsIGl0IGNhbiBzdGlsbCBjYXVzZSBhIG1lbW9yeSBsZWFrXG4gICAgLy8gaW4gbWljcm9mcm9udGVuZCBhcHBsaWNhdGlvbnMgdGhhdCBhcmUgYmVpbmcgY3JlYXRlZCBhbmQgZGVzdHJveWVkXG4gICAgLy8gbXVsdGlwbGUgdGltZXMgZHVyaW5nIGRldmVsb3BtZW50LiBUaGlzIHJlc3VsdHMgaW4gZXhjZXNzaXZlIG1lbW9yeVxuICAgIC8vIGNvbnN1bXB0aW9uLCBhcyBpdCBwcmV2ZW50cyBlbnRpcmUgYXBwcyBmcm9tIGJlaW5nIGdhcmJhZ2UgY29sbGVjdGVkLlxuICAgIHRoaXMubGlmdGVkU3RhdGVTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLmV4dGVuc2lvblN0YXJ0U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBkaXNwYXRjaChhY3Rpb246IEFjdGlvbikge1xuICAgIHRoaXMuZGlzcGF0Y2hlci5uZXh0KGFjdGlvbik7XG4gIH1cblxuICBuZXh0KGFjdGlvbjogYW55KSB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLm5leHQoYWN0aW9uKTtcbiAgfVxuXG4gIGVycm9yKGVycm9yOiBhbnkpIHt9XG5cbiAgY29tcGxldGUoKSB7fVxuXG4gIHBlcmZvcm1BY3Rpb24oYWN0aW9uOiBhbnkpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLlBlcmZvcm1BY3Rpb24oYWN0aW9uLCArRGF0ZS5ub3coKSkpO1xuICB9XG5cbiAgcmVmcmVzaCgpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLlJlZnJlc2goKSk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLlJlc2V0KCtEYXRlLm5vdygpKSk7XG4gIH1cblxuICByb2xsYmFjaygpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLlJvbGxiYWNrKCtEYXRlLm5vdygpKSk7XG4gIH1cblxuICBjb21taXQoKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5Db21taXQoK0RhdGUubm93KCkpKTtcbiAgfVxuXG4gIHN3ZWVwKCkge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuU3dlZXAoKSk7XG4gIH1cblxuICB0b2dnbGVBY3Rpb24oaWQ6IG51bWJlcikge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuVG9nZ2xlQWN0aW9uKGlkKSk7XG4gIH1cblxuICBqdW1wVG9BY3Rpb24oYWN0aW9uSWQ6IG51bWJlcikge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuSnVtcFRvQWN0aW9uKGFjdGlvbklkKSk7XG4gIH1cblxuICBqdW1wVG9TdGF0ZShpbmRleDogbnVtYmVyKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5KdW1wVG9TdGF0ZShpbmRleCkpO1xuICB9XG5cbiAgaW1wb3J0U3RhdGUobmV4dExpZnRlZFN0YXRlOiBhbnkpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLkltcG9ydFN0YXRlKG5leHRMaWZ0ZWRTdGF0ZSkpO1xuICB9XG5cbiAgbG9ja0NoYW5nZXMoc3RhdHVzOiBib29sZWFuKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5Mb2NrQ2hhbmdlcyhzdGF0dXMpKTtcbiAgfVxuXG4gIHBhdXNlUmVjb3JkaW5nKHN0YXR1czogYm9vbGVhbikge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuUGF1c2VSZWNvcmRpbmcoc3RhdHVzKSk7XG4gIH1cbn1cbiJdfQ==