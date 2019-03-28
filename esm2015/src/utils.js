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
            isActionFiltered(liftedState.computedStates[idx], liftedAction, predicate, whitelist, blacklist)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3N0b3JlLWRldnRvb2xzL3NyYy91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBR0EsT0FBTyxLQUFLLE9BQU8sTUFBTSxXQUFXLENBQUM7Ozs7OztBQWNyQyxNQUFNLFVBQVUsVUFBVSxDQUFDLEtBQVksRUFBRSxNQUFhO0lBQ3BELE9BQU8sS0FBSyxDQUFDLE1BQU07Ozs7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUM7QUFDeEQsQ0FBQzs7Ozs7O0FBS0QsTUFBTSxVQUFVLFdBQVcsQ0FBQyxXQUF3QjtVQUM1QyxFQUFFLGNBQWMsRUFBRSxpQkFBaUIsRUFBRSxHQUFHLFdBQVc7SUFFekQsNENBQTRDO0lBQzVDLDhGQUE4RjtJQUM5RixnREFBZ0Q7SUFDaEQsaUhBQWlIO0lBQ2pILElBQUksaUJBQWlCLElBQUksY0FBYyxDQUFDLE1BQU0sRUFBRTtjQUN4QyxFQUFFLEtBQUssRUFBRSxHQUFHLGNBQWMsQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUMzRCxPQUFPLEtBQUssQ0FBQztLQUNkO1VBRUssRUFBRSxLQUFLLEVBQUUsR0FBRyxjQUFjLENBQUMsaUJBQWlCLENBQUM7SUFDbkQsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDOzs7OztBQUVELE1BQU0sVUFBVSxZQUFZLENBQUMsV0FBd0I7SUFDbkQsT0FBTyxXQUFXLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDL0QsQ0FBQzs7Ozs7O0FBS0QsTUFBTSxVQUFVLFVBQVUsQ0FBQyxNQUFjO0lBQ3ZDLE9BQU8sSUFBSSxPQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUs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LFNBQW9COztVQUVkLGNBQWMsR0FBRyxTQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUM7O1VBQzlELGNBQWMsR0FDbEIsU0FBUyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7O1VBQ3ZELGNBQWMsR0FDbEIsU0FBUyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVELE9BQU8sY0FBYyxJQUFJLGNBQWMsSUFBSSxjQUFjLENBQUM7QUFDNUQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0ICogYXMgQWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHtcbiAgQWN0aW9uU2FuaXRpemVyLFxuICBTdGF0ZVNhbml0aXplcixcbiAgUHJlZGljYXRlLFxuICBTdG9yZURldnRvb2xzQ29uZmlnLFxufSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQge1xuICBDb21wdXRlZFN0YXRlLFxuICBMaWZ0ZWRBY3Rpb24sXG4gIExpZnRlZEFjdGlvbnMsXG4gIExpZnRlZFN0YXRlLFxufSBmcm9tICcuL3JlZHVjZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gZGlmZmVyZW5jZShmaXJzdDogYW55W10sIHNlY29uZDogYW55W10pIHtcbiAgcmV0dXJuIGZpcnN0LmZpbHRlcihpdGVtID0+IHNlY29uZC5pbmRleE9mKGl0ZW0pIDwgMCk7XG59XG5cbi8qKlxuICogUHJvdmlkZXMgYW4gYXBwJ3MgdmlldyBpbnRvIHRoZSBzdGF0ZSBvZiB0aGUgbGlmdGVkIHN0b3JlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5saWZ0U3RhdGUobGlmdGVkU3RhdGU6IExpZnRlZFN0YXRlKSB7XG4gIGNvbnN0IHsgY29tcHV0ZWRTdGF0ZXMsIGN1cnJlbnRTdGF0ZUluZGV4IH0gPSBsaWZ0ZWRTdGF0ZTtcblxuICAvLyBBdCBzdGFydCB1cCBOZ1J4IGRpc3BhdGNoZXMgaW5pdCBhY3Rpb25zLFxuICAvLyBXaGVuIHRoZXNlIGluaXQgYWN0aW9ucyBhcmUgYmVpbmcgZmlsdGVyZWQgb3V0IGJ5IHRoZSBwcmVkaWNhdGUgb3IgYmxhY2svd2hpdGUgbGlzdCBvcHRpb25zXG4gIC8vIHdlIGRvbid0IGhhdmUgYSBjb21wbGV0ZSBjb21wdXRlZCBzdGF0ZXMgeWV0LlxuICAvLyBBdCB0aGlzIHBvaW50IGl0IGNvdWxkIGhhcHBlbiB0aGF0IHdlJ3JlIG91dCBvZiBib3VuZHMsIHdoZW4gdGhpcyBoYXBwZW5zIHdlIGZhbGwgYmFjayB0byB0aGUgbGFzdCBrbm93biBzdGF0ZVxuICBpZiAoY3VycmVudFN0YXRlSW5kZXggPj0gY29tcHV0ZWRTdGF0ZXMubGVuZ3RoKSB7XG4gICAgY29uc3QgeyBzdGF0ZSB9ID0gY29tcHV0ZWRTdGF0ZXNbY29tcHV0ZWRTdGF0ZXMubGVuZ3RoIC0gMV07XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgY29uc3QgeyBzdGF0ZSB9ID0gY29tcHV0ZWRTdGF0ZXNbY3VycmVudFN0YXRlSW5kZXhdO1xuICByZXR1cm4gc3RhdGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bmxpZnRBY3Rpb24obGlmdGVkU3RhdGU6IExpZnRlZFN0YXRlKTogTGlmdGVkQWN0aW9uIHtcbiAgcmV0dXJuIGxpZnRlZFN0YXRlLmFjdGlvbnNCeUlkW2xpZnRlZFN0YXRlLm5leHRBY3Rpb25JZCAtIDFdO1xufVxuXG4vKipcbiAqIExpZnRzIGFuIGFwcCdzIGFjdGlvbiBpbnRvIGFuIGFjdGlvbiBvbiB0aGUgbGlmdGVkIHN0b3JlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbGlmdEFjdGlvbihhY3Rpb246IEFjdGlvbikge1xuICByZXR1cm4gbmV3IEFjdGlvbnMuUGVyZm9ybUFjdGlvbihhY3Rpb24sICtEYXRlLm5vdygpKTtcbn1cblxuLyoqXG4gKiBTYW5pdGl6ZXMgZ2l2ZW4gYWN0aW9ucyB3aXRoIGdpdmVuIGZ1bmN0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVBY3Rpb25zKFxuICBhY3Rpb25TYW5pdGl6ZXI6IEFjdGlvblNhbml0aXplcixcbiAgYWN0aW9uczogTGlmdGVkQWN0aW9uc1xuKTogTGlmdGVkQWN0aW9ucyB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhhY3Rpb25zKS5yZWR1Y2UoXG4gICAgKHNhbml0aXplZEFjdGlvbnMsIGFjdGlvbklkeCkgPT4ge1xuICAgICAgY29uc3QgaWR4ID0gTnVtYmVyKGFjdGlvbklkeCk7XG4gICAgICBzYW5pdGl6ZWRBY3Rpb25zW2lkeF0gPSBzYW5pdGl6ZUFjdGlvbihcbiAgICAgICAgYWN0aW9uU2FuaXRpemVyLFxuICAgICAgICBhY3Rpb25zW2lkeF0sXG4gICAgICAgIGlkeFxuICAgICAgKTtcbiAgICAgIHJldHVybiBzYW5pdGl6ZWRBY3Rpb25zO1xuICAgIH0sXG4gICAgPExpZnRlZEFjdGlvbnM+e31cbiAgKTtcbn1cblxuLyoqXG4gKiBTYW5pdGl6ZXMgZ2l2ZW4gYWN0aW9uIHdpdGggZ2l2ZW4gZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZUFjdGlvbihcbiAgYWN0aW9uU2FuaXRpemVyOiBBY3Rpb25TYW5pdGl6ZXIsXG4gIGFjdGlvbjogTGlmdGVkQWN0aW9uLFxuICBhY3Rpb25JZHg6IG51bWJlclxuKTogTGlmdGVkQWN0aW9uIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5hY3Rpb24sXG4gICAgYWN0aW9uOiBhY3Rpb25TYW5pdGl6ZXIoYWN0aW9uLmFjdGlvbiwgYWN0aW9uSWR4KSxcbiAgfTtcbn1cblxuLyoqXG4gKiBTYW5pdGl6ZXMgZ2l2ZW4gc3RhdGVzIHdpdGggZ2l2ZW4gZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZVN0YXRlcyhcbiAgc3RhdGVTYW5pdGl6ZXI6IFN0YXRlU2FuaXRpemVyLFxuICBzdGF0ZXM6IENvbXB1dGVkU3RhdGVbXVxuKTogQ29tcHV0ZWRTdGF0ZVtdIHtcbiAgcmV0dXJuIHN0YXRlcy5tYXAoKGNvbXB1dGVkU3RhdGUsIGlkeCkgPT4gKHtcbiAgICBzdGF0ZTogc2FuaXRpemVTdGF0ZShzdGF0ZVNhbml0aXplciwgY29tcHV0ZWRTdGF0ZS5zdGF0ZSwgaWR4KSxcbiAgICBlcnJvcjogY29tcHV0ZWRTdGF0ZS5lcnJvcixcbiAgfSkpO1xufVxuXG4vKipcbiAqIFNhbml0aXplcyBnaXZlbiBzdGF0ZSB3aXRoIGdpdmVuIGZ1bmN0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVTdGF0ZShcbiAgc3RhdGVTYW5pdGl6ZXI6IFN0YXRlU2FuaXRpemVyLFxuICBzdGF0ZTogYW55LFxuICBzdGF0ZUlkeDogbnVtYmVyXG4pIHtcbiAgcmV0dXJuIHN0YXRlU2FuaXRpemVyKHN0YXRlLCBzdGF0ZUlkeCk7XG59XG5cbi8qKlxuICogUmVhZCB0aGUgY29uZmlnIGFuZCB0ZWxsIGlmIGFjdGlvbnMgc2hvdWxkIGJlIGZpbHRlcmVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzaG91bGRGaWx0ZXJBY3Rpb25zKGNvbmZpZzogU3RvcmVEZXZ0b29sc0NvbmZpZykge1xuICByZXR1cm4gY29uZmlnLnByZWRpY2F0ZSB8fCBjb25maWcuYWN0aW9uc1doaXRlbGlzdCB8fCBjb25maWcuYWN0aW9uc0JsYWNrbGlzdDtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBmdWxsIGZpbHRlcmVkIGxpZnRlZCBzdGF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyTGlmdGVkU3RhdGUoXG4gIGxpZnRlZFN0YXRlOiBMaWZ0ZWRTdGF0ZSxcbiAgcHJlZGljYXRlPzogUHJlZGljYXRlLFxuICB3aGl0ZWxpc3Q/OiBzdHJpbmdbXSxcbiAgYmxhY2tsaXN0Pzogc3RyaW5nW11cbik6IExpZnRlZFN0YXRlIHtcbiAgY29uc3QgZmlsdGVyZWRTdGFnZWRBY3Rpb25JZHM6IG51bWJlcltdID0gW107XG4gIGNvbnN0IGZpbHRlcmVkQWN0aW9uc0J5SWQ6IExpZnRlZEFjdGlvbnMgPSB7fTtcbiAgY29uc3QgZmlsdGVyZWRDb21wdXRlZFN0YXRlczogQ29tcHV0ZWRTdGF0ZVtdID0gW107XG4gIGxpZnRlZFN0YXRlLnN0YWdlZEFjdGlvbklkcy5mb3JFYWNoKChpZCwgaWR4KSA9PiB7XG4gICAgY29uc3QgbGlmdGVkQWN0aW9uID0gbGlmdGVkU3RhdGUuYWN0aW9uc0J5SWRbaWRdO1xuICAgIGlmICghbGlmdGVkQWN0aW9uKSByZXR1cm47XG4gICAgaWYgKFxuICAgICAgaWR4ICYmXG4gICAgICBpc0FjdGlvbkZpbHRlcmVkKFxuICAgICAgICBsaWZ0ZWRTdGF0ZS5jb21wdXRlZFN0YXRlc1tpZHhdLFxuICAgICAgICBsaWZ0ZWRBY3Rpb24sXG4gICAgICAgIHByZWRpY2F0ZSxcbiAgICAgICAgd2hpdGVsaXN0LFxuICAgICAgICBibGFja2xpc3RcbiAgICAgIClcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZmlsdGVyZWRBY3Rpb25zQnlJZFtpZF0gPSBsaWZ0ZWRBY3Rpb247XG4gICAgZmlsdGVyZWRTdGFnZWRBY3Rpb25JZHMucHVzaChpZCk7XG4gICAgZmlsdGVyZWRDb21wdXRlZFN0YXRlcy5wdXNoKGxpZnRlZFN0YXRlLmNvbXB1dGVkU3RhdGVzW2lkeF0pO1xuICB9KTtcbiAgcmV0dXJuIHtcbiAgICAuLi5saWZ0ZWRTdGF0ZSxcbiAgICBzdGFnZWRBY3Rpb25JZHM6IGZpbHRlcmVkU3RhZ2VkQWN0aW9uSWRzLFxuICAgIGFjdGlvbnNCeUlkOiBmaWx0ZXJlZEFjdGlvbnNCeUlkLFxuICAgIGNvbXB1dGVkU3RhdGVzOiBmaWx0ZXJlZENvbXB1dGVkU3RhdGVzLFxuICB9O1xufVxuXG4vKipcbiAqIFJldHVybiB0cnVlIGlzIHRoZSBhY3Rpb24gc2hvdWxkIGJlIGlnbm9yZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQWN0aW9uRmlsdGVyZWQoXG4gIHN0YXRlOiBhbnksXG4gIGFjdGlvbjogTGlmdGVkQWN0aW9uLFxuICBwcmVkaWNhdGU/OiBQcmVkaWNhdGUsXG4gIHdoaXRlbGlzdD86IHN0cmluZ1tdLFxuICBibGFja2xpc3Q/OiBzdHJpbmdbXVxuKSB7XG4gIGNvbnN0IHByZWRpY2F0ZU1hdGNoID0gcHJlZGljYXRlICYmICFwcmVkaWNhdGUoc3RhdGUsIGFjdGlvbi5hY3Rpb24pO1xuICBjb25zdCB3aGl0ZWxpc3RNYXRjaCA9XG4gICAgd2hpdGVsaXN0ICYmICFhY3Rpb24uYWN0aW9uLnR5cGUubWF0Y2god2hpdGVsaXN0LmpvaW4oJ3wnKSk7XG4gIGNvbnN0IGJsYWNrbGlzdE1hdGNoID1cbiAgICBibGFja2xpc3QgJiYgYWN0aW9uLmFjdGlvbi50eXBlLm1hdGNoKGJsYWNrbGlzdC5qb2luKCd8JykpO1xuICByZXR1cm4gcHJlZGljYXRlTWF0Y2ggfHwgd2hpdGVsaXN0TWF0Y2ggfHwgYmxhY2tsaXN0TWF0Y2g7XG59XG4iXX0=