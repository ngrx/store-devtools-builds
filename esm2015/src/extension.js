/**
 * @fileoverview added by tsickle
 * Generated from: src/extension.ts
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
    { type: Injectable },
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
//# sourceMappingURL=extension.js.map