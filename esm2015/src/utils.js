/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as Actions from './actions';
/**
 * @param {?} first
 * @param {?} second
 * @return {?}
 */
export function difference(first, second) {
    return first.filter((/**
     * @param {?} item
     * @return {?}
     */
    item => second.indexOf(item) < 0));
}
/**
 * Provides an app's view into the state of the lifted store.
 * @param {?} liftedState
 * @return {?}
 */
export function unliftState(liftedState) {
    const { computedStates, currentStateIndex } = liftedState;
    // At start up NgRx dispatches init actions,
    // When these init actions are being filtered out by the predicate or safe/block list options
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
    return Object.keys(actions).reduce((/**
     * @param {?} sanitizedActions
     * @param {?} actionIdx
     * @return {?}
     */
    (sanitizedActions, actionIdx) => {
        /** @type {?} */
        const idx = Number(actionIdx);
        sanitizedActions[idx] = sanitizeAction(actionSanitizer, actions[idx], idx);
        return sanitizedActions;
    }), (/** @type {?} */ ({})));
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
    return states.map((/**
     * @param {?} computedState
     * @param {?} idx
     * @return {?}
     */
    (computedState, idx) => ({
        state: sanitizeState(stateSanitizer, computedState.state, idx),
        error: computedState.error,
    })));
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
    return config.predicate || config.actionsSafelist || config.actionsBlocklist;
}
/**
 * Return a full filtered lifted state
 * @param {?} liftedState
 * @param {?=} predicate
 * @param {?=} safelist
 * @param {?=} blocklist
 * @return {?}
 */
export function filterLiftedState(liftedState, predicate, safelist, blocklist) {
    /** @type {?} */
    const filteredStagedActionIds = [];
    /** @type {?} */
    const filteredActionsById = {};
    /** @type {?} */
    const filteredComputedStates = [];
    liftedState.stagedActionIds.forEach((/**
     * @param {?} id
     * @param {?} idx
     * @return {?}
     */
    (id, idx) => {
        /** @type {?} */
        const liftedAction = liftedState.actionsById[id];
        if (!liftedAction)
            return;
        if (idx &&
            isActionFiltered(liftedState.computedStates[idx], liftedAction, predicate, safelist, blocklist)) {
            return;
        }
        filteredActionsById[id] = liftedAction;
        filteredStagedActionIds.push(id);
        filteredComputedStates.push(liftedState.computedStates[idx]);
    }));
    return Object.assign({}, liftedState, { stagedActionIds: filteredStagedActionIds, actionsById: filteredActionsById, computedStates: filteredComputedStates });
}
/**
 * Return true is the action should be ignored
 * @param {?} state
 * @param {?} action
 * @param {?=} predicate
 * @param {?=} safelist
 * @param {?=} blockedlist
 * @return {?}
 */
export function isActionFiltered(state, action, predicate, safelist, blockedlist) {
    /** @type {?} */
    const predicateMatch = predicate && !predicate(state, action.action);
    /** @type {?} */
    const safelistMatch = safelist && !action.action.type.match(safelist.join('|'));
    /** @type {?} */
    const blocklistMatch = blockedlist && action.action.type.match(blockedlist.join('|'));
    return predicateMatch || safelistMatch || blocklistMatch;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3N0b3JlLWRldnRvb2xzL3NyYy91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBR0EsT0FBTyxLQUFLLE9BQU8sTUFBTSxXQUFXLENBQUM7Ozs7OztBQWNyQyxNQUFNLFVBQVUsVUFBVSxDQUFDLEtBQVksRUFBRSxNQUFhO0lBQ3BELE9BQU8sS0FBSyxDQUFDLE1BQU07Ozs7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUM7QUFDeEQsQ0FBQzs7Ozs7O0FBS0QsTUFBTSxVQUFVLFdBQVcsQ0FBQyxXQUF3QjtVQUM1QyxFQUFFLGNBQWMsRUFBRSxpQkFBaUIsRUFBRSxHQUFHLFdBQVc7SUFFekQsNENBQTRDO0lBQzVDLDZGQUE2RjtJQUM3RixnREFBZ0Q7SUFDaEQsaUhBQWlIO0lBQ2pILElBQUksaUJBQWlCLElBQUksY0FBYyxDQUFDLE1BQU0sRUFBRTtjQUN4QyxFQUFFLEtBQUssRUFBRSxHQUFHLGNBQWMsQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUMzRCxPQUFPLEtBQUssQ0FBQztLQUNkO1VBRUssRUFBRSxLQUFLLEVBQUUsR0FBRyxjQUFjLENBQUMsaUJBQWlCLENBQUM7SUFDbkQsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDOzs7OztBQUVELE1BQU0sVUFBVSxZQUFZLENBQUMsV0FBd0I7SUFDbkQsT0FBTyxXQUFXLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDL0QsQ0FBQzs7Ozs7O0FBS0QsTUFBTSxVQUFVLFVBQVUsQ0FBQyxNQUFjO0lBQ3ZDLE9BQU8sSUFBSSxPQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUs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QUFzQjs7VUFFaEIsY0FBYyxHQUFHLFNBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQzs7VUFDOUQsYUFBYSxHQUNqQixRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7VUFDckQsY0FBYyxHQUNsQixXQUFXLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEUsT0FBTyxjQUFjLElBQUksYUFBYSxJQUFJLGNBQWMsQ0FBQztBQUMzRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgKiBhcyBBY3Rpb25zIGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQge1xuICBBY3Rpb25TYW5pdGl6ZXIsXG4gIFN0YXRlU2FuaXRpemVyLFxuICBQcmVkaWNhdGUsXG4gIFN0b3JlRGV2dG9vbHNDb25maWcsXG59IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7XG4gIENvbXB1dGVkU3RhdGUsXG4gIExpZnRlZEFjdGlvbixcbiAgTGlmdGVkQWN0aW9ucyxcbiAgTGlmdGVkU3RhdGUsXG59IGZyb20gJy4vcmVkdWNlcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBkaWZmZXJlbmNlKGZpcnN0OiBhbnlbXSwgc2Vjb25kOiBhbnlbXSkge1xuICByZXR1cm4gZmlyc3QuZmlsdGVyKGl0ZW0gPT4gc2Vjb25kLmluZGV4T2YoaXRlbSkgPCAwKTtcbn1cblxuLyoqXG4gKiBQcm92aWRlcyBhbiBhcHAncyB2aWV3IGludG8gdGhlIHN0YXRlIG9mIHRoZSBsaWZ0ZWQgc3RvcmUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmxpZnRTdGF0ZShsaWZ0ZWRTdGF0ZTogTGlmdGVkU3RhdGUpIHtcbiAgY29uc3QgeyBjb21wdXRlZFN0YXRlcywgY3VycmVudFN0YXRlSW5kZXggfSA9IGxpZnRlZFN0YXRlO1xuXG4gIC8vIEF0IHN0YXJ0IHVwIE5nUnggZGlzcGF0Y2hlcyBpbml0IGFjdGlvbnMsXG4gIC8vIFdoZW4gdGhlc2UgaW5pdCBhY3Rpb25zIGFyZSBiZWluZyBmaWx0ZXJlZCBvdXQgYnkgdGhlIHByZWRpY2F0ZSBvciBzYWZlL2Jsb2NrIGxpc3Qgb3B0aW9uc1xuICAvLyB3ZSBkb24ndCBoYXZlIGEgY29tcGxldGUgY29tcHV0ZWQgc3RhdGVzIHlldC5cbiAgLy8gQXQgdGhpcyBwb2ludCBpdCBjb3VsZCBoYXBwZW4gdGhhdCB3ZSdyZSBvdXQgb2YgYm91bmRzLCB3aGVuIHRoaXMgaGFwcGVucyB3ZSBmYWxsIGJhY2sgdG8gdGhlIGxhc3Qga25vd24gc3RhdGVcbiAgaWYgKGN1cnJlbnRTdGF0ZUluZGV4ID49IGNvbXB1dGVkU3RhdGVzLmxlbmd0aCkge1xuICAgIGNvbnN0IHsgc3RhdGUgfSA9IGNvbXB1dGVkU3RhdGVzW2NvbXB1dGVkU3RhdGVzLmxlbmd0aCAtIDFdO1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGNvbnN0IHsgc3RhdGUgfSA9IGNvbXB1dGVkU3RhdGVzW2N1cnJlbnRTdGF0ZUluZGV4XTtcbiAgcmV0dXJuIHN0YXRlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5saWZ0QWN0aW9uKGxpZnRlZFN0YXRlOiBMaWZ0ZWRTdGF0ZSk6IExpZnRlZEFjdGlvbiB7XG4gIHJldHVybiBsaWZ0ZWRTdGF0ZS5hY3Rpb25zQnlJZFtsaWZ0ZWRTdGF0ZS5uZXh0QWN0aW9uSWQgLSAxXTtcbn1cblxuLyoqXG4gKiBMaWZ0cyBhbiBhcHAncyBhY3Rpb24gaW50byBhbiBhY3Rpb24gb24gdGhlIGxpZnRlZCBzdG9yZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxpZnRBY3Rpb24oYWN0aW9uOiBBY3Rpb24pIHtcbiAgcmV0dXJuIG5ldyBBY3Rpb25zLlBlcmZvcm1BY3Rpb24oYWN0aW9uLCArRGF0ZS5ub3coKSk7XG59XG5cbi8qKlxuICogU2FuaXRpemVzIGdpdmVuIGFjdGlvbnMgd2l0aCBnaXZlbiBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplQWN0aW9ucyhcbiAgYWN0aW9uU2FuaXRpemVyOiBBY3Rpb25TYW5pdGl6ZXIsXG4gIGFjdGlvbnM6IExpZnRlZEFjdGlvbnNcbik6IExpZnRlZEFjdGlvbnMge1xuICByZXR1cm4gT2JqZWN0LmtleXMoYWN0aW9ucykucmVkdWNlKFxuICAgIChzYW5pdGl6ZWRBY3Rpb25zLCBhY3Rpb25JZHgpID0+IHtcbiAgICAgIGNvbnN0IGlkeCA9IE51bWJlcihhY3Rpb25JZHgpO1xuICAgICAgc2FuaXRpemVkQWN0aW9uc1tpZHhdID0gc2FuaXRpemVBY3Rpb24oXG4gICAgICAgIGFjdGlvblNhbml0aXplcixcbiAgICAgICAgYWN0aW9uc1tpZHhdLFxuICAgICAgICBpZHhcbiAgICAgICk7XG4gICAgICByZXR1cm4gc2FuaXRpemVkQWN0aW9ucztcbiAgICB9LFxuICAgIDxMaWZ0ZWRBY3Rpb25zPnt9XG4gICk7XG59XG5cbi8qKlxuICogU2FuaXRpemVzIGdpdmVuIGFjdGlvbiB3aXRoIGdpdmVuIGZ1bmN0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVBY3Rpb24oXG4gIGFjdGlvblNhbml0aXplcjogQWN0aW9uU2FuaXRpemVyLFxuICBhY3Rpb246IExpZnRlZEFjdGlvbixcbiAgYWN0aW9uSWR4OiBudW1iZXJcbik6IExpZnRlZEFjdGlvbiB7XG4gIHJldHVybiB7XG4gICAgLi4uYWN0aW9uLFxuICAgIGFjdGlvbjogYWN0aW9uU2FuaXRpemVyKGFjdGlvbi5hY3Rpb24sIGFjdGlvbklkeCksXG4gIH07XG59XG5cbi8qKlxuICogU2FuaXRpemVzIGdpdmVuIHN0YXRlcyB3aXRoIGdpdmVuIGZ1bmN0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVTdGF0ZXMoXG4gIHN0YXRlU2FuaXRpemVyOiBTdGF0ZVNhbml0aXplcixcbiAgc3RhdGVzOiBDb21wdXRlZFN0YXRlW11cbik6IENvbXB1dGVkU3RhdGVbXSB7XG4gIHJldHVybiBzdGF0ZXMubWFwKChjb21wdXRlZFN0YXRlLCBpZHgpID0+ICh7XG4gICAgc3RhdGU6IHNhbml0aXplU3RhdGUoc3RhdGVTYW5pdGl6ZXIsIGNvbXB1dGVkU3RhdGUuc3RhdGUsIGlkeCksXG4gICAgZXJyb3I6IGNvbXB1dGVkU3RhdGUuZXJyb3IsXG4gIH0pKTtcbn1cblxuLyoqXG4gKiBTYW5pdGl6ZXMgZ2l2ZW4gc3RhdGUgd2l0aCBnaXZlbiBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplU3RhdGUoXG4gIHN0YXRlU2FuaXRpemVyOiBTdGF0ZVNhbml0aXplcixcbiAgc3RhdGU6IGFueSxcbiAgc3RhdGVJZHg6IG51bWJlclxuKSB7XG4gIHJldHVybiBzdGF0ZVNhbml0aXplcihzdGF0ZSwgc3RhdGVJZHgpO1xufVxuXG4vKipcbiAqIFJlYWQgdGhlIGNvbmZpZyBhbmQgdGVsbCBpZiBhY3Rpb25zIHNob3VsZCBiZSBmaWx0ZXJlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2hvdWxkRmlsdGVyQWN0aW9ucyhjb25maWc6IFN0b3JlRGV2dG9vbHNDb25maWcpIHtcbiAgcmV0dXJuIGNvbmZpZy5wcmVkaWNhdGUgfHwgY29uZmlnLmFjdGlvbnNTYWZlbGlzdCB8fCBjb25maWcuYWN0aW9uc0Jsb2NrbGlzdDtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBmdWxsIGZpbHRlcmVkIGxpZnRlZCBzdGF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyTGlmdGVkU3RhdGUoXG4gIGxpZnRlZFN0YXRlOiBMaWZ0ZWRTdGF0ZSxcbiAgcHJlZGljYXRlPzogUHJlZGljYXRlLFxuICBzYWZlbGlzdD86IHN0cmluZ1tdLFxuICBibG9ja2xpc3Q/OiBzdHJpbmdbXVxuKTogTGlmdGVkU3RhdGUge1xuICBjb25zdCBmaWx0ZXJlZFN0YWdlZEFjdGlvbklkczogbnVtYmVyW10gPSBbXTtcbiAgY29uc3QgZmlsdGVyZWRBY3Rpb25zQnlJZDogTGlmdGVkQWN0aW9ucyA9IHt9O1xuICBjb25zdCBmaWx0ZXJlZENvbXB1dGVkU3RhdGVzOiBDb21wdXRlZFN0YXRlW10gPSBbXTtcbiAgbGlmdGVkU3RhdGUuc3RhZ2VkQWN0aW9uSWRzLmZvckVhY2goKGlkLCBpZHgpID0+IHtcbiAgICBjb25zdCBsaWZ0ZWRBY3Rpb24gPSBsaWZ0ZWRTdGF0ZS5hY3Rpb25zQnlJZFtpZF07XG4gICAgaWYgKCFsaWZ0ZWRBY3Rpb24pIHJldHVybjtcbiAgICBpZiAoXG4gICAgICBpZHggJiZcbiAgICAgIGlzQWN0aW9uRmlsdGVyZWQoXG4gICAgICAgIGxpZnRlZFN0YXRlLmNvbXB1dGVkU3RhdGVzW2lkeF0sXG4gICAgICAgIGxpZnRlZEFjdGlvbixcbiAgICAgICAgcHJlZGljYXRlLFxuICAgICAgICBzYWZlbGlzdCxcbiAgICAgICAgYmxvY2tsaXN0XG4gICAgICApXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZpbHRlcmVkQWN0aW9uc0J5SWRbaWRdID0gbGlmdGVkQWN0aW9uO1xuICAgIGZpbHRlcmVkU3RhZ2VkQWN0aW9uSWRzLnB1c2goaWQpO1xuICAgIGZpbHRlcmVkQ29tcHV0ZWRTdGF0ZXMucHVzaChsaWZ0ZWRTdGF0ZS5jb21wdXRlZFN0YXRlc1tpZHhdKTtcbiAgfSk7XG4gIHJldHVybiB7XG4gICAgLi4ubGlmdGVkU3RhdGUsXG4gICAgc3RhZ2VkQWN0aW9uSWRzOiBmaWx0ZXJlZFN0YWdlZEFjdGlvbklkcyxcbiAgICBhY3Rpb25zQnlJZDogZmlsdGVyZWRBY3Rpb25zQnlJZCxcbiAgICBjb21wdXRlZFN0YXRlczogZmlsdGVyZWRDb21wdXRlZFN0YXRlcyxcbiAgfTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdHJ1ZSBpcyB0aGUgYWN0aW9uIHNob3VsZCBiZSBpZ25vcmVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0FjdGlvbkZpbHRlcmVkKFxuICBzdGF0ZTogYW55LFxuICBhY3Rpb246IExpZnRlZEFjdGlvbixcbiAgcHJlZGljYXRlPzogUHJlZGljYXRlLFxuICBzYWZlbGlzdD86IHN0cmluZ1tdLFxuICBibG9ja2VkbGlzdD86IHN0cmluZ1tdXG4pIHtcbiAgY29uc3QgcHJlZGljYXRlTWF0Y2ggPSBwcmVkaWNhdGUgJiYgIXByZWRpY2F0ZShzdGF0ZSwgYWN0aW9uLmFjdGlvbik7XG4gIGNvbnN0IHNhZmVsaXN0TWF0Y2ggPVxuICAgIHNhZmVsaXN0ICYmICFhY3Rpb24uYWN0aW9uLnR5cGUubWF0Y2goc2FmZWxpc3Quam9pbignfCcpKTtcbiAgY29uc3QgYmxvY2tsaXN0TWF0Y2ggPVxuICAgIGJsb2NrZWRsaXN0ICYmIGFjdGlvbi5hY3Rpb24udHlwZS5tYXRjaChibG9ja2VkbGlzdC5qb2luKCd8JykpO1xuICByZXR1cm4gcHJlZGljYXRlTWF0Y2ggfHwgc2FmZWxpc3RNYXRjaCB8fCBibG9ja2xpc3RNYXRjaDtcbn1cbiJdfQ==