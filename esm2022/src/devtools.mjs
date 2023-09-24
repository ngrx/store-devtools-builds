import { Injectable, Inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { INITIAL_STATE, } from '@ngrx/store';
import { merge, Observable, queueScheduler, ReplaySubject, } from 'rxjs';
import { map, observeOn, scan, skip, withLatestFrom } from 'rxjs/operators';
import * as Actions from './actions';
import { STORE_DEVTOOLS_CONFIG } from './config';
import { liftInitialState, liftReducerWith } from './reducer';
import { liftAction, unliftState, shouldFilterActions, filterLiftedState, } from './utils';
import { PERFORM_ACTION } from './actions';
import { injectZoneConfig } from './zone-config';
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
        const zoneConfig = injectZoneConfig(config.connectOutsideZone);
        const liftedStateSubject = new ReplaySubject(1);
        this.liftedStateSubscription = liftedAction$
            .pipe(withLatestFrom(liftedReducer$), 
        // The extension would post messages back outside of the Angular zone
        // because we call `connect()` wrapped with `runOutsideAngular`. We run change
        // detection only once at the end after all the required asynchronous tasks have
        // been processed (for instance, `setInterval` scheduled by the `timeout` operator).
        // We have to re-enter the Angular zone before the `scan` since it runs the reducer
        // which must be run within the Angular zone.
        emitInZone(zoneConfig), scan(({ state: liftedState }, [action, reducer]) => {
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
        this.extensionStartSubscription = extension.start$
            .pipe(emitInZone(zoneConfig))
            .subscribe(() => {
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
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.3", ngImport: i0, type: StoreDevtools, deps: [{ token: i1.DevtoolsDispatcher }, { token: i2.ActionsSubject }, { token: i2.ReducerObservable }, { token: i3.DevtoolsExtension }, { token: i2.ScannedActionsSubject }, { token: i0.ErrorHandler }, { token: INITIAL_STATE }, { token: STORE_DEVTOOLS_CONFIG }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.3", ngImport: i0, type: StoreDevtools }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.3", ngImport: i0, type: StoreDevtools, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.DevtoolsDispatcher }, { type: i2.ActionsSubject }, { type: i2.ReducerObservable }, { type: i3.DevtoolsExtension }, { type: i2.ScannedActionsSubject }, { type: i0.ErrorHandler }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [INITIAL_STATE]
                }] }, { type: i4.StoreDevtoolsConfig, decorators: [{
                    type: Inject,
                    args: [STORE_DEVTOOLS_CONFIG]
                }] }]; } });
/**
 * If the devtools extension is connected out of the Angular zone,
 * this operator will emit all events within the zone.
 */
