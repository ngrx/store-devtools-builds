import { Injectable, Inject, } from '@angular/core';
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
        const zoneConfig = injectZoneConfig(config.connectInZone);
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
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: StoreDevtools, deps: [{ token: i1.DevtoolsDispatcher }, { token: i2.ActionsSubject }, { token: i2.ReducerObservable }, { token: i3.DevtoolsExtension }, { token: i2.ScannedActionsSubject }, { token: i0.ErrorHandler }, { token: INITIAL_STATE }, { token: STORE_DEVTOOLS_CONFIG }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: StoreDevtools }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: StoreDevtools, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.DevtoolsDispatcher }, { type: i2.ActionsSubject }, { type: i2.ReducerObservable }, { type: i3.DevtoolsExtension }, { type: i2.ScannedActionsSubject }, { type: i0.ErrorHandler }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [INITIAL_STATE]
                }] }, { type: i4.StoreDevtoolsConfig, decorators: [{
                    type: Inject,
                    args: [STORE_DEVTOOLS_CONFIG]
                }] }] });
/**
 * If the devtools extension is connected out of the Angular zone,
 * this operator will emit all events within the zone.
 */
function emitInZone({ ngZone, connectInZone, }) {
    return (source) => connectInZone
        ? new Observable((subscriber) => source.subscribe({
            next: (value) => ngZone.run(() => subscriber.next(value)),
            error: (error) => ngZone.run(() => subscriber.error(error)),
            complete: () => ngZone.run(() => subscriber.complete()),
        }))
        : source;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2dG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3N0b3JlLWRldnRvb2xzL3NyYy9kZXZ0b29scy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsVUFBVSxFQUNWLE1BQU0sR0FLUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDdEQsT0FBTyxFQUlMLGFBQWEsR0FJZCxNQUFNLGFBQWEsQ0FBQztBQUNyQixPQUFPLEVBQ0wsS0FBSyxFQUVMLFVBQVUsRUFFVixjQUFjLEVBQ2QsYUFBYSxHQUVkLE1BQU0sTUFBTSxDQUFDO0FBQ2QsT0FBTyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU1RSxPQUFPLEtBQUssT0FBTyxNQUFNLFdBQVcsQ0FBQztBQUNyQyxPQUFPLEVBQUUscUJBQXFCLEVBQXVCLE1BQU0sVUFBVSxDQUFDO0FBRXRFLE9BQU8sRUFBZSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDM0UsT0FBTyxFQUNMLFVBQVUsRUFDVixXQUFXLEVBQ1gsbUJBQW1CLEVBQ25CLGlCQUFpQixHQUNsQixNQUFNLFNBQVMsQ0FBQztBQUVqQixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQzNDLE9BQU8sRUFBYyxnQkFBZ0IsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7Ozs7O0FBRzdELE1BQU0sT0FBTyxhQUFhO0lBT3hCLFlBQ0UsVUFBOEIsRUFDOUIsUUFBd0IsRUFDeEIsU0FBNEIsRUFDNUIsU0FBNEIsRUFDNUIsY0FBcUMsRUFDckMsWUFBMEIsRUFDSCxZQUFpQixFQUNULE1BQTJCO1FBRTFELE1BQU0sa0JBQWtCLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FB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QztJQUVELGNBQWMsQ0FBQyxNQUFlO1FBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDcEQsQ0FBQztpSUE1S1UsYUFBYSxxTkFjZCxhQUFhLGFBQ2IscUJBQXFCO3FJQWZwQixhQUFhOzsyRkFBYixhQUFhO2tCQUR6QixVQUFVOzswQkFlTixNQUFNOzJCQUFDLGFBQWE7OzBCQUNwQixNQUFNOzJCQUFDLHFCQUFxQjs7QUFnS2pDOzs7R0FHRztBQUNILFNBQVMsVUFBVSxDQUFJLEVBQ3JCLE1BQU0sRUFDTixhQUFhLEdBQ0Y7SUFDWCxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FDaEIsYUFBYTtRQUNYLENBQUMsQ0FBQyxJQUFJLFVBQVUsQ0FBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQy9CLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDZixJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN6RCxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzRCxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDeEQsQ0FBQyxDQUNIO1FBQ0gsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUNmLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBJbmplY3RhYmxlLFxuICBJbmplY3QsXG4gIEVycm9ySGFuZGxlcixcbiAgT25EZXN0cm95LFxuICBOZ1pvbmUsXG4gIGluamVjdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyB0b1NpZ25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUvcnhqcy1pbnRlcm9wJztcbmltcG9ydCB7XG4gIEFjdGlvbixcbiAgQWN0aW9uUmVkdWNlcixcbiAgQWN0aW9uc1N1YmplY3QsXG4gIElOSVRJQUxfU1RBVEUsXG4gIFJlZHVjZXJPYnNlcnZhYmxlLFxuICBTY2FubmVkQWN0aW9uc1N1YmplY3QsXG4gIFN0YXRlT2JzZXJ2YWJsZSxcbn0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHtcbiAgbWVyZ2UsXG4gIE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbixcbiAgT2JzZXJ2YWJsZSxcbiAgT2JzZXJ2ZXIsXG4gIHF1ZXVlU2NoZWR1bGVyLFxuICBSZXBsYXlTdWJqZWN0LFxuICBTdWJzY3JpcHRpb24sXG59IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwLCBvYnNlcnZlT24sIHNjYW4sIHNraXAsIHdpdGhMYXRlc3RGcm9tIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgKiBhcyBBY3Rpb25zIGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgeyBTVE9SRV9ERVZUT09MU19DT05GSUcsIFN0b3JlRGV2dG9vbHNDb25maWcgfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgeyBEZXZ0b29sc0V4dGVuc2lvbiB9IGZyb20gJy4vZXh0ZW5zaW9uJztcbmltcG9ydCB7IExpZnRlZFN0YXRlLCBsaWZ0SW5pdGlhbFN0YXRlLCBsaWZ0UmVkdWNlcldpdGggfSBmcm9tICcuL3JlZHVjZXInO1xuaW1wb3J0IHtcbiAgbGlmdEFjdGlvbixcbiAgdW5saWZ0U3RhdGUsXG4gIHNob3VsZEZpbHRlckFjdGlvbnMsXG4gIGZpbHRlckxpZnRlZFN0YXRlLFxufSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IERldnRvb2xzRGlzcGF0Y2hlciB9IGZyb20gJy4vZGV2dG9vbHMtZGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBQRVJGT1JNX0FDVElPTiB9IGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgeyBab25lQ29uZmlnLCBpbmplY3Rab25lQ29uZmlnIH0gZnJvbSAnLi96b25lLWNvbmZpZyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTdG9yZURldnRvb2xzIGltcGxlbWVudHMgT2JzZXJ2ZXI8YW55PiwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBsaWZ0ZWRTdGF0ZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcml2YXRlIGV4dGVuc2lvblN0YXJ0U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHB1YmxpYyBkaXNwYXRjaGVyOiBBY3Rpb25zU3ViamVjdDtcbiAgcHVibGljIGxpZnRlZFN0YXRlOiBPYnNlcnZhYmxlPExpZnRlZFN0YXRlPjtcbiAgcHVibGljIHN0YXRlOiBTdGF0ZU9ic2VydmFibGU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZGlzcGF0Y2hlcjogRGV2dG9vbHNEaXNwYXRjaGVyLFxuICAgIGFjdGlvbnMkOiBBY3Rpb25zU3ViamVjdCxcbiAgICByZWR1Y2VycyQ6IFJlZHVjZXJPYnNlcnZhYmxlLFxuICAgIGV4dGVuc2lvbjogRGV2dG9vbHNFeHRlbnNpb24sXG4gICAgc2Nhbm5lZEFjdGlvbnM6IFNjYW5uZWRBY3Rpb25zU3ViamVjdCxcbiAgICBlcnJvckhhbmRsZXI6IEVycm9ySGFuZGxlcixcbiAgICBASW5qZWN0KElOSVRJQUxfU1RBVEUpIGluaXRpYWxTdGF0ZTogYW55LFxuICAgIEBJbmplY3QoU1RPUkVfREVWVE9PTFNfQ09ORklHKSBjb25maWc6IFN0b3JlRGV2dG9vbHNDb25maWdcbiAgKSB7XG4gICAgY29uc3QgbGlmdGVkSW5pdGlhbFN0YXRlID0gbGlmdEluaXRpYWxTdGF0ZShpbml0aWFsU3RhdGUsIGNvbmZpZy5tb25pdG9yKTtcbiAgICBjb25zdCBsaWZ0UmVkdWNlciA9IGxpZnRSZWR1Y2VyV2l0aChcbiAgICAgIGluaXRpYWxTdGF0ZSxcbiAgICAgIGxpZnRlZEluaXRpYWxTdGF0ZSxcbiAgICAgIGVycm9ySGFuZGxlcixcbiAgICAgIGNvbmZpZy5tb25pdG9yLFxuICAgICAgY29uZmlnXG4gICAgKTtcblxuICAgIGNvbnN0IGxpZnRlZEFjdGlvbiQgPSBtZXJnZShcbiAgICAgIG1lcmdlKGFjdGlvbnMkLmFzT2JzZXJ2YWJsZSgpLnBpcGUoc2tpcCgxKSksIGV4dGVuc2lvbi5hY3Rpb25zJCkucGlwZShcbiAgICAgICAgbWFwKGxpZnRBY3Rpb24pXG4gICAgICApLFxuICAgICAgZGlzcGF0Y2hlcixcbiAgICAgIGV4dGVuc2lvbi5saWZ0ZWRBY3Rpb25zJFxuICAgICkucGlwZShvYnNlcnZlT24ocXVldWVTY2hlZHVsZXIpKTtcblxuICAgIGNvbnN0IGxpZnRlZFJlZHVjZXIkID0gcmVkdWNlcnMkLnBpcGUobWFwKGxpZnRSZWR1Y2VyKSk7XG5cbiAgICBjb25zdCB6b25lQ29uZmlnID0gaW5qZWN0Wm9uZUNvbmZpZyhjb25maWcuY29ubmVjdEluWm9uZSEpO1xuXG4gICAgY29uc3QgbGlmdGVkU3RhdGVTdWJqZWN0ID0gbmV3IFJlcGxheVN1YmplY3Q8TGlmdGVkU3RhdGU+KDEpO1xuXG4gICAgdGhpcy5saWZ0ZWRTdGF0ZVN1YnNjcmlwdGlvbiA9IGxpZnRlZEFjdGlvbiRcbiAgICAgIC5waXBlKFxuICAgICAgICB3aXRoTGF0ZXN0RnJvbShsaWZ0ZWRSZWR1Y2VyJCksXG4gICAgICAgIC8vIFRoZSBleHRlbnNpb24gd291bGQgcG9zdCBtZXNzYWdlcyBiYWNrIG91dHNpZGUgb2YgdGhlIEFuZ3VsYXIgem9uZVxuICAgICAgICAvLyBiZWNhdXNlIHdlIGNhbGwgYGNvbm5lY3QoKWAgd3JhcHBlZCB3aXRoIGBydW5PdXRzaWRlQW5ndWxhcmAuIFdlIHJ1biBjaGFuZ2VcbiAgICAgICAgLy8gZGV0ZWN0aW9uIG9ubHkgb25jZSBhdCB0aGUgZW5kIGFmdGVyIGFsbCB0aGUgcmVxdWlyZWQgYXN5bmNocm9ub3VzIHRhc2tzIGhhdmVcbiAgICAgICAgLy8gYmVlbiBwcm9jZXNzZWQgKGZvciBpbnN0YW5jZSwgYHNldEludGVydmFsYCBzY2hlZHVsZWQgYnkgdGhlIGB0aW1lb3V0YCBvcGVyYXRvcikuXG4gICAgICAgIC8vIFdlIGhhdmUgdG8gcmUtZW50ZXIgdGhlIEFuZ3VsYXIgem9uZSBiZWZvcmUgdGhlIGBzY2FuYCBzaW5jZSBpdCBydW5zIHRoZSByZWR1Y2VyXG4gICAgICAgIC8vIHdoaWNoIG11c3QgYmUgcnVuIHdpdGhpbiB0aGUgQW5ndWxhciB6b25lLlxuICAgICAgICBlbWl0SW5ab25lKHpvbmVDb25maWcpLFxuICAgICAgICBzY2FuPFxuICAgICAgICAgIFthbnksIEFjdGlvblJlZHVjZXI8TGlmdGVkU3RhdGUsIEFjdGlvbnMuQWxsPl0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhdGU6IExpZnRlZFN0YXRlO1xuICAgICAgICAgICAgYWN0aW9uOiBhbnk7XG4gICAgICAgICAgfVxuICAgICAgICA+KFxuICAgICAgICAgICh7IHN0YXRlOiBsaWZ0ZWRTdGF0ZSB9LCBbYWN0aW9uLCByZWR1Y2VyXSkgPT4ge1xuICAgICAgICAgICAgbGV0IHJlZHVjZWRMaWZ0ZWRTdGF0ZSA9IHJlZHVjZXIobGlmdGVkU3RhdGUsIGFjdGlvbik7XG4gICAgICAgICAgICAvLyBPbiBmdWxsIHN0YXRlIHVwZGF0ZVxuICAgICAgICAgICAgLy8gSWYgd2UgaGF2ZSBhY3Rpb25zIGZpbHRlcnMsIHdlIG11c3QgZmlsdGVyIGNvbXBsZXRlbHkgb3VyIGxpZnRlZCBzdGF0ZSB0byBiZSBzeW5jIHdpdGggdGhlIGV4dGVuc2lvblxuICAgICAgICAgICAgaWYgKGFjdGlvbi50eXBlICE9PSBQRVJGT1JNX0FDVElPTiAmJiBzaG91bGRGaWx0ZXJBY3Rpb25zKGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgcmVkdWNlZExpZnRlZFN0YXRlID0gZmlsdGVyTGlmdGVkU3RhdGUoXG4gICAgICAgICAgICAgICAgcmVkdWNlZExpZnRlZFN0YXRlLFxuICAgICAgICAgICAgICAgIGNvbmZpZy5wcmVkaWNhdGUsXG4gICAgICAgICAgICAgICAgY29uZmlnLmFjdGlvbnNTYWZlbGlzdCxcbiAgICAgICAgICAgICAgICBjb25maWcuYWN0aW9uc0Jsb2NrbGlzdFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRXh0ZW5zaW9uIHNob3VsZCBiZSBzZW50IHRoZSBzYW5pdGl6ZWQgbGlmdGVkIHN0YXRlXG4gICAgICAgICAgICBleHRlbnNpb24ubm90aWZ5KGFjdGlvbiwgcmVkdWNlZExpZnRlZFN0YXRlKTtcbiAgICAgICAgICAgIHJldHVybiB7IHN0YXRlOiByZWR1Y2VkTGlmdGVkU3RhdGUsIGFjdGlvbiB9O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgeyBzdGF0ZTogbGlmdGVkSW5pdGlhbFN0YXRlLCBhY3Rpb246IG51bGwgYXMgYW55IH1cbiAgICAgICAgKVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoeyBzdGF0ZSwgYWN0aW9uIH0pID0+IHtcbiAgICAgICAgbGlmdGVkU3RhdGVTdWJqZWN0Lm5leHQoc3RhdGUpO1xuXG4gICAgICAgIGlmIChhY3Rpb24udHlwZSA9PT0gQWN0aW9ucy5QRVJGT1JNX0FDVElPTikge1xuICAgICAgICAgIGNvbnN0IHVubGlmdGVkQWN0aW9uID0gKGFjdGlvbiBhcyBBY3Rpb25zLlBlcmZvcm1BY3Rpb24pLmFjdGlvbjtcblxuICAgICAgICAgIHNjYW5uZWRBY3Rpb25zLm5leHQodW5saWZ0ZWRBY3Rpb24pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHRoaXMuZXh0ZW5zaW9uU3RhcnRTdWJzY3JpcHRpb24gPSBleHRlbnNpb24uc3RhcnQkXG4gICAgICAucGlwZShlbWl0SW5ab25lKHpvbmVDb25maWcpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMucmVmcmVzaCgpO1xuICAgICAgfSk7XG5cbiAgICBjb25zdCBsaWZ0ZWRTdGF0ZSQgPVxuICAgICAgbGlmdGVkU3RhdGVTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpIGFzIE9ic2VydmFibGU8TGlmdGVkU3RhdGU+O1xuICAgIGNvbnN0IHN0YXRlJCA9IGxpZnRlZFN0YXRlJC5waXBlKG1hcCh1bmxpZnRTdGF0ZSkpIGFzIFN0YXRlT2JzZXJ2YWJsZTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc3RhdGUkLCAnc3RhdGUnLCB7XG4gICAgICB2YWx1ZTogdG9TaWduYWwoc3RhdGUkLCB7IG1hbnVhbENsZWFudXA6IHRydWUsIHJlcXVpcmVTeW5jOiB0cnVlIH0pLFxuICAgIH0pO1xuXG4gICAgdGhpcy5kaXNwYXRjaGVyID0gZGlzcGF0Y2hlcjtcbiAgICB0aGlzLmxpZnRlZFN0YXRlID0gbGlmdGVkU3RhdGUkO1xuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZSQ7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAvLyBFdmVuIHRob3VnaCB0aGUgc3RvcmUgZGV2dG9vbHMgcGx1Z2luIGlzIHJlY29tbWVuZGVkIHRvIGJlXG4gICAgLy8gdXNlZCBvbmx5IGluIGRldmVsb3BtZW50IG1vZGUsIGl0IGNhbiBzdGlsbCBjYXVzZSBhIG1lbW9yeSBsZWFrXG4gICAgLy8gaW4gbWljcm9mcm9udGVuZCBhcHBsaWNhdGlvbnMgdGhhdCBhcmUgYmVpbmcgY3JlYXRlZCBhbmQgZGVzdHJveWVkXG4gICAgLy8gbXVsdGlwbGUgdGltZXMgZHVyaW5nIGRldmVsb3BtZW50LiBUaGlzIHJlc3VsdHMgaW4gZXhjZXNzaXZlIG1lbW9yeVxuICAgIC8vIGNvbnN1bXB0aW9uLCBhcyBpdCBwcmV2ZW50cyBlbnRpcmUgYXBwcyBmcm9tIGJlaW5nIGdhcmJhZ2UgY29sbGVjdGVkLlxuICAgIHRoaXMubGlmdGVkU3RhdGVTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLmV4dGVuc2lvblN0YXJ0U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBkaXNwYXRjaChhY3Rpb246IEFjdGlvbikge1xuICAgIHRoaXMuZGlzcGF0Y2hlci5uZXh0KGFjdGlvbik7XG4gIH1cblxuICBuZXh0KGFjdGlvbjogYW55KSB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLm5leHQoYWN0aW9uKTtcbiAgfVxuXG4gIGVycm9yKGVycm9yOiBhbnkpIHt9XG5cbiAgY29tcGxldGUoKSB7fVxuXG4gIHBlcmZvcm1BY3Rpb24oYWN0aW9uOiBhbnkpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLlBlcmZvcm1BY3Rpb24oYWN0aW9uLCArRGF0ZS5ub3coKSkpO1xuICB9XG5cbiAgcmVmcmVzaCgpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLlJlZnJlc2goKSk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLlJlc2V0KCtEYXRlLm5vdygpKSk7XG4gIH1cblxuICByb2xsYmFjaygpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLlJvbGxiYWNrKCtEYXRlLm5vdygpKSk7XG4gIH1cblxuICBjb21taXQoKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5Db21taXQoK0RhdGUubm93KCkpKTtcbiAgfVxuXG4gIHN3ZWVwKCkge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuU3dlZXAoKSk7XG4gIH1cblxuICB0b2dnbGVBY3Rpb24oaWQ6IG51bWJlcikge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuVG9nZ2xlQWN0aW9uKGlkKSk7XG4gIH1cblxuICBqdW1wVG9BY3Rpb24oYWN0aW9uSWQ6IG51bWJlcikge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuSnVtcFRvQWN0aW9uKGFjdGlvbklkKSk7XG4gIH1cblxuICBqdW1wVG9TdGF0ZShpbmRleDogbnVtYmVyKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5KdW1wVG9TdGF0ZShpbmRleCkpO1xuICB9XG5cbiAgaW1wb3J0U3RhdGUobmV4dExpZnRlZFN0YXRlOiBhbnkpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLkltcG9ydFN0YXRlKG5leHRMaWZ0ZWRTdGF0ZSkpO1xuICB9XG5cbiAgbG9ja0NoYW5nZXMoc3RhdHVzOiBib29sZWFuKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5Mb2NrQ2hhbmdlcyhzdGF0dXMpKTtcbiAgfVxuXG4gIHBhdXNlUmVjb3JkaW5nKHN0YXR1czogYm9vbGVhbikge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuUGF1c2VSZWNvcmRpbmcoc3RhdHVzKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBJZiB0aGUgZGV2dG9vbHMgZXh0ZW5zaW9uIGlzIGNvbm5lY3RlZCBvdXQgb2YgdGhlIEFuZ3VsYXIgem9uZSxcbiAqIHRoaXMgb3BlcmF0b3Igd2lsbCBlbWl0IGFsbCBldmVudHMgd2l0aGluIHRoZSB6b25lLlxuICovXG5mdW5jdGlvbiBlbWl0SW5ab25lPFQ+KHtcbiAgbmdab25lLFxuICBjb25uZWN0SW5ab25lLFxufTogWm9uZUNvbmZpZyk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiAoc291cmNlKSA9PlxuICAgIGNvbm5lY3RJblpvbmVcbiAgICAgID8gbmV3IE9ic2VydmFibGU8VD4oKHN1YnNjcmliZXIpID0+XG4gICAgICAgICAgc291cmNlLnN1YnNjcmliZSh7XG4gICAgICAgICAgICBuZXh0OiAodmFsdWUpID0+IG5nWm9uZS5ydW4oKCkgPT4gc3Vic2NyaWJlci5uZXh0KHZhbHVlKSksXG4gICAgICAgICAgICBlcnJvcjogKGVycm9yKSA9PiBuZ1pvbmUucnVuKCgpID0+IHN1YnNjcmliZXIuZXJyb3IoZXJyb3IpKSxcbiAgICAgICAgICAgIGNvbXBsZXRlOiAoKSA9PiBuZ1pvbmUucnVuKCgpID0+IHN1YnNjcmliZXIuY29tcGxldGUoKSksXG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgOiBzb3VyY2U7XG59XG4iXX0=