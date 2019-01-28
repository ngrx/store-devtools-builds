/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { UPDATE, INIT, } from '@ngrx/store';
import { difference, liftAction, isActionFiltered } from './utils';
import * as DevtoolsActions from './actions';
import { PerformAction } from './actions';
/** @typedef {?} */
var InitAction;
export { InitAction };
/** @typedef {?} */
var UpdateReducerAction;
export { UpdateReducerAction };
/** @typedef {?} */
var CoreActions;
export { CoreActions };
/** @typedef {?} */
var Actions;
export { Actions };
/** @type {?} */
export const INIT_ACTION = { type: INIT };
/** @type {?} */
export const RECOMPUTE = /** @type {?} */ ('@ngrx/store-devtools/recompute');
/** @type {?} */
export const RECOMPUTE_ACTION = { type: RECOMPUTE };
/**
 * @record
 */
export function ComputedState() { }
/** @type {?} */
ComputedState.prototype.state;
/** @type {?} */
ComputedState.prototype.error;
/**
 * @record
 */
export function LiftedAction() { }
/** @type {?} */
LiftedAction.prototype.type;
/** @type {?} */
LiftedAction.prototype.action;
/**
 * @record
 */
export function LiftedActions() { }
/**
 * @record
 */
export function LiftedState() { }
/** @type {?} */
LiftedState.prototype.monitorState;
/** @type {?} */
LiftedState.prototype.nextActionId;
/** @type {?} */
LiftedState.prototype.actionsById;
/** @type {?} */
LiftedState.prototype.stagedActionIds;
/** @type {?} */
LiftedState.prototype.skippedActionIds;
/** @type {?} */
LiftedState.prototype.committedState;
/** @type {?} */
LiftedState.prototype.currentStateIndex;
/** @type {?} */
LiftedState.prototype.computedStates;
/** @type {?} */
LiftedState.prototype.isLocked;
/** @type {?} */
LiftedState.prototype.isPaused;
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
            state,
            error: 'Interrupted by an error up the chain',
        };
    }
    /** @type {?} */
    let nextState = state;
    /** @type {?} */
    let nextError;
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
 * @param {?} isPaused
 * @return {?}
 */
function recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, errorHandler, isPaused) {
    // Optimization: exit early and return the same reference
    // if we know nothing could have changed.
    if (minInvalidatedStateIndex >= computedStates.length &&
        computedStates.length === stagedActionIds.length) {
        return computedStates;
    }
    /** @type {?} */
    const nextComputedStates = computedStates.slice(0, minInvalidatedStateIndex);
    /** @type {?} */
    const lastIncludedActionId = stagedActionIds.length - (isPaused ? 1 : 0);
    for (let i = minInvalidatedStateIndex; i < lastIncludedActionId; i++) {
        /** @type {?} */
        const actionId = stagedActionIds[i];
        /** @type {?} */
        const action = actionsById[actionId].action;
        /** @type {?} */
        const previousEntry = nextComputedStates[i - 1];
        /** @type {?} */
        const previousState = previousEntry ? previousEntry.state : committedState;
        /** @type {?} */
        const previousError = previousEntry ? previousEntry.error : undefined;
        /** @type {?} */
        const shouldSkip = skippedActionIds.indexOf(actionId) > -1;
        /** @type {?} */
        const entry = shouldSkip
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
/**
 * @param {?=} initialCommittedState
 * @param {?=} monitorReducer
 * @return {?}
 */
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
 * @param {?} initialCommittedState
 * @param {?} initialLiftedState
 * @param {?} errorHandler
 * @param {?=} monitorReducer
 * @param {?=} options
 * @return {?}
 */
export function liftReducerWith(initialCommittedState, initialLiftedState, errorHandler, monitorReducer, options = {}) {
    /**
       * Manages how the history actions modify the history state.
       */
    return (reducer) => (liftedState, liftedAction) => {
        let { monitorState, actionsById, nextActionId, stagedActionIds, skippedActionIds, committedState, currentStateIndex, computedStates, isLocked, isPaused, } = liftedState || initialLiftedState;
        if (!liftedState) {
            // Prevent mutating initialLiftedState
            actionsById = Object.create(actionsById);
        }
        /**
         * @param {?} n
         * @return {?}
         */
        function commitExcessActions(n) {
            /** @type {?} */
            let excess = n;
            /** @type {?} */
            let idsToDelete = stagedActionIds.slice(1, excess + 1);
            for (let i = 0; i < idsToDelete.length; i++) {
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
            skippedActionIds = skippedActionIds.filter(id => idsToDelete.indexOf(id) === -1);
            stagedActionIds = [0, ...stagedActionIds.slice(excess + 1)];
            committedState = computedStates[excess].state;
            computedStates = computedStates.slice(excess);
            currentStateIndex =
                currentStateIndex > excess ? currentStateIndex - excess : 0;
        }
        /**
         * @return {?}
         */
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
        /** @type {?} */
        let minInvalidatedStateIndex = 0;
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
                    stagedActionIds = [...stagedActionIds, nextActionId];
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
                const { id: actionId } = liftedAction;
                /** @type {?} */
                const index = skippedActionIds.indexOf(actionId);
                if (index === -1) {
                    skippedActionIds = [actionId, ...skippedActionIds];
                }
                else {
                    skippedActionIds = skippedActionIds.filter(id => id !== actionId);
                }
                // Optimization: we know history before this action hasn't changed
                minInvalidatedStateIndex = stagedActionIds.indexOf(actionId);
                break;
            }
            case DevtoolsActions.SET_ACTIONS_ACTIVE: {
                const { start, end, active } = liftedAction;
                /** @type {?} */
                const actionIds = [];
                for (let i = start; i < end; i++)
                    actionIds.push(i);
                if (active) {
                    skippedActionIds = difference(skippedActionIds, actionIds);
                }
                else {
                    skippedActionIds = [...skippedActionIds, ...actionIds];
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
                /** @type {?} */
                const index = stagedActionIds.indexOf(liftedAction.actionId);
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
                        isActionFiltered(liftedState.computedStates[currentStateIndex], liftedAction, options.predicate, options.actionsWhitelist, options.actionsBlacklist))) {
                    /** @type {?} */
                    const lastState = computedStates[computedStates.length - 1];
                    computedStates = [
                        ...computedStates.slice(0, -1),
                        computeNextEntry(reducer, liftedAction.action, lastState.state, lastState.error, errorHandler),
                    ];
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
                /** @type {?} */
                const actionId = nextActionId++;
                // Mutation! This is the hottest path, and we optimize on purpose.
                // It is safe because we set a new key in a cache dictionary.
                actionsById[actionId] = liftedAction;
                stagedActionIds = [...stagedActionIds, actionId];
                // Optimization: we know that only the new action needs computing.
                minInvalidatedStateIndex = stagedActionIds.length - 1;
                break;
            }
            case DevtoolsActions.IMPORT_STATE: {
                // Completely replace everything.
                ({
                    monitorState,
                    actionsById,
                    nextActionId,
                    stagedActionIds,
                    skippedActionIds,
                    committedState,
                    currentStateIndex,
                    computedStates,
                    isLocked,
                    // prettier-ignore
                    isPaused
                } = liftedAction.nextLiftedState);
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
                /** @type {?} */
                const stateHasErrors = computedStates.filter(state => state.error).length > 0;
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
                        /** @type {?} */
                        const actionId = nextActionId++;
                        actionsById[actionId] = new PerformAction(liftedAction, +Date.now());
                        stagedActionIds = [...stagedActionIds, actionId];
                        minInvalidatedStateIndex = stagedActionIds.length - 1;
                        computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, errorHandler, isPaused);
                    }
                    // Recompute state history with latest reducer and update action
                    computedStates = computedStates.map(cmp => (Object.assign({}, cmp, { state: reducer(cmp.state, RECOMPUTE_ACTION) })));
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
            monitorState,
            actionsById,
            nextActionId,
            stagedActionIds,
            skippedActionIds,
            committedState,
            currentStateIndex,
            computedStates,
            isLocked,
            isPaused,
        };
    };
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkdWNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvc3RvcmUtZGV2dG9vbHMvc3JjL3JlZHVjZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLE9BQU8sRUFLTCxNQUFNLEVBQ04sSUFBSSxHQUNMLE1BQU0sYUFBYSxDQUFDO0FBQ3JCLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ25FLE9BQU8sS0FBSyxlQUFlLE1BQU0sV0FBVyxDQUFDO0FBRTdDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxXQUFXLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FBYTFDLGFBQWEsV0FBVyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDOztBQUUxQyxhQUFhLFNBQVMscUJBQUcsZ0NBQW9FLEVBQUM7O0FBQzlGLGFBQWEsZ0JBQWdCLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdDcEQsU0FBUyxnQkFBZ0IsQ0FDdkIsT0FBZ0MsRUFDaEMsTUFBYyxFQUNkLEtBQVUsRUFDVixLQUFVLEVBQ1YsWUFBMEI7SUFFMUIsSUFBSSxLQUFLLEVBQUU7UUFDVCxPQUFPO1lBQ0wsS0FBSztZQUNMLEtBQUssRUFBRSxzQ0FBc0M7U0FDOUMsQ0FBQztLQUNIOztJQUVELElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQzs7SUFDdEIsSUFBSSxTQUFTLENBQUM7SUFDZCxJQUFJO1FBQ0YsU0FBUyxHQUFHLE9BQU8sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDcEM7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLFNBQVMsR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDM0IsWUFBWSxDQUFDLFdBQVcsQ0FBQyxH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RCxNQUFNO2FBQ1A7WUFDRCxPQUFPLENBQUMsQ0FBQzs7O2dCQUdQLHdCQUF3QixHQUFHLFFBQVEsQ0FBQztnQkFDcEMsTUFBTTthQUNQO1NBQ0Y7UUFFRCxjQUFjLEdBQUcsZUFBZSxDQUM5QixjQUFjLEVBQ2Qsd0JBQXdCLEVBQ3hCLE9BQU8sRUFDUCxjQUFjLEVBQ2QsV0FBVyxFQUNYLGVBQWUsRUFDZixnQkFBZ0IsRUFDaEIsWUFBWSxFQUNaLFFBQVEsQ0FDVCxDQUFDO1FBQ0YsWUFBWSxHQUFHLGNBQWMsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFFMUQsT0FBTztZQUNMLFlBQVk7WUFDWixXQUFXO1lBQ1gsWUFBWTtZQUNaLGVBQWU7WUFDZixnQkFBZ0I7WUFDaEIsY0FBYztZQUNkLGlCQUFpQjtZQUNqQixjQUFjO1lBQ2QsUUFBUTtZQUNSLFFBQVE7U0FDVCxDQUFDO0tBQ0gsQ0FBQztDQUNIIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXJyb3JIYW5kbGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBBY3Rpb24sXG4gIEFjdGlvblJlZHVjZXIsXG4gIEFjdGlvbnNTdWJqZWN0LFxuICBSZWR1Y2VyTWFuYWdlcixcbiAgVVBEQVRFLFxuICBJTklULFxufSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBkaWZmZXJlbmNlLCBsaWZ0QWN0aW9uLCBpc0FjdGlvbkZpbHRlcmVkIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgKiBhcyBEZXZ0b29sc0FjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7IFN0b3JlRGV2dG9vbHNDb25maWcsIFN0YXRlU2FuaXRpemVyIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgUGVyZm9ybUFjdGlvbiB9IGZyb20gJy4vYWN0aW9ucyc7XG5cbmV4cG9ydCB0eXBlIEluaXRBY3Rpb24gPSB7XG4gIHJlYWRvbmx5IHR5cGU6IHR5cGVvZiBJTklUO1xufTtcblxuZXhwb3J0IHR5cGUgVXBkYXRlUmVkdWNlckFjdGlvbiA9IHtcbiAgcmVhZG9ubHkgdHlwZTogdHlwZW9mIFVQREFURTtcbn07XG5cbmV4cG9ydCB0eXBlIENvcmVBY3Rpb25zID0gSW5pdEFjdGlvbiB8IFVwZGF0ZVJlZHVjZXJBY3Rpb247XG5leHBvcnQgdHlwZSBBY3Rpb25zID0gRGV2dG9vbHNBY3Rpb25zLkFsbCB8IENvcmVBY3Rpb25zO1xuXG5leHBvcnQgY29uc3QgSU5JVF9BQ1RJT04gPSB7IHR5cGU6IElOSVQgfTtcblxuZXhwb3J0IGNvbnN0IFJFQ09NUFVURSA9ICdAbmdyeC9zdG9yZS1kZXZ0b29scy9yZWNvbXB1dGUnIGFzICdAbmdyeC9zdG9yZS1kZXZ0b29scy9yZWNvbXB1dGUnO1xuZXhwb3J0IGNvbnN0IFJFQ09NUFVURV9BQ1RJT04gPSB7IHR5cGU6IFJFQ09NUFVURSB9O1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbXB1dGVkU3RhdGUge1xuICBzdGF0ZTogYW55O1xuICBlcnJvcjogYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZnRlZEFjdGlvbiB7XG4gIHR5cGU6IHN0cmluZztcbiAgYWN0aW9uOiBBY3Rpb247XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlmdGVkQWN0aW9ucyB7XG4gIFtpZDogbnVtYmVyXTogTGlmdGVkQWN0aW9uO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZnRlZFN0YXRlIHtcbiAgbW9uaXRvclN0YXRlOiBhbnk7XG4gIG5leHRBY3Rpb25JZDogbnVtYmVyO1xuICBhY3Rpb25zQnlJZDogTGlmdGVkQWN0aW9ucztcbiAgc3RhZ2VkQWN0aW9uSWRzOiBudW1iZXJbXTtcbiAgc2tpcHBlZEFjdGlvbklkczogbnVtYmVyW107XG4gIGNvbW1pdHRlZFN0YXRlOiBhbnk7XG4gIGN1cnJlbnRTdGF0ZUluZGV4OiBudW1iZXI7XG4gIGNvbXB1dGVkU3RhdGVzOiBDb21wdXRlZFN0YXRlW107XG4gIGlzTG9ja2VkOiBib29sZWFuO1xuICBpc1BhdXNlZDogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgbmV4dCBlbnRyeSBpbiB0aGUgbG9nIGJ5IGFwcGx5aW5nIGFuIGFjdGlvbi5cbiAqL1xuZnVuY3Rpb24gY29tcHV0ZU5leHRFbnRyeShcbiAgcmVkdWNlcjogQWN0aW9uUmVkdWNlcjxhbnksIGFueT4sXG4gIGFjdGlvbjogQWN0aW9uLFxuICBzdGF0ZTogYW55LFxuICBlcnJvcjogYW55LFxuICBlcnJvckhhbmRsZXI6IEVycm9ySGFuZGxlclxuKSB7XG4gIGlmIChlcnJvcikge1xuICAgIHJldHVybiB7XG4gICAgICBzdGF0ZSxcbiAgICAgIGVycm9yOiAnSW50ZXJydXB0ZWQgYnkgYW4gZXJyb3IgdXAgdGhlIGNoYWluJyxcbiAgICB9O1xuICB9XG5cbiAgbGV0IG5leHRTdGF0ZSA9IHN0YXRlO1xuICBsZXQgbmV4dEVycm9yO1xuICB0cnkge1xuICAgIG5leHRTdGF0ZSA9IHJlZHVjZXIoc3RhdGUsIGFjdGlvbik7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIG5leHRFcnJvciA9IGVyci50b1N0cmluZygpO1xuICAgIGVycm9ySGFuZGxlci5oYW5kbGVFcnJvcihlcnIuc3RhY2sgfHwgZXJyKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc3RhdGU6IG5leHRTdGF0ZSxcbiAgICBlcnJvcjogbmV4dEVycm9yLFxuICB9O1xufVxuXG4vKipcbiAqIFJ1bnMgdGhlIHJlZHVjZXIgb24gaW52YWxpZGF0ZWQgYWN0aW9ucyB0byBnZXQgYSBmcmVzaCBjb21wdXRhdGlvbiBsb2cuXG4gKi9cbmZ1bmN0aW9uIHJlY29tcHV0ZVN0YXRlcyhcbiAgY29tcHV0ZWRTdGF0ZXM6IENvbXB1dGVkU3RhdGVbXSxcbiAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4OiBudW1iZXIsXG4gIHJlZHVjZXI6IEFjdGlvblJlZHVjZXI8YW55LCBhbnk+LFxuICBjb21taXR0ZWRTdGF0ZTogYW55LFxuICBhY3Rpb25zQnlJZDogTGlmdGVkQWN0aW9ucyxcbiAgc3RhZ2VkQWN0aW9uSWRzOiBudW1iZXJbXSxcbiAgc2tpcHBlZEFjdGlvbklkczogbnVtYmVyW10sXG4gIGVycm9ySGFuZGxlcjogRXJyb3JIYW5kbGVyLFxuICBpc1BhdXNlZDogYm9vbGVhblxuKSB7XG4gIC8vIE9wdGltaXphdGlvbjogZXhpdCBlYXJseSBhbmQgcmV0dXJuIHRoZSBzYW1lIHJlZmVyZW5jZVxuICAvLyBpZiB3ZSBrbm93IG5vdGhpbmcgY291bGQgaGF2ZSBjaGFuZ2VkLlxuICBpZiAoXG4gICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID49IGNvbXB1dGVkU3RhdGVzLmxlbmd0aCAmJlxuICAgIGNvbXB1dGVkU3RhdGVzLmxlbmd0aCA9PT0gc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aFxuICApIHtcbiAgICByZXR1cm4gY29tcHV0ZWRTdGF0ZXM7XG4gIH1cblxuICBjb25zdCBuZXh0Q29tcHV0ZWRTdGF0ZXMgPSBjb21wdXRlZFN0YXRlcy5zbGljZSgwLCBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXgpO1xuICAvLyBJZiB0aGUgcmVjb3JkaW5nIGlzIHBhdXNlZCwgcmVjb21wdXRlIGFsbCBzdGF0ZXMgdXAgdW50aWwgdGhlIHBhdXNlIHN0YXRlLFxuICAvLyBlbHNlIHJlY29tcHV0ZSBhbGwgc3RhdGVzLlxuICBjb25zdCBsYXN0SW5jbHVkZWRBY3Rpb25JZCA9IHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSAoaXNQYXVzZWQgPyAxIDogMCk7XG4gIGZvciAobGV0IGkgPSBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXg7IGkgPCBsYXN0SW5jbHVkZWRBY3Rpb25JZDsgaSsrKSB7XG4gICAgY29uc3QgYWN0aW9uSWQgPSBzdGFnZWRBY3Rpb25JZHNbaV07XG4gICAgY29uc3QgYWN0aW9uID0gYWN0aW9uc0J5SWRbYWN0aW9uSWRdLmFjdGlvbjtcblxuICAgIGNvbnN0IHByZXZpb3VzRW50cnkgPSBuZXh0Q29tcHV0ZWRTdGF0ZXNbaSAtIDFdO1xuICAgIGNvbnN0IHByZXZpb3VzU3RhdGUgPSBwcmV2aW91c0VudHJ5ID8gcHJldmlvdXNFbnRyeS5zdGF0ZSA6IGNvbW1pdHRlZFN0YXRlO1xuICAgIGNvbnN0IHByZXZpb3VzRXJyb3IgPSBwcmV2aW91c0VudHJ5ID8gcHJldmlvdXNFbnRyeS5lcnJvciA6IHVuZGVmaW5lZDtcblxuICAgIGNvbnN0IHNob3VsZFNraXAgPSBza2lwcGVkQWN0aW9uSWRzLmluZGV4T2YoYWN0aW9uSWQpID4gLTE7XG4gICAgY29uc3QgZW50cnk6IENvbXB1dGVkU3RhdGUgPSBzaG91bGRTa2lwXG4gICAgICA/IHByZXZpb3VzRW50cnlcbiAgICAgIDogY29tcHV0ZU5leHRFbnRyeShcbiAgICAgICAgICByZWR1Y2VyLFxuICAgICAgICAgIGFjdGlvbixcbiAgICAgICAgICBwcmV2aW91c1N0YXRlLFxuICAgICAgICAgIHByZXZpb3VzRXJyb3IsXG4gICAgICAgICAgZXJyb3JIYW5kbGVyXG4gICAgICAgICk7XG5cbiAgICBuZXh0Q29tcHV0ZWRTdGF0ZXMucHVzaChlbnRyeSk7XG4gIH1cbiAgLy8gSWYgdGhlIHJlY29yZGluZyBpcyBwYXVzZWQsIHRoZSBsYXN0IHN0YXRlIHdpbGwgbm90IGJlIHJlY29tcHV0ZWQsXG4gIC8vIGJlY2F1c2UgaXQncyBlc3NlbnRpYWxseSBub3QgcGFydCBvZiB0aGUgc3RhdGUgaGlzdG9yeS5cbiAgaWYgKGlzUGF1c2VkKSB7XG4gICAgbmV4dENvbXB1dGVkU3RhdGVzLnB1c2goY29tcHV0ZWRTdGF0ZXNbY29tcHV0ZWRTdGF0ZXMubGVuZ3RoIC0gMV0pO1xuICB9XG5cbiAgcmV0dXJuIG5leHRDb21wdXRlZFN0YXRlcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpZnRJbml0aWFsU3RhdGUoXG4gIGluaXRpYWxDb21taXR0ZWRTdGF0ZT86IGFueSxcbiAgbW9uaXRvclJlZHVjZXI/OiBhbnlcbik6IExpZnRlZFN0YXRlIHtcbiAgcmV0dXJuIHtcbiAgICBtb25pdG9yU3RhdGU6IG1vbml0b3JSZWR1Y2VyKHVuZGVmaW5lZCwge30pLFxuICAgIG5leHRBY3Rpb25JZDogMSxcbiAgICBhY3Rpb25zQnlJZDogeyAwOiBsaWZ0QWN0aW9uKElOSVRfQUNUSU9OKSB9LFxuICAgIHN0YWdlZEFjdGlvbklkczogWzBdLFxuICAgIHNraXBwZWRBY3Rpb25JZHM6IFtdLFxuICAgIGNvbW1pdHRlZFN0YXRlOiBpbml0aWFsQ29tbWl0dGVkU3RhdGUsXG4gICAgY3VycmVudFN0YXRlSW5kZXg6IDAsXG4gICAgY29tcHV0ZWRTdGF0ZXM6IFtdLFxuICAgIGlzTG9ja2VkOiBmYWxzZSxcbiAgICBpc1BhdXNlZDogZmFsc2UsXG4gIH07XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGhpc3Rvcnkgc3RhdGUgcmVkdWNlciBmcm9tIGFuIGFwcCdzIHJlZHVjZXIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsaWZ0UmVkdWNlcldpdGgoXG4gIGluaXRpYWxDb21taXR0ZWRTdGF0ZTogYW55LFxuICBpbml0aWFsTGlmdGVkU3RhdGU6IExpZnRlZFN0YXRlLFxuICBlcnJvckhhbmRsZXI6IEVycm9ySGFuZGxlcixcbiAgbW9uaXRvclJlZHVjZXI/OiBhbnksXG4gIG9wdGlvbnM6IFBhcnRpYWw8U3RvcmVEZXZ0b29sc0NvbmZpZz4gPSB7fVxuKSB7XG4gIC8qKlxuICAgKiBNYW5hZ2VzIGhvdyB0aGUgaGlzdG9yeSBhY3Rpb25zIG1vZGlmeSB0aGUgaGlzdG9yeSBzdGF0ZS5cbiAgICovXG4gIHJldHVybiAoXG4gICAgcmVkdWNlcjogQWN0aW9uUmVkdWNlcjxhbnksIGFueT5cbiAgKTogQWN0aW9uUmVkdWNlcjxMaWZ0ZWRTdGF0ZSwgQWN0aW9ucz4gPT4gKGxpZnRlZFN0YXRlLCBsaWZ0ZWRBY3Rpb24pID0+IHtcbiAgICBsZXQge1xuICAgICAgbW9uaXRvclN0YXRlLFxuICAgICAgYWN0aW9uc0J5SWQsXG4gICAgICBuZXh0QWN0aW9uSWQsXG4gICAgICBzdGFnZWRBY3Rpb25JZHMsXG4gICAgICBza2lwcGVkQWN0aW9uSWRzLFxuICAgICAgY29tbWl0dGVkU3RhdGUsXG4gICAgICBjdXJyZW50U3RhdGVJbmRleCxcbiAgICAgIGNvbXB1dGVkU3RhdGVzLFxuICAgICAgaXNMb2NrZWQsXG4gICAgICBpc1BhdXNlZCxcbiAgICB9ID1cbiAgICAgIGxpZnRlZFN0YXRlIHx8IGluaXRpYWxMaWZ0ZWRTdGF0ZTtcblxuICAgIGlmICghbGlmdGVkU3RhdGUpIHtcbiAgICAgIC8vIFByZXZlbnQgbXV0YXRpbmcgaW5pdGlhbExpZnRlZFN0YXRlXG4gICAgICBhY3Rpb25zQnlJZCA9IE9iamVjdC5jcmVhdGUoYWN0aW9uc0J5SWQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbW1pdEV4Y2Vzc0FjdGlvbnMobjogbnVtYmVyKSB7XG4gICAgICAvLyBBdXRvLWNvbW1pdHMgbi1udW1iZXIgb2YgZXhjZXNzIGFjdGlvbnMuXG4gICAgICBsZXQgZXhjZXNzID0gbjtcbiAgICAgIGxldCBpZHNUb0RlbGV0ZSA9IHN0YWdlZEFjdGlvbklkcy5zbGljZSgxLCBleGNlc3MgKyAxKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpZHNUb0RlbGV0ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoY29tcHV0ZWRTdGF0ZXNbaSArIDFdLmVycm9yKSB7XG4gICAgICAgICAgLy8gU3RvcCBpZiBlcnJvciBpcyBmb3VuZC4gQ29tbWl0IGFjdGlvbnMgdXAgdG8gZXJyb3IuXG4gICAgICAgICAgZXhjZXNzID0gaTtcbiAgICAgICAgICBpZHNUb0RlbGV0ZSA9IHN0YWdlZEFjdGlvbklkcy5zbGljZSgxLCBleGNlc3MgKyAxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgYWN0aW9uc0J5SWRbaWRzVG9EZWxldGVbaV1dO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHNraXBwZWRBY3Rpb25JZHMgPSBza2lwcGVkQWN0aW9uSWRzLmZpbHRlcihcbiAgICAgICAgaWQgPT4gaWRzVG9EZWxldGUuaW5kZXhPZihpZCkgPT09IC0xXG4gICAgICApO1xuICAgICAgc3RhZ2VkQWN0aW9uSWRzID0gWzAsIC4uLnN0YWdlZEFjdGlvbklkcy5zbGljZShleGNlc3MgKyAxKV07XG4gICAgICBjb21taXR0ZWRTdGF0ZSA9IGNvbXB1dGVkU3RhdGVzW2V4Y2Vzc10uc3RhdGU7XG4gICAgICBjb21wdXRlZFN0YXRlcyA9IGNvbXB1dGVkU3RhdGVzLnNsaWNlKGV4Y2Vzcyk7XG4gICAgICBjdXJyZW50U3RhdGVJbmRleCA9XG4gICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4ID4gZXhjZXNzID8gY3VycmVudFN0YXRlSW5kZXggLSBleGNlc3MgOiAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbW1pdENoYW5nZXMoKSB7XG4gICAgICAvLyBDb25zaWRlciB0aGUgbGFzdCBjb21taXR0ZWQgc3RhdGUgdGhlIG5ldyBzdGFydGluZyBwb2ludC5cbiAgICAgIC8vIFNxdWFzaCBhbnkgc3RhZ2VkIGFjdGlvbnMgaW50byBhIHNpbmdsZSBjb21taXR0ZWQgc3RhdGUuXG4gICAgICBhY3Rpb25zQnlJZCA9IHsgMDogbGlmdEFjdGlvbihJTklUX0FDVElPTikgfTtcbiAgICAgIG5leHRBY3Rpb25JZCA9IDE7XG4gICAgICBzdGFnZWRBY3Rpb25JZHMgPSBbMF07XG4gICAgICBza2lwcGVkQWN0aW9uSWRzID0gW107XG4gICAgICBjb21taXR0ZWRTdGF0ZSA9IGNvbXB1dGVkU3RhdGVzW2N1cnJlbnRTdGF0ZUluZGV4XS5zdGF0ZTtcbiAgICAgIGN1cnJlbnRTdGF0ZUluZGV4ID0gMDtcbiAgICAgIGNvbXB1dGVkU3RhdGVzID0gW107XG4gICAgfVxuXG4gICAgLy8gQnkgZGVmYXVsdCwgYWdncmVzc2l2ZWx5IHJlY29tcHV0ZSBldmVyeSBzdGF0ZSB3aGF0ZXZlciBoYXBwZW5zLlxuICAgIC8vIFRoaXMgaGFzIE8obikgcGVyZm9ybWFuY2UsIHNvIHdlJ2xsIG92ZXJyaWRlIHRoaXMgdG8gYSBzZW5zaWJsZVxuICAgIC8vIHZhbHVlIHdoZW5ldmVyIHdlIGZlZWwgbGlrZSB3ZSBkb24ndCBoYXZlIHRvIHJlY29tcHV0ZSB0aGUgc3RhdGVzLlxuICAgIGxldCBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSAwO1xuXG4gICAgc3dpdGNoIChsaWZ0ZWRBY3Rpb24udHlwZSkge1xuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuTE9DS19DSEFOR0VTOiB7XG4gICAgICAgIGlzTG9ja2VkID0gbGlmdGVkQWN0aW9uLnN0YXR1cztcbiAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gSW5maW5pdHk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuUEFVU0VfUkVDT1JESU5HOiB7XG4gICAgICAgIGlzUGF1c2VkID0gbGlmdGVkQWN0aW9uLnN0YXR1cztcbiAgICAgICAgaWYgKGlzUGF1c2VkKSB7XG4gICAgICAgICAgLy8gQWRkIGEgcGF1c2UgYWN0aW9uIHRvIHNpZ25hbCB0aGUgZGV2dG9vbHMtdXNlciB0aGUgcmVjb3JkaW5nIGlzIHBhdXNlZC5cbiAgICAgICAgICAvLyBUaGUgY29ycmVzcG9uZGluZyBzdGF0ZSB3aWxsIGJlIG92ZXJ3cml0dGVuIG9uIGVhY2ggdXBkYXRlIHRvIGFsd2F5cyBjb250YWluXG4gICAgICAgICAgLy8gdGhlIGxhdGVzdCBzdGF0ZSAoc2VlIEFjdGlvbnMuUEVSRk9STV9BQ1RJT04pLlxuICAgICAgICAgIHN0YWdlZEFjdGlvbklkcyA9IFsuLi5zdGFnZWRBY3Rpb25JZHMsIG5leHRBY3Rpb25JZF07XG4gICAgICAgICAgYWN0aW9uc0J5SWRbbmV4dEFjdGlvbklkXSA9IG5ldyBQZXJmb3JtQWN0aW9uKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0eXBlOiAnQG5ncngvZGV2dG9vbHMvcGF1c2UnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICtEYXRlLm5vdygpXG4gICAgICAgICAgKTtcbiAgICAgICAgICBuZXh0QWN0aW9uSWQrKztcbiAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gMTtcbiAgICAgICAgICBjb21wdXRlZFN0YXRlcyA9IGNvbXB1dGVkU3RhdGVzLmNvbmNhdChcbiAgICAgICAgICAgIGNvbXB1dGVkU3RhdGVzW2NvbXB1dGVkU3RhdGVzLmxlbmd0aCAtIDFdXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGlmIChjdXJyZW50U3RhdGVJbmRleCA9PT0gc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIDIpIHtcbiAgICAgICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4Kys7XG4gICAgICAgICAgfVxuICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IEluZmluaXR5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbW1pdENoYW5nZXMoKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLlJFU0VUOiB7XG4gICAgICAgIC8vIEdldCBiYWNrIHRvIHRoZSBzdGF0ZSB0aGUgc3RvcmUgd2FzIGNyZWF0ZWQgd2l0aC5cbiAgICAgICAgYWN0aW9uc0J5SWQgPSB7IDA6IGxpZnRBY3Rpb24oSU5JVF9BQ1RJT04pIH07XG4gICAgICAgIG5leHRBY3Rpb25JZCA9IDE7XG4gICAgICAgIHN0YWdlZEFjdGlvbklkcyA9IFswXTtcbiAgICAgICAgc2tpcHBlZEFjdGlvbklkcyA9IFtdO1xuICAgICAgICBjb21taXR0ZWRTdGF0ZSA9IGluaXRpYWxDb21taXR0ZWRTdGF0ZTtcbiAgICAgICAgY3VycmVudFN0YXRlSW5kZXggPSAwO1xuICAgICAgICBjb21wdXRlZFN0YXRlcyA9IFtdO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLkNPTU1JVDoge1xuICAgICAgICBjb21taXRDaGFuZ2VzKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuUk9MTEJBQ0s6IHtcbiAgICAgICAgLy8gRm9yZ2V0IGFib3V0IGFueSBzdGFnZWQgYWN0aW9ucy5cbiAgICAgICAgLy8gU3RhcnQgYWdhaW4gZnJvbSB0aGUgbGFzdCBjb21taXR0ZWQgc3RhdGUuXG4gICAgICAgIGFjdGlvbnNCeUlkID0geyAwOiBsaWZ0QWN0aW9uKElOSVRfQUNUSU9OKSB9O1xuICAgICAgICBuZXh0QWN0aW9uSWQgPSAxO1xuICAgICAgICBzdGFnZWRBY3Rpb25JZHMgPSBbMF07XG4gICAgICAgIHNraXBwZWRBY3Rpb25JZHMgPSBbXTtcbiAgICAgICAgY3VycmVudFN0YXRlSW5kZXggPSAwO1xuICAgICAgICBjb21wdXRlZFN0YXRlcyA9IFtdO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLlRPR0dMRV9BQ1RJT046IHtcbiAgICAgICAgLy8gVG9nZ2xlIHdoZXRoZXIgYW4gYWN0aW9uIHdpdGggZ2l2ZW4gSUQgaXMgc2tpcHBlZC5cbiAgICAgICAgLy8gQmVpbmcgc2tpcHBlZCBtZWFucyBpdCBpcyBhIG5vLW9wIGR1cmluZyB0aGUgY29tcHV0YXRpb24uXG4gICAgICAgIGNvbnN0IHsgaWQ6IGFjdGlvbklkIH0gPSBsaWZ0ZWRBY3Rpb247XG4gICAgICAgIGNvbnN0IGluZGV4ID0gc2tpcHBlZEFjdGlvbklkcy5pbmRleE9mKGFjdGlvbklkKTtcbiAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICAgIHNraXBwZWRBY3Rpb25JZHMgPSBbYWN0aW9uSWQsIC4uLnNraXBwZWRBY3Rpb25JZHNdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNraXBwZWRBY3Rpb25JZHMgPSBza2lwcGVkQWN0aW9uSWRzLmZpbHRlcihpZCA9PiBpZCAhPT0gYWN0aW9uSWQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIE9wdGltaXphdGlvbjogd2Uga25vdyBoaXN0b3J5IGJlZm9yZSB0aGlzIGFjdGlvbiBoYXNuJ3QgY2hhbmdlZFxuICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBzdGFnZWRBY3Rpb25JZHMuaW5kZXhPZihhY3Rpb25JZCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuU0VUX0FDVElPTlNfQUNUSVZFOiB7XG4gICAgICAgIC8vIFRvZ2dsZSB3aGV0aGVyIGFuIGFjdGlvbiB3aXRoIGdpdmVuIElEIGlzIHNraXBwZWQuXG4gICAgICAgIC8vIEJlaW5nIHNraXBwZWQgbWVhbnMgaXQgaXMgYSBuby1vcCBkdXJpbmcgdGhlIGNvbXB1dGF0aW9uLlxuICAgICAgICBjb25zdCB7IHN0YXJ0LCBlbmQsIGFjdGl2ZSB9ID0gbGlmdGVkQWN0aW9uO1xuICAgICAgICBjb25zdCBhY3Rpb25JZHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIGFjdGlvbklkcy5wdXNoKGkpO1xuICAgICAgICBpZiAoYWN0aXZlKSB7XG4gICAgICAgICAgc2tpcHBlZEFjdGlvbklkcyA9IGRpZmZlcmVuY2Uoc2tpcHBlZEFjdGlvbklkcywgYWN0aW9uSWRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBza2lwcGVkQWN0aW9uSWRzID0gWy4uLnNraXBwZWRBY3Rpb25JZHMsIC4uLmFjdGlvbklkc107XG4gICAgICAgIH1cblxuICAgICAgICAvLyBPcHRpbWl6YXRpb246IHdlIGtub3cgaGlzdG9yeSBiZWZvcmUgdGhpcyBhY3Rpb24gaGFzbid0IGNoYW5nZWRcbiAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gc3RhZ2VkQWN0aW9uSWRzLmluZGV4T2Yoc3RhcnQpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLkpVTVBfVE9fU1RBVEU6IHtcbiAgICAgICAgLy8gV2l0aG91dCByZWNvbXB1dGluZyBhbnl0aGluZywgbW92ZSB0aGUgcG9pbnRlciB0aGF0IHRlbGwgdXNcbiAgICAgICAgLy8gd2hpY2ggc3RhdGUgaXMgY29uc2lkZXJlZCB0aGUgY3VycmVudCBvbmUuIFVzZWZ1bCBmb3Igc2xpZGVycy5cbiAgICAgICAgY3VycmVudFN0YXRlSW5kZXggPSBsaWZ0ZWRBY3Rpb24uaW5kZXg7XG4gICAgICAgIC8vIE9wdGltaXphdGlvbjogd2Uga25vdyB0aGUgaGlzdG9yeSBoYXMgbm90IGNoYW5nZWQuXG4gICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IEluZmluaXR5O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLkpVTVBfVE9fQUNUSU9OOiB7XG4gICAgICAgIC8vIEp1bXBzIHRvIGEgY29ycmVzcG9uZGluZyBzdGF0ZSB0byBhIHNwZWNpZmljIGFjdGlvbi5cbiAgICAgICAgLy8gVXNlZnVsIHdoZW4gZmlsdGVyaW5nIGFjdGlvbnMuXG4gICAgICAgIGNvbnN0IGluZGV4ID0gc3RhZ2VkQWN0aW9uSWRzLmluZGV4T2YobGlmdGVkQWN0aW9uLmFjdGlvbklkKTtcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkgY3VycmVudFN0YXRlSW5kZXggPSBpbmRleDtcbiAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gSW5maW5pdHk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuU1dFRVA6IHtcbiAgICAgICAgLy8gRm9yZ2V0IGFueSBhY3Rpb25zIHRoYXQgYXJlIGN1cnJlbnRseSBiZWluZyBza2lwcGVkLlxuICAgICAgICBzdGFnZWRBY3Rpb25JZHMgPSBkaWZmZXJlbmNlKHN0YWdlZEFjdGlvbklkcywgc2tpcHBlZEFjdGlvbklkcyk7XG4gICAgICAgIHNraXBwZWRBY3Rpb25JZHMgPSBbXTtcbiAgICAgICAgY3VycmVudFN0YXRlSW5kZXggPSBNYXRoLm1pbihcbiAgICAgICAgICBjdXJyZW50U3RhdGVJbmRleCxcbiAgICAgICAgICBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gMVxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLlBFUkZPUk1fQUNUSU9OOiB7XG4gICAgICAgIC8vIElnbm9yZSBhY3Rpb24gYW5kIHJldHVybiBzdGF0ZSBhcyBpcyBpZiByZWNvcmRpbmcgaXMgbG9ja2VkXG4gICAgICAgIGlmIChpc0xvY2tlZCkge1xuICAgICAgICAgIHJldHVybiBsaWZ0ZWRTdGF0ZSB8fCBpbml0aWFsTGlmdGVkU3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgaXNQYXVzZWQgfHxcbiAgICAgICAgICAobGlmdGVkU3RhdGUgJiZcbiAgICAgICAgICAgIGlzQWN0aW9uRmlsdGVyZWQoXG4gICAgICAgICAgICAgIGxpZnRlZFN0YXRlLmNvbXB1dGVkU3RhdGVzW2N1cnJlbnRTdGF0ZUluZGV4XSxcbiAgICAgICAgICAgICAgbGlmdGVkQWN0aW9uLFxuICAgICAgICAgICAgICBvcHRpb25zLnByZWRpY2F0ZSxcbiAgICAgICAgICAgICAgb3B0aW9ucy5hY3Rpb25zV2hpdGVsaXN0LFxuICAgICAgICAgICAgICBvcHRpb25zLmFjdGlvbnNCbGFja2xpc3RcbiAgICAgICAgICAgICkpXG4gICAgICAgICkge1xuICAgICAgICAgIC8vIElmIHJlY29yZGluZyBpcyBwYXVzZWQgb3IgaWYgdGhlIGFjdGlvbiBzaG91bGQgYmUgaWdub3JlZCwgb3ZlcndyaXRlIHRoZSBsYXN0IHN0YXRlXG4gICAgICAgICAgLy8gKGNvcnJlc3BvbmRzIHRvIHRoZSBwYXVzZSBhY3Rpb24pIGFuZCBrZWVwIGV2ZXJ5dGhpbmcgZWxzZSBhcyBpcy5cbiAgICAgICAgICAvLyBUaGlzIHdheSwgdGhlIGFwcCBnZXRzIHRoZSBuZXcgY3VycmVudCBzdGF0ZSB3aGlsZSB0aGUgZGV2dG9vbHNcbiAgICAgICAgICAvLyBkbyBub3QgcmVjb3JkIGFub3RoZXIgYWN0aW9uLlxuICAgICAgICAgIGNvbnN0IGxhc3RTdGF0ZSA9IGNvbXB1dGVkU3RhdGVzW2NvbXB1dGVkU3RhdGVzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgIGNvbXB1dGVkU3RhdGVzID0gW1xuICAgICAgICAgICAgLi4uY29tcHV0ZWRTdGF0ZXMuc2xpY2UoMCwgLTEpLFxuICAgICAgICAgICAgY29tcHV0ZU5leHRFbnRyeShcbiAgICAgICAgICAgICAgcmVkdWNlcixcbiAgICAgICAgICAgICAgbGlmdGVkQWN0aW9uLmFjdGlvbixcbiAgICAgICAgICAgICAgbGFzdFN0YXRlLnN0YXRlLFxuICAgICAgICAgICAgICBsYXN0U3RhdGUuZXJyb3IsXG4gICAgICAgICAgICAgIGVycm9ySGFuZGxlclxuICAgICAgICAgICAgKSxcbiAgICAgICAgICBdO1xuICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IEluZmluaXR5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXV0by1jb21taXQgYXMgbmV3IGFjdGlvbnMgY29tZSBpbi5cbiAgICAgICAgaWYgKG9wdGlvbnMubWF4QWdlICYmIHN0YWdlZEFjdGlvbklkcy5sZW5ndGggPT09IG9wdGlvbnMubWF4QWdlKSB7XG4gICAgICAgICAgY29tbWl0RXhjZXNzQWN0aW9ucygxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjdXJyZW50U3RhdGVJbmRleCA9PT0gc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBjdXJyZW50U3RhdGVJbmRleCsrO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFjdGlvbklkID0gbmV4dEFjdGlvbklkKys7XG4gICAgICAgIC8vIE11dGF0aW9uISBUaGlzIGlzIHRoZSBob3R0ZXN0IHBhdGgsIGFuZCB3ZSBvcHRpbWl6ZSBvbiBwdXJwb3NlLlxuICAgICAgICAvLyBJdCBpcyBzYWZlIGJlY2F1c2Ugd2Ugc2V0IGEgbmV3IGtleSBpbiBhIGNhY2hlIGRpY3Rpb25hcnkuXG4gICAgICAgIGFjdGlvbnNCeUlkW2FjdGlvbklkXSA9IGxpZnRlZEFjdGlvbjtcblxuICAgICAgICBzdGFnZWRBY3Rpb25JZHMgPSBbLi4uc3RhZ2VkQWN0aW9uSWRzLCBhY3Rpb25JZF07XG4gICAgICAgIC8vIE9wdGltaXphdGlvbjogd2Uga25vdyB0aGF0IG9ubHkgdGhlIG5ldyBhY3Rpb24gbmVlZHMgY29tcHV0aW5nLlxuICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gMTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIERldnRvb2xzQWN0aW9ucy5JTVBPUlRfU1RBVEU6IHtcbiAgICAgICAgLy8gQ29tcGxldGVseSByZXBsYWNlIGV2ZXJ5dGhpbmcuXG4gICAgICAgICh7XG4gICAgICAgICAgbW9uaXRvclN0YXRlLFxuICAgICAgICAgIGFjdGlvbnNCeUlkLFxuICAgICAgICAgIG5leHRBY3Rpb25JZCxcbiAgICAgICAgICBzdGFnZWRBY3Rpb25JZHMsXG4gICAgICAgICAgc2tpcHBlZEFjdGlvbklkcyxcbiAgICAgICAgICBjb21taXR0ZWRTdGF0ZSxcbiAgICAgICAgICBjdXJyZW50U3RhdGVJbmRleCxcbiAgICAgICAgICBjb21wdXRlZFN0YXRlcyxcbiAgICAgICAgICBpc0xvY2tlZCxcbiAgICAgICAgICAvLyBwcmV0dGllci1pZ25vcmVcbiAgICAgICAgICBpc1BhdXNlZFxuICAgICAgICB9ID0gbGlmdGVkQWN0aW9uLm5leHRMaWZ0ZWRTdGF0ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBJTklUOiB7XG4gICAgICAgIC8vIEFsd2F5cyByZWNvbXB1dGUgc3RhdGVzIG9uIGhvdCByZWxvYWQgYW5kIGluaXQuXG4gICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IDA7XG5cbiAgICAgICAgaWYgKG9wdGlvbnMubWF4QWdlICYmIHN0YWdlZEFjdGlvbklkcy5sZW5ndGggPiBvcHRpb25zLm1heEFnZSkge1xuICAgICAgICAgIC8vIFN0YXRlcyBtdXN0IGJlIHJlY29tcHV0ZWQgYmVmb3JlIGNvbW1pdHRpbmcgZXhjZXNzLlxuICAgICAgICAgIGNvbXB1dGVkU3RhdGVzID0gcmVjb21wdXRlU3RhdGVzKFxuICAgICAgICAgICAgY29tcHV0ZWRTdGF0ZXMsXG4gICAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXgsXG4gICAgICAgICAgICByZWR1Y2VyLFxuICAgICAgICAgICAgY29tbWl0dGVkU3RhdGUsXG4gICAgICAgICAgICBhY3Rpb25zQnlJZCxcbiAgICAgICAgICAgIHN0YWdlZEFjdGlvbklkcyxcbiAgICAgICAgICAgIHNraXBwZWRBY3Rpb25JZHMsXG4gICAgICAgICAgICBlcnJvckhhbmRsZXIsXG4gICAgICAgICAgICBpc1BhdXNlZFxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBjb21taXRFeGNlc3NBY3Rpb25zKHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSBvcHRpb25zLm1heEFnZSk7XG5cbiAgICAgICAgICAvLyBBdm9pZCBkb3VibGUgY29tcHV0YXRpb24uXG4gICAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gSW5maW5pdHk7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgVVBEQVRFOiB7XG4gICAgICAgIGNvbnN0IHN0YXRlSGFzRXJyb3JzID1cbiAgICAgICAgICBjb21wdXRlZFN0YXRlcy5maWx0ZXIoc3RhdGUgPT4gc3RhdGUuZXJyb3IpLmxlbmd0aCA+IDA7XG5cbiAgICAgICAgaWYgKHN0YXRlSGFzRXJyb3JzKSB7XG4gICAgICAgICAgLy8gUmVjb21wdXRlIGFsbCBzdGF0ZXNcbiAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSAwO1xuXG4gICAgICAgICAgaWYgKG9wdGlvbnMubWF4QWdlICYmIHN0YWdlZEFjdGlvbklkcy5sZW5ndGggPiBvcHRpb25zLm1heEFnZSkge1xuICAgICAgICAgICAgLy8gU3RhdGVzIG11c3QgYmUgcmVjb21wdXRlZCBiZWZvcmUgY29tbWl0dGluZyBleGNlc3MuXG4gICAgICAgICAgICBjb21wdXRlZFN0YXRlcyA9IHJlY29tcHV0ZVN0YXRlcyhcbiAgICAgICAgICAgICAgY29tcHV0ZWRTdGF0ZXMsXG4gICAgICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCxcbiAgICAgICAgICAgICAgcmVkdWNlcixcbiAgICAgICAgICAgICAgY29tbWl0dGVkU3RhdGUsXG4gICAgICAgICAgICAgIGFjdGlvbnNCeUlkLFxuICAgICAgICAgICAgICBzdGFnZWRBY3Rpb25JZHMsXG4gICAgICAgICAgICAgIHNraXBwZWRBY3Rpb25JZHMsXG4gICAgICAgICAgICAgIGVycm9ySGFuZGxlcixcbiAgICAgICAgICAgICAgaXNQYXVzZWRcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbW1pdEV4Y2Vzc0FjdGlvbnMoc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIG9wdGlvbnMubWF4QWdlKTtcblxuICAgICAgICAgICAgLy8gQXZvaWQgZG91YmxlIGNvbXB1dGF0aW9uLlxuICAgICAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gSW5maW5pdHk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIElmIG5vdCBwYXVzZWQvbG9ja2VkLCBhZGQgYSBuZXcgYWN0aW9uIHRvIHNpZ25hbCBkZXZ0b29scy11c2VyXG4gICAgICAgICAgLy8gdGhhdCB0aGVyZSB3YXMgYSByZWR1Y2VyIHVwZGF0ZS5cbiAgICAgICAgICBpZiAoIWlzUGF1c2VkICYmICFpc0xvY2tlZCkge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRTdGF0ZUluZGV4ID09PSBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICBjdXJyZW50U3RhdGVJbmRleCsrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBBZGQgYSBuZXcgYWN0aW9uIHRvIG9ubHkgcmVjb21wdXRlIHN0YXRlXG4gICAgICAgICAgICBjb25zdCBhY3Rpb25JZCA9IG5leHRBY3Rpb25JZCsrO1xuICAgICAgICAgICAgYWN0aW9uc0J5SWRbYWN0aW9uSWRdID0gbmV3IFBlcmZvcm1BY3Rpb24oXG4gICAgICAgICAgICAgIGxpZnRlZEFjdGlvbixcbiAgICAgICAgICAgICAgK0RhdGUubm93KClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBzdGFnZWRBY3Rpb25JZHMgPSBbLi4uc3RhZ2VkQWN0aW9uSWRzLCBhY3Rpb25JZF07XG5cbiAgICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSAxO1xuXG4gICAgICAgICAgICBjb21wdXRlZFN0YXRlcyA9IHJlY29tcHV0ZVN0YXRlcyhcbiAgICAgICAgICAgICAgY29tcHV0ZWRTdGF0ZXMsXG4gICAgICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCxcbiAgICAgICAgICAgICAgcmVkdWNlcixcbiAgICAgICAgICAgICAgY29tbWl0dGVkU3RhdGUsXG4gICAgICAgICAgICAgIGFjdGlvbnNCeUlkLFxuICAgICAgICAgICAgICBzdGFnZWRBY3Rpb25JZHMsXG4gICAgICAgICAgICAgIHNraXBwZWRBY3Rpb25JZHMsXG4gICAgICAgICAgICAgIGVycm9ySGFuZGxlcixcbiAgICAgICAgICAgICAgaXNQYXVzZWRcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gUmVjb21wdXRlIHN0YXRlIGhpc3Rvcnkgd2l0aCBsYXRlc3QgcmVkdWNlciBhbmQgdXBkYXRlIGFjdGlvblxuICAgICAgICAgIGNvbXB1dGVkU3RhdGVzID0gY29tcHV0ZWRTdGF0ZXMubWFwKGNtcCA9PiAoe1xuICAgICAgICAgICAgLi4uY21wLFxuICAgICAgICAgICAgc3RhdGU6IHJlZHVjZXIoY21wLnN0YXRlLCBSRUNPTVBVVEVfQUNUSU9OKSxcbiAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICBjdXJyZW50U3RhdGVJbmRleCA9IHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSAxO1xuXG4gICAgICAgICAgaWYgKG9wdGlvbnMubWF4QWdlICYmIHN0YWdlZEFjdGlvbklkcy5sZW5ndGggPiBvcHRpb25zLm1heEFnZSkge1xuICAgICAgICAgICAgY29tbWl0RXhjZXNzQWN0aW9ucyhzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gb3B0aW9ucy5tYXhBZ2UpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEF2b2lkIGRvdWJsZSBjb21wdXRhdGlvbi5cbiAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBJbmZpbml0eTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICAvLyBJZiB0aGUgYWN0aW9uIGlzIG5vdCByZWNvZ25pemVkLCBpdCdzIGEgbW9uaXRvciBhY3Rpb24uXG4gICAgICAgIC8vIE9wdGltaXphdGlvbjogYSBtb25pdG9yIGFjdGlvbiBjYW4ndCBjaGFuZ2UgaGlzdG9yeS5cbiAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gSW5maW5pdHk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbXB1dGVkU3RhdGVzID0gcmVjb21wdXRlU3RhdGVzKFxuICAgICAgY29tcHV0ZWRTdGF0ZXMsXG4gICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXgsXG4gICAgICByZWR1Y2VyLFxuICAgICAgY29tbWl0dGVkU3RhdGUsXG4gICAgICBhY3Rpb25zQnlJZCxcbiAgICAgIHN0YWdlZEFjdGlvbklkcyxcbiAgICAgIHNraXBwZWRBY3Rpb25JZHMsXG4gICAgICBlcnJvckhhbmRsZXIsXG4gICAgICBpc1BhdXNlZFxuICAgICk7XG4gICAgbW9uaXRvclN0YXRlID0gbW9uaXRvclJlZHVjZXIobW9uaXRvclN0YXRlLCBsaWZ0ZWRBY3Rpb24pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG1vbml0b3JTdGF0ZSxcbiAgICAgIGFjdGlvbnNCeUlkLFxuICAgICAgbmV4dEFjdGlvbklkLFxuICAgICAgc3RhZ2VkQWN0aW9uSWRzLFxuICAgICAgc2tpcHBlZEFjdGlvbklkcyxcbiAgICAgIGNvbW1pdHRlZFN0YXRlLFxuICAgICAgY3VycmVudFN0YXRlSW5kZXgsXG4gICAgICBjb21wdXRlZFN0YXRlcyxcbiAgICAgIGlzTG9ja2VkLFxuICAgICAgaXNQYXVzZWQsXG4gICAgfTtcbiAgfTtcbn1cbiJdfQ==