function emitInZone({ ngZone, connectOutsideZone, }) {
    return (source) => connectOutsideZone
        ? new Observable((subscriber) => source.subscribe({
            next: (value) => ngZone.run(() => subscriber.next(value)),
            error: (error) => ngZone.run(() => subscriber.error(error)),
            complete: () => ngZone.run(() => subscriber.complete()),
        }))
        : source;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2dG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3N0b3JlLWRldnRvb2xzL3NyYy9kZXZ0b29scy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBMkIsTUFBTSxlQUFlLENBQUM7QUFDNUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3RELE9BQU8sRUFJTCxhQUFhLEdBSWQsTUFBTSxhQUFhLENBQUM7QUFDckIsT0FBTyxFQUNMLEtBQUssRUFFTCxVQUFVLEVBRVYsY0FBYyxFQUNkLGFBQWEsR0FFZCxNQUFNLE1BQU0sQ0FBQztBQUNkLE9BQU8sRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFNUUsT0FBTyxLQUFLLE9BQU8sTUFBTSxXQUFXLENBQUM7QUFDckMsT0FBTyxFQUFFLHFCQUFxQixFQUF1QixNQUFNLFVBQVUsQ0FBQztBQUV0RSxPQUFPLEVBQWUsZ0JBQWdCLEVBQUUsZUFBZSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQzNFLE9BQU8sRUFDTCxVQUFVLEVBQ1YsV0FBVyxFQUNYLG1CQUFtQixFQUNuQixpQkFBaUIsR0FDbEIsTUFBTSxTQUFTLENBQUM7QUFFakIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUMzQyxPQUFPLEVBQWMsZ0JBQWdCLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7OztBQUc3RCxNQUFNLE9BQU8sYUFBYTtJQU94QixZQUNFLFVBQThCLEVBQzlCLFFBQXdCLEVBQ3hCLFNBQTRCLEVBQzVCLFNBQTRCLEVBQzVCLGNBQXFDLEVBQ3JDLFlBQTBCLEVBQ0gsWUFBaUIsRUFDVCxNQUEyQjtRQUUxRCxNQUFNLGtCQUFrQixHQUFHLGdCQUFnQixDQUFDLFlBQVksRUFBRSxNQUFNLENB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Q0FBQztJQUVELGNBQWMsQ0FBQyxNQUFlO1FBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDcEQsQ0FBQztpSUE1S1UsYUFBYSxxTkFjZCxhQUFhLGFBQ2IscUJBQXFCO3FJQWZwQixhQUFhOzsyRkFBYixhQUFhO2tCQUR6QixVQUFVOzswQkFlTixNQUFNOzJCQUFDLGFBQWE7OzBCQUNwQixNQUFNOzJCQUFDLHFCQUFxQjs7QUFnS2pDOzs7R0FHRztBQUNILFNBQVMsVUFBVSxDQUFJLEVBQ3JCLE1BQU0sRUFDTixrQkFBa0IsR0FDUDtJQUNYLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUNoQixrQkFBa0I7UUFDaEIsQ0FBQyxDQUFDLElBQUksVUFBVSxDQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FDL0IsTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUNmLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3pELEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNELFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUN4RCxDQUFDLENBQ0g7UUFDSCxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ2YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdCwgRXJyb3JIYW5kbGVyLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IHRvU2lnbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZS9yeGpzLWludGVyb3AnO1xuaW1wb3J0IHtcbiAgQWN0aW9uLFxuICBBY3Rpb25SZWR1Y2VyLFxuICBBY3Rpb25zU3ViamVjdCxcbiAgSU5JVElBTF9TVEFURSxcbiAgUmVkdWNlck9ic2VydmFibGUsXG4gIFNjYW5uZWRBY3Rpb25zU3ViamVjdCxcbiAgU3RhdGVPYnNlcnZhYmxlLFxufSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQge1xuICBtZXJnZSxcbiAgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLFxuICBPYnNlcnZhYmxlLFxuICBPYnNlcnZlcixcbiAgcXVldWVTY2hlZHVsZXIsXG4gIFJlcGxheVN1YmplY3QsXG4gIFN1YnNjcmlwdGlvbixcbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAsIG9ic2VydmVPbiwgc2Nhbiwgc2tpcCwgd2l0aExhdGVzdEZyb20gfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCAqIGFzIEFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7IFNUT1JFX0RFVlRPT0xTX0NPTkZJRywgU3RvcmVEZXZ0b29sc0NvbmZpZyB9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7IERldnRvb2xzRXh0ZW5zaW9uIH0gZnJvbSAnLi9leHRlbnNpb24nO1xuaW1wb3J0IHsgTGlmdGVkU3RhdGUsIGxpZnRJbml0aWFsU3RhdGUsIGxpZnRSZWR1Y2VyV2l0aCB9IGZyb20gJy4vcmVkdWNlcic7XG5pbXBvcnQge1xuICBsaWZ0QWN0aW9uLFxuICB1bmxpZnRTdGF0ZSxcbiAgc2hvdWxkRmlsdGVyQWN0aW9ucyxcbiAgZmlsdGVyTGlmdGVkU3RhdGUsXG59IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgRGV2dG9vbHNEaXNwYXRjaGVyIH0gZnJvbSAnLi9kZXZ0b29scy1kaXNwYXRjaGVyJztcbmltcG9ydCB7IFBFUkZPUk1fQUNUSU9OIH0gZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7IFpvbmVDb25maWcsIGluamVjdFpvbmVDb25maWcgfSBmcm9tICcuL3pvbmUtY29uZmlnJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0b3JlRGV2dG9vbHMgaW1wbGVtZW50cyBPYnNlcnZlcjxhbnk+LCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIGxpZnRlZFN0YXRlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgZXh0ZW5zaW9uU3RhcnRTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHVibGljIGRpc3BhdGNoZXI6IEFjdGlvbnNTdWJqZWN0O1xuICBwdWJsaWMgbGlmdGVkU3RhdGU6IE9ic2VydmFibGU8TGlmdGVkU3RhdGU+O1xuICBwdWJsaWMgc3RhdGU6IFN0YXRlT2JzZXJ2YWJsZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBkaXNwYXRjaGVyOiBEZXZ0b29sc0Rpc3BhdGNoZXIsXG4gICAgYWN0aW9ucyQ6IEFjdGlvbnNTdWJqZWN0LFxuICAgIHJlZHVjZXJzJDogUmVkdWNlck9ic2VydmFibGUsXG4gICAgZXh0ZW5zaW9uOiBEZXZ0b29sc0V4dGVuc2lvbixcbiAgICBzY2FubmVkQWN0aW9uczogU2Nhbm5lZEFjdGlvbnNTdWJqZWN0LFxuICAgIGVycm9ySGFuZGxlcjogRXJyb3JIYW5kbGVyLFxuICAgIEBJbmplY3QoSU5JVElBTF9TVEFURSkgaW5pdGlhbFN0YXRlOiBhbnksXG4gICAgQEluamVjdChTVE9SRV9ERVZUT09MU19DT05GSUcpIGNvbmZpZzogU3RvcmVEZXZ0b29sc0NvbmZpZ1xuICApIHtcbiAgICBjb25zdCBsaWZ0ZWRJbml0aWFsU3RhdGUgPSBsaWZ0SW5pdGlhbFN0YXRlKGluaXRpYWxTdGF0ZSwgY29uZmlnLm1vbml0b3IpO1xuICAgIGNvbnN0IGxpZnRSZWR1Y2VyID0gbGlmdFJlZHVjZXJXaXRoKFxuICAgICAgaW5pdGlhbFN0YXRlLFxuICAgICAgbGlmdGVkSW5pdGlhbFN0YXRlLFxuICAgICAgZXJyb3JIYW5kbGVyLFxuICAgICAgY29uZmlnLm1vbml0b3IsXG4gICAgICBjb25maWdcbiAgICApO1xuXG4gICAgY29uc3QgbGlmdGVkQWN0aW9uJCA9IG1lcmdlKFxuICAgICAgbWVyZ2UoYWN0aW9ucyQuYXNPYnNlcnZhYmxlKCkucGlwZShza2lwKDEpKSwgZXh0ZW5zaW9uLmFjdGlvbnMkKS5waXBlKFxuICAgICAgICBtYXAobGlmdEFjdGlvbilcbiAgICAgICksXG4gICAgICBkaXNwYXRjaGVyLFxuICAgICAgZXh0ZW5zaW9uLmxpZnRlZEFjdGlvbnMkXG4gICAgKS5waXBlKG9ic2VydmVPbihxdWV1ZVNjaGVkdWxlcikpO1xuXG4gICAgY29uc3QgbGlmdGVkUmVkdWNlciQgPSByZWR1Y2VycyQucGlwZShtYXAobGlmdFJlZHVjZXIpKTtcblxuICAgIGNvbnN0IHpvbmVDb25maWcgPSBpbmplY3Rab25lQ29uZmlnKGNvbmZpZy5jb25uZWN0T3V0c2lkZVpvbmUhKTtcblxuICAgIGNvbnN0IGxpZnRlZFN0YXRlU3ViamVjdCA9IG5ldyBSZXBsYXlTdWJqZWN0PExpZnRlZFN0YXRlPigxKTtcblxuICAgIHRoaXMubGlmdGVkU3RhdGVTdWJzY3JpcHRpb24gPSBsaWZ0ZWRBY3Rpb24kXG4gICAgICAucGlwZShcbiAgICAgICAgd2l0aExhdGVzdEZyb20obGlmdGVkUmVkdWNlciQpLFxuICAgICAgICAvLyBUaGUgZXh0ZW5zaW9uIHdvdWxkIHBvc3QgbWVzc2FnZXMgYmFjayBvdXRzaWRlIG9mIHRoZSBBbmd1bGFyIHpvbmVcbiAgICAgICAgLy8gYmVjYXVzZSB3ZSBjYWxsIGBjb25uZWN0KClgIHdyYXBwZWQgd2l0aCBgcnVuT3V0c2lkZUFuZ3VsYXJgLiBXZSBydW4gY2hhbmdlXG4gICAgICAgIC8vIGRldGVjdGlvbiBvbmx5IG9uY2UgYXQgdGhlIGVuZCBhZnRlciBhbGwgdGhlIHJlcXVpcmVkIGFzeW5jaHJvbm91cyB0YXNrcyBoYXZlXG4gICAgICAgIC8vIGJlZW4gcHJvY2Vzc2VkIChmb3IgaW5zdGFuY2UsIGBzZXRJbnRlcnZhbGAgc2NoZWR1bGVkIGJ5IHRoZSBgdGltZW91dGAgb3BlcmF0b3IpLlxuICAgICAgICAvLyBXZSBoYXZlIHRvIHJlLWVudGVyIHRoZSBBbmd1bGFyIHpvbmUgYmVmb3JlIHRoZSBgc2NhbmAgc2luY2UgaXQgcnVucyB0aGUgcmVkdWNlclxuICAgICAgICAvLyB3aGljaCBtdXN0IGJlIHJ1biB3aXRoaW4gdGhlIEFuZ3VsYXIgem9uZS5cbiAgICAgICAgZW1pdEluWm9uZSh6b25lQ29uZmlnKSxcbiAgICAgICAgc2NhbjxcbiAgICAgICAgICBbYW55LCBBY3Rpb25SZWR1Y2VyPExpZnRlZFN0YXRlLCBBY3Rpb25zLkFsbD5dLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YXRlOiBMaWZ0ZWRTdGF0ZTtcbiAgICAgICAgICAgIGFjdGlvbjogYW55O1xuICAgICAgICAgIH1cbiAgICAgICAgPihcbiAgICAgICAgICAoeyBzdGF0ZTogbGlmdGVkU3RhdGUgfSwgW2FjdGlvbiwgcmVkdWNlcl0pID0+IHtcbiAgICAgICAgICAgIGxldCByZWR1Y2VkTGlmdGVkU3RhdGUgPSByZWR1Y2VyKGxpZnRlZFN0YXRlLCBhY3Rpb24pO1xuICAgICAgICAgICAgLy8gT24gZnVsbCBzdGF0ZSB1cGRhdGVcbiAgICAgICAgICAgIC8vIElmIHdlIGhhdmUgYWN0aW9ucyBmaWx0ZXJzLCB3ZSBtdXN0IGZpbHRlciBjb21wbGV0ZWx5IG91ciBsaWZ0ZWQgc3RhdGUgdG8gYmUgc3luYyB3aXRoIHRoZSBleHRlbnNpb25cbiAgICAgICAgICAgIGlmIChhY3Rpb24udHlwZSAhPT0gUEVSRk9STV9BQ1RJT04gJiYgc2hvdWxkRmlsdGVyQWN0aW9ucyhjb25maWcpKSB7XG4gICAgICAgICAgICAgIHJlZHVjZWRMaWZ0ZWRTdGF0ZSA9IGZpbHRlckxpZnRlZFN0YXRlKFxuICAgICAgICAgICAgICAgIHJlZHVjZWRMaWZ0ZWRTdGF0ZSxcbiAgICAgICAgICAgICAgICBjb25maWcucHJlZGljYXRlLFxuICAgICAgICAgICAgICAgIGNvbmZpZy5hY3Rpb25zU2FmZWxpc3QsXG4gICAgICAgICAgICAgICAgY29uZmlnLmFjdGlvbnNCbG9ja2xpc3RcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEV4dGVuc2lvbiBzaG91bGQgYmUgc2VudCB0aGUgc2FuaXRpemVkIGxpZnRlZCBzdGF0ZVxuICAgICAgICAgICAgZXh0ZW5zaW9uLm5vdGlmeShhY3Rpb24sIHJlZHVjZWRMaWZ0ZWRTdGF0ZSk7XG4gICAgICAgICAgICByZXR1cm4geyBzdGF0ZTogcmVkdWNlZExpZnRlZFN0YXRlLCBhY3Rpb24gfTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHsgc3RhdGU6IGxpZnRlZEluaXRpYWxTdGF0ZSwgYWN0aW9uOiBudWxsIGFzIGFueSB9XG4gICAgICAgIClcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKHsgc3RhdGUsIGFjdGlvbiB9KSA9PiB7XG4gICAgICAgIGxpZnRlZFN0YXRlU3ViamVjdC5uZXh0KHN0YXRlKTtcblxuICAgICAgICBpZiAoYWN0aW9uLnR5cGUgPT09IEFjdGlvbnMuUEVSRk9STV9BQ1RJT04pIHtcbiAgICAgICAgICBjb25zdCB1bmxpZnRlZEFjdGlvbiA9IChhY3Rpb24gYXMgQWN0aW9ucy5QZXJmb3JtQWN0aW9uKS5hY3Rpb247XG5cbiAgICAgICAgICBzY2FubmVkQWN0aW9ucy5uZXh0KHVubGlmdGVkQWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB0aGlzLmV4dGVuc2lvblN0YXJ0U3Vic2NyaXB0aW9uID0gZXh0ZW5zaW9uLnN0YXJ0JFxuICAgICAgLnBpcGUoZW1pdEluWm9uZSh6b25lQ29uZmlnKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLnJlZnJlc2goKTtcbiAgICAgIH0pO1xuXG4gICAgY29uc3QgbGlmdGVkU3RhdGUkID1cbiAgICAgIGxpZnRlZFN0YXRlU3ViamVjdC5hc09ic2VydmFibGUoKSBhcyBPYnNlcnZhYmxlPExpZnRlZFN0YXRlPjtcbiAgICBjb25zdCBzdGF0ZSQgPSBsaWZ0ZWRTdGF0ZSQucGlwZShtYXAodW5saWZ0U3RhdGUpKSBhcyBTdGF0ZU9ic2VydmFibGU7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHN0YXRlJCwgJ3N0YXRlJywge1xuICAgICAgdmFsdWU6IHRvU2lnbmFsKHN0YXRlJCwgeyBtYW51YWxDbGVhbnVwOiB0cnVlLCByZXF1aXJlU3luYzogdHJ1ZSB9KSxcbiAgICB9KTtcblxuICAgIHRoaXMuZGlzcGF0Y2hlciA9IGRpc3BhdGNoZXI7XG4gICAgdGhpcy5saWZ0ZWRTdGF0ZSA9IGxpZnRlZFN0YXRlJDtcbiAgICB0aGlzLnN0YXRlID0gc3RhdGUkO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgLy8gRXZlbiB0aG91Z2ggdGhlIHN0b3JlIGRldnRvb2xzIHBsdWdpbiBpcyByZWNvbW1lbmRlZCB0byBiZVxuICAgIC8vIHVzZWQgb25seSBpbiBkZXZlbG9wbWVudCBtb2RlLCBpdCBjYW4gc3RpbGwgY2F1c2UgYSBtZW1vcnkgbGVha1xuICAgIC8vIGluIG1pY3JvZnJvbnRlbmQgYXBwbGljYXRpb25zIHRoYXQgYXJlIGJlaW5nIGNyZWF0ZWQgYW5kIGRlc3Ryb3llZFxuICAgIC8vIG11bHRpcGxlIHRpbWVzIGR1cmluZyBkZXZlbG9wbWVudC4gVGhpcyByZXN1bHRzIGluIGV4Y2Vzc2l2ZSBtZW1vcnlcbiAgICAvLyBjb25zdW1wdGlvbiwgYXMgaXQgcHJldmVudHMgZW50aXJlIGFwcHMgZnJvbSBiZWluZyBnYXJiYWdlIGNvbGxlY3RlZC5cbiAgICB0aGlzLmxpZnRlZFN0YXRlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5leHRlbnNpb25TdGFydFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgZGlzcGF0Y2goYWN0aW9uOiBBY3Rpb24pIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIubmV4dChhY3Rpb24pO1xuICB9XG5cbiAgbmV4dChhY3Rpb246IGFueSkge1xuICAgIHRoaXMuZGlzcGF0Y2hlci5uZXh0KGFjdGlvbik7XG4gIH1cblxuICBlcnJvcihlcnJvcjogYW55KSB7fVxuXG4gIGNvbXBsZXRlKCkge31cblxuICBwZXJmb3JtQWN0aW9uKGFjdGlvbjogYW55KSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5QZXJmb3JtQWN0aW9uKGFjdGlvbiwgK0RhdGUubm93KCkpKTtcbiAgfVxuXG4gIHJlZnJlc2goKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5SZWZyZXNoKCkpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5SZXNldCgrRGF0ZS5ub3coKSkpO1xuICB9XG5cbiAgcm9sbGJhY2soKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5Sb2xsYmFjaygrRGF0ZS5ub3coKSkpO1xuICB9XG5cbiAgY29tbWl0KCkge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuQ29tbWl0KCtEYXRlLm5vdygpKSk7XG4gIH1cblxuICBzd2VlcCgpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLlN3ZWVwKCkpO1xuICB9XG5cbiAgdG9nZ2xlQWN0aW9uKGlkOiBudW1iZXIpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLlRvZ2dsZUFjdGlvbihpZCkpO1xuICB9XG5cbiAganVtcFRvQWN0aW9uKGFjdGlvbklkOiBudW1iZXIpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLkp1bXBUb0FjdGlvbihhY3Rpb25JZCkpO1xuICB9XG5cbiAganVtcFRvU3RhdGUoaW5kZXg6IG51bWJlcikge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuSnVtcFRvU3RhdGUoaW5kZXgpKTtcbiAgfVxuXG4gIGltcG9ydFN0YXRlKG5leHRMaWZ0ZWRTdGF0ZTogYW55KSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5JbXBvcnRTdGF0ZShuZXh0TGlmdGVkU3RhdGUpKTtcbiAgfVxuXG4gIGxvY2tDaGFuZ2VzKHN0YXR1czogYm9vbGVhbikge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuTG9ja0NoYW5nZXMoc3RhdHVzKSk7XG4gIH1cblxuICBwYXVzZVJlY29yZGluZyhzdGF0dXM6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLlBhdXNlUmVjb3JkaW5nKHN0YXR1cykpO1xuICB9XG59XG5cbi8qKlxuICogSWYgdGhlIGRldnRvb2xzIGV4dGVuc2lvbiBpcyBjb25uZWN0ZWQgb3V0IG9mIHRoZSBBbmd1bGFyIHpvbmUsXG4gKiB0aGlzIG9wZXJhdG9yIHdpbGwgZW1pdCBhbGwgZXZlbnRzIHdpdGhpbiB0aGUgem9uZS5cbiAqL1xuZnVuY3Rpb24gZW1pdEluWm9uZTxUPih7XG4gIG5nWm9uZSxcbiAgY29ubmVjdE91dHNpZGVab25lLFxufTogWm9uZUNvbmZpZyk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiAoc291cmNlKSA9PlxuICAgIGNvbm5lY3RPdXRzaWRlWm9uZVxuICAgICAgPyBuZXcgT2JzZXJ2YWJsZTxUPigoc3Vic2NyaWJlcikgPT5cbiAgICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKHtcbiAgICAgICAgICAgIG5leHQ6ICh2YWx1ZSkgPT4gbmdab25lLnJ1bigoKSA9PiBzdWJzY3JpYmVyLm5leHQodmFsdWUpKSxcbiAgICAgICAgICAgIGVycm9yOiAoZXJyb3IpID0+IG5nWm9uZS5ydW4oKCkgPT4gc3Vic2NyaWJlci5lcnJvcihlcnJvcikpLFxuICAgICAgICAgICAgY29tcGxldGU6ICgpID0+IG5nWm9uZS5ydW4oKCkgPT4gc3Vic2NyaWJlci5jb21wbGV0ZSgpKSxcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICA6IHNvdXJjZTtcbn1cbiJdfQ==