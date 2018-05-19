var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as Actions from './actions';
export function difference(first, second) {
    return first.filter(function (item) { return second.indexOf(item) < 0; });
}
/**
 * Provides an app's view into the state of the lifted store.
 */
export function unliftState(liftedState) {
    var computedStates = liftedState.computedStates, currentStateIndex = liftedState.currentStateIndex;
    var state = computedStates[currentStateIndex].state;
    return state;
}
export function unliftAction(liftedState) {
    return liftedState.actionsById[liftedState.nextActionId - 1];
}
/**
 * Lifts an app's action into an action on the lifted store.
 */
export function liftAction(action) {
    return new Actions.PerformAction(action, +Date.now());
}
/**
 * Sanitizes given actions with given function.
 */
export function sanitizeActions(actionSanitizer, actions) {
    return Object.keys(actions).reduce(function (sanitizedActions, actionIdx) {
        var idx = Number(actionIdx);
        sanitizedActions[idx] = sanitizeAction(actionSanitizer, actions[idx], idx);
        return sanitizedActions;
    }, {});
}
/**
 * Sanitizes given action with given function.
 */
export function sanitizeAction(actionSanitizer, action, actionIdx) {
    return __assign({}, action, { action: actionSanitizer(action.action, actionIdx) });
}
/**
 * Sanitizes given states with given function.
 */
export function sanitizeStates(stateSanitizer, states) {
    return states.map(function (computedState, idx) {
        return ({
            state: sanitizeState(stateSanitizer, computedState.state, idx),
            error: computedState.error,
        });
    });
}
/**
 * Sanitizes given state with given function.
 */
export function sanitizeState(stateSanitizer, state, stateIdx) {
    return stateSanitizer(state, stateIdx);
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3N0b3JlLWRldnRvb2xzL3NyYy91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUdBLE9BQU8sS0FBSyxPQUFPLE1BQU0sV0FBVyxDQUFDO0FBU3JDLE1BQU0scUJBQXFCLEtBQVksRUFBRSxNQUFhO0lBQ3BELE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQXhCLENBQXdCLENBQUMsQ0FBQztDQUN2RDs7OztBQUtELE1BQU0sc0JBQXNCLFdBQXdCO0lBQzFDLElBQUEsMkNBQWMsRUFBRSxpREFBaUIsQ0FBaUI7SUFDbEQsSUFBQSwrQ0FBSyxDQUF1QztJQUVwRCxNQUFNLENBQUMsS0FBSyxDQUFDO0NBQ2Q7QUFFRCxNQUFNLHVCQUF1QixXQUF3QjtJQUNuRCxNQUFNLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDO0NBQzlEOzs7O0FBS0QsTUFBTSxxQkFBcUIsTUFBYztJQUN2QyxNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0NBQ3ZEOzs7O0FBS0QsTUFBTSwwQkFDSixlQUFnQyxFQUNoQyxPQUFzQjtJQUV0QixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQ2hDLFVBQUMsZ0JBQWdCLEVBQUUsU0FBUztRQUMxQixJQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDOUIsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEdBQUcsY0FBYyxDQUNwQyxlQUFlLEVBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUNaLEdBQUcsQ0FDSixDQUFDO1FBQ0YsTUFBTSxDQUFDLGdCQUFnQixDQUFDO0tBQ3pCLEVBQ2MsRUFBRSxDQUNsQixDQUFDO0NBQ0g7Ozs7QUFLRCxNQUFNLHlCQUNKLGVBQWdDLEVBQ2hDLE1BQW9CLEVBQ3BCLFNBQWlCO0lBRWpCLE1BQU0sY0FDRCxNQUFNLElBQ1QsTUFBTSxFQUFFLGVBQWUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxJQUNqRDtDQUNIOzs7O0FBS0QsTUFBTSx5QkFDSixjQUE4QixFQUM5QixNQUF1QjtJQUV2QixNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFDLGFBQWEsRUFBRSxHQUFHO1FBQUssT0FBQSxDQUFDO1lBQ3pDLEtBQUssRUFBRSxhQUFhLENBQUMsY0FBYyxFQUFFLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDO1lBQzlELEtBQUssRUFBRSxhQUFhLENBQUMsS0FBSztTQUMzQixDQUFDO0lBSHdDLENBR3hDLENBQUMsQ0FBQztDQUNMOzs7O0FBS0QsTUFBTSx3QkFDSixjQUE4QixFQUM5QixLQUFVLEVBQ1YsUUFBZ0I7SUFFaEIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7Q0FDeEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY3Rpb24gfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCAqIGFzIEFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7IEFjdGlvblNhbml0aXplciwgU3RhdGVTYW5pdGl6ZXIgfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQge1xuICBDb21wdXRlZFN0YXRlLFxuICBMaWZ0ZWRBY3Rpb24sXG4gIExpZnRlZEFjdGlvbnMsXG4gIExpZnRlZFN0YXRlLFxufSBmcm9tICcuL3JlZHVjZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gZGlmZmVyZW5jZShmaXJzdDogYW55W10sIHNlY29uZDogYW55W10pIHtcbiAgcmV0dXJuIGZpcnN0LmZpbHRlcihpdGVtID0+IHNlY29uZC5pbmRleE9mKGl0ZW0pIDwgMCk7XG59XG5cbi8qKlxuICogUHJvdmlkZXMgYW4gYXBwJ3MgdmlldyBpbnRvIHRoZSBzdGF0ZSBvZiB0aGUgbGlmdGVkIHN0b3JlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5saWZ0U3RhdGUobGlmdGVkU3RhdGU6IExpZnRlZFN0YXRlKSB7XG4gIGNvbnN0IHsgY29tcHV0ZWRTdGF0ZXMsIGN1cnJlbnRTdGF0ZUluZGV4IH0gPSBsaWZ0ZWRTdGF0ZTtcbiAgY29uc3QgeyBzdGF0ZSB9ID0gY29tcHV0ZWRTdGF0ZXNbY3VycmVudFN0YXRlSW5kZXhdO1xuXG4gIHJldHVybiBzdGF0ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVubGlmdEFjdGlvbihsaWZ0ZWRTdGF0ZTogTGlmdGVkU3RhdGUpOiBMaWZ0ZWRBY3Rpb24ge1xuICByZXR1cm4gbGlmdGVkU3RhdGUuYWN0aW9uc0J5SWRbbGlmdGVkU3RhdGUubmV4dEFjdGlvbklkIC0gMV07XG59XG5cbi8qKlxuICogTGlmdHMgYW4gYXBwJ3MgYWN0aW9uIGludG8gYW4gYWN0aW9uIG9uIHRoZSBsaWZ0ZWQgc3RvcmUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsaWZ0QWN0aW9uKGFjdGlvbjogQWN0aW9uKSB7XG4gIHJldHVybiBuZXcgQWN0aW9ucy5QZXJmb3JtQWN0aW9uKGFjdGlvbiwgK0RhdGUubm93KCkpO1xufVxuXG4vKipcbiAqIFNhbml0aXplcyBnaXZlbiBhY3Rpb25zIHdpdGggZ2l2ZW4gZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZUFjdGlvbnMoXG4gIGFjdGlvblNhbml0aXplcjogQWN0aW9uU2FuaXRpemVyLFxuICBhY3Rpb25zOiBMaWZ0ZWRBY3Rpb25zXG4pOiBMaWZ0ZWRBY3Rpb25zIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKGFjdGlvbnMpLnJlZHVjZShcbiAgICAoc2FuaXRpemVkQWN0aW9ucywgYWN0aW9uSWR4KSA9PiB7XG4gICAgICBjb25zdCBpZHggPSBOdW1iZXIoYWN0aW9uSWR4KTtcbiAgICAgIHNhbml0aXplZEFjdGlvbnNbaWR4XSA9IHNhbml0aXplQWN0aW9uKFxuICAgICAgICBhY3Rpb25TYW5pdGl6ZXIsXG4gICAgICAgIGFjdGlvbnNbaWR4XSxcbiAgICAgICAgaWR4XG4gICAgICApO1xuICAgICAgcmV0dXJuIHNhbml0aXplZEFjdGlvbnM7XG4gICAgfSxcbiAgICA8TGlmdGVkQWN0aW9ucz57fVxuICApO1xufVxuXG4vKipcbiAqIFNhbml0aXplcyBnaXZlbiBhY3Rpb24gd2l0aCBnaXZlbiBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplQWN0aW9uKFxuICBhY3Rpb25TYW5pdGl6ZXI6IEFjdGlvblNhbml0aXplcixcbiAgYWN0aW9uOiBMaWZ0ZWRBY3Rpb24sXG4gIGFjdGlvbklkeDogbnVtYmVyXG4pOiBMaWZ0ZWRBY3Rpb24ge1xuICByZXR1cm4ge1xuICAgIC4uLmFjdGlvbixcbiAgICBhY3Rpb246IGFjdGlvblNhbml0aXplcihhY3Rpb24uYWN0aW9uLCBhY3Rpb25JZHgpLFxuICB9O1xufVxuXG4vKipcbiAqIFNhbml0aXplcyBnaXZlbiBzdGF0ZXMgd2l0aCBnaXZlbiBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplU3RhdGVzKFxuICBzdGF0ZVNhbml0aXplcjogU3RhdGVTYW5pdGl6ZXIsXG4gIHN0YXRlczogQ29tcHV0ZWRTdGF0ZVtdXG4pOiBDb21wdXRlZFN0YXRlW10ge1xuICByZXR1cm4gc3RhdGVzLm1hcCgoY29tcHV0ZWRTdGF0ZSwgaWR4KSA9PiAoe1xuICAgIHN0YXRlOiBzYW5pdGl6ZVN0YXRlKHN0YXRlU2FuaXRpemVyLCBjb21wdXRlZFN0YXRlLnN0YXRlLCBpZHgpLFxuICAgIGVycm9yOiBjb21wdXRlZFN0YXRlLmVycm9yLFxuICB9KSk7XG59XG5cbi8qKlxuICogU2FuaXRpemVzIGdpdmVuIHN0YXRlIHdpdGggZ2l2ZW4gZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZVN0YXRlKFxuICBzdGF0ZVNhbml0aXplcjogU3RhdGVTYW5pdGl6ZXIsXG4gIHN0YXRlOiBhbnksXG4gIHN0YXRlSWR4OiBudW1iZXJcbikge1xuICByZXR1cm4gc3RhdGVTYW5pdGl6ZXIoc3RhdGUsIHN0YXRlSWR4KTtcbn1cbiJdfQ==