/**
 * @fileoverview added by tsickle
 * Generated from: modules/store-devtools/src/reducer.ts
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
                    cmp => (Object.assign(Object.assign({}, cmp), { state: reducer(cmp.state, RECOMPUTE_ACTION) }))));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkdWNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvc3RvcmUtZGV2dG9vbHMvc3JjL3JlZHVjZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxPQUFPLEVBQXlCLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFbEUsT0FBTyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDbkUsT0FBTyxLQUFLLGVBQWUsTUFBTSxXQUFXLENBQUM7QUFFN0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLFdBQVcsQ0FBQzs7QUFhMUMsTUFBTSxPQUFPLFdBQVcsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7O0FBRXpDLE1BQU0sT0FBTyxTQUFTLEdBQUcsbUJBQUEsZ0NBQWdDLEVBQW9DOztBQUM3RixNQUFNLE9BQU8sZ0JBQWdCLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFOzs7O0FBRW5ELG1DQUdDOzs7SUFGQyw4QkFBVzs7SUFDWCw4QkFBVzs7Ozs7QUFHYixrQ0FHQzs7O0lBRkMsNEJBQWE7O0lBQ2IsOEJBQWU7Ozs7O0FBR2pCLG1DQUVDOzs7O0FBRUQsaUNBV0M7OztJQVZDLG1DQUFrQjs7SUFDbEIsbUNBQXFCOztJQUNyQixrQ0FBMkI7O0lBQzNCLHNDQUEwQjs7SUFDMUIsdUNBQTJCOztJQUMzQixxQ0FBb0I7O0lBQ3BCLHdDQUEwQjs7SUFDMUIscUNBQWdDOztJQUNoQywrQkFBa0I7O0lBQ2xCLCtCQUFrQjs7Ozs7Ozs7Ozs7QUFNcEIsU0FBUyxnQkFBZ0IsQ0FDdkIsT0FBZ0MsRUFDaEMsTUFBYyxFQUNkLEtBQVUsRUFDVixLQUFVLEVBQ1YsWUFBMEI7SUFFMUIsSUFBSSxLQUFLLEVBQUU7UUFDVCxPQUFPO1lBQ0wsS0FBSztZQUNMLEtBQUssRUFBRSxzQ0FBc0M7U0FDOUMsQ0FBQztLQUNI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ZCxRQUFRO1lBQ1IsUUFBUTtTQUNULENBQUM7SUFDSixDQUFDLENBQUEsRUFBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFcnJvckhhbmRsZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbiwgQWN0aW9uUmVkdWNlciwgVVBEQVRFLCBJTklUIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuXG5pbXBvcnQgeyBkaWZmZXJlbmNlLCBsaWZ0QWN0aW9uLCBpc0FjdGlvbkZpbHRlcmVkIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgKiBhcyBEZXZ0b29sc0FjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7IFN0b3JlRGV2dG9vbHNDb25maWcgfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgeyBQZXJmb3JtQWN0aW9uIH0gZnJvbSAnLi9hY3Rpb25zJztcblxuZXhwb3J0IHR5cGUgSW5pdEFjdGlvbiA9IHtcbiAgcmVhZG9ubHkgdHlwZTogdHlwZW9mIElOSVQ7XG59O1xuXG5leHBvcnQgdHlwZSBVcGRhdGVSZWR1Y2VyQWN0aW9uID0ge1xuICByZWFkb25seSB0eXBlOiB0eXBlb2YgVVBEQVRFO1xufTtcblxuZXhwb3J0IHR5cGUgQ29yZUFjdGlvbnMgPSBJbml0QWN0aW9uIHwgVXBkYXRlUmVkdWNlckFjdGlvbjtcbmV4cG9ydCB0eXBlIEFjdGlvbnMgPSBEZXZ0b29sc0FjdGlvbnMuQWxsIHwgQ29yZUFjdGlvbnM7XG5cbmV4cG9ydCBjb25zdCBJTklUX0FDVElPTiA9IHsgdHlwZTogSU5JVCB9O1xuXG5leHBvcnQgY29uc3QgUkVDT01QVVRFID0gJ0BuZ3J4L3N0b3JlLWRldnRvb2xzL3JlY29tcHV0ZScgYXMgJ0BuZ3J4L3N0b3JlLWRldnRvb2xzL3JlY29tcHV0ZSc7XG5leHBvcnQgY29uc3QgUkVDT01QVVRFX0FDVElPTiA9IHsgdHlwZTogUkVDT01QVVRFIH07XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcHV0ZWRTdGF0ZSB7XG4gIHN0YXRlOiBhbnk7XG4gIGVycm9yOiBhbnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlmdGVkQWN0aW9uIHtcbiAgdHlwZTogc3RyaW5nO1xuICBhY3Rpb246IEFjdGlvbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMaWZ0ZWRBY3Rpb25zIHtcbiAgW2lkOiBudW1iZXJdOiBMaWZ0ZWRBY3Rpb247XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlmdGVkU3RhdGUge1xuICBtb25pdG9yU3RhdGU6IGFueTtcbiAgbmV4dEFjdGlvbklkOiBudW1iZXI7XG4gIGFjdGlvbnNCeUlkOiBMaWZ0ZWRBY3Rpb25zO1xuICBzdGFnZWRBY3Rpb25JZHM6IG51bWJlcltdO1xuICBza2lwcGVkQWN0aW9uSWRzOiBudW1iZXJbXTtcbiAgY29tbWl0dGVkU3RhdGU6IGFueTtcbiAgY3VycmVudFN0YXRlSW5kZXg6IG51bWJlcjtcbiAgY29tcHV0ZWRTdGF0ZXM6IENvbXB1dGVkU3RhdGVbXTtcbiAgaXNMb2NrZWQ6IGJvb2xlYW47XG4gIGlzUGF1c2VkOiBib29sZWFuO1xufVxuXG4vKipcbiAqIENvbXB1dGVzIHRoZSBuZXh0IGVudHJ5IGluIHRoZSBsb2cgYnkgYXBwbHlpbmcgYW4gYWN0aW9uLlxuICovXG5mdW5jdGlvbiBjb21wdXRlTmV4dEVudHJ5KFxuICByZWR1Y2VyOiBBY3Rpb25SZWR1Y2VyPGFueSwgYW55PixcbiAgYWN0aW9uOiBBY3Rpb24sXG4gIHN0YXRlOiBhbnksXG4gIGVycm9yOiBhbnksXG4gIGVycm9ySGFuZGxlcjogRXJyb3JIYW5kbGVyXG4pIHtcbiAgaWYgKGVycm9yKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXRlLFxuICAgICAgZXJyb3I6ICdJbnRlcnJ1cHRlZCBieSBhbiBlcnJvciB1cCB0aGUgY2hhaW4nLFxuICAgIH07XG4gIH1cblxuICBsZXQgbmV4dFN0YXRlID0gc3RhdGU7XG4gIGxldCBuZXh0RXJyb3I7XG4gIHRyeSB7XG4gICAgbmV4dFN0YXRlID0gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgbmV4dEVycm9yID0gZXJyLnRvU3RyaW5nKCk7XG4gICAgZXJyb3JIYW5kbGVyLmhhbmRsZUVycm9yKGVyci5zdGFjayB8fCBlcnIpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzdGF0ZTogbmV4dFN0YXRlLFxuICAgIGVycm9yOiBuZXh0RXJyb3IsXG4gIH07XG59XG5cbi8qKlxuICogUnVucyB0aGUgcmVkdWNlciBvbiBpbnZhbGlkYXRlZCBhY3Rpb25zIHRvIGdldCBhIGZyZXNoIGNvbXB1dGF0aW9uIGxvZy5cbiAqL1xuZnVuY3Rpb24gcmVjb21wdXRlU3RhdGVzKFxuICBjb21wdXRlZFN0YXRlczogQ29tcHV0ZWRTdGF0ZVtdLFxuICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXg6IG51bWJlcixcbiAgcmVkdWNlcjogQWN0aW9uUmVkdWNlcjxhbnksIGFueT4sXG4gIGNvbW1pdHRlZFN0YXRlOiBhbnksXG4gIGFjdGlvbnNCeUlkOiBMaWZ0ZWRBY3Rpb25zLFxuICBzdGFnZWRBY3Rpb25JZHM6IG51bWJlcltdLFxuICBza2lwcGVkQWN0aW9uSWRzOiBudW1iZXJbXSxcbiAgZXJyb3JIYW5kbGVyOiBFcnJvckhhbmRsZXIsXG4gIGlzUGF1c2VkOiBib29sZWFuXG4pIHtcbiAgLy8gT3B0aW1pemF0aW9uOiBleGl0IGVhcmx5IGFuZCByZXR1cm4gdGhlIHNhbWUgcmVmZXJlbmNlXG4gIC8vIGlmIHdlIGtub3cgbm90aGluZyBjb3VsZCBoYXZlIGNoYW5nZWQuXG4gIGlmIChcbiAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPj0gY29tcHV0ZWRTdGF0ZXMubGVuZ3RoICYmXG4gICAgY29tcHV0ZWRTdGF0ZXMubGVuZ3RoID09PSBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoXG4gICkge1xuICAgIHJldHVybiBjb21wdXRlZFN0YXRlcztcbiAgfVxuXG4gIGNvbnN0IG5leHRDb21wdXRlZFN0YXRlcyA9IGNvbXB1dGVkU3RhdGVzLnNsaWNlKDAsIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCk7XG4gIC8vIElmIHRoZSByZWNvcmRpbmcgaXMgcGF1c2VkLCByZWNvbXB1dGUgYWxsIHN0YXRlcyB1cCB1bnRpbCB0aGUgcGF1c2Ugc3RhdGUsXG4gIC8vIGVsc2UgcmVjb21wdXRlIGFsbCBzdGF0ZXMuXG4gIGNvbnN0IGxhc3RJbmNsdWRlZEFjdGlvbklkID0gc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIChpc1BhdXNlZCA/IDEgOiAwKTtcbiAgZm9yIChsZXQgaSA9IG1pbkludmFsaWRhdGVkU3RhdGVJbmRleDsgaSA8IGxhc3RJbmNsdWRlZEFjdGlvbklkOyBpKyspIHtcbiAgICBjb25zdCBhY3Rpb25JZCA9IHN0YWdlZEFjdGlvbklkc1tpXTtcbiAgICBjb25zdCBhY3Rpb24gPSBhY3Rpb25zQnlJZFthY3Rpb25JZF0uYWN0aW9uO1xuXG4gICAgY29uc3QgcHJldmlvdXNFbnRyeSA9IG5leHRDb21wdXRlZFN0YXRlc1tpIC0gMV07XG4gICAgY29uc3QgcHJldmlvdXNTdGF0ZSA9IHByZXZpb3VzRW50cnkgPyBwcmV2aW91c0VudHJ5LnN0YXRlIDogY29tbWl0dGVkU3RhdGU7XG4gICAgY29uc3QgcHJldmlvdXNFcnJvciA9IHByZXZpb3VzRW50cnkgPyBwcmV2aW91c0VudHJ5LmVycm9yIDogdW5kZWZpbmVkO1xuXG4gICAgY29uc3Qgc2hvdWxkU2tpcCA9IHNraXBwZWRBY3Rpb25JZHMuaW5kZXhPZihhY3Rpb25JZCkgPiAtMTtcbiAgICBjb25zdCBlbnRyeTogQ29tcHV0ZWRTdGF0ZSA9IHNob3VsZFNraXBcbiAgICAgID8gcHJldmlvdXNFbnRyeVxuICAgICAgOiBjb21wdXRlTmV4dEVudHJ5KFxuICAgICAgICAgIHJlZHVjZXIsXG4gICAgICAgICAgYWN0aW9uLFxuICAgICAgICAgIHByZXZpb3VzU3RhdGUsXG4gICAgICAgICAgcHJldmlvdXNFcnJvcixcbiAgICAgICAgICBlcnJvckhhbmRsZXJcbiAgICAgICAgKTtcblxuICAgIG5leHRDb21wdXRlZFN0YXRlcy5wdXNoKGVudHJ5KTtcbiAgfVxuICAvLyBJZiB0aGUgcmVjb3JkaW5nIGlzIHBhdXNlZCwgdGhlIGxhc3Qgc3RhdGUgd2lsbCBub3QgYmUgcmVjb21wdXRlZCxcbiAgLy8gYmVjYXVzZSBpdCdzIGVzc2VudGlhbGx5IG5vdCBwYXJ0IG9mIHRoZSBzdGF0ZSBoaXN0b3J5LlxuICBpZiAoaXNQYXVzZWQpIHtcbiAgICBuZXh0Q29tcHV0ZWRTdGF0ZXMucHVzaChjb21wdXRlZFN0YXRlc1tjb21wdXRlZFN0YXRlcy5sZW5ndGggLSAxXSk7XG4gIH1cblxuICByZXR1cm4gbmV4dENvbXB1dGVkU3RhdGVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGlmdEluaXRpYWxTdGF0ZShcbiAgaW5pdGlhbENvbW1pdHRlZFN0YXRlPzogYW55LFxuICBtb25pdG9yUmVkdWNlcj86IGFueVxuKTogTGlmdGVkU3RhdGUge1xuICByZXR1cm4ge1xuICAgIG1vbml0b3JTdGF0ZTogbW9uaXRvclJlZHVjZXIodW5kZWZpbmVkLCB7fSksXG4gICAgbmV4dEFjdGlvbklkOiAxLFxuICAgIGFjdGlvbnNCeUlkOiB7IDA6IGxpZnRBY3Rpb24oSU5JVF9BQ1RJT04pIH0sXG4gICAgc3RhZ2VkQWN0aW9uSWRzOiBbMF0sXG4gICAgc2tpcHBlZEFjdGlvbklkczogW10sXG4gICAgY29tbWl0dGVkU3RhdGU6IGluaXRpYWxDb21taXR0ZWRTdGF0ZSxcbiAgICBjdXJyZW50U3RhdGVJbmRleDogMCxcbiAgICBjb21wdXRlZFN0YXRlczogW10sXG4gICAgaXNMb2NrZWQ6IGZhbHNlLFxuICAgIGlzUGF1c2VkOiBmYWxzZSxcbiAgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgaGlzdG9yeSBzdGF0ZSByZWR1Y2VyIGZyb20gYW4gYXBwJ3MgcmVkdWNlci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxpZnRSZWR1Y2VyV2l0aChcbiAgaW5pdGlhbENvbW1pdHRlZFN0YXRlOiBhbnksXG4gIGluaXRpYWxMaWZ0ZWRTdGF0ZTogTGlmdGVkU3RhdGUsXG4gIGVycm9ySGFuZGxlcjogRXJyb3JIYW5kbGVyLFxuICBtb25pdG9yUmVkdWNlcj86IGFueSxcbiAgb3B0aW9uczogUGFydGlhbDxTdG9yZURldnRvb2xzQ29uZmlnPiA9IHt9XG4pIHtcbiAgLyoqXG4gICAqIE1hbmFnZXMgaG93IHRoZSBoaXN0b3J5IGFjdGlvbnMgbW9kaWZ5IHRoZSBoaXN0b3J5IHN0YXRlLlxuICAgKi9cbiAgcmV0dXJuIChcbiAgICByZWR1Y2VyOiBBY3Rpb25SZWR1Y2VyPGFueSwgYW55PlxuICApOiBBY3Rpb25SZWR1Y2VyPExpZnRlZFN0YXRlLCBBY3Rpb25zPiA9PiAobGlmdGVkU3RhdGUsIGxpZnRlZEFjdGlvbikgPT4ge1xuICAgIGxldCB7XG4gICAgICBtb25pdG9yU3RhdGUsXG4gICAgICBhY3Rpb25zQnlJZCxcbiAgICAgIG5leHRBY3Rpb25JZCxcbiAgICAgIHN0YWdlZEFjdGlvbklkcyxcbiAgICAgIHNraXBwZWRBY3Rpb25JZHMsXG4gICAgICBjb21taXR0ZWRTdGF0ZSxcbiAgICAgIGN1cnJlbnRTdGF0ZUluZGV4LFxuICAgICAgY29tcHV0ZWRTdGF0ZXMsXG4gICAgICBpc0xvY2tlZCxcbiAgICAgIGlzUGF1c2VkLFxuICAgIH0gPVxuICAgICAgbGlmdGVkU3RhdGUgfHwgaW5pdGlhbExpZnRlZFN0YXRlO1xuXG4gICAgaWYgKCFsaWZ0ZWRTdGF0ZSkge1xuICAgICAgLy8gUHJldmVudCBtdXRhdGluZyBpbml0aWFsTGlmdGVkU3RhdGVcbiAgICAgIGFjdGlvbnNCeUlkID0gT2JqZWN0LmNyZWF0ZShhY3Rpb25zQnlJZCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tbWl0RXhjZXNzQWN0aW9ucyhuOiBudW1iZXIpIHtcbiAgICAgIC8vIEF1dG8tY29tbWl0cyBuLW51bWJlciBvZiBleGNlc3MgYWN0aW9ucy5cbiAgICAgIGxldCBleGNlc3MgPSBuO1xuICAgICAgbGV0IGlkc1RvRGVsZXRlID0gc3RhZ2VkQWN0aW9uSWRzLnNsaWNlKDEsIGV4Y2VzcyArIDEpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlkc1RvRGVsZXRlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChjb21wdXRlZFN0YXRlc1tpICsgMV0uZXJyb3IpIHtcbiAgICAgICAgICAvLyBTdG9wIGlmIGVycm9yIGlzIGZvdW5kLiBDb21taXQgYWN0aW9ucyB1cCB0byBlcnJvci5cbiAgICAgICAgICBleGNlc3MgPSBpO1xuICAgICAgICAgIGlkc1RvRGVsZXRlID0gc3RhZ2VkQWN0aW9uSWRzLnNsaWNlKDEsIGV4Y2VzcyArIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlbGV0ZSBhY3Rpb25zQnlJZFtpZHNUb0RlbGV0ZVtpXV07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc2tpcHBlZEFjdGlvbklkcyA9IHNraXBwZWRBY3Rpb25JZHMuZmlsdGVyKFxuICAgICAgICBpZCA9PiBpZHNUb0RlbGV0ZS5pbmRleE9mKGlkKSA9PT0gLTFcbiAgICAgICk7XG4gICAgICBzdGFnZWRBY3Rpb25JZHMgPSBbMCwgLi4uc3RhZ2VkQWN0aW9uSWRzLnNsaWNlKGV4Y2VzcyArIDEpXTtcbiAgICAgIGNvbW1pdHRlZFN0YXRlID0gY29tcHV0ZWRTdGF0ZXNbZXhjZXNzXS5zdGF0ZTtcbiAgICAgIGNvbXB1dGVkU3RhdGVzID0gY29tcHV0ZWRTdGF0ZXMuc2xpY2UoZXhjZXNzKTtcbiAgICAgIGN1cnJlbnRTdGF0ZUluZGV4ID1cbiAgICAgICAgY3VycmVudFN0YXRlSW5kZXggPiBleGNlc3MgPyBjdXJyZW50U3RhdGVJbmRleCAtIGV4Y2VzcyA6IDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tbWl0Q2hhbmdlcygpIHtcbiAgICAgIC8vIENvbnNpZGVyIHRoZSBsYXN0IGNvbW1pdHRlZCBzdGF0ZSB0aGUgbmV3IHN0YXJ0aW5nIHBvaW50LlxuICAgICAgLy8gU3F1YXNoIGFueSBzdGFnZWQgYWN0aW9ucyBpbnRvIGEgc2luZ2xlIGNvbW1pdHRlZCBzdGF0ZS5cbiAgICAgIGFjdGlvbnNCeUlkID0geyAwOiBsaWZ0QWN0aW9uKElOSVRfQUNUSU9OKSB9O1xuICAgICAgbmV4dEFjdGlvbklkID0gMTtcbiAgICAgIHN0YWdlZEFjdGlvbklkcyA9IFswXTtcbiAgICAgIHNraXBwZWRBY3Rpb25JZHMgPSBbXTtcbiAgICAgIGNvbW1pdHRlZFN0YXRlID0gY29tcHV0ZWRTdGF0ZXNbY3VycmVudFN0YXRlSW5kZXhdLnN0YXRlO1xuICAgICAgY3VycmVudFN0YXRlSW5kZXggPSAwO1xuICAgICAgY29tcHV0ZWRTdGF0ZXMgPSBbXTtcbiAgICB9XG5cbiAgICAvLyBCeSBkZWZhdWx0LCBhZ2dyZXNzaXZlbHkgcmVjb21wdXRlIGV2ZXJ5IHN0YXRlIHdoYXRldmVyIGhhcHBlbnMuXG4gICAgLy8gVGhpcyBoYXMgTyhuKSBwZXJmb3JtYW5jZSwgc28gd2UnbGwgb3ZlcnJpZGUgdGhpcyB0byBhIHNlbnNpYmxlXG4gICAgLy8gdmFsdWUgd2hlbmV2ZXIgd2UgZmVlbCBsaWtlIHdlIGRvbid0IGhhdmUgdG8gcmVjb21wdXRlIHRoZSBzdGF0ZXMuXG4gICAgbGV0IG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IDA7XG5cbiAgICBzd2l0Y2ggKGxpZnRlZEFjdGlvbi50eXBlKSB7XG4gICAgICBjYXNlIERldnRvb2xzQWN0aW9ucy5MT0NLX0NIQU5HRVM6IHtcbiAgICAgICAgaXNMb2NrZWQgPSBsaWZ0ZWRBY3Rpb24uc3RhdHVzO1xuICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBJbmZpbml0eTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIERldnRvb2xzQWN0aW9ucy5QQVVTRV9SRUNPUkRJTkc6IHtcbiAgICAgICAgaXNQYXVzZWQgPSBsaWZ0ZWRBY3Rpb24uc3RhdHVzO1xuICAgICAgICBpZiAoaXNQYXVzZWQpIHtcbiAgICAgICAgICAvLyBBZGQgYSBwYXVzZSBhY3Rpb24gdG8gc2lnbmFsIHRoZSBkZXZ0b29scy11c2VyIHRoZSByZWNvcmRpbmcgaXMgcGF1c2VkLlxuICAgICAgICAgIC8vIFRoZSBjb3JyZXNwb25kaW5nIHN0YXRlIHdpbGwgYmUgb3ZlcndyaXR0ZW4gb24gZWFjaCB1cGRhdGUgdG8gYWx3YXlzIGNvbnRhaW5cbiAgICAgICAgICAvLyB0aGUgbGF0ZXN0IHN0YXRlIChzZWUgQWN0aW9ucy5QRVJGT1JNX0FDVElPTikuXG4gICAgICAgICAgc3RhZ2VkQWN0aW9uSWRzID0gWy4uLnN0YWdlZEFjdGlvbklkcywgbmV4dEFjdGlvbklkXTtcbiAgICAgICAgICBhY3Rpb25zQnlJZFtuZXh0QWN0aW9uSWRdID0gbmV3IFBlcmZvcm1BY3Rpb24oXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHR5cGU6ICdAbmdyeC9kZXZ0b29scy9wYXVzZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgK0RhdGUubm93KClcbiAgICAgICAgICApO1xuICAgICAgICAgIG5leHRBY3Rpb25JZCsrO1xuICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSAxO1xuICAgICAgICAgIGNvbXB1dGVkU3RhdGVzID0gY29tcHV0ZWRTdGF0ZXMuY29uY2F0KFxuICAgICAgICAgICAgY29tcHV0ZWRTdGF0ZXNbY29tcHV0ZWRTdGF0ZXMubGVuZ3RoIC0gMV1cbiAgICAgICAgICApO1xuXG4gICAgICAgICAgaWYgKGN1cnJlbnRTdGF0ZUluZGV4ID09PSBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gMikge1xuICAgICAgICAgICAgY3VycmVudFN0YXRlSW5kZXgrKztcbiAgICAgICAgICB9XG4gICAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gSW5maW5pdHk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29tbWl0Q2hhbmdlcygpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuUkVTRVQ6IHtcbiAgICAgICAgLy8gR2V0IGJhY2sgdG8gdGhlIHN0YXRlIHRoZSBzdG9yZSB3YXMgY3JlYXRlZCB3aXRoLlxuICAgICAgICBhY3Rpb25zQnlJZCA9IHsgMDogbGlmdEFjdGlvbihJTklUX0FDVElPTikgfTtcbiAgICAgICAgbmV4dEFjdGlvbklkID0gMTtcbiAgICAgICAgc3RhZ2VkQWN0aW9uSWRzID0gWzBdO1xuICAgICAgICBza2lwcGVkQWN0aW9uSWRzID0gW107XG4gICAgICAgIGNvbW1pdHRlZFN0YXRlID0gaW5pdGlhbENvbW1pdHRlZFN0YXRlO1xuICAgICAgICBjdXJyZW50U3RhdGVJbmRleCA9IDA7XG4gICAgICAgIGNvbXB1dGVkU3RhdGVzID0gW107XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuQ09NTUlUOiB7XG4gICAgICAgIGNvbW1pdENoYW5nZXMoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIERldnRvb2xzQWN0aW9ucy5ST0xMQkFDSzoge1xuICAgICAgICAvLyBGb3JnZXQgYWJvdXQgYW55IHN0YWdlZCBhY3Rpb25zLlxuICAgICAgICAvLyBTdGFydCBhZ2FpbiBmcm9tIHRoZSBsYXN0IGNvbW1pdHRlZCBzdGF0ZS5cbiAgICAgICAgYWN0aW9uc0J5SWQgPSB7IDA6IGxpZnRBY3Rpb24oSU5JVF9BQ1RJT04pIH07XG4gICAgICAgIG5leHRBY3Rpb25JZCA9IDE7XG4gICAgICAgIHN0YWdlZEFjdGlvbklkcyA9IFswXTtcbiAgICAgICAgc2tpcHBlZEFjdGlvbklkcyA9IFtdO1xuICAgICAgICBjdXJyZW50U3RhdGVJbmRleCA9IDA7XG4gICAgICAgIGNvbXB1dGVkU3RhdGVzID0gW107XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuVE9HR0xFX0FDVElPTjoge1xuICAgICAgICAvLyBUb2dnbGUgd2hldGhlciBhbiBhY3Rpb24gd2l0aCBnaXZlbiBJRCBpcyBza2lwcGVkLlxuICAgICAgICAvLyBCZWluZyBza2lwcGVkIG1lYW5zIGl0IGlzIGEgbm8tb3AgZHVyaW5nIHRoZSBjb21wdXRhdGlvbi5cbiAgICAgICAgY29uc3QgeyBpZDogYWN0aW9uSWQgfSA9IGxpZnRlZEFjdGlvbjtcbiAgICAgICAgY29uc3QgaW5kZXggPSBza2lwcGVkQWN0aW9uSWRzLmluZGV4T2YoYWN0aW9uSWQpO1xuICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgc2tpcHBlZEFjdGlvbklkcyA9IFthY3Rpb25JZCwgLi4uc2tpcHBlZEFjdGlvbklkc107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2tpcHBlZEFjdGlvbklkcyA9IHNraXBwZWRBY3Rpb25JZHMuZmlsdGVyKGlkID0+IGlkICE9PSBhY3Rpb25JZCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gT3B0aW1pemF0aW9uOiB3ZSBrbm93IGhpc3RvcnkgYmVmb3JlIHRoaXMgYWN0aW9uIGhhc24ndCBjaGFuZ2VkXG4gICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IHN0YWdlZEFjdGlvbklkcy5pbmRleE9mKGFjdGlvbklkKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIERldnRvb2xzQWN0aW9ucy5TRVRfQUNUSU9OU19BQ1RJVkU6IHtcbiAgICAgICAgLy8gVG9nZ2xlIHdoZXRoZXIgYW4gYWN0aW9uIHdpdGggZ2l2ZW4gSUQgaXMgc2tpcHBlZC5cbiAgICAgICAgLy8gQmVpbmcgc2tpcHBlZCBtZWFucyBpdCBpcyBhIG5vLW9wIGR1cmluZyB0aGUgY29tcHV0YXRpb24uXG4gICAgICAgIGNvbnN0IHsgc3RhcnQsIGVuZCwgYWN0aXZlIH0gPSBsaWZ0ZWRBY3Rpb247XG4gICAgICAgIGNvbnN0IGFjdGlvbklkcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykgYWN0aW9uSWRzLnB1c2goaSk7XG4gICAgICAgIGlmIChhY3RpdmUpIHtcbiAgICAgICAgICBza2lwcGVkQWN0aW9uSWRzID0gZGlmZmVyZW5jZShza2lwcGVkQWN0aW9uSWRzLCBhY3Rpb25JZHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNraXBwZWRBY3Rpb25JZHMgPSBbLi4uc2tpcHBlZEFjdGlvbklkcywgLi4uYWN0aW9uSWRzXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE9wdGltaXphdGlvbjogd2Uga25vdyBoaXN0b3J5IGJlZm9yZSB0aGlzIGFjdGlvbiBoYXNuJ3QgY2hhbmdlZFxuICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBzdGFnZWRBY3Rpb25JZHMuaW5kZXhPZihzdGFydCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuSlVNUF9UT19TVEFURToge1xuICAgICAgICAvLyBXaXRob3V0IHJlY29tcHV0aW5nIGFueXRoaW5nLCBtb3ZlIHRoZSBwb2ludGVyIHRoYXQgdGVsbCB1c1xuICAgICAgICAvLyB3aGljaCBzdGF0ZSBpcyBjb25zaWRlcmVkIHRoZSBjdXJyZW50IG9uZS4gVXNlZnVsIGZvciBzbGlkZXJzLlxuICAgICAgICBjdXJyZW50U3RhdGVJbmRleCA9IGxpZnRlZEFjdGlvbi5pbmRleDtcbiAgICAgICAgLy8gT3B0aW1pemF0aW9uOiB3ZSBrbm93IHRoZSBoaXN0b3J5IGhhcyBub3QgY2hhbmdlZC5cbiAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gSW5maW5pdHk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuSlVNUF9UT19BQ1RJT046IHtcbiAgICAgICAgLy8gSnVtcHMgdG8gYSBjb3JyZXNwb25kaW5nIHN0YXRlIHRvIGEgc3BlY2lmaWMgYWN0aW9uLlxuICAgICAgICAvLyBVc2VmdWwgd2hlbiBmaWx0ZXJpbmcgYWN0aW9ucy5cbiAgICAgICAgY29uc3QgaW5kZXggPSBzdGFnZWRBY3Rpb25JZHMuaW5kZXhPZihsaWZ0ZWRBY3Rpb24uYWN0aW9uSWQpO1xuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSBjdXJyZW50U3RhdGVJbmRleCA9IGluZGV4O1xuICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBJbmZpbml0eTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIERldnRvb2xzQWN0aW9ucy5TV0VFUDoge1xuICAgICAgICAvLyBGb3JnZXQgYW55IGFjdGlvbnMgdGhhdCBhcmUgY3VycmVudGx5IGJlaW5nIHNraXBwZWQuXG4gICAgICAgIHN0YWdlZEFjdGlvbklkcyA9IGRpZmZlcmVuY2Uoc3RhZ2VkQWN0aW9uSWRzLCBza2lwcGVkQWN0aW9uSWRzKTtcbiAgICAgICAgc2tpcHBlZEFjdGlvbklkcyA9IFtdO1xuICAgICAgICBjdXJyZW50U3RhdGVJbmRleCA9IE1hdGgubWluKFxuICAgICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4LFxuICAgICAgICAgIHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSAxXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuUEVSRk9STV9BQ1RJT046IHtcbiAgICAgICAgLy8gSWdub3JlIGFjdGlvbiBhbmQgcmV0dXJuIHN0YXRlIGFzIGlzIGlmIHJlY29yZGluZyBpcyBsb2NrZWRcbiAgICAgICAgaWYgKGlzTG9ja2VkKSB7XG4gICAgICAgICAgcmV0dXJuIGxpZnRlZFN0YXRlIHx8IGluaXRpYWxMaWZ0ZWRTdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICBpc1BhdXNlZCB8fFxuICAgICAgICAgIChsaWZ0ZWRTdGF0ZSAmJlxuICAgICAgICAgICAgaXNBY3Rpb25GaWx0ZXJlZChcbiAgICAgICAgICAgICAgbGlmdGVkU3RhdGUuY29tcHV0ZWRTdGF0ZXNbY3VycmVudFN0YXRlSW5kZXhdLFxuICAgICAgICAgICAgICBsaWZ0ZWRBY3Rpb24sXG4gICAgICAgICAgICAgIG9wdGlvbnMucHJlZGljYXRlLFxuICAgICAgICAgICAgICBvcHRpb25zLmFjdGlvbnNTYWZlbGlzdCxcbiAgICAgICAgICAgICAgb3B0aW9ucy5hY3Rpb25zQmxvY2tsaXN0XG4gICAgICAgICAgICApKVxuICAgICAgICApIHtcbiAgICAgICAgICAvLyBJZiByZWNvcmRpbmcgaXMgcGF1c2VkIG9yIGlmIHRoZSBhY3Rpb24gc2hvdWxkIGJlIGlnbm9yZWQsIG92ZXJ3cml0ZSB0aGUgbGFzdCBzdGF0ZVxuICAgICAgICAgIC8vIChjb3JyZXNwb25kcyB0byB0aGUgcGF1c2UgYWN0aW9uKSBhbmQga2VlcCBldmVyeXRoaW5nIGVsc2UgYXMgaXMuXG4gICAgICAgICAgLy8gVGhpcyB3YXksIHRoZSBhcHAgZ2V0cyB0aGUgbmV3IGN1cnJlbnQgc3RhdGUgd2hpbGUgdGhlIGRldnRvb2xzXG4gICAgICAgICAgLy8gZG8gbm90IHJlY29yZCBhbm90aGVyIGFjdGlvbi5cbiAgICAgICAgICBjb25zdCBsYXN0U3RhdGUgPSBjb21wdXRlZFN0YXRlc1tjb21wdXRlZFN0YXRlcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICBjb21wdXRlZFN0YXRlcyA9IFtcbiAgICAgICAgICAgIC4uLmNvbXB1dGVkU3RhdGVzLnNsaWNlKDAsIC0xKSxcbiAgICAgICAgICAgIGNvbXB1dGVOZXh0RW50cnkoXG4gICAgICAgICAgICAgIHJlZHVjZXIsXG4gICAgICAgICAgICAgIGxpZnRlZEFjdGlvbi5hY3Rpb24sXG4gICAgICAgICAgICAgIGxhc3RTdGF0ZS5zdGF0ZSxcbiAgICAgICAgICAgICAgbGFzdFN0YXRlLmVycm9yLFxuICAgICAgICAgICAgICBlcnJvckhhbmRsZXJcbiAgICAgICAgICAgICksXG4gICAgICAgICAgXTtcbiAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBJbmZpbml0eTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEF1dG8tY29tbWl0IGFzIG5ldyBhY3Rpb25zIGNvbWUgaW4uXG4gICAgICAgIGlmIChvcHRpb25zLm1heEFnZSAmJiBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoID09PSBvcHRpb25zLm1heEFnZSkge1xuICAgICAgICAgIGNvbW1pdEV4Y2Vzc0FjdGlvbnMoMSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3VycmVudFN0YXRlSW5kZXggPT09IHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgY3VycmVudFN0YXRlSW5kZXgrKztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhY3Rpb25JZCA9IG5leHRBY3Rpb25JZCsrO1xuICAgICAgICAvLyBNdXRhdGlvbiEgVGhpcyBpcyB0aGUgaG90dGVzdCBwYXRoLCBhbmQgd2Ugb3B0aW1pemUgb24gcHVycG9zZS5cbiAgICAgICAgLy8gSXQgaXMgc2FmZSBiZWNhdXNlIHdlIHNldCBhIG5ldyBrZXkgaW4gYSBjYWNoZSBkaWN0aW9uYXJ5LlxuICAgICAgICBhY3Rpb25zQnlJZFthY3Rpb25JZF0gPSBsaWZ0ZWRBY3Rpb247XG5cbiAgICAgICAgc3RhZ2VkQWN0aW9uSWRzID0gWy4uLnN0YWdlZEFjdGlvbklkcywgYWN0aW9uSWRdO1xuICAgICAgICAvLyBPcHRpbWl6YXRpb246IHdlIGtub3cgdGhhdCBvbmx5IHRoZSBuZXcgYWN0aW9uIG5lZWRzIGNvbXB1dGluZy5cbiAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIDE7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuSU1QT1JUX1NUQVRFOiB7XG4gICAgICAgIC8vIENvbXBsZXRlbHkgcmVwbGFjZSBldmVyeXRoaW5nLlxuICAgICAgICAoe1xuICAgICAgICAgIG1vbml0b3JTdGF0ZSxcbiAgICAgICAgICBhY3Rpb25zQnlJZCxcbiAgICAgICAgICBuZXh0QWN0aW9uSWQsXG4gICAgICAgICAgc3RhZ2VkQWN0aW9uSWRzLFxuICAgICAgICAgIHNraXBwZWRBY3Rpb25JZHMsXG4gICAgICAgICAgY29tbWl0dGVkU3RhdGUsXG4gICAgICAgICAgY3VycmVudFN0YXRlSW5kZXgsXG4gICAgICAgICAgY29tcHV0ZWRTdGF0ZXMsXG4gICAgICAgICAgaXNMb2NrZWQsXG4gICAgICAgICAgLy8gcHJldHRpZXItaWdub3JlXG4gICAgICAgICAgaXNQYXVzZWRcbiAgICAgICAgfSA9IGxpZnRlZEFjdGlvbi5uZXh0TGlmdGVkU3RhdGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgSU5JVDoge1xuICAgICAgICAvLyBBbHdheXMgcmVjb21wdXRlIHN0YXRlcyBvbiBob3QgcmVsb2FkIGFuZCBpbml0LlxuICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSAwO1xuXG4gICAgICAgIGlmIChvcHRpb25zLm1heEFnZSAmJiBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoID4gb3B0aW9ucy5tYXhBZ2UpIHtcbiAgICAgICAgICAvLyBTdGF0ZXMgbXVzdCBiZSByZWNvbXB1dGVkIGJlZm9yZSBjb21taXR0aW5nIGV4Y2Vzcy5cbiAgICAgICAgICBjb21wdXRlZFN0YXRlcyA9IHJlY29tcHV0ZVN0YXRlcyhcbiAgICAgICAgICAgIGNvbXB1dGVkU3RhdGVzLFxuICAgICAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4LFxuICAgICAgICAgICAgcmVkdWNlcixcbiAgICAgICAgICAgIGNvbW1pdHRlZFN0YXRlLFxuICAgICAgICAgICAgYWN0aW9uc0J5SWQsXG4gICAgICAgICAgICBzdGFnZWRBY3Rpb25JZHMsXG4gICAgICAgICAgICBza2lwcGVkQWN0aW9uSWRzLFxuICAgICAgICAgICAgZXJyb3JIYW5kbGVyLFxuICAgICAgICAgICAgaXNQYXVzZWRcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgY29tbWl0RXhjZXNzQWN0aW9ucyhzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gb3B0aW9ucy5tYXhBZ2UpO1xuXG4gICAgICAgICAgLy8gQXZvaWQgZG91YmxlIGNvbXB1dGF0aW9uLlxuICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IEluZmluaXR5O1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIFVQREFURToge1xuICAgICAgICBjb25zdCBzdGF0ZUhhc0Vycm9ycyA9XG4gICAgICAgICAgY29tcHV0ZWRTdGF0ZXMuZmlsdGVyKHN0YXRlID0+IHN0YXRlLmVycm9yKS5sZW5ndGggPiAwO1xuXG4gICAgICAgIGlmIChzdGF0ZUhhc0Vycm9ycykge1xuICAgICAgICAgIC8vIFJlY29tcHV0ZSBhbGwgc3RhdGVzXG4gICAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gMDtcblxuICAgICAgICAgIGlmIChvcHRpb25zLm1heEFnZSAmJiBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoID4gb3B0aW9ucy5tYXhBZ2UpIHtcbiAgICAgICAgICAgIC8vIFN0YXRlcyBtdXN0IGJlIHJlY29tcHV0ZWQgYmVmb3JlIGNvbW1pdHRpbmcgZXhjZXNzLlxuICAgICAgICAgICAgY29tcHV0ZWRTdGF0ZXMgPSByZWNvbXB1dGVTdGF0ZXMoXG4gICAgICAgICAgICAgIGNvbXB1dGVkU3RhdGVzLFxuICAgICAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXgsXG4gICAgICAgICAgICAgIHJlZHVjZXIsXG4gICAgICAgICAgICAgIGNvbW1pdHRlZFN0YXRlLFxuICAgICAgICAgICAgICBhY3Rpb25zQnlJZCxcbiAgICAgICAgICAgICAgc3RhZ2VkQWN0aW9uSWRzLFxuICAgICAgICAgICAgICBza2lwcGVkQWN0aW9uSWRzLFxuICAgICAgICAgICAgICBlcnJvckhhbmRsZXIsXG4gICAgICAgICAgICAgIGlzUGF1c2VkXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb21taXRFeGNlc3NBY3Rpb25zKHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSBvcHRpb25zLm1heEFnZSk7XG5cbiAgICAgICAgICAgIC8vIEF2b2lkIGRvdWJsZSBjb21wdXRhdGlvbi5cbiAgICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IEluZmluaXR5O1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBJZiBub3QgcGF1c2VkL2xvY2tlZCwgYWRkIGEgbmV3IGFjdGlvbiB0byBzaWduYWwgZGV2dG9vbHMtdXNlclxuICAgICAgICAgIC8vIHRoYXQgdGhlcmUgd2FzIGEgcmVkdWNlciB1cGRhdGUuXG4gICAgICAgICAgaWYgKCFpc1BhdXNlZCAmJiAhaXNMb2NrZWQpIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50U3RhdGVJbmRleCA9PT0gc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgY3VycmVudFN0YXRlSW5kZXgrKztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQWRkIGEgbmV3IGFjdGlvbiB0byBvbmx5IHJlY29tcHV0ZSBzdGF0ZVxuICAgICAgICAgICAgY29uc3QgYWN0aW9uSWQgPSBuZXh0QWN0aW9uSWQrKztcbiAgICAgICAgICAgIGFjdGlvbnNCeUlkW2FjdGlvbklkXSA9IG5ldyBQZXJmb3JtQWN0aW9uKFxuICAgICAgICAgICAgICBsaWZ0ZWRBY3Rpb24sXG4gICAgICAgICAgICAgICtEYXRlLm5vdygpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgc3RhZ2VkQWN0aW9uSWRzID0gWy4uLnN0YWdlZEFjdGlvbklkcywgYWN0aW9uSWRdO1xuXG4gICAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gMTtcblxuICAgICAgICAgICAgY29tcHV0ZWRTdGF0ZXMgPSByZWNvbXB1dGVTdGF0ZXMoXG4gICAgICAgICAgICAgIGNvbXB1dGVkU3RhdGVzLFxuICAgICAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXgsXG4gICAgICAgICAgICAgIHJlZHVjZXIsXG4gICAgICAgICAgICAgIGNvbW1pdHRlZFN0YXRlLFxuICAgICAgICAgICAgICBhY3Rpb25zQnlJZCxcbiAgICAgICAgICAgICAgc3RhZ2VkQWN0aW9uSWRzLFxuICAgICAgICAgICAgICBza2lwcGVkQWN0aW9uSWRzLFxuICAgICAgICAgICAgICBlcnJvckhhbmRsZXIsXG4gICAgICAgICAgICAgIGlzUGF1c2VkXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFJlY29tcHV0ZSBzdGF0ZSBoaXN0b3J5IHdpdGggbGF0ZXN0IHJlZHVjZXIgYW5kIHVwZGF0ZSBhY3Rpb25cbiAgICAgICAgICBjb21wdXRlZFN0YXRlcyA9IGNvbXB1dGVkU3RhdGVzLm1hcChjbXAgPT4gKHtcbiAgICAgICAgICAgIC4uLmNtcCxcbiAgICAgICAgICAgIHN0YXRlOiByZWR1Y2VyKGNtcC5zdGF0ZSwgUkVDT01QVVRFX0FDVElPTiksXG4gICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgY3VycmVudFN0YXRlSW5kZXggPSBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gMTtcblxuICAgICAgICAgIGlmIChvcHRpb25zLm1heEFnZSAmJiBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoID4gb3B0aW9ucy5tYXhBZ2UpIHtcbiAgICAgICAgICAgIGNvbW1pdEV4Y2Vzc0FjdGlvbnMoc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIG9wdGlvbnMubWF4QWdlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBBdm9pZCBkb3VibGUgY29tcHV0YXRpb24uXG4gICAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gSW5maW5pdHk7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgLy8gSWYgdGhlIGFjdGlvbiBpcyBub3QgcmVjb2duaXplZCwgaXQncyBhIG1vbml0b3IgYWN0aW9uLlxuICAgICAgICAvLyBPcHRpbWl6YXRpb246IGEgbW9uaXRvciBhY3Rpb24gY2FuJ3QgY2hhbmdlIGhpc3RvcnkuXG4gICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IEluZmluaXR5O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb21wdXRlZFN0YXRlcyA9IHJlY29tcHV0ZVN0YXRlcyhcbiAgICAgIGNvbXB1dGVkU3RhdGVzLFxuICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4LFxuICAgICAgcmVkdWNlcixcbiAgICAgIGNvbW1pdHRlZFN0YXRlLFxuICAgICAgYWN0aW9uc0J5SWQsXG4gICAgICBzdGFnZWRBY3Rpb25JZHMsXG4gICAgICBza2lwcGVkQWN0aW9uSWRzLFxuICAgICAgZXJyb3JIYW5kbGVyLFxuICAgICAgaXNQYXVzZWRcbiAgICApO1xuICAgIG1vbml0b3JTdGF0ZSA9IG1vbml0b3JSZWR1Y2VyKG1vbml0b3JTdGF0ZSwgbGlmdGVkQWN0aW9uKTtcblxuICAgIHJldHVybiB7XG4gICAgICBtb25pdG9yU3RhdGUsXG4gICAgICBhY3Rpb25zQnlJZCxcbiAgICAgIG5leHRBY3Rpb25JZCxcbiAgICAgIHN0YWdlZEFjdGlvbklkcyxcbiAgICAgIHNraXBwZWRBY3Rpb25JZHMsXG4gICAgICBjb21taXR0ZWRTdGF0ZSxcbiAgICAgIGN1cnJlbnRTdGF0ZUluZGV4LFxuICAgICAgY29tcHV0ZWRTdGF0ZXMsXG4gICAgICBpc0xvY2tlZCxcbiAgICAgIGlzUGF1c2VkLFxuICAgIH07XG4gIH07XG59XG4iXX0=