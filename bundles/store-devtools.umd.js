(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@ngrx/store'), require('rxjs'), require('rxjs/operators')) :
	typeof define === 'function' && define.amd ? define('@ngrx/store-devtools', ['exports', '@angular/core', '@ngrx/store', 'rxjs', 'rxjs/operators'], factory) :
	(factory((global.ngrx = global.ngrx || {}, global.ngrx.storeDevtools = {}),global.ng.core,global.ngrx.store,global.Rx,global.operators));
}(this, (function (exports,core,store,rxjs,operators) { 'use strict';

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var StoreDevtoolsConfig = /** @class */ (function () {
    function StoreDevtoolsConfig() {
    }
    return StoreDevtoolsConfig;
}());
var STORE_DEVTOOLS_CONFIG = new core.InjectionToken('@ngrx/devtools Options');
var INITIAL_OPTIONS = new core.InjectionToken('@ngrx/devtools Initial Config');
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var PERFORM_ACTION = 'PERFORM_ACTION';
var REFRESH = 'REFRESH';
var RESET = 'RESET';
var ROLLBACK = 'ROLLBACK';
var COMMIT = 'COMMIT';
var SWEEP = 'SWEEP';
var TOGGLE_ACTION = 'TOGGLE_ACTION';
var SET_ACTIONS_ACTIVE = 'SET_ACTIONS_ACTIVE';
var JUMP_TO_STATE = 'JUMP_TO_STATE';
var JUMP_TO_ACTION = 'JUMP_TO_ACTION';
var IMPORT_STATE = 'IMPORT_STATE';
var PerformAction = /** @class */ (function () {
    /**
     * @param {?} action
     * @param {?} timestamp
     */
    function PerformAction(action, timestamp) {
        this.action = action;
        this.timestamp = timestamp;
        this.type = PERFORM_ACTION;
        if (typeof action.type === 'undefined') {
            throw new Error('Actions may not have an undefined "type" property. ' +
                'Have you misspelled a constant?');
        }
    }
    return PerformAction;
}());
var Refresh = /** @class */ (function () {
    function Refresh() {
        this.type = REFRESH;
    }
    return Refresh;
}());
var Reset = /** @class */ (function () {
    /**
     * @param {?} timestamp
     */
    function Reset(timestamp) {
        this.timestamp = timestamp;
        this.type = RESET;
    }
    return Reset;
}());
var Rollback = /** @class */ (function () {
    /**
     * @param {?} timestamp
     */
    function Rollback(timestamp) {
        this.timestamp = timestamp;
        this.type = ROLLBACK;
    }
    return Rollback;
}());
var Commit = /** @class */ (function () {
    /**
     * @param {?} timestamp
     */
    function Commit(timestamp) {
        this.timestamp = timestamp;
        this.type = COMMIT;
    }
    return Commit;
}());
var Sweep = /** @class */ (function () {
    function Sweep() {
        this.type = SWEEP;
    }
    return Sweep;
}());
var ToggleAction = /** @class */ (function () {
    /**
     * @param {?} id
     */
    function ToggleAction(id) {
        this.id = id;
        this.type = TOGGLE_ACTION;
    }
    return ToggleAction;
}());
var JumpToState = /** @class */ (function () {
    /**
     * @param {?} index
     */
    function JumpToState(index) {
        this.index = index;
        this.type = JUMP_TO_STATE;
    }
    return JumpToState;
}());
var JumpToAction = /** @class */ (function () {
    /**
     * @param {?} actionId
     */
    function JumpToAction(actionId) {
        this.actionId = actionId;
        this.type = JUMP_TO_ACTION;
    }
    return JumpToAction;
}());
var ImportState = /** @class */ (function () {
    /**
     * @param {?} nextLiftedState
     */
    function ImportState(nextLiftedState) {
        this.nextLiftedState = nextLiftedState;
        this.type = IMPORT_STATE;
    }
    return ImportState;
}());
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} first
 * @param {?} second
 * @return {?}
 */
function difference(first, second) {
    return first.filter(function (item) { return second.indexOf(item) < 0; });
}
/**
 * Provides an app's view into the state of the lifted store.
 * @param {?} liftedState
 * @return {?}
 */
function unliftState(liftedState) {
    var computedStates = liftedState.computedStates, currentStateIndex = liftedState.currentStateIndex;
    var state = computedStates[currentStateIndex].state;
    return state;
}
/**
 * @param {?} liftedState
 * @return {?}
 */
/**
 * Lifts an app's action into an action on the lifted store.
 * @param {?} action
 * @return {?}
 */
function liftAction(action) {
    return new PerformAction(action, +Date.now());
}
/**
 * Sanitizes given actions with given function.
 * @param {?} actionSanitizer
 * @param {?} actions
 * @return {?}
 */
function sanitizeActions(actionSanitizer, actions) {
    return Object.keys(actions).reduce(function (sanitizedActions, actionIdx) {
        var /** @type {?} */ idx = Number(actionIdx);
        sanitizedActions[idx] = sanitizeAction(actionSanitizer, actions[idx], idx);
        return sanitizedActions;
    }, /** @type {?} */ ({}));
}
/**
 * Sanitizes given action with given function.
 * @param {?} actionSanitizer
 * @param {?} action
 * @param {?} actionIdx
 * @return {?}
 */
function sanitizeAction(actionSanitizer, action, actionIdx) {
    return Object.assign({}, action, { action: actionSanitizer(action.action, actionIdx) });
}
/**
 * Sanitizes given states with given function.
 * @param {?} stateSanitizer
 * @param {?} states
 * @return {?}
 */
function sanitizeStates(stateSanitizer, states) {
    return states.map(function (computedState, idx) { return ({
        state: sanitizeState(stateSanitizer, computedState.state, idx),
        error: computedState.error,
    }); });
}
/**
 * Sanitizes given state with given function.
 * @param {?} stateSanitizer
 * @param {?} state
 * @param {?} stateIdx
 * @return {?}
 */
function sanitizeState(stateSanitizer, state, stateIdx) {
    return stateSanitizer(state, stateIdx);
}
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var ExtensionActionTypes = {
    START: 'START',
    DISPATCH: 'DISPATCH',
    STOP: 'STOP',
    ACTION: 'ACTION',
};
var REDUX_DEVTOOLS_EXTENSION = new core.InjectionToken('Redux Devtools Extension');
/**
 * @record
 */
/**
 * @record
 */
/**
 * @record
 */
var DevtoolsExtension = /** @class */ (function () {
    /**
     * @param {?} devtoolsExtension
     * @param {?} config
     */
    function DevtoolsExtension(devtoolsExtension, config) {
        this.config = config;
        this.instanceId = "ngrx-store-" + Date.now();
        this.devtoolsExtension = devtoolsExtension;
        this.createActionStreams();
    }
    /**
     * @param {?} action
     * @param {?} state
     * @return {?}
     */
    DevtoolsExtension.prototype.notify = function (action, state) {
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
            var /** @type {?} */ currentState = unliftState(state);
            var /** @type {?} */ sanitizedState = this.config.stateSanitizer
                ? sanitizeState(this.config.stateSanitizer, currentState, state.currentStateIndex)
                : currentState;
            var /** @type {?} */ sanitizedAction = this.config.actionSanitizer
                ? sanitizeAction(this.config.actionSanitizer, action, state.nextActionId)
                : action;
            this.extensionConnection.send(sanitizedAction, sanitizedState);
        }
        else {
            // Requires full state update
            var /** @type {?} */ sanitizedLiftedState = Object.assign({}, state, { actionsById: this.config.actionSanitizer
                    ? sanitizeActions(this.config.actionSanitizer, state.actionsById)
                    : state.actionsById, computedStates: this.config.stateSanitizer
                    ? sanitizeStates(this.config.stateSanitizer, state.computedStates)
                    : state.computedStates });
            this.devtoolsExtension.send(null, sanitizedLiftedState, this.getExtensionConfig(this.instanceId, this.config), this.instanceId);
        }
    };
    /**
     * @return {?}
     */
    DevtoolsExtension.prototype.createChangesObservable = function () {
        var _this = this;
        if (!this.devtoolsExtension) {
            return rxjs.empty();
        }
        return new rxjs.Observable(function (subscriber) {
            var /** @type {?} */ connection = _this.devtoolsExtension.connect(_this.getExtensionConfig(_this.instanceId, _this.config));
            _this.extensionConnection = connection;
            connection.init();
            connection.subscribe(function (change) { return subscriber.next(change); });
            return connection.unsubscribe;
        });
    };
    /**
     * @return {?}
     */
    DevtoolsExtension.prototype.createActionStreams = function () {
        var _this = this;
        // Listens to all changes based on our instanceId
        var /** @type {?} */ changes$ = this.createChangesObservable().pipe(operators.share());
        // Listen for the start action
        var /** @type {?} */ start$ = changes$.pipe(operators.filter(function (change) { return change.type === ExtensionActionTypes.START; }));
        // Listen for the stop action
        var /** @type {?} */ stop$ = changes$.pipe(operators.filter(function (change) { return change.type === ExtensionActionTypes.STOP; }));
        // Listen for lifted actions
        var /** @type {?} */ liftedActions$ = changes$.pipe(operators.filter(function (change) { return change.type === ExtensionActionTypes.DISPATCH; }), operators.map(function (change) { return _this.unwrapAction(change.payload); }));
        // Listen for unlifted actions
        var /** @type {?} */ actions$ = changes$.pipe(operators.filter(function (change) { return change.type === ExtensionActionTypes.ACTION; }), operators.map(function (change) { return _this.unwrapAction(change.payload); }));
        var /** @type {?} */ actionsUntilStop$ = actions$.pipe(operators.takeUntil(stop$));
        var /** @type {?} */ liftedUntilStop$ = liftedActions$.pipe(operators.takeUntil(stop$));
        this.start$ = start$.pipe(operators.takeUntil(stop$));
        // Only take the action sources between the start/stop events
        this.actions$ = this.start$.pipe(operators.switchMap(function () { return actionsUntilStop$; }));
        this.liftedActions$ = this.start$.pipe(operators.switchMap(function () { return liftedUntilStop$; }));
    };
    /**
     * @param {?} action
     * @return {?}
     */
    DevtoolsExtension.prototype.unwrapAction = function (action) {
        return typeof action === 'string' ? eval("(" + action + ")") : action;
    };
    /**
     * @param {?} instanceId
     * @param {?} config
     * @return {?}
     */
    DevtoolsExtension.prototype.getExtensionConfig = function (instanceId, config) {
        var /** @type {?} */ extensionOptions = {
            instanceId: instanceId,
            name: config.name,
            features: config.features,
            serialize: config.serialize,
        };
        if (config.maxAge !== false /* support === 0 */) {
            extensionOptions.maxAge = config.maxAge;
        }
        return extensionOptions;
    };
    return DevtoolsExtension;
}());
DevtoolsExtension.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
DevtoolsExtension.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: core.Inject, args: [REDUX_DEVTOOLS_EXTENSION,] },] },
    { type: StoreDevtoolsConfig, decorators: [{ type: core.Inject, args: [STORE_DEVTOOLS_CONFIG,] },] },
]; };
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var INIT_ACTION = { type: store.INIT };
/**
 * @record
 */
