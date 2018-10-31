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
/**
 * Read the config and tell if actions should be filtered
 * @param {?} config
 * @return {?}
 */
export function shouldFilterActions(config) {
    return config.predicate || config.actionsWhitelist || config.actionsBlacklist;
}
/**
 * Return a full filtered lifted state
 * @param {?} liftedState
 * @param {?=} predicate
 * @param {?=} whitelist
 * @param {?=} blacklist
 * @return {?}
 */
export function filterLiftedState(liftedState, predicate, whitelist, blacklist) {
    /** @type {?} */
    const filteredStagedActionIds = [];
    /** @type {?} */
    const filteredActionsById = {};
    /** @type {?} */
    const filteredComputedStates = [];
    liftedState.stagedActionIds.forEach((id, idx) => {
        /** @type {?} */
        const liftedAction = liftedState.actionsById[id];
        if (!liftedAction)
            return;
        if (idx &&
            isActionFiltered(liftedState.computedStates[idx], liftedAction, predicate, whitelist, blacklist)) {
            return;
        }
        filteredActionsById[id] = liftedAction;
        filteredStagedActionIds.push(id);
        filteredComputedStates.push(liftedState.computedStates[idx]);
    });
    return Object.assign({}, liftedState, { stagedActionIds: filteredStagedActionIds, actionsById: filteredActionsById, computedStates: filteredComputedStates });
}
/**
 * Return true is the action should be ignored
 * @param {?} state
 * @param {?} action
 * @param {?=} predicate
 * @param {?=} whitelist
 * @param {?=} blacklist
 * @return {?}
 */
