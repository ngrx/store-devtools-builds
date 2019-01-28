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
    // At start up NgRx dispatches init actions,
    // When these init actions are being filtered out by the predicate or black/white list options
    // we don't have a complete computed states yet.
    // At this point it could happen that we're out of bounds, when this happens we fall back to the last known state
    if (currentStateIndex >= computedStates.length) {
        const { state } = computedStates[computedStates.length - 1];
        return state;
    }
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
    /** @type {?} */
    const predicateMatch = predicate && !predicate(state, action.action);
    /** @type {?} */
    const whitelistMatch = whitelist && !action.action.type.match(whitelist.join('|'));
    /** @type {?} */
    const blacklistMatch = blacklist && action.action.type.match(blacklist.join('|'));
    return predicateMatch || whitelistMatch || blacklistMatch;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3N0b3JlLWRldnRvb2xzL3NyYy91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBR0EsT0FBTyxLQUFLLE9BQU8sTUFBTSxXQUFXLENBQUM7Ozs7OztBQWNyQyxNQUFNLFVBQVUsVUFBVSxDQUFDLEtBQVksRUFBRSxNQUFhO0lBQ3BELE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Q0FDdkQ7Ozs7OztBQUtELE1BQU0sVUFBVSxXQUFXLENBQUMsV0FBd0I7SUFDbEQsTUFBTSxFQUFFLGNBQWMsRUFBRSxpQkFBaUIsRUFBRSxHQUFHLFdBQVcsQ0FBQzs7Ozs7SUFNMUQsSUFBSSxpQkFBaUIsSUFBSSxjQUFjLENBQUMsTUFBTSxFQUFFO1FBQzlDLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxjQUFjLENBQUMsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM1RCxPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3BELE9BQU8sS0FBSyxDQUFDO0NBQ2Q7Ozs7O0FBRUQsTUFBTSxVQUFVLFlBQVksQ0FBQyxXQUF3QjtJQUNuRCxPQUFPLFdBQVcsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQztDQUM5RDs7Ozs7O0FBS0QsTUFBTSxVQUFVLFVBQVUsQ0FBQyxNQUFjO0lBQ3ZDLE9BQU8sSUFBSSxPQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0NBQ3ZEOzs7Ozs7O0FBS0QsTUFBTSxVQUFV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QyxLQUFLLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztJQUNyRSxNQUFNLGNBQWMsR0FDbEIsU0FBUyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7SUFDOUQsTUFBTSxjQUFjLEdBQ2xCLFNBQVMsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzdELE9BQU8sY0FBYyxJQUFJLGNBQWMsSUFBSSxjQUFjLENBQUM7Q0FDM0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY3Rpb24gfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCAqIGFzIEFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7XG4gIEFjdGlvblNhbml0aXplcixcbiAgU3RhdGVTYW5pdGl6ZXIsXG4gIFByZWRpY2F0ZSxcbiAgU3RvcmVEZXZ0b29sc0NvbmZpZyxcbn0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHtcbiAgQ29tcHV0ZWRTdGF0ZSxcbiAgTGlmdGVkQWN0aW9uLFxuICBMaWZ0ZWRBY3Rpb25zLFxuICBMaWZ0ZWRTdGF0ZSxcbn0gZnJvbSAnLi9yZWR1Y2VyJztcblxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZlcmVuY2UoZmlyc3Q6IGFueVtdLCBzZWNvbmQ6IGFueVtdKSB7XG4gIHJldHVybiBmaXJzdC5maWx0ZXIoaXRlbSA9PiBzZWNvbmQuaW5kZXhPZihpdGVtKSA8IDApO1xufVxuXG4vKipcbiAqIFByb3ZpZGVzIGFuIGFwcCdzIHZpZXcgaW50byB0aGUgc3RhdGUgb2YgdGhlIGxpZnRlZCBzdG9yZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVubGlmdFN0YXRlKGxpZnRlZFN0YXRlOiBMaWZ0ZWRTdGF0ZSkge1xuICBjb25zdCB7IGNvbXB1dGVkU3RhdGVzLCBjdXJyZW50U3RhdGVJbmRleCB9ID0gbGlmdGVkU3RhdGU7XG5cbiAgLy8gQXQgc3RhcnQgdXAgTmdSeCBkaXNwYXRjaGVzIGluaXQgYWN0aW9ucyxcbiAgLy8gV2hlbiB0aGVzZSBpbml0IGFjdGlvbnMgYXJlIGJlaW5nIGZpbHRlcmVkIG91dCBieSB0aGUgcHJlZGljYXRlIG9yIGJsYWNrL3doaXRlIGxpc3Qgb3B0aW9uc1xuICAvLyB3ZSBkb24ndCBoYXZlIGEgY29tcGxldGUgY29tcHV0ZWQgc3RhdGVzIHlldC5cbiAgLy8gQXQgdGhpcyBwb2ludCBpdCBjb3VsZCBoYXBwZW4gdGhhdCB3ZSdyZSBvdXQgb2YgYm91bmRzLCB3aGVuIHRoaXMgaGFwcGVucyB3ZSBmYWxsIGJhY2sgdG8gdGhlIGxhc3Qga25vd24gc3RhdGVcbiAgaWYgKGN1cnJlbnRTdGF0ZUluZGV4ID49IGNvbXB1dGVkU3RhdGVzLmxlbmd0aCkge1xuICAgIGNvbnN0IHsgc3RhdGUgfSA9IGNvbXB1dGVkU3RhdGVzW2NvbXB1dGVkU3RhdGVzLmxlbmd0aCAtIDFdO1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGNvbnN0IHsgc3RhdGUgfSA9IGNvbXB1dGVkU3RhdGVzW2N1cnJlbnRTdGF0ZUluZGV4XTtcbiAgcmV0dXJuIHN0YXRlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5saWZ0QWN0aW9uKGxpZnRlZFN0YXRlOiBMaWZ0ZWRTdGF0ZSk6IExpZnRlZEFjdGlvbiB7XG4gIHJldHVybiBsaWZ0ZWRTdGF0ZS5hY3Rpb25zQnlJZFtsaWZ0ZWRTdGF0ZS5uZXh0QWN0aW9uSWQgLSAxXTtcbn1cblxuLyoqXG4gKiBMaWZ0cyBhbiBhcHAncyBhY3Rpb24gaW50byBhbiBhY3Rpb24gb24gdGhlIGxpZnRlZCBzdG9yZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxpZnRBY3Rpb24oYWN0aW9uOiBBY3Rpb24pIHtcbiAgcmV0dXJuIG5ldyBBY3Rpb25zLlBlcmZvcm1BY3Rpb24oYWN0aW9uLCArRGF0ZS5ub3coKSk7XG59XG5cbi8qKlxuICogU2FuaXRpemVzIGdpdmVuIGFjdGlvbnMgd2l0aCBnaXZlbiBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplQWN0aW9ucyhcbiAgYWN0aW9uU2FuaXRpemVyOiBBY3Rpb25TYW5pdGl6ZXIsXG4gIGFjdGlvbnM6IExpZnRlZEFjdGlvbnNcbik6IExpZnRlZEFjdGlvbnMge1xuICByZXR1cm4gT2JqZWN0LmtleXMoYWN0aW9ucykucmVkdWNlKFxuICAgIChzYW5pdGl6ZWRBY3Rpb25zLCBhY3Rpb25JZHgpID0+IHtcbiAgICAgIGNvbnN0IGlkeCA9IE51bWJlcihhY3Rpb25JZHgpO1xuICAgICAgc2FuaXRpemVkQWN0aW9uc1tpZHhdID0gc2FuaXRpemVBY3Rpb24oXG4gICAgICAgIGFjdGlvblNhbml0aXplcixcbiAgICAgICAgYWN0aW9uc1tpZHhdLFxuICAgICAgICBpZHhcbiAgICAgICk7XG4gICAgICByZXR1cm4gc2FuaXRpemVkQWN0aW9ucztcbiAgICB9LFxuICAgIDxMaWZ0ZWRBY3Rpb25zPnt9XG4gICk7XG59XG5cbi8qKlxuICogU2FuaXRpemVzIGdpdmVuIGFjdGlvbiB3aXRoIGdpdmVuIGZ1bmN0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVBY3Rpb24oXG4gIGFjdGlvblNhbml0aXplcjogQWN0aW9uU2FuaXRpemVyLFxuICBhY3Rpb246IExpZnRlZEFjdGlvbixcbiAgYWN0aW9uSWR4OiBudW1iZXJcbik6IExpZnRlZEFjdGlvbiB7XG4gIHJldHVybiB7XG4gICAgLi4uYWN0aW9uLFxuICAgIGFjdGlvbjogYWN0aW9uU2FuaXRpemVyKGFjdGlvbi5hY3Rpb24sIGFjdGlvbklkeCksXG4gIH07XG59XG5cbi8qKlxuICogU2FuaXRpemVzIGdpdmVuIHN0YXRlcyB3aXRoIGdpdmVuIGZ1bmN0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVTdGF0ZXMoXG4gIHN0YXRlU2FuaXRpemVyOiBTdGF0ZVNhbml0aXplcixcbiAgc3RhdGVzOiBDb21wdXRlZFN0YXRlW11cbik6IENvbXB1dGVkU3RhdGVbXSB7XG4gIHJldHVybiBzdGF0ZXMubWFwKChjb21wdXRlZFN0YXRlLCBpZHgpID0+ICh7XG4gICAgc3RhdGU6IHNhbml0aXplU3RhdGUoc3RhdGVTYW5pdGl6ZXIsIGNvbXB1dGVkU3RhdGUuc3RhdGUsIGlkeCksXG4gICAgZXJyb3I6IGNvbXB1dGVkU3RhdGUuZXJyb3IsXG4gIH0pKTtcbn1cblxuLyoqXG4gKiBTYW5pdGl6ZXMgZ2l2ZW4gc3RhdGUgd2l0aCBnaXZlbiBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplU3RhdGUoXG4gIHN0YXRlU2FuaXRpemVyOiBTdGF0ZVNhbml0aXplcixcbiAgc3RhdGU6IGFueSxcbiAgc3RhdGVJZHg6IG51bWJlclxuKSB7XG4gIHJldHVybiBzdGF0ZVNhbml0aXplcihzdGF0ZSwgc3RhdGVJZHgpO1xufVxuXG4vKipcbiAqIFJlYWQgdGhlIGNvbmZpZyBhbmQgdGVsbCBpZiBhY3Rpb25zIHNob3VsZCBiZSBmaWx0ZXJlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2hvdWxkRmlsdGVyQWN0aW9ucyhjb25maWc6IFN0b3JlRGV2dG9vbHNDb25maWcpIHtcbiAgcmV0dXJuIGNvbmZpZy5wcmVkaWNhdGUgfHwgY29uZmlnLmFjdGlvbnNXaGl0ZWxpc3QgfHwgY29uZmlnLmFjdGlvbnNCbGFja2xpc3Q7XG59XG5cbi8qKlxuICogUmV0dXJuIGEgZnVsbCBmaWx0ZXJlZCBsaWZ0ZWQgc3RhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckxpZnRlZFN0YXRlKFxuICBsaWZ0ZWRTdGF0ZTogTGlmdGVkU3RhdGUsXG4gIHByZWRpY2F0ZT86IFByZWRpY2F0ZSxcbiAgd2hpdGVsaXN0Pzogc3RyaW5nW10sXG4gIGJsYWNrbGlzdD86IHN0cmluZ1tdXG4pOiBMaWZ0ZWRTdGF0ZSB7XG4gIGNvbnN0IGZpbHRlcmVkU3RhZ2VkQWN0aW9uSWRzOiBudW1iZXJbXSA9IFtdO1xuICBjb25zdCBmaWx0ZXJlZEFjdGlvbnNCeUlkOiBMaWZ0ZWRBY3Rpb25zID0ge307XG4gIGNvbnN0IGZpbHRlcmVkQ29tcHV0ZWRTdGF0ZXM6IENvbXB1dGVkU3RhdGVbXSA9IFtdO1xuICBsaWZ0ZWRTdGF0ZS5zdGFnZWRBY3Rpb25JZHMuZm9yRWFjaCgoaWQsIGlkeCkgPT4ge1xuICAgIGNvbnN0IGxpZnRlZEFjdGlvbiA9IGxpZnRlZFN0YXRlLmFjdGlvbnNCeUlkW2lkXTtcbiAgICBpZiAoIWxpZnRlZEFjdGlvbikgcmV0dXJuO1xuICAgIGlmIChcbiAgICAgIGlkeCAmJlxuICAgICAgaXNBY3Rpb25GaWx0ZXJlZChcbiAgICAgICAgbGlmdGVkU3RhdGUuY29tcHV0ZWRTdGF0ZXNbaWR4XSxcbiAgICAgICAgbGlmdGVkQWN0aW9uLFxuICAgICAgICBwcmVkaWNhdGUsXG4gICAgICAgIHdoaXRlbGlzdCxcbiAgICAgICAgYmxhY2tsaXN0XG4gICAgICApXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZpbHRlcmVkQWN0aW9uc0J5SWRbaWRdID0gbGlmdGVkQWN0aW9uO1xuICAgIGZpbHRlcmVkU3RhZ2VkQWN0aW9uSWRzLnB1c2goaWQpO1xuICAgIGZpbHRlcmVkQ29tcHV0ZWRTdGF0ZXMucHVzaChsaWZ0ZWRTdGF0ZS5jb21wdXRlZFN0YXRlc1tpZHhdKTtcbiAgfSk7XG4gIHJldHVybiB7XG4gICAgLi4ubGlmdGVkU3RhdGUsXG4gICAgc3RhZ2VkQWN0aW9uSWRzOiBmaWx0ZXJlZFN0YWdlZEFjdGlvbklkcyxcbiAgICBhY3Rpb25zQnlJZDogZmlsdGVyZWRBY3Rpb25zQnlJZCxcbiAgICBjb21wdXRlZFN0YXRlczogZmlsdGVyZWRDb21wdXRlZFN0YXRlcyxcbiAgfTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdHJ1ZSBpcyB0aGUgYWN0aW9uIHNob3VsZCBiZSBpZ25vcmVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0FjdGlvbkZpbHRlcmVkKFxuICBzdGF0ZTogYW55LFxuICBhY3Rpb246IExpZnRlZEFjdGlvbixcbiAgcHJlZGljYXRlPzogUHJlZGljYXRlLFxuICB3aGl0ZWxpc3Q/OiBzdHJpbmdbXSxcbiAgYmxhY2tsaXN0Pzogc3RyaW5nW11cbikge1xuICBjb25zdCBwcmVkaWNhdGVNYXRjaCA9IHByZWRpY2F0ZSAmJiAhcHJlZGljYXRlKHN0YXRlLCBhY3Rpb24uYWN0aW9uKTtcbiAgY29uc3Qgd2hpdGVsaXN0TWF0Y2ggPVxuICAgIHdoaXRlbGlzdCAmJiAhYWN0aW9uLmFjdGlvbi50eXBlLm1hdGNoKHdoaXRlbGlzdC5qb2luKCd8JykpO1xuICBjb25zdCBibGFja2xpc3RNYXRjaCA9XG4gICAgYmxhY2tsaXN0ICYmIGFjdGlvbi5hY3Rpb24udHlwZS5tYXRjaChibGFja2xpc3Quam9pbignfCcpKTtcbiAgcmV0dXJuIHByZWRpY2F0ZU1hdGNoIHx8IHdoaXRlbGlzdE1hdGNoIHx8IGJsYWNrbGlzdE1hdGNoO1xufVxuIl19