/**
 * @record
 */
/**
 * @record
 */
/**
 * @record
 */
/**
 * Computes the next entry in the log by applying an action.
 * @param {?} reducer
 * @param {?} action
 * @param {?} state
 * @param {?} error
 * @param {?} errorHandler
 * @return {?}
 */
function computeNextEntry(reducer, action, state, error, errorHandler) {
    if (error) {
        return {
            state: state,
            error: 'Interrupted by an error up the chain',
        };
    }
    var /** @type {?} */ nextState = state;
    var /** @type {?} */ nextError;
    try {
        nextState = reducer(state, action);
    }
    catch (err) {
        nextError = err.toString();
        errorHandler.handleError(err.stack || err);
    }
    return {
        state: nextState,
        error: nextError,
    };
}
/**
 * Runs the reducer on invalidated actions to get a fresh computation log.
 * @param {?} computedStates
 * @param {?} minInvalidatedStateIndex
 * @param {?} reducer
 * @param {?} committedState
 * @param {?} actionsById
 * @param {?} stagedActionIds
 * @param {?} skippedActionIds
 * @param {?} errorHandler
 * @return {?}
 */
function recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, errorHandler) {
    // Optimization: exit early and return the same reference
    // if we know nothing could have changed.
    if (minInvalidatedStateIndex >= computedStates.length &&
        computedStates.length === stagedActionIds.length) {
        return computedStates;
    }
    var /** @type {?} */ nextComputedStates = computedStates.slice(0, minInvalidatedStateIndex);
    for (var /** @type {?} */ i = minInvalidatedStateIndex; i < stagedActionIds.length; i++) {
        var /** @type {?} */ actionId = stagedActionIds[i];
        var /** @type {?} */ action = actionsById[actionId].action;
        var /** @type {?} */ previousEntry = nextComputedStates[i - 1];
        var /** @type {?} */ previousState = previousEntry ? previousEntry.state : committedState;
        var /** @type {?} */ previousError = previousEntry ? previousEntry.error : undefined;
        var /** @type {?} */ shouldSkip = skippedActionIds.indexOf(actionId) > -1;
        var /** @type {?} */ entry = shouldSkip
            ? previousEntry
            : computeNextEntry(reducer, action, previousState, previousError, errorHandler);
        nextComputedStates.push(entry);
    }
    return nextComputedStates;
}
/**
 * @param {?=} initialCommittedState
 * @param {?=} monitorReducer
 * @return {?}
 */
