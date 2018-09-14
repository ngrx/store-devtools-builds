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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3N0b3JlLWRldnRvb2xzL3NyYy91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBR0EsT0FBTyxLQUFLLE9BQU8sTUFBTSxXQUFXLENBQUM7Ozs7OztBQWNyQyxNQUFNLHFCQUFxQixLQUFZLEVBQUUsTUFBYTtJQUNwRCxPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0NBQ3ZEOzs7Ozs7QUFLRCxNQUFNLHNCQUFzQixXQUF3QjtJQUNsRCxNQUFNLEVBQUUsY0FBYyxFQUFFLGlCQUFpQixFQUFFLEdBQUcsV0FBVyxDQUFDO0lBQzFELE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxjQUFjLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUVwRCxPQUFPLEtBQUssQ0FBQztDQUNkOzs7OztBQUVELE1BQU0sdUJBQXVCLFdBQXdCO0lBQ25ELE9BQU8sV0FBVyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDO0NBQzlEOzs7Ozs7QUFLRCxNQUFNLHFCQUFxQixNQUFjO0lBQ3ZDLE9BQU8sSUFBSSxPQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0NBQ3ZEOzs7Ozs7O0FBS0QsTUFBTSwwQkFDSixlQUFnQyxFQUNoQyxPQUFzQjtJQUV0QixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUNoQyxDQUFDLGdCQUFnQixFQUFFLFNBQVMsRUFBRSxFQUFFOztRQUM5QixNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDOUIsZ0JBQWdCLENBQUMsR0FBRyxD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Q0FDSCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0ICogYXMgQWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHtcbiAgQWN0aW9uU2FuaXRpemVyLFxuICBTdGF0ZVNhbml0aXplcixcbiAgUHJlZGljYXRlLFxuICBTdG9yZURldnRvb2xzQ29uZmlnLFxufSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQge1xuICBDb21wdXRlZFN0YXRlLFxuICBMaWZ0ZWRBY3Rpb24sXG4gIExpZnRlZEFjdGlvbnMsXG4gIExpZnRlZFN0YXRlLFxufSBmcm9tICcuL3JlZHVjZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gZGlmZmVyZW5jZShmaXJzdDogYW55W10sIHNlY29uZDogYW55W10pIHtcbiAgcmV0dXJuIGZpcnN0LmZpbHRlcihpdGVtID0+IHNlY29uZC5pbmRleE9mKGl0ZW0pIDwgMCk7XG59XG5cbi8qKlxuICogUHJvdmlkZXMgYW4gYXBwJ3MgdmlldyBpbnRvIHRoZSBzdGF0ZSBvZiB0aGUgbGlmdGVkIHN0b3JlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5saWZ0U3RhdGUobGlmdGVkU3RhdGU6IExpZnRlZFN0YXRlKSB7XG4gIGNvbnN0IHsgY29tcHV0ZWRTdGF0ZXMsIGN1cnJlbnRTdGF0ZUluZGV4IH0gPSBsaWZ0ZWRTdGF0ZTtcbiAgY29uc3QgeyBzdGF0ZSB9ID0gY29tcHV0ZWRTdGF0ZXNbY3VycmVudFN0YXRlSW5kZXhdO1xuXG4gIHJldHVybiBzdGF0ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVubGlmdEFjdGlvbihsaWZ0ZWRTdGF0ZTogTGlmdGVkU3RhdGUpOiBMaWZ0ZWRBY3Rpb24ge1xuICByZXR1cm4gbGlmdGVkU3RhdGUuYWN0aW9uc0J5SWRbbGlmdGVkU3RhdGUubmV4dEFjdGlvbklkIC0gMV07XG59XG5cbi8qKlxuICogTGlmdHMgYW4gYXBwJ3MgYWN0aW9uIGludG8gYW4gYWN0aW9uIG9uIHRoZSBsaWZ0ZWQgc3RvcmUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsaWZ0QWN0aW9uKGFjdGlvbjogQWN0aW9uKSB7XG4gIHJldHVybiBuZXcgQWN0aW9ucy5QZXJmb3JtQWN0aW9uKGFjdGlvbiwgK0RhdGUubm93KCkpO1xufVxuXG4vKipcbiAqIFNhbml0aXplcyBnaXZlbiBhY3Rpb25zIHdpdGggZ2l2ZW4gZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZUFjdGlvbnMoXG4gIGFjdGlvblNhbml0aXplcjogQWN0aW9uU2FuaXRpemVyLFxuICBhY3Rpb25zOiBMaWZ0ZWRBY3Rpb25zXG4pOiBMaWZ0ZWRBY3Rpb25zIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKGFjdGlvbnMpLnJlZHVjZShcbiAgICAoc2FuaXRpemVkQWN0aW9ucywgYWN0aW9uSWR4KSA9PiB7XG4gICAgICBjb25zdCBpZHggPSBOdW1iZXIoYWN0aW9uSWR4KTtcbiAgICAgIHNhbml0aXplZEFjdGlvbnNbaWR4XSA9IHNhbml0aXplQWN0aW9uKFxuICAgICAgICBhY3Rpb25TYW5pdGl6ZXIsXG4gICAgICAgIGFjdGlvbnNbaWR4XSxcbiAgICAgICAgaWR4XG4gICAgICApO1xuICAgICAgcmV0dXJuIHNhbml0aXplZEFjdGlvbnM7XG4gICAgfSxcbiAgICA8TGlmdGVkQWN0aW9ucz57fVxuICApO1xufVxuXG4vKipcbiAqIFNhbml0aXplcyBnaXZlbiBhY3Rpb24gd2l0aCBnaXZlbiBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplQWN0aW9uKFxuICBhY3Rpb25TYW5pdGl6ZXI6IEFjdGlvblNhbml0aXplcixcbiAgYWN0aW9uOiBMaWZ0ZWRBY3Rpb24sXG4gIGFjdGlvbklkeDogbnVtYmVyXG4pOiBMaWZ0ZWRBY3Rpb24ge1xuICByZXR1cm4ge1xuICAgIC4uLmFjdGlvbixcbiAgICBhY3Rpb246IGFjdGlvblNhbml0aXplcihhY3Rpb24uYWN0aW9uLCBhY3Rpb25JZHgpLFxuICB9O1xufVxuXG4vKipcbiAqIFNhbml0aXplcyBnaXZlbiBzdGF0ZXMgd2l0aCBnaXZlbiBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplU3RhdGVzKFxuICBzdGF0ZVNhbml0aXplcjogU3RhdGVTYW5pdGl6ZXIsXG4gIHN0YXRlczogQ29tcHV0ZWRTdGF0ZVtdXG4pOiBDb21wdXRlZFN0YXRlW10ge1xuICByZXR1cm4gc3RhdGVzLm1hcCgoY29tcHV0ZWRTdGF0ZSwgaWR4KSA9PiAoe1xuICAgIHN0YXRlOiBzYW5pdGl6ZVN0YXRlKHN0YXRlU2FuaXRpemVyLCBjb21wdXRlZFN0YXRlLnN0YXRlLCBpZHgpLFxuICAgIGVycm9yOiBjb21wdXRlZFN0YXRlLmVycm9yLFxuICB9KSk7XG59XG5cbi8qKlxuICogU2FuaXRpemVzIGdpdmVuIHN0YXRlIHdpdGggZ2l2ZW4gZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZVN0YXRlKFxuICBzdGF0ZVNhbml0aXplcjogU3RhdGVTYW5pdGl6ZXIsXG4gIHN0YXRlOiBhbnksXG4gIHN0YXRlSWR4OiBudW1iZXJcbikge1xuICByZXR1cm4gc3RhdGVTYW5pdGl6ZXIoc3RhdGUsIHN0YXRlSWR4KTtcbn1cblxuLyoqXG4gKiBSZWFkIHRoZSBjb25maWcgYW5kIHRlbGwgaWYgYWN0aW9ucyBzaG91bGQgYmUgZmlsdGVyZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNob3VsZEZpbHRlckFjdGlvbnMoY29uZmlnOiBTdG9yZURldnRvb2xzQ29uZmlnKSB7XG4gIHJldHVybiBjb25maWcucHJlZGljYXRlIHx8IGNvbmZpZy5hY3Rpb25zV2hpdGVsaXN0IHx8IGNvbmZpZy5hY3Rpb25zQmxhY2tsaXN0O1xufVxuXG4vKipcbiAqIFJldHVybiBhIGZ1bGwgZmlsdGVyZWQgbGlmdGVkIHN0YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJMaWZ0ZWRTdGF0ZShcbiAgbGlmdGVkU3RhdGU6IExpZnRlZFN0YXRlLFxuICBwcmVkaWNhdGU/OiBQcmVkaWNhdGUsXG4gIHdoaXRlbGlzdD86IHN0cmluZ1tdLFxuICBibGFja2xpc3Q/OiBzdHJpbmdbXVxuKTogTGlmdGVkU3RhdGUge1xuICBjb25zdCBmaWx0ZXJlZFN0YWdlZEFjdGlvbklkczogbnVtYmVyW10gPSBbXTtcbiAgY29uc3QgZmlsdGVyZWRBY3Rpb25zQnlJZDogTGlmdGVkQWN0aW9ucyA9IHt9O1xuICBjb25zdCBmaWx0ZXJlZENvbXB1dGVkU3RhdGVzOiBDb21wdXRlZFN0YXRlW10gPSBbXTtcbiAgbGlmdGVkU3RhdGUuc3RhZ2VkQWN0aW9uSWRzLmZvckVhY2goKGlkLCBpZHgpID0+IHtcbiAgICBjb25zdCBsaWZ0ZWRBY3Rpb24gPSBsaWZ0ZWRTdGF0ZS5hY3Rpb25zQnlJZFtpZF07XG4gICAgaWYgKCFsaWZ0ZWRBY3Rpb24pIHJldHVybjtcbiAgICBpZiAoXG4gICAgICBpZHggJiZcbiAgICAgIGlzQWN0aW9uRmlsdGVyZWQoXG4gICAgICAgIGxpZnRlZFN0YXRlLmNvbXB1dGVkU3RhdGVzW2lkeF0sXG4gICAgICAgIGxpZnRlZEFjdGlvbixcbiAgICAgICAgcHJlZGljYXRlLFxuICAgICAgICB3aGl0ZWxpc3QsXG4gICAgICAgIGJsYWNrbGlzdFxuICAgICAgKVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmaWx0ZXJlZEFjdGlvbnNCeUlkW2lkXSA9IGxpZnRlZEFjdGlvbjtcbiAgICBmaWx0ZXJlZFN0YWdlZEFjdGlvbklkcy5wdXNoKGlkKTtcbiAgICBmaWx0ZXJlZENvbXB1dGVkU3RhdGVzLnB1c2gobGlmdGVkU3RhdGUuY29tcHV0ZWRTdGF0ZXNbaWR4XSk7XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIC4uLmxpZnRlZFN0YXRlLFxuICAgIHN0YWdlZEFjdGlvbklkczogZmlsdGVyZWRTdGFnZWRBY3Rpb25JZHMsXG4gICAgYWN0aW9uc0J5SWQ6IGZpbHRlcmVkQWN0aW9uc0J5SWQsXG4gICAgY29tcHV0ZWRTdGF0ZXM6IGZpbHRlcmVkQ29tcHV0ZWRTdGF0ZXMsXG4gIH07XG59XG5cbi8qKlxuICogUmV0dXJuIHRydWUgaXMgdGhlIGFjdGlvbiBzaG91bGQgYmUgaWdub3JlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNBY3Rpb25GaWx0ZXJlZChcbiAgc3RhdGU6IGFueSxcbiAgYWN0aW9uOiBMaWZ0ZWRBY3Rpb24sXG4gIHByZWRpY2F0ZT86IFByZWRpY2F0ZSxcbiAgd2hpdGVsaXN0Pzogc3RyaW5nW10sXG4gIGJsYWNrbGlzdD86IHN0cmluZ1tdXG4pIHtcbiAgcmV0dXJuIChcbiAgICAocHJlZGljYXRlICYmICFwcmVkaWNhdGUoc3RhdGUsIGFjdGlvbi5hY3Rpb24pKSB8fFxuICAgICh3aGl0ZWxpc3QgJiYgIWFjdGlvbi5hY3Rpb24udHlwZS5tYXRjaCh3aGl0ZWxpc3Quam9pbignfCcpKSkgfHxcbiAgICAoYmxhY2tsaXN0ICYmIGFjdGlvbi5hY3Rpb24udHlwZS5tYXRjaChibGFja2xpc3Quam9pbignfCcpKSlcbiAgKTtcbn1cbiJdfQ==