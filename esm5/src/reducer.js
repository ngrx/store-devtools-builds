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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import { UPDATE, INIT, } from '@ngrx/store';
import { difference, liftAction } from './utils';
import * as DevtoolsActions from './actions';
import { PerformAction } from './actions';
export var INIT_ACTION = { type: INIT };
export var RECOMPUTE = '@ngrx/store-devtools/recompute';
export var RECOMPUTE_ACTION = { type: RECOMPUTE };
/**
 * Computes the next entry in the log by applying an action.
 */
function computeNextEntry(reducer, action, state, error, errorHandler) {
    if (error) {
        return {
            state: state,
            error: 'Interrupted by an error up the chain',
        };
    }
    var nextState = state;
    var nextError;
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
 */
function recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, errorHandler, isPaused) {
    // Optimization: exit early and return the same reference
    // if we know nothing could have changed.
    if (minInvalidatedStateIndex >= computedStates.length &&
        computedStates.length === stagedActionIds.length) {
        return computedStates;
    }
    var nextComputedStates = computedStates.slice(0, minInvalidatedStateIndex);
    // If the recording is paused, recompute all states up until the pause state,
    // else recompute all states.
    var lastIncludedActionId = stagedActionIds.length - (isPaused ? 1 : 0);
    for (var i = minInvalidatedStateIndex; i < lastIncludedActionId; i++) {
        var actionId = stagedActionIds[i];
        var action = actionsById[actionId].action;
        var previousEntry = nextComputedStates[i - 1];
        var previousState = previousEntry ? previousEntry.state : committedState;
        var previousError = previousEntry ? previousEntry.error : undefined;
        var shouldSkip = skippedActionIds.indexOf(actionId) > -1;
        var entry = shouldSkip
            ? previousEntry
            : computeNextEntry(reducer, action, previousState, previousError, errorHandler);
        nextComputedStates.push(entry);
    }
    // If the recording is paused, the last state will not be recomputed,
    // because it's essentially not part of the state history.
    if (isPaused) {
        nextComputedStates.push(computedStates[computedStates.length - 1]);
    }
    return nextComputedStates;
}
export function liftInitialState(initialCommittedState, monitorReducer) {
    return {
        monitorState: monitorReducer(undefined, {}),
        nextActionId: 1,
        actionsById: { 0: liftAction(INIT_ACTION) },
        stagedActionIds: [0],
        skippedActionIds: [],
        committedState: initialCommittedState,
        currentStateIndex: 0,
        computedStates: [],
        isLocked: false,
        isPaused: false,
    };
}
/**
 * Creates a history state reducer from an app's reducer.
 */
export function liftReducerWith(initialCommittedState, initialLiftedState, errorHandler, monitorReducer, options) {
    if (options === void 0) { options = {}; }
    /**
     * Manages how the history actions modify the history state.
     */
    return function (reducer) { return function (liftedState, liftedAction) {
        var _a;
        var _b = liftedState || initialLiftedState, monitorState = _b.monitorState, actionsById = _b.actionsById, nextActionId = _b.nextActionId, stagedActionIds = _b.stagedActionIds, skippedActionIds = _b.skippedActionIds, committedState = _b.committedState, currentStateIndex = _b.currentStateIndex, computedStates = _b.computedStates, isLocked = _b.isLocked, isPaused = _b.isPaused;
        if (!liftedState) {
            // Prevent mutating initialLiftedState
            actionsById = Object.create(actionsById);
        }
        function commitExcessActions(n) {
            // Auto-commits n-number of excess actions.
            var excess = n;
            var idsToDelete = stagedActionIds.slice(1, excess + 1);
            for (var i = 0; i < idsToDelete.length; i++) {
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
            stagedActionIds = __spread([0], stagedActionIds.slice(excess + 1));
            committedState = computedStates[excess].state;
            computedStates = computedStates.slice(excess);
            currentStateIndex =
                currentStateIndex > excess ? currentStateIndex - excess : 0;
        }
        function commitChanges() {
            // Consider the last committed state the new starting point.
            // Squash any staged actions into a single committed state.
            actionsById = { 0: liftAction(INIT_ACTION) };
            nextActionId = 1;
            stagedActionIds = [0];
            skippedActionIds = [];
            committedState = computedStates[currentStateIndex].state;
            currentStateIndex = 0;
            computedStates = [];
        }
        // By default, aggressively recompute every state whatever happens.
        // This has O(n) performance, so we'll override this to a sensible
        // value whenever we feel like we don't have to recompute the states.
        var minInvalidatedStateIndex = 0;
        switch (liftedAction.type) {
            case DevtoolsActions.LOCK_CHANGES: {
                isLocked = liftedAction.status;
                minInvalidatedStateIndex = Infinity;
                break;
            }
            case DevtoolsActions.PAUSE_RECORDING: {
                isPaused = liftedAction.status;
                if (isPaused) {
                    // Add a pause action to signal the devtools-user the recording is paused.
                    // The corresponding state will be overwritten on each update to always contain
                    // the latest state (see Actions.PERFORM_ACTION).
                    stagedActionIds = __spread(stagedActionIds, [nextActionId]);
                    actionsById[nextActionId] = new PerformAction({
                        type: '@ngrx/devtools/pause',
                    }, +Date.now());
                    nextActionId++;
                    minInvalidatedStateIndex = stagedActionIds.length - 1;
                    computedStates = computedStates.concat(computedStates[computedStates.length - 1]);
                    if (currentStateIndex === stagedActionIds.length - 2) {
                        currentStateIndex++;
                    }
                    minInvalidatedStateIndex = Infinity;
                }
                else {
                    commitChanges();
                }
                break;
            }
            case DevtoolsActions.RESET: {
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
            case DevtoolsActions.COMMIT: {
                commitChanges();
                break;
            }
            case DevtoolsActions.ROLLBACK: {
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
            case DevtoolsActions.TOGGLE_ACTION: {
                // Toggle whether an action with given ID is skipped.
                // Being skipped means it is a no-op during the computation.
                var actionId_1 = liftedAction.id;
                var index = skippedActionIds.indexOf(actionId_1);
                if (index === -1) {
                    skippedActionIds = __spread([actionId_1], skippedActionIds);
                }
                else {
                    skippedActionIds = skippedActionIds.filter(function (id) { return id !== actionId_1; });
                }
                // Optimization: we know history before this action hasn't changed
                minInvalidatedStateIndex = stagedActionIds.indexOf(actionId_1);
                break;
            }
            case DevtoolsActions.SET_ACTIONS_ACTIVE: {
                // Toggle whether an action with given ID is skipped.
                // Being skipped means it is a no-op during the computation.
                var start = liftedAction.start, end = liftedAction.end, active = liftedAction.active;
                var actionIds = [];
                for (var i = start; i < end; i++)
                    actionIds.push(i);
                if (active) {
                    skippedActionIds = difference(skippedActionIds, actionIds);
                }
                else {
                    skippedActionIds = __spread(skippedActionIds, actionIds);
                }
                // Optimization: we know history before this action hasn't changed
                minInvalidatedStateIndex = stagedActionIds.indexOf(start);
                break;
            }
            case DevtoolsActions.JUMP_TO_STATE: {
                // Without recomputing anything, move the pointer that tell us
                // which state is considered the current one. Useful for sliders.
                currentStateIndex = liftedAction.index;
                // Optimization: we know the history has not changed.
                minInvalidatedStateIndex = Infinity;
                break;
            }
            case DevtoolsActions.JUMP_TO_ACTION: {
                // Jumps to a corresponding state to a specific action.
                // Useful when filtering actions.
                var index = stagedActionIds.indexOf(liftedAction.actionId);
                if (index !== -1)
                    currentStateIndex = index;
                minInvalidatedStateIndex = Infinity;
                break;
            }
            case DevtoolsActions.SWEEP: {
                // Forget any actions that are currently being skipped.
                stagedActionIds = difference(stagedActionIds, skippedActionIds);
                skippedActionIds = [];
                currentStateIndex = Math.min(currentStateIndex, stagedActionIds.length - 1);
                break;
            }
            case DevtoolsActions.PERFORM_ACTION: {
                // Ignore action and return state as is if recording is locked
                if (isLocked) {
                    return liftedState || initialLiftedState;
                }
                if (isPaused) {
                    // If recording is paused, overwrite the last state
                    // (corresponds to the pause action) and keep everything else as is.
                    // This way, the app gets the new current state while the devtools
                    // do not record another action.
                    var lastState = computedStates[computedStates.length - 1];
                    computedStates = __spread(computedStates.slice(0, -1), [
                        computeNextEntry(reducer, liftedAction.action, lastState.state, lastState.error, errorHandler),
                    ]);
                    minInvalidatedStateIndex = Infinity;
                    break;
                }
                // Auto-commit as new actions come in.
                if (options.maxAge && stagedActionIds.length === options.maxAge) {
                    commitExcessActions(1);
                }
                if (currentStateIndex === stagedActionIds.length - 1) {
                    currentStateIndex++;
                }
                var actionId = nextActionId++;
                // Mutation! This is the hottest path, and we optimize on purpose.
                // It is safe because we set a new key in a cache dictionary.
                actionsById[actionId] = liftedAction;
                stagedActionIds = __spread(stagedActionIds, [actionId]);
                // Optimization: we know that only the new action needs computing.
                minInvalidatedStateIndex = stagedActionIds.length - 1;
                break;
            }
            case DevtoolsActions.IMPORT_STATE: {
                // Completely replace everything.
                (_a = liftedAction.nextLiftedState, monitorState = _a.monitorState, actionsById = _a.actionsById, nextActionId = _a.nextActionId, stagedActionIds = _a.stagedActionIds, skippedActionIds = _a.skippedActionIds, committedState = _a.committedState, currentStateIndex = _a.currentStateIndex, computedStates = _a.computedStates, isLocked = _a.isLocked, 
                // prettier-ignore
                isPaused = _a.isPaused);
                break;
            }
            case INIT: {
                // Always recompute states on hot reload and init.
                minInvalidatedStateIndex = 0;
                if (options.maxAge && stagedActionIds.length > options.maxAge) {
                    // States must be recomputed before committing excess.
                    computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, errorHandler, isPaused);
                    commitExcessActions(stagedActionIds.length - options.maxAge);
                    // Avoid double computation.
                    minInvalidatedStateIndex = Infinity;
                }
                break;
            }
            case UPDATE: {
                var stateHasErrors = computedStates.filter(function (state) { return state.error; }).length > 0;
                if (stateHasErrors) {
                    // Recompute all states
                    minInvalidatedStateIndex = 0;
                    if (options.maxAge && stagedActionIds.length > options.maxAge) {
                        // States must be recomputed before committing excess.
                        computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, errorHandler, isPaused);
                        commitExcessActions(stagedActionIds.length - options.maxAge);
                        // Avoid double computation.
                        minInvalidatedStateIndex = Infinity;
                    }
                }
                else {
                    // If not paused/locked, add a new action to signal devtools-user
                    // that there was a reducer update.
                    if (!isPaused && !isLocked) {
                        if (currentStateIndex === stagedActionIds.length - 1) {
                            currentStateIndex++;
                        }
                        // Add a new action to only recompute state
                        var actionId = nextActionId++;
                        actionsById[actionId] = new PerformAction(liftedAction, +Date.now());
                        stagedActionIds = __spread(stagedActionIds, [actionId]);
                        minInvalidatedStateIndex = stagedActionIds.length - 1;
                        computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, errorHandler, isPaused);
                    }
                    // Recompute state history with latest reducer and update action
                    computedStates = computedStates.map(function (cmp) { return (__assign({}, cmp, { state: reducer(cmp.state, RECOMPUTE_ACTION) })); });
                    currentStateIndex = stagedActionIds.length - 1;
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
        computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, errorHandler, isPaused);
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
            isLocked: isLocked,
            isPaused: isPaused,
        };
    }; };
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkdWNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvc3RvcmUtZGV2dG9vbHMvc3JjL3JlZHVjZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLE9BQU8sRUFLTCxNQUFNLEVBQ04sSUFBSSxHQUNMLE1BQU0sYUFBYSxDQUFDO0FBQ3JCLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ2pELE9BQU8sS0FBSyxlQUFlLE1BQU0sV0FBVyxDQUFDO0FBRTdDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFhMUMsTUFBTSxDQUFDLElBQU0sV0FBVyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDO0FBRTFDLE1BQU0sQ0FBQyxJQUFNLFNBQVMsR0FBRyxnQ0FBb0UsQ0FBQztBQUM5RixNQUFNLENBQUMsSUFBTSxnQkFBZ0IsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQztBQTZCcEQ7O0dBRUc7QUFDSCxTQUFTLGdCQUFnQixDQUN2QixPQUFnQyxFQUNoQyxNQUFjLEVBQ2QsS0FBVSxFQUNWLEtBQVUsRUFDVixZQUEwQjtJQUUxQixJQUFJLEtBQUssRUFBRTtRQUNULE9BQU87WUFDTCxLQUFLLE9BQUE7WUFDTCxLQUFLLEVBQUUsc0NBQXNDO1NBQzlDLENBQUM7S0FDSDtJQUVELElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztJQUN0QixJQUFJLFNBQVMsQ0FBQztJQUNkLElBQUk7UUFDRixTQUFTLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztLQUNwQztJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osU0FBUyxHQUFHLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMzQixZQUFZLENBQUMsV0FBVyxDQUFDLEdB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LFFBQVEsVUFBQTtTQUNULENBQUM7SUFDSixDQUFDLEVBdlh5QyxDQXVYekMsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFcnJvckhhbmRsZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEFjdGlvbixcbiAgQWN0aW9uUmVkdWNlcixcbiAgQWN0aW9uc1N1YmplY3QsXG4gIFJlZHVjZXJNYW5hZ2VyLFxuICBVUERBVEUsXG4gIElOSVQsXG59IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IGRpZmZlcmVuY2UsIGxpZnRBY3Rpb24gfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCAqIGFzIERldnRvb2xzQWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHsgU3RvcmVEZXZ0b29sc0NvbmZpZywgU3RhdGVTYW5pdGl6ZXIgfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgeyBQZXJmb3JtQWN0aW9uIH0gZnJvbSAnLi9hY3Rpb25zJztcblxuZXhwb3J0IHR5cGUgSW5pdEFjdGlvbiA9IHtcbiAgcmVhZG9ubHkgdHlwZTogdHlwZW9mIElOSVQ7XG59O1xuXG5leHBvcnQgdHlwZSBVcGRhdGVSZWR1Y2VyQWN0aW9uID0ge1xuICByZWFkb25seSB0eXBlOiB0eXBlb2YgVVBEQVRFO1xufTtcblxuZXhwb3J0IHR5cGUgQ29yZUFjdGlvbnMgPSBJbml0QWN0aW9uIHwgVXBkYXRlUmVkdWNlckFjdGlvbjtcbmV4cG9ydCB0eXBlIEFjdGlvbnMgPSBEZXZ0b29sc0FjdGlvbnMuQWxsIHwgQ29yZUFjdGlvbnM7XG5cbmV4cG9ydCBjb25zdCBJTklUX0FDVElPTiA9IHsgdHlwZTogSU5JVCB9O1xuXG5leHBvcnQgY29uc3QgUkVDT01QVVRFID0gJ0BuZ3J4L3N0b3JlLWRldnRvb2xzL3JlY29tcHV0ZScgYXMgJ0BuZ3J4L3N0b3JlLWRldnRvb2xzL3JlY29tcHV0ZSc7XG5leHBvcnQgY29uc3QgUkVDT01QVVRFX0FDVElPTiA9IHsgdHlwZTogUkVDT01QVVRFIH07XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcHV0ZWRTdGF0ZSB7XG4gIHN0YXRlOiBhbnk7XG4gIGVycm9yOiBhbnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlmdGVkQWN0aW9uIHtcbiAgdHlwZTogc3RyaW5nO1xuICBhY3Rpb246IEFjdGlvbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMaWZ0ZWRBY3Rpb25zIHtcbiAgW2lkOiBudW1iZXJdOiBMaWZ0ZWRBY3Rpb247XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlmdGVkU3RhdGUge1xuICBtb25pdG9yU3RhdGU6IGFueTtcbiAgbmV4dEFjdGlvbklkOiBudW1iZXI7XG4gIGFjdGlvbnNCeUlkOiBMaWZ0ZWRBY3Rpb25zO1xuICBzdGFnZWRBY3Rpb25JZHM6IG51bWJlcltdO1xuICBza2lwcGVkQWN0aW9uSWRzOiBudW1iZXJbXTtcbiAgY29tbWl0dGVkU3RhdGU6IGFueTtcbiAgY3VycmVudFN0YXRlSW5kZXg6IG51bWJlcjtcbiAgY29tcHV0ZWRTdGF0ZXM6IENvbXB1dGVkU3RhdGVbXTtcbiAgaXNMb2NrZWQ6IGJvb2xlYW47XG4gIGlzUGF1c2VkOiBib29sZWFuO1xufVxuXG4vKipcbiAqIENvbXB1dGVzIHRoZSBuZXh0IGVudHJ5IGluIHRoZSBsb2cgYnkgYXBwbHlpbmcgYW4gYWN0aW9uLlxuICovXG5mdW5jdGlvbiBjb21wdXRlTmV4dEVudHJ5KFxuICByZWR1Y2VyOiBBY3Rpb25SZWR1Y2VyPGFueSwgYW55PixcbiAgYWN0aW9uOiBBY3Rpb24sXG4gIHN0YXRlOiBhbnksXG4gIGVycm9yOiBhbnksXG4gIGVycm9ySGFuZGxlcjogRXJyb3JIYW5kbGVyXG4pIHtcbiAgaWYgKGVycm9yKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXRlLFxuICAgICAgZXJyb3I6ICdJbnRlcnJ1cHRlZCBieSBhbiBlcnJvciB1cCB0aGUgY2hhaW4nLFxuICAgIH07XG4gIH1cblxuICBsZXQgbmV4dFN0YXRlID0gc3RhdGU7XG4gIGxldCBuZXh0RXJyb3I7XG4gIHRyeSB7XG4gICAgbmV4dFN0YXRlID0gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgbmV4dEVycm9yID0gZXJyLnRvU3RyaW5nKCk7XG4gICAgZXJyb3JIYW5kbGVyLmhhbmRsZUVycm9yKGVyci5zdGFjayB8fCBlcnIpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzdGF0ZTogbmV4dFN0YXRlLFxuICAgIGVycm9yOiBuZXh0RXJyb3IsXG4gIH07XG59XG5cbi8qKlxuICogUnVucyB0aGUgcmVkdWNlciBvbiBpbnZhbGlkYXRlZCBhY3Rpb25zIHRvIGdldCBhIGZyZXNoIGNvbXB1dGF0aW9uIGxvZy5cbiAqL1xuZnVuY3Rpb24gcmVjb21wdXRlU3RhdGVzKFxuICBjb21wdXRlZFN0YXRlczogQ29tcHV0ZWRTdGF0ZVtdLFxuICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXg6IG51bWJlcixcbiAgcmVkdWNlcjogQWN0aW9uUmVkdWNlcjxhbnksIGFueT4sXG4gIGNvbW1pdHRlZFN0YXRlOiBhbnksXG4gIGFjdGlvbnNCeUlkOiBMaWZ0ZWRBY3Rpb25zLFxuICBzdGFnZWRBY3Rpb25JZHM6IG51bWJlcltdLFxuICBza2lwcGVkQWN0aW9uSWRzOiBudW1iZXJbXSxcbiAgZXJyb3JIYW5kbGVyOiBFcnJvckhhbmRsZXIsXG4gIGlzUGF1c2VkOiBib29sZWFuXG4pIHtcbiAgLy8gT3B0aW1pemF0aW9uOiBleGl0IGVhcmx5IGFuZCByZXR1cm4gdGhlIHNhbWUgcmVmZXJlbmNlXG4gIC8vIGlmIHdlIGtub3cgbm90aGluZyBjb3VsZCBoYXZlIGNoYW5nZWQuXG4gIGlmIChcbiAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPj0gY29tcHV0ZWRTdGF0ZXMubGVuZ3RoICYmXG4gICAgY29tcHV0ZWRTdGF0ZXMubGVuZ3RoID09PSBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoXG4gICkge1xuICAgIHJldHVybiBjb21wdXRlZFN0YXRlcztcbiAgfVxuXG4gIGNvbnN0IG5leHRDb21wdXRlZFN0YXRlcyA9IGNvbXB1dGVkU3RhdGVzLnNsaWNlKDAsIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCk7XG4gIC8vIElmIHRoZSByZWNvcmRpbmcgaXMgcGF1c2VkLCByZWNvbXB1dGUgYWxsIHN0YXRlcyB1cCB1bnRpbCB0aGUgcGF1c2Ugc3RhdGUsXG4gIC8vIGVsc2UgcmVjb21wdXRlIGFsbCBzdGF0ZXMuXG4gIGNvbnN0IGxhc3RJbmNsdWRlZEFjdGlvbklkID0gc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIChpc1BhdXNlZCA/IDEgOiAwKTtcbiAgZm9yIChsZXQgaSA9IG1pbkludmFsaWRhdGVkU3RhdGVJbmRleDsgaSA8IGxhc3RJbmNsdWRlZEFjdGlvbklkOyBpKyspIHtcbiAgICBjb25zdCBhY3Rpb25JZCA9IHN0YWdlZEFjdGlvbklkc1tpXTtcbiAgICBjb25zdCBhY3Rpb24gPSBhY3Rpb25zQnlJZFthY3Rpb25JZF0uYWN0aW9uO1xuXG4gICAgY29uc3QgcHJldmlvdXNFbnRyeSA9IG5leHRDb21wdXRlZFN0YXRlc1tpIC0gMV07XG4gICAgY29uc3QgcHJldmlvdXNTdGF0ZSA9IHByZXZpb3VzRW50cnkgPyBwcmV2aW91c0VudHJ5LnN0YXRlIDogY29tbWl0dGVkU3RhdGU7XG4gICAgY29uc3QgcHJldmlvdXNFcnJvciA9IHByZXZpb3VzRW50cnkgPyBwcmV2aW91c0VudHJ5LmVycm9yIDogdW5kZWZpbmVkO1xuXG4gICAgY29uc3Qgc2hvdWxkU2tpcCA9IHNraXBwZWRBY3Rpb25JZHMuaW5kZXhPZihhY3Rpb25JZCkgPiAtMTtcbiAgICBjb25zdCBlbnRyeTogQ29tcHV0ZWRTdGF0ZSA9IHNob3VsZFNraXBcbiAgICAgID8gcHJldmlvdXNFbnRyeVxuICAgICAgOiBjb21wdXRlTmV4dEVudHJ5KFxuICAgICAgICAgIHJlZHVjZXIsXG4gICAgICAgICAgYWN0aW9uLFxuICAgICAgICAgIHByZXZpb3VzU3RhdGUsXG4gICAgICAgICAgcHJldmlvdXNFcnJvcixcbiAgICAgICAgICBlcnJvckhhbmRsZXJcbiAgICAgICAgKTtcblxuICAgIG5leHRDb21wdXRlZFN0YXRlcy5wdXNoKGVudHJ5KTtcbiAgfVxuICAvLyBJZiB0aGUgcmVjb3JkaW5nIGlzIHBhdXNlZCwgdGhlIGxhc3Qgc3RhdGUgd2lsbCBub3QgYmUgcmVjb21wdXRlZCxcbiAgLy8gYmVjYXVzZSBpdCdzIGVzc2VudGlhbGx5IG5vdCBwYXJ0IG9mIHRoZSBzdGF0ZSBoaXN0b3J5LlxuICBpZiAoaXNQYXVzZWQpIHtcbiAgICBuZXh0Q29tcHV0ZWRTdGF0ZXMucHVzaChjb21wdXRlZFN0YXRlc1tjb21wdXRlZFN0YXRlcy5sZW5ndGggLSAxXSk7XG4gIH1cblxuICByZXR1cm4gbmV4dENvbXB1dGVkU3RhdGVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGlmdEluaXRpYWxTdGF0ZShcbiAgaW5pdGlhbENvbW1pdHRlZFN0YXRlPzogYW55LFxuICBtb25pdG9yUmVkdWNlcj86IGFueVxuKTogTGlmdGVkU3RhdGUge1xuICByZXR1cm4ge1xuICAgIG1vbml0b3JTdGF0ZTogbW9uaXRvclJlZHVjZXIodW5kZWZpbmVkLCB7fSksXG4gICAgbmV4dEFjdGlvbklkOiAxLFxuICAgIGFjdGlvbnNCeUlkOiB7IDA6IGxpZnRBY3Rpb24oSU5JVF9BQ1RJT04pIH0sXG4gICAgc3RhZ2VkQWN0aW9uSWRzOiBbMF0sXG4gICAgc2tpcHBlZEFjdGlvbklkczogW10sXG4gICAgY29tbWl0dGVkU3RhdGU6IGluaXRpYWxDb21taXR0ZWRTdGF0ZSxcbiAgICBjdXJyZW50U3RhdGVJbmRleDogMCxcbiAgICBjb21wdXRlZFN0YXRlczogW10sXG4gICAgaXNMb2NrZWQ6IGZhbHNlLFxuICAgIGlzUGF1c2VkOiBmYWxzZSxcbiAgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgaGlzdG9yeSBzdGF0ZSByZWR1Y2VyIGZyb20gYW4gYXBwJ3MgcmVkdWNlci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxpZnRSZWR1Y2VyV2l0aChcbiAgaW5pdGlhbENvbW1pdHRlZFN0YXRlOiBhbnksXG4gIGluaXRpYWxMaWZ0ZWRTdGF0ZTogTGlmdGVkU3RhdGUsXG4gIGVycm9ySGFuZGxlcjogRXJyb3JIYW5kbGVyLFxuICBtb25pdG9yUmVkdWNlcj86IGFueSxcbiAgb3B0aW9uczogUGFydGlhbDxTdG9yZURldnRvb2xzQ29uZmlnPiA9IHt9XG4pIHtcbiAgLyoqXG4gICAqIE1hbmFnZXMgaG93IHRoZSBoaXN0b3J5IGFjdGlvbnMgbW9kaWZ5IHRoZSBoaXN0b3J5IHN0YXRlLlxuICAgKi9cbiAgcmV0dXJuIChcbiAgICByZWR1Y2VyOiBBY3Rpb25SZWR1Y2VyPGFueSwgYW55PlxuICApOiBBY3Rpb25SZWR1Y2VyPExpZnRlZFN0YXRlLCBBY3Rpb25zPiA9PiAobGlmdGVkU3RhdGUsIGxpZnRlZEFjdGlvbikgPT4ge1xuICAgIGxldCB7XG4gICAgICBtb25pdG9yU3RhdGUsXG4gICAgICBhY3Rpb25zQnlJZCxcbiAgICAgIG5leHRBY3Rpb25JZCxcbiAgICAgIHN0YWdlZEFjdGlvbklkcyxcbiAgICAgIHNraXBwZWRBY3Rpb25JZHMsXG4gICAgICBjb21taXR0ZWRTdGF0ZSxcbiAgICAgIGN1cnJlbnRTdGF0ZUluZGV4LFxuICAgICAgY29tcHV0ZWRTdGF0ZXMsXG4gICAgICBpc0xvY2tlZCxcbiAgICAgIGlzUGF1c2VkLFxuICAgIH0gPVxuICAgICAgbGlmdGVkU3RhdGUgfHwgaW5pdGlhbExpZnRlZFN0YXRlO1xuXG4gICAgaWYgKCFsaWZ0ZWRTdGF0ZSkge1xuICAgICAgLy8gUHJldmVudCBtdXRhdGluZyBpbml0aWFsTGlmdGVkU3RhdGVcbiAgICAgIGFjdGlvbnNCeUlkID0gT2JqZWN0LmNyZWF0ZShhY3Rpb25zQnlJZCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tbWl0RXhjZXNzQWN0aW9ucyhuOiBudW1iZXIpIHtcbiAgICAgIC8vIEF1dG8tY29tbWl0cyBuLW51bWJlciBvZiBleGNlc3MgYWN0aW9ucy5cbiAgICAgIGxldCBleGNlc3MgPSBuO1xuICAgICAgbGV0IGlkc1RvRGVsZXRlID0gc3RhZ2VkQWN0aW9uSWRzLnNsaWNlKDEsIGV4Y2VzcyArIDEpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlkc1RvRGVsZXRlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChjb21wdXRlZFN0YXRlc1tpICsgMV0uZXJyb3IpIHtcbiAgICAgICAgICAvLyBTdG9wIGlmIGVycm9yIGlzIGZvdW5kLiBDb21taXQgYWN0aW9ucyB1cCB0byBlcnJvci5cbiAgICAgICAgICBleGNlc3MgPSBpO1xuICAgICAgICAgIGlkc1RvRGVsZXRlID0gc3RhZ2VkQWN0aW9uSWRzLnNsaWNlKDEsIGV4Y2VzcyArIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlbGV0ZSBhY3Rpb25zQnlJZFtpZHNUb0RlbGV0ZVtpXV07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc2tpcHBlZEFjdGlvbklkcyA9IHNraXBwZWRBY3Rpb25JZHMuZmlsdGVyKFxuICAgICAgICBpZCA9PiBpZHNUb0RlbGV0ZS5pbmRleE9mKGlkKSA9PT0gLTFcbiAgICAgICk7XG4gICAgICBzdGFnZWRBY3Rpb25JZHMgPSBbMCwgLi4uc3RhZ2VkQWN0aW9uSWRzLnNsaWNlKGV4Y2VzcyArIDEpXTtcbiAgICAgIGNvbW1pdHRlZFN0YXRlID0gY29tcHV0ZWRTdGF0ZXNbZXhjZXNzXS5zdGF0ZTtcbiAgICAgIGNvbXB1dGVkU3RhdGVzID0gY29tcHV0ZWRTdGF0ZXMuc2xpY2UoZXhjZXNzKTtcbiAgICAgIGN1cnJlbnRTdGF0ZUluZGV4ID1cbiAgICAgICAgY3VycmVudFN0YXRlSW5kZXggPiBleGNlc3MgPyBjdXJyZW50U3RhdGVJbmRleCAtIGV4Y2VzcyA6IDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tbWl0Q2hhbmdlcygpIHtcbiAgICAgIC8vIENvbnNpZGVyIHRoZSBsYXN0IGNvbW1pdHRlZCBzdGF0ZSB0aGUgbmV3IHN0YXJ0aW5nIHBvaW50LlxuICAgICAgLy8gU3F1YXNoIGFueSBzdGFnZWQgYWN0aW9ucyBpbnRvIGEgc2luZ2xlIGNvbW1pdHRlZCBzdGF0ZS5cbiAgICAgIGFjdGlvbnNCeUlkID0geyAwOiBsaWZ0QWN0aW9uKElOSVRfQUNUSU9OKSB9O1xuICAgICAgbmV4dEFjdGlvbklkID0gMTtcbiAgICAgIHN0YWdlZEFjdGlvbklkcyA9IFswXTtcbiAgICAgIHNraXBwZWRBY3Rpb25JZHMgPSBbXTtcbiAgICAgIGNvbW1pdHRlZFN0YXRlID0gY29tcHV0ZWRTdGF0ZXNbY3VycmVudFN0YXRlSW5kZXhdLnN0YXRlO1xuICAgICAgY3VycmVudFN0YXRlSW5kZXggPSAwO1xuICAgICAgY29tcHV0ZWRTdGF0ZXMgPSBbXTtcbiAgICB9XG5cbiAgICAvLyBCeSBkZWZhdWx0LCBhZ2dyZXNzaXZlbHkgcmVjb21wdXRlIGV2ZXJ5IHN0YXRlIHdoYXRldmVyIGhhcHBlbnMuXG4gICAgLy8gVGhpcyBoYXMgTyhuKSBwZXJmb3JtYW5jZSwgc28gd2UnbGwgb3ZlcnJpZGUgdGhpcyB0byBhIHNlbnNpYmxlXG4gICAgLy8gdmFsdWUgd2hlbmV2ZXIgd2UgZmVlbCBsaWtlIHdlIGRvbid0IGhhdmUgdG8gcmVjb21wdXRlIHRoZSBzdGF0ZXMuXG4gICAgbGV0IG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IDA7XG5cbiAgICBzd2l0Y2ggKGxpZnRlZEFjdGlvbi50eXBlKSB7XG4gICAgICBjYXNlIERldnRvb2xzQWN0aW9ucy5MT0NLX0NIQU5HRVM6IHtcbiAgICAgICAgaXNMb2NrZWQgPSBsaWZ0ZWRBY3Rpb24uc3RhdHVzO1xuICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBJbmZpbml0eTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIERldnRvb2xzQWN0aW9ucy5QQVVTRV9SRUNPUkRJTkc6IHtcbiAgICAgICAgaXNQYXVzZWQgPSBsaWZ0ZWRBY3Rpb24uc3RhdHVzO1xuICAgICAgICBpZiAoaXNQYXVzZWQpIHtcbiAgICAgICAgICAvLyBBZGQgYSBwYXVzZSBhY3Rpb24gdG8gc2lnbmFsIHRoZSBkZXZ0b29scy11c2VyIHRoZSByZWNvcmRpbmcgaXMgcGF1c2VkLlxuICAgICAgICAgIC8vIFRoZSBjb3JyZXNwb25kaW5nIHN0YXRlIHdpbGwgYmUgb3ZlcndyaXR0ZW4gb24gZWFjaCB1cGRhdGUgdG8gYWx3YXlzIGNvbnRhaW5cbiAgICAgICAgICAvLyB0aGUgbGF0ZXN0IHN0YXRlIChzZWUgQWN0aW9ucy5QRVJGT1JNX0FDVElPTikuXG4gICAgICAgICAgc3RhZ2VkQWN0aW9uSWRzID0gWy4uLnN0YWdlZEFjdGlvbklkcywgbmV4dEFjdGlvbklkXTtcbiAgICAgICAgICBhY3Rpb25zQnlJZFtuZXh0QWN0aW9uSWRdID0gbmV3IFBlcmZvcm1BY3Rpb24oXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHR5cGU6ICdAbmdyeC9kZXZ0b29scy9wYXVzZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgK0RhdGUubm93KClcbiAgICAgICAgICApO1xuICAgICAgICAgIG5leHRBY3Rpb25JZCsrO1xuICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSAxO1xuICAgICAgICAgIGNvbXB1dGVkU3RhdGVzID0gY29tcHV0ZWRTdGF0ZXMuY29uY2F0KFxuICAgICAgICAgICAgY29tcHV0ZWRTdGF0ZXNbY29tcHV0ZWRTdGF0ZXMubGVuZ3RoIC0gMV1cbiAgICAgICAgICApO1xuXG4gICAgICAgICAgaWYgKGN1cnJlbnRTdGF0ZUluZGV4ID09PSBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gMikge1xuICAgICAgICAgICAgY3VycmVudFN0YXRlSW5kZXgrKztcbiAgICAgICAgICB9XG4gICAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gSW5maW5pdHk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29tbWl0Q2hhbmdlcygpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuUkVTRVQ6IHtcbiAgICAgICAgLy8gR2V0IGJhY2sgdG8gdGhlIHN0YXRlIHRoZSBzdG9yZSB3YXMgY3JlYXRlZCB3aXRoLlxuICAgICAgICBhY3Rpb25zQnlJZCA9IHsgMDogbGlmdEFjdGlvbihJTklUX0FDVElPTikgfTtcbiAgICAgICAgbmV4dEFjdGlvbklkID0gMTtcbiAgICAgICAgc3RhZ2VkQWN0aW9uSWRzID0gWzBdO1xuICAgICAgICBza2lwcGVkQWN0aW9uSWRzID0gW107XG4gICAgICAgIGNvbW1pdHRlZFN0YXRlID0gaW5pdGlhbENvbW1pdHRlZFN0YXRlO1xuICAgICAgICBjdXJyZW50U3RhdGVJbmRleCA9IDA7XG4gICAgICAgIGNvbXB1dGVkU3RhdGVzID0gW107XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuQ09NTUlUOiB7XG4gICAgICAgIGNvbW1pdENoYW5nZXMoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIERldnRvb2xzQWN0aW9ucy5ST0xMQkFDSzoge1xuICAgICAgICAvLyBGb3JnZXQgYWJvdXQgYW55IHN0YWdlZCBhY3Rpb25zLlxuICAgICAgICAvLyBTdGFydCBhZ2FpbiBmcm9tIHRoZSBsYXN0IGNvbW1pdHRlZCBzdGF0ZS5cbiAgICAgICAgYWN0aW9uc0J5SWQgPSB7IDA6IGxpZnRBY3Rpb24oSU5JVF9BQ1RJT04pIH07XG4gICAgICAgIG5leHRBY3Rpb25JZCA9IDE7XG4gICAgICAgIHN0YWdlZEFjdGlvbklkcyA9IFswXTtcbiAgICAgICAgc2tpcHBlZEFjdGlvbklkcyA9IFtdO1xuICAgICAgICBjdXJyZW50U3RhdGVJbmRleCA9IDA7XG4gICAgICAgIGNvbXB1dGVkU3RhdGVzID0gW107XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuVE9HR0xFX0FDVElPTjoge1xuICAgICAgICAvLyBUb2dnbGUgd2hldGhlciBhbiBhY3Rpb24gd2l0aCBnaXZlbiBJRCBpcyBza2lwcGVkLlxuICAgICAgICAvLyBCZWluZyBza2lwcGVkIG1lYW5zIGl0IGlzIGEgbm8tb3AgZHVyaW5nIHRoZSBjb21wdXRhdGlvbi5cbiAgICAgICAgY29uc3QgeyBpZDogYWN0aW9uSWQgfSA9IGxpZnRlZEFjdGlvbjtcbiAgICAgICAgY29uc3QgaW5kZXggPSBza2lwcGVkQWN0aW9uSWRzLmluZGV4T2YoYWN0aW9uSWQpO1xuICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgc2tpcHBlZEFjdGlvbklkcyA9IFthY3Rpb25JZCwgLi4uc2tpcHBlZEFjdGlvbklkc107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2tpcHBlZEFjdGlvbklkcyA9IHNraXBwZWRBY3Rpb25JZHMuZmlsdGVyKGlkID0+IGlkICE9PSBhY3Rpb25JZCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gT3B0aW1pemF0aW9uOiB3ZSBrbm93IGhpc3RvcnkgYmVmb3JlIHRoaXMgYWN0aW9uIGhhc24ndCBjaGFuZ2VkXG4gICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IHN0YWdlZEFjdGlvbklkcy5pbmRleE9mKGFjdGlvbklkKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIERldnRvb2xzQWN0aW9ucy5TRVRfQUNUSU9OU19BQ1RJVkU6IHtcbiAgICAgICAgLy8gVG9nZ2xlIHdoZXRoZXIgYW4gYWN0aW9uIHdpdGggZ2l2ZW4gSUQgaXMgc2tpcHBlZC5cbiAgICAgICAgLy8gQmVpbmcgc2tpcHBlZCBtZWFucyBpdCBpcyBhIG5vLW9wIGR1cmluZyB0aGUgY29tcHV0YXRpb24uXG4gICAgICAgIGNvbnN0IHsgc3RhcnQsIGVuZCwgYWN0aXZlIH0gPSBsaWZ0ZWRBY3Rpb247XG4gICAgICAgIGNvbnN0IGFjdGlvbklkcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykgYWN0aW9uSWRzLnB1c2goaSk7XG4gICAgICAgIGlmIChhY3RpdmUpIHtcbiAgICAgICAgICBza2lwcGVkQWN0aW9uSWRzID0gZGlmZmVyZW5jZShza2lwcGVkQWN0aW9uSWRzLCBhY3Rpb25JZHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNraXBwZWRBY3Rpb25JZHMgPSBbLi4uc2tpcHBlZEFjdGlvbklkcywgLi4uYWN0aW9uSWRzXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE9wdGltaXphdGlvbjogd2Uga25vdyBoaXN0b3J5IGJlZm9yZSB0aGlzIGFjdGlvbiBoYXNuJ3QgY2hhbmdlZFxuICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBzdGFnZWRBY3Rpb25JZHMuaW5kZXhPZihzdGFydCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuSlVNUF9UT19TVEFURToge1xuICAgICAgICAvLyBXaXRob3V0IHJlY29tcHV0aW5nIGFueXRoaW5nLCBtb3ZlIHRoZSBwb2ludGVyIHRoYXQgdGVsbCB1c1xuICAgICAgICAvLyB3aGljaCBzdGF0ZSBpcyBjb25zaWRlcmVkIHRoZSBjdXJyZW50IG9uZS4gVXNlZnVsIGZvciBzbGlkZXJzLlxuICAgICAgICBjdXJyZW50U3RhdGVJbmRleCA9IGxpZnRlZEFjdGlvbi5pbmRleDtcbiAgICAgICAgLy8gT3B0aW1pemF0aW9uOiB3ZSBrbm93IHRoZSBoaXN0b3J5IGhhcyBub3QgY2hhbmdlZC5cbiAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gSW5maW5pdHk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuSlVNUF9UT19BQ1RJT046IHtcbiAgICAgICAgLy8gSnVtcHMgdG8gYSBjb3JyZXNwb25kaW5nIHN0YXRlIHRvIGEgc3BlY2lmaWMgYWN0aW9uLlxuICAgICAgICAvLyBVc2VmdWwgd2hlbiBmaWx0ZXJpbmcgYWN0aW9ucy5cbiAgICAgICAgY29uc3QgaW5kZXggPSBzdGFnZWRBY3Rpb25JZHMuaW5kZXhPZihsaWZ0ZWRBY3Rpb24uYWN0aW9uSWQpO1xuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSBjdXJyZW50U3RhdGVJbmRleCA9IGluZGV4O1xuICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBJbmZpbml0eTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIERldnRvb2xzQWN0aW9ucy5TV0VFUDoge1xuICAgICAgICAvLyBGb3JnZXQgYW55IGFjdGlvbnMgdGhhdCBhcmUgY3VycmVudGx5IGJlaW5nIHNraXBwZWQuXG4gICAgICAgIHN0YWdlZEFjdGlvbklkcyA9IGRpZmZlcmVuY2Uoc3RhZ2VkQWN0aW9uSWRzLCBza2lwcGVkQWN0aW9uSWRzKTtcbiAgICAgICAgc2tpcHBlZEFjdGlvbklkcyA9IFtdO1xuICAgICAgICBjdXJyZW50U3RhdGVJbmRleCA9IE1hdGgubWluKFxuICAgICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4LFxuICAgICAgICAgIHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSAxXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuUEVSRk9STV9BQ1RJT046IHtcbiAgICAgICAgLy8gSWdub3JlIGFjdGlvbiBhbmQgcmV0dXJuIHN0YXRlIGFzIGlzIGlmIHJlY29yZGluZyBpcyBsb2NrZWRcbiAgICAgICAgaWYgKGlzTG9ja2VkKSB7XG4gICAgICAgICAgcmV0dXJuIGxpZnRlZFN0YXRlIHx8IGluaXRpYWxMaWZ0ZWRTdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc1BhdXNlZCkge1xuICAgICAgICAgIC8vIElmIHJlY29yZGluZyBpcyBwYXVzZWQsIG92ZXJ3cml0ZSB0aGUgbGFzdCBzdGF0ZVxuICAgICAgICAgIC8vIChjb3JyZXNwb25kcyB0byB0aGUgcGF1c2UgYWN0aW9uKSBhbmQga2VlcCBldmVyeXRoaW5nIGVsc2UgYXMgaXMuXG4gICAgICAgICAgLy8gVGhpcyB3YXksIHRoZSBhcHAgZ2V0cyB0aGUgbmV3IGN1cnJlbnQgc3RhdGUgd2hpbGUgdGhlIGRldnRvb2xzXG4gICAgICAgICAgLy8gZG8gbm90IHJlY29yZCBhbm90aGVyIGFjdGlvbi5cbiAgICAgICAgICBjb25zdCBsYXN0U3RhdGUgPSBjb21wdXRlZFN0YXRlc1tjb21wdXRlZFN0YXRlcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICBjb21wdXRlZFN0YXRlcyA9IFtcbiAgICAgICAgICAgIC4uLmNvbXB1dGVkU3RhdGVzLnNsaWNlKDAsIC0xKSxcbiAgICAgICAgICAgIGNvbXB1dGVOZXh0RW50cnkoXG4gICAgICAgICAgICAgIHJlZHVjZXIsXG4gICAgICAgICAgICAgIGxpZnRlZEFjdGlvbi5hY3Rpb24sXG4gICAgICAgICAgICAgIGxhc3RTdGF0ZS5zdGF0ZSxcbiAgICAgICAgICAgICAgbGFzdFN0YXRlLmVycm9yLFxuICAgICAgICAgICAgICBlcnJvckhhbmRsZXJcbiAgICAgICAgICAgICksXG4gICAgICAgICAgXTtcbiAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBJbmZpbml0eTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEF1dG8tY29tbWl0IGFzIG5ldyBhY3Rpb25zIGNvbWUgaW4uXG4gICAgICAgIGlmIChvcHRpb25zLm1heEFnZSAmJiBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoID09PSBvcHRpb25zLm1heEFnZSkge1xuICAgICAgICAgIGNvbW1pdEV4Y2Vzc0FjdGlvbnMoMSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3VycmVudFN0YXRlSW5kZXggPT09IHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgY3VycmVudFN0YXRlSW5kZXgrKztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhY3Rpb25JZCA9IG5leHRBY3Rpb25JZCsrO1xuICAgICAgICAvLyBNdXRhdGlvbiEgVGhpcyBpcyB0aGUgaG90dGVzdCBwYXRoLCBhbmQgd2Ugb3B0aW1pemUgb24gcHVycG9zZS5cbiAgICAgICAgLy8gSXQgaXMgc2FmZSBiZWNhdXNlIHdlIHNldCBhIG5ldyBrZXkgaW4gYSBjYWNoZSBkaWN0aW9uYXJ5LlxuICAgICAgICBhY3Rpb25zQnlJZFthY3Rpb25JZF0gPSBsaWZ0ZWRBY3Rpb247XG5cbiAgICAgICAgc3RhZ2VkQWN0aW9uSWRzID0gWy4uLnN0YWdlZEFjdGlvbklkcywgYWN0aW9uSWRdO1xuICAgICAgICAvLyBPcHRpbWl6YXRpb246IHdlIGtub3cgdGhhdCBvbmx5IHRoZSBuZXcgYWN0aW9uIG5lZWRzIGNvbXB1dGluZy5cbiAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIDE7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuSU1QT1JUX1NUQVRFOiB7XG4gICAgICAgIC8vIENvbXBsZXRlbHkgcmVwbGFjZSBldmVyeXRoaW5nLlxuICAgICAgICAoe1xuICAgICAgICAgIG1vbml0b3JTdGF0ZSxcbiAgICAgICAgICBhY3Rpb25zQnlJZCxcbiAgICAgICAgICBuZXh0QWN0aW9uSWQsXG4gICAgICAgICAgc3RhZ2VkQWN0aW9uSWRzLFxuICAgICAgICAgIHNraXBwZWRBY3Rpb25JZHMsXG4gICAgICAgICAgY29tbWl0dGVkU3RhdGUsXG4gICAgICAgICAgY3VycmVudFN0YXRlSW5kZXgsXG4gICAgICAgICAgY29tcHV0ZWRTdGF0ZXMsXG4gICAgICAgICAgaXNMb2NrZWQsXG4gICAgICAgICAgLy8gcHJldHRpZXItaWdub3JlXG4gICAgICAgICAgaXNQYXVzZWRcbiAgICAgICAgfSA9IGxpZnRlZEFjdGlvbi5uZXh0TGlmdGVkU3RhdGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgSU5JVDoge1xuICAgICAgICAvLyBBbHdheXMgcmVjb21wdXRlIHN0YXRlcyBvbiBob3QgcmVsb2FkIGFuZCBpbml0LlxuICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSAwO1xuXG4gICAgICAgIGlmIChvcHRpb25zLm1heEFnZSAmJiBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoID4gb3B0aW9ucy5tYXhBZ2UpIHtcbiAgICAgICAgICAvLyBTdGF0ZXMgbXVzdCBiZSByZWNvbXB1dGVkIGJlZm9yZSBjb21taXR0aW5nIGV4Y2Vzcy5cbiAgICAgICAgICBjb21wdXRlZFN0YXRlcyA9IHJlY29tcHV0ZVN0YXRlcyhcbiAgICAgICAgICAgIGNvbXB1dGVkU3RhdGVzLFxuICAgICAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4LFxuICAgICAgICAgICAgcmVkdWNlcixcbiAgICAgICAgICAgIGNvbW1pdHRlZFN0YXRlLFxuICAgICAgICAgICAgYWN0aW9uc0J5SWQsXG4gICAgICAgICAgICBzdGFnZWRBY3Rpb25JZHMsXG4gICAgICAgICAgICBza2lwcGVkQWN0aW9uSWRzLFxuICAgICAgICAgICAgZXJyb3JIYW5kbGVyLFxuICAgICAgICAgICAgaXNQYXVzZWRcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgY29tbWl0RXhjZXNzQWN0aW9ucyhzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gb3B0aW9ucy5tYXhBZ2UpO1xuXG4gICAgICAgICAgLy8gQXZvaWQgZG91YmxlIGNvbXB1dGF0aW9uLlxuICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IEluZmluaXR5O1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIFVQREFURToge1xuICAgICAgICBjb25zdCBzdGF0ZUhhc0Vycm9ycyA9XG4gICAgICAgICAgY29tcHV0ZWRTdGF0ZXMuZmlsdGVyKHN0YXRlID0+IHN0YXRlLmVycm9yKS5sZW5ndGggPiAwO1xuXG4gICAgICAgIGlmIChzdGF0ZUhhc0Vycm9ycykge1xuICAgICAgICAgIC8vIFJlY29tcHV0ZSBhbGwgc3RhdGVzXG4gICAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gMDtcblxuICAgICAgICAgIGlmIChvcHRpb25zLm1heEFnZSAmJiBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoID4gb3B0aW9ucy5tYXhBZ2UpIHtcbiAgICAgICAgICAgIC8vIFN0YXRlcyBtdXN0IGJlIHJlY29tcHV0ZWQgYmVmb3JlIGNvbW1pdHRpbmcgZXhjZXNzLlxuICAgICAgICAgICAgY29tcHV0ZWRTdGF0ZXMgPSByZWNvbXB1dGVTdGF0ZXMoXG4gICAgICAgICAgICAgIGNvbXB1dGVkU3RhdGVzLFxuICAgICAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXgsXG4gICAgICAgICAgICAgIHJlZHVjZXIsXG4gICAgICAgICAgICAgIGNvbW1pdHRlZFN0YXRlLFxuICAgICAgICAgICAgICBhY3Rpb25zQnlJZCxcbiAgICAgICAgICAgICAgc3RhZ2VkQWN0aW9uSWRzLFxuICAgICAgICAgICAgICBza2lwcGVkQWN0aW9uSWRzLFxuICAgICAgICAgICAgICBlcnJvckhhbmRsZXIsXG4gICAgICAgICAgICAgIGlzUGF1c2VkXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb21taXRFeGNlc3NBY3Rpb25zKHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSBvcHRpb25zLm1heEFnZSk7XG5cbiAgICAgICAgICAgIC8vIEF2b2lkIGRvdWJsZSBjb21wdXRhdGlvbi5cbiAgICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IEluZmluaXR5O1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBJZiBub3QgcGF1c2VkL2xvY2tlZCwgYWRkIGEgbmV3IGFjdGlvbiB0byBzaWduYWwgZGV2dG9vbHMtdXNlclxuICAgICAgICAgIC8vIHRoYXQgdGhlcmUgd2FzIGEgcmVkdWNlciB1cGRhdGUuXG4gICAgICAgICAgaWYgKCFpc1BhdXNlZCAmJiAhaXNMb2NrZWQpIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50U3RhdGVJbmRleCA9PT0gc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgY3VycmVudFN0YXRlSW5kZXgrKztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQWRkIGEgbmV3IGFjdGlvbiB0byBvbmx5IHJlY29tcHV0ZSBzdGF0ZVxuICAgICAgICAgICAgY29uc3QgYWN0aW9uSWQgPSBuZXh0QWN0aW9uSWQrKztcbiAgICAgICAgICAgIGFjdGlvbnNCeUlkW2FjdGlvbklkXSA9IG5ldyBQZXJmb3JtQWN0aW9uKFxuICAgICAgICAgICAgICBsaWZ0ZWRBY3Rpb24sXG4gICAgICAgICAgICAgICtEYXRlLm5vdygpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgc3RhZ2VkQWN0aW9uSWRzID0gWy4uLnN0YWdlZEFjdGlvbklkcywgYWN0aW9uSWRdO1xuXG4gICAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gMTtcblxuICAgICAgICAgICAgY29tcHV0ZWRTdGF0ZXMgPSByZWNvbXB1dGVTdGF0ZXMoXG4gICAgICAgICAgICAgIGNvbXB1dGVkU3RhdGVzLFxuICAgICAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXgsXG4gICAgICAgICAgICAgIHJlZHVjZXIsXG4gICAgICAgICAgICAgIGNvbW1pdHRlZFN0YXRlLFxuICAgICAgICAgICAgICBhY3Rpb25zQnlJZCxcbiAgICAgICAgICAgICAgc3RhZ2VkQWN0aW9uSWRzLFxuICAgICAgICAgICAgICBza2lwcGVkQWN0aW9uSWRzLFxuICAgICAgICAgICAgICBlcnJvckhhbmRsZXIsXG4gICAgICAgICAgICAgIGlzUGF1c2VkXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFJlY29tcHV0ZSBzdGF0ZSBoaXN0b3J5IHdpdGggbGF0ZXN0IHJlZHVjZXIgYW5kIHVwZGF0ZSBhY3Rpb25cbiAgICAgICAgICBjb21wdXRlZFN0YXRlcyA9IGNvbXB1dGVkU3RhdGVzLm1hcChjbXAgPT4gKHtcbiAgICAgICAgICAgIC4uLmNtcCxcbiAgICAgICAgICAgIHN0YXRlOiByZWR1Y2VyKGNtcC5zdGF0ZSwgUkVDT01QVVRFX0FDVElPTiksXG4gICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgY3VycmVudFN0YXRlSW5kZXggPSBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gMTtcblxuICAgICAgICAgIGlmIChvcHRpb25zLm1heEFnZSAmJiBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoID4gb3B0aW9ucy5tYXhBZ2UpIHtcbiAgICAgICAgICAgIGNvbW1pdEV4Y2Vzc0FjdGlvbnMoc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIG9wdGlvbnMubWF4QWdlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBBdm9pZCBkb3VibGUgY29tcHV0YXRpb24uXG4gICAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gSW5maW5pdHk7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgLy8gSWYgdGhlIGFjdGlvbiBpcyBub3QgcmVjb2duaXplZCwgaXQncyBhIG1vbml0b3IgYWN0aW9uLlxuICAgICAgICAvLyBPcHRpbWl6YXRpb246IGEgbW9uaXRvciBhY3Rpb24gY2FuJ3QgY2hhbmdlIGhpc3RvcnkuXG4gICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IEluZmluaXR5O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb21wdXRlZFN0YXRlcyA9IHJlY29tcHV0ZVN0YXRlcyhcbiAgICAgIGNvbXB1dGVkU3RhdGVzLFxuICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4LFxuICAgICAgcmVkdWNlcixcbiAgICAgIGNvbW1pdHRlZFN0YXRlLFxuICAgICAgYWN0aW9uc0J5SWQsXG4gICAgICBzdGFnZWRBY3Rpb25JZHMsXG4gICAgICBza2lwcGVkQWN0aW9uSWRzLFxuICAgICAgZXJyb3JIYW5kbGVyLFxuICAgICAgaXNQYXVzZWRcbiAgICApO1xuICAgIG1vbml0b3JTdGF0ZSA9IG1vbml0b3JSZWR1Y2VyKG1vbml0b3JTdGF0ZSwgbGlmdGVkQWN0aW9uKTtcblxuICAgIHJldHVybiB7XG4gICAgICBtb25pdG9yU3RhdGUsXG4gICAgICBhY3Rpb25zQnlJZCxcbiAgICAgIG5leHRBY3Rpb25JZCxcbiAgICAgIHN0YWdlZEFjdGlvbklkcyxcbiAgICAgIHNraXBwZWRBY3Rpb25JZHMsXG4gICAgICBjb21taXR0ZWRTdGF0ZSxcbiAgICAgIGN1cnJlbnRTdGF0ZUluZGV4LFxuICAgICAgY29tcHV0ZWRTdGF0ZXMsXG4gICAgICBpc0xvY2tlZCxcbiAgICAgIGlzUGF1c2VkLFxuICAgIH07XG4gIH07XG59XG4iXX0=