function liftInitialState(initialCommittedState, monitorReducer) {
    return {
        monitorState: monitorReducer(undefined, {}),
        nextActionId: 1,
        actionsById: { 0: liftAction(INIT_ACTION) },
        stagedActionIds: [0],
        skippedActionIds: [],
        committedState: initialCommittedState,
        currentStateIndex: 0,
        computedStates: [],
    };
}
/**
 * Creates a history state reducer from an app's reducer.
 * @param {?} initialCommittedState
 * @param {?} initialLiftedState
 * @param {?} errorHandler
 * @param {?=} monitorReducer
 * @param {?=} options
 * @return {?}
 */
function liftReducerWith(initialCommittedState, initialLiftedState, errorHandler, monitorReducer, options) {
    if (options === void 0) { options = {}; }
    /**
       * Manages how the history actions modify the history state.
       */
    return function (reducer) { return function (liftedState, liftedAction) {
        var _a = liftedState || initialLiftedState, monitorState = _a.monitorState, actionsById = _a.actionsById, nextActionId = _a.nextActionId, stagedActionIds = _a.stagedActionIds, skippedActionIds = _a.skippedActionIds, committedState = _a.committedState, currentStateIndex = _a.currentStateIndex, computedStates = _a.computedStates;
        if (!liftedState) {
            // Prevent mutating initialLiftedState
            actionsById = Object.create(actionsById);
        }
        /**
         * @param {?} n
         * @return {?}
         */
        function commitExcessActions(n) {
            // Auto-commits n-number of excess actions.
            var /** @type {?} */ excess = n;
            var /** @type {?} */ idsToDelete = stagedActionIds.slice(1, excess + 1);
            for (var /** @type {?} */ i = 0; i < idsToDelete.length; i++) {
                if (computedStates[i + 1].error) {
                    // Stop if error is found. Commit actions up to error.
                    excess = i;
                    idsToDelete = stagedActionIds.slice(1, excess + 1);
                    break;
                }
                else {
                    delete actionsById[idsToDelete[i]];
                }
            }
            skippedActionIds = skippedActionIds.filter(function (id) { return idsToDelete.indexOf(id) === -1; });
            stagedActionIds = [0].concat(stagedActionIds.slice(excess + 1));
            committedState = computedStates[excess].state;
            computedStates = computedStates.slice(excess);
            currentStateIndex =
                currentStateIndex > excess ? currentStateIndex - excess : 0;
        }
        // By default, aggressively recompute every state whatever happens.
        // This has O(n) performance, so we'll override this to a sensible
        // value whenever we feel like we don't have to recompute the states.
        var /** @type {?} */ minInvalidatedStateIndex = 0;
        switch (liftedAction.type) {
            case RESET: {
                // Get back to the state the store was created with.
                actionsById = { 0: liftAction(INIT_ACTION) };
                nextActionId = 1;
                stagedActionIds = [0];
                skippedActionIds = [];
                committedState = initialCommittedState;
                currentStateIndex = 0;
                computedStates = [];
                break;
            }
            case COMMIT: {
                // Consider the last committed state the new starting point.
                // Squash any staged actions into a single committed state.
                actionsById = { 0: liftAction(INIT_ACTION) };
                nextActionId = 1;
                stagedActionIds = [0];
                skippedActionIds = [];
                committedState = computedStates[currentStateIndex].state;
                currentStateIndex = 0;
                computedStates = [];
                break;
            }
            case ROLLBACK: {
                // Forget about any staged actions.
                // Start again from the last committed state.
                actionsById = { 0: liftAction(INIT_ACTION) };
                nextActionId = 1;
                stagedActionIds = [0];
                skippedActionIds = [];
                currentStateIndex = 0;
                computedStates = [];
                break;
            }
            case TOGGLE_ACTION: {
                // Toggle whether an action with given ID is skipped.
                // Being skipped means it is a no-op during the computation.
                var actionId_1 = liftedAction.id;
                var /** @type {?} */ index = skippedActionIds.indexOf(actionId_1);
                if (index === -1) {
                    skippedActionIds = [actionId_1].concat(skippedActionIds);
                }
                else {
                    skippedActionIds = skippedActionIds.filter(function (id) { return id !== actionId_1; });
                }
                // Optimization: we know history before this action hasn't changed
                minInvalidatedStateIndex = stagedActionIds.indexOf(actionId_1);
                break;
            }
            case SET_ACTIONS_ACTIVE: {
                // Toggle whether an action with given ID is skipped.
                // Being skipped means it is a no-op during the computation.
                var start = liftedAction.start, end = liftedAction.end, active = liftedAction.active;
                var /** @type {?} */ actionIds = [];
                for (var /** @type {?} */ i = start; i < end; i++)
                    actionIds.push(i);
                if (active) {
                    skippedActionIds = difference(skippedActionIds, actionIds);
                }
                else {
                    skippedActionIds = skippedActionIds.concat(actionIds);
                }
                // Optimization: we know history before this action hasn't changed
                minInvalidatedStateIndex = stagedActionIds.indexOf(start);
                break;
            }
            case JUMP_TO_STATE: {
                // Without recomputing anything, move the pointer that tell us
                // which state is considered the current one. Useful for sliders.
                currentStateIndex = liftedAction.index;
                // Optimization: we know the history has not changed.
                minInvalidatedStateIndex = Infinity;
                break;
            }
            case JUMP_TO_ACTION: {
                // Jumps to a corresponding state to a specific action.
                // Useful when filtering actions.
                var /** @type {?} */ index = stagedActionIds.indexOf(liftedAction.actionId);
                if (index !== -1)
                    currentStateIndex = index;
                minInvalidatedStateIndex = Infinity;
                break;
            }
            case SWEEP: {
                // Forget any actions that are currently being skipped.
                stagedActionIds = difference(stagedActionIds, skippedActionIds);
                skippedActionIds = [];
                currentStateIndex = Math.min(currentStateIndex, stagedActionIds.length - 1);
                break;
            }
            case PERFORM_ACTION: {
                // Auto-commit as new actions come in.
                if (options.maxAge && stagedActionIds.length === options.maxAge) {
                    commitExcessActions(1);
                }
                if (currentStateIndex === stagedActionIds.length - 1) {
                    currentStateIndex++;
                }
                var /** @type {?} */ actionId = nextActionId++;
                // Mutation! This is the hottest path, and we optimize on purpose.
                // It is safe because we set a new key in a cache dictionary.
                actionsById[actionId] = liftedAction;
                stagedActionIds = stagedActionIds.concat([actionId]);
                // Optimization: we know that only the new action needs computing.
                minInvalidatedStateIndex = stagedActionIds.length - 1;
                break;
            }
            case IMPORT_STATE: {
                // Completely replace everything.
                (_b = liftedAction.nextLiftedState, monitorState = _b.monitorState, actionsById = _b.actionsById, nextActionId = _b.nextActionId, stagedActionIds = _b.stagedActionIds, skippedActionIds = _b.skippedActionIds, committedState = _b.committedState, currentStateIndex = _b.currentStateIndex, computedStates = _b.computedStates);
                break;
            }
            case store.INIT: {
                // Always recompute states on hot reload and init.
                minInvalidatedStateIndex = 0;
                if (options.maxAge && stagedActionIds.length > options.maxAge) {
                    // States must be recomputed before committing excess.
                    computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, errorHandler);
                    commitExcessActions(stagedActionIds.length - options.maxAge);
                    // Avoid double computation.
                    minInvalidatedStateIndex = Infinity;
                }
                break;
            }
            case store.UPDATE: {
                var /** @type {?} */ stateHasErrors = computedStates.filter(function (state) { return state.error; }).length > 0;
                if (stateHasErrors) {
                    // Recompute all states
                    minInvalidatedStateIndex = 0;
                    if (options.maxAge && stagedActionIds.length > options.maxAge) {
                        // States must be recomputed before committing excess.
                        computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, errorHandler);
                        commitExcessActions(stagedActionIds.length - options.maxAge);
                        // Avoid double computation.
                        minInvalidatedStateIndex = Infinity;
                    }
                }
                else {
                    if (currentStateIndex === stagedActionIds.length - 1) {
                        currentStateIndex++;
                    }
                    // Add a new action to only recompute state
                    var /** @type {?} */ actionId = nextActionId++;
                    actionsById[actionId] = new PerformAction(liftedAction, +Date.now());
                    stagedActionIds = stagedActionIds.concat([actionId]);
                    minInvalidatedStateIndex = stagedActionIds.length - 1;
                    // States must be recomputed before committing excess.
                    computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, errorHandler);
                    // Recompute state history with latest reducer and update action
                    computedStates = computedStates.map(function (cmp) { return (Object.assign({}, cmp, { state: reducer(cmp.state, liftedAction) })); });
                    currentStateIndex = minInvalidatedStateIndex;
                    if (options.maxAge && stagedActionIds.length > options.maxAge) {
                        commitExcessActions(stagedActionIds.length - options.maxAge);
                    }
                    // Avoid double computation.
                    minInvalidatedStateIndex = Infinity;
                }
                break;
            }
            default: {
                // If the action is not recognized, it's a monitor action.
                // Optimization: a monitor action can't change history.
                minInvalidatedStateIndex = Infinity;
                break;
            }
        }
        computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, errorHandler);
        monitorState = monitorReducer(monitorState, liftedAction);
        return {
            monitorState: monitorState,
            actionsById: actionsById,
            nextActionId: nextActionId,
            stagedActionIds: stagedActionIds,
            skippedActionIds: skippedActionIds,
            committedState: committedState,
            currentStateIndex: currentStateIndex,
            computedStates: computedStates,
        };
        var _b;
    }; };
}
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var DevtoolsDispatcher = /** @class */ (function (_super) {
    __extends(DevtoolsDispatcher, _super);
    function DevtoolsDispatcher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DevtoolsDispatcher;
}(store.ActionsSubject));
DevtoolsDispatcher.decorators = [
    { type: core.Injectable },
];
var StoreDevtools = /** @class */ (function () {
    /**
     * @param {?} dispatcher
     * @param {?} actions$
     * @param {?} reducers$
     * @param {?} extension
     * @param {?} scannedActions
     * @param {?} errorHandler
     * @param {?} initialState
     * @param {?} config
     */
    function StoreDevtools(dispatcher, actions$, reducers$, extension, scannedActions, errorHandler, initialState, config) {
        var _this = this;
        var /** @type {?} */ liftedInitialState = liftInitialState(initialState, config.monitor);
        var /** @type {?} */ liftReducer = liftReducerWith(initialState, liftedInitialState, errorHandler, config.monitor, config);
        var /** @type {?} */ liftedAction$ = rxjs.merge(rxjs.merge(actions$.asObservable().pipe(operators.skip(1)), extension.actions$).pipe(operators.map(liftAction)), dispatcher, extension.liftedActions$).pipe(operators.observeOn(rxjs.queueScheduler));
        var /** @type {?} */ liftedReducer$ = reducers$.pipe(operators.map(liftReducer));
        var /** @type {?} */ liftedStateSubject = new rxjs.ReplaySubject(1);
        var /** @type {?} */ liftedStateSubscription = liftedAction$
            .pipe(operators.withLatestFrom(liftedReducer$), operators.scan(function (_a, _b) {
            var liftedState = _a.state;
            var action = _b[0], reducer = _b[1];
            var /** @type {?} */ reducedLiftedState = reducer(liftedState, action);
            // // Extension should be sent the sanitized lifted state
            extension.notify(action, reducedLiftedState);
            return { state: reducedLiftedState, action: action };
        }, { state: liftedInitialState, action: /** @type {?} */ (null) }))
            .subscribe(function (_a) {
            var state = _a.state, action = _a.action;
            liftedStateSubject.next(state);
            if (action.type === PERFORM_ACTION) {
                var /** @type {?} */ unliftedAction = ((action)).action;
                scannedActions.next(unliftedAction);
            }
        });
        var /** @type {?} */ extensionStartSubscription = extension.start$.subscribe(function () {
            _this.refresh();
        });
        var /** @type {?} */ liftedState$ = (liftedStateSubject.asObservable());
        var /** @type {?} */ state$ = liftedState$.pipe(operators.map(unliftState));
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
    StoreDevtools.prototype.dispatch = function (action) {
        this.dispatcher.next(action);
    };
    /**
     * @param {?} action
     * @return {?}
     */
    StoreDevtools.prototype.next = function (action) {
        this.dispatcher.next(action);
    };
    /**
     * @param {?} error
     * @return {?}
     */
    StoreDevtools.prototype.error = function (error) { };
    /**
     * @return {?}
     */
    StoreDevtools.prototype.complete = function () { };
    /**
     * @param {?} action
     * @return {?}
     */
    StoreDevtools.prototype.performAction = function (action) {
        this.dispatch(new PerformAction(action, +Date.now()));
    };
    /**
     * @return {?}
     */
    StoreDevtools.prototype.refresh = function () {
        this.dispatch(new Refresh());
    };
    /**
     * @return {?}
     */
    StoreDevtools.prototype.reset = function () {
        this.dispatch(new Reset(+Date.now()));
    };
    /**
     * @return {?}
     */
    StoreDevtools.prototype.rollback = function () {
        this.dispatch(new Rollback(+Date.now()));
    };
    /**
     * @return {?}
     */
    StoreDevtools.prototype.commit = function () {
        this.dispatch(new Commit(+Date.now()));
    };
    /**
     * @return {?}
     */
    StoreDevtools.prototype.sweep = function () {
        this.dispatch(new Sweep());
    };
    /**
     * @param {?} id
     * @return {?}
     */
    StoreDevtools.prototype.toggleAction = function (id) {
        this.dispatch(new ToggleAction(id));
    };
    /**
     * @param {?} actionId
     * @return {?}
     */
    StoreDevtools.prototype.jumpToAction = function (actionId) {
        this.dispatch(new JumpToAction(actionId));
    };
    /**
     * @param {?} index
     * @return {?}
     */
    StoreDevtools.prototype.jumpToState = function (index) {
        this.dispatch(new JumpToState(index));
    };
    /**
     * @param {?} nextLiftedState
     * @return {?}
     */
    StoreDevtools.prototype.importState = function (nextLiftedState) {
        this.dispatch(new ImportState(nextLiftedState));
    };
    return StoreDevtools;
}());
StoreDevtools.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
StoreDevtools.ctorParameters = function () { return [
    { type: DevtoolsDispatcher, },
    { type: store.ActionsSubject, },
    { type: store.ReducerObservable, },
    { type: DevtoolsExtension, },
    { type: store.ScannedActionsSubject, },
    { type: core.ErrorHandler, },
    { type: undefined, decorators: [{ type: core.Inject, args: [store.INITIAL_STATE,] },] },
    { type: StoreDevtoolsConfig, decorators: [{ type: core.Inject, args: [STORE_DEVTOOLS_CONFIG,] },] },
]; };
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var IS_EXTENSION_OR_MONITOR_PRESENT = new core.InjectionToken('Is Devtools Extension or Monitor Present');
/**
 * @param {?} extension
 * @param {?} config
 * @return {?}
 */
function createIsExtensionOrMonitorPresent(extension, config) {
    return Boolean(extension) || config.monitor !== noMonitor;
}
/**
 * @return {?}
 */
function createReduxDevtoolsExtension() {
    var /** @type {?} */ extensionKey = '__REDUX_DEVTOOLS_EXTENSION__';
    if (typeof window === 'object' &&
        typeof ((window))[extensionKey] !== 'undefined') {
        return ((window))[extensionKey];
    }
    else {
        return null;
    }
}
/**
 * @param {?} devtools
 * @return {?}
 */
function createStateObservable(devtools) {
    return devtools.state;
}
/**
 * @return {?}
 */
function noMonitor() {
    return null;
}
var DEFAULT_NAME = 'NgRx Store DevTools';
/**
 * @param {?} _options
 * @return {?}
 */
function createConfig(_options) {
    var /** @type {?} */ DEFAULT_OPTIONS = {
        maxAge: false,
        monitor: noMonitor,
        actionSanitizer: undefined,
        stateSanitizer: undefined,
        name: DEFAULT_NAME,
        serialize: false,
        logOnly: false,
        features: false,
    };
    var /** @type {?} */ options = typeof _options === 'function' ? _options() : _options;
    var /** @type {?} */ logOnly = options.logOnly
        ? { pause: true, export: true, test: true }
        : false;
    var /** @type {?} */ features = options.features || logOnly;
    var /** @type {?} */ config = Object.assign({}, DEFAULT_OPTIONS, { features: features }, options);
    if (config.maxAge && config.maxAge < 2) {
        throw new Error("Devtools 'maxAge' cannot be less than 2, got " + config.maxAge);
    }
    return config;
}
var StoreDevtoolsModule = /** @class */ (function () {
    function StoreDevtoolsModule() {
    }
    /**
     * @param {?=} options
     * @return {?}
     */
    StoreDevtoolsModule.instrument = function (options) {
        if (options === void 0) { options = {}; }
        return {
            ngModule: StoreDevtoolsModule,
            providers: [
                DevtoolsExtension,
                DevtoolsDispatcher,
                StoreDevtools,
                {
                    provide: INITIAL_OPTIONS,
                    useValue: options,
                },
                {
                    provide: IS_EXTENSION_OR_MONITOR_PRESENT,
                    deps: [REDUX_DEVTOOLS_EXTENSION, STORE_DEVTOOLS_CONFIG],
                    useFactory: createIsExtensionOrMonitorPresent,
                },
                {
                    provide: REDUX_DEVTOOLS_EXTENSION,
                    useFactory: createReduxDevtoolsExtension,
                },
                {
                    provide: STORE_DEVTOOLS_CONFIG,
                    deps: [INITIAL_OPTIONS],
                    useFactory: createConfig,
                },
                {
                    provide: store.StateObservable,
                    deps: [StoreDevtools],
                    useFactory: createStateObservable,
                },
                {
                    provide: store.ReducerManagerDispatcher,
                    useExisting: DevtoolsDispatcher,
                },
            ],
        };
    };
    return StoreDevtoolsModule;
}());
StoreDevtoolsModule.decorators = [
    { type: core.NgModule, args: [{},] },
];

exports.StoreDevtoolsModule = StoreDevtoolsModule;
exports.StoreDevtools = StoreDevtools;
exports.StoreDevtoolsConfig = StoreDevtoolsConfig;
exports.ɵi = INITIAL_OPTIONS;
exports.ɵh = STORE_DEVTOOLS_CONFIG;
exports.ɵg = DevtoolsDispatcher;
exports.ɵk = DevtoolsExtension;
exports.ɵj = REDUX_DEVTOOLS_EXTENSION;
exports.ɵa = IS_EXTENSION_OR_MONITOR_PRESENT;
exports.ɵf = createConfig;
exports.ɵb = createIsExtensionOrMonitorPresent;
exports.ɵc = createReduxDevtoolsExtension;
exports.ɵd = createStateObservable;
exports.ɵe = noMonitor;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=store-devtools.umd.js.map
