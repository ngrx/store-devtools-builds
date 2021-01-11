/**
 * @fileoverview added by tsickle
 * Generated from: src/reducer.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { UPDATE, INIT } from '@ngrx/store';
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
        errorHandler.handleError(err);
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
            (id) => idsToDelete.indexOf(id) === -1));
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
                    (id) => id !== actionId));
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
                    isPaused,
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
                (state) => state.error)).length > 0;
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
                    (cmp) => (Object.assign(Object.assign({}, cmp), { state: reducer(cmp.state, RECOMPUTE_ACTION) }))));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkdWNlci5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi8uLi9tb2R1bGVzL3N0b3JlLWRldnRvb2xzLyIsInNvdXJjZXMiOlsic3JjL3JlZHVjZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxPQUFPLEVBQXlCLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFbEUsT0FBTyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDbkUsT0FBTyxLQUFLLGVBQWUsTUFBTSxXQUFXLENBQUM7QUFFN0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLFdBQVcsQ0FBQzs7QUFhMUMsTUFBTSxPQUFPLFdBQVcsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7O0FBRXpDLE1BQU0sT0FBTyxTQUFTLEdBQUcsbUJBQUEsZ0NBQWdDLEVBQW9DOztBQUM3RixNQUFNLE9BQU8sZ0JBQWdCLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFOzs7O0FBRW5ELG1DQUdDOzs7SUFGQyw4QkFBVzs7SUFDWCw4QkFBVzs7Ozs7QUFHYixrQ0FHQzs7O0lBRkMsNEJBQWE7O0lBQ2IsOEJBQWU7Ozs7O0FBR2pCLG1DQUVDOzs7O0FBRUQsaUNBV0M7OztJQVZDLG1DQUFrQjs7SUFDbEIsbUNBQXFCOztJQUNyQixrQ0FBMkI7O0lBQzNCLHNDQUEwQjs7SUFDMUIsdUNBQTJCOztJQUMzQixxQ0FBb0I7O0lBQ3BCLHdDQUEwQjs7SUFDMUIscUNBQWdDOztJQUNoQywrQkFBa0I7O0lBQ2xCLCtCQUFrQjs7Ozs7Ozs7Ozs7QUFNcEIsU0FBUyxnQkFBZ0IsQ0FDdkIsT0FBZ0MsRUFDaEMsTUFBYyxFQUNkLEtBQVUsRUFDVixLQUFVLEVBQ1YsWUFBMEI7SUFFMUIsSUFBSSxLQUFLLEVBQUU7UUFDVCxPQUFPO1lBQ0wsS0FBSztZQUNMLEtBQUssRUFBRSxzQ0FBc0M7U0FDOUMsQ0FBQztLQUNIOztRQUVH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VCxDQUFDO0lBQ0osQ0FBQyxDQUFBLEVBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXJyb3JIYW5kbGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24sIEFjdGlvblJlZHVjZXIsIFVQREFURSwgSU5JVCB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcblxuaW1wb3J0IHsgZGlmZmVyZW5jZSwgbGlmdEFjdGlvbiwgaXNBY3Rpb25GaWx0ZXJlZCB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0ICogYXMgRGV2dG9vbHNBY3Rpb25zIGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgeyBTdG9yZURldnRvb2xzQ29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgUGVyZm9ybUFjdGlvbiB9IGZyb20gJy4vYWN0aW9ucyc7XG5cbmV4cG9ydCB0eXBlIEluaXRBY3Rpb24gPSB7XG4gIHJlYWRvbmx5IHR5cGU6IHR5cGVvZiBJTklUO1xufTtcblxuZXhwb3J0IHR5cGUgVXBkYXRlUmVkdWNlckFjdGlvbiA9IHtcbiAgcmVhZG9ubHkgdHlwZTogdHlwZW9mIFVQREFURTtcbn07XG5cbmV4cG9ydCB0eXBlIENvcmVBY3Rpb25zID0gSW5pdEFjdGlvbiB8IFVwZGF0ZVJlZHVjZXJBY3Rpb247XG5leHBvcnQgdHlwZSBBY3Rpb25zID0gRGV2dG9vbHNBY3Rpb25zLkFsbCB8IENvcmVBY3Rpb25zO1xuXG5leHBvcnQgY29uc3QgSU5JVF9BQ1RJT04gPSB7IHR5cGU6IElOSVQgfTtcblxuZXhwb3J0IGNvbnN0IFJFQ09NUFVURSA9ICdAbmdyeC9zdG9yZS1kZXZ0b29scy9yZWNvbXB1dGUnIGFzICdAbmdyeC9zdG9yZS1kZXZ0b29scy9yZWNvbXB1dGUnO1xuZXhwb3J0IGNvbnN0IFJFQ09NUFVURV9BQ1RJT04gPSB7IHR5cGU6IFJFQ09NUFVURSB9O1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbXB1dGVkU3RhdGUge1xuICBzdGF0ZTogYW55O1xuICBlcnJvcjogYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZnRlZEFjdGlvbiB7XG4gIHR5cGU6IHN0cmluZztcbiAgYWN0aW9uOiBBY3Rpb247XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlmdGVkQWN0aW9ucyB7XG4gIFtpZDogbnVtYmVyXTogTGlmdGVkQWN0aW9uO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZnRlZFN0YXRlIHtcbiAgbW9uaXRvclN0YXRlOiBhbnk7XG4gIG5leHRBY3Rpb25JZDogbnVtYmVyO1xuICBhY3Rpb25zQnlJZDogTGlmdGVkQWN0aW9ucztcbiAgc3RhZ2VkQWN0aW9uSWRzOiBudW1iZXJbXTtcbiAgc2tpcHBlZEFjdGlvbklkczogbnVtYmVyW107XG4gIGNvbW1pdHRlZFN0YXRlOiBhbnk7XG4gIGN1cnJlbnRTdGF0ZUluZGV4OiBudW1iZXI7XG4gIGNvbXB1dGVkU3RhdGVzOiBDb21wdXRlZFN0YXRlW107XG4gIGlzTG9ja2VkOiBib29sZWFuO1xuICBpc1BhdXNlZDogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgbmV4dCBlbnRyeSBpbiB0aGUgbG9nIGJ5IGFwcGx5aW5nIGFuIGFjdGlvbi5cbiAqL1xuZnVuY3Rpb24gY29tcHV0ZU5leHRFbnRyeShcbiAgcmVkdWNlcjogQWN0aW9uUmVkdWNlcjxhbnksIGFueT4sXG4gIGFjdGlvbjogQWN0aW9uLFxuICBzdGF0ZTogYW55LFxuICBlcnJvcjogYW55LFxuICBlcnJvckhhbmRsZXI6IEVycm9ySGFuZGxlclxuKSB7XG4gIGlmIChlcnJvcikge1xuICAgIHJldHVybiB7XG4gICAgICBzdGF0ZSxcbiAgICAgIGVycm9yOiAnSW50ZXJydXB0ZWQgYnkgYW4gZXJyb3IgdXAgdGhlIGNoYWluJyxcbiAgICB9O1xuICB9XG5cbiAgbGV0IG5leHRTdGF0ZSA9IHN0YXRlO1xuICBsZXQgbmV4dEVycm9yO1xuICB0cnkge1xuICAgIG5leHRTdGF0ZSA9IHJlZHVjZXIoc3RhdGUsIGFjdGlvbik7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIG5leHRFcnJvciA9IGVyci50b1N0cmluZygpO1xuICAgIGVycm9ySGFuZGxlci5oYW5kbGVFcnJvcihlcnIpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzdGF0ZTogbmV4dFN0YXRlLFxuICAgIGVycm9yOiBuZXh0RXJyb3IsXG4gIH07XG59XG5cbi8qKlxuICogUnVucyB0aGUgcmVkdWNlciBvbiBpbnZhbGlkYXRlZCBhY3Rpb25zIHRvIGdldCBhIGZyZXNoIGNvbXB1dGF0aW9uIGxvZy5cbiAqL1xuZnVuY3Rpb24gcmVjb21wdXRlU3RhdGVzKFxuICBjb21wdXRlZFN0YXRlczogQ29tcHV0ZWRTdGF0ZVtdLFxuICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXg6IG51bWJlcixcbiAgcmVkdWNlcjogQWN0aW9uUmVkdWNlcjxhbnksIGFueT4sXG4gIGNvbW1pdHRlZFN0YXRlOiBhbnksXG4gIGFjdGlvbnNCeUlkOiBMaWZ0ZWRBY3Rpb25zLFxuICBzdGFnZWRBY3Rpb25JZHM6IG51bWJlcltdLFxuICBza2lwcGVkQWN0aW9uSWRzOiBudW1iZXJbXSxcbiAgZXJyb3JIYW5kbGVyOiBFcnJvckhhbmRsZXIsXG4gIGlzUGF1c2VkOiBib29sZWFuXG4pIHtcbiAgLy8gT3B0aW1pemF0aW9uOiBleGl0IGVhcmx5IGFuZCByZXR1cm4gdGhlIHNhbWUgcmVmZXJlbmNlXG4gIC8vIGlmIHdlIGtub3cgbm90aGluZyBjb3VsZCBoYXZlIGNoYW5nZWQuXG4gIGlmIChcbiAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPj0gY29tcHV0ZWRTdGF0ZXMubGVuZ3RoICYmXG4gICAgY29tcHV0ZWRTdGF0ZXMubGVuZ3RoID09PSBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoXG4gICkge1xuICAgIHJldHVybiBjb21wdXRlZFN0YXRlcztcbiAgfVxuXG4gIGNvbnN0IG5leHRDb21wdXRlZFN0YXRlcyA9IGNvbXB1dGVkU3RhdGVzLnNsaWNlKDAsIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCk7XG4gIC8vIElmIHRoZSByZWNvcmRpbmcgaXMgcGF1c2VkLCByZWNvbXB1dGUgYWxsIHN0YXRlcyB1cCB1bnRpbCB0aGUgcGF1c2Ugc3RhdGUsXG4gIC8vIGVsc2UgcmVjb21wdXRlIGFsbCBzdGF0ZXMuXG4gIGNvbnN0IGxhc3RJbmNsdWRlZEFjdGlvbklkID0gc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIChpc1BhdXNlZCA/IDEgOiAwKTtcbiAgZm9yIChsZXQgaSA9IG1pbkludmFsaWRhdGVkU3RhdGVJbmRleDsgaSA8IGxhc3RJbmNsdWRlZEFjdGlvbklkOyBpKyspIHtcbiAgICBjb25zdCBhY3Rpb25JZCA9IHN0YWdlZEFjdGlvbklkc1tpXTtcbiAgICBjb25zdCBhY3Rpb24gPSBhY3Rpb25zQnlJZFthY3Rpb25JZF0uYWN0aW9uO1xuXG4gICAgY29uc3QgcHJldmlvdXNFbnRyeSA9IG5leHRDb21wdXRlZFN0YXRlc1tpIC0gMV07XG4gICAgY29uc3QgcHJldmlvdXNTdGF0ZSA9IHByZXZpb3VzRW50cnkgPyBwcmV2aW91c0VudHJ5LnN0YXRlIDogY29tbWl0dGVkU3RhdGU7XG4gICAgY29uc3QgcHJldmlvdXNFcnJvciA9IHByZXZpb3VzRW50cnkgPyBwcmV2aW91c0VudHJ5LmVycm9yIDogdW5kZWZpbmVkO1xuXG4gICAgY29uc3Qgc2hvdWxkU2tpcCA9IHNraXBwZWRBY3Rpb25JZHMuaW5kZXhPZihhY3Rpb25JZCkgPiAtMTtcbiAgICBjb25zdCBlbnRyeTogQ29tcHV0ZWRTdGF0ZSA9IHNob3VsZFNraXBcbiAgICAgID8gcHJldmlvdXNFbnRyeVxuICAgICAgOiBjb21wdXRlTmV4dEVudHJ5KFxuICAgICAgICAgIHJlZHVjZXIsXG4gICAgICAgICAgYWN0aW9uLFxuICAgICAgICAgIHByZXZpb3VzU3RhdGUsXG4gICAgICAgICAgcHJldmlvdXNFcnJvcixcbiAgICAgICAgICBlcnJvckhhbmRsZXJcbiAgICAgICAgKTtcblxuICAgIG5leHRDb21wdXRlZFN0YXRlcy5wdXNoKGVudHJ5KTtcbiAgfVxuICAvLyBJZiB0aGUgcmVjb3JkaW5nIGlzIHBhdXNlZCwgdGhlIGxhc3Qgc3RhdGUgd2lsbCBub3QgYmUgcmVjb21wdXRlZCxcbiAgLy8gYmVjYXVzZSBpdCdzIGVzc2VudGlhbGx5IG5vdCBwYXJ0IG9mIHRoZSBzdGF0ZSBoaXN0b3J5LlxuICBpZiAoaXNQYXVzZWQpIHtcbiAgICBuZXh0Q29tcHV0ZWRTdGF0ZXMucHVzaChjb21wdXRlZFN0YXRlc1tjb21wdXRlZFN0YXRlcy5sZW5ndGggLSAxXSk7XG4gIH1cblxuICByZXR1cm4gbmV4dENvbXB1dGVkU3RhdGVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGlmdEluaXRpYWxTdGF0ZShcbiAgaW5pdGlhbENvbW1pdHRlZFN0YXRlPzogYW55LFxuICBtb25pdG9yUmVkdWNlcj86IGFueVxuKTogTGlmdGVkU3RhdGUge1xuICByZXR1cm4ge1xuICAgIG1vbml0b3JTdGF0ZTogbW9uaXRvclJlZHVjZXIodW5kZWZpbmVkLCB7fSksXG4gICAgbmV4dEFjdGlvbklkOiAxLFxuICAgIGFjdGlvbnNCeUlkOiB7IDA6IGxpZnRBY3Rpb24oSU5JVF9BQ1RJT04pIH0sXG4gICAgc3RhZ2VkQWN0aW9uSWRzOiBbMF0sXG4gICAgc2tpcHBlZEFjdGlvbklkczogW10sXG4gICAgY29tbWl0dGVkU3RhdGU6IGluaXRpYWxDb21taXR0ZWRTdGF0ZSxcbiAgICBjdXJyZW50U3RhdGVJbmRleDogMCxcbiAgICBjb21wdXRlZFN0YXRlczogW10sXG4gICAgaXNMb2NrZWQ6IGZhbHNlLFxuICAgIGlzUGF1c2VkOiBmYWxzZSxcbiAgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgaGlzdG9yeSBzdGF0ZSByZWR1Y2VyIGZyb20gYW4gYXBwJ3MgcmVkdWNlci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxpZnRSZWR1Y2VyV2l0aChcbiAgaW5pdGlhbENvbW1pdHRlZFN0YXRlOiBhbnksXG4gIGluaXRpYWxMaWZ0ZWRTdGF0ZTogTGlmdGVkU3RhdGUsXG4gIGVycm9ySGFuZGxlcjogRXJyb3JIYW5kbGVyLFxuICBtb25pdG9yUmVkdWNlcj86IGFueSxcbiAgb3B0aW9uczogUGFydGlhbDxTdG9yZURldnRvb2xzQ29uZmlnPiA9IHt9XG4pIHtcbiAgLyoqXG4gICAqIE1hbmFnZXMgaG93IHRoZSBoaXN0b3J5IGFjdGlvbnMgbW9kaWZ5IHRoZSBoaXN0b3J5IHN0YXRlLlxuICAgKi9cbiAgcmV0dXJuIChcbiAgICByZWR1Y2VyOiBBY3Rpb25SZWR1Y2VyPGFueSwgYW55PlxuICApOiBBY3Rpb25SZWR1Y2VyPExpZnRlZFN0YXRlLCBBY3Rpb25zPiA9PiAobGlmdGVkU3RhdGUsIGxpZnRlZEFjdGlvbikgPT4ge1xuICAgIGxldCB7XG4gICAgICBtb25pdG9yU3RhdGUsXG4gICAgICBhY3Rpb25zQnlJZCxcbiAgICAgIG5leHRBY3Rpb25JZCxcbiAgICAgIHN0YWdlZEFjdGlvbklkcyxcbiAgICAgIHNraXBwZWRBY3Rpb25JZHMsXG4gICAgICBjb21taXR0ZWRTdGF0ZSxcbiAgICAgIGN1cnJlbnRTdGF0ZUluZGV4LFxuICAgICAgY29tcHV0ZWRTdGF0ZXMsXG4gICAgICBpc0xvY2tlZCxcbiAgICAgIGlzUGF1c2VkLFxuICAgIH0gPSBsaWZ0ZWRTdGF0ZSB8fCBpbml0aWFsTGlmdGVkU3RhdGU7XG5cbiAgICBpZiAoIWxpZnRlZFN0YXRlKSB7XG4gICAgICAvLyBQcmV2ZW50IG11dGF0aW5nIGluaXRpYWxMaWZ0ZWRTdGF0ZVxuICAgICAgYWN0aW9uc0J5SWQgPSBPYmplY3QuY3JlYXRlKGFjdGlvbnNCeUlkKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21taXRFeGNlc3NBY3Rpb25zKG46IG51bWJlcikge1xuICAgICAgLy8gQXV0by1jb21taXRzIG4tbnVtYmVyIG9mIGV4Y2VzcyBhY3Rpb25zLlxuICAgICAgbGV0IGV4Y2VzcyA9IG47XG4gICAgICBsZXQgaWRzVG9EZWxldGUgPSBzdGFnZWRBY3Rpb25JZHMuc2xpY2UoMSwgZXhjZXNzICsgMSk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaWRzVG9EZWxldGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGNvbXB1dGVkU3RhdGVzW2kgKyAxXS5lcnJvcikge1xuICAgICAgICAgIC8vIFN0b3AgaWYgZXJyb3IgaXMgZm91bmQuIENvbW1pdCBhY3Rpb25zIHVwIHRvIGVycm9yLlxuICAgICAgICAgIGV4Y2VzcyA9IGk7XG4gICAgICAgICAgaWRzVG9EZWxldGUgPSBzdGFnZWRBY3Rpb25JZHMuc2xpY2UoMSwgZXhjZXNzICsgMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIGFjdGlvbnNCeUlkW2lkc1RvRGVsZXRlW2ldXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBza2lwcGVkQWN0aW9uSWRzID0gc2tpcHBlZEFjdGlvbklkcy5maWx0ZXIoXG4gICAgICAgIChpZCkgPT4gaWRzVG9EZWxldGUuaW5kZXhPZihpZCkgPT09IC0xXG4gICAgICApO1xuICAgICAgc3RhZ2VkQWN0aW9uSWRzID0gWzAsIC4uLnN0YWdlZEFjdGlvbklkcy5zbGljZShleGNlc3MgKyAxKV07XG4gICAgICBjb21taXR0ZWRTdGF0ZSA9IGNvbXB1dGVkU3RhdGVzW2V4Y2Vzc10uc3RhdGU7XG4gICAgICBjb21wdXRlZFN0YXRlcyA9IGNvbXB1dGVkU3RhdGVzLnNsaWNlKGV4Y2Vzcyk7XG4gICAgICBjdXJyZW50U3RhdGVJbmRleCA9XG4gICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4ID4gZXhjZXNzID8gY3VycmVudFN0YXRlSW5kZXggLSBleGNlc3MgOiAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbW1pdENoYW5nZXMoKSB7XG4gICAgICAvLyBDb25zaWRlciB0aGUgbGFzdCBjb21taXR0ZWQgc3RhdGUgdGhlIG5ldyBzdGFydGluZyBwb2ludC5cbiAgICAgIC8vIFNxdWFzaCBhbnkgc3RhZ2VkIGFjdGlvbnMgaW50byBhIHNpbmdsZSBjb21taXR0ZWQgc3RhdGUuXG4gICAgICBhY3Rpb25zQnlJZCA9IHsgMDogbGlmdEFjdGlvbihJTklUX0FDVElPTikgfTtcbiAgICAgIG5leHRBY3Rpb25JZCA9IDE7XG4gICAgICBzdGFnZWRBY3Rpb25JZHMgPSBbMF07XG4gICAgICBza2lwcGVkQWN0aW9uSWRzID0gW107XG4gICAgICBjb21taXR0ZWRTdGF0ZSA9IGNvbXB1dGVkU3RhdGVzW2N1cnJlbnRTdGF0ZUluZGV4XS5zdGF0ZTtcbiAgICAgIGN1cnJlbnRTdGF0ZUluZGV4ID0gMDtcbiAgICAgIGNvbXB1dGVkU3RhdGVzID0gW107XG4gICAgfVxuXG4gICAgLy8gQnkgZGVmYXVsdCwgYWdncmVzc2l2ZWx5IHJlY29tcHV0ZSBldmVyeSBzdGF0ZSB3aGF0ZXZlciBoYXBwZW5zLlxuICAgIC8vIFRoaXMgaGFzIE8obikgcGVyZm9ybWFuY2UsIHNvIHdlJ2xsIG92ZXJyaWRlIHRoaXMgdG8gYSBzZW5zaWJsZVxuICAgIC8vIHZhbHVlIHdoZW5ldmVyIHdlIGZlZWwgbGlrZSB3ZSBkb24ndCBoYXZlIHRvIHJlY29tcHV0ZSB0aGUgc3RhdGVzLlxuICAgIGxldCBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSAwO1xuXG4gICAgc3dpdGNoIChsaWZ0ZWRBY3Rpb24udHlwZSkge1xuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuTE9DS19DSEFOR0VTOiB7XG4gICAgICAgIGlzTG9ja2VkID0gbGlmdGVkQWN0aW9uLnN0YXR1cztcbiAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gSW5maW5pdHk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuUEFVU0VfUkVDT1JESU5HOiB7XG4gICAgICAgIGlzUGF1c2VkID0gbGlmdGVkQWN0aW9uLnN0YXR1cztcbiAgICAgICAgaWYgKGlzUGF1c2VkKSB7XG4gICAgICAgICAgLy8gQWRkIGEgcGF1c2UgYWN0aW9uIHRvIHNpZ25hbCB0aGUgZGV2dG9vbHMtdXNlciB0aGUgcmVjb3JkaW5nIGlzIHBhdXNlZC5cbiAgICAgICAgICAvLyBUaGUgY29ycmVzcG9uZGluZyBzdGF0ZSB3aWxsIGJlIG92ZXJ3cml0dGVuIG9uIGVhY2ggdXBkYXRlIHRvIGFsd2F5cyBjb250YWluXG4gICAgICAgICAgLy8gdGhlIGxhdGVzdCBzdGF0ZSAoc2VlIEFjdGlvbnMuUEVSRk9STV9BQ1RJT04pLlxuICAgICAgICAgIHN0YWdlZEFjdGlvbklkcyA9IFsuLi5zdGFnZWRBY3Rpb25JZHMsIG5leHRBY3Rpb25JZF07XG4gICAgICAgICAgYWN0aW9uc0J5SWRbbmV4dEFjdGlvbklkXSA9IG5ldyBQZXJmb3JtQWN0aW9uKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0eXBlOiAnQG5ncngvZGV2dG9vbHMvcGF1c2UnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICtEYXRlLm5vdygpXG4gICAgICAgICAgKTtcbiAgICAgICAgICBuZXh0QWN0aW9uSWQrKztcbiAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gMTtcbiAgICAgICAgICBjb21wdXRlZFN0YXRlcyA9IGNvbXB1dGVkU3RhdGVzLmNvbmNhdChcbiAgICAgICAgICAgIGNvbXB1dGVkU3RhdGVzW2NvbXB1dGVkU3RhdGVzLmxlbmd0aCAtIDFdXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGlmIChjdXJyZW50U3RhdGVJbmRleCA9PT0gc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIDIpIHtcbiAgICAgICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4Kys7XG4gICAgICAgICAgfVxuICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IEluZmluaXR5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbW1pdENoYW5nZXMoKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLlJFU0VUOiB7XG4gICAgICAgIC8vIEdldCBiYWNrIHRvIHRoZSBzdGF0ZSB0aGUgc3RvcmUgd2FzIGNyZWF0ZWQgd2l0aC5cbiAgICAgICAgYWN0aW9uc0J5SWQgPSB7IDA6IGxpZnRBY3Rpb24oSU5JVF9BQ1RJT04pIH07XG4gICAgICAgIG5leHRBY3Rpb25JZCA9IDE7XG4gICAgICAgIHN0YWdlZEFjdGlvbklkcyA9IFswXTtcbiAgICAgICAgc2tpcHBlZEFjdGlvbklkcyA9IFtdO1xuICAgICAgICBjb21taXR0ZWRTdGF0ZSA9IGluaXRpYWxDb21taXR0ZWRTdGF0ZTtcbiAgICAgICAgY3VycmVudFN0YXRlSW5kZXggPSAwO1xuICAgICAgICBjb21wdXRlZFN0YXRlcyA9IFtdO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLkNPTU1JVDoge1xuICAgICAgICBjb21taXRDaGFuZ2VzKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuUk9MTEJBQ0s6IHtcbiAgICAgICAgLy8gRm9yZ2V0IGFib3V0IGFueSBzdGFnZWQgYWN0aW9ucy5cbiAgICAgICAgLy8gU3RhcnQgYWdhaW4gZnJvbSB0aGUgbGFzdCBjb21taXR0ZWQgc3RhdGUuXG4gICAgICAgIGFjdGlvbnNCeUlkID0geyAwOiBsaWZ0QWN0aW9uKElOSVRfQUNUSU9OKSB9O1xuICAgICAgICBuZXh0QWN0aW9uSWQgPSAxO1xuICAgICAgICBzdGFnZWRBY3Rpb25JZHMgPSBbMF07XG4gICAgICAgIHNraXBwZWRBY3Rpb25JZHMgPSBbXTtcbiAgICAgICAgY3VycmVudFN0YXRlSW5kZXggPSAwO1xuICAgICAgICBjb21wdXRlZFN0YXRlcyA9IFtdO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLlRPR0dMRV9BQ1RJT046IHtcbiAgICAgICAgLy8gVG9nZ2xlIHdoZXRoZXIgYW4gYWN0aW9uIHdpdGggZ2l2ZW4gSUQgaXMgc2tpcHBlZC5cbiAgICAgICAgLy8gQmVpbmcgc2tpcHBlZCBtZWFucyBpdCBpcyBhIG5vLW9wIGR1cmluZyB0aGUgY29tcHV0YXRpb24uXG4gICAgICAgIGNvbnN0IHsgaWQ6IGFjdGlvbklkIH0gPSBsaWZ0ZWRBY3Rpb247XG4gICAgICAgIGNvbnN0IGluZGV4ID0gc2tpcHBlZEFjdGlvbklkcy5pbmRleE9mKGFjdGlvbklkKTtcbiAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICAgIHNraXBwZWRBY3Rpb25JZHMgPSBbYWN0aW9uSWQsIC4uLnNraXBwZWRBY3Rpb25JZHNdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNraXBwZWRBY3Rpb25JZHMgPSBza2lwcGVkQWN0aW9uSWRzLmZpbHRlcigoaWQpID0+IGlkICE9PSBhY3Rpb25JZCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gT3B0aW1pemF0aW9uOiB3ZSBrbm93IGhpc3RvcnkgYmVmb3JlIHRoaXMgYWN0aW9uIGhhc24ndCBjaGFuZ2VkXG4gICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IHN0YWdlZEFjdGlvbklkcy5pbmRleE9mKGFjdGlvbklkKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIERldnRvb2xzQWN0aW9ucy5TRVRfQUNUSU9OU19BQ1RJVkU6IHtcbiAgICAgICAgLy8gVG9nZ2xlIHdoZXRoZXIgYW4gYWN0aW9uIHdpdGggZ2l2ZW4gSUQgaXMgc2tpcHBlZC5cbiAgICAgICAgLy8gQmVpbmcgc2tpcHBlZCBtZWFucyBpdCBpcyBhIG5vLW9wIGR1cmluZyB0aGUgY29tcHV0YXRpb24uXG4gICAgICAgIGNvbnN0IHsgc3RhcnQsIGVuZCwgYWN0aXZlIH0gPSBsaWZ0ZWRBY3Rpb247XG4gICAgICAgIGNvbnN0IGFjdGlvbklkcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykgYWN0aW9uSWRzLnB1c2goaSk7XG4gICAgICAgIGlmIChhY3RpdmUpIHtcbiAgICAgICAgICBza2lwcGVkQWN0aW9uSWRzID0gZGlmZmVyZW5jZShza2lwcGVkQWN0aW9uSWRzLCBhY3Rpb25JZHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNraXBwZWRBY3Rpb25JZHMgPSBbLi4uc2tpcHBlZEFjdGlvbklkcywgLi4uYWN0aW9uSWRzXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE9wdGltaXphdGlvbjogd2Uga25vdyBoaXN0b3J5IGJlZm9yZSB0aGlzIGFjdGlvbiBoYXNuJ3QgY2hhbmdlZFxuICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBzdGFnZWRBY3Rpb25JZHMuaW5kZXhPZihzdGFydCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuSlVNUF9UT19TVEFURToge1xuICAgICAgICAvLyBXaXRob3V0IHJlY29tcHV0aW5nIGFueXRoaW5nLCBtb3ZlIHRoZSBwb2ludGVyIHRoYXQgdGVsbCB1c1xuICAgICAgICAvLyB3aGljaCBzdGF0ZSBpcyBjb25zaWRlcmVkIHRoZSBjdXJyZW50IG9uZS4gVXNlZnVsIGZvciBzbGlkZXJzLlxuICAgICAgICBjdXJyZW50U3RhdGVJbmRleCA9IGxpZnRlZEFjdGlvbi5pbmRleDtcbiAgICAgICAgLy8gT3B0aW1pemF0aW9uOiB3ZSBrbm93IHRoZSBoaXN0b3J5IGhhcyBub3QgY2hhbmdlZC5cbiAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gSW5maW5pdHk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuSlVNUF9UT19BQ1RJT046IHtcbiAgICAgICAgLy8gSnVtcHMgdG8gYSBjb3JyZXNwb25kaW5nIHN0YXRlIHRvIGEgc3BlY2lmaWMgYWN0aW9uLlxuICAgICAgICAvLyBVc2VmdWwgd2hlbiBmaWx0ZXJpbmcgYWN0aW9ucy5cbiAgICAgICAgY29uc3QgaW5kZXggPSBzdGFnZWRBY3Rpb25JZHMuaW5kZXhPZihsaWZ0ZWRBY3Rpb24uYWN0aW9uSWQpO1xuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSBjdXJyZW50U3RhdGVJbmRleCA9IGluZGV4O1xuICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBJbmZpbml0eTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIERldnRvb2xzQWN0aW9ucy5TV0VFUDoge1xuICAgICAgICAvLyBGb3JnZXQgYW55IGFjdGlvbnMgdGhhdCBhcmUgY3VycmVudGx5IGJlaW5nIHNraXBwZWQuXG4gICAgICAgIHN0YWdlZEFjdGlvbklkcyA9IGRpZmZlcmVuY2Uoc3RhZ2VkQWN0aW9uSWRzLCBza2lwcGVkQWN0aW9uSWRzKTtcbiAgICAgICAgc2tpcHBlZEFjdGlvbklkcyA9IFtdO1xuICAgICAgICBjdXJyZW50U3RhdGVJbmRleCA9IE1hdGgubWluKFxuICAgICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4LFxuICAgICAgICAgIHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSAxXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuUEVSRk9STV9BQ1RJT046IHtcbiAgICAgICAgLy8gSWdub3JlIGFjdGlvbiBhbmQgcmV0dXJuIHN0YXRlIGFzIGlzIGlmIHJlY29yZGluZyBpcyBsb2NrZWRcbiAgICAgICAgaWYgKGlzTG9ja2VkKSB7XG4gICAgICAgICAgcmV0dXJuIGxpZnRlZFN0YXRlIHx8IGluaXRpYWxMaWZ0ZWRTdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICBpc1BhdXNlZCB8fFxuICAgICAgICAgIChsaWZ0ZWRTdGF0ZSAmJlxuICAgICAgICAgICAgaXNBY3Rpb25GaWx0ZXJlZChcbiAgICAgICAgICAgICAgbGlmdGVkU3RhdGUuY29tcHV0ZWRTdGF0ZXNbY3VycmVudFN0YXRlSW5kZXhdLFxuICAgICAgICAgICAgICBsaWZ0ZWRBY3Rpb24sXG4gICAgICAgICAgICAgIG9wdGlvbnMucHJlZGljYXRlLFxuICAgICAgICAgICAgICBvcHRpb25zLmFjdGlvbnNTYWZlbGlzdCxcbiAgICAgICAgICAgICAgb3B0aW9ucy5hY3Rpb25zQmxvY2tsaXN0XG4gICAgICAgICAgICApKVxuICAgICAgICApIHtcbiAgICAgICAgICAvLyBJZiByZWNvcmRpbmcgaXMgcGF1c2VkIG9yIGlmIHRoZSBhY3Rpb24gc2hvdWxkIGJlIGlnbm9yZWQsIG92ZXJ3cml0ZSB0aGUgbGFzdCBzdGF0ZVxuICAgICAgICAgIC8vIChjb3JyZXNwb25kcyB0byB0aGUgcGF1c2UgYWN0aW9uKSBhbmQga2VlcCBldmVyeXRoaW5nIGVsc2UgYXMgaXMuXG4gICAgICAgICAgLy8gVGhpcyB3YXksIHRoZSBhcHAgZ2V0cyB0aGUgbmV3IGN1cnJlbnQgc3RhdGUgd2hpbGUgdGhlIGRldnRvb2xzXG4gICAgICAgICAgLy8gZG8gbm90IHJlY29yZCBhbm90aGVyIGFjdGlvbi5cbiAgICAgICAgICBjb25zdCBsYXN0U3RhdGUgPSBjb21wdXRlZFN0YXRlc1tjb21wdXRlZFN0YXRlcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICBjb21wdXRlZFN0YXRlcyA9IFtcbiAgICAgICAgICAgIC4uLmNvbXB1dGVkU3RhdGVzLnNsaWNlKDAsIC0xKSxcbiAgICAgICAgICAgIGNvbXB1dGVOZXh0RW50cnkoXG4gICAgICAgICAgICAgIHJlZHVjZXIsXG4gICAgICAgICAgICAgIGxpZnRlZEFjdGlvbi5hY3Rpb24sXG4gICAgICAgICAgICAgIGxhc3RTdGF0ZS5zdGF0ZSxcbiAgICAgICAgICAgICAgbGFzdFN0YXRlLmVycm9yLFxuICAgICAgICAgICAgICBlcnJvckhhbmRsZXJcbiAgICAgICAgICAgICksXG4gICAgICAgICAgXTtcbiAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBJbmZpbml0eTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEF1dG8tY29tbWl0IGFzIG5ldyBhY3Rpb25zIGNvbWUgaW4uXG4gICAgICAgIGlmIChvcHRpb25zLm1heEFnZSAmJiBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoID09PSBvcHRpb25zLm1heEFnZSkge1xuICAgICAgICAgIGNvbW1pdEV4Y2Vzc0FjdGlvbnMoMSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3VycmVudFN0YXRlSW5kZXggPT09IHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgY3VycmVudFN0YXRlSW5kZXgrKztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhY3Rpb25JZCA9IG5leHRBY3Rpb25JZCsrO1xuICAgICAgICAvLyBNdXRhdGlvbiEgVGhpcyBpcyB0aGUgaG90dGVzdCBwYXRoLCBhbmQgd2Ugb3B0aW1pemUgb24gcHVycG9zZS5cbiAgICAgICAgLy8gSXQgaXMgc2FmZSBiZWNhdXNlIHdlIHNldCBhIG5ldyBrZXkgaW4gYSBjYWNoZSBkaWN0aW9uYXJ5LlxuICAgICAgICBhY3Rpb25zQnlJZFthY3Rpb25JZF0gPSBsaWZ0ZWRBY3Rpb247XG5cbiAgICAgICAgc3RhZ2VkQWN0aW9uSWRzID0gWy4uLnN0YWdlZEFjdGlvbklkcywgYWN0aW9uSWRdO1xuICAgICAgICAvLyBPcHRpbWl6YXRpb246IHdlIGtub3cgdGhhdCBvbmx5IHRoZSBuZXcgYWN0aW9uIG5lZWRzIGNvbXB1dGluZy5cbiAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIDE7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuSU1QT1JUX1NUQVRFOiB7XG4gICAgICAgIC8vIENvbXBsZXRlbHkgcmVwbGFjZSBldmVyeXRoaW5nLlxuICAgICAgICAoe1xuICAgICAgICAgIG1vbml0b3JTdGF0ZSxcbiAgICAgICAgICBhY3Rpb25zQnlJZCxcbiAgICAgICAgICBuZXh0QWN0aW9uSWQsXG4gICAgICAgICAgc3RhZ2VkQWN0aW9uSWRzLFxuICAgICAgICAgIHNraXBwZWRBY3Rpb25JZHMsXG4gICAgICAgICAgY29tbWl0dGVkU3RhdGUsXG4gICAgICAgICAgY3VycmVudFN0YXRlSW5kZXgsXG4gICAgICAgICAgY29tcHV0ZWRTdGF0ZXMsXG4gICAgICAgICAgaXNMb2NrZWQsXG4gICAgICAgICAgaXNQYXVzZWQsXG4gICAgICAgIH0gPSBsaWZ0ZWRBY3Rpb24ubmV4dExpZnRlZFN0YXRlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIElOSVQ6IHtcbiAgICAgICAgLy8gQWx3YXlzIHJlY29tcHV0ZSBzdGF0ZXMgb24gaG90IHJlbG9hZCBhbmQgaW5pdC5cbiAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gMDtcblxuICAgICAgICBpZiAob3B0aW9ucy5tYXhBZ2UgJiYgc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCA+IG9wdGlvbnMubWF4QWdlKSB7XG4gICAgICAgICAgLy8gU3RhdGVzIG11c3QgYmUgcmVjb21wdXRlZCBiZWZvcmUgY29tbWl0dGluZyBleGNlc3MuXG4gICAgICAgICAgY29tcHV0ZWRTdGF0ZXMgPSByZWNvbXB1dGVTdGF0ZXMoXG4gICAgICAgICAgICBjb21wdXRlZFN0YXRlcyxcbiAgICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCxcbiAgICAgICAgICAgIHJlZHVjZXIsXG4gICAgICAgICAgICBjb21taXR0ZWRTdGF0ZSxcbiAgICAgICAgICAgIGFjdGlvbnNCeUlkLFxuICAgICAgICAgICAgc3RhZ2VkQWN0aW9uSWRzLFxuICAgICAgICAgICAgc2tpcHBlZEFjdGlvbklkcyxcbiAgICAgICAgICAgIGVycm9ySGFuZGxlcixcbiAgICAgICAgICAgIGlzUGF1c2VkXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGNvbW1pdEV4Y2Vzc0FjdGlvbnMoc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIG9wdGlvbnMubWF4QWdlKTtcblxuICAgICAgICAgIC8vIEF2b2lkIGRvdWJsZSBjb21wdXRhdGlvbi5cbiAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBJbmZpbml0eTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBVUERBVEU6IHtcbiAgICAgICAgY29uc3Qgc3RhdGVIYXNFcnJvcnMgPVxuICAgICAgICAgIGNvbXB1dGVkU3RhdGVzLmZpbHRlcigoc3RhdGUpID0+IHN0YXRlLmVycm9yKS5sZW5ndGggPiAwO1xuXG4gICAgICAgIGlmIChzdGF0ZUhhc0Vycm9ycykge1xuICAgICAgICAgIC8vIFJlY29tcHV0ZSBhbGwgc3RhdGVzXG4gICAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gMDtcblxuICAgICAgICAgIGlmIChvcHRpb25zLm1heEFnZSAmJiBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoID4gb3B0aW9ucy5tYXhBZ2UpIHtcbiAgICAgICAgICAgIC8vIFN0YXRlcyBtdXN0IGJlIHJlY29tcHV0ZWQgYmVmb3JlIGNvbW1pdHRpbmcgZXhjZXNzLlxuICAgICAgICAgICAgY29tcHV0ZWRTdGF0ZXMgPSByZWNvbXB1dGVTdGF0ZXMoXG4gICAgICAgICAgICAgIGNvbXB1dGVkU3RhdGVzLFxuICAgICAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXgsXG4gICAgICAgICAgICAgIHJlZHVjZXIsXG4gICAgICAgICAgICAgIGNvbW1pdHRlZFN0YXRlLFxuICAgICAgICAgICAgICBhY3Rpb25zQnlJZCxcbiAgICAgICAgICAgICAgc3RhZ2VkQWN0aW9uSWRzLFxuICAgICAgICAgICAgICBza2lwcGVkQWN0aW9uSWRzLFxuICAgICAgICAgICAgICBlcnJvckhhbmRsZXIsXG4gICAgICAgICAgICAgIGlzUGF1c2VkXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb21taXRFeGNlc3NBY3Rpb25zKHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSBvcHRpb25zLm1heEFnZSk7XG5cbiAgICAgICAgICAgIC8vIEF2b2lkIGRvdWJsZSBjb21wdXRhdGlvbi5cbiAgICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IEluZmluaXR5O1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBJZiBub3QgcGF1c2VkL2xvY2tlZCwgYWRkIGEgbmV3IGFjdGlvbiB0byBzaWduYWwgZGV2dG9vbHMtdXNlclxuICAgICAgICAgIC8vIHRoYXQgdGhlcmUgd2FzIGEgcmVkdWNlciB1cGRhdGUuXG4gICAgICAgICAgaWYgKCFpc1BhdXNlZCAmJiAhaXNMb2NrZWQpIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50U3RhdGVJbmRleCA9PT0gc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgY3VycmVudFN0YXRlSW5kZXgrKztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQWRkIGEgbmV3IGFjdGlvbiB0byBvbmx5IHJlY29tcHV0ZSBzdGF0ZVxuICAgICAgICAgICAgY29uc3QgYWN0aW9uSWQgPSBuZXh0QWN0aW9uSWQrKztcbiAgICAgICAgICAgIGFjdGlvbnNCeUlkW2FjdGlvbklkXSA9IG5ldyBQZXJmb3JtQWN0aW9uKFxuICAgICAgICAgICAgICBsaWZ0ZWRBY3Rpb24sXG4gICAgICAgICAgICAgICtEYXRlLm5vdygpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgc3RhZ2VkQWN0aW9uSWRzID0gWy4uLnN0YWdlZEFjdGlvbklkcywgYWN0aW9uSWRdO1xuXG4gICAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gMTtcblxuICAgICAgICAgICAgY29tcHV0ZWRTdGF0ZXMgPSByZWNvbXB1dGVTdGF0ZXMoXG4gICAgICAgICAgICAgIGNvbXB1dGVkU3RhdGVzLFxuICAgICAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXgsXG4gICAgICAgICAgICAgIHJlZHVjZXIsXG4gICAgICAgICAgICAgIGNvbW1pdHRlZFN0YXRlLFxuICAgICAgICAgICAgICBhY3Rpb25zQnlJZCxcbiAgICAgICAgICAgICAgc3RhZ2VkQWN0aW9uSWRzLFxuICAgICAgICAgICAgICBza2lwcGVkQWN0aW9uSWRzLFxuICAgICAgICAgICAgICBlcnJvckhhbmRsZXIsXG4gICAgICAgICAgICAgIGlzUGF1c2VkXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFJlY29tcHV0ZSBzdGF0ZSBoaXN0b3J5IHdpdGggbGF0ZXN0IHJlZHVjZXIgYW5kIHVwZGF0ZSBhY3Rpb25cbiAgICAgICAgICBjb21wdXRlZFN0YXRlcyA9IGNvbXB1dGVkU3RhdGVzLm1hcCgoY21wKSA9PiAoe1xuICAgICAgICAgICAgLi4uY21wLFxuICAgICAgICAgICAgc3RhdGU6IHJlZHVjZXIoY21wLnN0YXRlLCBSRUNPTVBVVEVfQUNUSU9OKSxcbiAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICBjdXJyZW50U3RhdGVJbmRleCA9IHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSAxO1xuXG4gICAgICAgICAgaWYgKG9wdGlvbnMubWF4QWdlICYmIHN0YWdlZEFjdGlvbklkcy5sZW5ndGggPiBvcHRpb25zLm1heEFnZSkge1xuICAgICAgICAgICAgY29tbWl0RXhjZXNzQWN0aW9ucyhzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gb3B0aW9ucy5tYXhBZ2UpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEF2b2lkIGRvdWJsZSBjb21wdXRhdGlvbi5cbiAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBJbmZpbml0eTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICAvLyBJZiB0aGUgYWN0aW9uIGlzIG5vdCByZWNvZ25pemVkLCBpdCdzIGEgbW9uaXRvciBhY3Rpb24uXG4gICAgICAgIC8vIE9wdGltaXphdGlvbjogYSBtb25pdG9yIGFjdGlvbiBjYW4ndCBjaGFuZ2UgaGlzdG9yeS5cbiAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gSW5maW5pdHk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbXB1dGVkU3RhdGVzID0gcmVjb21wdXRlU3RhdGVzKFxuICAgICAgY29tcHV0ZWRTdGF0ZXMsXG4gICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXgsXG4gICAgICByZWR1Y2VyLFxuICAgICAgY29tbWl0dGVkU3RhdGUsXG4gICAgICBhY3Rpb25zQnlJZCxcbiAgICAgIHN0YWdlZEFjdGlvbklkcyxcbiAgICAgIHNraXBwZWRBY3Rpb25JZHMsXG4gICAgICBlcnJvckhhbmRsZXIsXG4gICAgICBpc1BhdXNlZFxuICAgICk7XG4gICAgbW9uaXRvclN0YXRlID0gbW9uaXRvclJlZHVjZXIobW9uaXRvclN0YXRlLCBsaWZ0ZWRBY3Rpb24pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG1vbml0b3JTdGF0ZSxcbiAgICAgIGFjdGlvbnNCeUlkLFxuICAgICAgbmV4dEFjdGlvbklkLFxuICAgICAgc3RhZ2VkQWN0aW9uSWRzLFxuICAgICAgc2tpcHBlZEFjdGlvbklkcyxcbiAgICAgIGNvbW1pdHRlZFN0YXRlLFxuICAgICAgY3VycmVudFN0YXRlSW5kZXgsXG4gICAgICBjb21wdXRlZFN0YXRlcyxcbiAgICAgIGlzTG9ja2VkLFxuICAgICAgaXNQYXVzZWQsXG4gICAgfTtcbiAgfTtcbn1cbiJdfQ==