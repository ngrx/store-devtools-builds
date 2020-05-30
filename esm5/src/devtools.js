var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
/**
 * @fileoverview added by tsickle
 * Generated from: src/devtools.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable, Inject, ErrorHandler } from '@angular/core';
import { ActionsSubject, INITIAL_STATE, ReducerObservable, ScannedActionsSubject, } from '@ngrx/store';
import { merge, queueScheduler, ReplaySubject, } from 'rxjs';
import { map, observeOn, scan, skip, withLatestFrom } from 'rxjs/operators';
import * as Actions from './actions';
import { STORE_DEVTOOLS_CONFIG, StoreDevtoolsConfig } from './config';
import { DevtoolsExtension } from './extension';
import { liftInitialState, liftReducerWith } from './reducer';
import { liftAction, unliftState, shouldFilterActions, filterLiftedState, } from './utils';
import { DevtoolsDispatcher } from './devtools-dispatcher';
import { PERFORM_ACTION } from './actions';
var StoreDevtools = /** @class */ (function () {
    function StoreDevtools(dispatcher, actions$, reducers$, extension, scannedActions, errorHandler, initialState, config) {
        var _this = this;
        /** @type {?} */
        var liftedInitialState = liftInitialState(initialState, config.monitor);
        /** @type {?} */
        var liftReducer = liftReducerWith(initialState, liftedInitialState, errorHandler, config.monitor, config);
        /** @type {?} */
        var liftedAction$ = merge(merge(actions$.asObservable().pipe(skip(1)), extension.actions$).pipe(map(liftAction)), dispatcher, extension.liftedActions$).pipe(observeOn(queueScheduler));
        /** @type {?} */
        var liftedReducer$ = reducers$.pipe(map(liftReducer));
        /** @type {?} */
        var liftedStateSubject = new ReplaySubject(1);
        /** @type {?} */
        var liftedStateSubscription = liftedAction$
            .pipe(withLatestFrom(liftedReducer$), scan((/**
         * @param {?} __0
         * @param {?} __1
         * @return {?}
         */
        function (_a, _b) {
            var liftedState = _a.state;
            var _c = __read(_b, 2), action = _c[0], reducer = _c[1];
            /** @type {?} */
            var reducedLiftedState = reducer(liftedState, action);
            // On full state update
            // If we have actions filters, we must filter completely our lifted state to be sync with the extension
            if (action.type !== PERFORM_ACTION && shouldFilterActions(config)) {
                reducedLiftedState = filterLiftedState(reducedLiftedState, config.predicate, config.actionsSafelist, config.actionsBlocklist);
            }
            // Extension should be sent the sanitized lifted state
            extension.notify(action, reducedLiftedState);
            return { state: reducedLiftedState, action: action };
        }), { state: liftedInitialState, action: (/** @type {?} */ (null)) }))
            .subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var state = _a.state, action = _a.action;
            liftedStateSubject.next(state);
            if (action.type === Actions.PERFORM_ACTION) {
                /** @type {?} */
                var unliftedAction = ((/** @type {?} */ (action))).action;
                scannedActions.next(unliftedAction);
            }
        }));
        /** @type {?} */
        var extensionStartSubscription = extension.start$.subscribe((/**
         * @return {?}
         */
        function () {
            _this.refresh();
        }));
        /** @type {?} */
        var liftedState$ = (/** @type {?} */ (liftedStateSubject.asObservable()));
        /** @type {?} */
        var state$ = liftedState$.pipe(map(unliftState));
        this.extensionStartSubscription = extensionStartSubscription;
        this.stateSubscription = liftedStateSubscription;
        this.dispatcher = dispatcher;
        this.liftedState = liftedState$;
        this.state = state$;
    }
    /**
     * @param {?} action
     * @return {?}
     */
    StoreDevtools.prototype.dispatch = /**
     * @param {?} action
     * @return {?}
     */
    function (action) {
        this.dispatcher.next(action);
    };
    /**
     * @param {?} action
     * @return {?}
     */
    StoreDevtools.prototype.next = /**
     * @param {?} action
     * @return {?}
     */
    function (action) {
        this.dispatcher.next(action);
    };
    /**
     * @param {?} error
     * @return {?}
     */
    StoreDevtools.prototype.error = /**
     * @param {?} error
     * @return {?}
     */
    function (error) { };
    /**
     * @return {?}
     */
    StoreDevtools.prototype.complete = /**
     * @return {?}
     */
    function () { };
    /**
     * @param {?} action
     * @return {?}
     */
    StoreDevtools.prototype.performAction = /**
     * @param {?} action
     * @return {?}
     */
    function (action) {
        this.dispatch(new Actions.PerformAction(action, +Date.now()));
    };
    /**
     * @return {?}
     */
    StoreDevtools.prototype.refresh = /**
     * @return {?}
     */
    function () {
        this.dispatch(new Actions.Refresh());
    };
    /**
     * @return {?}
     */
    StoreDevtools.prototype.reset = /**
     * @return {?}
     */
    function () {
        this.dispatch(new Actions.Reset(+Date.now()));
    };
    /**
     * @return {?}
     */
    StoreDevtools.prototype.rollback = /**
     * @return {?}
     */
    function () {
        this.dispatch(new Actions.Rollback(+Date.now()));
    };
    /**
     * @return {?}
     */
    StoreDevtools.prototype.commit = /**
     * @return {?}
     */
    function () {
        this.dispatch(new Actions.Commit(+Date.now()));
    };
    /**
     * @return {?}
     */
    StoreDevtools.prototype.sweep = /**
     * @return {?}
     */
    function () {
        this.dispatch(new Actions.Sweep());
    };
    /**
     * @param {?} id
     * @return {?}
     */
    StoreDevtools.prototype.toggleAction = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        this.dispatch(new Actions.ToggleAction(id));
    };
    /**
     * @param {?} actionId
     * @return {?}
     */
    StoreDevtools.prototype.jumpToAction = /**
     * @param {?} actionId
     * @return {?}
     */
    function (actionId) {
        this.dispatch(new Actions.JumpToAction(actionId));
    };
    /**
     * @param {?} index
     * @return {?}
     */
    StoreDevtools.prototype.jumpToState = /**
     * @param {?} index
     * @return {?}
     */
    function (index) {
        this.dispatch(new Actions.JumpToState(index));
    };
    /**
     * @param {?} nextLiftedState
     * @return {?}
     */
    StoreDevtools.prototype.importState = /**
     * @param {?} nextLiftedState
     * @return {?}
     */
    function (nextLiftedState) {
        this.dispatch(new Actions.ImportState(nextLiftedState));
    };
    /**
     * @param {?} status
     * @return {?}
     */
    StoreDevtools.prototype.lockChanges = /**
     * @param {?} status
     * @return {?}
     */
    function (status) {
        this.dispatch(new Actions.LockChanges(status));
    };
    /**
     * @param {?} status
     * @return {?}
     */
    StoreDevtools.prototype.pauseRecording = /**
     * @param {?} status
     * @return {?}
     */
    function (status) {
        this.dispatch(new Actions.PauseRecording(status));
    };
    StoreDevtools.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    StoreDevtools.ctorParameters = function () { return [
        { type: DevtoolsDispatcher },
        { type: ActionsSubject },
        { type: ReducerObservable },
        { type: DevtoolsExtension },
        { type: ScannedActionsSubject },
        { type: ErrorHandler },
        { type: undefined, decorators: [{ type: Inject, args: [INITIAL_STATE,] }] },
        { type: StoreDevtoolsConfig, decorators: [{ type: Inject, args: [STORE_DEVTOOLS_CONFIG,] }] }
    ]; };
    return StoreDevtools;
}());
export { StoreDevtools };
if (false) {
    /**
     * @type {?}
     * @private
     */
    StoreDevtools.prototype.stateSubscription;
    /**
     * @type {?}
     * @private
     */
    StoreDevtools.prototype.extensionStartSubscription;
    /** @type {?} */
    StoreDevtools.prototype.dispatcher;
    /** @type {?} */
    StoreDevtools.prototype.liftedState;
    /** @type {?} */
    StoreDevtools.prototype.state;
}
//# sourceMappingURL=devtools.js.map