/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { empty, Observable } from 'rxjs';
import { filter, map, share, switchMap, takeUntil } from 'rxjs/operators';
import { PERFORM_ACTION } from './actions';
import { STORE_DEVTOOLS_CONFIG, StoreDevtoolsConfig, } from './config';
import { sanitizeAction, sanitizeActions, sanitizeState, sanitizeStates, unliftState, } from './utils';
export const /** @type {?} */ ExtensionActionTypes = {
    START: 'START',
    DISPATCH: 'DISPATCH',
    STOP: 'STOP',
    ACTION: 'ACTION',
};
export const /** @type {?} */ REDUX_DEVTOOLS_EXTENSION = new InjectionToken('Redux Devtools Extension');
/**
 * @record
 */
export function ReduxDevtoolsExtensionConnection() { }
function ReduxDevtoolsExtensionConnection_tsickle_Closure_declarations() {
    /** @type {?} */
    ReduxDevtoolsExtensionConnection.prototype.subscribe;
    /** @type {?} */
    ReduxDevtoolsExtensionConnection.prototype.unsubscribe;
    /** @type {?} */
    ReduxDevtoolsExtensionConnection.prototype.send;
    /** @type {?} */
    ReduxDevtoolsExtensionConnection.prototype.init;
    /** @type {?} */
    ReduxDevtoolsExtensionConnection.prototype.error;
}
/**
 * @record
 */
export function ReduxDevtoolsExtensionConfig() { }
function ReduxDevtoolsExtensionConfig_tsickle_Closure_declarations() {
    /** @type {?|undefined} */
    ReduxDevtoolsExtensionConfig.prototype.features;
    /** @type {?} */
    ReduxDevtoolsExtensionConfig.prototype.name;
    /** @type {?} */
    ReduxDevtoolsExtensionConfig.prototype.instanceId;
    /** @type {?|undefined} */
    ReduxDevtoolsExtensionConfig.prototype.maxAge;
    /** @type {?|undefined} */
    ReduxDevtoolsExtensionConfig.prototype.serialize;
}
/**
 * @record
 */
export function ReduxDevtoolsExtension() { }
function ReduxDevtoolsExtension_tsickle_Closure_declarations() {
    /** @type {?} */
    ReduxDevtoolsExtension.prototype.connect;
    /** @type {?} */
    ReduxDevtoolsExtension.prototype.send;
}
export class DevtoolsExtension {
    /**
     * @param {?} devtoolsExtension
     * @param {?} config
     */
    constructor(devtoolsExtension, config) {
        this.config = config;
        this.instanceId = `ngrx-store-${Date.now()}`;
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
        // If it is a simple action generated by the user's app, only send the
        // action and the current state (fast).
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
            const /** @type {?} */ currentState = unliftState(state);
            const /** @type {?} */ sanitizedState = this.config.stateSanitizer
                ? sanitizeState(this.config.stateSanitizer, currentState, state.currentStateIndex)
                : currentState;
            const /** @type {?} */ sanitizedAction = this.config.actionSanitizer
                ? sanitizeAction(this.config.actionSanitizer, action, state.nextActionId)
                : action;
            this.extensionConnection.send(sanitizedAction, sanitizedState);
        }
        else {
            // Requires full state update
            const /** @type {?} */ sanitizedLiftedState = Object.assign({}, state, { actionsById: this.config.actionSanitizer
                    ? sanitizeActions(this.config.actionSanitizer, state.actionsById)
                    : state.actionsById, computedStates: this.config.stateSanitizer
                    ? sanitizeStates(this.config.stateSanitizer, state.computedStates)
                    : state.computedStates });
            this.devtoolsExtension.send(null, sanitizedLiftedState, this.getExtensionConfig(this.instanceId, this.config), this.instanceId);
        }
    }
    /**
     * @return {?}
     */
    createChangesObservable() {
        if (!this.devtoolsExtension) {
            return empty();
        }
        return new Observable(subscriber => {
            const /** @type {?} */ connection = this.devtoolsExtension.connect(this.getExtensionConfig(this.instanceId, this.config));
            this.extensionConnection = connection;
            connection.init();
            connection.subscribe((change) => subscriber.next(change));
            return connection.unsubscribe;
        });
    }
    /**
     * @return {?}
     */
    createActionStreams() {
        // Listens to all changes based on our instanceId
        const /** @type {?} */ changes$ = this.createChangesObservable().pipe(share());
        // Listen for the start action
        const /** @type {?} */ start$ = changes$.pipe(filter((change) => change.type === ExtensionActionTypes.START));
        // Listen for the stop action
        const /** @type {?} */ stop$ = changes$.pipe(filter((change) => change.type === ExtensionActionTypes.STOP));
        // Listen for lifted actions
        const /** @type {?} */ liftedActions$ = changes$.pipe(filter(change => change.type === ExtensionActionTypes.DISPATCH), map(change => this.unwrapAction(change.payload)));
        // Listen for unlifted actions
        const /** @type {?} */ actions$ = changes$.pipe(filter(change => change.type === ExtensionActionTypes.ACTION), map(change => this.unwrapAction(change.payload)));
        const /** @type {?} */ actionsUntilStop$ = actions$.pipe(takeUntil(stop$));
        const /** @type {?} */ liftedUntilStop$ = liftedActions$.pipe(takeUntil(stop$));
        this.start$ = start$.pipe(takeUntil(stop$));
        // Only take the action sources between the start/stop events
        this.actions$ = this.start$.pipe(switchMap(() => actionsUntilStop$));
        this.liftedActions$ = this.start$.pipe(switchMap(() => liftedUntilStop$));
    }
    /**
     * @param {?} action
     * @return {?}
     */
    unwrapAction(action) {
        return typeof action === 'string' ? eval(`(${action})`) : action;
    }
    /**
     * @param {?} instanceId
     * @param {?} config
     * @return {?}
     */
    getExtensionConfig(instanceId, config) {
        const /** @type {?} */ extensionOptions = {
            instanceId: instanceId,
            name: config.name,
            features: config.features,
            serialize: config.serialize,
        };
        if (config.maxAge !== false /* support === 0 */) {
            extensionOptions.maxAge = config.maxAge;
        }
        return extensionOptions;
    }
}
DevtoolsExtension.decorators = [
    { type: Injectable }
];
/** @nocollapse */
DevtoolsExtension.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [REDUX_DEVTOOLS_EXTENSION,] },] },
    { type: StoreDevtoolsConfig, decorators: [{ type: Inject, args: [STORE_DEVTOOLS_CONFIG,] },] },
];
function DevtoolsExtension_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    DevtoolsExtension.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    DevtoolsExtension.ctorParameters;
    /** @type {?} */
    DevtoolsExtension.prototype.instanceId;
    /** @type {?} */
    DevtoolsExtension.prototype.devtoolsExtension;
    /** @type {?} */
    DevtoolsExtension.prototype.extensionConnection;
    /** @type {?} */
    DevtoolsExtension.prototype.liftedActions$;
    /** @type {?} */
    DevtoolsExtension.prototype.actions$;
    /** @type {?} */
    DevtoolsExtension.prototype.start$;
    /** @type {?} */
    DevtoolsExtension.prototype.config;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5zaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9zdG9yZS1kZXZ0b29scy9zcmMvZXh0ZW5zaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFbkUsT0FBTyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDekMsT0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUUxRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQzNDLE9BQU8sRUFFTCxxQkFBcUIsRUFDckIsbUJBQW1CLEdBQ3BCLE1BQU0sVUFBVSxDQUFDO0FBRWxCLE9BQU8sRUFDTCxjQUFjLEVBQ2QsZUFBZSxFQUNmLGFBQWEsRUFDYixjQUFjLEVBQ2QsV0FBVyxHQUNaLE1BQU0sU0FBUyxDQUFDO0FBRWpCLE1BQU0sQ0FBQyx1QkFBTSxvQkFBb0IsR0FBRztJQUNsQyxLQUFLLEVBQUUsT0FBTztJQUNkLFFBQVEsRUFBRSxVQUFVO0lBQ3BCLElBQUksRUFBRSxNQUFNO0lBQ1osTUFBTSxFQUFFLFFBQVE7Q0FDakIsQ0FBQztBQUVGLE1BQU0sQ0FBQyx1QkFBTSx3QkFBd0IsR0FBRyxJQUFJLGNBQWMsQ0FFeEQsMEJBQTBCLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQThCOUIsTUFBTTs7Ozs7SUFTSixZQUNvQyxtQkFDSztRQUFBLFdBQU0sR0FBTixNQUFNOzBCQVYxQixjQUFjLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQVk3QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsaUJBQWlCLENBQUM7UUFDM0MsSUFBSSxD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SUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztRQUNyRSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7Ozs7OztJQUdwRSxZQUFZLENBQUMsTUFBYztRQUNqQyxNQUFNLENBQUMsT0FBTyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7Ozs7Ozs7SUFHM0Qsa0JBQWtCLENBQUMsVUFBa0IsRUFBRSxNQUEyQjtRQUN4RSx1QkFBTSxnQkFBZ0IsR0FBaUM7WUFDckQsVUFBVSxFQUFFLFVBQVU7WUFDdEIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO1lBQ2pCLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUTtZQUN6QixTQUFTLEVBQUUsTUFBTSxDQUFDLFNBQVM7U0FRNUIsQ0FBQztRQUNGLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssS0FBSyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7WUFDaEQsZ0JBQWdCLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7U0FDekM7UUFDRCxNQUFNLENBQUMsZ0JBQWdCLENBQUM7Ozs7WUFsSjNCLFVBQVU7Ozs7NENBV04sTUFBTSxTQUFDLHdCQUF3QjtZQTVEbEMsbUJBQW1CLHVCQTZEaEIsTUFBTSxTQUFDLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgSW5qZWN0aW9uVG9rZW4gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IGVtcHR5LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaWx0ZXIsIG1hcCwgc2hhcmUsIHN3aXRjaE1hcCwgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBQRVJGT1JNX0FDVElPTiB9IGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQge1xuICBTZXJpYWxpemF0aW9uT3B0aW9ucyxcbiAgU1RPUkVfREVWVE9PTFNfQ09ORklHLFxuICBTdG9yZURldnRvb2xzQ29uZmlnLFxufSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgeyBMaWZ0ZWRBY3Rpb24sIExpZnRlZFN0YXRlIH0gZnJvbSAnLi9yZWR1Y2VyJztcbmltcG9ydCB7XG4gIHNhbml0aXplQWN0aW9uLFxuICBzYW5pdGl6ZUFjdGlvbnMsXG4gIHNhbml0aXplU3RhdGUsXG4gIHNhbml0aXplU3RhdGVzLFxuICB1bmxpZnRTdGF0ZSxcbn0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBjb25zdCBFeHRlbnNpb25BY3Rpb25UeXBlcyA9IHtcbiAgU1RBUlQ6ICdTVEFSVCcsXG4gIERJU1BBVENIOiAnRElTUEFUQ0gnLFxuICBTVE9QOiAnU1RPUCcsXG4gIEFDVElPTjogJ0FDVElPTicsXG59O1xuXG5leHBvcnQgY29uc3QgUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OID0gbmV3IEluamVjdGlvblRva2VuPFxuICBSZWR1eERldnRvb2xzRXh0ZW5zaW9uXG4+KCdSZWR1eCBEZXZ0b29scyBFeHRlbnNpb24nKTtcblxuZXhwb3J0IGludGVyZmFjZSBSZWR1eERldnRvb2xzRXh0ZW5zaW9uQ29ubmVjdGlvbiB7XG4gIHN1YnNjcmliZShsaXN0ZW5lcjogKGNoYW5nZTogYW55KSA9PiB2b2lkKTogdm9pZDtcbiAgdW5zdWJzY3JpYmUoKTogdm9pZDtcbiAgc2VuZChhY3Rpb246IGFueSwgc3RhdGU6IGFueSk6IHZvaWQ7XG4gIGluaXQoc3RhdGU/OiBhbnkpOiB2b2lkO1xuICBlcnJvcihhbnlFcnI6IGFueSk6IHZvaWQ7XG59XG5leHBvcnQgaW50ZXJmYWNlIFJlZHV4RGV2dG9vbHNFeHRlbnNpb25Db25maWcge1xuICBmZWF0dXJlcz86IG9iamVjdCB8IGJvb2xlYW47XG4gIG5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgaW5zdGFuY2VJZDogc3RyaW5nO1xuICBtYXhBZ2U/OiBudW1iZXI7XG4gIHNlcmlhbGl6ZT86IGJvb2xlYW4gfCBTZXJpYWxpemF0aW9uT3B0aW9ucztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZWR1eERldnRvb2xzRXh0ZW5zaW9uIHtcbiAgY29ubmVjdChcbiAgICBvcHRpb25zOiBSZWR1eERldnRvb2xzRXh0ZW5zaW9uQ29uZmlnXG4gICk6IFJlZHV4RGV2dG9vbHNFeHRlbnNpb25Db25uZWN0aW9uO1xuICBzZW5kKFxuICAgIGFjdGlvbjogYW55LFxuICAgIHN0YXRlOiBhbnksXG4gICAgb3B0aW9uczogUmVkdXhEZXZ0b29sc0V4dGVuc2lvbkNvbmZpZyxcbiAgICBpbnN0YW5jZUlkPzogc3RyaW5nXG4gICk6IHZvaWQ7XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEZXZ0b29sc0V4dGVuc2lvbiB7XG4gIHByaXZhdGUgaW5zdGFuY2VJZCA9IGBuZ3J4LXN0b3JlLSR7RGF0ZS5ub3coKX1gO1xuICBwcml2YXRlIGRldnRvb2xzRXh0ZW5zaW9uOiBSZWR1eERldnRvb2xzRXh0ZW5zaW9uO1xuICBwcml2YXRlIGV4dGVuc2lvbkNvbm5lY3Rpb246IFJlZHV4RGV2dG9vbHNFeHRlbnNpb25Db25uZWN0aW9uO1xuXG4gIGxpZnRlZEFjdGlvbnMkOiBPYnNlcnZhYmxlPGFueT47XG4gIGFjdGlvbnMkOiBPYnNlcnZhYmxlPGFueT47XG4gIHN0YXJ0JDogT2JzZXJ2YWJsZTxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OKSBkZXZ0b29sc0V4dGVuc2lvbjogUmVkdXhEZXZ0b29sc0V4dGVuc2lvbixcbiAgICBASW5qZWN0KFNUT1JFX0RFVlRPT0xTX0NPTkZJRykgcHJpdmF0ZSBjb25maWc6IFN0b3JlRGV2dG9vbHNDb25maWdcbiAgKSB7XG4gICAgdGhpcy5kZXZ0b29sc0V4dGVuc2lvbiA9IGRldnRvb2xzRXh0ZW5zaW9uO1xuICAgIHRoaXMuY3JlYXRlQWN0aW9uU3RyZWFtcygpO1xuICB9XG5cbiAgbm90aWZ5KGFjdGlvbjogTGlmdGVkQWN0aW9uLCBzdGF0ZTogTGlmdGVkU3RhdGUpIHtcbiAgICBpZiAoIXRoaXMuZGV2dG9vbHNFeHRlbnNpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIGFjdGlvbiByZXF1aXJlcyBhIGZ1bGwgdXBkYXRlIG9mIHRoZSBsaWZ0ZWRTdGF0ZS5cbiAgICAvLyBJZiBpdCBpcyBhIHNpbXBsZSBhY3Rpb24gZ2VuZXJhdGVkIGJ5IHRoZSB1c2VyJ3MgYXBwLCBvbmx5IHNlbmQgdGhlXG4gICAgLy8gYWN0aW9uIGFuZCB0aGUgY3VycmVudCBzdGF0ZSAoZmFzdCkuXG4gICAgLy9cbiAgICAvLyBBIGZ1bGwgbGlmdGVkU3RhdGUgdXBkYXRlIChzbG93OiBzZXJpYWxpemVzIHRoZSBlbnRpcmUgbGlmdGVkU3RhdGUpIGlzXG4gICAgLy8gb25seSByZXF1aXJlZCB3aGVuOlxuICAgIC8vICAgYSkgcmVkdXgtZGV2dG9vbHMtZXh0ZW5zaW9uIGZpcmVzIHRoZSBAQEluaXQgYWN0aW9uIChpZ25vcmVkIGJ5XG4gICAgLy8gICAgICBAbmdyeC9zdG9yZS1kZXZ0b29scylcbiAgICAvLyAgIGIpIGFuIGFjdGlvbiBpcyBnZW5lcmF0ZWQgYnkgYW4gQG5ncnggbW9kdWxlIChlLmcuIEBuZ3J4L2VmZmVjdHMvaW5pdFxuICAgIC8vICAgICAgb3IgQG5ncngvc3RvcmUvdXBkYXRlLXJlZHVjZXJzKVxuICAgIC8vICAgYykgdGhlIHN0YXRlIGhhcyBiZWVuIHJlY29tcHV0ZWQgZHVlIHRvIHRpbWUtdHJhdmVsaW5nXG4gICAgLy8gICBkKSBhbnkgYWN0aW9uIHRoYXQgaXMgbm90IGEgUGVyZm9ybUFjdGlvbiB0byBlcnIgb24gdGhlIHNpZGUgb2ZcbiAgICAvLyAgICAgIGNhdXRpb24uXG4gICAgaWYgKGFjdGlvbi50eXBlID09PSBQRVJGT1JNX0FDVElPTikge1xuICAgICAgY29uc3QgY3VycmVudFN0YXRlID0gdW5saWZ0U3RhdGUoc3RhdGUpO1xuICAgICAgY29uc3Qgc2FuaXRpemVkU3RhdGUgPSB0aGlzLmNvbmZpZy5zdGF0ZVNhbml0aXplclxuICAgICAgICA/IHNhbml0aXplU3RhdGUoXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5zdGF0ZVNhbml0aXplcixcbiAgICAgICAgICAgIGN1cnJlbnRTdGF0ZSxcbiAgICAgICAgICAgIHN0YXRlLmN1cnJlbnRTdGF0ZUluZGV4XG4gICAgICAgICAgKVxuICAgICAgICA6IGN1cnJlbnRTdGF0ZTtcbiAgICAgIGNvbnN0IHNhbml0aXplZEFjdGlvbiA9IHRoaXMuY29uZmlnLmFjdGlvblNhbml0aXplclxuICAgICAgICA/IHNhbml0aXplQWN0aW9uKFxuICAgICAgICAgICAgdGhpcy5jb25maWcuYWN0aW9uU2FuaXRpemVyLFxuICAgICAgICAgICAgYWN0aW9uLFxuICAgICAgICAgICAgc3RhdGUubmV4dEFjdGlvbklkXG4gICAgICAgICAgKVxuICAgICAgICA6IGFjdGlvbjtcbiAgICAgIHRoaXMuZXh0ZW5zaW9uQ29ubmVjdGlvbi5zZW5kKHNhbml0aXplZEFjdGlvbiwgc2FuaXRpemVkU3RhdGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZXF1aXJlcyBmdWxsIHN0YXRlIHVwZGF0ZVxuICAgICAgY29uc3Qgc2FuaXRpemVkTGlmdGVkU3RhdGUgPSB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBhY3Rpb25zQnlJZDogdGhpcy5jb25maWcuYWN0aW9uU2FuaXRpemVyXG4gICAgICAgICAgPyBzYW5pdGl6ZUFjdGlvbnModGhpcy5jb25maWcuYWN0aW9uU2FuaXRpemVyLCBzdGF0ZS5hY3Rpb25zQnlJZClcbiAgICAgICAgICA6IHN0YXRlLmFjdGlvbnNCeUlkLFxuICAgICAgICBjb21wdXRlZFN0YXRlczogdGhpcy5jb25maWcuc3RhdGVTYW5pdGl6ZXJcbiAgICAgICAgICA/IHNhbml0aXplU3RhdGVzKHRoaXMuY29uZmlnLnN0YXRlU2FuaXRpemVyLCBzdGF0ZS5jb21wdXRlZFN0YXRlcylcbiAgICAgICAgICA6IHN0YXRlLmNvbXB1dGVkU3RhdGVzLFxuICAgICAgfTtcbiAgICAgIHRoaXMuZGV2dG9vbHNFeHRlbnNpb24uc2VuZChcbiAgICAgICAgbnVsbCxcbiAgICAgICAgc2FuaXRpemVkTGlmdGVkU3RhdGUsXG4gICAgICAgIHRoaXMuZ2V0RXh0ZW5zaW9uQ29uZmlnKHRoaXMuaW5zdGFuY2VJZCwgdGhpcy5jb25maWcpLFxuICAgICAgICB0aGlzLmluc3RhbmNlSWRcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVDaGFuZ2VzT2JzZXJ2YWJsZSgpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGlmICghdGhpcy5kZXZ0b29sc0V4dGVuc2lvbikge1xuICAgICAgcmV0dXJuIGVtcHR5KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKHN1YnNjcmliZXIgPT4ge1xuICAgICAgY29uc3QgY29ubmVjdGlvbiA9IHRoaXMuZGV2dG9vbHNFeHRlbnNpb24uY29ubmVjdChcbiAgICAgICAgdGhpcy5nZXRFeHRlbnNpb25Db25maWcodGhpcy5pbnN0YW5jZUlkLCB0aGlzLmNvbmZpZylcbiAgICAgICk7XG4gICAgICB0aGlzLmV4dGVuc2lvbkNvbm5lY3Rpb24gPSBjb25uZWN0aW9uO1xuICAgICAgY29ubmVjdGlvbi5pbml0KCk7XG5cbiAgICAgIGNvbm5lY3Rpb24uc3Vic2NyaWJlKChjaGFuZ2U6IGFueSkgPT4gc3Vic2NyaWJlci5uZXh0KGNoYW5nZSkpO1xuICAgICAgcmV0dXJuIGNvbm5lY3Rpb24udW5zdWJzY3JpYmU7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUFjdGlvblN0cmVhbXMoKSB7XG4gICAgLy8gTGlzdGVucyB0byBhbGwgY2hhbmdlcyBiYXNlZCBvbiBvdXIgaW5zdGFuY2VJZFxuICAgIGNvbnN0IGNoYW5nZXMkID0gdGhpcy5jcmVhdGVDaGFuZ2VzT2JzZXJ2YWJsZSgpLnBpcGUoc2hhcmUoKSk7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSBzdGFydCBhY3Rpb25cbiAgICBjb25zdCBzdGFydCQgPSBjaGFuZ2VzJC5waXBlKFxuICAgICAgZmlsdGVyKChjaGFuZ2U6IGFueSkgPT4gY2hhbmdlLnR5cGUgPT09IEV4dGVuc2lvbkFjdGlvblR5cGVzLlNUQVJUKVxuICAgICk7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSBzdG9wIGFjdGlvblxuICAgIGNvbnN0IHN0b3AkID0gY2hhbmdlcyQucGlwZShcbiAgICAgIGZpbHRlcigoY2hhbmdlOiBhbnkpID0+IGNoYW5nZS50eXBlID09PSBFeHRlbnNpb25BY3Rpb25UeXBlcy5TVE9QKVxuICAgICk7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIGxpZnRlZCBhY3Rpb25zXG4gICAgY29uc3QgbGlmdGVkQWN0aW9ucyQgPSBjaGFuZ2VzJC5waXBlKFxuICAgICAgZmlsdGVyKGNoYW5nZSA9PiBjaGFuZ2UudHlwZSA9PT0gRXh0ZW5zaW9uQWN0aW9uVHlwZXMuRElTUEFUQ0gpLFxuICAgICAgbWFwKGNoYW5nZSA9PiB0aGlzLnVud3JhcEFjdGlvbihjaGFuZ2UucGF5bG9hZCkpXG4gICAgKTtcblxuICAgIC8vIExpc3RlbiBmb3IgdW5saWZ0ZWQgYWN0aW9uc1xuICAgIGNvbnN0IGFjdGlvbnMkID0gY2hhbmdlcyQucGlwZShcbiAgICAgIGZpbHRlcihjaGFuZ2UgPT4gY2hhbmdlLnR5cGUgPT09IEV4dGVuc2lvbkFjdGlvblR5cGVzLkFDVElPTiksXG4gICAgICBtYXAoY2hhbmdlID0+IHRoaXMudW53cmFwQWN0aW9uKGNoYW5nZS5wYXlsb2FkKSlcbiAgICApO1xuXG4gICAgY29uc3QgYWN0aW9uc1VudGlsU3RvcCQgPSBhY3Rpb25zJC5waXBlKHRha2VVbnRpbChzdG9wJCkpO1xuICAgIGNvbnN0IGxpZnRlZFVudGlsU3RvcCQgPSBsaWZ0ZWRBY3Rpb25zJC5waXBlKHRha2VVbnRpbChzdG9wJCkpO1xuICAgIHRoaXMuc3RhcnQkID0gc3RhcnQkLnBpcGUodGFrZVVudGlsKHN0b3AkKSk7XG5cbiAgICAvLyBPbmx5IHRha2UgdGhlIGFjdGlvbiBzb3VyY2VzIGJldHdlZW4gdGhlIHN0YXJ0L3N0b3AgZXZlbnRzXG4gICAgdGhpcy5hY3Rpb25zJCA9IHRoaXMuc3RhcnQkLnBpcGUoc3dpdGNoTWFwKCgpID0+IGFjdGlvbnNVbnRpbFN0b3AkKSk7XG4gICAgdGhpcy5saWZ0ZWRBY3Rpb25zJCA9IHRoaXMuc3RhcnQkLnBpcGUoc3dpdGNoTWFwKCgpID0+IGxpZnRlZFVudGlsU3RvcCQpKTtcbiAgfVxuXG4gIHByaXZhdGUgdW53cmFwQWN0aW9uKGFjdGlvbjogQWN0aW9uKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBhY3Rpb24gPT09ICdzdHJpbmcnID8gZXZhbChgKCR7YWN0aW9ufSlgKSA6IGFjdGlvbjtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RXh0ZW5zaW9uQ29uZmlnKGluc3RhbmNlSWQ6IHN0cmluZywgY29uZmlnOiBTdG9yZURldnRvb2xzQ29uZmlnKSB7XG4gICAgY29uc3QgZXh0ZW5zaW9uT3B0aW9uczogUmVkdXhEZXZ0b29sc0V4dGVuc2lvbkNvbmZpZyA9IHtcbiAgICAgIGluc3RhbmNlSWQ6IGluc3RhbmNlSWQsXG4gICAgICBuYW1lOiBjb25maWcubmFtZSxcbiAgICAgIGZlYXR1cmVzOiBjb25maWcuZmVhdHVyZXMsXG4gICAgICBzZXJpYWxpemU6IGNvbmZpZy5zZXJpYWxpemUsXG4gICAgICAvLyBUaGUgYWN0aW9uL3N0YXRlIHNhbml0aXplcnMgYXJlIG5vdCBhZGRlZCB0byB0aGUgY29uZmlnXG4gICAgICAvLyBiZWNhdXNlIHNhbml0YXRpb24gaXMgZG9uZSBpbiB0aGlzIGNsYXNzIGFscmVhZHkuXG4gICAgICAvLyBJdCBpcyBkb25lIGJlZm9yZSBzZW5kaW5nIGl0IHRvIHRoZSBkZXZ0b29scyBleHRlbnNpb24gZm9yIGNvbnNpc3RlbmN5OlxuICAgICAgLy8gLSBJZiB3ZSBjYWxsIGV4dGVuc2lvbkNvbm5lY3Rpb24uc2VuZCguLi4pLFxuICAgICAgLy8gICB0aGUgZXh0ZW5zaW9uIHdvdWxkIGNhbGwgdGhlIHNhbml0aXplcnMuXG4gICAgICAvLyAtIElmIHdlIGNhbGwgZGV2dG9vbHNFeHRlbnNpb24uc2VuZCguLi4pIChha2EgZnVsbCBzdGF0ZSB1cGRhdGUpLFxuICAgICAgLy8gICB0aGUgZXh0ZW5zaW9uIHdvdWxkIE5PVCBjYWxsIHRoZSBzYW5pdGl6ZXJzLCBzbyB3ZSBoYXZlIHRvIGRvIGl0IG91cnNlbHZlcy5cbiAgICB9O1xuICAgIGlmIChjb25maWcubWF4QWdlICE9PSBmYWxzZSAvKiBzdXBwb3J0ID09PSAwICovKSB7XG4gICAgICBleHRlbnNpb25PcHRpb25zLm1heEFnZSA9IGNvbmZpZy5tYXhBZ2U7XG4gICAgfVxuICAgIHJldHVybiBleHRlbnNpb25PcHRpb25zO1xuICB9XG59XG4iXX0=