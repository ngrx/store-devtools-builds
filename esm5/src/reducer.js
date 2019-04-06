import * as tslib_1 from "tslib";
import { UPDATE, INIT, } from '@ngrx/store';
import { difference, liftAction, isActionFiltered } from './utils';
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
            stagedActionIds = tslib_1.__spread([0], stagedActionIds.slice(excess + 1));
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
                    stagedActionIds = tslib_1.__spread(stagedActionIds, [nextActionId]);
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
                    skippedActionIds = tslib_1.__spread([actionId_1], skippedActionIds);
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
                    skippedActionIds = tslib_1.__spread(skippedActionIds, actionIds);
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
                if (isPaused ||
                    (liftedState &&
                        isActionFiltered(liftedState.computedStates[currentStateIndex], liftedAction, options.predicate, options.actionsSafelist, options.actionsBlocklist))) {
                    // If recording is paused or if the action should be ignored, overwrite the last state
                    // (corresponds to the pause action) and keep everything else as is.
                    // This way, the app gets the new current state while the devtools
                    // do not record another action.
                    var lastState = computedStates[computedStates.length - 1];
                    computedStates = tslib_1.__spread(computedStates.slice(0, -1), [
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
                stagedActionIds = tslib_1.__spread(stagedActionIds, [actionId]);
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
                        stagedActionIds = tslib_1.__spread(stagedActionIds, [actionId]);
                        minInvalidatedStateIndex = stagedActionIds.length - 1;
                        computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, errorHandler, isPaused);
                    }
                    // Recompute state history with latest reducer and update action
                    computedStates = computedStates.map(function (cmp) { return (tslib_1.__assign({}, cmp, { state: reducer(cmp.state, RECOMPUTE_ACTION) })); });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkdWNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvc3RvcmUtZGV2dG9vbHMvc3JjL3JlZHVjZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLE9BQU8sRUFLTCxNQUFNLEVBQ04sSUFBSSxHQUNMLE1BQU0sYUFBYSxDQUFDO0FBQ3JCLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ25FLE9BQU8sS0FBSyxlQUFlLE1BQU0sV0FBVyxDQUFDO0FBRTdDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFhMUMsTUFBTSxDQUFDLElBQU0sV0FBVyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDO0FBRTFDLE1BQU0sQ0FBQyxJQUFNLFNBQVMsR0FBRyxnQ0FBb0UsQ0FBQztBQUM5RixNQUFNLENBQUMsSUFBTSxnQkFBZ0IsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQztBQTZCcEQ7O0dBRUc7QUFDSCxTQUFTLGdCQUFnQixDQUN2QixPQUFnQyxFQUNoQyxNQUFjLEVBQ2QsS0FBVSxFQUNWLEtBQVUsRUFDVixZQUEwQjtJQUUxQixJQUFJLEtBQUssRUFBRTtRQUNULE9BQU87WUFDTCxLQUFLLE9BQUE7WUFDTCxLQUFLLEVBQUUsc0NBQXNDO1NBQzlDLENBQUM7S0FDSDtJQUVELElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztJQUN0QixJQUFJLFNBQVMsQ0FBQztJQUNkLElBQUk7UUFDRixTQUFTLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztLQUNwQztJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osU0FBUyxHQUFHLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMzQixZQUFZLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUks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WSxjQUFBO1lBQ1osV0FBVyxhQUFBO1lBQ1gsWUFBWSxjQUFBO1lBQ1osZUFBZSxpQkFBQTtZQUNmLGdCQUFnQixrQkFBQTtZQUNoQixjQUFjLGdCQUFBO1lBQ2QsaUJBQWlCLG1CQUFBO1lBQ2pCLGNBQWMsZ0JBQUE7WUFDZCxRQUFRLFVBQUE7WUFDUixRQUFRLFVBQUE7U0FDVCxDQUFDO0lBQ0osQ0FBQyxFQWpZeUMsQ0FpWXpDLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXJyb3JIYW5kbGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBBY3Rpb24sXG4gIEFjdGlvblJlZHVjZXIsXG4gIEFjdGlvbnNTdWJqZWN0LFxuICBSZWR1Y2VyTWFuYWdlcixcbiAgVVBEQVRFLFxuICBJTklULFxufSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBkaWZmZXJlbmNlLCBsaWZ0QWN0aW9uLCBpc0FjdGlvbkZpbHRlcmVkIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgKiBhcyBEZXZ0b29sc0FjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7IFN0b3JlRGV2dG9vbHNDb25maWcsIFN0YXRlU2FuaXRpemVyIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgUGVyZm9ybUFjdGlvbiB9IGZyb20gJy4vYWN0aW9ucyc7XG5cbmV4cG9ydCB0eXBlIEluaXRBY3Rpb24gPSB7XG4gIHJlYWRvbmx5IHR5cGU6IHR5cGVvZiBJTklUO1xufTtcblxuZXhwb3J0IHR5cGUgVXBkYXRlUmVkdWNlckFjdGlvbiA9IHtcbiAgcmVhZG9ubHkgdHlwZTogdHlwZW9mIFVQREFURTtcbn07XG5cbmV4cG9ydCB0eXBlIENvcmVBY3Rpb25zID0gSW5pdEFjdGlvbiB8IFVwZGF0ZVJlZHVjZXJBY3Rpb247XG5leHBvcnQgdHlwZSBBY3Rpb25zID0gRGV2dG9vbHNBY3Rpb25zLkFsbCB8IENvcmVBY3Rpb25zO1xuXG5leHBvcnQgY29uc3QgSU5JVF9BQ1RJT04gPSB7IHR5cGU6IElOSVQgfTtcblxuZXhwb3J0IGNvbnN0IFJFQ09NUFVURSA9ICdAbmdyeC9zdG9yZS1kZXZ0b29scy9yZWNvbXB1dGUnIGFzICdAbmdyeC9zdG9yZS1kZXZ0b29scy9yZWNvbXB1dGUnO1xuZXhwb3J0IGNvbnN0IFJFQ09NUFVURV9BQ1RJT04gPSB7IHR5cGU6IFJFQ09NUFVURSB9O1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbXB1dGVkU3RhdGUge1xuICBzdGF0ZTogYW55O1xuICBlcnJvcjogYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZnRlZEFjdGlvbiB7XG4gIHR5cGU6IHN0cmluZztcbiAgYWN0aW9uOiBBY3Rpb247XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlmdGVkQWN0aW9ucyB7XG4gIFtpZDogbnVtYmVyXTogTGlmdGVkQWN0aW9uO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZnRlZFN0YXRlIHtcbiAgbW9uaXRvclN0YXRlOiBhbnk7XG4gIG5leHRBY3Rpb25JZDogbnVtYmVyO1xuICBhY3Rpb25zQnlJZDogTGlmdGVkQWN0aW9ucztcbiAgc3RhZ2VkQWN0aW9uSWRzOiBudW1iZXJbXTtcbiAgc2tpcHBlZEFjdGlvbklkczogbnVtYmVyW107XG4gIGNvbW1pdHRlZFN0YXRlOiBhbnk7XG4gIGN1cnJlbnRTdGF0ZUluZGV4OiBudW1iZXI7XG4gIGNvbXB1dGVkU3RhdGVzOiBDb21wdXRlZFN0YXRlW107XG4gIGlzTG9ja2VkOiBib29sZWFuO1xuICBpc1BhdXNlZDogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgbmV4dCBlbnRyeSBpbiB0aGUgbG9nIGJ5IGFwcGx5aW5nIGFuIGFjdGlvbi5cbiAqL1xuZnVuY3Rpb24gY29tcHV0ZU5leHRFbnRyeShcbiAgcmVkdWNlcjogQWN0aW9uUmVkdWNlcjxhbnksIGFueT4sXG4gIGFjdGlvbjogQWN0aW9uLFxuICBzdGF0ZTogYW55LFxuICBlcnJvcjogYW55LFxuICBlcnJvckhhbmRsZXI6IEVycm9ySGFuZGxlclxuKSB7XG4gIGlmIChlcnJvcikge1xuICAgIHJldHVybiB7XG4gICAgICBzdGF0ZSxcbiAgICAgIGVycm9yOiAnSW50ZXJydXB0ZWQgYnkgYW4gZXJyb3IgdXAgdGhlIGNoYWluJyxcbiAgICB9O1xuICB9XG5cbiAgbGV0IG5leHRTdGF0ZSA9IHN0YXRlO1xuICBsZXQgbmV4dEVycm9yO1xuICB0cnkge1xuICAgIG5leHRTdGF0ZSA9IHJlZHVjZXIoc3RhdGUsIGFjdGlvbik7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIG5leHRFcnJvciA9IGVyci50b1N0cmluZygpO1xuICAgIGVycm9ySGFuZGxlci5oYW5kbGVFcnJvcihlcnIuc3RhY2sgfHwgZXJyKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc3RhdGU6IG5leHRTdGF0ZSxcbiAgICBlcnJvcjogbmV4dEVycm9yLFxuICB9O1xufVxuXG4vKipcbiAqIFJ1bnMgdGhlIHJlZHVjZXIgb24gaW52YWxpZGF0ZWQgYWN0aW9ucyB0byBnZXQgYSBmcmVzaCBjb21wdXRhdGlvbiBsb2cuXG4gKi9cbmZ1bmN0aW9uIHJlY29tcHV0ZVN0YXRlcyhcbiAgY29tcHV0ZWRTdGF0ZXM6IENvbXB1dGVkU3RhdGVbXSxcbiAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4OiBudW1iZXIsXG4gIHJlZHVjZXI6IEFjdGlvblJlZHVjZXI8YW55LCBhbnk+LFxuICBjb21taXR0ZWRTdGF0ZTogYW55LFxuICBhY3Rpb25zQnlJZDogTGlmdGVkQWN0aW9ucyxcbiAgc3RhZ2VkQWN0aW9uSWRzOiBudW1iZXJbXSxcbiAgc2tpcHBlZEFjdGlvbklkczogbnVtYmVyW10sXG4gIGVycm9ySGFuZGxlcjogRXJyb3JIYW5kbGVyLFxuICBpc1BhdXNlZDogYm9vbGVhblxuKSB7XG4gIC8vIE9wdGltaXphdGlvbjogZXhpdCBlYXJseSBhbmQgcmV0dXJuIHRoZSBzYW1lIHJlZmVyZW5jZVxuICAvLyBpZiB3ZSBrbm93IG5vdGhpbmcgY291bGQgaGF2ZSBjaGFuZ2VkLlxuICBpZiAoXG4gICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID49IGNvbXB1dGVkU3RhdGVzLmxlbmd0aCAmJlxuICAgIGNvbXB1dGVkU3RhdGVzLmxlbmd0aCA9PT0gc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aFxuICApIHtcbiAgICByZXR1cm4gY29tcHV0ZWRTdGF0ZXM7XG4gIH1cblxuICBjb25zdCBuZXh0Q29tcHV0ZWRTdGF0ZXMgPSBjb21wdXRlZFN0YXRlcy5zbGljZSgwLCBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXgpO1xuICAvLyBJZiB0aGUgcmVjb3JkaW5nIGlzIHBhdXNlZCwgcmVjb21wdXRlIGFsbCBzdGF0ZXMgdXAgdW50aWwgdGhlIHBhdXNlIHN0YXRlLFxuICAvLyBlbHNlIHJlY29tcHV0ZSBhbGwgc3RhdGVzLlxuICBjb25zdCBsYXN0SW5jbHVkZWRBY3Rpb25JZCA9IHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSAoaXNQYXVzZWQgPyAxIDogMCk7XG4gIGZvciAobGV0IGkgPSBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXg7IGkgPCBsYXN0SW5jbHVkZWRBY3Rpb25JZDsgaSsrKSB7XG4gICAgY29uc3QgYWN0aW9uSWQgPSBzdGFnZWRBY3Rpb25JZHNbaV07XG4gICAgY29uc3QgYWN0aW9uID0gYWN0aW9uc0J5SWRbYWN0aW9uSWRdLmFjdGlvbjtcblxuICAgIGNvbnN0IHByZXZpb3VzRW50cnkgPSBuZXh0Q29tcHV0ZWRTdGF0ZXNbaSAtIDFdO1xuICAgIGNvbnN0IHByZXZpb3VzU3RhdGUgPSBwcmV2aW91c0VudHJ5ID8gcHJldmlvdXNFbnRyeS5zdGF0ZSA6IGNvbW1pdHRlZFN0YXRlO1xuICAgIGNvbnN0IHByZXZpb3VzRXJyb3IgPSBwcmV2aW91c0VudHJ5ID8gcHJldmlvdXNFbnRyeS5lcnJvciA6IHVuZGVmaW5lZDtcblxuICAgIGNvbnN0IHNob3VsZFNraXAgPSBza2lwcGVkQWN0aW9uSWRzLmluZGV4T2YoYWN0aW9uSWQpID4gLTE7XG4gICAgY29uc3QgZW50cnk6IENvbXB1dGVkU3RhdGUgPSBzaG91bGRTa2lwXG4gICAgICA/IHByZXZpb3VzRW50cnlcbiAgICAgIDogY29tcHV0ZU5leHRFbnRyeShcbiAgICAgICAgICByZWR1Y2VyLFxuICAgICAgICAgIGFjdGlvbixcbiAgICAgICAgICBwcmV2aW91c1N0YXRlLFxuICAgICAgICAgIHByZXZpb3VzRXJyb3IsXG4gICAgICAgICAgZXJyb3JIYW5kbGVyXG4gICAgICAgICk7XG5cbiAgICBuZXh0Q29tcHV0ZWRTdGF0ZXMucHVzaChlbnRyeSk7XG4gIH1cbiAgLy8gSWYgdGhlIHJlY29yZGluZyBpcyBwYXVzZWQsIHRoZSBsYXN0IHN0YXRlIHdpbGwgbm90IGJlIHJlY29tcHV0ZWQsXG4gIC8vIGJlY2F1c2UgaXQncyBlc3NlbnRpYWxseSBub3QgcGFydCBvZiB0aGUgc3RhdGUgaGlzdG9yeS5cbiAgaWYgKGlzUGF1c2VkKSB7XG4gICAgbmV4dENvbXB1dGVkU3RhdGVzLnB1c2goY29tcHV0ZWRTdGF0ZXNbY29tcHV0ZWRTdGF0ZXMubGVuZ3RoIC0gMV0pO1xuICB9XG5cbiAgcmV0dXJuIG5leHRDb21wdXRlZFN0YXRlcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpZnRJbml0aWFsU3RhdGUoXG4gIGluaXRpYWxDb21taXR0ZWRTdGF0ZT86IGFueSxcbiAgbW9uaXRvclJlZHVjZXI/OiBhbnlcbik6IExpZnRlZFN0YXRlIHtcbiAgcmV0dXJuIHtcbiAgICBtb25pdG9yU3RhdGU6IG1vbml0b3JSZWR1Y2VyKHVuZGVmaW5lZCwge30pLFxuICAgIG5leHRBY3Rpb25JZDogMSxcbiAgICBhY3Rpb25zQnlJZDogeyAwOiBsaWZ0QWN0aW9uKElOSVRfQUNUSU9OKSB9LFxuICAgIHN0YWdlZEFjdGlvbklkczogWzBdLFxuICAgIHNraXBwZWRBY3Rpb25JZHM6IFtdLFxuICAgIGNvbW1pdHRlZFN0YXRlOiBpbml0aWFsQ29tbWl0dGVkU3RhdGUsXG4gICAgY3VycmVudFN0YXRlSW5kZXg6IDAsXG4gICAgY29tcHV0ZWRTdGF0ZXM6IFtdLFxuICAgIGlzTG9ja2VkOiBmYWxzZSxcbiAgICBpc1BhdXNlZDogZmFsc2UsXG4gIH07XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGhpc3Rvcnkgc3RhdGUgcmVkdWNlciBmcm9tIGFuIGFwcCdzIHJlZHVjZXIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsaWZ0UmVkdWNlcldpdGgoXG4gIGluaXRpYWxDb21taXR0ZWRTdGF0ZTogYW55LFxuICBpbml0aWFsTGlmdGVkU3RhdGU6IExpZnRlZFN0YXRlLFxuICBlcnJvckhhbmRsZXI6IEVycm9ySGFuZGxlcixcbiAgbW9uaXRvclJlZHVjZXI/OiBhbnksXG4gIG9wdGlvbnM6IFBhcnRpYWw8U3RvcmVEZXZ0b29sc0NvbmZpZz4gPSB7fVxuKSB7XG4gIC8qKlxuICAgKiBNYW5hZ2VzIGhvdyB0aGUgaGlzdG9yeSBhY3Rpb25zIG1vZGlmeSB0aGUgaGlzdG9yeSBzdGF0ZS5cbiAgICovXG4gIHJldHVybiAoXG4gICAgcmVkdWNlcjogQWN0aW9uUmVkdWNlcjxhbnksIGFueT5cbiAgKTogQWN0aW9uUmVkdWNlcjxMaWZ0ZWRTdGF0ZSwgQWN0aW9ucz4gPT4gKGxpZnRlZFN0YXRlLCBsaWZ0ZWRBY3Rpb24pID0+IHtcbiAgICBsZXQge1xuICAgICAgbW9uaXRvclN0YXRlLFxuICAgICAgYWN0aW9uc0J5SWQsXG4gICAgICBuZXh0QWN0aW9uSWQsXG4gICAgICBzdGFnZWRBY3Rpb25JZHMsXG4gICAgICBza2lwcGVkQWN0aW9uSWRzLFxuICAgICAgY29tbWl0dGVkU3RhdGUsXG4gICAgICBjdXJyZW50U3RhdGVJbmRleCxcbiAgICAgIGNvbXB1dGVkU3RhdGVzLFxuICAgICAgaXNMb2NrZWQsXG4gICAgICBpc1BhdXNlZCxcbiAgICB9ID1cbiAgICAgIGxpZnRlZFN0YXRlIHx8IGluaXRpYWxMaWZ0ZWRTdGF0ZTtcblxuICAgIGlmICghbGlmdGVkU3RhdGUpIHtcbiAgICAgIC8vIFByZXZlbnQgbXV0YXRpbmcgaW5pdGlhbExpZnRlZFN0YXRlXG4gICAgICBhY3Rpb25zQnlJZCA9IE9iamVjdC5jcmVhdGUoYWN0aW9uc0J5SWQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbW1pdEV4Y2Vzc0FjdGlvbnMobjogbnVtYmVyKSB7XG4gICAgICAvLyBBdXRvLWNvbW1pdHMgbi1udW1iZXIgb2YgZXhjZXNzIGFjdGlvbnMuXG4gICAgICBsZXQgZXhjZXNzID0gbjtcbiAgICAgIGxldCBpZHNUb0RlbGV0ZSA9IHN0YWdlZEFjdGlvbklkcy5zbGljZSgxLCBleGNlc3MgKyAxKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpZHNUb0RlbGV0ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoY29tcHV0ZWRTdGF0ZXNbaSArIDFdLmVycm9yKSB7XG4gICAgICAgICAgLy8gU3RvcCBpZiBlcnJvciBpcyBmb3VuZC4gQ29tbWl0IGFjdGlvbnMgdXAgdG8gZXJyb3IuXG4gICAgICAgICAgZXhjZXNzID0gaTtcbiAgICAgICAgICBpZHNUb0RlbGV0ZSA9IHN0YWdlZEFjdGlvbklkcy5zbGljZSgxLCBleGNlc3MgKyAxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgYWN0aW9uc0J5SWRbaWRzVG9EZWxldGVbaV1dO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHNraXBwZWRBY3Rpb25JZHMgPSBza2lwcGVkQWN0aW9uSWRzLmZpbHRlcihcbiAgICAgICAgaWQgPT4gaWRzVG9EZWxldGUuaW5kZXhPZihpZCkgPT09IC0xXG4gICAgICApO1xuICAgICAgc3RhZ2VkQWN0aW9uSWRzID0gWzAsIC4uLnN0YWdlZEFjdGlvbklkcy5zbGljZShleGNlc3MgKyAxKV07XG4gICAgICBjb21taXR0ZWRTdGF0ZSA9IGNvbXB1dGVkU3RhdGVzW2V4Y2Vzc10uc3RhdGU7XG4gICAgICBjb21wdXRlZFN0YXRlcyA9IGNvbXB1dGVkU3RhdGVzLnNsaWNlKGV4Y2Vzcyk7XG4gICAgICBjdXJyZW50U3RhdGVJbmRleCA9XG4gICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4ID4gZXhjZXNzID8gY3VycmVudFN0YXRlSW5kZXggLSBleGNlc3MgOiAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbW1pdENoYW5nZXMoKSB7XG4gICAgICAvLyBDb25zaWRlciB0aGUgbGFzdCBjb21taXR0ZWQgc3RhdGUgdGhlIG5ldyBzdGFydGluZyBwb2ludC5cbiAgICAgIC8vIFNxdWFzaCBhbnkgc3RhZ2VkIGFjdGlvbnMgaW50byBhIHNpbmdsZSBjb21taXR0ZWQgc3RhdGUuXG4gICAgICBhY3Rpb25zQnlJZCA9IHsgMDogbGlmdEFjdGlvbihJTklUX0FDVElPTikgfTtcbiAgICAgIG5leHRBY3Rpb25JZCA9IDE7XG4gICAgICBzdGFnZWRBY3Rpb25JZHMgPSBbMF07XG4gICAgICBza2lwcGVkQWN0aW9uSWRzID0gW107XG4gICAgICBjb21taXR0ZWRTdGF0ZSA9IGNvbXB1dGVkU3RhdGVzW2N1cnJlbnRTdGF0ZUluZGV4XS5zdGF0ZTtcbiAgICAgIGN1cnJlbnRTdGF0ZUluZGV4ID0gMDtcbiAgICAgIGNvbXB1dGVkU3RhdGVzID0gW107XG4gICAgfVxuXG4gICAgLy8gQnkgZGVmYXVsdCwgYWdncmVzc2l2ZWx5IHJlY29tcHV0ZSBldmVyeSBzdGF0ZSB3aGF0ZXZlciBoYXBwZW5zLlxuICAgIC8vIFRoaXMgaGFzIE8obikgcGVyZm9ybWFuY2UsIHNvIHdlJ2xsIG92ZXJyaWRlIHRoaXMgdG8gYSBzZW5zaWJsZVxuICAgIC8vIHZhbHVlIHdoZW5ldmVyIHdlIGZlZWwgbGlrZSB3ZSBkb24ndCBoYXZlIHRvIHJlY29tcHV0ZSB0aGUgc3RhdGVzLlxuICAgIGxldCBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSAwO1xuXG4gICAgc3dpdGNoIChsaWZ0ZWRBY3Rpb24udHlwZSkge1xuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuTE9DS19DSEFOR0VTOiB7XG4gICAgICAgIGlzTG9ja2VkID0gbGlmdGVkQWN0aW9uLnN0YXR1cztcbiAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gSW5maW5pdHk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuUEFVU0VfUkVDT1JESU5HOiB7XG4gICAgICAgIGlzUGF1c2VkID0gbGlmdGVkQWN0aW9uLnN0YXR1cztcbiAgICAgICAgaWYgKGlzUGF1c2VkKSB7XG4gICAgICAgICAgLy8gQWRkIGEgcGF1c2UgYWN0aW9uIHRvIHNpZ25hbCB0aGUgZGV2dG9vbHMtdXNlciB0aGUgcmVjb3JkaW5nIGlzIHBhdXNlZC5cbiAgICAgICAgICAvLyBUaGUgY29ycmVzcG9uZGluZyBzdGF0ZSB3aWxsIGJlIG92ZXJ3cml0dGVuIG9uIGVhY2ggdXBkYXRlIHRvIGFsd2F5cyBjb250YWluXG4gICAgICAgICAgLy8gdGhlIGxhdGVzdCBzdGF0ZSAoc2VlIEFjdGlvbnMuUEVSRk9STV9BQ1RJT04pLlxuICAgICAgICAgIHN0YWdlZEFjdGlvbklkcyA9IFsuLi5zdGFnZWRBY3Rpb25JZHMsIG5leHRBY3Rpb25JZF07XG4gICAgICAgICAgYWN0aW9uc0J5SWRbbmV4dEFjdGlvbklkXSA9IG5ldyBQZXJmb3JtQWN0aW9uKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0eXBlOiAnQG5ncngvZGV2dG9vbHMvcGF1c2UnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICtEYXRlLm5vdygpXG4gICAgICAgICAgKTtcbiAgICAgICAgICBuZXh0QWN0aW9uSWQrKztcbiAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gMTtcbiAgICAgICAgICBjb21wdXRlZFN0YXRlcyA9IGNvbXB1dGVkU3RhdGVzLmNvbmNhdChcbiAgICAgICAgICAgIGNvbXB1dGVkU3RhdGVzW2NvbXB1dGVkU3RhdGVzLmxlbmd0aCAtIDFdXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGlmIChjdXJyZW50U3RhdGVJbmRleCA9PT0gc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIDIpIHtcbiAgICAgICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4Kys7XG4gICAgICAgICAgfVxuICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IEluZmluaXR5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbW1pdENoYW5nZXMoKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLlJFU0VUOiB7XG4gICAgICAgIC8vIEdldCBiYWNrIHRvIHRoZSBzdGF0ZSB0aGUgc3RvcmUgd2FzIGNyZWF0ZWQgd2l0aC5cbiAgICAgICAgYWN0aW9uc0J5SWQgPSB7IDA6IGxpZnRBY3Rpb24oSU5JVF9BQ1RJT04pIH07XG4gICAgICAgIG5leHRBY3Rpb25JZCA9IDE7XG4gICAgICAgIHN0YWdlZEFjdGlvbklkcyA9IFswXTtcbiAgICAgICAgc2tpcHBlZEFjdGlvbklkcyA9IFtdO1xuICAgICAgICBjb21taXR0ZWRTdGF0ZSA9IGluaXRpYWxDb21taXR0ZWRTdGF0ZTtcbiAgICAgICAgY3VycmVudFN0YXRlSW5kZXggPSAwO1xuICAgICAgICBjb21wdXRlZFN0YXRlcyA9IFtdO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLkNPTU1JVDoge1xuICAgICAgICBjb21taXRDaGFuZ2VzKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuUk9MTEJBQ0s6IHtcbiAgICAgICAgLy8gRm9yZ2V0IGFib3V0IGFueSBzdGFnZWQgYWN0aW9ucy5cbiAgICAgICAgLy8gU3RhcnQgYWdhaW4gZnJvbSB0aGUgbGFzdCBjb21taXR0ZWQgc3RhdGUuXG4gICAgICAgIGFjdGlvbnNCeUlkID0geyAwOiBsaWZ0QWN0aW9uKElOSVRfQUNUSU9OKSB9O1xuICAgICAgICBuZXh0QWN0aW9uSWQgPSAxO1xuICAgICAgICBzdGFnZWRBY3Rpb25JZHMgPSBbMF07XG4gICAgICAgIHNraXBwZWRBY3Rpb25JZHMgPSBbXTtcbiAgICAgICAgY3VycmVudFN0YXRlSW5kZXggPSAwO1xuICAgICAgICBjb21wdXRlZFN0YXRlcyA9IFtdO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLlRPR0dMRV9BQ1RJT046IHtcbiAgICAgICAgLy8gVG9nZ2xlIHdoZXRoZXIgYW4gYWN0aW9uIHdpdGggZ2l2ZW4gSUQgaXMgc2tpcHBlZC5cbiAgICAgICAgLy8gQmVpbmcgc2tpcHBlZCBtZWFucyBpdCBpcyBhIG5vLW9wIGR1cmluZyB0aGUgY29tcHV0YXRpb24uXG4gICAgICAgIGNvbnN0IHsgaWQ6IGFjdGlvbklkIH0gPSBsaWZ0ZWRBY3Rpb247XG4gICAgICAgIGNvbnN0IGluZGV4ID0gc2tpcHBlZEFjdGlvbklkcy5pbmRleE9mKGFjdGlvbklkKTtcbiAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICAgIHNraXBwZWRBY3Rpb25JZHMgPSBbYWN0aW9uSWQsIC4uLnNraXBwZWRBY3Rpb25JZHNdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNraXBwZWRBY3Rpb25JZHMgPSBza2lwcGVkQWN0aW9uSWRzLmZpbHRlcihpZCA9PiBpZCAhPT0gYWN0aW9uSWQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIE9wdGltaXphdGlvbjogd2Uga25vdyBoaXN0b3J5IGJlZm9yZSB0aGlzIGFjdGlvbiBoYXNuJ3QgY2hhbmdlZFxuICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBzdGFnZWRBY3Rpb25JZHMuaW5kZXhPZihhY3Rpb25JZCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuU0VUX0FDVElPTlNfQUNUSVZFOiB7XG4gICAgICAgIC8vIFRvZ2dsZSB3aGV0aGVyIGFuIGFjdGlvbiB3aXRoIGdpdmVuIElEIGlzIHNraXBwZWQuXG4gICAgICAgIC8vIEJlaW5nIHNraXBwZWQgbWVhbnMgaXQgaXMgYSBuby1vcCBkdXJpbmcgdGhlIGNvbXB1dGF0aW9uLlxuICAgICAgICBjb25zdCB7IHN0YXJ0LCBlbmQsIGFjdGl2ZSB9ID0gbGlmdGVkQWN0aW9uO1xuICAgICAgICBjb25zdCBhY3Rpb25JZHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIGFjdGlvbklkcy5wdXNoKGkpO1xuICAgICAgICBpZiAoYWN0aXZlKSB7XG4gICAgICAgICAgc2tpcHBlZEFjdGlvbklkcyA9IGRpZmZlcmVuY2Uoc2tpcHBlZEFjdGlvbklkcywgYWN0aW9uSWRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBza2lwcGVkQWN0aW9uSWRzID0gWy4uLnNraXBwZWRBY3Rpb25JZHMsIC4uLmFjdGlvbklkc107XG4gICAgICAgIH1cblxuICAgICAgICAvLyBPcHRpbWl6YXRpb246IHdlIGtub3cgaGlzdG9yeSBiZWZvcmUgdGhpcyBhY3Rpb24gaGFzbid0IGNoYW5nZWRcbiAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gc3RhZ2VkQWN0aW9uSWRzLmluZGV4T2Yoc3RhcnQpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLkpVTVBfVE9fU1RBVEU6IHtcbiAgICAgICAgLy8gV2l0aG91dCByZWNvbXB1dGluZyBhbnl0aGluZywgbW92ZSB0aGUgcG9pbnRlciB0aGF0IHRlbGwgdXNcbiAgICAgICAgLy8gd2hpY2ggc3RhdGUgaXMgY29uc2lkZXJlZCB0aGUgY3VycmVudCBvbmUuIFVzZWZ1bCBmb3Igc2xpZGVycy5cbiAgICAgICAgY3VycmVudFN0YXRlSW5kZXggPSBsaWZ0ZWRBY3Rpb24uaW5kZXg7XG4gICAgICAgIC8vIE9wdGltaXphdGlvbjogd2Uga25vdyB0aGUgaGlzdG9yeSBoYXMgbm90IGNoYW5nZWQuXG4gICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IEluZmluaXR5O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLkpVTVBfVE9fQUNUSU9OOiB7XG4gICAgICAgIC8vIEp1bXBzIHRvIGEgY29ycmVzcG9uZGluZyBzdGF0ZSB0byBhIHNwZWNpZmljIGFjdGlvbi5cbiAgICAgICAgLy8gVXNlZnVsIHdoZW4gZmlsdGVyaW5nIGFjdGlvbnMuXG4gICAgICAgIGNvbnN0IGluZGV4ID0gc3RhZ2VkQWN0aW9uSWRzLmluZGV4T2YobGlmdGVkQWN0aW9uLmFjdGlvbklkKTtcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkgY3VycmVudFN0YXRlSW5kZXggPSBpbmRleDtcbiAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gSW5maW5pdHk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuU1dFRVA6IHtcbiAgICAgICAgLy8gRm9yZ2V0IGFueSBhY3Rpb25zIHRoYXQgYXJlIGN1cnJlbnRseSBiZWluZyBza2lwcGVkLlxuICAgICAgICBzdGFnZWRBY3Rpb25JZHMgPSBkaWZmZXJlbmNlKHN0YWdlZEFjdGlvbklkcywgc2tpcHBlZEFjdGlvbklkcyk7XG4gICAgICAgIHNraXBwZWRBY3Rpb25JZHMgPSBbXTtcbiAgICAgICAgY3VycmVudFN0YXRlSW5kZXggPSBNYXRoLm1pbihcbiAgICAgICAgICBjdXJyZW50U3RhdGVJbmRleCxcbiAgICAgICAgICBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gMVxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLlBFUkZPUk1fQUNUSU9OOiB7XG4gICAgICAgIC8vIElnbm9yZSBhY3Rpb24gYW5kIHJldHVybiBzdGF0ZSBhcyBpcyBpZiByZWNvcmRpbmcgaXMgbG9ja2VkXG4gICAgICAgIGlmIChpc0xvY2tlZCkge1xuICAgICAgICAgIHJldHVybiBsaWZ0ZWRTdGF0ZSB8fCBpbml0aWFsTGlmdGVkU3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgaXNQYXVzZWQgfHxcbiAgICAgICAgICAobGlmdGVkU3RhdGUgJiZcbiAgICAgICAgICAgIGlzQWN0aW9uRmlsdGVyZWQoXG4gICAgICAgICAgICAgIGxpZnRlZFN0YXRlLmNvbXB1dGVkU3RhdGVzW2N1cnJlbnRTdGF0ZUluZGV4XSxcbiAgICAgICAgICAgICAgbGlmdGVkQWN0aW9uLFxuICAgICAgICAgICAgICBvcHRpb25zLnByZWRpY2F0ZSxcbiAgICAgICAgICAgICAgb3B0aW9ucy5hY3Rpb25zU2FmZWxpc3QsXG4gICAgICAgICAgICAgIG9wdGlvbnMuYWN0aW9uc0Jsb2NrbGlzdFxuICAgICAgICAgICAgKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgLy8gSWYgcmVjb3JkaW5nIGlzIHBhdXNlZCBvciBpZiB0aGUgYWN0aW9uIHNob3VsZCBiZSBpZ25vcmVkLCBvdmVyd3JpdGUgdGhlIGxhc3Qgc3RhdGVcbiAgICAgICAgICAvLyAoY29ycmVzcG9uZHMgdG8gdGhlIHBhdXNlIGFjdGlvbikgYW5kIGtlZXAgZXZlcnl0aGluZyBlbHNlIGFzIGlzLlxuICAgICAgICAgIC8vIFRoaXMgd2F5LCB0aGUgYXBwIGdldHMgdGhlIG5ldyBjdXJyZW50IHN0YXRlIHdoaWxlIHRoZSBkZXZ0b29sc1xuICAgICAgICAgIC8vIGRvIG5vdCByZWNvcmQgYW5vdGhlciBhY3Rpb24uXG4gICAgICAgICAgY29uc3QgbGFzdFN0YXRlID0gY29tcHV0ZWRTdGF0ZXNbY29tcHV0ZWRTdGF0ZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgY29tcHV0ZWRTdGF0ZXMgPSBbXG4gICAgICAgICAgICAuLi5jb21wdXRlZFN0YXRlcy5zbGljZSgwLCAtMSksXG4gICAgICAgICAgICBjb21wdXRlTmV4dEVudHJ5KFxuICAgICAgICAgICAgICByZWR1Y2VyLFxuICAgICAgICAgICAgICBsaWZ0ZWRBY3Rpb24uYWN0aW9uLFxuICAgICAgICAgICAgICBsYXN0U3RhdGUuc3RhdGUsXG4gICAgICAgICAgICAgIGxhc3RTdGF0ZS5lcnJvcixcbiAgICAgICAgICAgICAgZXJyb3JIYW5kbGVyXG4gICAgICAgICAgICApLFxuICAgICAgICAgIF07XG4gICAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gSW5maW5pdHk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBdXRvLWNvbW1pdCBhcyBuZXcgYWN0aW9ucyBjb21lIGluLlxuICAgICAgICBpZiAob3B0aW9ucy5tYXhBZ2UgJiYgc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCA9PT0gb3B0aW9ucy5tYXhBZ2UpIHtcbiAgICAgICAgICBjb21taXRFeGNlc3NBY3Rpb25zKDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGN1cnJlbnRTdGF0ZUluZGV4ID09PSBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4Kys7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYWN0aW9uSWQgPSBuZXh0QWN0aW9uSWQrKztcbiAgICAgICAgLy8gTXV0YXRpb24hIFRoaXMgaXMgdGhlIGhvdHRlc3QgcGF0aCwgYW5kIHdlIG9wdGltaXplIG9uIHB1cnBvc2UuXG4gICAgICAgIC8vIEl0IGlzIHNhZmUgYmVjYXVzZSB3ZSBzZXQgYSBuZXcga2V5IGluIGEgY2FjaGUgZGljdGlvbmFyeS5cbiAgICAgICAgYWN0aW9uc0J5SWRbYWN0aW9uSWRdID0gbGlmdGVkQWN0aW9uO1xuXG4gICAgICAgIHN0YWdlZEFjdGlvbklkcyA9IFsuLi5zdGFnZWRBY3Rpb25JZHMsIGFjdGlvbklkXTtcbiAgICAgICAgLy8gT3B0aW1pemF0aW9uOiB3ZSBrbm93IHRoYXQgb25seSB0aGUgbmV3IGFjdGlvbiBuZWVkcyBjb21wdXRpbmcuXG4gICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSAxO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLklNUE9SVF9TVEFURToge1xuICAgICAgICAvLyBDb21wbGV0ZWx5IHJlcGxhY2UgZXZlcnl0aGluZy5cbiAgICAgICAgKHtcbiAgICAgICAgICBtb25pdG9yU3RhdGUsXG4gICAgICAgICAgYWN0aW9uc0J5SWQsXG4gICAgICAgICAgbmV4dEFjdGlvbklkLFxuICAgICAgICAgIHN0YWdlZEFjdGlvbklkcyxcbiAgICAgICAgICBza2lwcGVkQWN0aW9uSWRzLFxuICAgICAgICAgIGNvbW1pdHRlZFN0YXRlLFxuICAgICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4LFxuICAgICAgICAgIGNvbXB1dGVkU3RhdGVzLFxuICAgICAgICAgIGlzTG9ja2VkLFxuICAgICAgICAgIC8vIHByZXR0aWVyLWlnbm9yZVxuICAgICAgICAgIGlzUGF1c2VkXG4gICAgICAgIH0gPSBsaWZ0ZWRBY3Rpb24ubmV4dExpZnRlZFN0YXRlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIElOSVQ6IHtcbiAgICAgICAgLy8gQWx3YXlzIHJlY29tcHV0ZSBzdGF0ZXMgb24gaG90IHJlbG9hZCBhbmQgaW5pdC5cbiAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gMDtcblxuICAgICAgICBpZiAob3B0aW9ucy5tYXhBZ2UgJiYgc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCA+IG9wdGlvbnMubWF4QWdlKSB7XG4gICAgICAgICAgLy8gU3RhdGVzIG11c3QgYmUgcmVjb21wdXRlZCBiZWZvcmUgY29tbWl0dGluZyBleGNlc3MuXG4gICAgICAgICAgY29tcHV0ZWRTdGF0ZXMgPSByZWNvbXB1dGVTdGF0ZXMoXG4gICAgICAgICAgICBjb21wdXRlZFN0YXRlcyxcbiAgICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCxcbiAgICAgICAgICAgIHJlZHVjZXIsXG4gICAgICAgICAgICBjb21taXR0ZWRTdGF0ZSxcbiAgICAgICAgICAgIGFjdGlvbnNCeUlkLFxuICAgICAgICAgICAgc3RhZ2VkQWN0aW9uSWRzLFxuICAgICAgICAgICAgc2tpcHBlZEFjdGlvbklkcyxcbiAgICAgICAgICAgIGVycm9ySGFuZGxlcixcbiAgICAgICAgICAgIGlzUGF1c2VkXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGNvbW1pdEV4Y2Vzc0FjdGlvbnMoc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIG9wdGlvbnMubWF4QWdlKTtcblxuICAgICAgICAgIC8vIEF2b2lkIGRvdWJsZSBjb21wdXRhdGlvbi5cbiAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBJbmZpbml0eTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBVUERBVEU6IHtcbiAgICAgICAgY29uc3Qgc3RhdGVIYXNFcnJvcnMgPVxuICAgICAgICAgIGNvbXB1dGVkU3RhdGVzLmZpbHRlcihzdGF0ZSA9PiBzdGF0ZS5lcnJvcikubGVuZ3RoID4gMDtcblxuICAgICAgICBpZiAoc3RhdGVIYXNFcnJvcnMpIHtcbiAgICAgICAgICAvLyBSZWNvbXB1dGUgYWxsIHN0YXRlc1xuICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IDA7XG5cbiAgICAgICAgICBpZiAob3B0aW9ucy5tYXhBZ2UgJiYgc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCA+IG9wdGlvbnMubWF4QWdlKSB7XG4gICAgICAgICAgICAvLyBTdGF0ZXMgbXVzdCBiZSByZWNvbXB1dGVkIGJlZm9yZSBjb21taXR0aW5nIGV4Y2Vzcy5cbiAgICAgICAgICAgIGNvbXB1dGVkU3RhdGVzID0gcmVjb21wdXRlU3RhdGVzKFxuICAgICAgICAgICAgICBjb21wdXRlZFN0YXRlcyxcbiAgICAgICAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4LFxuICAgICAgICAgICAgICByZWR1Y2VyLFxuICAgICAgICAgICAgICBjb21taXR0ZWRTdGF0ZSxcbiAgICAgICAgICAgICAgYWN0aW9uc0J5SWQsXG4gICAgICAgICAgICAgIHN0YWdlZEFjdGlvbklkcyxcbiAgICAgICAgICAgICAgc2tpcHBlZEFjdGlvbklkcyxcbiAgICAgICAgICAgICAgZXJyb3JIYW5kbGVyLFxuICAgICAgICAgICAgICBpc1BhdXNlZFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29tbWl0RXhjZXNzQWN0aW9ucyhzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gb3B0aW9ucy5tYXhBZ2UpO1xuXG4gICAgICAgICAgICAvLyBBdm9pZCBkb3VibGUgY29tcHV0YXRpb24uXG4gICAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBJbmZpbml0eTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gSWYgbm90IHBhdXNlZC9sb2NrZWQsIGFkZCBhIG5ldyBhY3Rpb24gdG8gc2lnbmFsIGRldnRvb2xzLXVzZXJcbiAgICAgICAgICAvLyB0aGF0IHRoZXJlIHdhcyBhIHJlZHVjZXIgdXBkYXRlLlxuICAgICAgICAgIGlmICghaXNQYXVzZWQgJiYgIWlzTG9ja2VkKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFN0YXRlSW5kZXggPT09IHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4Kys7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEFkZCBhIG5ldyBhY3Rpb24gdG8gb25seSByZWNvbXB1dGUgc3RhdGVcbiAgICAgICAgICAgIGNvbnN0IGFjdGlvbklkID0gbmV4dEFjdGlvbklkKys7XG4gICAgICAgICAgICBhY3Rpb25zQnlJZFthY3Rpb25JZF0gPSBuZXcgUGVyZm9ybUFjdGlvbihcbiAgICAgICAgICAgICAgbGlmdGVkQWN0aW9uLFxuICAgICAgICAgICAgICArRGF0ZS5ub3coKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHN0YWdlZEFjdGlvbklkcyA9IFsuLi5zdGFnZWRBY3Rpb25JZHMsIGFjdGlvbklkXTtcblxuICAgICAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIDE7XG5cbiAgICAgICAgICAgIGNvbXB1dGVkU3RhdGVzID0gcmVjb21wdXRlU3RhdGVzKFxuICAgICAgICAgICAgICBjb21wdXRlZFN0YXRlcyxcbiAgICAgICAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4LFxuICAgICAgICAgICAgICByZWR1Y2VyLFxuICAgICAgICAgICAgICBjb21taXR0ZWRTdGF0ZSxcbiAgICAgICAgICAgICAgYWN0aW9uc0J5SWQsXG4gICAgICAgICAgICAgIHN0YWdlZEFjdGlvbklkcyxcbiAgICAgICAgICAgICAgc2tpcHBlZEFjdGlvbklkcyxcbiAgICAgICAgICAgICAgZXJyb3JIYW5kbGVyLFxuICAgICAgICAgICAgICBpc1BhdXNlZFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBSZWNvbXB1dGUgc3RhdGUgaGlzdG9yeSB3aXRoIGxhdGVzdCByZWR1Y2VyIGFuZCB1cGRhdGUgYWN0aW9uXG4gICAgICAgICAgY29tcHV0ZWRTdGF0ZXMgPSBjb21wdXRlZFN0YXRlcy5tYXAoY21wID0+ICh7XG4gICAgICAgICAgICAuLi5jbXAsXG4gICAgICAgICAgICBzdGF0ZTogcmVkdWNlcihjbXAuc3RhdGUsIFJFQ09NUFVURV9BQ1RJT04pLFxuICAgICAgICAgIH0pKTtcblxuICAgICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4ID0gc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIDE7XG5cbiAgICAgICAgICBpZiAob3B0aW9ucy5tYXhBZ2UgJiYgc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCA+IG9wdGlvbnMubWF4QWdlKSB7XG4gICAgICAgICAgICBjb21taXRFeGNlc3NBY3Rpb25zKHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSBvcHRpb25zLm1heEFnZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQXZvaWQgZG91YmxlIGNvbXB1dGF0aW9uLlxuICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IEluZmluaXR5O1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIC8vIElmIHRoZSBhY3Rpb24gaXMgbm90IHJlY29nbml6ZWQsIGl0J3MgYSBtb25pdG9yIGFjdGlvbi5cbiAgICAgICAgLy8gT3B0aW1pemF0aW9uOiBhIG1vbml0b3IgYWN0aW9uIGNhbid0IGNoYW5nZSBoaXN0b3J5LlxuICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBJbmZpbml0eTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29tcHV0ZWRTdGF0ZXMgPSByZWNvbXB1dGVTdGF0ZXMoXG4gICAgICBjb21wdXRlZFN0YXRlcyxcbiAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCxcbiAgICAgIHJlZHVjZXIsXG4gICAgICBjb21taXR0ZWRTdGF0ZSxcbiAgICAgIGFjdGlvbnNCeUlkLFxuICAgICAgc3RhZ2VkQWN0aW9uSWRzLFxuICAgICAgc2tpcHBlZEFjdGlvbklkcyxcbiAgICAgIGVycm9ySGFuZGxlcixcbiAgICAgIGlzUGF1c2VkXG4gICAgKTtcbiAgICBtb25pdG9yU3RhdGUgPSBtb25pdG9yUmVkdWNlcihtb25pdG9yU3RhdGUsIGxpZnRlZEFjdGlvbik7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbW9uaXRvclN0YXRlLFxuICAgICAgYWN0aW9uc0J5SWQsXG4gICAgICBuZXh0QWN0aW9uSWQsXG4gICAgICBzdGFnZWRBY3Rpb25JZHMsXG4gICAgICBza2lwcGVkQWN0aW9uSWRzLFxuICAgICAgY29tbWl0dGVkU3RhdGUsXG4gICAgICBjdXJyZW50U3RhdGVJbmRleCxcbiAgICAgIGNvbXB1dGVkU3RhdGVzLFxuICAgICAgaXNMb2NrZWQsXG4gICAgICBpc1BhdXNlZCxcbiAgICB9O1xuICB9O1xufVxuIl19