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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2dG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3N0b3JlLWRldnRvb2xzL3NyYy9kZXZ0b29scy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBMkIsTUFBTSxlQUFlLENBQUM7QUFDNUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3RELE9BQU8sRUFJTCxhQUFhLEdBSWQsTUFBTSxhQUFhLENBQUM7QUFDckIsT0FBTyxFQUNMLEtBQUssRUFHTCxjQUFjLEVBQ2QsYUFBYSxHQUVkLE1BQU0sTUFBTSxDQUFDO0FBQ2QsT0FBTyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU1RSxPQUFPLEtBQUssT0FBTyxNQUFNLFdBQVcsQ0FBQztBQUNyQyxPQUFPLEVBQUUscUJBQXFCLEVBQXVCLE1BQU0sVUFBVSxDQUFDO0FBRXRFLE9BQU8sRUFBZSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDM0UsT0FBTyxFQUNMLFVBQVUsRUFDVixXQUFXLEVBQ1gsbUJBQW1CLEVBQ25CLGlCQUFpQixHQUNsQixNQUFNLFNBQVMsQ0FBQztBQUVqQixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sV0FBVyxDQUFDOzs7Ozs7QUFFM0MsTUFDYSxhQUFhO0lBT3hCLFlBQ0UsVUFBOEIsRUFDOUIsUUFBd0IsRUFDeEIsU0FBNEIsRUFDNUIsU0FBNEIsRUFDNUIsY0FBcUMsRUFDckMsWUFBMEIsRUFDSCxZQUFpQixFQUNULE1BQTJCO1FBRTFELE1BQU0sa0JBQWtCLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxRSxNQUFNLFdBQVcsR0FBRyxlQUFlLENBQ2pDLFlBQVksRUFD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IHsgSW5qZWN0YWJsZSwgSW5qZWN0LCBFcnJvckhhbmRsZXIsIE9uRGVzdHJveSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgdG9TaWduYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlL3J4anMtaW50ZXJvcCc7XG5pbXBvcnQge1xuICBBY3Rpb24sXG4gIEFjdGlvblJlZHVjZXIsXG4gIEFjdGlvbnNTdWJqZWN0LFxuICBJTklUSUFMX1NUQVRFLFxuICBSZWR1Y2VyT2JzZXJ2YWJsZSxcbiAgU2Nhbm5lZEFjdGlvbnNTdWJqZWN0LFxuICBTdGF0ZU9ic2VydmFibGUsXG59IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7XG4gIG1lcmdlLFxuICBPYnNlcnZhYmxlLFxuICBPYnNlcnZlcixcbiAgcXVldWVTY2hlZHVsZXIsXG4gIFJlcGxheVN1YmplY3QsXG4gIFN1YnNjcmlwdGlvbixcbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAsIG9ic2VydmVPbiwgc2Nhbiwgc2tpcCwgd2l0aExhdGVzdEZyb20gfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCAqIGFzIEFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7IFNUT1JFX0RFVlRPT0xTX0NPTkZJRywgU3RvcmVEZXZ0b29sc0NvbmZpZyB9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7IERldnRvb2xzRXh0ZW5zaW9uIH0gZnJvbSAnLi9leHRlbnNpb24nO1xuaW1wb3J0IHsgTGlmdGVkU3RhdGUsIGxpZnRJbml0aWFsU3RhdGUsIGxpZnRSZWR1Y2VyV2l0aCB9IGZyb20gJy4vcmVkdWNlcic7XG5pbXBvcnQge1xuICBsaWZ0QWN0aW9uLFxuICB1bmxpZnRTdGF0ZSxcbiAgc2hvdWxkRmlsdGVyQWN0aW9ucyxcbiAgZmlsdGVyTGlmdGVkU3RhdGUsXG59IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgRGV2dG9vbHNEaXNwYXRjaGVyIH0gZnJvbSAnLi9kZXZ0b29scy1kaXNwYXRjaGVyJztcbmltcG9ydCB7IFBFUkZPUk1fQUNUSU9OIH0gZnJvbSAnLi9hY3Rpb25zJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0b3JlRGV2dG9vbHMgaW1wbGVtZW50cyBPYnNlcnZlcjxhbnk+LCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIGxpZnRlZFN0YXRlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgZXh0ZW5zaW9uU3RhcnRTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHVibGljIGRpc3BhdGNoZXI6IEFjdGlvbnNTdWJqZWN0O1xuICBwdWJsaWMgbGlmdGVkU3RhdGU6IE9ic2VydmFibGU8TGlmdGVkU3RhdGU+O1xuICBwdWJsaWMgc3RhdGU6IFN0YXRlT2JzZXJ2YWJsZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBkaXNwYXRjaGVyOiBEZXZ0b29sc0Rpc3BhdGNoZXIsXG4gICAgYWN0aW9ucyQ6IEFjdGlvbnNTdWJqZWN0LFxuICAgIHJlZHVjZXJzJDogUmVkdWNlck9ic2VydmFibGUsXG4gICAgZXh0ZW5zaW9uOiBEZXZ0b29sc0V4dGVuc2lvbixcbiAgICBzY2FubmVkQWN0aW9uczogU2Nhbm5lZEFjdGlvbnNTdWJqZWN0LFxuICAgIGVycm9ySGFuZGxlcjogRXJyb3JIYW5kbGVyLFxuICAgIEBJbmplY3QoSU5JVElBTF9TVEFURSkgaW5pdGlhbFN0YXRlOiBhbnksXG4gICAgQEluamVjdChTVE9SRV9ERVZUT09MU19DT05GSUcpIGNvbmZpZzogU3RvcmVEZXZ0b29sc0NvbmZpZ1xuICApIHtcbiAgICBjb25zdCBsaWZ0ZWRJbml0aWFsU3RhdGUgPSBsaWZ0SW5pdGlhbFN0YXRlKGluaXRpYWxTdGF0ZSwgY29uZmlnLm1vbml0b3IpO1xuICAgIGNvbnN0IGxpZnRSZWR1Y2VyID0gbGlmdFJlZHVjZXJXaXRoKFxuICAgICAgaW5pdGlhbFN0YXRlLFxuICAgICAgbGlmdGVkSW5pdGlhbFN0YXRlLFxuICAgICAgZXJyb3JIYW5kbGVyLFxuICAgICAgY29uZmlnLm1vbml0b3IsXG4gICAgICBjb25maWdcbiAgICApO1xuXG4gICAgY29uc3QgbGlmdGVkQWN0aW9uJCA9IG1lcmdlKFxuICAgICAgbWVyZ2UoYWN0aW9ucyQuYXNPYnNlcnZhYmxlKCkucGlwZShza2lwKDEpKSwgZXh0ZW5zaW9uLmFjdGlvbnMkKS5waXBlKFxuICAgICAgICBtYXAobGlmdEFjdGlvbilcbiAgICAgICksXG4gICAgICBkaXNwYXRjaGVyLFxuICAgICAgZXh0ZW5zaW9uLmxpZnRlZEFjdGlvbnMkXG4gICAgKS5waXBlKG9ic2VydmVPbihxdWV1ZVNjaGVkdWxlcikpO1xuXG4gICAgY29uc3QgbGlmdGVkUmVkdWNlciQgPSByZWR1Y2VycyQucGlwZShtYXAobGlmdFJlZHVjZXIpKTtcblxuICAgIGNvbnN0IGxpZnRlZFN0YXRlU3ViamVjdCA9IG5ldyBSZXBsYXlTdWJqZWN0PExpZnRlZFN0YXRlPigxKTtcblxuICAgIHRoaXMubGlmdGVkU3RhdGVTdWJzY3JpcHRpb24gPSBsaWZ0ZWRBY3Rpb24kXG4gICAgICAucGlwZShcbiAgICAgICAgd2l0aExhdGVzdEZyb20obGlmdGVkUmVkdWNlciQpLFxuICAgICAgICBzY2FuPFxuICAgICAgICAgIFthbnksIEFjdGlvblJlZHVjZXI8TGlmdGVkU3RhdGUsIEFjdGlvbnMuQWxsPl0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhdGU6IExpZnRlZFN0YXRlO1xuICAgICAgICAgICAgYWN0aW9uOiBhbnk7XG4gICAgICAgICAgfVxuICAgICAgICA+KFxuICAgICAgICAgICh7IHN0YXRlOiBsaWZ0ZWRTdGF0ZSB9LCBbYWN0aW9uLCByZWR1Y2VyXSkgPT4ge1xuICAgICAgICAgICAgbGV0IHJlZHVjZWRMaWZ0ZWRTdGF0ZSA9IHJlZHVjZXIobGlmdGVkU3RhdGUsIGFjdGlvbik7XG4gICAgICAgICAgICAvLyBPbiBmdWxsIHN0YXRlIHVwZGF0ZVxuICAgICAgICAgICAgLy8gSWYgd2UgaGF2ZSBhY3Rpb25zIGZpbHRlcnMsIHdlIG11c3QgZmlsdGVyIGNvbXBsZXRlbHkgb3VyIGxpZnRlZCBzdGF0ZSB0byBiZSBzeW5jIHdpdGggdGhlIGV4dGVuc2lvblxuICAgICAgICAgICAgaWYgKGFjdGlvbi50eXBlICE9PSBQRVJGT1JNX0FDVElPTiAmJiBzaG91bGRGaWx0ZXJBY3Rpb25zKGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgcmVkdWNlZExpZnRlZFN0YXRlID0gZmlsdGVyTGlmdGVkU3RhdGUoXG4gICAgICAgICAgICAgICAgcmVkdWNlZExpZnRlZFN0YXRlLFxuICAgICAgICAgICAgICAgIGNvbmZpZy5wcmVkaWNhdGUsXG4gICAgICAgICAgICAgICAgY29uZmlnLmFjdGlvbnNTYWZlbGlzdCxcbiAgICAgICAgICAgICAgICBjb25maWcuYWN0aW9uc0Jsb2NrbGlzdFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRXh0ZW5zaW9uIHNob3VsZCBiZSBzZW50IHRoZSBzYW5pdGl6ZWQgbGlmdGVkIHN0YXRlXG4gICAgICAgICAgICBleHRlbnNpb24ubm90aWZ5KGFjdGlvbiwgcmVkdWNlZExpZnRlZFN0YXRlKTtcbiAgICAgICAgICAgIHJldHVybiB7IHN0YXRlOiByZWR1Y2VkTGlmdGVkU3RhdGUsIGFjdGlvbiB9O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgeyBzdGF0ZTogbGlmdGVkSW5pdGlhbFN0YXRlLCBhY3Rpb246IG51bGwgYXMgYW55IH1cbiAgICAgICAgKVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoeyBzdGF0ZSwgYWN0aW9uIH0pID0+IHtcbiAgICAgICAgbGlmdGVkU3RhdGVTdWJqZWN0Lm5leHQoc3RhdGUpO1xuXG4gICAgICAgIGlmIChhY3Rpb24udHlwZSA9PT0gQWN0aW9ucy5QRVJGT1JNX0FDVElPTikge1xuICAgICAgICAgIGNvbnN0IHVubGlmdGVkQWN0aW9uID0gKGFjdGlvbiBhcyBBY3Rpb25zLlBlcmZvcm1BY3Rpb24pLmFjdGlvbjtcblxuICAgICAgICAgIHNjYW5uZWRBY3Rpb25zLm5leHQodW5saWZ0ZWRBY3Rpb24pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHRoaXMuZXh0ZW5zaW9uU3RhcnRTdWJzY3JpcHRpb24gPSBleHRlbnNpb24uc3RhcnQkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnJlZnJlc2goKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGxpZnRlZFN0YXRlJCA9XG4gICAgICBsaWZ0ZWRTdGF0ZVN1YmplY3QuYXNPYnNlcnZhYmxlKCkgYXMgT2JzZXJ2YWJsZTxMaWZ0ZWRTdGF0ZT47XG4gICAgY29uc3Qgc3RhdGUkID0gbGlmdGVkU3RhdGUkLnBpcGUobWFwKHVubGlmdFN0YXRlKSkgYXMgU3RhdGVPYnNlcnZhYmxlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzdGF0ZSQsICdzdGF0ZScsIHtcbiAgICAgIHZhbHVlOiB0b1NpZ25hbChzdGF0ZSQsIHsgbWFudWFsQ2xlYW51cDogdHJ1ZSwgcmVxdWlyZVN5bmM6IHRydWUgfSksXG4gICAgfSk7XG5cbiAgICB0aGlzLmRpc3BhdGNoZXIgPSBkaXNwYXRjaGVyO1xuICAgIHRoaXMubGlmdGVkU3RhdGUgPSBsaWZ0ZWRTdGF0ZSQ7XG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlJDtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIC8vIEV2ZW4gdGhvdWdoIHRoZSBzdG9yZSBkZXZ0b29scyBwbHVnaW4gaXMgcmVjb21tZW5kZWQgdG8gYmVcbiAgICAvLyB1c2VkIG9ubHkgaW4gZGV2ZWxvcG1lbnQgbW9kZSwgaXQgY2FuIHN0aWxsIGNhdXNlIGEgbWVtb3J5IGxlYWtcbiAgICAvLyBpbiBtaWNyb2Zyb250ZW5kIGFwcGxpY2F0aW9ucyB0aGF0IGFyZSBiZWluZyBjcmVhdGVkIGFuZCBkZXN0cm95ZWRcbiAgICAvLyBtdWx0aXBsZSB0aW1lcyBkdXJpbmcgZGV2ZWxvcG1lbnQuIFRoaXMgcmVzdWx0cyBpbiBleGNlc3NpdmUgbWVtb3J5XG4gICAgLy8gY29uc3VtcHRpb24sIGFzIGl0IHByZXZlbnRzIGVudGlyZSBhcHBzIGZyb20gYmVpbmcgZ2FyYmFnZSBjb2xsZWN0ZWQuXG4gICAgdGhpcy5saWZ0ZWRTdGF0ZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuZXh0ZW5zaW9uU3RhcnRTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIGRpc3BhdGNoKGFjdGlvbjogQWN0aW9uKSB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLm5leHQoYWN0aW9uKTtcbiAgfVxuXG4gIG5leHQoYWN0aW9uOiBhbnkpIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIubmV4dChhY3Rpb24pO1xuICB9XG5cbiAgZXJyb3IoZXJyb3I6IGFueSkge31cblxuICBjb21wbGV0ZSgpIHt9XG5cbiAgcGVyZm9ybUFjdGlvbihhY3Rpb246IGFueSkge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuUGVyZm9ybUFjdGlvbihhY3Rpb24sICtEYXRlLm5vdygpKSk7XG4gIH1cblxuICByZWZyZXNoKCkge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuUmVmcmVzaCgpKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuUmVzZXQoK0RhdGUubm93KCkpKTtcbiAgfVxuXG4gIHJvbGxiYWNrKCkge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuUm9sbGJhY2soK0RhdGUubm93KCkpKTtcbiAgfVxuXG4gIGNvbW1pdCgpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLkNvbW1pdCgrRGF0ZS5ub3coKSkpO1xuICB9XG5cbiAgc3dlZXAoKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5Td2VlcCgpKTtcbiAgfVxuXG4gIHRvZ2dsZUFjdGlvbihpZDogbnVtYmVyKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5Ub2dnbGVBY3Rpb24oaWQpKTtcbiAgfVxuXG4gIGp1bXBUb0FjdGlvbihhY3Rpb25JZDogbnVtYmVyKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5KdW1wVG9BY3Rpb24oYWN0aW9uSWQpKTtcbiAgfVxuXG4gIGp1bXBUb1N0YXRlKGluZGV4OiBudW1iZXIpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLkp1bXBUb1N0YXRlKGluZGV4KSk7XG4gIH1cblxuICBpbXBvcnRTdGF0ZShuZXh0TGlmdGVkU3RhdGU6IGFueSkge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuSW1wb3J0U3RhdGUobmV4dExpZnRlZFN0YXRlKSk7XG4gIH1cblxuICBsb2NrQ2hhbmdlcyhzdGF0dXM6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLkxvY2tDaGFuZ2VzKHN0YXR1cykpO1xuICB9XG5cbiAgcGF1c2VSZWNvcmRpbmcoc3RhdHVzOiBib29sZWFuKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5QYXVzZVJlY29yZGluZyhzdGF0dXMpKTtcbiAgfVxufVxuIl19