export function isActionFiltered(state, action, predicate, whitelist, blacklist) {
    return ((predicate && !predicate(state, action.action)) ||
        (whitelist && !action.action.type.match(whitelist.join('|'))) ||
        (blacklist && action.action.type.match(blacklist.join('|'))));
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3N0b3JlLWRldnRvb2xzL3NyYy91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBR0EsT0FBTyxLQUFLLE9BQU8sTUFBTSxXQUFXLENBQUM7Ozs7OztBQWNyQyxNQUFNLFVBQVUsVUFBVSxDQUFDLEtBQVksRUFBRSxNQUFhO0lBQ3BELE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Q0FDdkQ7Ozs7OztBQUtELE1BQU0sVUFBVSxXQUFXLENBQUMsV0FBd0I7SUFDbEQsTUFBTSxFQUFFLGNBQWMsRUFBRSxpQkFBaUIsRUFBRSxHQUFHLFdBQVcsQ0FBQztJQUMxRCxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsY0FBYyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFFcEQsT0FBTyxLQUFLLENBQUM7Q0FDZDs7Ozs7QUFFRCxNQUFNLFVBQVUsWUFBWSxDQUFDLFdBQXdCO0lBQ25ELE9BQU8sV0FBVyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDO0NBQzlEOzs7Ozs7QUFLRCxNQUFNLFVBQVUsVUFBVSxDQUFDLE1BQWM7SUFDdkMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7Q0FDdkQ7Ozs7Ozs7QUFLRCxNQUFNLFVBQVUsZUFBZSxDQUM3QixlQUFnQyxFQUNoQyxPQUFzQjtJQUV0QixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUNoQyxDQUFDLGdCQUFnQixFQUFFLFNBQVMsRUFBRSxFQUFFOztRQUM5QixNQUFNLEdBQUcsR0FBRyxNQUFNLENB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Q0FBQyxTQUFTLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUM3RCxDQUFDO0NBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY3Rpb24gfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCAqIGFzIEFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7XG4gIEFjdGlvblNhbml0aXplcixcbiAgU3RhdGVTYW5pdGl6ZXIsXG4gIFByZWRpY2F0ZSxcbiAgU3RvcmVEZXZ0b29sc0NvbmZpZyxcbn0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHtcbiAgQ29tcHV0ZWRTdGF0ZSxcbiAgTGlmdGVkQWN0aW9uLFxuICBMaWZ0ZWRBY3Rpb25zLFxuICBMaWZ0ZWRTdGF0ZSxcbn0gZnJvbSAnLi9yZWR1Y2VyJztcblxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZlcmVuY2UoZmlyc3Q6IGFueVtdLCBzZWNvbmQ6IGFueVtdKSB7XG4gIHJldHVybiBmaXJzdC5maWx0ZXIoaXRlbSA9PiBzZWNvbmQuaW5kZXhPZihpdGVtKSA8IDApO1xufVxuXG4vKipcbiAqIFByb3ZpZGVzIGFuIGFwcCdzIHZpZXcgaW50byB0aGUgc3RhdGUgb2YgdGhlIGxpZnRlZCBzdG9yZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVubGlmdFN0YXRlKGxpZnRlZFN0YXRlOiBMaWZ0ZWRTdGF0ZSkge1xuICBjb25zdCB7IGNvbXB1dGVkU3RhdGVzLCBjdXJyZW50U3RhdGVJbmRleCB9ID0gbGlmdGVkU3RhdGU7XG4gIGNvbnN0IHsgc3RhdGUgfSA9IGNvbXB1dGVkU3RhdGVzW2N1cnJlbnRTdGF0ZUluZGV4XTtcblxuICByZXR1cm4gc3RhdGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bmxpZnRBY3Rpb24obGlmdGVkU3RhdGU6IExpZnRlZFN0YXRlKTogTGlmdGVkQWN0aW9uIHtcbiAgcmV0dXJuIGxpZnRlZFN0YXRlLmFjdGlvbnNCeUlkW2xpZnRlZFN0YXRlLm5leHRBY3Rpb25JZCAtIDFdO1xufVxuXG4vKipcbiAqIExpZnRzIGFuIGFwcCdzIGFjdGlvbiBpbnRvIGFuIGFjdGlvbiBvbiB0aGUgbGlmdGVkIHN0b3JlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbGlmdEFjdGlvbihhY3Rpb246IEFjdGlvbikge1xuICByZXR1cm4gbmV3IEFjdGlvbnMuUGVyZm9ybUFjdGlvbihhY3Rpb24sICtEYXRlLm5vdygpKTtcbn1cblxuLyoqXG4gKiBTYW5pdGl6ZXMgZ2l2ZW4gYWN0aW9ucyB3aXRoIGdpdmVuIGZ1bmN0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVBY3Rpb25zKFxuICBhY3Rpb25TYW5pdGl6ZXI6IEFjdGlvblNhbml0aXplcixcbiAgYWN0aW9uczogTGlmdGVkQWN0aW9uc1xuKTogTGlmdGVkQWN0aW9ucyB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhhY3Rpb25zKS5yZWR1Y2UoXG4gICAgKHNhbml0aXplZEFjdGlvbnMsIGFjdGlvbklkeCkgPT4ge1xuICAgICAgY29uc3QgaWR4ID0gTnVtYmVyKGFjdGlvbklkeCk7XG4gICAgICBzYW5pdGl6ZWRBY3Rpb25zW2lkeF0gPSBzYW5pdGl6ZUFjdGlvbihcbiAgICAgICAgYWN0aW9uU2FuaXRpemVyLFxuICAgICAgICBhY3Rpb25zW2lkeF0sXG4gICAgICAgIGlkeFxuICAgICAgKTtcbiAgICAgIHJldHVybiBzYW5pdGl6ZWRBY3Rpb25zO1xuICAgIH0sXG4gICAgPExpZnRlZEFjdGlvbnM+e31cbiAgKTtcbn1cblxuLyoqXG4gKiBTYW5pdGl6ZXMgZ2l2ZW4gYWN0aW9uIHdpdGggZ2l2ZW4gZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZUFjdGlvbihcbiAgYWN0aW9uU2FuaXRpemVyOiBBY3Rpb25TYW5pdGl6ZXIsXG4gIGFjdGlvbjogTGlmdGVkQWN0aW9uLFxuICBhY3Rpb25JZHg6IG51bWJlclxuKTogTGlmdGVkQWN0aW9uIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5hY3Rpb24sXG4gICAgYWN0aW9uOiBhY3Rpb25TYW5pdGl6ZXIoYWN0aW9uLmFjdGlvbiwgYWN0aW9uSWR4KSxcbiAgfTtcbn1cblxuLyoqXG4gKiBTYW5pdGl6ZXMgZ2l2ZW4gc3RhdGVzIHdpdGggZ2l2ZW4gZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZVN0YXRlcyhcbiAgc3RhdGVTYW5pdGl6ZXI6IFN0YXRlU2FuaXRpemVyLFxuICBzdGF0ZXM6IENvbXB1dGVkU3RhdGVbXVxuKTogQ29tcHV0ZWRTdGF0ZVtdIHtcbiAgcmV0dXJuIHN0YXRlcy5tYXAoKGNvbXB1dGVkU3RhdGUsIGlkeCkgPT4gKHtcbiAgICBzdGF0ZTogc2FuaXRpemVTdGF0ZShzdGF0ZVNhbml0aXplciwgY29tcHV0ZWRTdGF0ZS5zdGF0ZSwgaWR4KSxcbiAgICBlcnJvcjogY29tcHV0ZWRTdGF0ZS5lcnJvcixcbiAgfSkpO1xufVxuXG4vKipcbiAqIFNhbml0aXplcyBnaXZlbiBzdGF0ZSB3aXRoIGdpdmVuIGZ1bmN0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVTdGF0ZShcbiAgc3RhdGVTYW5pdGl6ZXI6IFN0YXRlU2FuaXRpemVyLFxuICBzdGF0ZTogYW55LFxuICBzdGF0ZUlkeDogbnVtYmVyXG4pIHtcbiAgcmV0dXJuIHN0YXRlU2FuaXRpemVyKHN0YXRlLCBzdGF0ZUlkeCk7XG59XG5cbi8qKlxuICogUmVhZCB0aGUgY29uZmlnIGFuZCB0ZWxsIGlmIGFjdGlvbnMgc2hvdWxkIGJlIGZpbHRlcmVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzaG91bGRGaWx0ZXJBY3Rpb25zKGNvbmZpZzogU3RvcmVEZXZ0b29sc0NvbmZpZykge1xuICByZXR1cm4gY29uZmlnLnByZWRpY2F0ZSB8fCBjb25maWcuYWN0aW9uc1doaXRlbGlzdCB8fCBjb25maWcuYWN0aW9uc0JsYWNrbGlzdDtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBmdWxsIGZpbHRlcmVkIGxpZnRlZCBzdGF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyTGlmdGVkU3RhdGUoXG4gIGxpZnRlZFN0YXRlOiBMaWZ0ZWRTdGF0ZSxcbiAgcHJlZGljYXRlPzogUHJlZGljYXRlLFxuICB3aGl0ZWxpc3Q/OiBzdHJpbmdbXSxcbiAgYmxhY2tsaXN0Pzogc3RyaW5nW11cbik6IExpZnRlZFN0YXRlIHtcbiAgY29uc3QgZmlsdGVyZWRTdGFnZWRBY3Rpb25JZHM6IG51bWJlcltdID0gW107XG4gIGNvbnN0IGZpbHRlcmVkQWN0aW9uc0J5SWQ6IExpZnRlZEFjdGlvbnMgPSB7fTtcbiAgY29uc3QgZmlsdGVyZWRDb21wdXRlZFN0YXRlczogQ29tcHV0ZWRTdGF0ZVtdID0gW107XG4gIGxpZnRlZFN0YXRlLnN0YWdlZEFjdGlvbklkcy5mb3JFYWNoKChpZCwgaWR4KSA9PiB7XG4gICAgY29uc3QgbGlmdGVkQWN0aW9uID0gbGlmdGVkU3RhdGUuYWN0aW9uc0J5SWRbaWRdO1xuICAgIGlmICghbGlmdGVkQWN0aW9uKSByZXR1cm47XG4gICAgaWYgKFxuICAgICAgaWR4ICYmXG4gICAgICBpc0FjdGlvbkZpbHRlcmVkKFxuICAgICAgICBsaWZ0ZWRTdGF0ZS5jb21wdXRlZFN0YXRlc1tpZHhdLFxuICAgICAgICBsaWZ0ZWRBY3Rpb24sXG4gICAgICAgIHByZWRpY2F0ZSxcbiAgICAgICAgd2hpdGVsaXN0LFxuICAgICAgICBibGFja2xpc3RcbiAgICAgIClcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZmlsdGVyZWRBY3Rpb25zQnlJZFtpZF0gPSBsaWZ0ZWRBY3Rpb247XG4gICAgZmlsdGVyZWRTdGFnZWRBY3Rpb25JZHMucHVzaChpZCk7XG4gICAgZmlsdGVyZWRDb21wdXRlZFN0YXRlcy5wdXNoKGxpZnRlZFN0YXRlLmNvbXB1dGVkU3RhdGVzW2lkeF0pO1xuICB9KTtcbiAgcmV0dXJuIHtcbiAgICAuLi5saWZ0ZWRTdGF0ZSxcbiAgICBzdGFnZWRBY3Rpb25JZHM6IGZpbHRlcmVkU3RhZ2VkQWN0aW9uSWRzLFxuICAgIGFjdGlvbnNCeUlkOiBmaWx0ZXJlZEFjdGlvbnNCeUlkLFxuICAgIGNvbXB1dGVkU3RhdGVzOiBmaWx0ZXJlZENvbXB1dGVkU3RhdGVzLFxuICB9O1xufVxuXG4vKipcbiAqIFJldHVybiB0cnVlIGlzIHRoZSBhY3Rpb24gc2hvdWxkIGJlIGlnbm9yZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQWN0aW9uRmlsdGVyZWQoXG4gIHN0YXRlOiBhbnksXG4gIGFjdGlvbjogTGlmdGVkQWN0aW9uLFxuICBwcmVkaWNhdGU/OiBQcmVkaWNhdGUsXG4gIHdoaXRlbGlzdD86IHN0cmluZ1tdLFxuICBibGFja2xpc3Q/OiBzdHJpbmdbXVxuKSB7XG4gIHJldHVybiAoXG4gICAgKHByZWRpY2F0ZSAmJiAhcHJlZGljYXRlKHN0YXRlLCBhY3Rpb24uYWN0aW9uKSkgfHxcbiAgICAod2hpdGVsaXN0ICYmICFhY3Rpb24uYWN0aW9uLnR5cGUubWF0Y2god2hpdGVsaXN0LmpvaW4oJ3wnKSkpIHx8XG4gICAgKGJsYWNrbGlzdCAmJiBhY3Rpb24uYWN0aW9uLnR5cGUubWF0Y2goYmxhY2tsaXN0LmpvaW4oJ3wnKSkpXG4gICk7XG59XG4iXX0=