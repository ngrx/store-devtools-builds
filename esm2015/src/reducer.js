/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { UPDATE, INIT, } from '@ngrx/store';
import { difference, liftAction, isActionFiltered } from './utils';
import * as DevtoolsActions from './actions';
import { PerformAction } from './actions';
/** @type {?} */
export const INIT_ACTION = { type: INIT };
/** @type {?} */
export const RECOMPUTE = (/** @type {?} */ ('@ngrx/store-devtools/recompute'));
/** @type {?} */
export const RECOMPUTE_ACTION = { type: RECOMPUTE };
/**
 * @record
 */
export function ComputedState() { }
if (false) {
    /** @type {?} */
    ComputedState.prototype.state;
    /** @type {?} */
    ComputedState.prototype.error;
}
/**
 * @record
 */
export function LiftedAction() { }
if (false) {
    /** @type {?} */
    LiftedAction.prototype.type;
    /** @type {?} */
    LiftedAction.prototype.action;
}
/**
 * @record
 */
export function LiftedActions() { }
/**
 * @record
 */
export function LiftedState() { }
if (false) {
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
}
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
    // If the recording is paused, recompute all states up until the pause state,
    // else recompute all states.
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
    return (/**
     * @param {?} reducer
     * @return {?}
     */
    (reducer) => (/**
     * @param {?} liftedState
     * @param {?} liftedAction
     * @return {?}
     */
    (liftedState, liftedAction) => {
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
            // Auto-commits n-number of excess actions.
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
            skippedActionIds = skippedActionIds.filter((/**
             * @param {?} id
             * @return {?}
             */
            id => idsToDelete.indexOf(id) === -1));
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
        // By default, aggressively recompute every state whatever happens.
        // This has O(n) performance, so we'll override this to a sensible
        // value whenever we feel like we don't have to recompute the states.
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
                // Toggle whether an action with given ID is skipped.
                // Being skipped means it is a no-op during the computation.
                const { id: actionId } = liftedAction;
                /** @type {?} */
                const index = skippedActionIds.indexOf(actionId);
                if (index === -1) {
                    skippedActionIds = [actionId, ...skippedActionIds];
                }
                else {
                    skippedActionIds = skippedActionIds.filter((/**
                     * @param {?} id
                     * @return {?}
                     */
                    id => id !== actionId));
                }
                // Optimization: we know history before this action hasn't changed
                minInvalidatedStateIndex = stagedActionIds.indexOf(actionId);
                break;
            }
            case DevtoolsActions.SET_ACTIONS_ACTIVE: {
                // Toggle whether an action with given ID is skipped.
                // Being skipped means it is a no-op during the computation.
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
                // Jumps to a corresponding state to a specific action.
                // Useful when filtering actions.
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
                        isActionFiltered(liftedState.computedStates[currentStateIndex], liftedAction, options.predicate, options.actionsSafelist, options.actionsBlocklist))) {
                    // If recording is paused or if the action should be ignored, overwrite the last state
                    // (corresponds to the pause action) and keep everything else as is.
                    // This way, the app gets the new current state while the devtools
                    // do not record another action.
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
                const stateHasErrors = computedStates.filter((/**
                 * @param {?} state
                 * @return {?}
                 */
                state => state.error)).length > 0;
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
                        /** @type {?} */
                        const actionId = nextActionId++;
                        actionsById[actionId] = new PerformAction(liftedAction, +Date.now());
                        stagedActionIds = [...stagedActionIds, actionId];
                        minInvalidatedStateIndex = stagedActionIds.length - 1;
                        computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, errorHandler, isPaused);
                    }
                    // Recompute state history with latest reducer and update action
                    computedStates = computedStates.map((/**
                     * @param {?} cmp
                     * @return {?}
                     */
                    cmp => (Object.assign({}, cmp, { state: reducer(cmp.state, RECOMPUTE_ACTION) }))));
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
    }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkdWNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvc3RvcmUtZGV2dG9vbHMvc3JjL3JlZHVjZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLE9BQU8sRUFLTCxNQUFNLEVBQ04sSUFBSSxHQUNMLE1BQU0sYUFBYSxDQUFDO0FBQ3JCLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ25FLE9BQU8sS0FBSyxlQUFlLE1BQU0sV0FBVyxDQUFDO0FBRTdDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxXQUFXLENBQUM7O0FBYTFDLE1BQU0sT0FBTyxXQUFXLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFOztBQUV6QyxNQUFNLE9BQU8sU0FBUyxHQUFHLG1CQUFBLGdDQUFnQyxFQUFvQzs7QUFDN0YsTUFBTSxPQUFPLGdCQUFnQixHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRTs7OztBQUVuRCxtQ0FHQzs7O0lBRkMsOEJBQVc7O0lBQ1gsOEJBQVc7Ozs7O0FBR2Isa0NBR0M7OztJQUZDLDRCQUFhOztJQUNiLDhCQUFlOzs7OztBQUdqQixtQ0FFQzs7OztBQUVELGlDQVdDOzs7SUFWQyxtQ0FBa0I7O0lBQ2xCLG1DQUFxQjs7SUFDckIsa0NBQTJCOztJQUMzQixzQ0FBMEI7O0lBQzFCLHVDQUEyQjs7SUFDM0IscUNBQW9COztJQUNwQix3Q0FBMEI7O0lBQzFCLHFDQUFnQzs7SUFDaEMsK0JBQWtCOztJQUNsQiwrQkFBa0I7Ozs7Ozs7Ozs7O0FBTXBCLFNBQVMsZ0JBQWdCLENBQ3ZCLE9BQWdDLEVBQ2hDLE1BQWMsRUFDZCxLQUFVLEVBQ1YsS0FBVSxFQUNWLFlBQTBCO0lBRTFCLElBQUksS0FBSyxFQUFFO1FBQ1QsT0FBTztZQUNMLEtBQUs7WUFDTCxLQUFLLEVBQUUsc0NBQXNDO1NBQzlDLENBQUM7S0FDSDs7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UUFBUTtZQUNSLFFBQVE7U0FDVCxDQUFDO0lBQ0osQ0FBQyxDQUFBLEVBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXJyb3JIYW5kbGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBBY3Rpb24sXG4gIEFjdGlvblJlZHVjZXIsXG4gIEFjdGlvbnNTdWJqZWN0LFxuICBSZWR1Y2VyTWFuYWdlcixcbiAgVVBEQVRFLFxuICBJTklULFxufSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBkaWZmZXJlbmNlLCBsaWZ0QWN0aW9uLCBpc0FjdGlvbkZpbHRlcmVkIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgKiBhcyBEZXZ0b29sc0FjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7IFN0b3JlRGV2dG9vbHNDb25maWcsIFN0YXRlU2FuaXRpemVyIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgUGVyZm9ybUFjdGlvbiB9IGZyb20gJy4vYWN0aW9ucyc7XG5cbmV4cG9ydCB0eXBlIEluaXRBY3Rpb24gPSB7XG4gIHJlYWRvbmx5IHR5cGU6IHR5cGVvZiBJTklUO1xufTtcblxuZXhwb3J0IHR5cGUgVXBkYXRlUmVkdWNlckFjdGlvbiA9IHtcbiAgcmVhZG9ubHkgdHlwZTogdHlwZW9mIFVQREFURTtcbn07XG5cbmV4cG9ydCB0eXBlIENvcmVBY3Rpb25zID0gSW5pdEFjdGlvbiB8IFVwZGF0ZVJlZHVjZXJBY3Rpb247XG5leHBvcnQgdHlwZSBBY3Rpb25zID0gRGV2dG9vbHNBY3Rpb25zLkFsbCB8IENvcmVBY3Rpb25zO1xuXG5leHBvcnQgY29uc3QgSU5JVF9BQ1RJT04gPSB7IHR5cGU6IElOSVQgfTtcblxuZXhwb3J0IGNvbnN0IFJFQ09NUFVURSA9ICdAbmdyeC9zdG9yZS1kZXZ0b29scy9yZWNvbXB1dGUnIGFzICdAbmdyeC9zdG9yZS1kZXZ0b29scy9yZWNvbXB1dGUnO1xuZXhwb3J0IGNvbnN0IFJFQ09NUFVURV9BQ1RJT04gPSB7IHR5cGU6IFJFQ09NUFVURSB9O1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbXB1dGVkU3RhdGUge1xuICBzdGF0ZTogYW55O1xuICBlcnJvcjogYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZnRlZEFjdGlvbiB7XG4gIHR5cGU6IHN0cmluZztcbiAgYWN0aW9uOiBBY3Rpb247XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlmdGVkQWN0aW9ucyB7XG4gIFtpZDogbnVtYmVyXTogTGlmdGVkQWN0aW9uO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZnRlZFN0YXRlIHtcbiAgbW9uaXRvclN0YXRlOiBhbnk7XG4gIG5leHRBY3Rpb25JZDogbnVtYmVyO1xuICBhY3Rpb25zQnlJZDogTGlmdGVkQWN0aW9ucztcbiAgc3RhZ2VkQWN0aW9uSWRzOiBudW1iZXJbXTtcbiAgc2tpcHBlZEFjdGlvbklkczogbnVtYmVyW107XG4gIGNvbW1pdHRlZFN0YXRlOiBhbnk7XG4gIGN1cnJlbnRTdGF0ZUluZGV4OiBudW1iZXI7XG4gIGNvbXB1dGVkU3RhdGVzOiBDb21wdXRlZFN0YXRlW107XG4gIGlzTG9ja2VkOiBib29sZWFuO1xuICBpc1BhdXNlZDogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgbmV4dCBlbnRyeSBpbiB0aGUgbG9nIGJ5IGFwcGx5aW5nIGFuIGFjdGlvbi5cbiAqL1xuZnVuY3Rpb24gY29tcHV0ZU5leHRFbnRyeShcbiAgcmVkdWNlcjogQWN0aW9uUmVkdWNlcjxhbnksIGFueT4sXG4gIGFjdGlvbjogQWN0aW9uLFxuICBzdGF0ZTogYW55LFxuICBlcnJvcjogYW55LFxuICBlcnJvckhhbmRsZXI6IEVycm9ySGFuZGxlclxuKSB7XG4gIGlmIChlcnJvcikge1xuICAgIHJldHVybiB7XG4gICAgICBzdGF0ZSxcbiAgICAgIGVycm9yOiAnSW50ZXJydXB0ZWQgYnkgYW4gZXJyb3IgdXAgdGhlIGNoYWluJyxcbiAgICB9O1xuICB9XG5cbiAgbGV0IG5leHRTdGF0ZSA9IHN0YXRlO1xuICBsZXQgbmV4dEVycm9yO1xuICB0cnkge1xuICAgIG5leHRTdGF0ZSA9IHJlZHVjZXIoc3RhdGUsIGFjdGlvbik7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIG5leHRFcnJvciA9IGVyci50b1N0cmluZygpO1xuICAgIGVycm9ySGFuZGxlci5oYW5kbGVFcnJvcihlcnIuc3RhY2sgfHwgZXJyKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc3RhdGU6IG5leHRTdGF0ZSxcbiAgICBlcnJvcjogbmV4dEVycm9yLFxuICB9O1xufVxuXG4vKipcbiAqIFJ1bnMgdGhlIHJlZHVjZXIgb24gaW52YWxpZGF0ZWQgYWN0aW9ucyB0byBnZXQgYSBmcmVzaCBjb21wdXRhdGlvbiBsb2cuXG4gKi9cbmZ1bmN0aW9uIHJlY29tcHV0ZVN0YXRlcyhcbiAgY29tcHV0ZWRTdGF0ZXM6IENvbXB1dGVkU3RhdGVbXSxcbiAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4OiBudW1iZXIsXG4gIHJlZHVjZXI6IEFjdGlvblJlZHVjZXI8YW55LCBhbnk+LFxuICBjb21taXR0ZWRTdGF0ZTogYW55LFxuICBhY3Rpb25zQnlJZDogTGlmdGVkQWN0aW9ucyxcbiAgc3RhZ2VkQWN0aW9uSWRzOiBudW1iZXJbXSxcbiAgc2tpcHBlZEFjdGlvbklkczogbnVtYmVyW10sXG4gIGVycm9ySGFuZGxlcjogRXJyb3JIYW5kbGVyLFxuICBpc1BhdXNlZDogYm9vbGVhblxuKSB7XG4gIC8vIE9wdGltaXphdGlvbjogZXhpdCBlYXJseSBhbmQgcmV0dXJuIHRoZSBzYW1lIHJlZmVyZW5jZVxuICAvLyBpZiB3ZSBrbm93IG5vdGhpbmcgY291bGQgaGF2ZSBjaGFuZ2VkLlxuICBpZiAoXG4gICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID49IGNvbXB1dGVkU3RhdGVzLmxlbmd0aCAmJlxuICAgIGNvbXB1dGVkU3RhdGVzLmxlbmd0aCA9PT0gc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aFxuICApIHtcbiAgICByZXR1cm4gY29tcHV0ZWRTdGF0ZXM7XG4gIH1cblxuICBjb25zdCBuZXh0Q29tcHV0ZWRTdGF0ZXMgPSBjb21wdXRlZFN0YXRlcy5zbGljZSgwLCBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXgpO1xuICAvLyBJZiB0aGUgcmVjb3JkaW5nIGlzIHBhdXNlZCwgcmVjb21wdXRlIGFsbCBzdGF0ZXMgdXAgdW50aWwgdGhlIHBhdXNlIHN0YXRlLFxuICAvLyBlbHNlIHJlY29tcHV0ZSBhbGwgc3RhdGVzLlxuICBjb25zdCBsYXN0SW5jbHVkZWRBY3Rpb25JZCA9IHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSAoaXNQYXVzZWQgPyAxIDogMCk7XG4gIGZvciAobGV0IGkgPSBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXg7IGkgPCBsYXN0SW5jbHVkZWRBY3Rpb25JZDsgaSsrKSB7XG4gICAgY29uc3QgYWN0aW9uSWQgPSBzdGFnZWRBY3Rpb25JZHNbaV07XG4gICAgY29uc3QgYWN0aW9uID0gYWN0aW9uc0J5SWRbYWN0aW9uSWRdLmFjdGlvbjtcblxuICAgIGNvbnN0IHByZXZpb3VzRW50cnkgPSBuZXh0Q29tcHV0ZWRTdGF0ZXNbaSAtIDFdO1xuICAgIGNvbnN0IHByZXZpb3VzU3RhdGUgPSBwcmV2aW91c0VudHJ5ID8gcHJldmlvdXNFbnRyeS5zdGF0ZSA6IGNvbW1pdHRlZFN0YXRlO1xuICAgIGNvbnN0IHByZXZpb3VzRXJyb3IgPSBwcmV2aW91c0VudHJ5ID8gcHJldmlvdXNFbnRyeS5lcnJvciA6IHVuZGVmaW5lZDtcblxuICAgIGNvbnN0IHNob3VsZFNraXAgPSBza2lwcGVkQWN0aW9uSWRzLmluZGV4T2YoYWN0aW9uSWQpID4gLTE7XG4gICAgY29uc3QgZW50cnk6IENvbXB1dGVkU3RhdGUgPSBzaG91bGRTa2lwXG4gICAgICA/IHByZXZpb3VzRW50cnlcbiAgICAgIDogY29tcHV0ZU5leHRFbnRyeShcbiAgICAgICAgICByZWR1Y2VyLFxuICAgICAgICAgIGFjdGlvbixcbiAgICAgICAgICBwcmV2aW91c1N0YXRlLFxuICAgICAgICAgIHByZXZpb3VzRXJyb3IsXG4gICAgICAgICAgZXJyb3JIYW5kbGVyXG4gICAgICAgICk7XG5cbiAgICBuZXh0Q29tcHV0ZWRTdGF0ZXMucHVzaChlbnRyeSk7XG4gIH1cbiAgLy8gSWYgdGhlIHJlY29yZGluZyBpcyBwYXVzZWQsIHRoZSBsYXN0IHN0YXRlIHdpbGwgbm90IGJlIHJlY29tcHV0ZWQsXG4gIC8vIGJlY2F1c2UgaXQncyBlc3NlbnRpYWxseSBub3QgcGFydCBvZiB0aGUgc3RhdGUgaGlzdG9yeS5cbiAgaWYgKGlzUGF1c2VkKSB7XG4gICAgbmV4dENvbXB1dGVkU3RhdGVzLnB1c2goY29tcHV0ZWRTdGF0ZXNbY29tcHV0ZWRTdGF0ZXMubGVuZ3RoIC0gMV0pO1xuICB9XG5cbiAgcmV0dXJuIG5leHRDb21wdXRlZFN0YXRlcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpZnRJbml0aWFsU3RhdGUoXG4gIGluaXRpYWxDb21taXR0ZWRTdGF0ZT86IGFueSxcbiAgbW9uaXRvclJlZHVjZXI/OiBhbnlcbik6IExpZnRlZFN0YXRlIHtcbiAgcmV0dXJuIHtcbiAgICBtb25pdG9yU3RhdGU6IG1vbml0b3JSZWR1Y2VyKHVuZGVmaW5lZCwge30pLFxuICAgIG5leHRBY3Rpb25JZDogMSxcbiAgICBhY3Rpb25zQnlJZDogeyAwOiBsaWZ0QWN0aW9uKElOSVRfQUNUSU9OKSB9LFxuICAgIHN0YWdlZEFjdGlvbklkczogWzBdLFxuICAgIHNraXBwZWRBY3Rpb25JZHM6IFtdLFxuICAgIGNvbW1pdHRlZFN0YXRlOiBpbml0aWFsQ29tbWl0dGVkU3RhdGUsXG4gICAgY3VycmVudFN0YXRlSW5kZXg6IDAsXG4gICAgY29tcHV0ZWRTdGF0ZXM6IFtdLFxuICAgIGlzTG9ja2VkOiBmYWxzZSxcbiAgICBpc1BhdXNlZDogZmFsc2UsXG4gIH07XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGhpc3Rvcnkgc3RhdGUgcmVkdWNlciBmcm9tIGFuIGFwcCdzIHJlZHVjZXIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsaWZ0UmVkdWNlcldpdGgoXG4gIGluaXRpYWxDb21taXR0ZWRTdGF0ZTogYW55LFxuICBpbml0aWFsTGlmdGVkU3RhdGU6IExpZnRlZFN0YXRlLFxuICBlcnJvckhhbmRsZXI6IEVycm9ySGFuZGxlcixcbiAgbW9uaXRvclJlZHVjZXI/OiBhbnksXG4gIG9wdGlvbnM6IFBhcnRpYWw8U3RvcmVEZXZ0b29sc0NvbmZpZz4gPSB7fVxuKSB7XG4gIC8qKlxuICAgKiBNYW5hZ2VzIGhvdyB0aGUgaGlzdG9yeSBhY3Rpb25zIG1vZGlmeSB0aGUgaGlzdG9yeSBzdGF0ZS5cbiAgICovXG4gIHJldHVybiAoXG4gICAgcmVkdWNlcjogQWN0aW9uUmVkdWNlcjxhbnksIGFueT5cbiAgKTogQWN0aW9uUmVkdWNlcjxMaWZ0ZWRTdGF0ZSwgQWN0aW9ucz4gPT4gKGxpZnRlZFN0YXRlLCBsaWZ0ZWRBY3Rpb24pID0+IHtcbiAgICBsZXQge1xuICAgICAgbW9uaXRvclN0YXRlLFxuICAgICAgYWN0aW9uc0J5SWQsXG4gICAgICBuZXh0QWN0aW9uSWQsXG4gICAgICBzdGFnZWRBY3Rpb25JZHMsXG4gICAgICBza2lwcGVkQWN0aW9uSWRzLFxuICAgICAgY29tbWl0dGVkU3RhdGUsXG4gICAgICBjdXJyZW50U3RhdGVJbmRleCxcbiAgICAgIGNvbXB1dGVkU3RhdGVzLFxuICAgICAgaXNMb2NrZWQsXG4gICAgICBpc1BhdXNlZCxcbiAgICB9ID1cbiAgICAgIGxpZnRlZFN0YXRlIHx8IGluaXRpYWxMaWZ0ZWRTdGF0ZTtcblxuICAgIGlmICghbGlmdGVkU3RhdGUpIHtcbiAgICAgIC8vIFByZXZlbnQgbXV0YXRpbmcgaW5pdGlhbExpZnRlZFN0YXRlXG4gICAgICBhY3Rpb25zQnlJZCA9IE9iamVjdC5jcmVhdGUoYWN0aW9uc0J5SWQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbW1pdEV4Y2Vzc0FjdGlvbnMobjogbnVtYmVyKSB7XG4gICAgICAvLyBBdXRvLWNvbW1pdHMgbi1udW1iZXIgb2YgZXhjZXNzIGFjdGlvbnMuXG4gICAgICBsZXQgZXhjZXNzID0gbjtcbiAgICAgIGxldCBpZHNUb0RlbGV0ZSA9IHN0YWdlZEFjdGlvbklkcy5zbGljZSgxLCBleGNlc3MgKyAxKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpZHNUb0RlbGV0ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoY29tcHV0ZWRTdGF0ZXNbaSArIDFdLmVycm9yKSB7XG4gICAgICAgICAgLy8gU3RvcCBpZiBlcnJvciBpcyBmb3VuZC4gQ29tbWl0IGFjdGlvbnMgdXAgdG8gZXJyb3IuXG4gICAgICAgICAgZXhjZXNzID0gaTtcbiAgICAgICAgICBpZHNUb0RlbGV0ZSA9IHN0YWdlZEFjdGlvbklkcy5zbGljZSgxLCBleGNlc3MgKyAxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgYWN0aW9uc0J5SWRbaWRzVG9EZWxldGVbaV1dO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHNraXBwZWRBY3Rpb25JZHMgPSBza2lwcGVkQWN0aW9uSWRzLmZpbHRlcihcbiAgICAgICAgaWQgPT4gaWRzVG9EZWxldGUuaW5kZXhPZihpZCkgPT09IC0xXG4gICAgICApO1xuICAgICAgc3RhZ2VkQWN0aW9uSWRzID0gWzAsIC4uLnN0YWdlZEFjdGlvbklkcy5zbGljZShleGNlc3MgKyAxKV07XG4gICAgICBjb21taXR0ZWRTdGF0ZSA9IGNvbXB1dGVkU3RhdGVzW2V4Y2Vzc10uc3RhdGU7XG4gICAgICBjb21wdXRlZFN0YXRlcyA9IGNvbXB1dGVkU3RhdGVzLnNsaWNlKGV4Y2Vzcyk7XG4gICAgICBjdXJyZW50U3RhdGVJbmRleCA9XG4gICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4ID4gZXhjZXNzID8gY3VycmVudFN0YXRlSW5kZXggLSBleGNlc3MgOiAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbW1pdENoYW5nZXMoKSB7XG4gICAgICAvLyBDb25zaWRlciB0aGUgbGFzdCBjb21taXR0ZWQgc3RhdGUgdGhlIG5ldyBzdGFydGluZyBwb2ludC5cbiAgICAgIC8vIFNxdWFzaCBhbnkgc3RhZ2VkIGFjdGlvbnMgaW50byBhIHNpbmdsZSBjb21taXR0ZWQgc3RhdGUuXG4gICAgICBhY3Rpb25zQnlJZCA9IHsgMDogbGlmdEFjdGlvbihJTklUX0FDVElPTikgfTtcbiAgICAgIG5leHRBY3Rpb25JZCA9IDE7XG4gICAgICBzdGFnZWRBY3Rpb25JZHMgPSBbMF07XG4gICAgICBza2lwcGVkQWN0aW9uSWRzID0gW107XG4gICAgICBjb21taXR0ZWRTdGF0ZSA9IGNvbXB1dGVkU3RhdGVzW2N1cnJlbnRTdGF0ZUluZGV4XS5zdGF0ZTtcbiAgICAgIGN1cnJlbnRTdGF0ZUluZGV4ID0gMDtcbiAgICAgIGNvbXB1dGVkU3RhdGVzID0gW107XG4gICAgfVxuXG4gICAgLy8gQnkgZGVmYXVsdCwgYWdncmVzc2l2ZWx5IHJlY29tcHV0ZSBldmVyeSBzdGF0ZSB3aGF0ZXZlciBoYXBwZW5zLlxuICAgIC8vIFRoaXMgaGFzIE8obikgcGVyZm9ybWFuY2UsIHNvIHdlJ2xsIG92ZXJyaWRlIHRoaXMgdG8gYSBzZW5zaWJsZVxuICAgIC8vIHZhbHVlIHdoZW5ldmVyIHdlIGZlZWwgbGlrZSB3ZSBkb24ndCBoYXZlIHRvIHJlY29tcHV0ZSB0aGUgc3RhdGVzLlxuICAgIGxldCBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSAwO1xuXG4gICAgc3dpdGNoIChsaWZ0ZWRBY3Rpb24udHlwZSkge1xuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuTE9DS19DSEFOR0VTOiB7XG4gICAgICAgIGlzTG9ja2VkID0gbGlmdGVkQWN0aW9uLnN0YXR1cztcbiAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gSW5maW5pdHk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuUEFVU0VfUkVDT1JESU5HOiB7XG4gICAgICAgIGlzUGF1c2VkID0gbGlmdGVkQWN0aW9uLnN0YXR1cztcbiAgICAgICAgaWYgKGlzUGF1c2VkKSB7XG4gICAgICAgICAgLy8gQWRkIGEgcGF1c2UgYWN0aW9uIHRvIHNpZ25hbCB0aGUgZGV2dG9vbHMtdXNlciB0aGUgcmVjb3JkaW5nIGlzIHBhdXNlZC5cbiAgICAgICAgICAvLyBUaGUgY29ycmVzcG9uZGluZyBzdGF0ZSB3aWxsIGJlIG92ZXJ3cml0dGVuIG9uIGVhY2ggdXBkYXRlIHRvIGFsd2F5cyBjb250YWluXG4gICAgICAgICAgLy8gdGhlIGxhdGVzdCBzdGF0ZSAoc2VlIEFjdGlvbnMuUEVSRk9STV9BQ1RJT04pLlxuICAgICAgICAgIHN0YWdlZEFjdGlvbklkcyA9IFsuLi5zdGFnZWRBY3Rpb25JZHMsIG5leHRBY3Rpb25JZF07XG4gICAgICAgICAgYWN0aW9uc0J5SWRbbmV4dEFjdGlvbklkXSA9IG5ldyBQZXJmb3JtQWN0aW9uKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0eXBlOiAnQG5ncngvZGV2dG9vbHMvcGF1c2UnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICtEYXRlLm5vdygpXG4gICAgICAgICAgKTtcbiAgICAgICAgICBuZXh0QWN0aW9uSWQrKztcbiAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gMTtcbiAgICAgICAgICBjb21wdXRlZFN0YXRlcyA9IGNvbXB1dGVkU3RhdGVzLmNvbmNhdChcbiAgICAgICAgICAgIGNvbXB1dGVkU3RhdGVzW2NvbXB1dGVkU3RhdGVzLmxlbmd0aCAtIDFdXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGlmIChjdXJyZW50U3RhdGVJbmRleCA9PT0gc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIDIpIHtcbiAgICAgICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4Kys7XG4gICAgICAgICAgfVxuICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IEluZmluaXR5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbW1pdENoYW5nZXMoKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLlJFU0VUOiB7XG4gICAgICAgIC8vIEdldCBiYWNrIHRvIHRoZSBzdGF0ZSB0aGUgc3RvcmUgd2FzIGNyZWF0ZWQgd2l0aC5cbiAgICAgICAgYWN0aW9uc0J5SWQgPSB7IDA6IGxpZnRBY3Rpb24oSU5JVF9BQ1RJT04pIH07XG4gICAgICAgIG5leHRBY3Rpb25JZCA9IDE7XG4gICAgICAgIHN0YWdlZEFjdGlvbklkcyA9IFswXTtcbiAgICAgICAgc2tpcHBlZEFjdGlvbklkcyA9IFtdO1xuICAgICAgICBjb21taXR0ZWRTdGF0ZSA9IGluaXRpYWxDb21taXR0ZWRTdGF0ZTtcbiAgICAgICAgY3VycmVudFN0YXRlSW5kZXggPSAwO1xuICAgICAgICBjb21wdXRlZFN0YXRlcyA9IFtdO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLkNPTU1JVDoge1xuICAgICAgICBjb21taXRDaGFuZ2VzKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuUk9MTEJBQ0s6IHtcbiAgICAgICAgLy8gRm9yZ2V0IGFib3V0IGFueSBzdGFnZWQgYWN0aW9ucy5cbiAgICAgICAgLy8gU3RhcnQgYWdhaW4gZnJvbSB0aGUgbGFzdCBjb21taXR0ZWQgc3RhdGUuXG4gICAgICAgIGFjdGlvbnNCeUlkID0geyAwOiBsaWZ0QWN0aW9uKElOSVRfQUNUSU9OKSB9O1xuICAgICAgICBuZXh0QWN0aW9uSWQgPSAxO1xuICAgICAgICBzdGFnZWRBY3Rpb25JZHMgPSBbMF07XG4gICAgICAgIHNraXBwZWRBY3Rpb25JZHMgPSBbXTtcbiAgICAgICAgY3VycmVudFN0YXRlSW5kZXggPSAwO1xuICAgICAgICBjb21wdXRlZFN0YXRlcyA9IFtdO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLlRPR0dMRV9BQ1RJT046IHtcbiAgICAgICAgLy8gVG9nZ2xlIHdoZXRoZXIgYW4gYWN0aW9uIHdpdGggZ2l2ZW4gSUQgaXMgc2tpcHBlZC5cbiAgICAgICAgLy8gQmVpbmcgc2tpcHBlZCBtZWFucyBpdCBpcyBhIG5vLW9wIGR1cmluZyB0aGUgY29tcHV0YXRpb24uXG4gICAgICAgIGNvbnN0IHsgaWQ6IGFjdGlvbklkIH0gPSBsaWZ0ZWRBY3Rpb247XG4gICAgICAgIGNvbnN0IGluZGV4ID0gc2tpcHBlZEFjdGlvbklkcy5pbmRleE9mKGFjdGlvbklkKTtcbiAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICAgIHNraXBwZWRBY3Rpb25JZHMgPSBbYWN0aW9uSWQsIC4uLnNraXBwZWRBY3Rpb25JZHNdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNraXBwZWRBY3Rpb25JZHMgPSBza2lwcGVkQWN0aW9uSWRzLmZpbHRlcihpZCA9PiBpZCAhPT0gYWN0aW9uSWQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIE9wdGltaXphdGlvbjogd2Uga25vdyBoaXN0b3J5IGJlZm9yZSB0aGlzIGFjdGlvbiBoYXNuJ3QgY2hhbmdlZFxuICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBzdGFnZWRBY3Rpb25JZHMuaW5kZXhPZihhY3Rpb25JZCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuU0VUX0FDVElPTlNfQUNUSVZFOiB7XG4gICAgICAgIC8vIFRvZ2dsZSB3aGV0aGVyIGFuIGFjdGlvbiB3aXRoIGdpdmVuIElEIGlzIHNraXBwZWQuXG4gICAgICAgIC8vIEJlaW5nIHNraXBwZWQgbWVhbnMgaXQgaXMgYSBuby1vcCBkdXJpbmcgdGhlIGNvbXB1dGF0aW9uLlxuICAgICAgICBjb25zdCB7IHN0YXJ0LCBlbmQsIGFjdGl2ZSB9ID0gbGlmdGVkQWN0aW9uO1xuICAgICAgICBjb25zdCBhY3Rpb25JZHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIGFjdGlvbklkcy5wdXNoKGkpO1xuICAgICAgICBpZiAoYWN0aXZlKSB7XG4gICAgICAgICAgc2tpcHBlZEFjdGlvbklkcyA9IGRpZmZlcmVuY2Uoc2tpcHBlZEFjdGlvbklkcywgYWN0aW9uSWRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBza2lwcGVkQWN0aW9uSWRzID0gWy4uLnNraXBwZWRBY3Rpb25JZHMsIC4uLmFjdGlvbklkc107XG4gICAgICAgIH1cblxuICAgICAgICAvLyBPcHRpbWl6YXRpb246IHdlIGtub3cgaGlzdG9yeSBiZWZvcmUgdGhpcyBhY3Rpb24gaGFzbid0IGNoYW5nZWRcbiAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gc3RhZ2VkQWN0aW9uSWRzLmluZGV4T2Yoc3RhcnQpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLkpVTVBfVE9fU1RBVEU6IHtcbiAgICAgICAgLy8gV2l0aG91dCByZWNvbXB1dGluZyBhbnl0aGluZywgbW92ZSB0aGUgcG9pbnRlciB0aGF0IHRlbGwgdXNcbiAgICAgICAgLy8gd2hpY2ggc3RhdGUgaXMgY29uc2lkZXJlZCB0aGUgY3VycmVudCBvbmUuIFVzZWZ1bCBmb3Igc2xpZGVycy5cbiAgICAgICAgY3VycmVudFN0YXRlSW5kZXggPSBsaWZ0ZWRBY3Rpb24uaW5kZXg7XG4gICAgICAgIC8vIE9wdGltaXphdGlvbjogd2Uga25vdyB0aGUgaGlzdG9yeSBoYXMgbm90IGNoYW5nZWQuXG4gICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IEluZmluaXR5O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLkpVTVBfVE9fQUNUSU9OOiB7XG4gICAgICAgIC8vIEp1bXBzIHRvIGEgY29ycmVzcG9uZGluZyBzdGF0ZSB0byBhIHNwZWNpZmljIGFjdGlvbi5cbiAgICAgICAgLy8gVXNlZnVsIHdoZW4gZmlsdGVyaW5nIGFjdGlvbnMuXG4gICAgICAgIGNvbnN0IGluZGV4ID0gc3RhZ2VkQWN0aW9uSWRzLmluZGV4T2YobGlmdGVkQWN0aW9uLmFjdGlvbklkKTtcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkgY3VycmVudFN0YXRlSW5kZXggPSBpbmRleDtcbiAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gSW5maW5pdHk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuU1dFRVA6IHtcbiAgICAgICAgLy8gRm9yZ2V0IGFueSBhY3Rpb25zIHRoYXQgYXJlIGN1cnJlbnRseSBiZWluZyBza2lwcGVkLlxuICAgICAgICBzdGFnZWRBY3Rpb25JZHMgPSBkaWZmZXJlbmNlKHN0YWdlZEFjdGlvbklkcywgc2tpcHBlZEFjdGlvbklkcyk7XG4gICAgICAgIHNraXBwZWRBY3Rpb25JZHMgPSBbXTtcbiAgICAgICAgY3VycmVudFN0YXRlSW5kZXggPSBNYXRoLm1pbihcbiAgICAgICAgICBjdXJyZW50U3RhdGVJbmRleCxcbiAgICAgICAgICBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gMVxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLlBFUkZPUk1fQUNUSU9OOiB7XG4gICAgICAgIC8vIElnbm9yZSBhY3Rpb24gYW5kIHJldHVybiBzdGF0ZSBhcyBpcyBpZiByZWNvcmRpbmcgaXMgbG9ja2VkXG4gICAgICAgIGlmIChpc0xvY2tlZCkge1xuICAgICAgICAgIHJldHVybiBsaWZ0ZWRTdGF0ZSB8fCBpbml0aWFsTGlmdGVkU3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgaXNQYXVzZWQgfHxcbiAgICAgICAgICAobGlmdGVkU3RhdGUgJiZcbiAgICAgICAgICAgIGlzQWN0aW9uRmlsdGVyZWQoXG4gICAgICAgICAgICAgIGxpZnRlZFN0YXRlLmNvbXB1dGVkU3RhdGVzW2N1cnJlbnRTdGF0ZUluZGV4XSxcbiAgICAgICAgICAgICAgbGlmdGVkQWN0aW9uLFxuICAgICAgICAgICAgICBvcHRpb25zLnByZWRpY2F0ZSxcbiAgICAgICAgICAgICAgb3B0aW9ucy5hY3Rpb25zU2FmZWxpc3QsXG4gICAgICAgICAgICAgIG9wdGlvbnMuYWN0aW9uc0Jsb2NrbGlzdFxuICAgICAgICAgICAgKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgLy8gSWYgcmVjb3JkaW5nIGlzIHBhdXNlZCBvciBpZiB0aGUgYWN0aW9uIHNob3VsZCBiZSBpZ25vcmVkLCBvdmVyd3JpdGUgdGhlIGxhc3Qgc3RhdGVcbiAgICAgICAgICAvLyAoY29ycmVzcG9uZHMgdG8gdGhlIHBhdXNlIGFjdGlvbikgYW5kIGtlZXAgZXZlcnl0aGluZyBlbHNlIGFzIGlzLlxuICAgICAgICAgIC8vIFRoaXMgd2F5LCB0aGUgYXBwIGdldHMgdGhlIG5ldyBjdXJyZW50IHN0YXRlIHdoaWxlIHRoZSBkZXZ0b29sc1xuICAgICAgICAgIC8vIGRvIG5vdCByZWNvcmQgYW5vdGhlciBhY3Rpb24uXG4gICAgICAgICAgY29uc3QgbGFzdFN0YXRlID0gY29tcHV0ZWRTdGF0ZXNbY29tcHV0ZWRTdGF0ZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgY29tcHV0ZWRTdGF0ZXMgPSBbXG4gICAgICAgICAgICAuLi5jb21wdXRlZFN0YXRlcy5zbGljZSgwLCAtMSksXG4gICAgICAgICAgICBjb21wdXRlTmV4dEVudHJ5KFxuICAgICAgICAgICAgICByZWR1Y2VyLFxuICAgICAgICAgICAgICBsaWZ0ZWRBY3Rpb24uYWN0aW9uLFxuICAgICAgICAgICAgICBsYXN0U3RhdGUuc3RhdGUsXG4gICAgICAgICAgICAgIGxhc3RTdGF0ZS5lcnJvcixcbiAgICAgICAgICAgICAgZXJyb3JIYW5kbGVyXG4gICAgICAgICAgICApLFxuICAgICAgICAgIF07XG4gICAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gSW5maW5pdHk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBdXRvLWNvbW1pdCBhcyBuZXcgYWN0aW9ucyBjb21lIGluLlxuICAgICAgICBpZiAob3B0aW9ucy5tYXhBZ2UgJiYgc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCA9PT0gb3B0aW9ucy5tYXhBZ2UpIHtcbiAgICAgICAgICBjb21taXRFeGNlc3NBY3Rpb25zKDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGN1cnJlbnRTdGF0ZUluZGV4ID09PSBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4Kys7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYWN0aW9uSWQgPSBuZXh0QWN0aW9uSWQrKztcbiAgICAgICAgLy8gTXV0YXRpb24hIFRoaXMgaXMgdGhlIGhvdHRlc3QgcGF0aCwgYW5kIHdlIG9wdGltaXplIG9uIHB1cnBvc2UuXG4gICAgICAgIC8vIEl0IGlzIHNhZmUgYmVjYXVzZSB3ZSBzZXQgYSBuZXcga2V5IGluIGEgY2FjaGUgZGljdGlvbmFyeS5cbiAgICAgICAgYWN0aW9uc0J5SWRbYWN0aW9uSWRdID0gbGlmdGVkQWN0aW9uO1xuXG4gICAgICAgIHN0YWdlZEFjdGlvbklkcyA9IFsuLi5zdGFnZWRBY3Rpb25JZHMsIGFjdGlvbklkXTtcbiAgICAgICAgLy8gT3B0aW1pemF0aW9uOiB3ZSBrbm93IHRoYXQgb25seSB0aGUgbmV3IGFjdGlvbiBuZWVkcyBjb21wdXRpbmcuXG4gICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSAxO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLklNUE9SVF9TVEFURToge1xuICAgICAgICAvLyBDb21wbGV0ZWx5IHJlcGxhY2UgZXZlcnl0aGluZy5cbiAgICAgICAgKHtcbiAgICAgICAgICBtb25pdG9yU3RhdGUsXG4gICAgICAgICAgYWN0aW9uc0J5SWQsXG4gICAgICAgICAgbmV4dEFjdGlvbklkLFxuICAgICAgICAgIHN0YWdlZEFjdGlvbklkcyxcbiAgICAgICAgICBza2lwcGVkQWN0aW9uSWRzLFxuICAgICAgICAgIGNvbW1pdHRlZFN0YXRlLFxuICAgICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4LFxuICAgICAgICAgIGNvbXB1dGVkU3RhdGVzLFxuICAgICAgICAgIGlzTG9ja2VkLFxuICAgICAgICAgIC8vIHByZXR0aWVyLWlnbm9yZVxuICAgICAgICAgIGlzUGF1c2VkXG4gICAgICAgIH0gPSBsaWZ0ZWRBY3Rpb24ubmV4dExpZnRlZFN0YXRlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIElOSVQ6IHtcbiAgICAgICAgLy8gQWx3YXlzIHJlY29tcHV0ZSBzdGF0ZXMgb24gaG90IHJlbG9hZCBhbmQgaW5pdC5cbiAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gMDtcblxuICAgICAgICBpZiAob3B0aW9ucy5tYXhBZ2UgJiYgc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCA+IG9wdGlvbnMubWF4QWdlKSB7XG4gICAgICAgICAgLy8gU3RhdGVzIG11c3QgYmUgcmVjb21wdXRlZCBiZWZvcmUgY29tbWl0dGluZyBleGNlc3MuXG4gICAgICAgICAgY29tcHV0ZWRTdGF0ZXMgPSByZWNvbXB1dGVTdGF0ZXMoXG4gICAgICAgICAgICBjb21wdXRlZFN0YXRlcyxcbiAgICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCxcbiAgICAgICAgICAgIHJlZHVjZXIsXG4gICAgICAgICAgICBjb21taXR0ZWRTdGF0ZSxcbiAgICAgICAgICAgIGFjdGlvbnNCeUlkLFxuICAgICAgICAgICAgc3RhZ2VkQWN0aW9uSWRzLFxuICAgICAgICAgICAgc2tpcHBlZEFjdGlvbklkcyxcbiAgICAgICAgICAgIGVycm9ySGFuZGxlcixcbiAgICAgICAgICAgIGlzUGF1c2VkXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGNvbW1pdEV4Y2Vzc0FjdGlvbnMoc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIG9wdGlvbnMubWF4QWdlKTtcblxuICAgICAgICAgIC8vIEF2b2lkIGRvdWJsZSBjb21wdXRhdGlvbi5cbiAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBJbmZpbml0eTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBVUERBVEU6IHtcbiAgICAgICAgY29uc3Qgc3RhdGVIYXNFcnJvcnMgPVxuICAgICAgICAgIGNvbXB1dGVkU3RhdGVzLmZpbHRlcihzdGF0ZSA9PiBzdGF0ZS5lcnJvcikubGVuZ3RoID4gMDtcblxuICAgICAgICBpZiAoc3RhdGVIYXNFcnJvcnMpIHtcbiAgICAgICAgICAvLyBSZWNvbXB1dGUgYWxsIHN0YXRlc1xuICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IDA7XG5cbiAgICAgICAgICBpZiAob3B0aW9ucy5tYXhBZ2UgJiYgc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCA+IG9wdGlvbnMubWF4QWdlKSB7XG4gICAgICAgICAgICAvLyBTdGF0ZXMgbXVzdCBiZSByZWNvbXB1dGVkIGJlZm9yZSBjb21taXR0aW5nIGV4Y2Vzcy5cbiAgICAgICAgICAgIGNvbXB1dGVkU3RhdGVzID0gcmVjb21wdXRlU3RhdGVzKFxuICAgICAgICAgICAgICBjb21wdXRlZFN0YXRlcyxcbiAgICAgICAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4LFxuICAgICAgICAgICAgICByZWR1Y2VyLFxuICAgICAgICAgICAgICBjb21taXR0ZWRTdGF0ZSxcbiAgICAgICAgICAgICAgYWN0aW9uc0J5SWQsXG4gICAgICAgICAgICAgIHN0YWdlZEFjdGlvbklkcyxcbiAgICAgICAgICAgICAgc2tpcHBlZEFjdGlvbklkcyxcbiAgICAgICAgICAgICAgZXJyb3JIYW5kbGVyLFxuICAgICAgICAgICAgICBpc1BhdXNlZFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29tbWl0RXhjZXNzQWN0aW9ucyhzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gb3B0aW9ucy5tYXhBZ2UpO1xuXG4gICAgICAgICAgICAvLyBBdm9pZCBkb3VibGUgY29tcHV0YXRpb24uXG4gICAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBJbmZpbml0eTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gSWYgbm90IHBhdXNlZC9sb2NrZWQsIGFkZCBhIG5ldyBhY3Rpb24gdG8gc2lnbmFsIGRldnRvb2xzLXVzZXJcbiAgICAgICAgICAvLyB0aGF0IHRoZXJlIHdhcyBhIHJlZHVjZXIgdXBkYXRlLlxuICAgICAgICAgIGlmICghaXNQYXVzZWQgJiYgIWlzTG9ja2VkKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFN0YXRlSW5kZXggPT09IHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4Kys7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEFkZCBhIG5ldyBhY3Rpb24gdG8gb25seSByZWNvbXB1dGUgc3RhdGVcbiAgICAgICAgICAgIGNvbnN0IGFjdGlvbklkID0gbmV4dEFjdGlvbklkKys7XG4gICAgICAgICAgICBhY3Rpb25zQnlJZFthY3Rpb25JZF0gPSBuZXcgUGVyZm9ybUFjdGlvbihcbiAgICAgICAgICAgICAgbGlmdGVkQWN0aW9uLFxuICAgICAgICAgICAgICArRGF0ZS5ub3coKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHN0YWdlZEFjdGlvbklkcyA9IFsuLi5zdGFnZWRBY3Rpb25JZHMsIGFjdGlvbklkXTtcblxuICAgICAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIDE7XG5cbiAgICAgICAgICAgIGNvbXB1dGVkU3RhdGVzID0gcmVjb21wdXRlU3RhdGVzKFxuICAgICAgICAgICAgICBjb21wdXRlZFN0YXRlcyxcbiAgICAgICAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4LFxuICAgICAgICAgICAgICByZWR1Y2VyLFxuICAgICAgICAgICAgICBjb21taXR0ZWRTdGF0ZSxcbiAgICAgICAgICAgICAgYWN0aW9uc0J5SWQsXG4gICAgICAgICAgICAgIHN0YWdlZEFjdGlvbklkcyxcbiAgICAgICAgICAgICAgc2tpcHBlZEFjdGlvbklkcyxcbiAgICAgICAgICAgICAgZXJyb3JIYW5kbGVyLFxuICAgICAgICAgICAgICBpc1BhdXNlZFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBSZWNvbXB1dGUgc3RhdGUgaGlzdG9yeSB3aXRoIGxhdGVzdCByZWR1Y2VyIGFuZCB1cGRhdGUgYWN0aW9uXG4gICAgICAgICAgY29tcHV0ZWRTdGF0ZXMgPSBjb21wdXRlZFN0YXRlcy5tYXAoY21wID0+ICh7XG4gICAgICAgICAgICAuLi5jbXAsXG4gICAgICAgICAgICBzdGF0ZTogcmVkdWNlcihjbXAuc3RhdGUsIFJFQ09NUFVURV9BQ1RJT04pLFxuICAgICAgICAgIH0pKTtcblxuICAgICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4ID0gc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIDE7XG5cbiAgICAgICAgICBpZiAob3B0aW9ucy5tYXhBZ2UgJiYgc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCA+IG9wdGlvbnMubWF4QWdlKSB7XG4gICAgICAgICAgICBjb21taXRFeGNlc3NBY3Rpb25zKHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSBvcHRpb25zLm1heEFnZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQXZvaWQgZG91YmxlIGNvbXB1dGF0aW9uLlxuICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IEluZmluaXR5O1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIC8vIElmIHRoZSBhY3Rpb24gaXMgbm90IHJlY29nbml6ZWQsIGl0J3MgYSBtb25pdG9yIGFjdGlvbi5cbiAgICAgICAgLy8gT3B0aW1pemF0aW9uOiBhIG1vbml0b3IgYWN0aW9uIGNhbid0IGNoYW5nZSBoaXN0b3J5LlxuICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBJbmZpbml0eTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29tcHV0ZWRTdGF0ZXMgPSByZWNvbXB1dGVTdGF0ZXMoXG4gICAgICBjb21wdXRlZFN0YXRlcyxcbiAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCxcbiAgICAgIHJlZHVjZXIsXG4gICAgICBjb21taXR0ZWRTdGF0ZSxcbiAgICAgIGFjdGlvbnNCeUlkLFxuICAgICAgc3RhZ2VkQWN0aW9uSWRzLFxuICAgICAgc2tpcHBlZEFjdGlvbklkcyxcbiAgICAgIGVycm9ySGFuZGxlcixcbiAgICAgIGlzUGF1c2VkXG4gICAgKTtcbiAgICBtb25pdG9yU3RhdGUgPSBtb25pdG9yUmVkdWNlcihtb25pdG9yU3RhdGUsIGxpZnRlZEFjdGlvbik7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbW9uaXRvclN0YXRlLFxuICAgICAgYWN0aW9uc0J5SWQsXG4gICAgICBuZXh0QWN0aW9uSWQsXG4gICAgICBzdGFnZWRBY3Rpb25JZHMsXG4gICAgICBza2lwcGVkQWN0aW9uSWRzLFxuICAgICAgY29tbWl0dGVkU3RhdGUsXG4gICAgICBjdXJyZW50U3RhdGVJbmRleCxcbiAgICAgIGNvbXB1dGVkU3RhdGVzLFxuICAgICAgaXNMb2NrZWQsXG4gICAgICBpc1BhdXNlZCxcbiAgICB9O1xuICB9O1xufVxuIl19