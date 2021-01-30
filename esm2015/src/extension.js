/**
 * @fileoverview added by tsickle
 * Generated from: src/extension.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { UPDATE } from '@ngrx/store';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, concatMap, debounceTime, filter, map, share, switchMap, take, takeUntil, timeout, } from 'rxjs/operators';
import { IMPORT_STATE, PERFORM_ACTION } from './actions';
import { STORE_DEVTOOLS_CONFIG, StoreDevtoolsConfig, } from './config';
import { DevtoolsDispatcher } from './devtools-dispatcher';
import { isActionFiltered, sanitizeAction, sanitizeActions, sanitizeState, sanitizeStates, shouldFilterActions, unliftState, } from './utils';
/** @type {?} */
export const ExtensionActionTypes = {
    START: 'START',
    DISPATCH: 'DISPATCH',
    STOP: 'STOP',
    ACTION: 'ACTION',
};
/** @type {?} */
export const REDUX_DEVTOOLS_EXTENSION = new InjectionToken('@ngrx/store-devtools Redux Devtools Extension');
/**
 * @record
 */
export function ReduxDevtoolsExtensionConnection() { }
if (false) {
    /**
     * @param {?} listener
     * @return {?}
     */
    ReduxDevtoolsExtensionConnection.prototype.subscribe = function (listener) { };
    /**
     * @return {?}
     */
    ReduxDevtoolsExtensionConnection.prototype.unsubscribe = function () { };
    /**
     * @param {?} action
     * @param {?} state
     * @return {?}
     */
    ReduxDevtoolsExtensionConnection.prototype.send = function (action, state) { };
    /**
     * @param {?=} state
     * @return {?}
     */
    ReduxDevtoolsExtensionConnection.prototype.init = function (state) { };
    /**
     * @param {?} anyErr
     * @return {?}
     */
    ReduxDevtoolsExtensionConnection.prototype.error = function (anyErr) { };
}
/**
 * @record
 */
export function ReduxDevtoolsExtensionConfig() { }
if (false) {
    /** @type {?|undefined} */
    ReduxDevtoolsExtensionConfig.prototype.features;
    /** @type {?} */
    ReduxDevtoolsExtensionConfig.prototype.name;
    /** @type {?|undefined} */
    ReduxDevtoolsExtensionConfig.prototype.maxAge;
    /** @type {?|undefined} */
    ReduxDevtoolsExtensionConfig.prototype.serialize;
}
/**
 * @record
 */
export function ReduxDevtoolsExtension() { }
if (false) {
    /**
     * @param {?} options
     * @return {?}
     */
    ReduxDevtoolsExtension.prototype.connect = function (options) { };
    /**
     * @param {?} action
     * @param {?} state
     * @param {?} options
     * @return {?}
     */
    ReduxDevtoolsExtension.prototype.send = function (action, state, options) { };
}
export class DevtoolsExtension {
    /**
     * @param {?} devtoolsExtension
     * @param {?} config
     * @param {?} dispatcher
     */
    constructor(devtoolsExtension, config, dispatcher) {
        this.config = config;
        this.dispatcher = dispatcher;
        this.devtoolsExtension = devtoolsExtension;
        this.createActionStreams();
    }
    /**
     * @param {?} action
     * @param {?} state
     * @return {?}
     */
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
            /** @type {?} */
            const currentState = unliftState(state);
            if (shouldFilterActions(this.config) &&
                isActionFiltered(currentState, action, this.config.predicate, this.config.actionsSafelist, this.config.actionsBlocklist)) {
                return;
            }
            /** @type {?} */
            const sanitizedState = this.config.stateSanitizer
                ? sanitizeState(this.config.stateSanitizer, currentState, state.currentStateIndex)
                : currentState;
            /** @type {?} */
            const sanitizedAction = this.config.actionSanitizer
                ? sanitizeAction(this.config.actionSanitizer, action, state.nextActionId)
                : action;
            this.sendToReduxDevtools((/**
             * @return {?}
             */
            () => this.extensionConnection.send(sanitizedAction, sanitizedState)));
        }
        else {
            // Requires full state update
            /** @type {?} */
            const sanitizedLiftedState = Object.assign(Object.assign({}, state), { stagedActionIds: state.stagedActionIds, actionsById: this.config.actionSanitizer
                    ? sanitizeActions(this.config.actionSanitizer, state.actionsById)
                    : state.actionsById, computedStates: this.config.stateSanitizer
                    ? sanitizeStates(this.config.stateSanitizer, state.computedStates)
                    : state.computedStates });
            this.sendToReduxDevtools((/**
             * @return {?}
             */
            () => this.devtoolsExtension.send(null, sanitizedLiftedState, this.getExtensionConfig(this.config))));
        }
    }
    /**
     * @private
     * @return {?}
     */
    createChangesObservable() {
        if (!this.devtoolsExtension) {
            return EMPTY;
        }
        return new Observable((/**
         * @param {?} subscriber
         * @return {?}
         */
        (subscriber) => {
            /** @type {?} */
            const connection = this.devtoolsExtension.connect(this.getExtensionConfig(this.config));
            this.extensionConnection = connection;
            connection.init();
            connection.subscribe((/**
             * @param {?} change
             * @return {?}
             */
            (change) => subscriber.next(change)));
            return connection.unsubscribe;
        }));
    }
    /**
     * @private
     * @return {?}
     */
    createActionStreams() {
        // Listens to all changes
        /** @type {?} */
        const changes$ = this.createChangesObservable().pipe(share());
        // Listen for the start action
        /** @type {?} */
        const start$ = changes$.pipe(filter((/**
         * @param {?} change
         * @return {?}
         */
        (change) => change.type === ExtensionActionTypes.START)));
        // Listen for the stop action
        /** @type {?} */
        const stop$ = changes$.pipe(filter((/**
         * @param {?} change
         * @return {?}
         */
        (change) => change.type === ExtensionActionTypes.STOP)));
        // Listen for lifted actions
        /** @type {?} */
        const liftedActions$ = changes$.pipe(filter((/**
         * @param {?} change
         * @return {?}
         */
        (change) => change.type === ExtensionActionTypes.DISPATCH)), map((/**
         * @param {?} change
         * @return {?}
         */
        (change) => this.unwrapAction(change.payload))), concatMap((/**
         * @param {?} action
         * @return {?}
         */
        (action) => {
            if (action.type === IMPORT_STATE) {
                // State imports may happen in two situations:
                // 1. Explicitly by user
                // 2. User activated the "persist state accross reloads" option
                //    and now the state is imported during reload.
                // Because of option 2, we need to give possible
                // lazy loaded reducers time to instantiate.
                // As soon as there is no UPDATE action within 1 second,
                // it is assumed that all reducers are loaded.
                return this.dispatcher.pipe(filter((/**
                 * @param {?} action
                 * @return {?}
                 */
                (action) => action.type === UPDATE)), timeout(1000), debounceTime(1000), map((/**
                 * @return {?}
                 */
                () => action)), catchError((/**
                 * @return {?}
                 */
                () => of(action))), take(1));
            }
            else {
                return of(action);
            }
        })));
        // Listen for unlifted actions
        /** @type {?} */
        const actions$ = changes$.pipe(filter((/**
         * @param {?} change
         * @return {?}
         */
        (change) => change.type === ExtensionActionTypes.ACTION)), map((/**
         * @param {?} change
         * @return {?}
         */
        (change) => this.unwrapAction(change.payload))));
        /** @type {?} */
        const actionsUntilStop$ = actions$.pipe(takeUntil(stop$));
        /** @type {?} */
        const liftedUntilStop$ = liftedActions$.pipe(takeUntil(stop$));
        this.start$ = start$.pipe(takeUntil(stop$));
        // Only take the action sources between the start/stop events
        this.actions$ = this.start$.pipe(switchMap((/**
         * @return {?}
         */
        () => actionsUntilStop$)));
        this.liftedActions$ = this.start$.pipe(switchMap((/**
         * @return {?}
         */
        () => liftedUntilStop$)));
    }
    /**
     * @private
     * @param {?} action
     * @return {?}
     */
    unwrapAction(action) {
        return typeof action === 'string' ? eval(`(${action})`) : action;
    }
    /**
     * @private
     * @param {?} config
     * @return {?}
     */
    getExtensionConfig(config) {
        /** @type {?} */
        const extensionOptions = {
            name: config.name,
            features: config.features,
            serialize: config.serialize,
        };
        if (config.maxAge !== false /* support === 0 */) {
            extensionOptions.maxAge = config.maxAge;
        }
        return extensionOptions;
    }
    /**
     * @private
     * @param {?} send
     * @return {?}
     */
    sendToReduxDevtools(send) {
        try {
            send();
        }
        catch (err) {
            console.warn('@ngrx/store-devtools: something went wrong inside the redux devtools', err);
        }
    }
}
DevtoolsExtension.decorators = [
    { type: Injectable }
];
/** @nocollapse */
DevtoolsExtension.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [REDUX_DEVTOOLS_EXTENSION,] }] },
    { type: StoreDevtoolsConfig, decorators: [{ type: Inject, args: [STORE_DEVTOOLS_CONFIG,] }] },
    { type: DevtoolsDispatcher }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    DevtoolsExtension.prototype.devtoolsExtension;
    /**
     * @type {?}
     * @private
     */
    DevtoolsExtension.prototype.extensionConnection;
    /** @type {?} */
    DevtoolsExtension.prototype.liftedActions$;
    /** @type {?} */
    DevtoolsExtension.prototype.actions$;
    /** @type {?} */
    DevtoolsExtension.prototype.start$;
    /**
     * @type {?}
     * @private
     */
    DevtoolsExtension.prototype.config;
    /**
     * @type {?}
     * @private
     */
    DevtoolsExtension.prototype.dispatcher;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5zaW9uLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uLy4uL21vZHVsZXMvc3RvcmUtZGV2dG9vbHMvIiwic291cmNlcyI6WyJzcmMvZXh0ZW5zaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25FLE9BQU8sRUFBVSxNQUFNLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDN0MsT0FBTyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzdDLE9BQU8sRUFDTCxVQUFVLEVBQ1YsU0FBUyxFQUNULFlBQVksRUFDWixNQUFNLEVBQ04sR0FBRyxFQUNILEtBQUssRUFDTCxTQUFTLEVBQ1QsSUFBSSxFQUNKLFNBQVMsRUFDVCxPQUFPLEdBQ1IsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QixPQUFPLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUN6RCxPQUFPLEVBRUwscUJBQXFCLEVBQ3JCLG1CQUFtQixHQUNwQixNQUFNLFVBQVUsQ0FBQztBQUNsQixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUUzRCxPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2hCLGNBQWMsRUFDZCxlQUFlLEVBQ2YsYUFBYSxFQUNiLGNBQWMsRUFDZCxtQkFBbUIsRUFDbkIsV0FBVyxHQUNaLE1BQU0sU0FBUyxDQUFDOztBQUVqQixNQUFNLE9BQU8sb0JBQW9CLEdBQUc7SUFDbEMsS0FBSyxFQUFFLE9BQU87SUFDZCxRQUFRLEVBQUUsVUFBVTtJQUNwQixJQUFJLEVBQUUsTUFBTTtJQUNaLE1BQU0sRUFBRSxRQUFRO0NBQ2pCOztBQUVELE1BQU0sT0FBTyx3QkFBd0IsR0FBRyxJQUFJLGNBQWMsQ0FDeEQsK0NBQStDLENBQ2hEOzs7O0FBRUQsc0RBTUM7Ozs7OztJQUxDLCtF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LG1CQUFtQixFQUFFO1lBQy9DLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1NBQ3pDO1FBQ0QsT0FBTyxnQkFBZ0IsQ0FBQztJQUMxQixDQUFDOzs7Ozs7SUFFTyxtQkFBbUIsQ0FBQyxJQUFjO1FBQ3hDLElBQUk7WUFDRixJQUFJLEVBQUUsQ0FBQztTQUNSO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixPQUFPLENBQUMsSUFBSSxDQUNWLHNFQUFzRSxFQUN0RSxHQUFHLENBQ0osQ0FBQztTQUNIO0lBQ0gsQ0FBQzs7O1lBeE1GLFVBQVU7Ozs7NENBVU4sTUFBTSxTQUFDLHdCQUF3QjtZQXhEbEMsbUJBQW1CLHVCQXlEaEIsTUFBTSxTQUFDLHFCQUFxQjtZQXZEeEIsa0JBQWtCOzs7Ozs7O0lBOEN6Qiw4Q0FBa0Q7Ozs7O0lBQ2xELGdEQUErRDs7SUFFL0QsMkNBQWlDOztJQUNqQyxxQ0FBMkI7O0lBQzNCLG1DQUF5Qjs7Ozs7SUFJdkIsbUNBQWtFOzs7OztJQUNsRSx1Q0FBc0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIEluamVjdGlvblRva2VuIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24sIFVQREFURSB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IEVNUFRZLCBPYnNlcnZhYmxlLCBvZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgY2F0Y2hFcnJvcixcbiAgY29uY2F0TWFwLFxuICBkZWJvdW5jZVRpbWUsXG4gIGZpbHRlcixcbiAgbWFwLFxuICBzaGFyZSxcbiAgc3dpdGNoTWFwLFxuICB0YWtlLFxuICB0YWtlVW50aWwsXG4gIHRpbWVvdXQsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgSU1QT1JUX1NUQVRFLCBQRVJGT1JNX0FDVElPTiB9IGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQge1xuICBTZXJpYWxpemF0aW9uT3B0aW9ucyxcbiAgU1RPUkVfREVWVE9PTFNfQ09ORklHLFxuICBTdG9yZURldnRvb2xzQ29uZmlnLFxufSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgeyBEZXZ0b29sc0Rpc3BhdGNoZXIgfSBmcm9tICcuL2RldnRvb2xzLWRpc3BhdGNoZXInO1xuaW1wb3J0IHsgTGlmdGVkQWN0aW9uLCBMaWZ0ZWRTdGF0ZSB9IGZyb20gJy4vcmVkdWNlcic7XG5pbXBvcnQge1xuICBpc0FjdGlvbkZpbHRlcmVkLFxuICBzYW5pdGl6ZUFjdGlvbixcbiAgc2FuaXRpemVBY3Rpb25zLFxuICBzYW5pdGl6ZVN0YXRlLFxuICBzYW5pdGl6ZVN0YXRlcyxcbiAgc2hvdWxkRmlsdGVyQWN0aW9ucyxcbiAgdW5saWZ0U3RhdGUsXG59IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgY29uc3QgRXh0ZW5zaW9uQWN0aW9uVHlwZXMgPSB7XG4gIFNUQVJUOiAnU1RBUlQnLFxuICBESVNQQVRDSDogJ0RJU1BBVENIJyxcbiAgU1RPUDogJ1NUT1AnLFxuICBBQ1RJT046ICdBQ1RJT04nLFxufTtcblxuZXhwb3J0IGNvbnN0IFJFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxSZWR1eERldnRvb2xzRXh0ZW5zaW9uPihcbiAgJ0BuZ3J4L3N0b3JlLWRldnRvb2xzIFJlZHV4IERldnRvb2xzIEV4dGVuc2lvbidcbik7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVkdXhEZXZ0b29sc0V4dGVuc2lvbkNvbm5lY3Rpb24ge1xuICBzdWJzY3JpYmUobGlzdGVuZXI6IChjaGFuZ2U6IGFueSkgPT4gdm9pZCk6IHZvaWQ7XG4gIHVuc3Vic2NyaWJlKCk6IHZvaWQ7XG4gIHNlbmQoYWN0aW9uOiBhbnksIHN0YXRlOiBhbnkpOiB2b2lkO1xuICBpbml0KHN0YXRlPzogYW55KTogdm9pZDtcbiAgZXJyb3IoYW55RXJyOiBhbnkpOiB2b2lkO1xufVxuZXhwb3J0IGludGVyZmFjZSBSZWR1eERldnRvb2xzRXh0ZW5zaW9uQ29uZmlnIHtcbiAgZmVhdHVyZXM/OiBvYmplY3QgfCBib29sZWFuO1xuICBuYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIG1heEFnZT86IG51bWJlcjtcbiAgc2VyaWFsaXplPzogYm9vbGVhbiB8IFNlcmlhbGl6YXRpb25PcHRpb25zO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlZHV4RGV2dG9vbHNFeHRlbnNpb24ge1xuICBjb25uZWN0KFxuICAgIG9wdGlvbnM6IFJlZHV4RGV2dG9vbHNFeHRlbnNpb25Db25maWdcbiAgKTogUmVkdXhEZXZ0b29sc0V4dGVuc2lvbkNvbm5lY3Rpb247XG4gIHNlbmQoYWN0aW9uOiBhbnksIHN0YXRlOiBhbnksIG9wdGlvbnM6IFJlZHV4RGV2dG9vbHNFeHRlbnNpb25Db25maWcpOiB2b2lkO1xufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRGV2dG9vbHNFeHRlbnNpb24ge1xuICBwcml2YXRlIGRldnRvb2xzRXh0ZW5zaW9uOiBSZWR1eERldnRvb2xzRXh0ZW5zaW9uO1xuICBwcml2YXRlIGV4dGVuc2lvbkNvbm5lY3Rpb24hOiBSZWR1eERldnRvb2xzRXh0ZW5zaW9uQ29ubmVjdGlvbjtcblxuICBsaWZ0ZWRBY3Rpb25zJCE6IE9ic2VydmFibGU8YW55PjtcbiAgYWN0aW9ucyQhOiBPYnNlcnZhYmxlPGFueT47XG4gIHN0YXJ0JCE6IE9ic2VydmFibGU8YW55PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KFJFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTikgZGV2dG9vbHNFeHRlbnNpb246IFJlZHV4RGV2dG9vbHNFeHRlbnNpb24sXG4gICAgQEluamVjdChTVE9SRV9ERVZUT09MU19DT05GSUcpIHByaXZhdGUgY29uZmlnOiBTdG9yZURldnRvb2xzQ29uZmlnLFxuICAgIHByaXZhdGUgZGlzcGF0Y2hlcjogRGV2dG9vbHNEaXNwYXRjaGVyXG4gICkge1xuICAgIHRoaXMuZGV2dG9vbHNFeHRlbnNpb24gPSBkZXZ0b29sc0V4dGVuc2lvbjtcbiAgICB0aGlzLmNyZWF0ZUFjdGlvblN0cmVhbXMoKTtcbiAgfVxuXG4gIG5vdGlmeShhY3Rpb246IExpZnRlZEFjdGlvbiwgc3RhdGU6IExpZnRlZFN0YXRlKSB7XG4gICAgaWYgKCF0aGlzLmRldnRvb2xzRXh0ZW5zaW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYWN0aW9uIHJlcXVpcmVzIGEgZnVsbCB1cGRhdGUgb2YgdGhlIGxpZnRlZFN0YXRlLlxuICAgIC8vIElmIGl0IGlzIGEgc2ltcGxlIGFjdGlvbiBnZW5lcmF0ZWQgYnkgdGhlIHVzZXIncyBhcHAgYW5kIHRoZSByZWNvcmRpbmdcbiAgICAvLyBpcyBub3QgbG9ja2VkL3BhdXNlZCwgb25seSBzZW5kIHRoZSBhY3Rpb24gYW5kIHRoZSBjdXJyZW50IHN0YXRlIChmYXN0KS5cbiAgICAvL1xuICAgIC8vIEEgZnVsbCBsaWZ0ZWRTdGF0ZSB1cGRhdGUgKHNsb3c6IHNlcmlhbGl6ZXMgdGhlIGVudGlyZSBsaWZ0ZWRTdGF0ZSkgaXNcbiAgICAvLyBvbmx5IHJlcXVpcmVkIHdoZW46XG4gICAgLy8gICBhKSByZWR1eC1kZXZ0b29scy1leHRlbnNpb24gZmlyZXMgdGhlIEBASW5pdCBhY3Rpb24gKGlnbm9yZWQgYnlcbiAgICAvLyAgICAgIEBuZ3J4L3N0b3JlLWRldnRvb2xzKVxuICAgIC8vICAgYikgYW4gYWN0aW9uIGlzIGdlbmVyYXRlZCBieSBhbiBAbmdyeCBtb2R1bGUgKGUuZy4gQG5ncngvZWZmZWN0cy9pbml0XG4gICAgLy8gICAgICBvciBAbmdyeC9zdG9yZS91cGRhdGUtcmVkdWNlcnMpXG4gICAgLy8gICBjKSB0aGUgc3RhdGUgaGFzIGJlZW4gcmVjb21wdXRlZCBkdWUgdG8gdGltZS10cmF2ZWxpbmdcbiAgICAvLyAgIGQpIGFueSBhY3Rpb24gdGhhdCBpcyBub3QgYSBQZXJmb3JtQWN0aW9uIHRvIGVyciBvbiB0aGUgc2lkZSBvZlxuICAgIC8vICAgICAgY2F1dGlvbi5cbiAgICBpZiAoYWN0aW9uLnR5cGUgPT09IFBFUkZPUk1fQUNUSU9OKSB7XG4gICAgICBpZiAoc3RhdGUuaXNMb2NrZWQgfHwgc3RhdGUuaXNQYXVzZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjdXJyZW50U3RhdGUgPSB1bmxpZnRTdGF0ZShzdGF0ZSk7XG4gICAgICBpZiAoXG4gICAgICAgIHNob3VsZEZpbHRlckFjdGlvbnModGhpcy5jb25maWcpICYmXG4gICAgICAgIGlzQWN0aW9uRmlsdGVyZWQoXG4gICAgICAgICAgY3VycmVudFN0YXRlLFxuICAgICAgICAgIGFjdGlvbixcbiAgICAgICAgICB0aGlzLmNvbmZpZy5wcmVkaWNhdGUsXG4gICAgICAgICAgdGhpcy5jb25maWcuYWN0aW9uc1NhZmVsaXN0LFxuICAgICAgICAgIHRoaXMuY29uZmlnLmFjdGlvbnNCbG9ja2xpc3RcbiAgICAgICAgKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHNhbml0aXplZFN0YXRlID0gdGhpcy5jb25maWcuc3RhdGVTYW5pdGl6ZXJcbiAgICAgICAgPyBzYW5pdGl6ZVN0YXRlKFxuICAgICAgICAgICAgdGhpcy5jb25maWcuc3RhdGVTYW5pdGl6ZXIsXG4gICAgICAgICAgICBjdXJyZW50U3RhdGUsXG4gICAgICAgICAgICBzdGF0ZS5jdXJyZW50U3RhdGVJbmRleFxuICAgICAgICAgIClcbiAgICAgICAgOiBjdXJyZW50U3RhdGU7XG4gICAgICBjb25zdCBzYW5pdGl6ZWRBY3Rpb24gPSB0aGlzLmNvbmZpZy5hY3Rpb25TYW5pdGl6ZXJcbiAgICAgICAgPyBzYW5pdGl6ZUFjdGlvbihcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLmFjdGlvblNhbml0aXplcixcbiAgICAgICAgICAgIGFjdGlvbixcbiAgICAgICAgICAgIHN0YXRlLm5leHRBY3Rpb25JZFxuICAgICAgICAgIClcbiAgICAgICAgOiBhY3Rpb247XG5cbiAgICAgIHRoaXMuc2VuZFRvUmVkdXhEZXZ0b29scygoKSA9PlxuICAgICAgICB0aGlzLmV4dGVuc2lvbkNvbm5lY3Rpb24uc2VuZChzYW5pdGl6ZWRBY3Rpb24sIHNhbml0aXplZFN0YXRlKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmVxdWlyZXMgZnVsbCBzdGF0ZSB1cGRhdGVcbiAgICAgIGNvbnN0IHNhbml0aXplZExpZnRlZFN0YXRlID0ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgc3RhZ2VkQWN0aW9uSWRzOiBzdGF0ZS5zdGFnZWRBY3Rpb25JZHMsXG4gICAgICAgIGFjdGlvbnNCeUlkOiB0aGlzLmNvbmZpZy5hY3Rpb25TYW5pdGl6ZXJcbiAgICAgICAgICA/IHNhbml0aXplQWN0aW9ucyh0aGlzLmNvbmZpZy5hY3Rpb25TYW5pdGl6ZXIsIHN0YXRlLmFjdGlvbnNCeUlkKVxuICAgICAgICAgIDogc3RhdGUuYWN0aW9uc0J5SWQsXG4gICAgICAgIGNvbXB1dGVkU3RhdGVzOiB0aGlzLmNvbmZpZy5zdGF0ZVNhbml0aXplclxuICAgICAgICAgID8gc2FuaXRpemVTdGF0ZXModGhpcy5jb25maWcuc3RhdGVTYW5pdGl6ZXIsIHN0YXRlLmNvbXB1dGVkU3RhdGVzKVxuICAgICAgICAgIDogc3RhdGUuY29tcHV0ZWRTdGF0ZXMsXG4gICAgICB9O1xuXG4gICAgICB0aGlzLnNlbmRUb1JlZHV4RGV2dG9vbHMoKCkgPT5cbiAgICAgICAgdGhpcy5kZXZ0b29sc0V4dGVuc2lvbi5zZW5kKFxuICAgICAgICAgIG51bGwsXG4gICAgICAgICAgc2FuaXRpemVkTGlmdGVkU3RhdGUsXG4gICAgICAgICAgdGhpcy5nZXRFeHRlbnNpb25Db25maWcodGhpcy5jb25maWcpXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVDaGFuZ2VzT2JzZXJ2YWJsZSgpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGlmICghdGhpcy5kZXZ0b29sc0V4dGVuc2lvbikge1xuICAgICAgcmV0dXJuIEVNUFRZO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgoc3Vic2NyaWJlcikgPT4ge1xuICAgICAgY29uc3QgY29ubmVjdGlvbiA9IHRoaXMuZGV2dG9vbHNFeHRlbnNpb24uY29ubmVjdChcbiAgICAgICAgdGhpcy5nZXRFeHRlbnNpb25Db25maWcodGhpcy5jb25maWcpXG4gICAgICApO1xuICAgICAgdGhpcy5leHRlbnNpb25Db25uZWN0aW9uID0gY29ubmVjdGlvbjtcbiAgICAgIGNvbm5lY3Rpb24uaW5pdCgpO1xuXG4gICAgICBjb25uZWN0aW9uLnN1YnNjcmliZSgoY2hhbmdlOiBhbnkpID0+IHN1YnNjcmliZXIubmV4dChjaGFuZ2UpKTtcbiAgICAgIHJldHVybiBjb25uZWN0aW9uLnVuc3Vic2NyaWJlO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVBY3Rpb25TdHJlYW1zKCkge1xuICAgIC8vIExpc3RlbnMgdG8gYWxsIGNoYW5nZXNcbiAgICBjb25zdCBjaGFuZ2VzJCA9IHRoaXMuY3JlYXRlQ2hhbmdlc09ic2VydmFibGUoKS5waXBlKHNoYXJlKCkpO1xuXG4gICAgLy8gTGlzdGVuIGZvciB0aGUgc3RhcnQgYWN0aW9uXG4gICAgY29uc3Qgc3RhcnQkID0gY2hhbmdlcyQucGlwZShcbiAgICAgIGZpbHRlcigoY2hhbmdlOiBhbnkpID0+IGNoYW5nZS50eXBlID09PSBFeHRlbnNpb25BY3Rpb25UeXBlcy5TVEFSVClcbiAgICApO1xuXG4gICAgLy8gTGlzdGVuIGZvciB0aGUgc3RvcCBhY3Rpb25cbiAgICBjb25zdCBzdG9wJCA9IGNoYW5nZXMkLnBpcGUoXG4gICAgICBmaWx0ZXIoKGNoYW5nZTogYW55KSA9PiBjaGFuZ2UudHlwZSA9PT0gRXh0ZW5zaW9uQWN0aW9uVHlwZXMuU1RPUClcbiAgICApO1xuXG4gICAgLy8gTGlzdGVuIGZvciBsaWZ0ZWQgYWN0aW9uc1xuICAgIGNvbnN0IGxpZnRlZEFjdGlvbnMkID0gY2hhbmdlcyQucGlwZShcbiAgICAgIGZpbHRlcigoY2hhbmdlKSA9PiBjaGFuZ2UudHlwZSA9PT0gRXh0ZW5zaW9uQWN0aW9uVHlwZXMuRElTUEFUQ0gpLFxuICAgICAgbWFwKChjaGFuZ2UpID0+IHRoaXMudW53cmFwQWN0aW9uKGNoYW5nZS5wYXlsb2FkKSksXG4gICAgICBjb25jYXRNYXAoKGFjdGlvbjogYW55KSA9PiB7XG4gICAgICAgIGlmIChhY3Rpb24udHlwZSA9PT0gSU1QT1JUX1NUQVRFKSB7XG4gICAgICAgICAgLy8gU3RhdGUgaW1wb3J0cyBtYXkgaGFwcGVuIGluIHR3byBzaXR1YXRpb25zOlxuICAgICAgICAgIC8vIDEuIEV4cGxpY2l0bHkgYnkgdXNlclxuICAgICAgICAgIC8vIDIuIFVzZXIgYWN0aXZhdGVkIHRoZSBcInBlcnNpc3Qgc3RhdGUgYWNjcm9zcyByZWxvYWRzXCIgb3B0aW9uXG4gICAgICAgICAgLy8gICAgYW5kIG5vdyB0aGUgc3RhdGUgaXMgaW1wb3J0ZWQgZHVyaW5nIHJlbG9hZC5cbiAgICAgICAgICAvLyBCZWNhdXNlIG9mIG9wdGlvbiAyLCB3ZSBuZWVkIHRvIGdpdmUgcG9zc2libGVcbiAgICAgICAgICAvLyBsYXp5IGxvYWRlZCByZWR1Y2VycyB0aW1lIHRvIGluc3RhbnRpYXRlLlxuICAgICAgICAgIC8vIEFzIHNvb24gYXMgdGhlcmUgaXMgbm8gVVBEQVRFIGFjdGlvbiB3aXRoaW4gMSBzZWNvbmQsXG4gICAgICAgICAgLy8gaXQgaXMgYXNzdW1lZCB0aGF0IGFsbCByZWR1Y2VycyBhcmUgbG9hZGVkLlxuICAgICAgICAgIHJldHVybiB0aGlzLmRpc3BhdGNoZXIucGlwZShcbiAgICAgICAgICAgIGZpbHRlcigoYWN0aW9uKSA9PiBhY3Rpb24udHlwZSA9PT0gVVBEQVRFKSxcbiAgICAgICAgICAgIHRpbWVvdXQoMTAwMCksXG4gICAgICAgICAgICBkZWJvdW5jZVRpbWUoMTAwMCksXG4gICAgICAgICAgICBtYXAoKCkgPT4gYWN0aW9uKSxcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoKCkgPT4gb2YoYWN0aW9uKSksXG4gICAgICAgICAgICB0YWtlKDEpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gb2YoYWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuXG4gICAgLy8gTGlzdGVuIGZvciB1bmxpZnRlZCBhY3Rpb25zXG4gICAgY29uc3QgYWN0aW9ucyQgPSBjaGFuZ2VzJC5waXBlKFxuICAgICAgZmlsdGVyKChjaGFuZ2UpID0+IGNoYW5nZS50eXBlID09PSBFeHRlbnNpb25BY3Rpb25UeXBlcy5BQ1RJT04pLFxuICAgICAgbWFwKChjaGFuZ2UpID0+IHRoaXMudW53cmFwQWN0aW9uKGNoYW5nZS5wYXlsb2FkKSlcbiAgICApO1xuXG4gICAgY29uc3QgYWN0aW9uc1VudGlsU3RvcCQgPSBhY3Rpb25zJC5waXBlKHRha2VVbnRpbChzdG9wJCkpO1xuICAgIGNvbnN0IGxpZnRlZFVudGlsU3RvcCQgPSBsaWZ0ZWRBY3Rpb25zJC5waXBlKHRha2VVbnRpbChzdG9wJCkpO1xuICAgIHRoaXMuc3RhcnQkID0gc3RhcnQkLnBpcGUodGFrZVVudGlsKHN0b3AkKSk7XG5cbiAgICAvLyBPbmx5IHRha2UgdGhlIGFjdGlvbiBzb3VyY2VzIGJldHdlZW4gdGhlIHN0YXJ0L3N0b3AgZXZlbnRzXG4gICAgdGhpcy5hY3Rpb25zJCA9IHRoaXMuc3RhcnQkLnBpcGUoc3dpdGNoTWFwKCgpID0+IGFjdGlvbnNVbnRpbFN0b3AkKSk7XG4gICAgdGhpcy5saWZ0ZWRBY3Rpb25zJCA9IHRoaXMuc3RhcnQkLnBpcGUoc3dpdGNoTWFwKCgpID0+IGxpZnRlZFVudGlsU3RvcCQpKTtcbiAgfVxuXG4gIHByaXZhdGUgdW53cmFwQWN0aW9uKGFjdGlvbjogQWN0aW9uKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBhY3Rpb24gPT09ICdzdHJpbmcnID8gZXZhbChgKCR7YWN0aW9ufSlgKSA6IGFjdGlvbjtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RXh0ZW5zaW9uQ29uZmlnKGNvbmZpZzogU3RvcmVEZXZ0b29sc0NvbmZpZykge1xuICAgIGNvbnN0IGV4dGVuc2lvbk9wdGlvbnM6IFJlZHV4RGV2dG9vbHNFeHRlbnNpb25Db25maWcgPSB7XG4gICAgICBuYW1lOiBjb25maWcubmFtZSxcbiAgICAgIGZlYXR1cmVzOiBjb25maWcuZmVhdHVyZXMsXG4gICAgICBzZXJpYWxpemU6IGNvbmZpZy5zZXJpYWxpemUsXG4gICAgICAvLyBUaGUgYWN0aW9uL3N0YXRlIHNhbml0aXplcnMgYXJlIG5vdCBhZGRlZCB0byB0aGUgY29uZmlnXG4gICAgICAvLyBiZWNhdXNlIHNhbml0YXRpb24gaXMgZG9uZSBpbiB0aGlzIGNsYXNzIGFscmVhZHkuXG4gICAgICAvLyBJdCBpcyBkb25lIGJlZm9yZSBzZW5kaW5nIGl0IHRvIHRoZSBkZXZ0b29scyBleHRlbnNpb24gZm9yIGNvbnNpc3RlbmN5OlxuICAgICAgLy8gLSBJZiB3ZSBjYWxsIGV4dGVuc2lvbkNvbm5lY3Rpb24uc2VuZCguLi4pLFxuICAgICAgLy8gICB0aGUgZXh0ZW5zaW9uIHdvdWxkIGNhbGwgdGhlIHNhbml0aXplcnMuXG4gICAgICAvLyAtIElmIHdlIGNhbGwgZGV2dG9vbHNFeHRlbnNpb24uc2VuZCguLi4pIChha2EgZnVsbCBzdGF0ZSB1cGRhdGUpLFxuICAgICAgLy8gICB0aGUgZXh0ZW5zaW9uIHdvdWxkIE5PVCBjYWxsIHRoZSBzYW5pdGl6ZXJzLCBzbyB3ZSBoYXZlIHRvIGRvIGl0IG91cnNlbHZlcy5cbiAgICB9O1xuICAgIGlmIChjb25maWcubWF4QWdlICE9PSBmYWxzZSAvKiBzdXBwb3J0ID09PSAwICovKSB7XG4gICAgICBleHRlbnNpb25PcHRpb25zLm1heEFnZSA9IGNvbmZpZy5tYXhBZ2U7XG4gICAgfVxuICAgIHJldHVybiBleHRlbnNpb25PcHRpb25zO1xuICB9XG5cbiAgcHJpdmF0ZSBzZW5kVG9SZWR1eERldnRvb2xzKHNlbmQ6IEZ1bmN0aW9uKSB7XG4gICAgdHJ5IHtcbiAgICAgIHNlbmQoKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgJ0BuZ3J4L3N0b3JlLWRldnRvb2xzOiBzb21ldGhpbmcgd2VudCB3cm9uZyBpbnNpZGUgdGhlIHJlZHV4IGRldnRvb2xzJyxcbiAgICAgICAgZXJyXG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuIl19