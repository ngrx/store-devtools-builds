/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as Actions from './actions';
/**
 * @param {?} first
 * @param {?} second
 * @return {?}
 */
export function difference(first, second) {
    return first.filter(item => second.indexOf(item) < 0);
}
/**
 * Provides an app's view into the state of the lifted store.
 * @param {?} liftedState
 * @return {?}
 */
export function unliftState(liftedState) {
    const { computedStates, currentStateIndex } = liftedState;
    const { state } = computedStates[currentStateIndex];
    return state;
}
/**
 * @param {?} liftedState
 * @return {?}
 */
export function unliftAction(liftedState) {
    return liftedState.actionsById[liftedState.nextActionId - 1];
}
/**
 * Lifts an app's action into an action on the lifted store.
 * @param {?} action
 * @return {?}
 */
export function liftAction(action) {
    return new Actions.PerformAction(action, +Date.now());
}
/**
 * Sanitizes given actions with given function.
 * @param {?} actionSanitizer
 * @param {?} actions
 * @return {?}
 */
export function sanitizeActions(actionSanitizer, actions) {
    return Object.keys(actions).reduce((sanitizedActions, actionIdx) => {
        /** @type {?} */
        const idx = Number(actionIdx);
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
export function sanitizeAction(actionSanitizer, action, actionIdx) {
    return Object.assign({}, action, { action: actionSanitizer(action.action, actionIdx) });
}
/**
 * Sanitizes given states with given function.
 * @param {?} stateSanitizer
 * @param {?} states
 * @return {?}
 */
export function sanitizeStates(stateSanitizer, states) {
    return states.map((computedState, idx) => ({
        state: sanitizeState(stateSanitizer, computedState.state, idx),
        error: computedState.error,
    }));
}
/**
 * Sanitizes given state with given function.
 * @param {?} stateSanitizer
 * @param {?} state
 * @param {?} stateIdx
 * @return {?}
 */
export function sanitizeState(stateSanitizer, state, stateIdx) {
    return stateSanitizer(state, stateIdx);
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3N0b3JlLWRldnRvb2xzL3NyYy91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBR0EsT0FBTyxLQUFLLE9BQU8sTUFBTSxXQUFXLENBQUM7Ozs7OztBQVNyQyxNQUFNLHFCQUFxQixLQUFZLEVBQUUsTUFBYTtJQUNwRCxPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0NBQ3ZEOzs7Ozs7QUFLRCxNQUFNLHNCQUFzQixXQUF3QjtJQUNsRCxNQUFNLEVBQUUsY0FBYyxFQUFFLGlCQUFpQixFQUFFLEdBQUcsV0FBVyxDQUFDO0lBQzFELE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxjQUFjLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUVwRCxPQUFPLEtBQUssQ0FBQztDQUNkOzs7OztBQUVELE1BQU0sdUJBQXVCLFdBQXdCO0lBQ25ELE9BQU8sV0FBVyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDO0NBQzlEOzs7Ozs7QUFLRCxNQUFNLHFCQUFxQixNQUFjO0lBQ3ZDLE9BQU8sSUFBSSxPQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0NBQ3ZEOzs7Ozs7O0FBS0QsTUFBTSwwQkFDSixlQUFnQyxFQUNoQyxPQUFzQjtJQUV0QixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUNoQyxDQUFDLGdCQUFnQixFQUFFLFNBQVMsRUFBRSxFQUFFOztRQUM5QixNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDOUIsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEdBQUcsY0FBYyxDQUNwQyxlQUFlLEVBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUNaLEdBQUcsQ0FDSixDQUFDO1FBQ0YsT0FBTyxnQkFBZ0IsQ0FBQztLQUN6QixvQkFDYyxFQUFFLEVBQ2xCLENBQUM7Q0FDSDs7Ozs7Ozs7QUFLRCxNQUFNLHlCQUNKLGVBQWdDLEVBQ2hDLE1BQW9CLEVBQ3BCLFNBQWlCO0lBRWpCLHlCQUNLLE1BQU0sSUFDVCxNQUFNLEVBQUUsZUFBZSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLElBQ2pEO0NBQ0g7Ozs7Ozs7QUFLRCxNQUFNLHlCQUNKLGNBQThCLEVBQzlCLE1BQXVCO0lBRXZCLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDekMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxjQUFjLEVBQUUsYUFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUM7UUFDOUQsS0FBSyxFQUFFLGFBQWEsQ0FBQyxLQUFLO0tBQzNCLENBQUMsQ0FBQyxDQUFDO0NBQ0w7Ozs7Ozs7O0FBS0QsTUFBTSx3QkFDSixjQUE4QixFQUM5QixLQUFVLEVBQ1YsUUFBZ0I7SUFFaEIsT0FBTyxjQUFjLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0NBQ3hDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgKiBhcyBBY3Rpb25zIGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgeyBBY3Rpb25TYW5pdGl6ZXIsIFN0YXRlU2FuaXRpemVyIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHtcbiAgQ29tcHV0ZWRTdGF0ZSxcbiAgTGlmdGVkQWN0aW9uLFxuICBMaWZ0ZWRBY3Rpb25zLFxuICBMaWZ0ZWRTdGF0ZSxcbn0gZnJvbSAnLi9yZWR1Y2VyJztcblxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZlcmVuY2UoZmlyc3Q6IGFueVtdLCBzZWNvbmQ6IGFueVtdKSB7XG4gIHJldHVybiBmaXJzdC5maWx0ZXIoaXRlbSA9PiBzZWNvbmQuaW5kZXhPZihpdGVtKSA8IDApO1xufVxuXG4vKipcbiAqIFByb3ZpZGVzIGFuIGFwcCdzIHZpZXcgaW50byB0aGUgc3RhdGUgb2YgdGhlIGxpZnRlZCBzdG9yZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVubGlmdFN0YXRlKGxpZnRlZFN0YXRlOiBMaWZ0ZWRTdGF0ZSkge1xuICBjb25zdCB7IGNvbXB1dGVkU3RhdGVzLCBjdXJyZW50U3RhdGVJbmRleCB9ID0gbGlmdGVkU3RhdGU7XG4gIGNvbnN0IHsgc3RhdGUgfSA9IGNvbXB1dGVkU3RhdGVzW2N1cnJlbnRTdGF0ZUluZGV4XTtcblxuICByZXR1cm4gc3RhdGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bmxpZnRBY3Rpb24obGlmdGVkU3RhdGU6IExpZnRlZFN0YXRlKTogTGlmdGVkQWN0aW9uIHtcbiAgcmV0dXJuIGxpZnRlZFN0YXRlLmFjdGlvbnNCeUlkW2xpZnRlZFN0YXRlLm5leHRBY3Rpb25JZCAtIDFdO1xufVxuXG4vKipcbiAqIExpZnRzIGFuIGFwcCdzIGFjdGlvbiBpbnRvIGFuIGFjdGlvbiBvbiB0aGUgbGlmdGVkIHN0b3JlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbGlmdEFjdGlvbihhY3Rpb246IEFjdGlvbikge1xuICByZXR1cm4gbmV3IEFjdGlvbnMuUGVyZm9ybUFjdGlvbihhY3Rpb24sICtEYXRlLm5vdygpKTtcbn1cblxuLyoqXG4gKiBTYW5pdGl6ZXMgZ2l2ZW4gYWN0aW9ucyB3aXRoIGdpdmVuIGZ1bmN0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVBY3Rpb25zKFxuICBhY3Rpb25TYW5pdGl6ZXI6IEFjdGlvblNhbml0aXplcixcbiAgYWN0aW9uczogTGlmdGVkQWN0aW9uc1xuKTogTGlmdGVkQWN0aW9ucyB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhhY3Rpb25zKS5yZWR1Y2UoXG4gICAgKHNhbml0aXplZEFjdGlvbnMsIGFjdGlvbklkeCkgPT4ge1xuICAgICAgY29uc3QgaWR4ID0gTnVtYmVyKGFjdGlvbklkeCk7XG4gICAgICBzYW5pdGl6ZWRBY3Rpb25zW2lkeF0gPSBzYW5pdGl6ZUFjdGlvbihcbiAgICAgICAgYWN0aW9uU2FuaXRpemVyLFxuICAgICAgICBhY3Rpb25zW2lkeF0sXG4gICAgICAgIGlkeFxuICAgICAgKTtcbiAgICAgIHJldHVybiBzYW5pdGl6ZWRBY3Rpb25zO1xuICAgIH0sXG4gICAgPExpZnRlZEFjdGlvbnM+e31cbiAgKTtcbn1cblxuLyoqXG4gKiBTYW5pdGl6ZXMgZ2l2ZW4gYWN0aW9uIHdpdGggZ2l2ZW4gZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZUFjdGlvbihcbiAgYWN0aW9uU2FuaXRpemVyOiBBY3Rpb25TYW5pdGl6ZXIsXG4gIGFjdGlvbjogTGlmdGVkQWN0aW9uLFxuICBhY3Rpb25JZHg6IG51bWJlclxuKTogTGlmdGVkQWN0aW9uIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5hY3Rpb24sXG4gICAgYWN0aW9uOiBhY3Rpb25TYW5pdGl6ZXIoYWN0aW9uLmFjdGlvbiwgYWN0aW9uSWR4KSxcbiAgfTtcbn1cblxuLyoqXG4gKiBTYW5pdGl6ZXMgZ2l2ZW4gc3RhdGVzIHdpdGggZ2l2ZW4gZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZVN0YXRlcyhcbiAgc3RhdGVTYW5pdGl6ZXI6IFN0YXRlU2FuaXRpemVyLFxuICBzdGF0ZXM6IENvbXB1dGVkU3RhdGVbXVxuKTogQ29tcHV0ZWRTdGF0ZVtdIHtcbiAgcmV0dXJuIHN0YXRlcy5tYXAoKGNvbXB1dGVkU3RhdGUsIGlkeCkgPT4gKHtcbiAgICBzdGF0ZTogc2FuaXRpemVTdGF0ZShzdGF0ZVNhbml0aXplciwgY29tcHV0ZWRTdGF0ZS5zdGF0ZSwgaWR4KSxcbiAgICBlcnJvcjogY29tcHV0ZWRTdGF0ZS5lcnJvcixcbiAgfSkpO1xufVxuXG4vKipcbiAqIFNhbml0aXplcyBnaXZlbiBzdGF0ZSB3aXRoIGdpdmVuIGZ1bmN0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVTdGF0ZShcbiAgc3RhdGVTYW5pdGl6ZXI6IFN0YXRlU2FuaXRpemVyLFxuICBzdGF0ZTogYW55LFxuICBzdGF0ZUlkeDogbnVtYmVyXG4pIHtcbiAgcmV0dXJuIHN0YXRlU2FuaXRpemVyKHN0YXRlLCBzdGF0ZUlkeCk7XG59XG4iXX0=