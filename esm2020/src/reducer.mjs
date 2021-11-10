import { UPDATE, INIT } from '@ngrx/store';
import { difference, liftAction, isActionFiltered } from './utils';
import * as DevtoolsActions from './actions';
import { PerformAction } from './actions';
export const INIT_ACTION = { type: INIT };
export const RECOMPUTE = '@ngrx/store-devtools/recompute';
export const RECOMPUTE_ACTION = { type: RECOMPUTE };
/**
 * Computes the next entry in the log by applying an action.
 */
function computeNextEntry(reducer, action, state, error, errorHandler) {
    if (error) {
        return {
            state,
            error: 'Interrupted by an error up the chain',
        };
    }
    let nextState = state;
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
 */
function recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, errorHandler, isPaused) {
    // Optimization: exit early and return the same reference
    // if we know nothing could have changed.
    if (minInvalidatedStateIndex >= computedStates.length &&
        computedStates.length === stagedActionIds.length) {
        return computedStates;
    }
    const nextComputedStates = computedStates.slice(0, minInvalidatedStateIndex);
    // If the recording is paused, recompute all states up until the pause state,
    // else recompute all states.
    const lastIncludedActionId = stagedActionIds.length - (isPaused ? 1 : 0);
    for (let i = minInvalidatedStateIndex; i < lastIncludedActionId; i++) {
        const actionId = stagedActionIds[i];
        const action = actionsById[actionId].action;
        const previousEntry = nextComputedStates[i - 1];
        const previousState = previousEntry ? previousEntry.state : committedState;
        const previousError = previousEntry ? previousEntry.error : undefined;
        const shouldSkip = skippedActionIds.indexOf(actionId) > -1;
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
        function commitExcessActions(n) {
            // Auto-commits n-number of excess actions.
            let excess = n;
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
            skippedActionIds = skippedActionIds.filter((id) => idsToDelete.indexOf(id) === -1);
            stagedActionIds = [0, ...stagedActionIds.slice(excess + 1)];
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
                const index = skippedActionIds.indexOf(actionId);
                if (index === -1) {
                    skippedActionIds = [actionId, ...skippedActionIds];
                }
                else {
                    skippedActionIds = skippedActionIds.filter((id) => id !== actionId);
                }
                // Optimization: we know history before this action hasn't changed
                minInvalidatedStateIndex = stagedActionIds.indexOf(actionId);
                break;
            }
            case DevtoolsActions.SET_ACTIONS_ACTIVE: {
                // Toggle whether an action with given ID is skipped.
                // Being skipped means it is a no-op during the computation.
                const { start, end, active } = liftedAction;
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
                const stateHasErrors = computedStates.filter((state) => state.error).length > 0;
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
                        const actionId = nextActionId++;
                        actionsById[actionId] = new PerformAction(liftedAction, +Date.now());
                        stagedActionIds = [...stagedActionIds, actionId];
                        minInvalidatedStateIndex = stagedActionIds.length - 1;
                        computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, errorHandler, isPaused);
                    }
                    // Recompute state history with latest reducer and update action
                    computedStates = computedStates.map((cmp) => ({
                        ...cmp,
                        state: reducer(cmp.state, RECOMPUTE_ACTION),
                    }));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkdWNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21vZHVsZXMvc3RvcmUtZGV2dG9vbHMvc3JjL3JlZHVjZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUF5QixNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRWxFLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ25FLE9BQU8sS0FBSyxlQUFlLE1BQU0sV0FBVyxDQUFDO0FBRTdDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFhMUMsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDO0FBRTFDLE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBRyxnQ0FBeUMsQ0FBQztBQUNuRSxNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQztBQTZCcEQ7O0dBRUc7QUFDSCxTQUFTLGdCQUFnQixDQUN2QixPQUFnQyxFQUNoQyxNQUFjLEVBQ2QsS0FBVSxFQUNWLEtBQVUsRUFDVixZQUEwQjtJQUUxQixJQUFJLEtBQUssRUFBRTtRQUNULE9BQU87WUFDTCxLQUFLO1lBQ0wsS0FBSyxFQUFFLHNDQUFzQztTQUM5QyxDQUFDO0tBQ0g7SUFFRCxJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDdEIsSUFBSSxTQUFTLENBQUM7SUFDZCxJQUFJO1FBQ0YsU0FBUyxHQUFHLE9BQU8sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDcEM7SUFBQyxPQUFPLEdBQVEsRUFBRTtRQUNqQixTQUFTLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzNCLFlBQVksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDL0I7SUFFRCxPQUFPO1FBQ0ws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USxDQUNULENBQUM7UUFDRixZQUFZLEdBQUcsY0FBYyxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQztRQUUxRCxPQUFPO1lBQ0wsWUFBWTtZQUNaLFdBQVc7WUFDWCxZQUFZO1lBQ1osZUFBZTtZQUNmLGdCQUFnQjtZQUNoQixjQUFjO1lBQ2QsaUJBQWlCO1lBQ2pCLGNBQWM7WUFDZCxRQUFRO1lBQ1IsUUFBUTtTQUNULENBQUM7SUFDSixDQUFDLENBQUM7QUFDTixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXJyb3JIYW5kbGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24sIEFjdGlvblJlZHVjZXIsIFVQREFURSwgSU5JVCB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcblxuaW1wb3J0IHsgZGlmZmVyZW5jZSwgbGlmdEFjdGlvbiwgaXNBY3Rpb25GaWx0ZXJlZCB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0ICogYXMgRGV2dG9vbHNBY3Rpb25zIGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgeyBTdG9yZURldnRvb2xzQ29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgUGVyZm9ybUFjdGlvbiB9IGZyb20gJy4vYWN0aW9ucyc7XG5cbmV4cG9ydCB0eXBlIEluaXRBY3Rpb24gPSB7XG4gIHJlYWRvbmx5IHR5cGU6IHR5cGVvZiBJTklUO1xufTtcblxuZXhwb3J0IHR5cGUgVXBkYXRlUmVkdWNlckFjdGlvbiA9IHtcbiAgcmVhZG9ubHkgdHlwZTogdHlwZW9mIFVQREFURTtcbn07XG5cbmV4cG9ydCB0eXBlIENvcmVBY3Rpb25zID0gSW5pdEFjdGlvbiB8IFVwZGF0ZVJlZHVjZXJBY3Rpb247XG5leHBvcnQgdHlwZSBBY3Rpb25zID0gRGV2dG9vbHNBY3Rpb25zLkFsbCB8IENvcmVBY3Rpb25zO1xuXG5leHBvcnQgY29uc3QgSU5JVF9BQ1RJT04gPSB7IHR5cGU6IElOSVQgfTtcblxuZXhwb3J0IGNvbnN0IFJFQ09NUFVURSA9ICdAbmdyeC9zdG9yZS1kZXZ0b29scy9yZWNvbXB1dGUnIGFzIGNvbnN0O1xuZXhwb3J0IGNvbnN0IFJFQ09NUFVURV9BQ1RJT04gPSB7IHR5cGU6IFJFQ09NUFVURSB9O1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbXB1dGVkU3RhdGUge1xuICBzdGF0ZTogYW55O1xuICBlcnJvcjogYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZnRlZEFjdGlvbiB7XG4gIHR5cGU6IHN0cmluZztcbiAgYWN0aW9uOiBBY3Rpb247XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlmdGVkQWN0aW9ucyB7XG4gIFtpZDogbnVtYmVyXTogTGlmdGVkQWN0aW9uO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZnRlZFN0YXRlIHtcbiAgbW9uaXRvclN0YXRlOiBhbnk7XG4gIG5leHRBY3Rpb25JZDogbnVtYmVyO1xuICBhY3Rpb25zQnlJZDogTGlmdGVkQWN0aW9ucztcbiAgc3RhZ2VkQWN0aW9uSWRzOiBudW1iZXJbXTtcbiAgc2tpcHBlZEFjdGlvbklkczogbnVtYmVyW107XG4gIGNvbW1pdHRlZFN0YXRlOiBhbnk7XG4gIGN1cnJlbnRTdGF0ZUluZGV4OiBudW1iZXI7XG4gIGNvbXB1dGVkU3RhdGVzOiBDb21wdXRlZFN0YXRlW107XG4gIGlzTG9ja2VkOiBib29sZWFuO1xuICBpc1BhdXNlZDogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgbmV4dCBlbnRyeSBpbiB0aGUgbG9nIGJ5IGFwcGx5aW5nIGFuIGFjdGlvbi5cbiAqL1xuZnVuY3Rpb24gY29tcHV0ZU5leHRFbnRyeShcbiAgcmVkdWNlcjogQWN0aW9uUmVkdWNlcjxhbnksIGFueT4sXG4gIGFjdGlvbjogQWN0aW9uLFxuICBzdGF0ZTogYW55LFxuICBlcnJvcjogYW55LFxuICBlcnJvckhhbmRsZXI6IEVycm9ySGFuZGxlclxuKSB7XG4gIGlmIChlcnJvcikge1xuICAgIHJldHVybiB7XG4gICAgICBzdGF0ZSxcbiAgICAgIGVycm9yOiAnSW50ZXJydXB0ZWQgYnkgYW4gZXJyb3IgdXAgdGhlIGNoYWluJyxcbiAgICB9O1xuICB9XG5cbiAgbGV0IG5leHRTdGF0ZSA9IHN0YXRlO1xuICBsZXQgbmV4dEVycm9yO1xuICB0cnkge1xuICAgIG5leHRTdGF0ZSA9IHJlZHVjZXIoc3RhdGUsIGFjdGlvbik7XG4gIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgbmV4dEVycm9yID0gZXJyLnRvU3RyaW5nKCk7XG4gICAgZXJyb3JIYW5kbGVyLmhhbmRsZUVycm9yKGVycik7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHN0YXRlOiBuZXh0U3RhdGUsXG4gICAgZXJyb3I6IG5leHRFcnJvcixcbiAgfTtcbn1cblxuLyoqXG4gKiBSdW5zIHRoZSByZWR1Y2VyIG9uIGludmFsaWRhdGVkIGFjdGlvbnMgdG8gZ2V0IGEgZnJlc2ggY29tcHV0YXRpb24gbG9nLlxuICovXG5mdW5jdGlvbiByZWNvbXB1dGVTdGF0ZXMoXG4gIGNvbXB1dGVkU3RhdGVzOiBDb21wdXRlZFN0YXRlW10sXG4gIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleDogbnVtYmVyLFxuICByZWR1Y2VyOiBBY3Rpb25SZWR1Y2VyPGFueSwgYW55PixcbiAgY29tbWl0dGVkU3RhdGU6IGFueSxcbiAgYWN0aW9uc0J5SWQ6IExpZnRlZEFjdGlvbnMsXG4gIHN0YWdlZEFjdGlvbklkczogbnVtYmVyW10sXG4gIHNraXBwZWRBY3Rpb25JZHM6IG51bWJlcltdLFxuICBlcnJvckhhbmRsZXI6IEVycm9ySGFuZGxlcixcbiAgaXNQYXVzZWQ6IGJvb2xlYW5cbikge1xuICAvLyBPcHRpbWl6YXRpb246IGV4aXQgZWFybHkgYW5kIHJldHVybiB0aGUgc2FtZSByZWZlcmVuY2VcbiAgLy8gaWYgd2Uga25vdyBub3RoaW5nIGNvdWxkIGhhdmUgY2hhbmdlZC5cbiAgaWYgKFxuICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA+PSBjb21wdXRlZFN0YXRlcy5sZW5ndGggJiZcbiAgICBjb21wdXRlZFN0YXRlcy5sZW5ndGggPT09IHN0YWdlZEFjdGlvbklkcy5sZW5ndGhcbiAgKSB7XG4gICAgcmV0dXJuIGNvbXB1dGVkU3RhdGVzO1xuICB9XG5cbiAgY29uc3QgbmV4dENvbXB1dGVkU3RhdGVzID0gY29tcHV0ZWRTdGF0ZXMuc2xpY2UoMCwgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4KTtcbiAgLy8gSWYgdGhlIHJlY29yZGluZyBpcyBwYXVzZWQsIHJlY29tcHV0ZSBhbGwgc3RhdGVzIHVwIHVudGlsIHRoZSBwYXVzZSBzdGF0ZSxcbiAgLy8gZWxzZSByZWNvbXB1dGUgYWxsIHN0YXRlcy5cbiAgY29uc3QgbGFzdEluY2x1ZGVkQWN0aW9uSWQgPSBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gKGlzUGF1c2VkID8gMSA6IDApO1xuICBmb3IgKGxldCBpID0gbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4OyBpIDwgbGFzdEluY2x1ZGVkQWN0aW9uSWQ7IGkrKykge1xuICAgIGNvbnN0IGFjdGlvbklkID0gc3RhZ2VkQWN0aW9uSWRzW2ldO1xuICAgIGNvbnN0IGFjdGlvbiA9IGFjdGlvbnNCeUlkW2FjdGlvbklkXS5hY3Rpb247XG5cbiAgICBjb25zdCBwcmV2aW91c0VudHJ5ID0gbmV4dENvbXB1dGVkU3RhdGVzW2kgLSAxXTtcbiAgICBjb25zdCBwcmV2aW91c1N0YXRlID0gcHJldmlvdXNFbnRyeSA/IHByZXZpb3VzRW50cnkuc3RhdGUgOiBjb21taXR0ZWRTdGF0ZTtcbiAgICBjb25zdCBwcmV2aW91c0Vycm9yID0gcHJldmlvdXNFbnRyeSA/IHByZXZpb3VzRW50cnkuZXJyb3IgOiB1bmRlZmluZWQ7XG5cbiAgICBjb25zdCBzaG91bGRTa2lwID0gc2tpcHBlZEFjdGlvbklkcy5pbmRleE9mKGFjdGlvbklkKSA+IC0xO1xuICAgIGNvbnN0IGVudHJ5OiBDb21wdXRlZFN0YXRlID0gc2hvdWxkU2tpcFxuICAgICAgPyBwcmV2aW91c0VudHJ5XG4gICAgICA6IGNvbXB1dGVOZXh0RW50cnkoXG4gICAgICAgICAgcmVkdWNlcixcbiAgICAgICAgICBhY3Rpb24sXG4gICAgICAgICAgcHJldmlvdXNTdGF0ZSxcbiAgICAgICAgICBwcmV2aW91c0Vycm9yLFxuICAgICAgICAgIGVycm9ySGFuZGxlclxuICAgICAgICApO1xuXG4gICAgbmV4dENvbXB1dGVkU3RhdGVzLnB1c2goZW50cnkpO1xuICB9XG4gIC8vIElmIHRoZSByZWNvcmRpbmcgaXMgcGF1c2VkLCB0aGUgbGFzdCBzdGF0ZSB3aWxsIG5vdCBiZSByZWNvbXB1dGVkLFxuICAvLyBiZWNhdXNlIGl0J3MgZXNzZW50aWFsbHkgbm90IHBhcnQgb2YgdGhlIHN0YXRlIGhpc3RvcnkuXG4gIGlmIChpc1BhdXNlZCkge1xuICAgIG5leHRDb21wdXRlZFN0YXRlcy5wdXNoKGNvbXB1dGVkU3RhdGVzW2NvbXB1dGVkU3RhdGVzLmxlbmd0aCAtIDFdKTtcbiAgfVxuXG4gIHJldHVybiBuZXh0Q29tcHV0ZWRTdGF0ZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsaWZ0SW5pdGlhbFN0YXRlKFxuICBpbml0aWFsQ29tbWl0dGVkU3RhdGU/OiBhbnksXG4gIG1vbml0b3JSZWR1Y2VyPzogYW55XG4pOiBMaWZ0ZWRTdGF0ZSB7XG4gIHJldHVybiB7XG4gICAgbW9uaXRvclN0YXRlOiBtb25pdG9yUmVkdWNlcih1bmRlZmluZWQsIHt9KSxcbiAgICBuZXh0QWN0aW9uSWQ6IDEsXG4gICAgYWN0aW9uc0J5SWQ6IHsgMDogbGlmdEFjdGlvbihJTklUX0FDVElPTikgfSxcbiAgICBzdGFnZWRBY3Rpb25JZHM6IFswXSxcbiAgICBza2lwcGVkQWN0aW9uSWRzOiBbXSxcbiAgICBjb21taXR0ZWRTdGF0ZTogaW5pdGlhbENvbW1pdHRlZFN0YXRlLFxuICAgIGN1cnJlbnRTdGF0ZUluZGV4OiAwLFxuICAgIGNvbXB1dGVkU3RhdGVzOiBbXSxcbiAgICBpc0xvY2tlZDogZmFsc2UsXG4gICAgaXNQYXVzZWQ6IGZhbHNlLFxuICB9O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBoaXN0b3J5IHN0YXRlIHJlZHVjZXIgZnJvbSBhbiBhcHAncyByZWR1Y2VyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbGlmdFJlZHVjZXJXaXRoKFxuICBpbml0aWFsQ29tbWl0dGVkU3RhdGU6IGFueSxcbiAgaW5pdGlhbExpZnRlZFN0YXRlOiBMaWZ0ZWRTdGF0ZSxcbiAgZXJyb3JIYW5kbGVyOiBFcnJvckhhbmRsZXIsXG4gIG1vbml0b3JSZWR1Y2VyPzogYW55LFxuICBvcHRpb25zOiBQYXJ0aWFsPFN0b3JlRGV2dG9vbHNDb25maWc+ID0ge31cbikge1xuICAvKipcbiAgICogTWFuYWdlcyBob3cgdGhlIGhpc3RvcnkgYWN0aW9ucyBtb2RpZnkgdGhlIGhpc3Rvcnkgc3RhdGUuXG4gICAqL1xuICByZXR1cm4gKFxuICAgICAgcmVkdWNlcjogQWN0aW9uUmVkdWNlcjxhbnksIGFueT5cbiAgICApOiBBY3Rpb25SZWR1Y2VyPExpZnRlZFN0YXRlLCBBY3Rpb25zPiA9PlxuICAgIChsaWZ0ZWRTdGF0ZSwgbGlmdGVkQWN0aW9uKSA9PiB7XG4gICAgICBsZXQge1xuICAgICAgICBtb25pdG9yU3RhdGUsXG4gICAgICAgIGFjdGlvbnNCeUlkLFxuICAgICAgICBuZXh0QWN0aW9uSWQsXG4gICAgICAgIHN0YWdlZEFjdGlvbklkcyxcbiAgICAgICAgc2tpcHBlZEFjdGlvbklkcyxcbiAgICAgICAgY29tbWl0dGVkU3RhdGUsXG4gICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4LFxuICAgICAgICBjb21wdXRlZFN0YXRlcyxcbiAgICAgICAgaXNMb2NrZWQsXG4gICAgICAgIGlzUGF1c2VkLFxuICAgICAgfSA9IGxpZnRlZFN0YXRlIHx8IGluaXRpYWxMaWZ0ZWRTdGF0ZTtcblxuICAgICAgaWYgKCFsaWZ0ZWRTdGF0ZSkge1xuICAgICAgICAvLyBQcmV2ZW50IG11dGF0aW5nIGluaXRpYWxMaWZ0ZWRTdGF0ZVxuICAgICAgICBhY3Rpb25zQnlJZCA9IE9iamVjdC5jcmVhdGUoYWN0aW9uc0J5SWQpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBjb21taXRFeGNlc3NBY3Rpb25zKG46IG51bWJlcikge1xuICAgICAgICAvLyBBdXRvLWNvbW1pdHMgbi1udW1iZXIgb2YgZXhjZXNzIGFjdGlvbnMuXG4gICAgICAgIGxldCBleGNlc3MgPSBuO1xuICAgICAgICBsZXQgaWRzVG9EZWxldGUgPSBzdGFnZWRBY3Rpb25JZHMuc2xpY2UoMSwgZXhjZXNzICsgMSk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpZHNUb0RlbGV0ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChjb21wdXRlZFN0YXRlc1tpICsgMV0uZXJyb3IpIHtcbiAgICAgICAgICAgIC8vIFN0b3AgaWYgZXJyb3IgaXMgZm91bmQuIENvbW1pdCBhY3Rpb25zIHVwIHRvIGVycm9yLlxuICAgICAgICAgICAgZXhjZXNzID0gaTtcbiAgICAgICAgICAgIGlkc1RvRGVsZXRlID0gc3RhZ2VkQWN0aW9uSWRzLnNsaWNlKDEsIGV4Y2VzcyArIDEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSBhY3Rpb25zQnlJZFtpZHNUb0RlbGV0ZVtpXV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2tpcHBlZEFjdGlvbklkcyA9IHNraXBwZWRBY3Rpb25JZHMuZmlsdGVyKFxuICAgICAgICAgIChpZCkgPT4gaWRzVG9EZWxldGUuaW5kZXhPZihpZCkgPT09IC0xXG4gICAgICAgICk7XG4gICAgICAgIHN0YWdlZEFjdGlvbklkcyA9IFswLCAuLi5zdGFnZWRBY3Rpb25JZHMuc2xpY2UoZXhjZXNzICsgMSldO1xuICAgICAgICBjb21taXR0ZWRTdGF0ZSA9IGNvbXB1dGVkU3RhdGVzW2V4Y2Vzc10uc3RhdGU7XG4gICAgICAgIGNvbXB1dGVkU3RhdGVzID0gY29tcHV0ZWRTdGF0ZXMuc2xpY2UoZXhjZXNzKTtcbiAgICAgICAgY3VycmVudFN0YXRlSW5kZXggPVxuICAgICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4ID4gZXhjZXNzID8gY3VycmVudFN0YXRlSW5kZXggLSBleGNlc3MgOiAwO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBjb21taXRDaGFuZ2VzKCkge1xuICAgICAgICAvLyBDb25zaWRlciB0aGUgbGFzdCBjb21taXR0ZWQgc3RhdGUgdGhlIG5ldyBzdGFydGluZyBwb2ludC5cbiAgICAgICAgLy8gU3F1YXNoIGFueSBzdGFnZWQgYWN0aW9ucyBpbnRvIGEgc2luZ2xlIGNvbW1pdHRlZCBzdGF0ZS5cbiAgICAgICAgYWN0aW9uc0J5SWQgPSB7IDA6IGxpZnRBY3Rpb24oSU5JVF9BQ1RJT04pIH07XG4gICAgICAgIG5leHRBY3Rpb25JZCA9IDE7XG4gICAgICAgIHN0YWdlZEFjdGlvbklkcyA9IFswXTtcbiAgICAgICAgc2tpcHBlZEFjdGlvbklkcyA9IFtdO1xuICAgICAgICBjb21taXR0ZWRTdGF0ZSA9IGNvbXB1dGVkU3RhdGVzW2N1cnJlbnRTdGF0ZUluZGV4XS5zdGF0ZTtcbiAgICAgICAgY3VycmVudFN0YXRlSW5kZXggPSAwO1xuICAgICAgICBjb21wdXRlZFN0YXRlcyA9IFtdO1xuICAgICAgfVxuXG4gICAgICAvLyBCeSBkZWZhdWx0LCBhZ2dyZXNzaXZlbHkgcmVjb21wdXRlIGV2ZXJ5IHN0YXRlIHdoYXRldmVyIGhhcHBlbnMuXG4gICAgICAvLyBUaGlzIGhhcyBPKG4pIHBlcmZvcm1hbmNlLCBzbyB3ZSdsbCBvdmVycmlkZSB0aGlzIHRvIGEgc2Vuc2libGVcbiAgICAgIC8vIHZhbHVlIHdoZW5ldmVyIHdlIGZlZWwgbGlrZSB3ZSBkb24ndCBoYXZlIHRvIHJlY29tcHV0ZSB0aGUgc3RhdGVzLlxuICAgICAgbGV0IG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IDA7XG5cbiAgICAgIHN3aXRjaCAobGlmdGVkQWN0aW9uLnR5cGUpIHtcbiAgICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuTE9DS19DSEFOR0VTOiB7XG4gICAgICAgICAgaXNMb2NrZWQgPSBsaWZ0ZWRBY3Rpb24uc3RhdHVzO1xuICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IEluZmluaXR5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLlBBVVNFX1JFQ09SRElORzoge1xuICAgICAgICAgIGlzUGF1c2VkID0gbGlmdGVkQWN0aW9uLnN0YXR1cztcbiAgICAgICAgICBpZiAoaXNQYXVzZWQpIHtcbiAgICAgICAgICAgIC8vIEFkZCBhIHBhdXNlIGFjdGlvbiB0byBzaWduYWwgdGhlIGRldnRvb2xzLXVzZXIgdGhlIHJlY29yZGluZyBpcyBwYXVzZWQuXG4gICAgICAgICAgICAvLyBUaGUgY29ycmVzcG9uZGluZyBzdGF0ZSB3aWxsIGJlIG92ZXJ3cml0dGVuIG9uIGVhY2ggdXBkYXRlIHRvIGFsd2F5cyBjb250YWluXG4gICAgICAgICAgICAvLyB0aGUgbGF0ZXN0IHN0YXRlIChzZWUgQWN0aW9ucy5QRVJGT1JNX0FDVElPTikuXG4gICAgICAgICAgICBzdGFnZWRBY3Rpb25JZHMgPSBbLi4uc3RhZ2VkQWN0aW9uSWRzLCBuZXh0QWN0aW9uSWRdO1xuICAgICAgICAgICAgYWN0aW9uc0J5SWRbbmV4dEFjdGlvbklkXSA9IG5ldyBQZXJmb3JtQWN0aW9uKFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ0BuZ3J4L2RldnRvb2xzL3BhdXNlJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgK0RhdGUubm93KClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBuZXh0QWN0aW9uSWQrKztcbiAgICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSAxO1xuICAgICAgICAgICAgY29tcHV0ZWRTdGF0ZXMgPSBjb21wdXRlZFN0YXRlcy5jb25jYXQoXG4gICAgICAgICAgICAgIGNvbXB1dGVkU3RhdGVzW2NvbXB1dGVkU3RhdGVzLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBpZiAoY3VycmVudFN0YXRlSW5kZXggPT09IHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSAyKSB7XG4gICAgICAgICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBJbmZpbml0eTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29tbWl0Q2hhbmdlcygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlIERldnRvb2xzQWN0aW9ucy5SRVNFVDoge1xuICAgICAgICAgIC8vIEdldCBiYWNrIHRvIHRoZSBzdGF0ZSB0aGUgc3RvcmUgd2FzIGNyZWF0ZWQgd2l0aC5cbiAgICAgICAgICBhY3Rpb25zQnlJZCA9IHsgMDogbGlmdEFjdGlvbihJTklUX0FDVElPTikgfTtcbiAgICAgICAgICBuZXh0QWN0aW9uSWQgPSAxO1xuICAgICAgICAgIHN0YWdlZEFjdGlvbklkcyA9IFswXTtcbiAgICAgICAgICBza2lwcGVkQWN0aW9uSWRzID0gW107XG4gICAgICAgICAgY29tbWl0dGVkU3RhdGUgPSBpbml0aWFsQ29tbWl0dGVkU3RhdGU7XG4gICAgICAgICAgY3VycmVudFN0YXRlSW5kZXggPSAwO1xuICAgICAgICAgIGNvbXB1dGVkU3RhdGVzID0gW107XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuQ09NTUlUOiB7XG4gICAgICAgICAgY29tbWl0Q2hhbmdlcygpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLlJPTExCQUNLOiB7XG4gICAgICAgICAgLy8gRm9yZ2V0IGFib3V0IGFueSBzdGFnZWQgYWN0aW9ucy5cbiAgICAgICAgICAvLyBTdGFydCBhZ2FpbiBmcm9tIHRoZSBsYXN0IGNvbW1pdHRlZCBzdGF0ZS5cbiAgICAgICAgICBhY3Rpb25zQnlJZCA9IHsgMDogbGlmdEFjdGlvbihJTklUX0FDVElPTikgfTtcbiAgICAgICAgICBuZXh0QWN0aW9uSWQgPSAxO1xuICAgICAgICAgIHN0YWdlZEFjdGlvbklkcyA9IFswXTtcbiAgICAgICAgICBza2lwcGVkQWN0aW9uSWRzID0gW107XG4gICAgICAgICAgY3VycmVudFN0YXRlSW5kZXggPSAwO1xuICAgICAgICAgIGNvbXB1dGVkU3RhdGVzID0gW107XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuVE9HR0xFX0FDVElPTjoge1xuICAgICAgICAgIC8vIFRvZ2dsZSB3aGV0aGVyIGFuIGFjdGlvbiB3aXRoIGdpdmVuIElEIGlzIHNraXBwZWQuXG4gICAgICAgICAgLy8gQmVpbmcgc2tpcHBlZCBtZWFucyBpdCBpcyBhIG5vLW9wIGR1cmluZyB0aGUgY29tcHV0YXRpb24uXG4gICAgICAgICAgY29uc3QgeyBpZDogYWN0aW9uSWQgfSA9IGxpZnRlZEFjdGlvbjtcbiAgICAgICAgICBjb25zdCBpbmRleCA9IHNraXBwZWRBY3Rpb25JZHMuaW5kZXhPZihhY3Rpb25JZCk7XG4gICAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgc2tpcHBlZEFjdGlvbklkcyA9IFthY3Rpb25JZCwgLi4uc2tpcHBlZEFjdGlvbklkc107XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNraXBwZWRBY3Rpb25JZHMgPSBza2lwcGVkQWN0aW9uSWRzLmZpbHRlcigoaWQpID0+IGlkICE9PSBhY3Rpb25JZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIE9wdGltaXphdGlvbjogd2Uga25vdyBoaXN0b3J5IGJlZm9yZSB0aGlzIGFjdGlvbiBoYXNuJ3QgY2hhbmdlZFxuICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IHN0YWdlZEFjdGlvbklkcy5pbmRleE9mKGFjdGlvbklkKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlIERldnRvb2xzQWN0aW9ucy5TRVRfQUNUSU9OU19BQ1RJVkU6IHtcbiAgICAgICAgICAvLyBUb2dnbGUgd2hldGhlciBhbiBhY3Rpb24gd2l0aCBnaXZlbiBJRCBpcyBza2lwcGVkLlxuICAgICAgICAgIC8vIEJlaW5nIHNraXBwZWQgbWVhbnMgaXQgaXMgYSBuby1vcCBkdXJpbmcgdGhlIGNvbXB1dGF0aW9uLlxuICAgICAgICAgIGNvbnN0IHsgc3RhcnQsIGVuZCwgYWN0aXZlIH0gPSBsaWZ0ZWRBY3Rpb247XG4gICAgICAgICAgY29uc3QgYWN0aW9uSWRzID0gW107XG4gICAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIGFjdGlvbklkcy5wdXNoKGkpO1xuICAgICAgICAgIGlmIChhY3RpdmUpIHtcbiAgICAgICAgICAgIHNraXBwZWRBY3Rpb25JZHMgPSBkaWZmZXJlbmNlKHNraXBwZWRBY3Rpb25JZHMsIGFjdGlvbklkcyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNraXBwZWRBY3Rpb25JZHMgPSBbLi4uc2tpcHBlZEFjdGlvbklkcywgLi4uYWN0aW9uSWRzXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBPcHRpbWl6YXRpb246IHdlIGtub3cgaGlzdG9yeSBiZWZvcmUgdGhpcyBhY3Rpb24gaGFzbid0IGNoYW5nZWRcbiAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBzdGFnZWRBY3Rpb25JZHMuaW5kZXhPZihzdGFydCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBEZXZ0b29sc0FjdGlvbnMuSlVNUF9UT19TVEFURToge1xuICAgICAgICAgIC8vIFdpdGhvdXQgcmVjb21wdXRpbmcgYW55dGhpbmcsIG1vdmUgdGhlIHBvaW50ZXIgdGhhdCB0ZWxsIHVzXG4gICAgICAgICAgLy8gd2hpY2ggc3RhdGUgaXMgY29uc2lkZXJlZCB0aGUgY3VycmVudCBvbmUuIFVzZWZ1bCBmb3Igc2xpZGVycy5cbiAgICAgICAgICBjdXJyZW50U3RhdGVJbmRleCA9IGxpZnRlZEFjdGlvbi5pbmRleDtcbiAgICAgICAgICAvLyBPcHRpbWl6YXRpb246IHdlIGtub3cgdGhlIGhpc3RvcnkgaGFzIG5vdCBjaGFuZ2VkLlxuICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IEluZmluaXR5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLkpVTVBfVE9fQUNUSU9OOiB7XG4gICAgICAgICAgLy8gSnVtcHMgdG8gYSBjb3JyZXNwb25kaW5nIHN0YXRlIHRvIGEgc3BlY2lmaWMgYWN0aW9uLlxuICAgICAgICAgIC8vIFVzZWZ1bCB3aGVuIGZpbHRlcmluZyBhY3Rpb25zLlxuICAgICAgICAgIGNvbnN0IGluZGV4ID0gc3RhZ2VkQWN0aW9uSWRzLmluZGV4T2YobGlmdGVkQWN0aW9uLmFjdGlvbklkKTtcbiAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSBjdXJyZW50U3RhdGVJbmRleCA9IGluZGV4O1xuICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IEluZmluaXR5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLlNXRUVQOiB7XG4gICAgICAgICAgLy8gRm9yZ2V0IGFueSBhY3Rpb25zIHRoYXQgYXJlIGN1cnJlbnRseSBiZWluZyBza2lwcGVkLlxuICAgICAgICAgIHN0YWdlZEFjdGlvbklkcyA9IGRpZmZlcmVuY2Uoc3RhZ2VkQWN0aW9uSWRzLCBza2lwcGVkQWN0aW9uSWRzKTtcbiAgICAgICAgICBza2lwcGVkQWN0aW9uSWRzID0gW107XG4gICAgICAgICAgY3VycmVudFN0YXRlSW5kZXggPSBNYXRoLm1pbihcbiAgICAgICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4LFxuICAgICAgICAgICAgc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIDFcbiAgICAgICAgICApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLlBFUkZPUk1fQUNUSU9OOiB7XG4gICAgICAgICAgLy8gSWdub3JlIGFjdGlvbiBhbmQgcmV0dXJuIHN0YXRlIGFzIGlzIGlmIHJlY29yZGluZyBpcyBsb2NrZWRcbiAgICAgICAgICBpZiAoaXNMb2NrZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBsaWZ0ZWRTdGF0ZSB8fCBpbml0aWFsTGlmdGVkU3RhdGU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgaXNQYXVzZWQgfHxcbiAgICAgICAgICAgIChsaWZ0ZWRTdGF0ZSAmJlxuICAgICAgICAgICAgICBpc0FjdGlvbkZpbHRlcmVkKFxuICAgICAgICAgICAgICAgIGxpZnRlZFN0YXRlLmNvbXB1dGVkU3RhdGVzW2N1cnJlbnRTdGF0ZUluZGV4XSxcbiAgICAgICAgICAgICAgICBsaWZ0ZWRBY3Rpb24sXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5wcmVkaWNhdGUsXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5hY3Rpb25zU2FmZWxpc3QsXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5hY3Rpb25zQmxvY2tsaXN0XG4gICAgICAgICAgICAgICkpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyBJZiByZWNvcmRpbmcgaXMgcGF1c2VkIG9yIGlmIHRoZSBhY3Rpb24gc2hvdWxkIGJlIGlnbm9yZWQsIG92ZXJ3cml0ZSB0aGUgbGFzdCBzdGF0ZVxuICAgICAgICAgICAgLy8gKGNvcnJlc3BvbmRzIHRvIHRoZSBwYXVzZSBhY3Rpb24pIGFuZCBrZWVwIGV2ZXJ5dGhpbmcgZWxzZSBhcyBpcy5cbiAgICAgICAgICAgIC8vIFRoaXMgd2F5LCB0aGUgYXBwIGdldHMgdGhlIG5ldyBjdXJyZW50IHN0YXRlIHdoaWxlIHRoZSBkZXZ0b29sc1xuICAgICAgICAgICAgLy8gZG8gbm90IHJlY29yZCBhbm90aGVyIGFjdGlvbi5cbiAgICAgICAgICAgIGNvbnN0IGxhc3RTdGF0ZSA9IGNvbXB1dGVkU3RhdGVzW2NvbXB1dGVkU3RhdGVzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgY29tcHV0ZWRTdGF0ZXMgPSBbXG4gICAgICAgICAgICAgIC4uLmNvbXB1dGVkU3RhdGVzLnNsaWNlKDAsIC0xKSxcbiAgICAgICAgICAgICAgY29tcHV0ZU5leHRFbnRyeShcbiAgICAgICAgICAgICAgICByZWR1Y2VyLFxuICAgICAgICAgICAgICAgIGxpZnRlZEFjdGlvbi5hY3Rpb24sXG4gICAgICAgICAgICAgICAgbGFzdFN0YXRlLnN0YXRlLFxuICAgICAgICAgICAgICAgIGxhc3RTdGF0ZS5lcnJvcixcbiAgICAgICAgICAgICAgICBlcnJvckhhbmRsZXJcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBJbmZpbml0eTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEF1dG8tY29tbWl0IGFzIG5ldyBhY3Rpb25zIGNvbWUgaW4uXG4gICAgICAgICAgaWYgKG9wdGlvbnMubWF4QWdlICYmIHN0YWdlZEFjdGlvbklkcy5sZW5ndGggPT09IG9wdGlvbnMubWF4QWdlKSB7XG4gICAgICAgICAgICBjb21taXRFeGNlc3NBY3Rpb25zKDEpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjdXJyZW50U3RhdGVJbmRleCA9PT0gc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4Kys7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGFjdGlvbklkID0gbmV4dEFjdGlvbklkKys7XG4gICAgICAgICAgLy8gTXV0YXRpb24hIFRoaXMgaXMgdGhlIGhvdHRlc3QgcGF0aCwgYW5kIHdlIG9wdGltaXplIG9uIHB1cnBvc2UuXG4gICAgICAgICAgLy8gSXQgaXMgc2FmZSBiZWNhdXNlIHdlIHNldCBhIG5ldyBrZXkgaW4gYSBjYWNoZSBkaWN0aW9uYXJ5LlxuICAgICAgICAgIGFjdGlvbnNCeUlkW2FjdGlvbklkXSA9IGxpZnRlZEFjdGlvbjtcblxuICAgICAgICAgIHN0YWdlZEFjdGlvbklkcyA9IFsuLi5zdGFnZWRBY3Rpb25JZHMsIGFjdGlvbklkXTtcbiAgICAgICAgICAvLyBPcHRpbWl6YXRpb246IHdlIGtub3cgdGhhdCBvbmx5IHRoZSBuZXcgYWN0aW9uIG5lZWRzIGNvbXB1dGluZy5cbiAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlIERldnRvb2xzQWN0aW9ucy5JTVBPUlRfU1RBVEU6IHtcbiAgICAgICAgICAvLyBDb21wbGV0ZWx5IHJlcGxhY2UgZXZlcnl0aGluZy5cbiAgICAgICAgICAoe1xuICAgICAgICAgICAgbW9uaXRvclN0YXRlLFxuICAgICAgICAgICAgYWN0aW9uc0J5SWQsXG4gICAgICAgICAgICBuZXh0QWN0aW9uSWQsXG4gICAgICAgICAgICBzdGFnZWRBY3Rpb25JZHMsXG4gICAgICAgICAgICBza2lwcGVkQWN0aW9uSWRzLFxuICAgICAgICAgICAgY29tbWl0dGVkU3RhdGUsXG4gICAgICAgICAgICBjdXJyZW50U3RhdGVJbmRleCxcbiAgICAgICAgICAgIGNvbXB1dGVkU3RhdGVzLFxuICAgICAgICAgICAgaXNMb2NrZWQsXG4gICAgICAgICAgICBpc1BhdXNlZCxcbiAgICAgICAgICB9ID0gbGlmdGVkQWN0aW9uLm5leHRMaWZ0ZWRTdGF0ZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBJTklUOiB7XG4gICAgICAgICAgLy8gQWx3YXlzIHJlY29tcHV0ZSBzdGF0ZXMgb24gaG90IHJlbG9hZCBhbmQgaW5pdC5cbiAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSAwO1xuXG4gICAgICAgICAgaWYgKG9wdGlvbnMubWF4QWdlICYmIHN0YWdlZEFjdGlvbklkcy5sZW5ndGggPiBvcHRpb25zLm1heEFnZSkge1xuICAgICAgICAgICAgLy8gU3RhdGVzIG11c3QgYmUgcmVjb21wdXRlZCBiZWZvcmUgY29tbWl0dGluZyBleGNlc3MuXG4gICAgICAgICAgICBjb21wdXRlZFN0YXRlcyA9IHJlY29tcHV0ZVN0YXRlcyhcbiAgICAgICAgICAgICAgY29tcHV0ZWRTdGF0ZXMsXG4gICAgICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCxcbiAgICAgICAgICAgICAgcmVkdWNlcixcbiAgICAgICAgICAgICAgY29tbWl0dGVkU3RhdGUsXG4gICAgICAgICAgICAgIGFjdGlvbnNCeUlkLFxuICAgICAgICAgICAgICBzdGFnZWRBY3Rpb25JZHMsXG4gICAgICAgICAgICAgIHNraXBwZWRBY3Rpb25JZHMsXG4gICAgICAgICAgICAgIGVycm9ySGFuZGxlcixcbiAgICAgICAgICAgICAgaXNQYXVzZWRcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbW1pdEV4Y2Vzc0FjdGlvbnMoc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIG9wdGlvbnMubWF4QWdlKTtcblxuICAgICAgICAgICAgLy8gQXZvaWQgZG91YmxlIGNvbXB1dGF0aW9uLlxuICAgICAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gSW5maW5pdHk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBVUERBVEU6IHtcbiAgICAgICAgICBjb25zdCBzdGF0ZUhhc0Vycm9ycyA9XG4gICAgICAgICAgICBjb21wdXRlZFN0YXRlcy5maWx0ZXIoKHN0YXRlKSA9PiBzdGF0ZS5lcnJvcikubGVuZ3RoID4gMDtcblxuICAgICAgICAgIGlmIChzdGF0ZUhhc0Vycm9ycykge1xuICAgICAgICAgICAgLy8gUmVjb21wdXRlIGFsbCBzdGF0ZXNcbiAgICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IDA7XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLm1heEFnZSAmJiBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoID4gb3B0aW9ucy5tYXhBZ2UpIHtcbiAgICAgICAgICAgICAgLy8gU3RhdGVzIG11c3QgYmUgcmVjb21wdXRlZCBiZWZvcmUgY29tbWl0dGluZyBleGNlc3MuXG4gICAgICAgICAgICAgIGNvbXB1dGVkU3RhdGVzID0gcmVjb21wdXRlU3RhdGVzKFxuICAgICAgICAgICAgICAgIGNvbXB1dGVkU3RhdGVzLFxuICAgICAgICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCxcbiAgICAgICAgICAgICAgICByZWR1Y2VyLFxuICAgICAgICAgICAgICAgIGNvbW1pdHRlZFN0YXRlLFxuICAgICAgICAgICAgICAgIGFjdGlvbnNCeUlkLFxuICAgICAgICAgICAgICAgIHN0YWdlZEFjdGlvbklkcyxcbiAgICAgICAgICAgICAgICBza2lwcGVkQWN0aW9uSWRzLFxuICAgICAgICAgICAgICAgIGVycm9ySGFuZGxlcixcbiAgICAgICAgICAgICAgICBpc1BhdXNlZFxuICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgIGNvbW1pdEV4Y2Vzc0FjdGlvbnMoc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIG9wdGlvbnMubWF4QWdlKTtcblxuICAgICAgICAgICAgICAvLyBBdm9pZCBkb3VibGUgY29tcHV0YXRpb24uXG4gICAgICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IEluZmluaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJZiBub3QgcGF1c2VkL2xvY2tlZCwgYWRkIGEgbmV3IGFjdGlvbiB0byBzaWduYWwgZGV2dG9vbHMtdXNlclxuICAgICAgICAgICAgLy8gdGhhdCB0aGVyZSB3YXMgYSByZWR1Y2VyIHVwZGF0ZS5cbiAgICAgICAgICAgIGlmICghaXNQYXVzZWQgJiYgIWlzTG9ja2VkKSB7XG4gICAgICAgICAgICAgIGlmIChjdXJyZW50U3RhdGVJbmRleCA9PT0gc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50U3RhdGVJbmRleCsrO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgLy8gQWRkIGEgbmV3IGFjdGlvbiB0byBvbmx5IHJlY29tcHV0ZSBzdGF0ZVxuICAgICAgICAgICAgICBjb25zdCBhY3Rpb25JZCA9IG5leHRBY3Rpb25JZCsrO1xuICAgICAgICAgICAgICBhY3Rpb25zQnlJZFthY3Rpb25JZF0gPSBuZXcgUGVyZm9ybUFjdGlvbihcbiAgICAgICAgICAgICAgICBsaWZ0ZWRBY3Rpb24sXG4gICAgICAgICAgICAgICAgK0RhdGUubm93KClcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgc3RhZ2VkQWN0aW9uSWRzID0gWy4uLnN0YWdlZEFjdGlvbklkcywgYWN0aW9uSWRdO1xuXG4gICAgICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSAxO1xuXG4gICAgICAgICAgICAgIGNvbXB1dGVkU3RhdGVzID0gcmVjb21wdXRlU3RhdGVzKFxuICAgICAgICAgICAgICAgIGNvbXB1dGVkU3RhdGVzLFxuICAgICAgICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCxcbiAgICAgICAgICAgICAgICByZWR1Y2VyLFxuICAgICAgICAgICAgICAgIGNvbW1pdHRlZFN0YXRlLFxuICAgICAgICAgICAgICAgIGFjdGlvbnNCeUlkLFxuICAgICAgICAgICAgICAgIHN0YWdlZEFjdGlvbklkcyxcbiAgICAgICAgICAgICAgICBza2lwcGVkQWN0aW9uSWRzLFxuICAgICAgICAgICAgICAgIGVycm9ySGFuZGxlcixcbiAgICAgICAgICAgICAgICBpc1BhdXNlZFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBSZWNvbXB1dGUgc3RhdGUgaGlzdG9yeSB3aXRoIGxhdGVzdCByZWR1Y2VyIGFuZCB1cGRhdGUgYWN0aW9uXG4gICAgICAgICAgICBjb21wdXRlZFN0YXRlcyA9IGNvbXB1dGVkU3RhdGVzLm1hcCgoY21wKSA9PiAoe1xuICAgICAgICAgICAgICAuLi5jbXAsXG4gICAgICAgICAgICAgIHN0YXRlOiByZWR1Y2VyKGNtcC5zdGF0ZSwgUkVDT01QVVRFX0FDVElPTiksXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4ID0gc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIDE7XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLm1heEFnZSAmJiBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoID4gb3B0aW9ucy5tYXhBZ2UpIHtcbiAgICAgICAgICAgICAgY29tbWl0RXhjZXNzQWN0aW9ucyhzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gb3B0aW9ucy5tYXhBZ2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBBdm9pZCBkb3VibGUgY29tcHV0YXRpb24uXG4gICAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBJbmZpbml0eTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgLy8gSWYgdGhlIGFjdGlvbiBpcyBub3QgcmVjb2duaXplZCwgaXQncyBhIG1vbml0b3IgYWN0aW9uLlxuICAgICAgICAgIC8vIE9wdGltaXphdGlvbjogYSBtb25pdG9yIGFjdGlvbiBjYW4ndCBjaGFuZ2UgaGlzdG9yeS5cbiAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBJbmZpbml0eTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb21wdXRlZFN0YXRlcyA9IHJlY29tcHV0ZVN0YXRlcyhcbiAgICAgICAgY29tcHV0ZWRTdGF0ZXMsXG4gICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCxcbiAgICAgICAgcmVkdWNlcixcbiAgICAgICAgY29tbWl0dGVkU3RhdGUsXG4gICAgICAgIGFjdGlvbnNCeUlkLFxuICAgICAgICBzdGFnZWRBY3Rpb25JZHMsXG4gICAgICAgIHNraXBwZWRBY3Rpb25JZHMsXG4gICAgICAgIGVycm9ySGFuZGxlcixcbiAgICAgICAgaXNQYXVzZWRcbiAgICAgICk7XG4gICAgICBtb25pdG9yU3RhdGUgPSBtb25pdG9yUmVkdWNlcihtb25pdG9yU3RhdGUsIGxpZnRlZEFjdGlvbik7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1vbml0b3JTdGF0ZSxcbiAgICAgICAgYWN0aW9uc0J5SWQsXG4gICAgICAgIG5leHRBY3Rpb25JZCxcbiAgICAgICAgc3RhZ2VkQWN0aW9uSWRzLFxuICAgICAgICBza2lwcGVkQWN0aW9uSWRzLFxuICAgICAgICBjb21taXR0ZWRTdGF0ZSxcbiAgICAgICAgY3VycmVudFN0YXRlSW5kZXgsXG4gICAgICAgIGNvbXB1dGVkU3RhdGVzLFxuICAgICAgICBpc0xvY2tlZCxcbiAgICAgICAgaXNQYXVzZWQsXG4gICAgICB9O1xuICAgIH07XG59XG4iXX0=