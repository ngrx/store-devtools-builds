var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { empty, of, Observable } from 'rxjs';
import { filter, map, share, switchMap, takeUntil, concatMap, debounceTime, timeout, catchError, take, } from 'rxjs/operators';
import { PERFORM_ACTION, IMPORT_STATE } from './actions';
import { STORE_DEVTOOLS_CONFIG, StoreDevtoolsConfig, } from './config';
import { sanitizeAction, sanitizeActions, sanitizeState, sanitizeStates, unliftState, isActionFiltered, shouldFilterActions, } from './utils';
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
        var _this = this;
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
            if (shouldFilterActions(this.config) &&
                isActionFiltered(currentState, action, this.config.predicate, this.config.actionsSafelist, this.config.actionsBlocklist)) {
                return;
            }
            var sanitizedState_1 = this.config.stateSanitizer
                ? sanitizeState(this.config.stateSanitizer, currentState, state.currentStateIndex)
                : currentState;
            var sanitizedAction_1 = this.config.actionSanitizer
                ? sanitizeAction(this.config.actionSanitizer, action, state.nextActionId)
                : action;
            this.sendToReduxDevtools(function () {
                return _this.extensionConnection.send(sanitizedAction_1, sanitizedState_1);
            });
        }
        else {
            // Requires full state update
            var sanitizedLiftedState_1 = __assign({}, state, { stagedActionIds: state.stagedActionIds, actionsById: this.config.actionSanitizer
                    ? sanitizeActions(this.config.actionSanitizer, state.actionsById)
                    : state.actionsById, computedStates: this.config.stateSanitizer
                    ? sanitizeStates(this.config.stateSanitizer, state.computedStates)
                    : state.computedStates });
            this.sendToReduxDevtools(function () {
                return _this.devtoolsExtension.send(null, sanitizedLiftedState_1, _this.getExtensionConfig(_this.config));
            });
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
    DevtoolsExtension.prototype.sendToReduxDevtools = function (send) {
        try {
            send();
        }
        catch (err) {
            console.warn('@ngrx/store-devtools: something went wrong inside the redux devtools', err);
        }
    };
    DevtoolsExtension = __decorate([
        Injectable(),
        __param(0, Inject(REDUX_DEVTOOLS_EXTENSION)),
        __param(1, Inject(STORE_DEVTOOLS_CONFIG)),
        __metadata("design:paramtypes", [Object, StoreDevtoolsConfig,
            DevtoolsDispatcher])
    ], DevtoolsExtension);
    return DevtoolsExtension;
}());
export { DevtoolsExtension };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5zaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9zdG9yZS1kZXZ0b29scy9zcmMvZXh0ZW5zaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRW5FLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM3QyxPQUFPLEVBQ0wsTUFBTSxFQUNOLEdBQUcsRUFDSCxLQUFLLEVBQ0wsU0FBUyxFQUNULFNBQVMsRUFDVCxTQUFTLEVBQ1QsWUFBWSxFQUNaLE9BQU8sRUFDUCxVQUFVLEVBQ1YsSUFBSSxHQUNMLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEIsT0FBTyxFQUFFLGNBQWMsRUFBRSxZQUFZLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDekQsT0FBTyxFQUVMLHFCQUFxQixFQUNyQixtQkFBbUIsR0FDcEIsTUFBTSxVQUFVLENBQUM7QUFFbEIsT0FBTyxFQUNMLGNBQWMsRUFDZCxlQUFlLEVBQ2YsYUFBYSxFQUNiLGNBQWMsRUFDZCxXQUFXLEVBQ1gsZ0JBQWdCLEVBRWhCLG1CQUFtQixHQUNwQixNQUFNLFNBQVMsQ0FBQztBQUNqQixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRTNELE1BQU0sQ0FBQyxJQUFNLG9CQUFvQixHQUFHO0lBQ2xDLEtBQUssRUFBRSxPQUFPO0lBQ2QsUUFBUSxFQUFFLFVBQVU7SUFDcEIsSUFBSSxFQUFFLE1BQU07SUFDWixNQUFNLEVBQUUsUUFBUTtDQUNqQixDQUFDO0FBRUYsTUFBTSxDQUFDLElBQU0sd0JBQXdCLEdBQUcsSUFBSSxjQUFj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QUFTLEVBQUUsTUFBTSxDQUFDLFNBQVM7U0FRNUIsQ0FBQztRQUNGLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxLQUFLLENBQUMsbUJBQW1CLEVBQUU7WUFDL0MsZ0JBQWdCLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7U0FDekM7UUFDRCxPQUFPLGdCQUFnQixDQUFDO0lBQzFCLENBQUM7SUFFTywrQ0FBbUIsR0FBM0IsVUFBNEIsSUFBYztRQUN4QyxJQUFJO1lBQ0YsSUFBSSxFQUFFLENBQUM7U0FDUjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osT0FBTyxDQUFDLElBQUksQ0FDVixzRUFBc0UsRUFDdEUsR0FBRyxDQUNKLENBQUM7U0FDSDtJQUNILENBQUM7SUF2TVUsaUJBQWlCO1FBRDdCLFVBQVUsRUFBRTtRQVVSLFdBQUEsTUFBTSxDQUFDLHdCQUF3QixDQUFDLENBQUE7UUFDaEMsV0FBQSxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQTtpREFBaUIsbUJBQW1CO1lBQzlDLGtCQUFrQjtPQVg3QixpQkFBaUIsQ0F3TTdCO0lBQUQsd0JBQUM7Q0FBQSxBQXhNRCxJQXdNQztTQXhNWSxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIEluamVjdGlvblRva2VuIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24gfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBlbXB0eSwgb2YsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIGZpbHRlcixcbiAgbWFwLFxuICBzaGFyZSxcbiAgc3dpdGNoTWFwLFxuICB0YWtlVW50aWwsXG4gIGNvbmNhdE1hcCxcbiAgZGVib3VuY2VUaW1lLFxuICB0aW1lb3V0LFxuICBjYXRjaEVycm9yLFxuICB0YWtlLFxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IFBFUkZPUk1fQUNUSU9OLCBJTVBPUlRfU1RBVEUgfSBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHtcbiAgU2VyaWFsaXphdGlvbk9wdGlvbnMsXG4gIFNUT1JFX0RFVlRPT0xTX0NPTkZJRyxcbiAgU3RvcmVEZXZ0b29sc0NvbmZpZyxcbn0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgTGlmdGVkQWN0aW9uLCBMaWZ0ZWRTdGF0ZSB9IGZyb20gJy4vcmVkdWNlcic7XG5pbXBvcnQge1xuICBzYW5pdGl6ZUFjdGlvbixcbiAgc2FuaXRpemVBY3Rpb25zLFxuICBzYW5pdGl6ZVN0YXRlLFxuICBzYW5pdGl6ZVN0YXRlcyxcbiAgdW5saWZ0U3RhdGUsXG4gIGlzQWN0aW9uRmlsdGVyZWQsXG4gIGZpbHRlckxpZnRlZFN0YXRlLFxuICBzaG91bGRGaWx0ZXJBY3Rpb25zLFxufSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IFVQREFURSB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IERldnRvb2xzRGlzcGF0Y2hlciB9IGZyb20gJy4vZGV2dG9vbHMtZGlzcGF0Y2hlcic7XG5cbmV4cG9ydCBjb25zdCBFeHRlbnNpb25BY3Rpb25UeXBlcyA9IHtcbiAgU1RBUlQ6ICdTVEFSVCcsXG4gIERJU1BBVENIOiAnRElTUEFUQ0gnLFxuICBTVE9QOiAnU1RPUCcsXG4gIEFDVElPTjogJ0FDVElPTicsXG59O1xuXG5leHBvcnQgY29uc3QgUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OID0gbmV3IEluamVjdGlvblRva2VuPFxuICBSZWR1eERldnRvb2xzRXh0ZW5zaW9uXG4+KCdSZWR1eCBEZXZ0b29scyBFeHRlbnNpb24nKTtcblxuZXhwb3J0IGludGVyZmFjZSBSZWR1eERldnRvb2xzRXh0ZW5zaW9uQ29ubmVjdGlvbiB7XG4gIHN1YnNjcmliZShsaXN0ZW5lcjogKGNoYW5nZTogYW55KSA9PiB2b2lkKTogdm9pZDtcbiAgdW5zdWJzY3JpYmUoKTogdm9pZDtcbiAgc2VuZChhY3Rpb246IGFueSwgc3RhdGU6IGFueSk6IHZvaWQ7XG4gIGluaXQoc3RhdGU/OiBhbnkpOiB2b2lkO1xuICBlcnJvcihhbnlFcnI6IGFueSk6IHZvaWQ7XG59XG5leHBvcnQgaW50ZXJmYWNlIFJlZHV4RGV2dG9vbHNFeHRlbnNpb25Db25maWcge1xuICBmZWF0dXJlcz86IG9iamVjdCB8IGJvb2xlYW47XG4gIG5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgbWF4QWdlPzogbnVtYmVyO1xuICBzZXJpYWxpemU/OiBib29sZWFuIHwgU2VyaWFsaXphdGlvbk9wdGlvbnM7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVkdXhEZXZ0b29sc0V4dGVuc2lvbiB7XG4gIGNvbm5lY3QoXG4gICAgb3B0aW9uczogUmVkdXhEZXZ0b29sc0V4dGVuc2lvbkNvbmZpZ1xuICApOiBSZWR1eERldnRvb2xzRXh0ZW5zaW9uQ29ubmVjdGlvbjtcbiAgc2VuZChhY3Rpb246IGFueSwgc3RhdGU6IGFueSwgb3B0aW9uczogUmVkdXhEZXZ0b29sc0V4dGVuc2lvbkNvbmZpZyk6IHZvaWQ7XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEZXZ0b29sc0V4dGVuc2lvbiB7XG4gIHByaXZhdGUgZGV2dG9vbHNFeHRlbnNpb246IFJlZHV4RGV2dG9vbHNFeHRlbnNpb247XG4gIHByaXZhdGUgZXh0ZW5zaW9uQ29ubmVjdGlvbjogUmVkdXhEZXZ0b29sc0V4dGVuc2lvbkNvbm5lY3Rpb247XG5cbiAgbGlmdGVkQWN0aW9ucyQ6IE9ic2VydmFibGU8YW55PjtcbiAgYWN0aW9ucyQ6IE9ic2VydmFibGU8YW55PjtcbiAgc3RhcnQkOiBPYnNlcnZhYmxlPGFueT47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChSRURVWF9ERVZUT09MU19FWFRFTlNJT04pIGRldnRvb2xzRXh0ZW5zaW9uOiBSZWR1eERldnRvb2xzRXh0ZW5zaW9uLFxuICAgIEBJbmplY3QoU1RPUkVfREVWVE9PTFNfQ09ORklHKSBwcml2YXRlIGNvbmZpZzogU3RvcmVEZXZ0b29sc0NvbmZpZyxcbiAgICBwcml2YXRlIGRpc3BhdGNoZXI6IERldnRvb2xzRGlzcGF0Y2hlclxuICApIHtcbiAgICB0aGlzLmRldnRvb2xzRXh0ZW5zaW9uID0gZGV2dG9vbHNFeHRlbnNpb247XG4gICAgdGhpcy5jcmVhdGVBY3Rpb25TdHJlYW1zKCk7XG4gIH1cblxuICBub3RpZnkoYWN0aW9uOiBMaWZ0ZWRBY3Rpb24sIHN0YXRlOiBMaWZ0ZWRTdGF0ZSkge1xuICAgIGlmICghdGhpcy5kZXZ0b29sc0V4dGVuc2lvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIGFjdGlvbiByZXF1aXJlcyBhIGZ1bGwgdXBkYXRlIG9mIHRoZSBsaWZ0ZWRTdGF0ZS5cbiAgICAvLyBJZiBpdCBpcyBhIHNpbXBsZSBhY3Rpb24gZ2VuZXJhdGVkIGJ5IHRoZSB1c2VyJ3MgYXBwIGFuZCB0aGUgcmVjb3JkaW5nXG4gICAgLy8gaXMgbm90IGxvY2tlZC9wYXVzZWQsIG9ubHkgc2VuZCB0aGUgYWN0aW9uIGFuZCB0aGUgY3VycmVudCBzdGF0ZSAoZmFzdCkuXG4gICAgLy9cbiAgICAvLyBBIGZ1bGwgbGlmdGVkU3RhdGUgdXBkYXRlIChzbG93OiBzZXJpYWxpemVzIHRoZSBlbnRpcmUgbGlmdGVkU3RhdGUpIGlzXG4gICAgLy8gb25seSByZXF1aXJlZCB3aGVuOlxuICAgIC8vICAgYSkgcmVkdXgtZGV2dG9vbHMtZXh0ZW5zaW9uIGZpcmVzIHRoZSBAQEluaXQgYWN0aW9uIChpZ25vcmVkIGJ5XG4gICAgLy8gICAgICBAbmdyeC9zdG9yZS1kZXZ0b29scylcbiAgICAvLyAgIGIpIGFuIGFjdGlvbiBpcyBnZW5lcmF0ZWQgYnkgYW4gQG5ncnggbW9kdWxlIChlLmcuIEBuZ3J4L2VmZmVjdHMvaW5pdFxuICAgIC8vICAgICAgb3IgQG5ncngvc3RvcmUvdXBkYXRlLXJlZHVjZXJzKVxuICAgIC8vICAgYykgdGhlIHN0YXRlIGhhcyBiZWVuIHJlY29tcHV0ZWQgZHVlIHRvIHRpbWUtdHJhdmVsaW5nXG4gICAgLy8gICBkKSBhbnkgYWN0aW9uIHRoYXQgaXMgbm90IGEgUGVyZm9ybUFjdGlvbiB0byBlcnIgb24gdGhlIHNpZGUgb2ZcbiAgICAvLyAgICAgIGNhdXRpb24uXG4gICAgaWYgKGFjdGlvbi50eXBlID09PSBQRVJGT1JNX0FDVElPTikge1xuICAgICAgaWYgKHN0YXRlLmlzTG9ja2VkIHx8IHN0YXRlLmlzUGF1c2VkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY3VycmVudFN0YXRlID0gdW5saWZ0U3RhdGUoc3RhdGUpO1xuICAgICAgaWYgKFxuICAgICAgICBzaG91bGRGaWx0ZXJBY3Rpb25zKHRoaXMuY29uZmlnKSAmJlxuICAgICAgICBpc0FjdGlvbkZpbHRlcmVkKFxuICAgICAgICAgIGN1cnJlbnRTdGF0ZSxcbiAgICAgICAgICBhY3Rpb24sXG4gICAgICAgICAgdGhpcy5jb25maWcucHJlZGljYXRlLFxuICAgICAgICAgIHRoaXMuY29uZmlnLmFjdGlvbnNTYWZlbGlzdCxcbiAgICAgICAgICB0aGlzLmNvbmZpZy5hY3Rpb25zQmxvY2tsaXN0XG4gICAgICAgIClcbiAgICAgICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBzYW5pdGl6ZWRTdGF0ZSA9IHRoaXMuY29uZmlnLnN0YXRlU2FuaXRpemVyXG4gICAgICAgID8gc2FuaXRpemVTdGF0ZShcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLnN0YXRlU2FuaXRpemVyLFxuICAgICAgICAgICAgY3VycmVudFN0YXRlLFxuICAgICAgICAgICAgc3RhdGUuY3VycmVudFN0YXRlSW5kZXhcbiAgICAgICAgICApXG4gICAgICAgIDogY3VycmVudFN0YXRlO1xuICAgICAgY29uc3Qgc2FuaXRpemVkQWN0aW9uID0gdGhpcy5jb25maWcuYWN0aW9uU2FuaXRpemVyXG4gICAgICAgID8gc2FuaXRpemVBY3Rpb24oXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5hY3Rpb25TYW5pdGl6ZXIsXG4gICAgICAgICAgICBhY3Rpb24sXG4gICAgICAgICAgICBzdGF0ZS5uZXh0QWN0aW9uSWRcbiAgICAgICAgICApXG4gICAgICAgIDogYWN0aW9uO1xuXG4gICAgICB0aGlzLnNlbmRUb1JlZHV4RGV2dG9vbHMoKCkgPT5cbiAgICAgICAgdGhpcy5leHRlbnNpb25Db25uZWN0aW9uLnNlbmQoc2FuaXRpemVkQWN0aW9uLCBzYW5pdGl6ZWRTdGF0ZSlcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlcXVpcmVzIGZ1bGwgc3RhdGUgdXBkYXRlXG4gICAgICBjb25zdCBzYW5pdGl6ZWRMaWZ0ZWRTdGF0ZSA9IHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIHN0YWdlZEFjdGlvbklkczogc3RhdGUuc3RhZ2VkQWN0aW9uSWRzLFxuICAgICAgICBhY3Rpb25zQnlJZDogdGhpcy5jb25maWcuYWN0aW9uU2FuaXRpemVyXG4gICAgICAgICAgPyBzYW5pdGl6ZUFjdGlvbnModGhpcy5jb25maWcuYWN0aW9uU2FuaXRpemVyLCBzdGF0ZS5hY3Rpb25zQnlJZClcbiAgICAgICAgICA6IHN0YXRlLmFjdGlvbnNCeUlkLFxuICAgICAgICBjb21wdXRlZFN0YXRlczogdGhpcy5jb25maWcuc3RhdGVTYW5pdGl6ZXJcbiAgICAgICAgICA/IHNhbml0aXplU3RhdGVzKHRoaXMuY29uZmlnLnN0YXRlU2FuaXRpemVyLCBzdGF0ZS5jb21wdXRlZFN0YXRlcylcbiAgICAgICAgICA6IHN0YXRlLmNvbXB1dGVkU3RhdGVzLFxuICAgICAgfTtcblxuICAgICAgdGhpcy5zZW5kVG9SZWR1eERldnRvb2xzKCgpID0+XG4gICAgICAgIHRoaXMuZGV2dG9vbHNFeHRlbnNpb24uc2VuZChcbiAgICAgICAgICBudWxsLFxuICAgICAgICAgIHNhbml0aXplZExpZnRlZFN0YXRlLFxuICAgICAgICAgIHRoaXMuZ2V0RXh0ZW5zaW9uQ29uZmlnKHRoaXMuY29uZmlnKVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQ2hhbmdlc09ic2VydmFibGUoKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBpZiAoIXRoaXMuZGV2dG9vbHNFeHRlbnNpb24pIHtcbiAgICAgIHJldHVybiBlbXB0eSgpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShzdWJzY3JpYmVyID0+IHtcbiAgICAgIGNvbnN0IGNvbm5lY3Rpb24gPSB0aGlzLmRldnRvb2xzRXh0ZW5zaW9uLmNvbm5lY3QoXG4gICAgICAgIHRoaXMuZ2V0RXh0ZW5zaW9uQ29uZmlnKHRoaXMuY29uZmlnKVxuICAgICAgKTtcbiAgICAgIHRoaXMuZXh0ZW5zaW9uQ29ubmVjdGlvbiA9IGNvbm5lY3Rpb247XG4gICAgICBjb25uZWN0aW9uLmluaXQoKTtcblxuICAgICAgY29ubmVjdGlvbi5zdWJzY3JpYmUoKGNoYW5nZTogYW55KSA9PiBzdWJzY3JpYmVyLm5leHQoY2hhbmdlKSk7XG4gICAgICByZXR1cm4gY29ubmVjdGlvbi51bnN1YnNjcmliZTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQWN0aW9uU3RyZWFtcygpIHtcbiAgICAvLyBMaXN0ZW5zIHRvIGFsbCBjaGFuZ2VzXG4gICAgY29uc3QgY2hhbmdlcyQgPSB0aGlzLmNyZWF0ZUNoYW5nZXNPYnNlcnZhYmxlKCkucGlwZShzaGFyZSgpKTtcblxuICAgIC8vIExpc3RlbiBmb3IgdGhlIHN0YXJ0IGFjdGlvblxuICAgIGNvbnN0IHN0YXJ0JCA9IGNoYW5nZXMkLnBpcGUoXG4gICAgICBmaWx0ZXIoKGNoYW5nZTogYW55KSA9PiBjaGFuZ2UudHlwZSA9PT0gRXh0ZW5zaW9uQWN0aW9uVHlwZXMuU1RBUlQpXG4gICAgKTtcblxuICAgIC8vIExpc3RlbiBmb3IgdGhlIHN0b3AgYWN0aW9uXG4gICAgY29uc3Qgc3RvcCQgPSBjaGFuZ2VzJC5waXBlKFxuICAgICAgZmlsdGVyKChjaGFuZ2U6IGFueSkgPT4gY2hhbmdlLnR5cGUgPT09IEV4dGVuc2lvbkFjdGlvblR5cGVzLlNUT1ApXG4gICAgKTtcblxuICAgIC8vIExpc3RlbiBmb3IgbGlmdGVkIGFjdGlvbnNcbiAgICBjb25zdCBsaWZ0ZWRBY3Rpb25zJCA9IGNoYW5nZXMkLnBpcGUoXG4gICAgICBmaWx0ZXIoY2hhbmdlID0+IGNoYW5nZS50eXBlID09PSBFeHRlbnNpb25BY3Rpb25UeXBlcy5ESVNQQVRDSCksXG4gICAgICBtYXAoY2hhbmdlID0+IHRoaXMudW53cmFwQWN0aW9uKGNoYW5nZS5wYXlsb2FkKSksXG4gICAgICBjb25jYXRNYXAoKGFjdGlvbjogYW55KSA9PiB7XG4gICAgICAgIGlmIChhY3Rpb24udHlwZSA9PT0gSU1QT1JUX1NUQVRFKSB7XG4gICAgICAgICAgLy8gU3RhdGUgaW1wb3J0cyBtYXkgaGFwcGVuIGluIHR3byBzaXR1YXRpb25zOlxuICAgICAgICAgIC8vIDEuIEV4cGxpY2l0bHkgYnkgdXNlclxuICAgICAgICAgIC8vIDIuIFVzZXIgYWN0aXZhdGVkIHRoZSBcInBlcnNpc3Qgc3RhdGUgYWNjcm9zcyByZWxvYWRzXCIgb3B0aW9uXG4gICAgICAgICAgLy8gICAgYW5kIG5vdyB0aGUgc3RhdGUgaXMgaW1wb3J0ZWQgZHVyaW5nIHJlbG9hZC5cbiAgICAgICAgICAvLyBCZWNhdXNlIG9mIG9wdGlvbiAyLCB3ZSBuZWVkIHRvIGdpdmUgcG9zc2libGVcbiAgICAgICAgICAvLyBsYXp5IGxvYWRlZCByZWR1Y2VycyB0aW1lIHRvIGluc3RhbnRpYXRlLlxuICAgICAgICAgIC8vIEFzIHNvb24gYXMgdGhlcmUgaXMgbm8gVVBEQVRFIGFjdGlvbiB3aXRoaW4gMSBzZWNvbmQsXG4gICAgICAgICAgLy8gaXQgaXMgYXNzdW1lZCB0aGF0IGFsbCByZWR1Y2VycyBhcmUgbG9hZGVkLlxuICAgICAgICAgIHJldHVybiB0aGlzLmRpc3BhdGNoZXIucGlwZShcbiAgICAgICAgICAgIGZpbHRlcihhY3Rpb24gPT4gYWN0aW9uLnR5cGUgPT09IFVQREFURSksXG4gICAgICAgICAgICB0aW1lb3V0KDEwMDApLFxuICAgICAgICAgICAgZGVib3VuY2VUaW1lKDEwMDApLFxuICAgICAgICAgICAgbWFwKCgpID0+IGFjdGlvbiksXG4gICAgICAgICAgICBjYXRjaEVycm9yKCgpID0+IG9mKGFjdGlvbikpLFxuICAgICAgICAgICAgdGFrZSgxKVxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG9mKGFjdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcblxuICAgIC8vIExpc3RlbiBmb3IgdW5saWZ0ZWQgYWN0aW9uc1xuICAgIGNvbnN0IGFjdGlvbnMkID0gY2hhbmdlcyQucGlwZShcbiAgICAgIGZpbHRlcihjaGFuZ2UgPT4gY2hhbmdlLnR5cGUgPT09IEV4dGVuc2lvbkFjdGlvblR5cGVzLkFDVElPTiksXG4gICAgICBtYXAoY2hhbmdlID0+IHRoaXMudW53cmFwQWN0aW9uKGNoYW5nZS5wYXlsb2FkKSlcbiAgICApO1xuXG4gICAgY29uc3QgYWN0aW9uc1VudGlsU3RvcCQgPSBhY3Rpb25zJC5waXBlKHRha2VVbnRpbChzdG9wJCkpO1xuICAgIGNvbnN0IGxpZnRlZFVudGlsU3RvcCQgPSBsaWZ0ZWRBY3Rpb25zJC5waXBlKHRha2VVbnRpbChzdG9wJCkpO1xuICAgIHRoaXMuc3RhcnQkID0gc3RhcnQkLnBpcGUodGFrZVVudGlsKHN0b3AkKSk7XG5cbiAgICAvLyBPbmx5IHRha2UgdGhlIGFjdGlvbiBzb3VyY2VzIGJldHdlZW4gdGhlIHN0YXJ0L3N0b3AgZXZlbnRzXG4gICAgdGhpcy5hY3Rpb25zJCA9IHRoaXMuc3RhcnQkLnBpcGUoc3dpdGNoTWFwKCgpID0+IGFjdGlvbnNVbnRpbFN0b3AkKSk7XG4gICAgdGhpcy5saWZ0ZWRBY3Rpb25zJCA9IHRoaXMuc3RhcnQkLnBpcGUoc3dpdGNoTWFwKCgpID0+IGxpZnRlZFVudGlsU3RvcCQpKTtcbiAgfVxuXG4gIHByaXZhdGUgdW53cmFwQWN0aW9uKGFjdGlvbjogQWN0aW9uKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBhY3Rpb24gPT09ICdzdHJpbmcnID8gZXZhbChgKCR7YWN0aW9ufSlgKSA6IGFjdGlvbjtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RXh0ZW5zaW9uQ29uZmlnKGNvbmZpZzogU3RvcmVEZXZ0b29sc0NvbmZpZykge1xuICAgIGNvbnN0IGV4dGVuc2lvbk9wdGlvbnM6IFJlZHV4RGV2dG9vbHNFeHRlbnNpb25Db25maWcgPSB7XG4gICAgICBuYW1lOiBjb25maWcubmFtZSxcbiAgICAgIGZlYXR1cmVzOiBjb25maWcuZmVhdHVyZXMsXG4gICAgICBzZXJpYWxpemU6IGNvbmZpZy5zZXJpYWxpemUsXG4gICAgICAvLyBUaGUgYWN0aW9uL3N0YXRlIHNhbml0aXplcnMgYXJlIG5vdCBhZGRlZCB0byB0aGUgY29uZmlnXG4gICAgICAvLyBiZWNhdXNlIHNhbml0YXRpb24gaXMgZG9uZSBpbiB0aGlzIGNsYXNzIGFscmVhZHkuXG4gICAgICAvLyBJdCBpcyBkb25lIGJlZm9yZSBzZW5kaW5nIGl0IHRvIHRoZSBkZXZ0b29scyBleHRlbnNpb24gZm9yIGNvbnNpc3RlbmN5OlxuICAgICAgLy8gLSBJZiB3ZSBjYWxsIGV4dGVuc2lvbkNvbm5lY3Rpb24uc2VuZCguLi4pLFxuICAgICAgLy8gICB0aGUgZXh0ZW5zaW9uIHdvdWxkIGNhbGwgdGhlIHNhbml0aXplcnMuXG4gICAgICAvLyAtIElmIHdlIGNhbGwgZGV2dG9vbHNFeHRlbnNpb24uc2VuZCguLi4pIChha2EgZnVsbCBzdGF0ZSB1cGRhdGUpLFxuICAgICAgLy8gICB0aGUgZXh0ZW5zaW9uIHdvdWxkIE5PVCBjYWxsIHRoZSBzYW5pdGl6ZXJzLCBzbyB3ZSBoYXZlIHRvIGRvIGl0IG91cnNlbHZlcy5cbiAgICB9O1xuICAgIGlmIChjb25maWcubWF4QWdlICE9PSBmYWxzZSAvKiBzdXBwb3J0ID09PSAwICovKSB7XG4gICAgICBleHRlbnNpb25PcHRpb25zLm1heEFnZSA9IGNvbmZpZy5tYXhBZ2U7XG4gICAgfVxuICAgIHJldHVybiBleHRlbnNpb25PcHRpb25zO1xuICB9XG5cbiAgcHJpdmF0ZSBzZW5kVG9SZWR1eERldnRvb2xzKHNlbmQ6IEZ1bmN0aW9uKSB7XG4gICAgdHJ5IHtcbiAgICAgIHNlbmQoKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgJ0BuZ3J4L3N0b3JlLWRldnRvb2xzOiBzb21ldGhpbmcgd2VudCB3cm9uZyBpbnNpZGUgdGhlIHJlZHV4IGRldnRvb2xzJyxcbiAgICAgICAgZXJyXG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuIl19