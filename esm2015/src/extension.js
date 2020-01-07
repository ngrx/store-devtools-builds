/**
 * @fileoverview added by tsickle
 * Generated from: modules/store-devtools/src/extension.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { UPDATE } from '@ngrx/store';
import { empty, Observable, of } from 'rxjs';
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
export const REDUX_DEVTOOLS_EXTENSION = new InjectionToken('Redux Devtools Extension');
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
            return empty();
        }
        return new Observable((/**
         * @param {?} subscriber
         * @return {?}
         */
        subscriber => {
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
        change => change.type === ExtensionActionTypes.DISPATCH)), map((/**
         * @param {?} change
         * @return {?}
         */
        change => this.unwrapAction(change.payload))), concatMap((/**
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
                action => action.type === UPDATE)), timeout(1000), debounceTime(1000), map((/**
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
        change => change.type === ExtensionActionTypes.ACTION)), map((/**
         * @param {?} change
         * @return {?}
         */
        change => this.unwrapAction(change.payload))));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5zaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9zdG9yZS1kZXZ0b29scy9zcmMvZXh0ZW5zaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25FLE9BQU8sRUFBVSxNQUFNLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDN0MsT0FBTyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzdDLE9BQU8sRUFDTCxVQUFVLEVBQ1YsU0FBUyxFQUNULFlBQVksRUFDWixNQUFNLEVBQ04sR0FBRyxFQUNILEtBQUssRUFDTCxTQUFTLEVBQ1QsSUFBSSxFQUNKLFNBQVMsRUFDVCxPQUFPLEdBQ1IsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QixPQUFPLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUN6RCxPQUFPLEVBRUwscUJBQXFCLEVBQ3JCLG1CQUFtQixHQUNwQixNQUFNLFVBQVUsQ0FBQztBQUNsQixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUUzRCxPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2hCLGNBQWMsRUFDZCxlQUFlLEVBQ2YsYUFBYSxFQUNiLGNBQWMsRUFDZCxtQkFBbUIsRUFDbkIsV0FBVyxHQUNaLE1BQU0sU0FBUyxDQUFDOztBQUVqQixNQUFNLE9BQU8sb0JBQW9CLEdBQUc7SUFDbEMsS0FBSyxFQUFFLE9BQU87SUFDZCxRQUFRLEVBQUUsVUFBVTtJQUNwQixJQUFJLEVBQUUsTUFBTTtJQUNaLE1BQU0sRUFBRSxRQUFRO0NBQ2pCOztBQUVELE1BQU0sT0FBTyx3QkFBd0IsR0FBRyxJQUFJLGNBQWMsQ0FFeEQsMEJBQTBCLENBQUM7Ozs7QUFFN0Isc0RBTUM7Ozs7OztJ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LGdCQUFnQixDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1NBQ3pDO1FBQ0QsT0FBTyxnQkFBZ0IsQ0FBQztJQUMxQixDQUFDOzs7Ozs7SUFFTyxtQkFBbUIsQ0FBQyxJQUFjO1FBQ3hDLElBQUk7WUFDRixJQUFJLEVBQUUsQ0FBQztTQUNSO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixPQUFPLENBQUMsSUFBSSxDQUNWLHNFQUFzRSxFQUN0RSxHQUFHLENBQ0osQ0FBQztTQUNIO0lBQ0gsQ0FBQzs7O1lBeE1GLFVBQVU7Ozs7NENBVU4sTUFBTSxTQUFDLHdCQUF3QjtZQXhEbEMsbUJBQW1CLHVCQXlEaEIsTUFBTSxTQUFDLHFCQUFxQjtZQXZEeEIsa0JBQWtCOzs7Ozs7O0lBOEN6Qiw4Q0FBa0Q7Ozs7O0lBQ2xELGdEQUE4RDs7SUFFOUQsMkNBQWdDOztJQUNoQyxxQ0FBMEI7O0lBQzFCLG1DQUF3Qjs7Ozs7SUFJdEIsbUNBQWtFOzs7OztJQUNsRSx1Q0FBc0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIEluamVjdGlvblRva2VuIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24sIFVQREFURSB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IGVtcHR5LCBPYnNlcnZhYmxlLCBvZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgY2F0Y2hFcnJvcixcbiAgY29uY2F0TWFwLFxuICBkZWJvdW5jZVRpbWUsXG4gIGZpbHRlcixcbiAgbWFwLFxuICBzaGFyZSxcbiAgc3dpdGNoTWFwLFxuICB0YWtlLFxuICB0YWtlVW50aWwsXG4gIHRpbWVvdXQsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgSU1QT1JUX1NUQVRFLCBQRVJGT1JNX0FDVElPTiB9IGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQge1xuICBTZXJpYWxpemF0aW9uT3B0aW9ucyxcbiAgU1RPUkVfREVWVE9PTFNfQ09ORklHLFxuICBTdG9yZURldnRvb2xzQ29uZmlnLFxufSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgeyBEZXZ0b29sc0Rpc3BhdGNoZXIgfSBmcm9tICcuL2RldnRvb2xzLWRpc3BhdGNoZXInO1xuaW1wb3J0IHsgTGlmdGVkQWN0aW9uLCBMaWZ0ZWRTdGF0ZSB9IGZyb20gJy4vcmVkdWNlcic7XG5pbXBvcnQge1xuICBpc0FjdGlvbkZpbHRlcmVkLFxuICBzYW5pdGl6ZUFjdGlvbixcbiAgc2FuaXRpemVBY3Rpb25zLFxuICBzYW5pdGl6ZVN0YXRlLFxuICBzYW5pdGl6ZVN0YXRlcyxcbiAgc2hvdWxkRmlsdGVyQWN0aW9ucyxcbiAgdW5saWZ0U3RhdGUsXG59IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgY29uc3QgRXh0ZW5zaW9uQWN0aW9uVHlwZXMgPSB7XG4gIFNUQVJUOiAnU1RBUlQnLFxuICBESVNQQVRDSDogJ0RJU1BBVENIJyxcbiAgU1RPUDogJ1NUT1AnLFxuICBBQ1RJT046ICdBQ1RJT04nLFxufTtcblxuZXhwb3J0IGNvbnN0IFJFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxcbiAgUmVkdXhEZXZ0b29sc0V4dGVuc2lvblxuPignUmVkdXggRGV2dG9vbHMgRXh0ZW5zaW9uJyk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVkdXhEZXZ0b29sc0V4dGVuc2lvbkNvbm5lY3Rpb24ge1xuICBzdWJzY3JpYmUobGlzdGVuZXI6IChjaGFuZ2U6IGFueSkgPT4gdm9pZCk6IHZvaWQ7XG4gIHVuc3Vic2NyaWJlKCk6IHZvaWQ7XG4gIHNlbmQoYWN0aW9uOiBhbnksIHN0YXRlOiBhbnkpOiB2b2lkO1xuICBpbml0KHN0YXRlPzogYW55KTogdm9pZDtcbiAgZXJyb3IoYW55RXJyOiBhbnkpOiB2b2lkO1xufVxuZXhwb3J0IGludGVyZmFjZSBSZWR1eERldnRvb2xzRXh0ZW5zaW9uQ29uZmlnIHtcbiAgZmVhdHVyZXM/OiBvYmplY3QgfCBib29sZWFuO1xuICBuYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIG1heEFnZT86IG51bWJlcjtcbiAgc2VyaWFsaXplPzogYm9vbGVhbiB8IFNlcmlhbGl6YXRpb25PcHRpb25zO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlZHV4RGV2dG9vbHNFeHRlbnNpb24ge1xuICBjb25uZWN0KFxuICAgIG9wdGlvbnM6IFJlZHV4RGV2dG9vbHNFeHRlbnNpb25Db25maWdcbiAgKTogUmVkdXhEZXZ0b29sc0V4dGVuc2lvbkNvbm5lY3Rpb247XG4gIHNlbmQoYWN0aW9uOiBhbnksIHN0YXRlOiBhbnksIG9wdGlvbnM6IFJlZHV4RGV2dG9vbHNFeHRlbnNpb25Db25maWcpOiB2b2lkO1xufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRGV2dG9vbHNFeHRlbnNpb24ge1xuICBwcml2YXRlIGRldnRvb2xzRXh0ZW5zaW9uOiBSZWR1eERldnRvb2xzRXh0ZW5zaW9uO1xuICBwcml2YXRlIGV4dGVuc2lvbkNvbm5lY3Rpb246IFJlZHV4RGV2dG9vbHNFeHRlbnNpb25Db25uZWN0aW9uO1xuXG4gIGxpZnRlZEFjdGlvbnMkOiBPYnNlcnZhYmxlPGFueT47XG4gIGFjdGlvbnMkOiBPYnNlcnZhYmxlPGFueT47XG4gIHN0YXJ0JDogT2JzZXJ2YWJsZTxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OKSBkZXZ0b29sc0V4dGVuc2lvbjogUmVkdXhEZXZ0b29sc0V4dGVuc2lvbixcbiAgICBASW5qZWN0KFNUT1JFX0RFVlRPT0xTX0NPTkZJRykgcHJpdmF0ZSBjb25maWc6IFN0b3JlRGV2dG9vbHNDb25maWcsXG4gICAgcHJpdmF0ZSBkaXNwYXRjaGVyOiBEZXZ0b29sc0Rpc3BhdGNoZXJcbiAgKSB7XG4gICAgdGhpcy5kZXZ0b29sc0V4dGVuc2lvbiA9IGRldnRvb2xzRXh0ZW5zaW9uO1xuICAgIHRoaXMuY3JlYXRlQWN0aW9uU3RyZWFtcygpO1xuICB9XG5cbiAgbm90aWZ5KGFjdGlvbjogTGlmdGVkQWN0aW9uLCBzdGF0ZTogTGlmdGVkU3RhdGUpIHtcbiAgICBpZiAoIXRoaXMuZGV2dG9vbHNFeHRlbnNpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBhY3Rpb24gcmVxdWlyZXMgYSBmdWxsIHVwZGF0ZSBvZiB0aGUgbGlmdGVkU3RhdGUuXG4gICAgLy8gSWYgaXQgaXMgYSBzaW1wbGUgYWN0aW9uIGdlbmVyYXRlZCBieSB0aGUgdXNlcidzIGFwcCBhbmQgdGhlIHJlY29yZGluZ1xuICAgIC8vIGlzIG5vdCBsb2NrZWQvcGF1c2VkLCBvbmx5IHNlbmQgdGhlIGFjdGlvbiBhbmQgdGhlIGN1cnJlbnQgc3RhdGUgKGZhc3QpLlxuICAgIC8vXG4gICAgLy8gQSBmdWxsIGxpZnRlZFN0YXRlIHVwZGF0ZSAoc2xvdzogc2VyaWFsaXplcyB0aGUgZW50aXJlIGxpZnRlZFN0YXRlKSBpc1xuICAgIC8vIG9ubHkgcmVxdWlyZWQgd2hlbjpcbiAgICAvLyAgIGEpIHJlZHV4LWRldnRvb2xzLWV4dGVuc2lvbiBmaXJlcyB0aGUgQEBJbml0IGFjdGlvbiAoaWdub3JlZCBieVxuICAgIC8vICAgICAgQG5ncngvc3RvcmUtZGV2dG9vbHMpXG4gICAgLy8gICBiKSBhbiBhY3Rpb24gaXMgZ2VuZXJhdGVkIGJ5IGFuIEBuZ3J4IG1vZHVsZSAoZS5nLiBAbmdyeC9lZmZlY3RzL2luaXRcbiAgICAvLyAgICAgIG9yIEBuZ3J4L3N0b3JlL3VwZGF0ZS1yZWR1Y2VycylcbiAgICAvLyAgIGMpIHRoZSBzdGF0ZSBoYXMgYmVlbiByZWNvbXB1dGVkIGR1ZSB0byB0aW1lLXRyYXZlbGluZ1xuICAgIC8vICAgZCkgYW55IGFjdGlvbiB0aGF0IGlzIG5vdCBhIFBlcmZvcm1BY3Rpb24gdG8gZXJyIG9uIHRoZSBzaWRlIG9mXG4gICAgLy8gICAgICBjYXV0aW9uLlxuICAgIGlmIChhY3Rpb24udHlwZSA9PT0gUEVSRk9STV9BQ1RJT04pIHtcbiAgICAgIGlmIChzdGF0ZS5pc0xvY2tlZCB8fCBzdGF0ZS5pc1BhdXNlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGN1cnJlbnRTdGF0ZSA9IHVubGlmdFN0YXRlKHN0YXRlKTtcbiAgICAgIGlmIChcbiAgICAgICAgc2hvdWxkRmlsdGVyQWN0aW9ucyh0aGlzLmNvbmZpZykgJiZcbiAgICAgICAgaXNBY3Rpb25GaWx0ZXJlZChcbiAgICAgICAgICBjdXJyZW50U3RhdGUsXG4gICAgICAgICAgYWN0aW9uLFxuICAgICAgICAgIHRoaXMuY29uZmlnLnByZWRpY2F0ZSxcbiAgICAgICAgICB0aGlzLmNvbmZpZy5hY3Rpb25zU2FmZWxpc3QsXG4gICAgICAgICAgdGhpcy5jb25maWcuYWN0aW9uc0Jsb2NrbGlzdFxuICAgICAgICApXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3Qgc2FuaXRpemVkU3RhdGUgPSB0aGlzLmNvbmZpZy5zdGF0ZVNhbml0aXplclxuICAgICAgICA/IHNhbml0aXplU3RhdGUoXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5zdGF0ZVNhbml0aXplcixcbiAgICAgICAgICAgIGN1cnJlbnRTdGF0ZSxcbiAgICAgICAgICAgIHN0YXRlLmN1cnJlbnRTdGF0ZUluZGV4XG4gICAgICAgICAgKVxuICAgICAgICA6IGN1cnJlbnRTdGF0ZTtcbiAgICAgIGNvbnN0IHNhbml0aXplZEFjdGlvbiA9IHRoaXMuY29uZmlnLmFjdGlvblNhbml0aXplclxuICAgICAgICA/IHNhbml0aXplQWN0aW9uKFxuICAgICAgICAgICAgdGhpcy5jb25maWcuYWN0aW9uU2FuaXRpemVyLFxuICAgICAgICAgICAgYWN0aW9uLFxuICAgICAgICAgICAgc3RhdGUubmV4dEFjdGlvbklkXG4gICAgICAgICAgKVxuICAgICAgICA6IGFjdGlvbjtcblxuICAgICAgdGhpcy5zZW5kVG9SZWR1eERldnRvb2xzKCgpID0+XG4gICAgICAgIHRoaXMuZXh0ZW5zaW9uQ29ubmVjdGlvbi5zZW5kKHNhbml0aXplZEFjdGlvbiwgc2FuaXRpemVkU3RhdGUpXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZXF1aXJlcyBmdWxsIHN0YXRlIHVwZGF0ZVxuICAgICAgY29uc3Qgc2FuaXRpemVkTGlmdGVkU3RhdGUgPSB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBzdGFnZWRBY3Rpb25JZHM6IHN0YXRlLnN0YWdlZEFjdGlvbklkcyxcbiAgICAgICAgYWN0aW9uc0J5SWQ6IHRoaXMuY29uZmlnLmFjdGlvblNhbml0aXplclxuICAgICAgICAgID8gc2FuaXRpemVBY3Rpb25zKHRoaXMuY29uZmlnLmFjdGlvblNhbml0aXplciwgc3RhdGUuYWN0aW9uc0J5SWQpXG4gICAgICAgICAgOiBzdGF0ZS5hY3Rpb25zQnlJZCxcbiAgICAgICAgY29tcHV0ZWRTdGF0ZXM6IHRoaXMuY29uZmlnLnN0YXRlU2FuaXRpemVyXG4gICAgICAgICAgPyBzYW5pdGl6ZVN0YXRlcyh0aGlzLmNvbmZpZy5zdGF0ZVNhbml0aXplciwgc3RhdGUuY29tcHV0ZWRTdGF0ZXMpXG4gICAgICAgICAgOiBzdGF0ZS5jb21wdXRlZFN0YXRlcyxcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuc2VuZFRvUmVkdXhEZXZ0b29scygoKSA9PlxuICAgICAgICB0aGlzLmRldnRvb2xzRXh0ZW5zaW9uLnNlbmQoXG4gICAgICAgICAgbnVsbCxcbiAgICAgICAgICBzYW5pdGl6ZWRMaWZ0ZWRTdGF0ZSxcbiAgICAgICAgICB0aGlzLmdldEV4dGVuc2lvbkNvbmZpZyh0aGlzLmNvbmZpZylcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUNoYW5nZXNPYnNlcnZhYmxlKCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgaWYgKCF0aGlzLmRldnRvb2xzRXh0ZW5zaW9uKSB7XG4gICAgICByZXR1cm4gZW1wdHkoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoc3Vic2NyaWJlciA9PiB7XG4gICAgICBjb25zdCBjb25uZWN0aW9uID0gdGhpcy5kZXZ0b29sc0V4dGVuc2lvbi5jb25uZWN0KFxuICAgICAgICB0aGlzLmdldEV4dGVuc2lvbkNvbmZpZyh0aGlzLmNvbmZpZylcbiAgICAgICk7XG4gICAgICB0aGlzLmV4dGVuc2lvbkNvbm5lY3Rpb24gPSBjb25uZWN0aW9uO1xuICAgICAgY29ubmVjdGlvbi5pbml0KCk7XG5cbiAgICAgIGNvbm5lY3Rpb24uc3Vic2NyaWJlKChjaGFuZ2U6IGFueSkgPT4gc3Vic2NyaWJlci5uZXh0KGNoYW5nZSkpO1xuICAgICAgcmV0dXJuIGNvbm5lY3Rpb24udW5zdWJzY3JpYmU7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUFjdGlvblN0cmVhbXMoKSB7XG4gICAgLy8gTGlzdGVucyB0byBhbGwgY2hhbmdlc1xuICAgIGNvbnN0IGNoYW5nZXMkID0gdGhpcy5jcmVhdGVDaGFuZ2VzT2JzZXJ2YWJsZSgpLnBpcGUoc2hhcmUoKSk7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSBzdGFydCBhY3Rpb25cbiAgICBjb25zdCBzdGFydCQgPSBjaGFuZ2VzJC5waXBlKFxuICAgICAgZmlsdGVyKChjaGFuZ2U6IGFueSkgPT4gY2hhbmdlLnR5cGUgPT09IEV4dGVuc2lvbkFjdGlvblR5cGVzLlNUQVJUKVxuICAgICk7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSBzdG9wIGFjdGlvblxuICAgIGNvbnN0IHN0b3AkID0gY2hhbmdlcyQucGlwZShcbiAgICAgIGZpbHRlcigoY2hhbmdlOiBhbnkpID0+IGNoYW5nZS50eXBlID09PSBFeHRlbnNpb25BY3Rpb25UeXBlcy5TVE9QKVxuICAgICk7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIGxpZnRlZCBhY3Rpb25zXG4gICAgY29uc3QgbGlmdGVkQWN0aW9ucyQgPSBjaGFuZ2VzJC5waXBlKFxuICAgICAgZmlsdGVyKGNoYW5nZSA9PiBjaGFuZ2UudHlwZSA9PT0gRXh0ZW5zaW9uQWN0aW9uVHlwZXMuRElTUEFUQ0gpLFxuICAgICAgbWFwKGNoYW5nZSA9PiB0aGlzLnVud3JhcEFjdGlvbihjaGFuZ2UucGF5bG9hZCkpLFxuICAgICAgY29uY2F0TWFwKChhY3Rpb246IGFueSkgPT4ge1xuICAgICAgICBpZiAoYWN0aW9uLnR5cGUgPT09IElNUE9SVF9TVEFURSkge1xuICAgICAgICAgIC8vIFN0YXRlIGltcG9ydHMgbWF5IGhhcHBlbiBpbiB0d28gc2l0dWF0aW9uczpcbiAgICAgICAgICAvLyAxLiBFeHBsaWNpdGx5IGJ5IHVzZXJcbiAgICAgICAgICAvLyAyLiBVc2VyIGFjdGl2YXRlZCB0aGUgXCJwZXJzaXN0IHN0YXRlIGFjY3Jvc3MgcmVsb2Fkc1wiIG9wdGlvblxuICAgICAgICAgIC8vICAgIGFuZCBub3cgdGhlIHN0YXRlIGlzIGltcG9ydGVkIGR1cmluZyByZWxvYWQuXG4gICAgICAgICAgLy8gQmVjYXVzZSBvZiBvcHRpb24gMiwgd2UgbmVlZCB0byBnaXZlIHBvc3NpYmxlXG4gICAgICAgICAgLy8gbGF6eSBsb2FkZWQgcmVkdWNlcnMgdGltZSB0byBpbnN0YW50aWF0ZS5cbiAgICAgICAgICAvLyBBcyBzb29uIGFzIHRoZXJlIGlzIG5vIFVQREFURSBhY3Rpb24gd2l0aGluIDEgc2Vjb25kLFxuICAgICAgICAgIC8vIGl0IGlzIGFzc3VtZWQgdGhhdCBhbGwgcmVkdWNlcnMgYXJlIGxvYWRlZC5cbiAgICAgICAgICByZXR1cm4gdGhpcy5kaXNwYXRjaGVyLnBpcGUoXG4gICAgICAgICAgICBmaWx0ZXIoYWN0aW9uID0+IGFjdGlvbi50eXBlID09PSBVUERBVEUpLFxuICAgICAgICAgICAgdGltZW91dCgxMDAwKSxcbiAgICAgICAgICAgIGRlYm91bmNlVGltZSgxMDAwKSxcbiAgICAgICAgICAgIG1hcCgoKSA9PiBhY3Rpb24pLFxuICAgICAgICAgICAgY2F0Y2hFcnJvcigoKSA9PiBvZihhY3Rpb24pKSxcbiAgICAgICAgICAgIHRha2UoMSlcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBvZihhY3Rpb24pO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHVubGlmdGVkIGFjdGlvbnNcbiAgICBjb25zdCBhY3Rpb25zJCA9IGNoYW5nZXMkLnBpcGUoXG4gICAgICBmaWx0ZXIoY2hhbmdlID0+IGNoYW5nZS50eXBlID09PSBFeHRlbnNpb25BY3Rpb25UeXBlcy5BQ1RJT04pLFxuICAgICAgbWFwKGNoYW5nZSA9PiB0aGlzLnVud3JhcEFjdGlvbihjaGFuZ2UucGF5bG9hZCkpXG4gICAgKTtcblxuICAgIGNvbnN0IGFjdGlvbnNVbnRpbFN0b3AkID0gYWN0aW9ucyQucGlwZSh0YWtlVW50aWwoc3RvcCQpKTtcbiAgICBjb25zdCBsaWZ0ZWRVbnRpbFN0b3AkID0gbGlmdGVkQWN0aW9ucyQucGlwZSh0YWtlVW50aWwoc3RvcCQpKTtcbiAgICB0aGlzLnN0YXJ0JCA9IHN0YXJ0JC5waXBlKHRha2VVbnRpbChzdG9wJCkpO1xuXG4gICAgLy8gT25seSB0YWtlIHRoZSBhY3Rpb24gc291cmNlcyBiZXR3ZWVuIHRoZSBzdGFydC9zdG9wIGV2ZW50c1xuICAgIHRoaXMuYWN0aW9ucyQgPSB0aGlzLnN0YXJ0JC5waXBlKHN3aXRjaE1hcCgoKSA9PiBhY3Rpb25zVW50aWxTdG9wJCkpO1xuICAgIHRoaXMubGlmdGVkQWN0aW9ucyQgPSB0aGlzLnN0YXJ0JC5waXBlKHN3aXRjaE1hcCgoKSA9PiBsaWZ0ZWRVbnRpbFN0b3AkKSk7XG4gIH1cblxuICBwcml2YXRlIHVud3JhcEFjdGlvbihhY3Rpb246IEFjdGlvbikge1xuICAgIHJldHVybiB0eXBlb2YgYWN0aW9uID09PSAnc3RyaW5nJyA/IGV2YWwoYCgke2FjdGlvbn0pYCkgOiBhY3Rpb247XG4gIH1cblxuICBwcml2YXRlIGdldEV4dGVuc2lvbkNvbmZpZyhjb25maWc6IFN0b3JlRGV2dG9vbHNDb25maWcpIHtcbiAgICBjb25zdCBleHRlbnNpb25PcHRpb25zOiBSZWR1eERldnRvb2xzRXh0ZW5zaW9uQ29uZmlnID0ge1xuICAgICAgbmFtZTogY29uZmlnLm5hbWUsXG4gICAgICBmZWF0dXJlczogY29uZmlnLmZlYXR1cmVzLFxuICAgICAgc2VyaWFsaXplOiBjb25maWcuc2VyaWFsaXplLFxuICAgICAgLy8gVGhlIGFjdGlvbi9zdGF0ZSBzYW5pdGl6ZXJzIGFyZSBub3QgYWRkZWQgdG8gdGhlIGNvbmZpZ1xuICAgICAgLy8gYmVjYXVzZSBzYW5pdGF0aW9uIGlzIGRvbmUgaW4gdGhpcyBjbGFzcyBhbHJlYWR5LlxuICAgICAgLy8gSXQgaXMgZG9uZSBiZWZvcmUgc2VuZGluZyBpdCB0byB0aGUgZGV2dG9vbHMgZXh0ZW5zaW9uIGZvciBjb25zaXN0ZW5jeTpcbiAgICAgIC8vIC0gSWYgd2UgY2FsbCBleHRlbnNpb25Db25uZWN0aW9uLnNlbmQoLi4uKSxcbiAgICAgIC8vICAgdGhlIGV4dGVuc2lvbiB3b3VsZCBjYWxsIHRoZSBzYW5pdGl6ZXJzLlxuICAgICAgLy8gLSBJZiB3ZSBjYWxsIGRldnRvb2xzRXh0ZW5zaW9uLnNlbmQoLi4uKSAoYWthIGZ1bGwgc3RhdGUgdXBkYXRlKSxcbiAgICAgIC8vICAgdGhlIGV4dGVuc2lvbiB3b3VsZCBOT1QgY2FsbCB0aGUgc2FuaXRpemVycywgc28gd2UgaGF2ZSB0byBkbyBpdCBvdXJzZWx2ZXMuXG4gICAgfTtcbiAgICBpZiAoY29uZmlnLm1heEFnZSAhPT0gZmFsc2UgLyogc3VwcG9ydCA9PT0gMCAqLykge1xuICAgICAgZXh0ZW5zaW9uT3B0aW9ucy5tYXhBZ2UgPSBjb25maWcubWF4QWdlO1xuICAgIH1cbiAgICByZXR1cm4gZXh0ZW5zaW9uT3B0aW9ucztcbiAgfVxuXG4gIHByaXZhdGUgc2VuZFRvUmVkdXhEZXZ0b29scyhzZW5kOiBGdW5jdGlvbikge1xuICAgIHRyeSB7XG4gICAgICBzZW5kKCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICdAbmdyeC9zdG9yZS1kZXZ0b29sczogc29tZXRoaW5nIHdlbnQgd3JvbmcgaW5zaWRlIHRoZSByZWR1eCBkZXZ0b29scycsXG4gICAgICAgIGVyclxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==