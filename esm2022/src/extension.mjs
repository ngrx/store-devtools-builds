import { Inject, Injectable, InjectionToken } from '@angular/core';
import { UPDATE } from '@ngrx/store';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, concatMap, debounceTime, filter, map, share, switchMap, take, takeUntil, timeout, } from 'rxjs/operators';
import { IMPORT_STATE, PERFORM_ACTION } from './actions';
import { STORE_DEVTOOLS_CONFIG, } from './config';
import { isActionFiltered, sanitizeAction, sanitizeActions, sanitizeState, sanitizeStates, shouldFilterActions, unliftState, } from './utils';
import { injectZoneConfig } from './zone-config';
import * as i0 from "@angular/core";
import * as i1 from "./devtools-dispatcher";
import * as i2 from "./config";
export const ExtensionActionTypes = {
    START: 'START',
    DISPATCH: 'DISPATCH',
    STOP: 'STOP',
    ACTION: 'ACTION',
};
export const REDUX_DEVTOOLS_EXTENSION = new InjectionToken('@ngrx/store-devtools Redux Devtools Extension');
export class DevtoolsExtension {
    constructor(devtoolsExtension, config, dispatcher) {
        this.config = config;
        this.dispatcher = dispatcher;
        this.zoneConfig = injectZoneConfig(this.config.connectInZone);
        this.devtoolsExtension = devtoolsExtension;
        this.createActionStreams();
    }
    notify(action, state) {
        if (!this.devtoolsExtension) {
            return;
        }
        // Check to see if the action requires a full update of the liftedState.
        // If it is a simple action generated by the user's app and the recording
        // is not locked/paused, only send the action and the current state (fast).
        //
        // A full liftedState update (slow: serializes the entire liftedState) is
        // only required when:
        //   a) redux-devtools-extension fires the @@Init action (ignored by
        //      @ngrx/store-devtools)
        //   b) an action is generated by an @ngrx module (e.g. @ngrx/effects/init
        //      or @ngrx/store/update-reducers)
        //   c) the state has been recomputed due to time-traveling
        //   d) any action that is not a PerformAction to err on the side of
        //      caution.
        if (action.type === PERFORM_ACTION) {
            if (state.isLocked || state.isPaused) {
                return;
            }
            const currentState = unliftState(state);
            if (shouldFilterActions(this.config) &&
                isActionFiltered(currentState, action, this.config.predicate, this.config.actionsSafelist, this.config.actionsBlocklist)) {
                return;
            }
            const sanitizedState = this.config.stateSanitizer
                ? sanitizeState(this.config.stateSanitizer, currentState, state.currentStateIndex)
                : currentState;
            const sanitizedAction = this.config.actionSanitizer
                ? sanitizeAction(this.config.actionSanitizer, action, state.nextActionId)
                : action;
            this.sendToReduxDevtools(() => this.extensionConnection.send(sanitizedAction, sanitizedState));
        }
        else {
            // Requires full state update
            const sanitizedLiftedState = {
                ...state,
                stagedActionIds: state.stagedActionIds,
                actionsById: this.config.actionSanitizer
                    ? sanitizeActions(this.config.actionSanitizer, state.actionsById)
                    : state.actionsById,
                computedStates: this.config.stateSanitizer
                    ? sanitizeStates(this.config.stateSanitizer, state.computedStates)
                    : state.computedStates,
            };
            this.sendToReduxDevtools(() => this.devtoolsExtension.send(null, sanitizedLiftedState, this.getExtensionConfig(this.config)));
        }
    }
    createChangesObservable() {
        if (!this.devtoolsExtension) {
            return EMPTY;
        }
        return new Observable((subscriber) => {
            const connection = this.zoneConfig.connectInZone
                ? // To reduce change detection cycles, we need to run the `connect` method
                    // outside of the Angular zone. The `connect` method adds a `message`
                    // event listener to communicate with an extension using `window.postMessage`
                    // and handle message events.
                    this.zoneConfig.ngZone.runOutsideAngular(() => this.devtoolsExtension.connect(this.getExtensionConfig(this.config)))
                : this.devtoolsExtension.connect(this.getExtensionConfig(this.config));
            this.extensionConnection = connection;
            connection.init();
            connection.subscribe((change) => subscriber.next(change));
            return connection.unsubscribe;
        });
    }
    createActionStreams() {
        // Listens to all changes
        const changes$ = this.createChangesObservable().pipe(share());
        // Listen for the start action
        const start$ = changes$.pipe(filter((change) => change.type === ExtensionActionTypes.START));
        // Listen for the stop action
        const stop$ = changes$.pipe(filter((change) => change.type === ExtensionActionTypes.STOP));
        // Listen for lifted actions
        const liftedActions$ = changes$.pipe(filter((change) => change.type === ExtensionActionTypes.DISPATCH), map((change) => this.unwrapAction(change.payload)), concatMap((action) => {
            if (action.type === IMPORT_STATE) {
                // State imports may happen in two situations:
                // 1. Explicitly by user
                // 2. User activated the "persist state accross reloads" option
                //    and now the state is imported during reload.
                // Because of option 2, we need to give possible
                // lazy loaded reducers time to instantiate.
                // As soon as there is no UPDATE action within 1 second,
                // it is assumed that all reducers are loaded.
                return this.dispatcher.pipe(filter((action) => action.type === UPDATE), timeout(1000), debounceTime(1000), map(() => action), catchError(() => of(action)), take(1));
            }
            else {
                return of(action);
            }
        }));
        // Listen for unlifted actions
        const actions$ = changes$.pipe(filter((change) => change.type === ExtensionActionTypes.ACTION), map((change) => this.unwrapAction(change.payload)));
        const actionsUntilStop$ = actions$.pipe(takeUntil(stop$));
        const liftedUntilStop$ = liftedActions$.pipe(takeUntil(stop$));
        this.start$ = start$.pipe(takeUntil(stop$));
        // Only take the action sources between the start/stop events
        this.actions$ = this.start$.pipe(switchMap(() => actionsUntilStop$));
        this.liftedActions$ = this.start$.pipe(switchMap(() => liftedUntilStop$));
    }
    unwrapAction(action) {
        return typeof action === 'string' ? eval(`(${action})`) : action;
    }
    getExtensionConfig(config) {
        const extensionOptions = {
            name: config.name,
            features: config.features,
            serialize: config.serialize,
            autoPause: config.autoPause ?? false,
            trace: config.trace ?? false,
            traceLimit: config.traceLimit ?? 75,
            // The action/state sanitizers are not added to the config
            // because sanitation is done in this class already.
            // It is done before sending it to the devtools extension for consistency:
            // - If we call extensionConnection.send(...),
            //   the extension would call the sanitizers.
            // - If we call devtoolsExtension.send(...) (aka full state update),
            //   the extension would NOT call the sanitizers, so we have to do it ourselves.
        };
        if (config.maxAge !== false /* support === 0 */) {
            extensionOptions.maxAge = config.maxAge;
        }
        return extensionOptions;
    }
    sendToReduxDevtools(send) {
        try {
            send();
        }
        catch (err) {
            console.warn('@ngrx/store-devtools: something went wrong inside the redux devtools', err);
        }
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DevtoolsExtension, deps: [{ token: REDUX_DEVTOOLS_EXTENSION }, { token: STORE_DEVTOOLS_CONFIG }, { token: i1.DevtoolsDispatcher }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DevtoolsExtension }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DevtoolsExtension, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [REDUX_DEVTOOLS_EXTENSION]
                }] }, { type: i2.StoreDevtoolsConfig, decorators: [{
                    type: Inject,
                    args: [STORE_DEVTOOLS_CONFIG]
                }] }, { type: i1.DevtoolsDispatcher }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5zaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9zdG9yZS1kZXZ0b29scy9zcmMvZXh0ZW5zaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRSxPQUFPLEVBQVUsTUFBTSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzdDLE9BQU8sRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM3QyxPQUFPLEVBQ0wsVUFBVSxFQUNWLFNBQVMsRUFDVCxZQUFZLEVBQ1osTUFBTSxFQUNOLEdBQUcsRUFDSCxLQUFLLEVBQ0wsU0FBUyxFQUNULElBQUksRUFDSixTQUFTLEVBQ1QsT0FBTyxHQUNSLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEIsT0FBTyxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDekQsT0FBTyxFQUVMLHFCQUFxQixHQUV0QixNQUFNLFVBQVUsQ0FBQztBQUdsQixPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2hCLGNBQWMsRUFDZCxlQUFlLEVBQ2YsYUFBYSxFQUNiLGNBQWMsRUFDZCxtQkFBbUIsRUFDbkIsV0FBVyxHQUNaLE1BQU0sU0FBUyxDQUFDO0FBQ2pCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7OztBQUVqRCxNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBRztJQUNsQyxLQUFLLEVBQUUsT0FBTztJQUNkLFFBQVEsRUFBRSxVQUFVO0lBQ3BCLElBQUksRUFBRSxNQUFNO0lBQ1osTUFBTSxFQUFFLFFBQVE7Q0FDakIsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLHdCQUF3QixHQUNuQyxJQUFJLGNBQWMsQ0FDaEIsK0NBQStDLENBQ2hELENBQUM7QUEyQkosTUFBTSxPQUFPLGlCQUFp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QUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDbkUsQ0FBQztJQUVPLGtCQUFrQixDQUFDLE1BQTJCO1FBQ3BELE1BQU0sZ0JBQWdCLEdBQWlDO1lBQ3JELElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtZQUNqQixRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVE7WUFDekIsU0FBUyxFQUFFLE1BQU0sQ0FBQyxTQUFTO1lBQzNCLFNBQVMsRUFBRSxNQUFNLENBQUMsU0FBUyxJQUFJLEtBQUs7WUFDcEMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLLElBQUksS0FBSztZQUM1QixVQUFVLEVBQUUsTUFBTSxDQUFDLFVBQVUsSUFBSSxFQUFFO1lBQ25DLDBEQUEwRDtZQUMxRCxvREFBb0Q7WUFDcEQsMEVBQTBFO1lBQzFFLDhDQUE4QztZQUM5Qyw2Q0FBNkM7WUFDN0Msb0VBQW9FO1lBQ3BFLGdGQUFnRjtTQUNqRixDQUFDO1FBQ0YsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLEtBQUssQ0FBQyxtQkFBbUIsRUFBRTtZQUMvQyxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztTQUN6QztRQUNELE9BQU8sZ0JBQWdCLENBQUM7SUFDMUIsQ0FBQztJQUVPLG1CQUFtQixDQUFDLElBQWM7UUFDeEMsSUFBSTtZQUNGLElBQUksRUFBRSxDQUFDO1NBQ1I7UUFBQyxPQUFPLEdBQVEsRUFBRTtZQUNqQixPQUFPLENBQUMsSUFBSSxDQUNWLHNFQUFzRSxFQUN0RSxHQUFHLENBQ0osQ0FBQztTQUNIO0lBQ0gsQ0FBQztpSUFuTlUsaUJBQWlCLGtCQVdsQix3QkFBd0IsYUFDeEIscUJBQXFCO3FJQVpwQixpQkFBaUI7OzJGQUFqQixpQkFBaUI7a0JBRDdCLFVBQVU7OzBCQVlOLE1BQU07MkJBQUMsd0JBQXdCOzswQkFDL0IsTUFBTTsyQkFBQyxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIEluamVjdGlvblRva2VuIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24sIFVQREFURSB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IEVNUFRZLCBPYnNlcnZhYmxlLCBvZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgY2F0Y2hFcnJvcixcbiAgY29uY2F0TWFwLFxuICBkZWJvdW5jZVRpbWUsXG4gIGZpbHRlcixcbiAgbWFwLFxuICBzaGFyZSxcbiAgc3dpdGNoTWFwLFxuICB0YWtlLFxuICB0YWtlVW50aWwsXG4gIHRpbWVvdXQsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgSU1QT1JUX1NUQVRFLCBQRVJGT1JNX0FDVElPTiB9IGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQge1xuICBTZXJpYWxpemF0aW9uT3B0aW9ucyxcbiAgU1RPUkVfREVWVE9PTFNfQ09ORklHLFxuICBTdG9yZURldnRvb2xzQ29uZmlnLFxufSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgeyBEZXZ0b29sc0Rpc3BhdGNoZXIgfSBmcm9tICcuL2RldnRvb2xzLWRpc3BhdGNoZXInO1xuaW1wb3J0IHsgTGlmdGVkQWN0aW9uLCBMaWZ0ZWRTdGF0ZSB9IGZyb20gJy4vcmVkdWNlcic7XG5pbXBvcnQge1xuICBpc0FjdGlvbkZpbHRlcmVkLFxuICBzYW5pdGl6ZUFjdGlvbixcbiAgc2FuaXRpemVBY3Rpb25zLFxuICBzYW5pdGl6ZVN0YXRlLFxuICBzYW5pdGl6ZVN0YXRlcyxcbiAgc2hvdWxkRmlsdGVyQWN0aW9ucyxcbiAgdW5saWZ0U3RhdGUsXG59IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgaW5qZWN0Wm9uZUNvbmZpZyB9IGZyb20gJy4vem9uZS1jb25maWcnO1xuXG5leHBvcnQgY29uc3QgRXh0ZW5zaW9uQWN0aW9uVHlwZXMgPSB7XG4gIFNUQVJUOiAnU1RBUlQnLFxuICBESVNQQVRDSDogJ0RJU1BBVENIJyxcbiAgU1RPUDogJ1NUT1AnLFxuICBBQ1RJT046ICdBQ1RJT04nLFxufTtcblxuZXhwb3J0IGNvbnN0IFJFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTiA9XG4gIG5ldyBJbmplY3Rpb25Ub2tlbjxSZWR1eERldnRvb2xzRXh0ZW5zaW9uPihcbiAgICAnQG5ncngvc3RvcmUtZGV2dG9vbHMgUmVkdXggRGV2dG9vbHMgRXh0ZW5zaW9uJ1xuICApO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJlZHV4RGV2dG9vbHNFeHRlbnNpb25Db25uZWN0aW9uIHtcbiAgc3Vic2NyaWJlKGxpc3RlbmVyOiAoY2hhbmdlOiBhbnkpID0+IHZvaWQpOiB2b2lkO1xuICB1bnN1YnNjcmliZSgpOiB2b2lkO1xuICBzZW5kKGFjdGlvbjogYW55LCBzdGF0ZTogYW55KTogdm9pZDtcbiAgaW5pdChzdGF0ZT86IGFueSk6IHZvaWQ7XG4gIGVycm9yKGFueUVycjogYW55KTogdm9pZDtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgUmVkdXhEZXZ0b29sc0V4dGVuc2lvbkNvbmZpZyB7XG4gIGZlYXR1cmVzPzogb2JqZWN0IHwgYm9vbGVhbjtcbiAgbmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBtYXhBZ2U/OiBudW1iZXI7XG4gIGF1dG9QYXVzZT86IGJvb2xlYW47XG4gIHNlcmlhbGl6ZT86IGJvb2xlYW4gfCBTZXJpYWxpemF0aW9uT3B0aW9ucztcbiAgdHJhY2U/OiBib29sZWFuIHwgKCgpID0+IHN0cmluZyk7XG4gIHRyYWNlTGltaXQ/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVkdXhEZXZ0b29sc0V4dGVuc2lvbiB7XG4gIGNvbm5lY3QoXG4gICAgb3B0aW9uczogUmVkdXhEZXZ0b29sc0V4dGVuc2lvbkNvbmZpZ1xuICApOiBSZWR1eERldnRvb2xzRXh0ZW5zaW9uQ29ubmVjdGlvbjtcbiAgc2VuZChhY3Rpb246IGFueSwgc3RhdGU6IGFueSwgb3B0aW9uczogUmVkdXhEZXZ0b29sc0V4dGVuc2lvbkNvbmZpZyk6IHZvaWQ7XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEZXZ0b29sc0V4dGVuc2lvbiB7XG4gIHByaXZhdGUgZGV2dG9vbHNFeHRlbnNpb246IFJlZHV4RGV2dG9vbHNFeHRlbnNpb247XG4gIHByaXZhdGUgZXh0ZW5zaW9uQ29ubmVjdGlvbiE6IFJlZHV4RGV2dG9vbHNFeHRlbnNpb25Db25uZWN0aW9uO1xuXG4gIGxpZnRlZEFjdGlvbnMkITogT2JzZXJ2YWJsZTxhbnk+O1xuICBhY3Rpb25zJCE6IE9ic2VydmFibGU8YW55PjtcbiAgc3RhcnQkITogT2JzZXJ2YWJsZTxhbnk+O1xuXG4gIHByaXZhdGUgem9uZUNvbmZpZyA9IGluamVjdFpvbmVDb25maWcodGhpcy5jb25maWcuY29ubmVjdEluWm9uZSEpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OKSBkZXZ0b29sc0V4dGVuc2lvbjogUmVkdXhEZXZ0b29sc0V4dGVuc2lvbixcbiAgICBASW5qZWN0KFNUT1JFX0RFVlRPT0xTX0NPTkZJRykgcHJpdmF0ZSBjb25maWc6IFN0b3JlRGV2dG9vbHNDb25maWcsXG4gICAgcHJpdmF0ZSBkaXNwYXRjaGVyOiBEZXZ0b29sc0Rpc3BhdGNoZXJcbiAgKSB7XG4gICAgdGhpcy5kZXZ0b29sc0V4dGVuc2lvbiA9IGRldnRvb2xzRXh0ZW5zaW9uO1xuICAgIHRoaXMuY3JlYXRlQWN0aW9uU3RyZWFtcygpO1xuICB9XG5cbiAgbm90aWZ5KGFjdGlvbjogTGlmdGVkQWN0aW9uLCBzdGF0ZTogTGlmdGVkU3RhdGUpIHtcbiAgICBpZiAoIXRoaXMuZGV2dG9vbHNFeHRlbnNpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBhY3Rpb24gcmVxdWlyZXMgYSBmdWxsIHVwZGF0ZSBvZiB0aGUgbGlmdGVkU3RhdGUuXG4gICAgLy8gSWYgaXQgaXMgYSBzaW1wbGUgYWN0aW9uIGdlbmVyYXRlZCBieSB0aGUgdXNlcidzIGFwcCBhbmQgdGhlIHJlY29yZGluZ1xuICAgIC8vIGlzIG5vdCBsb2NrZWQvcGF1c2VkLCBvbmx5IHNlbmQgdGhlIGFjdGlvbiBhbmQgdGhlIGN1cnJlbnQgc3RhdGUgKGZhc3QpLlxuICAgIC8vXG4gICAgLy8gQSBmdWxsIGxpZnRlZFN0YXRlIHVwZGF0ZSAoc2xvdzogc2VyaWFsaXplcyB0aGUgZW50aXJlIGxpZnRlZFN0YXRlKSBpc1xuICAgIC8vIG9ubHkgcmVxdWlyZWQgd2hlbjpcbiAgICAvLyAgIGEpIHJlZHV4LWRldnRvb2xzLWV4dGVuc2lvbiBmaXJlcyB0aGUgQEBJbml0IGFjdGlvbiAoaWdub3JlZCBieVxuICAgIC8vICAgICAgQG5ncngvc3RvcmUtZGV2dG9vbHMpXG4gICAgLy8gICBiKSBhbiBhY3Rpb24gaXMgZ2VuZXJhdGVkIGJ5IGFuIEBuZ3J4IG1vZHVsZSAoZS5nLiBAbmdyeC9lZmZlY3RzL2luaXRcbiAgICAvLyAgICAgIG9yIEBuZ3J4L3N0b3JlL3VwZGF0ZS1yZWR1Y2VycylcbiAgICAvLyAgIGMpIHRoZSBzdGF0ZSBoYXMgYmVlbiByZWNvbXB1dGVkIGR1ZSB0byB0aW1lLXRyYXZlbGluZ1xuICAgIC8vICAgZCkgYW55IGFjdGlvbiB0aGF0IGlzIG5vdCBhIFBlcmZvcm1BY3Rpb24gdG8gZXJyIG9uIHRoZSBzaWRlIG9mXG4gICAgLy8gICAgICBjYXV0aW9uLlxuICAgIGlmIChhY3Rpb24udHlwZSA9PT0gUEVSRk9STV9BQ1RJT04pIHtcbiAgICAgIGlmIChzdGF0ZS5pc0xvY2tlZCB8fCBzdGF0ZS5pc1BhdXNlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGN1cnJlbnRTdGF0ZSA9IHVubGlmdFN0YXRlKHN0YXRlKTtcbiAgICAgIGlmIChcbiAgICAgICAgc2hvdWxkRmlsdGVyQWN0aW9ucyh0aGlzLmNvbmZpZykgJiZcbiAgICAgICAgaXNBY3Rpb25GaWx0ZXJlZChcbiAgICAgICAgICBjdXJyZW50U3RhdGUsXG4gICAgICAgICAgYWN0aW9uLFxuICAgICAgICAgIHRoaXMuY29uZmlnLnByZWRpY2F0ZSxcbiAgICAgICAgICB0aGlzLmNvbmZpZy5hY3Rpb25zU2FmZWxpc3QsXG4gICAgICAgICAgdGhpcy5jb25maWcuYWN0aW9uc0Jsb2NrbGlzdFxuICAgICAgICApXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3Qgc2FuaXRpemVkU3RhdGUgPSB0aGlzLmNvbmZpZy5zdGF0ZVNhbml0aXplclxuICAgICAgICA/IHNhbml0aXplU3RhdGUoXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5zdGF0ZVNhbml0aXplcixcbiAgICAgICAgICAgIGN1cnJlbnRTdGF0ZSxcbiAgICAgICAgICAgIHN0YXRlLmN1cnJlbnRTdGF0ZUluZGV4XG4gICAgICAgICAgKVxuICAgICAgICA6IGN1cnJlbnRTdGF0ZTtcbiAgICAgIGNvbnN0IHNhbml0aXplZEFjdGlvbiA9IHRoaXMuY29uZmlnLmFjdGlvblNhbml0aXplclxuICAgICAgICA/IHNhbml0aXplQWN0aW9uKFxuICAgICAgICAgICAgdGhpcy5jb25maWcuYWN0aW9uU2FuaXRpemVyLFxuICAgICAgICAgICAgYWN0aW9uLFxuICAgICAgICAgICAgc3RhdGUubmV4dEFjdGlvbklkXG4gICAgICAgICAgKVxuICAgICAgICA6IGFjdGlvbjtcblxuICAgICAgdGhpcy5zZW5kVG9SZWR1eERldnRvb2xzKCgpID0+XG4gICAgICAgIHRoaXMuZXh0ZW5zaW9uQ29ubmVjdGlvbi5zZW5kKHNhbml0aXplZEFjdGlvbiwgc2FuaXRpemVkU3RhdGUpXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZXF1aXJlcyBmdWxsIHN0YXRlIHVwZGF0ZVxuICAgICAgY29uc3Qgc2FuaXRpemVkTGlmdGVkU3RhdGUgPSB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBzdGFnZWRBY3Rpb25JZHM6IHN0YXRlLnN0YWdlZEFjdGlvbklkcyxcbiAgICAgICAgYWN0aW9uc0J5SWQ6IHRoaXMuY29uZmlnLmFjdGlvblNhbml0aXplclxuICAgICAgICAgID8gc2FuaXRpemVBY3Rpb25zKHRoaXMuY29uZmlnLmFjdGlvblNhbml0aXplciwgc3RhdGUuYWN0aW9uc0J5SWQpXG4gICAgICAgICAgOiBzdGF0ZS5hY3Rpb25zQnlJZCxcbiAgICAgICAgY29tcHV0ZWRTdGF0ZXM6IHRoaXMuY29uZmlnLnN0YXRlU2FuaXRpemVyXG4gICAgICAgICAgPyBzYW5pdGl6ZVN0YXRlcyh0aGlzLmNvbmZpZy5zdGF0ZVNhbml0aXplciwgc3RhdGUuY29tcHV0ZWRTdGF0ZXMpXG4gICAgICAgICAgOiBzdGF0ZS5jb21wdXRlZFN0YXRlcyxcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuc2VuZFRvUmVkdXhEZXZ0b29scygoKSA9PlxuICAgICAgICB0aGlzLmRldnRvb2xzRXh0ZW5zaW9uLnNlbmQoXG4gICAgICAgICAgbnVsbCxcbiAgICAgICAgICBzYW5pdGl6ZWRMaWZ0ZWRTdGF0ZSxcbiAgICAgICAgICB0aGlzLmdldEV4dGVuc2lvbkNvbmZpZyh0aGlzLmNvbmZpZylcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUNoYW5nZXNPYnNlcnZhYmxlKCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgaWYgKCF0aGlzLmRldnRvb2xzRXh0ZW5zaW9uKSB7XG4gICAgICByZXR1cm4gRU1QVFk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChzdWJzY3JpYmVyKSA9PiB7XG4gICAgICBjb25zdCBjb25uZWN0aW9uID0gdGhpcy56b25lQ29uZmlnLmNvbm5lY3RJblpvbmVcbiAgICAgICAgPyAvLyBUbyByZWR1Y2UgY2hhbmdlIGRldGVjdGlvbiBjeWNsZXMsIHdlIG5lZWQgdG8gcnVuIHRoZSBgY29ubmVjdGAgbWV0aG9kXG4gICAgICAgICAgLy8gb3V0c2lkZSBvZiB0aGUgQW5ndWxhciB6b25lLiBUaGUgYGNvbm5lY3RgIG1ldGhvZCBhZGRzIGEgYG1lc3NhZ2VgXG4gICAgICAgICAgLy8gZXZlbnQgbGlzdGVuZXIgdG8gY29tbXVuaWNhdGUgd2l0aCBhbiBleHRlbnNpb24gdXNpbmcgYHdpbmRvdy5wb3N0TWVzc2FnZWBcbiAgICAgICAgICAvLyBhbmQgaGFuZGxlIG1lc3NhZ2UgZXZlbnRzLlxuICAgICAgICAgIHRoaXMuem9uZUNvbmZpZy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT5cbiAgICAgICAgICAgIHRoaXMuZGV2dG9vbHNFeHRlbnNpb24uY29ubmVjdCh0aGlzLmdldEV4dGVuc2lvbkNvbmZpZyh0aGlzLmNvbmZpZykpXG4gICAgICAgICAgKVxuICAgICAgICA6IHRoaXMuZGV2dG9vbHNFeHRlbnNpb24uY29ubmVjdCh0aGlzLmdldEV4dGVuc2lvbkNvbmZpZyh0aGlzLmNvbmZpZykpO1xuXG4gICAgICB0aGlzLmV4dGVuc2lvbkNvbm5lY3Rpb24gPSBjb25uZWN0aW9uO1xuICAgICAgY29ubmVjdGlvbi5pbml0KCk7XG5cbiAgICAgIGNvbm5lY3Rpb24uc3Vic2NyaWJlKChjaGFuZ2U6IGFueSkgPT4gc3Vic2NyaWJlci5uZXh0KGNoYW5nZSkpO1xuICAgICAgcmV0dXJuIGNvbm5lY3Rpb24udW5zdWJzY3JpYmU7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUFjdGlvblN0cmVhbXMoKSB7XG4gICAgLy8gTGlzdGVucyB0byBhbGwgY2hhbmdlc1xuICAgIGNvbnN0IGNoYW5nZXMkID0gdGhpcy5jcmVhdGVDaGFuZ2VzT2JzZXJ2YWJsZSgpLnBpcGUoc2hhcmUoKSk7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSBzdGFydCBhY3Rpb25cbiAgICBjb25zdCBzdGFydCQgPSBjaGFuZ2VzJC5waXBlKFxuICAgICAgZmlsdGVyKChjaGFuZ2U6IGFueSkgPT4gY2hhbmdlLnR5cGUgPT09IEV4dGVuc2lvbkFjdGlvblR5cGVzLlNUQVJUKVxuICAgICk7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSBzdG9wIGFjdGlvblxuICAgIGNvbnN0IHN0b3AkID0gY2hhbmdlcyQucGlwZShcbiAgICAgIGZpbHRlcigoY2hhbmdlOiBhbnkpID0+IGNoYW5nZS50eXBlID09PSBFeHRlbnNpb25BY3Rpb25UeXBlcy5TVE9QKVxuICAgICk7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIGxpZnRlZCBhY3Rpb25zXG4gICAgY29uc3QgbGlmdGVkQWN0aW9ucyQgPSBjaGFuZ2VzJC5waXBlKFxuICAgICAgZmlsdGVyKChjaGFuZ2UpID0+IGNoYW5nZS50eXBlID09PSBFeHRlbnNpb25BY3Rpb25UeXBlcy5ESVNQQVRDSCksXG4gICAgICBtYXAoKGNoYW5nZSkgPT4gdGhpcy51bndyYXBBY3Rpb24oY2hhbmdlLnBheWxvYWQpKSxcbiAgICAgIGNvbmNhdE1hcCgoYWN0aW9uOiBhbnkpID0+IHtcbiAgICAgICAgaWYgKGFjdGlvbi50eXBlID09PSBJTVBPUlRfU1RBVEUpIHtcbiAgICAgICAgICAvLyBTdGF0ZSBpbXBvcnRzIG1heSBoYXBwZW4gaW4gdHdvIHNpdHVhdGlvbnM6XG4gICAgICAgICAgLy8gMS4gRXhwbGljaXRseSBieSB1c2VyXG4gICAgICAgICAgLy8gMi4gVXNlciBhY3RpdmF0ZWQgdGhlIFwicGVyc2lzdCBzdGF0ZSBhY2Nyb3NzIHJlbG9hZHNcIiBvcHRpb25cbiAgICAgICAgICAvLyAgICBhbmQgbm93IHRoZSBzdGF0ZSBpcyBpbXBvcnRlZCBkdXJpbmcgcmVsb2FkLlxuICAgICAgICAgIC8vIEJlY2F1c2Ugb2Ygb3B0aW9uIDIsIHdlIG5lZWQgdG8gZ2l2ZSBwb3NzaWJsZVxuICAgICAgICAgIC8vIGxhenkgbG9hZGVkIHJlZHVjZXJzIHRpbWUgdG8gaW5zdGFudGlhdGUuXG4gICAgICAgICAgLy8gQXMgc29vbiBhcyB0aGVyZSBpcyBubyBVUERBVEUgYWN0aW9uIHdpdGhpbiAxIHNlY29uZCxcbiAgICAgICAgICAvLyBpdCBpcyBhc3N1bWVkIHRoYXQgYWxsIHJlZHVjZXJzIGFyZSBsb2FkZWQuXG4gICAgICAgICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hlci5waXBlKFxuICAgICAgICAgICAgZmlsdGVyKChhY3Rpb24pID0+IGFjdGlvbi50eXBlID09PSBVUERBVEUpLFxuICAgICAgICAgICAgdGltZW91dCgxMDAwKSxcbiAgICAgICAgICAgIGRlYm91bmNlVGltZSgxMDAwKSxcbiAgICAgICAgICAgIG1hcCgoKSA9PiBhY3Rpb24pLFxuICAgICAgICAgICAgY2F0Y2hFcnJvcigoKSA9PiBvZihhY3Rpb24pKSxcbiAgICAgICAgICAgIHRha2UoMSlcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBvZihhY3Rpb24pO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHVubGlmdGVkIGFjdGlvbnNcbiAgICBjb25zdCBhY3Rpb25zJCA9IGNoYW5nZXMkLnBpcGUoXG4gICAgICBmaWx0ZXIoKGNoYW5nZSkgPT4gY2hhbmdlLnR5cGUgPT09IEV4dGVuc2lvbkFjdGlvblR5cGVzLkFDVElPTiksXG4gICAgICBtYXAoKGNoYW5nZSkgPT4gdGhpcy51bndyYXBBY3Rpb24oY2hhbmdlLnBheWxvYWQpKVxuICAgICk7XG5cbiAgICBjb25zdCBhY3Rpb25zVW50aWxTdG9wJCA9IGFjdGlvbnMkLnBpcGUodGFrZVVudGlsKHN0b3AkKSk7XG4gICAgY29uc3QgbGlmdGVkVW50aWxTdG9wJCA9IGxpZnRlZEFjdGlvbnMkLnBpcGUodGFrZVVudGlsKHN0b3AkKSk7XG4gICAgdGhpcy5zdGFydCQgPSBzdGFydCQucGlwZSh0YWtlVW50aWwoc3RvcCQpKTtcblxuICAgIC8vIE9ubHkgdGFrZSB0aGUgYWN0aW9uIHNvdXJjZXMgYmV0d2VlbiB0aGUgc3RhcnQvc3RvcCBldmVudHNcbiAgICB0aGlzLmFjdGlvbnMkID0gdGhpcy5zdGFydCQucGlwZShzd2l0Y2hNYXAoKCkgPT4gYWN0aW9uc1VudGlsU3RvcCQpKTtcbiAgICB0aGlzLmxpZnRlZEFjdGlvbnMkID0gdGhpcy5zdGFydCQucGlwZShzd2l0Y2hNYXAoKCkgPT4gbGlmdGVkVW50aWxTdG9wJCkpO1xuICB9XG5cbiAgcHJpdmF0ZSB1bndyYXBBY3Rpb24oYWN0aW9uOiBBY3Rpb24pIHtcbiAgICByZXR1cm4gdHlwZW9mIGFjdGlvbiA9PT0gJ3N0cmluZycgPyBldmFsKGAoJHthY3Rpb259KWApIDogYWN0aW9uO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRFeHRlbnNpb25Db25maWcoY29uZmlnOiBTdG9yZURldnRvb2xzQ29uZmlnKSB7XG4gICAgY29uc3QgZXh0ZW5zaW9uT3B0aW9uczogUmVkdXhEZXZ0b29sc0V4dGVuc2lvbkNvbmZpZyA9IHtcbiAgICAgIG5hbWU6IGNvbmZpZy5uYW1lLFxuICAgICAgZmVhdHVyZXM6IGNvbmZpZy5mZWF0dXJlcyxcbiAgICAgIHNlcmlhbGl6ZTogY29uZmlnLnNlcmlhbGl6ZSxcbiAgICAgIGF1dG9QYXVzZTogY29uZmlnLmF1dG9QYXVzZSA/PyBmYWxzZSxcbiAgICAgIHRyYWNlOiBjb25maWcudHJhY2UgPz8gZmFsc2UsXG4gICAgICB0cmFjZUxpbWl0OiBjb25maWcudHJhY2VMaW1pdCA/PyA3NSxcbiAgICAgIC8vIFRoZSBhY3Rpb24vc3RhdGUgc2FuaXRpemVycyBhcmUgbm90IGFkZGVkIHRvIHRoZSBjb25maWdcbiAgICAgIC8vIGJlY2F1c2Ugc2FuaXRhdGlvbiBpcyBkb25lIGluIHRoaXMgY2xhc3MgYWxyZWFkeS5cbiAgICAgIC8vIEl0IGlzIGRvbmUgYmVmb3JlIHNlbmRpbmcgaXQgdG8gdGhlIGRldnRvb2xzIGV4dGVuc2lvbiBmb3IgY29uc2lzdGVuY3k6XG4gICAgICAvLyAtIElmIHdlIGNhbGwgZXh0ZW5zaW9uQ29ubmVjdGlvbi5zZW5kKC4uLiksXG4gICAgICAvLyAgIHRoZSBleHRlbnNpb24gd291bGQgY2FsbCB0aGUgc2FuaXRpemVycy5cbiAgICAgIC8vIC0gSWYgd2UgY2FsbCBkZXZ0b29sc0V4dGVuc2lvbi5zZW5kKC4uLikgKGFrYSBmdWxsIHN0YXRlIHVwZGF0ZSksXG4gICAgICAvLyAgIHRoZSBleHRlbnNpb24gd291bGQgTk9UIGNhbGwgdGhlIHNhbml0aXplcnMsIHNvIHdlIGhhdmUgdG8gZG8gaXQgb3Vyc2VsdmVzLlxuICAgIH07XG4gICAgaWYgKGNvbmZpZy5tYXhBZ2UgIT09IGZhbHNlIC8qIHN1cHBvcnQgPT09IDAgKi8pIHtcbiAgICAgIGV4dGVuc2lvbk9wdGlvbnMubWF4QWdlID0gY29uZmlnLm1heEFnZTtcbiAgICB9XG4gICAgcmV0dXJuIGV4dGVuc2lvbk9wdGlvbnM7XG4gIH1cblxuICBwcml2YXRlIHNlbmRUb1JlZHV4RGV2dG9vbHMoc2VuZDogRnVuY3Rpb24pIHtcbiAgICB0cnkge1xuICAgICAgc2VuZCgpO1xuICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICdAbmdyeC9zdG9yZS1kZXZ0b29sczogc29tZXRoaW5nIHdlbnQgd3JvbmcgaW5zaWRlIHRoZSByZWR1eCBkZXZ0b29scycsXG4gICAgICAgIGVyclxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==