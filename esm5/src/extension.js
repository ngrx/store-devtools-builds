var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { empty, of, Observable } from 'rxjs';
import { filter, map, share, switchMap, takeUntil, concatMap, debounceTime, timeout, catchError, take, } from 'rxjs/operators';
import { PERFORM_ACTION, IMPORT_STATE } from './actions';
import { STORE_DEVTOOLS_CONFIG, StoreDevtoolsConfig, } from './config';
import { sanitizeAction, sanitizeActions, sanitizeState, sanitizeStates, unliftState, } from './utils';
import { UPDATE } from '@ngrx/store';
import { DevtoolsDispatcher } from './devtools-dispatcher';
export var ExtensionActionTypes = {
    START: 'START',
    DISPATCH: 'DISPATCH',
    STOP: 'STOP',
    ACTION: 'ACTION',
};
export var REDUX_DEVTOOLS_EXTENSION = new InjectionToken('Redux Devtools Extension');
var DevtoolsExtension = /** @class */ (function () {
    function DevtoolsExtension(devtoolsExtension, config, dispatcher) {
        this.config = config;
        this.dispatcher = dispatcher;
        this.devtoolsExtension = devtoolsExtension;
        this.createActionStreams();
    }
    DevtoolsExtension.prototype.notify = function (action, state) {
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
            var currentState = unliftState(state);
            var sanitizedState = this.config.stateSanitizer
                ? sanitizeState(this.config.stateSanitizer, currentState, state.currentStateIndex)
                : currentState;
            var sanitizedAction = this.config.actionSanitizer
                ? sanitizeAction(this.config.actionSanitizer, action, state.nextActionId)
                : action;
            this.extensionConnection.send(sanitizedAction, sanitizedState);
        }
        else {
            // Requires full state update
            var sanitizedLiftedState = __assign({}, state, { actionsById: this.config.actionSanitizer
                    ? sanitizeActions(this.config.actionSanitizer, state.actionsById)
                    : state.actionsById, computedStates: this.config.stateSanitizer
                    ? sanitizeStates(this.config.stateSanitizer, state.computedStates)
                    : state.computedStates });
            this.devtoolsExtension.send(null, sanitizedLiftedState, this.getExtensionConfig(this.config));
        }
    };
    DevtoolsExtension.prototype.createChangesObservable = function () {
        var _this = this;
        if (!this.devtoolsExtension) {
            return empty();
        }
        return new Observable(function (subscriber) {
            var connection = _this.devtoolsExtension.connect(_this.getExtensionConfig(_this.config));
            _this.extensionConnection = connection;
            connection.init();
            connection.subscribe(function (change) { return subscriber.next(change); });
            return connection.unsubscribe;
        });
    };
    DevtoolsExtension.prototype.createActionStreams = function () {
        var _this = this;
        // Listens to all changes
        var changes$ = this.createChangesObservable().pipe(share());
        // Listen for the start action
        var start$ = changes$.pipe(filter(function (change) { return change.type === ExtensionActionTypes.START; }));
        // Listen for the stop action
        var stop$ = changes$.pipe(filter(function (change) { return change.type === ExtensionActionTypes.STOP; }));
        // Listen for lifted actions
        var liftedActions$ = changes$.pipe(filter(function (change) { return change.type === ExtensionActionTypes.DISPATCH; }), map(function (change) { return _this.unwrapAction(change.payload); }), concatMap(function (action) {
            if (action.type === IMPORT_STATE) {
                // State imports may happen in two situations:
                // 1. Explicitly by user
                // 2. User activated the "persist state accross reloads" option
                //    and now the state is imported during reload.
                // Because of option 2, we need to give possible
                // lazy loaded reducers time to instantiate.
                // As soon as there is no UPDATE action within 1 second,
                // it is assumed that all reducers are loaded.
                return _this.dispatcher.pipe(filter(function (action) { return action.type === UPDATE; }), timeout(1000), debounceTime(1000), map(function () { return action; }), catchError(function () { return of(action); }), take(1));
            }
            else {
                return of(action);
            }
        }));
        // Listen for unlifted actions
        var actions$ = changes$.pipe(filter(function (change) { return change.type === ExtensionActionTypes.ACTION; }), map(function (change) { return _this.unwrapAction(change.payload); }));
        var actionsUntilStop$ = actions$.pipe(takeUntil(stop$));
        var liftedUntilStop$ = liftedActions$.pipe(takeUntil(stop$));
        this.start$ = start$.pipe(takeUntil(stop$));
        // Only take the action sources between the start/stop events
        this.actions$ = this.start$.pipe(switchMap(function () { return actionsUntilStop$; }));
        this.liftedActions$ = this.start$.pipe(switchMap(function () { return liftedUntilStop$; }));
    };
    DevtoolsExtension.prototype.unwrapAction = function (action) {
        return typeof action === 'string' ? eval("(" + action + ")") : action;
    };
    DevtoolsExtension.prototype.getExtensionConfig = function (config) {
        var extensionOptions = {
            name: config.name,
            features: config.features,
            serialize: config.serialize,
        };
        if (config.maxAge !== false /* support === 0 */) {
            extensionOptions.maxAge = config.maxAge;
        }
        return extensionOptions;
    };
    DevtoolsExtension.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    DevtoolsExtension.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [REDUX_DEVTOOLS_EXTENSION,] }] },
        { type: StoreDevtoolsConfig, decorators: [{ type: Inject, args: [STORE_DEVTOOLS_CONFIG,] }] },
        { type: DevtoolsDispatcher }
    ]; };
    return DevtoolsExtension;
}());
export { DevtoolsExtension };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5zaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9zdG9yZS1kZXZ0b29scy9zcmMvZXh0ZW5zaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRW5FLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM3QyxPQUFPLEVBQ0wsTUFBTSxFQUNOLEdBQUcsRUFDSCxLQUFLLEVBQ0wsU0FBUyxFQUNULFNBQVMsRUFDVCxTQUFTLEVBQ1QsWUFBWSxFQUNaLE9BQU8sRUFDUCxVQUFVLEVBQ1YsSUFBSSxHQUNMLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEIsT0FBTyxFQUFFLGNBQWMsRUFBRSxZQUFZLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDekQsT0FBTyxFQUVMLHFCQUFxQixFQUNyQixtQkFBbUIsR0FDcEIsTUFBTSxVQUFVLENBQUM7QUFFbEIsT0FBTyxFQUNMLGNBQWMsRUFDZCxlQUFlLEVBQ2YsYUFBYSxFQUNiLGNBQWMsRUFDZCxXQUFXLEdBQ1osTUFBTSxTQUFTLENBQUM7QUFDakIsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUNyQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUUzRCxNQUFNLENBQUMsSUFBTSxvQkFBb0IsR0FBRztJQUNsQyxLQUFLLEVBQUUsT0FBTztJQUNkLFFBQVEsRUFBRSxVQUFVO0lBQ3BCLElBQUksRUFBRSxNQUFNO0lBQ1osTUFBTSxFQUFFLFFBQVE7Q0FDakIsQ0FBQztBQUVGLE1BQU0sQ0FBQyxJQUFNLHdCQUF3QixHQUFHLElBQUksY0FBYyxDQUV4RCwwQkFBMEIsQ0FBQyxDQUFDO0FBdUI5QjtJQVNFLDJCQUNv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QyxDQUFDO1FBRTVDLDZEQUE2RDtRQUM3RCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFNLE9BQUEsaUJBQWlCLEVBQWpCLENBQWlCLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQU0sT0FBQSxnQkFBZ0IsRUFBaEIsQ0FBZ0IsQ0FBQyxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUVPLHdDQUFZLEdBQXBCLFVBQXFCLE1BQWM7UUFDakMsT0FBTyxPQUFPLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFJLE1BQU0sTUFBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUNuRSxDQUFDO0lBRU8sOENBQWtCLEdBQTFCLFVBQTJCLE1BQTJCO1FBQ3BELElBQU0sZ0JBQWdCLEdBQWlDO1lBQ3JELElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtZQUNqQixRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVE7WUFDekIsU0FBUyxFQUFFLE1BQU0sQ0FBQyxTQUFTO1NBUTVCLENBQUM7UUFDRixJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssS0FBSyxDQUFDLG1CQUFtQixFQUFFO1lBQy9DLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1NBQ3pDO1FBQ0QsT0FBTyxnQkFBZ0IsQ0FBQztJQUMxQixDQUFDOztnQkEzS0YsVUFBVTs7OztnREFVTixNQUFNLFNBQUMsd0JBQXdCO2dCQXZEbEMsbUJBQW1CLHVCQXdEaEIsTUFBTSxTQUFDLHFCQUFxQjtnQkE3Q3hCLGtCQUFrQjs7SUE4TTNCLHdCQUFDO0NBQUEsQUE1S0QsSUE0S0M7U0EzS1ksaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBJbmplY3Rpb25Ub2tlbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgZW1wdHksIG9mLCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBmaWx0ZXIsXG4gIG1hcCxcbiAgc2hhcmUsXG4gIHN3aXRjaE1hcCxcbiAgdGFrZVVudGlsLFxuICBjb25jYXRNYXAsXG4gIGRlYm91bmNlVGltZSxcbiAgdGltZW91dCxcbiAgY2F0Y2hFcnJvcixcbiAgdGFrZSxcbn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBQRVJGT1JNX0FDVElPTiwgSU1QT1JUX1NUQVRFIH0gZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7XG4gIFNlcmlhbGl6YXRpb25PcHRpb25zLFxuICBTVE9SRV9ERVZUT09MU19DT05GSUcsXG4gIFN0b3JlRGV2dG9vbHNDb25maWcsXG59IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7IExpZnRlZEFjdGlvbiwgTGlmdGVkU3RhdGUgfSBmcm9tICcuL3JlZHVjZXInO1xuaW1wb3J0IHtcbiAgc2FuaXRpemVBY3Rpb24sXG4gIHNhbml0aXplQWN0aW9ucyxcbiAgc2FuaXRpemVTdGF0ZSxcbiAgc2FuaXRpemVTdGF0ZXMsXG4gIHVubGlmdFN0YXRlLFxufSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IFVQREFURSB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IERldnRvb2xzRGlzcGF0Y2hlciB9IGZyb20gJy4vZGV2dG9vbHMtZGlzcGF0Y2hlcic7XG5cbmV4cG9ydCBjb25zdCBFeHRlbnNpb25BY3Rpb25UeXBlcyA9IHtcbiAgU1RBUlQ6ICdTVEFSVCcsXG4gIERJU1BBVENIOiAnRElTUEFUQ0gnLFxuICBTVE9QOiAnU1RPUCcsXG4gIEFDVElPTjogJ0FDVElPTicsXG59O1xuXG5leHBvcnQgY29uc3QgUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OID0gbmV3IEluamVjdGlvblRva2VuPFxuICBSZWR1eERldnRvb2xzRXh0ZW5zaW9uXG4+KCdSZWR1eCBEZXZ0b29scyBFeHRlbnNpb24nKTtcblxuZXhwb3J0IGludGVyZmFjZSBSZWR1eERldnRvb2xzRXh0ZW5zaW9uQ29ubmVjdGlvbiB7XG4gIHN1YnNjcmliZShsaXN0ZW5lcjogKGNoYW5nZTogYW55KSA9PiB2b2lkKTogdm9pZDtcbiAgdW5zdWJzY3JpYmUoKTogdm9pZDtcbiAgc2VuZChhY3Rpb246IGFueSwgc3RhdGU6IGFueSk6IHZvaWQ7XG4gIGluaXQoc3RhdGU/OiBhbnkpOiB2b2lkO1xuICBlcnJvcihhbnlFcnI6IGFueSk6IHZvaWQ7XG59XG5leHBvcnQgaW50ZXJmYWNlIFJlZHV4RGV2dG9vbHNFeHRlbnNpb25Db25maWcge1xuICBmZWF0dXJlcz86IG9iamVjdCB8IGJvb2xlYW47XG4gIG5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgbWF4QWdlPzogbnVtYmVyO1xuICBzZXJpYWxpemU/OiBib29sZWFuIHwgU2VyaWFsaXphdGlvbk9wdGlvbnM7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVkdXhEZXZ0b29sc0V4dGVuc2lvbiB7XG4gIGNvbm5lY3QoXG4gICAgb3B0aW9uczogUmVkdXhEZXZ0b29sc0V4dGVuc2lvbkNvbmZpZ1xuICApOiBSZWR1eERldnRvb2xzRXh0ZW5zaW9uQ29ubmVjdGlvbjtcbiAgc2VuZChhY3Rpb246IGFueSwgc3RhdGU6IGFueSwgb3B0aW9uczogUmVkdXhEZXZ0b29sc0V4dGVuc2lvbkNvbmZpZyk6IHZvaWQ7XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEZXZ0b29sc0V4dGVuc2lvbiB7XG4gIHByaXZhdGUgZGV2dG9vbHNFeHRlbnNpb246IFJlZHV4RGV2dG9vbHNFeHRlbnNpb247XG4gIHByaXZhdGUgZXh0ZW5zaW9uQ29ubmVjdGlvbjogUmVkdXhEZXZ0b29sc0V4dGVuc2lvbkNvbm5lY3Rpb247XG5cbiAgbGlmdGVkQWN0aW9ucyQ6IE9ic2VydmFibGU8YW55PjtcbiAgYWN0aW9ucyQ6IE9ic2VydmFibGU8YW55PjtcbiAgc3RhcnQkOiBPYnNlcnZhYmxlPGFueT47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChSRURVWF9ERVZUT09MU19FWFRFTlNJT04pIGRldnRvb2xzRXh0ZW5zaW9uOiBSZWR1eERldnRvb2xzRXh0ZW5zaW9uLFxuICAgIEBJbmplY3QoU1RPUkVfREVWVE9PTFNfQ09ORklHKSBwcml2YXRlIGNvbmZpZzogU3RvcmVEZXZ0b29sc0NvbmZpZyxcbiAgICBwcml2YXRlIGRpc3BhdGNoZXI6IERldnRvb2xzRGlzcGF0Y2hlclxuICApIHtcbiAgICB0aGlzLmRldnRvb2xzRXh0ZW5zaW9uID0gZGV2dG9vbHNFeHRlbnNpb247XG4gICAgdGhpcy5jcmVhdGVBY3Rpb25TdHJlYW1zKCk7XG4gIH1cblxuICBub3RpZnkoYWN0aW9uOiBMaWZ0ZWRBY3Rpb24sIHN0YXRlOiBMaWZ0ZWRTdGF0ZSkge1xuICAgIGlmICghdGhpcy5kZXZ0b29sc0V4dGVuc2lvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYWN0aW9uIHJlcXVpcmVzIGEgZnVsbCB1cGRhdGUgb2YgdGhlIGxpZnRlZFN0YXRlLlxuICAgIC8vIElmIGl0IGlzIGEgc2ltcGxlIGFjdGlvbiBnZW5lcmF0ZWQgYnkgdGhlIHVzZXIncyBhcHAgYW5kIHRoZSByZWNvcmRpbmdcbiAgICAvLyBpcyBub3QgbG9ja2VkL3BhdXNlZCwgb25seSBzZW5kIHRoZSBhY3Rpb24gYW5kIHRoZSBjdXJyZW50IHN0YXRlIChmYXN0KS5cbiAgICAvL1xuICAgIC8vIEEgZnVsbCBsaWZ0ZWRTdGF0ZSB1cGRhdGUgKHNsb3c6IHNlcmlhbGl6ZXMgdGhlIGVudGlyZSBsaWZ0ZWRTdGF0ZSkgaXNcbiAgICAvLyBvbmx5IHJlcXVpcmVkIHdoZW46XG4gICAgLy8gICBhKSByZWR1eC1kZXZ0b29scy1leHRlbnNpb24gZmlyZXMgdGhlIEBASW5pdCBhY3Rpb24gKGlnbm9yZWQgYnlcbiAgICAvLyAgICAgIEBuZ3J4L3N0b3JlLWRldnRvb2xzKVxuICAgIC8vICAgYikgYW4gYWN0aW9uIGlzIGdlbmVyYXRlZCBieSBhbiBAbmdyeCBtb2R1bGUgKGUuZy4gQG5ncngvZWZmZWN0cy9pbml0XG4gICAgLy8gICAgICBvciBAbmdyeC9zdG9yZS91cGRhdGUtcmVkdWNlcnMpXG4gICAgLy8gICBjKSB0aGUgc3RhdGUgaGFzIGJlZW4gcmVjb21wdXRlZCBkdWUgdG8gdGltZS10cmF2ZWxpbmdcbiAgICAvLyAgIGQpIGFueSBhY3Rpb24gdGhhdCBpcyBub3QgYSBQZXJmb3JtQWN0aW9uIHRvIGVyciBvbiB0aGUgc2lkZSBvZlxuICAgIC8vICAgICAgY2F1dGlvbi5cbiAgICBpZiAoYWN0aW9uLnR5cGUgPT09IFBFUkZPUk1fQUNUSU9OKSB7XG4gICAgICBpZiAoc3RhdGUuaXNMb2NrZWQgfHwgc3RhdGUuaXNQYXVzZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjdXJyZW50U3RhdGUgPSB1bmxpZnRTdGF0ZShzdGF0ZSk7XG4gICAgICBjb25zdCBzYW5pdGl6ZWRTdGF0ZSA9IHRoaXMuY29uZmlnLnN0YXRlU2FuaXRpemVyXG4gICAgICAgID8gc2FuaXRpemVTdGF0ZShcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLnN0YXRlU2FuaXRpemVyLFxuICAgICAgICAgICAgY3VycmVudFN0YXRlLFxuICAgICAgICAgICAgc3RhdGUuY3VycmVudFN0YXRlSW5kZXhcbiAgICAgICAgICApXG4gICAgICAgIDogY3VycmVudFN0YXRlO1xuICAgICAgY29uc3Qgc2FuaXRpemVkQWN0aW9uID0gdGhpcy5jb25maWcuYWN0aW9uU2FuaXRpemVyXG4gICAgICAgID8gc2FuaXRpemVBY3Rpb24oXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5hY3Rpb25TYW5pdGl6ZXIsXG4gICAgICAgICAgICBhY3Rpb24sXG4gICAgICAgICAgICBzdGF0ZS5uZXh0QWN0aW9uSWRcbiAgICAgICAgICApXG4gICAgICAgIDogYWN0aW9uO1xuICAgICAgdGhpcy5leHRlbnNpb25Db25uZWN0aW9uLnNlbmQoc2FuaXRpemVkQWN0aW9uLCBzYW5pdGl6ZWRTdGF0ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlcXVpcmVzIGZ1bGwgc3RhdGUgdXBkYXRlXG4gICAgICBjb25zdCBzYW5pdGl6ZWRMaWZ0ZWRTdGF0ZSA9IHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGFjdGlvbnNCeUlkOiB0aGlzLmNvbmZpZy5hY3Rpb25TYW5pdGl6ZXJcbiAgICAgICAgICA/IHNhbml0aXplQWN0aW9ucyh0aGlzLmNvbmZpZy5hY3Rpb25TYW5pdGl6ZXIsIHN0YXRlLmFjdGlvbnNCeUlkKVxuICAgICAgICAgIDogc3RhdGUuYWN0aW9uc0J5SWQsXG4gICAgICAgIGNvbXB1dGVkU3RhdGVzOiB0aGlzLmNvbmZpZy5zdGF0ZVNhbml0aXplclxuICAgICAgICAgID8gc2FuaXRpemVTdGF0ZXModGhpcy5jb25maWcuc3RhdGVTYW5pdGl6ZXIsIHN0YXRlLmNvbXB1dGVkU3RhdGVzKVxuICAgICAgICAgIDogc3RhdGUuY29tcHV0ZWRTdGF0ZXMsXG4gICAgICB9O1xuICAgICAgdGhpcy5kZXZ0b29sc0V4dGVuc2lvbi5zZW5kKFxuICAgICAgICBudWxsLFxuICAgICAgICBzYW5pdGl6ZWRMaWZ0ZWRTdGF0ZSxcbiAgICAgICAgdGhpcy5nZXRFeHRlbnNpb25Db25maWcodGhpcy5jb25maWcpXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQ2hhbmdlc09ic2VydmFibGUoKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBpZiAoIXRoaXMuZGV2dG9vbHNFeHRlbnNpb24pIHtcbiAgICAgIHJldHVybiBlbXB0eSgpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShzdWJzY3JpYmVyID0+IHtcbiAgICAgIGNvbnN0IGNvbm5lY3Rpb24gPSB0aGlzLmRldnRvb2xzRXh0ZW5zaW9uLmNvbm5lY3QoXG4gICAgICAgIHRoaXMuZ2V0RXh0ZW5zaW9uQ29uZmlnKHRoaXMuY29uZmlnKVxuICAgICAgKTtcbiAgICAgIHRoaXMuZXh0ZW5zaW9uQ29ubmVjdGlvbiA9IGNvbm5lY3Rpb247XG4gICAgICBjb25uZWN0aW9uLmluaXQoKTtcblxuICAgICAgY29ubmVjdGlvbi5zdWJzY3JpYmUoKGNoYW5nZTogYW55KSA9PiBzdWJzY3JpYmVyLm5leHQoY2hhbmdlKSk7XG4gICAgICByZXR1cm4gY29ubmVjdGlvbi51bnN1YnNjcmliZTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQWN0aW9uU3RyZWFtcygpIHtcbiAgICAvLyBMaXN0ZW5zIHRvIGFsbCBjaGFuZ2VzXG4gICAgY29uc3QgY2hhbmdlcyQgPSB0aGlzLmNyZWF0ZUNoYW5nZXNPYnNlcnZhYmxlKCkucGlwZShzaGFyZSgpKTtcblxuICAgIC8vIExpc3RlbiBmb3IgdGhlIHN0YXJ0IGFjdGlvblxuICAgIGNvbnN0IHN0YXJ0JCA9IGNoYW5nZXMkLnBpcGUoXG4gICAgICBmaWx0ZXIoKGNoYW5nZTogYW55KSA9PiBjaGFuZ2UudHlwZSA9PT0gRXh0ZW5zaW9uQWN0aW9uVHlwZXMuU1RBUlQpXG4gICAgKTtcblxuICAgIC8vIExpc3RlbiBmb3IgdGhlIHN0b3AgYWN0aW9uXG4gICAgY29uc3Qgc3RvcCQgPSBjaGFuZ2VzJC5waXBlKFxuICAgICAgZmlsdGVyKChjaGFuZ2U6IGFueSkgPT4gY2hhbmdlLnR5cGUgPT09IEV4dGVuc2lvbkFjdGlvblR5cGVzLlNUT1ApXG4gICAgKTtcblxuICAgIC8vIExpc3RlbiBmb3IgbGlmdGVkIGFjdGlvbnNcbiAgICBjb25zdCBsaWZ0ZWRBY3Rpb25zJCA9IGNoYW5nZXMkLnBpcGUoXG4gICAgICBmaWx0ZXIoY2hhbmdlID0+IGNoYW5nZS50eXBlID09PSBFeHRlbnNpb25BY3Rpb25UeXBlcy5ESVNQQVRDSCksXG4gICAgICBtYXAoY2hhbmdlID0+IHRoaXMudW53cmFwQWN0aW9uKGNoYW5nZS5wYXlsb2FkKSksXG4gICAgICBjb25jYXRNYXAoKGFjdGlvbjogYW55KSA9PiB7XG4gICAgICAgIGlmIChhY3Rpb24udHlwZSA9PT0gSU1QT1JUX1NUQVRFKSB7XG4gICAgICAgICAgLy8gU3RhdGUgaW1wb3J0cyBtYXkgaGFwcGVuIGluIHR3byBzaXR1YXRpb25zOlxuICAgICAgICAgIC8vIDEuIEV4cGxpY2l0bHkgYnkgdXNlclxuICAgICAgICAgIC8vIDIuIFVzZXIgYWN0aXZhdGVkIHRoZSBcInBlcnNpc3Qgc3RhdGUgYWNjcm9zcyByZWxvYWRzXCIgb3B0aW9uXG4gICAgICAgICAgLy8gICAgYW5kIG5vdyB0aGUgc3RhdGUgaXMgaW1wb3J0ZWQgZHVyaW5nIHJlbG9hZC5cbiAgICAgICAgICAvLyBCZWNhdXNlIG9mIG9wdGlvbiAyLCB3ZSBuZWVkIHRvIGdpdmUgcG9zc2libGVcbiAgICAgICAgICAvLyBsYXp5IGxvYWRlZCByZWR1Y2VycyB0aW1lIHRvIGluc3RhbnRpYXRlLlxuICAgICAgICAgIC8vIEFzIHNvb24gYXMgdGhlcmUgaXMgbm8gVVBEQVRFIGFjdGlvbiB3aXRoaW4gMSBzZWNvbmQsXG4gICAgICAgICAgLy8gaXQgaXMgYXNzdW1lZCB0aGF0IGFsbCByZWR1Y2VycyBhcmUgbG9hZGVkLlxuICAgICAgICAgIHJldHVybiB0aGlzLmRpc3BhdGNoZXIucGlwZShcbiAgICAgICAgICAgIGZpbHRlcihhY3Rpb24gPT4gYWN0aW9uLnR5cGUgPT09IFVQREFURSksXG4gICAgICAgICAgICB0aW1lb3V0KDEwMDApLFxuICAgICAgICAgICAgZGVib3VuY2VUaW1lKDEwMDApLFxuICAgICAgICAgICAgbWFwKCgpID0+IGFjdGlvbiksXG4gICAgICAgICAgICBjYXRjaEVycm9yKCgpID0+IG9mKGFjdGlvbikpLFxuICAgICAgICAgICAgdGFrZSgxKVxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG9mKGFjdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcblxuICAgIC8vIExpc3RlbiBmb3IgdW5saWZ0ZWQgYWN0aW9uc1xuICAgIGNvbnN0IGFjdGlvbnMkID0gY2hhbmdlcyQucGlwZShcbiAgICAgIGZpbHRlcihjaGFuZ2UgPT4gY2hhbmdlLnR5cGUgPT09IEV4dGVuc2lvbkFjdGlvblR5cGVzLkFDVElPTiksXG4gICAgICBtYXAoY2hhbmdlID0+IHRoaXMudW53cmFwQWN0aW9uKGNoYW5nZS5wYXlsb2FkKSlcbiAgICApO1xuXG4gICAgY29uc3QgYWN0aW9uc1VudGlsU3RvcCQgPSBhY3Rpb25zJC5waXBlKHRha2VVbnRpbChzdG9wJCkpO1xuICAgIGNvbnN0IGxpZnRlZFVudGlsU3RvcCQgPSBsaWZ0ZWRBY3Rpb25zJC5waXBlKHRha2VVbnRpbChzdG9wJCkpO1xuICAgIHRoaXMuc3RhcnQkID0gc3RhcnQkLnBpcGUodGFrZVVudGlsKHN0b3AkKSk7XG5cbiAgICAvLyBPbmx5IHRha2UgdGhlIGFjdGlvbiBzb3VyY2VzIGJldHdlZW4gdGhlIHN0YXJ0L3N0b3AgZXZlbnRzXG4gICAgdGhpcy5hY3Rpb25zJCA9IHRoaXMuc3RhcnQkLnBpcGUoc3dpdGNoTWFwKCgpID0+IGFjdGlvbnNVbnRpbFN0b3AkKSk7XG4gICAgdGhpcy5saWZ0ZWRBY3Rpb25zJCA9IHRoaXMuc3RhcnQkLnBpcGUoc3dpdGNoTWFwKCgpID0+IGxpZnRlZFVudGlsU3RvcCQpKTtcbiAgfVxuXG4gIHByaXZhdGUgdW53cmFwQWN0aW9uKGFjdGlvbjogQWN0aW9uKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBhY3Rpb24gPT09ICdzdHJpbmcnID8gZXZhbChgKCR7YWN0aW9ufSlgKSA6IGFjdGlvbjtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RXh0ZW5zaW9uQ29uZmlnKGNvbmZpZzogU3RvcmVEZXZ0b29sc0NvbmZpZykge1xuICAgIGNvbnN0IGV4dGVuc2lvbk9wdGlvbnM6IFJlZHV4RGV2dG9vbHNFeHRlbnNpb25Db25maWcgPSB7XG4gICAgICBuYW1lOiBjb25maWcubmFtZSxcbiAgICAgIGZlYXR1cmVzOiBjb25maWcuZmVhdHVyZXMsXG4gICAgICBzZXJpYWxpemU6IGNvbmZpZy5zZXJpYWxpemUsXG4gICAgICAvLyBUaGUgYWN0aW9uL3N0YXRlIHNhbml0aXplcnMgYXJlIG5vdCBhZGRlZCB0byB0aGUgY29uZmlnXG4gICAgICAvLyBiZWNhdXNlIHNhbml0YXRpb24gaXMgZG9uZSBpbiB0aGlzIGNsYXNzIGFscmVhZHkuXG4gICAgICAvLyBJdCBpcyBkb25lIGJlZm9yZSBzZW5kaW5nIGl0IHRvIHRoZSBkZXZ0b29scyBleHRlbnNpb24gZm9yIGNvbnNpc3RlbmN5OlxuICAgICAgLy8gLSBJZiB3ZSBjYWxsIGV4dGVuc2lvbkNvbm5lY3Rpb24uc2VuZCguLi4pLFxuICAgICAgLy8gICB0aGUgZXh0ZW5zaW9uIHdvdWxkIGNhbGwgdGhlIHNhbml0aXplcnMuXG4gICAgICAvLyAtIElmIHdlIGNhbGwgZGV2dG9vbHNFeHRlbnNpb24uc2VuZCguLi4pIChha2EgZnVsbCBzdGF0ZSB1cGRhdGUpLFxuICAgICAgLy8gICB0aGUgZXh0ZW5zaW9uIHdvdWxkIE5PVCBjYWxsIHRoZSBzYW5pdGl6ZXJzLCBzbyB3ZSBoYXZlIHRvIGRvIGl0IG91cnNlbHZlcy5cbiAgICB9O1xuICAgIGlmIChjb25maWcubWF4QWdlICE9PSBmYWxzZSAvKiBzdXBwb3J0ID09PSAwICovKSB7XG4gICAgICBleHRlbnNpb25PcHRpb25zLm1heEFnZSA9IGNvbmZpZy5tYXhBZ2U7XG4gICAgfVxuICAgIHJldHVybiBleHRlbnNpb25PcHRpb25zO1xuICB9XG59XG4iXX0=