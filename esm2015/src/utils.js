/**
 * @fileoverview added by tsickle
 * Generated from: src/utils.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
    (item) => second.indexOf(item) < 0));
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
    return Object.assign(Object.assign({}, action), { action: actionSanitizer(action.action, actionIdx) });
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
    return Object.assign(Object.assign({}, liftedState), { stagedActionIds: filteredStagedActionIds, actionsById: filteredActionsById, computedStates: filteredComputedStates });
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
    const safelistMatch = safelist &&
        !action.action.type.match(safelist.map((/**
         * @param {?} s
         * @return {?}
         */
        (s) => escapeRegExp(s))).join('|'));
    /** @type {?} */
    const blocklistMatch = blockedlist &&
        action.action.type.match(blockedlist.map((/**
         * @param {?} s
         * @return {?}
         */
        (s) => escapeRegExp(s))).join('|'));
    return predicateMatch || safelistMatch || blocklistMatch;
}
/**
 * Return string with escaped RegExp special characters
 * https://stackoverflow.com/a/6969486/1337347
 * @param {?} s
 * @return {?}
 */
function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vLi4vbW9kdWxlcy9zdG9yZS1kZXZ0b29scy8iLCJzb3VyY2VzIjpbInNyYy91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUVBLE9BQU8sS0FBSyxPQUFPLE1BQU0sV0FBVyxDQUFDOzs7Ozs7QUFjckMsTUFBTSxVQUFVLFVBQVUsQ0FBQyxLQUFZLEVBQUUsTUFBYTtJQUNwRCxPQUFPLEtBQUssQ0FBQyxNQUFNOzs7O0lBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUM7QUFDMUQsQ0FBQzs7Ozs7O0FBS0QsTUFBTSxVQUFVLFdBQVcsQ0FBQyxXQUF3QjtVQUM1QyxFQUFFLGNBQWMsRUFBRSxpQkFBaUIsRUFBRSxHQUFHLFdBQVc7SUFFekQsNENBQTRDO0lBQzVDLDZGQUE2RjtJQUM3RixnREFBZ0Q7SUFDaEQsaUhBQWlIO0lBQ2pILElBQUksaUJBQWlCLElBQUksY0FBYyxDQUFDLE1BQU0sRUFBRTtjQUN4QyxFQUFFLEtBQUssRUFBRSxHQUFHLGNBQWMsQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUMzRCxPQUFPLEtBQUssQ0FBQztLQUNkO1VBRUssRUFBRSxLQUFLLEVBQUUsR0FBRyxjQUFjLENBQUMsaUJBQWlCLENBQUM7SUFDbkQsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDOzs7OztBQUVELE1BQU0sVUFBVSxZQUFZLENBQUMsV0FBd0I7SUFDbkQsT0FBTyxXQUFXLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDL0QsQ0FBQzs7Ozs7O0FBS0QsTUFBTSxVQUFVLFVBQVUsQ0FBQyxNQUFjO0lBQ3ZDLE9BQU8sSUFBSSxPQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUs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QXNCOztVQUVoQixjQUFjLEdBQUcsU0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDOztVQUM5RCxhQUFhLEdBQ2pCLFFBQVE7UUFDUixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRzs7OztRQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7O1VBQ3JFLGNBQWMsR0FDbEIsV0FBVztRQUNYLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBRzs7OztRQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDN0UsT0FBTyxjQUFjLElBQUksYUFBYSxJQUFJLGNBQWMsQ0FBQztBQUMzRCxDQUFDOzs7Ozs7O0FBTUQsU0FBUyxZQUFZLENBQUMsQ0FBUztJQUM3QixPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDbEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcblxuaW1wb3J0ICogYXMgQWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHtcbiAgQWN0aW9uU2FuaXRpemVyLFxuICBTdGF0ZVNhbml0aXplcixcbiAgUHJlZGljYXRlLFxuICBTdG9yZURldnRvb2xzQ29uZmlnLFxufSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQge1xuICBDb21wdXRlZFN0YXRlLFxuICBMaWZ0ZWRBY3Rpb24sXG4gIExpZnRlZEFjdGlvbnMsXG4gIExpZnRlZFN0YXRlLFxufSBmcm9tICcuL3JlZHVjZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gZGlmZmVyZW5jZShmaXJzdDogYW55W10sIHNlY29uZDogYW55W10pIHtcbiAgcmV0dXJuIGZpcnN0LmZpbHRlcigoaXRlbSkgPT4gc2Vjb25kLmluZGV4T2YoaXRlbSkgPCAwKTtcbn1cblxuLyoqXG4gKiBQcm92aWRlcyBhbiBhcHAncyB2aWV3IGludG8gdGhlIHN0YXRlIG9mIHRoZSBsaWZ0ZWQgc3RvcmUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmxpZnRTdGF0ZShsaWZ0ZWRTdGF0ZTogTGlmdGVkU3RhdGUpIHtcbiAgY29uc3QgeyBjb21wdXRlZFN0YXRlcywgY3VycmVudFN0YXRlSW5kZXggfSA9IGxpZnRlZFN0YXRlO1xuXG4gIC8vIEF0IHN0YXJ0IHVwIE5nUnggZGlzcGF0Y2hlcyBpbml0IGFjdGlvbnMsXG4gIC8vIFdoZW4gdGhlc2UgaW5pdCBhY3Rpb25zIGFyZSBiZWluZyBmaWx0ZXJlZCBvdXQgYnkgdGhlIHByZWRpY2F0ZSBvciBzYWZlL2Jsb2NrIGxpc3Qgb3B0aW9uc1xuICAvLyB3ZSBkb24ndCBoYXZlIGEgY29tcGxldGUgY29tcHV0ZWQgc3RhdGVzIHlldC5cbiAgLy8gQXQgdGhpcyBwb2ludCBpdCBjb3VsZCBoYXBwZW4gdGhhdCB3ZSdyZSBvdXQgb2YgYm91bmRzLCB3aGVuIHRoaXMgaGFwcGVucyB3ZSBmYWxsIGJhY2sgdG8gdGhlIGxhc3Qga25vd24gc3RhdGVcbiAgaWYgKGN1cnJlbnRTdGF0ZUluZGV4ID49IGNvbXB1dGVkU3RhdGVzLmxlbmd0aCkge1xuICAgIGNvbnN0IHsgc3RhdGUgfSA9IGNvbXB1dGVkU3RhdGVzW2NvbXB1dGVkU3RhdGVzLmxlbmd0aCAtIDFdO1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGNvbnN0IHsgc3RhdGUgfSA9IGNvbXB1dGVkU3RhdGVzW2N1cnJlbnRTdGF0ZUluZGV4XTtcbiAgcmV0dXJuIHN0YXRlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5saWZ0QWN0aW9uKGxpZnRlZFN0YXRlOiBMaWZ0ZWRTdGF0ZSk6IExpZnRlZEFjdGlvbiB7XG4gIHJldHVybiBsaWZ0ZWRTdGF0ZS5hY3Rpb25zQnlJZFtsaWZ0ZWRTdGF0ZS5uZXh0QWN0aW9uSWQgLSAxXTtcbn1cblxuLyoqXG4gKiBMaWZ0cyBhbiBhcHAncyBhY3Rpb24gaW50byBhbiBhY3Rpb24gb24gdGhlIGxpZnRlZCBzdG9yZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxpZnRBY3Rpb24oYWN0aW9uOiBBY3Rpb24pIHtcbiAgcmV0dXJuIG5ldyBBY3Rpb25zLlBlcmZvcm1BY3Rpb24oYWN0aW9uLCArRGF0ZS5ub3coKSk7XG59XG5cbi8qKlxuICogU2FuaXRpemVzIGdpdmVuIGFjdGlvbnMgd2l0aCBnaXZlbiBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplQWN0aW9ucyhcbiAgYWN0aW9uU2FuaXRpemVyOiBBY3Rpb25TYW5pdGl6ZXIsXG4gIGFjdGlvbnM6IExpZnRlZEFjdGlvbnNcbik6IExpZnRlZEFjdGlvbnMge1xuICByZXR1cm4gT2JqZWN0LmtleXMoYWN0aW9ucykucmVkdWNlKChzYW5pdGl6ZWRBY3Rpb25zLCBhY3Rpb25JZHgpID0+IHtcbiAgICBjb25zdCBpZHggPSBOdW1iZXIoYWN0aW9uSWR4KTtcbiAgICBzYW5pdGl6ZWRBY3Rpb25zW2lkeF0gPSBzYW5pdGl6ZUFjdGlvbihhY3Rpb25TYW5pdGl6ZXIsIGFjdGlvbnNbaWR4XSwgaWR4KTtcbiAgICByZXR1cm4gc2FuaXRpemVkQWN0aW9ucztcbiAgfSwgPExpZnRlZEFjdGlvbnM+e30pO1xufVxuXG4vKipcbiAqIFNhbml0aXplcyBnaXZlbiBhY3Rpb24gd2l0aCBnaXZlbiBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplQWN0aW9uKFxuICBhY3Rpb25TYW5pdGl6ZXI6IEFjdGlvblNhbml0aXplcixcbiAgYWN0aW9uOiBMaWZ0ZWRBY3Rpb24sXG4gIGFjdGlvbklkeDogbnVtYmVyXG4pOiBMaWZ0ZWRBY3Rpb24ge1xuICByZXR1cm4ge1xuICAgIC4uLmFjdGlvbixcbiAgICBhY3Rpb246IGFjdGlvblNhbml0aXplcihhY3Rpb24uYWN0aW9uLCBhY3Rpb25JZHgpLFxuICB9O1xufVxuXG4vKipcbiAqIFNhbml0aXplcyBnaXZlbiBzdGF0ZXMgd2l0aCBnaXZlbiBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplU3RhdGVzKFxuICBzdGF0ZVNhbml0aXplcjogU3RhdGVTYW5pdGl6ZXIsXG4gIHN0YXRlczogQ29tcHV0ZWRTdGF0ZVtdXG4pOiBDb21wdXRlZFN0YXRlW10ge1xuICByZXR1cm4gc3RhdGVzLm1hcCgoY29tcHV0ZWRTdGF0ZSwgaWR4KSA9PiAoe1xuICAgIHN0YXRlOiBzYW5pdGl6ZVN0YXRlKHN0YXRlU2FuaXRpemVyLCBjb21wdXRlZFN0YXRlLnN0YXRlLCBpZHgpLFxuICAgIGVycm9yOiBjb21wdXRlZFN0YXRlLmVycm9yLFxuICB9KSk7XG59XG5cbi8qKlxuICogU2FuaXRpemVzIGdpdmVuIHN0YXRlIHdpdGggZ2l2ZW4gZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZVN0YXRlKFxuICBzdGF0ZVNhbml0aXplcjogU3RhdGVTYW5pdGl6ZXIsXG4gIHN0YXRlOiBhbnksXG4gIHN0YXRlSWR4OiBudW1iZXJcbikge1xuICByZXR1cm4gc3RhdGVTYW5pdGl6ZXIoc3RhdGUsIHN0YXRlSWR4KTtcbn1cblxuLyoqXG4gKiBSZWFkIHRoZSBjb25maWcgYW5kIHRlbGwgaWYgYWN0aW9ucyBzaG91bGQgYmUgZmlsdGVyZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNob3VsZEZpbHRlckFjdGlvbnMoY29uZmlnOiBTdG9yZURldnRvb2xzQ29uZmlnKSB7XG4gIHJldHVybiBjb25maWcucHJlZGljYXRlIHx8IGNvbmZpZy5hY3Rpb25zU2FmZWxpc3QgfHwgY29uZmlnLmFjdGlvbnNCbG9ja2xpc3Q7XG59XG5cbi8qKlxuICogUmV0dXJuIGEgZnVsbCBmaWx0ZXJlZCBsaWZ0ZWQgc3RhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckxpZnRlZFN0YXRlKFxuICBsaWZ0ZWRTdGF0ZTogTGlmdGVkU3RhdGUsXG4gIHByZWRpY2F0ZT86IFByZWRpY2F0ZSxcbiAgc2FmZWxpc3Q/OiBzdHJpbmdbXSxcbiAgYmxvY2tsaXN0Pzogc3RyaW5nW11cbik6IExpZnRlZFN0YXRlIHtcbiAgY29uc3QgZmlsdGVyZWRTdGFnZWRBY3Rpb25JZHM6IG51bWJlcltdID0gW107XG4gIGNvbnN0IGZpbHRlcmVkQWN0aW9uc0J5SWQ6IExpZnRlZEFjdGlvbnMgPSB7fTtcbiAgY29uc3QgZmlsdGVyZWRDb21wdXRlZFN0YXRlczogQ29tcHV0ZWRTdGF0ZVtdID0gW107XG4gIGxpZnRlZFN0YXRlLnN0YWdlZEFjdGlvbklkcy5mb3JFYWNoKChpZCwgaWR4KSA9PiB7XG4gICAgY29uc3QgbGlmdGVkQWN0aW9uID0gbGlmdGVkU3RhdGUuYWN0aW9uc0J5SWRbaWRdO1xuICAgIGlmICghbGlmdGVkQWN0aW9uKSByZXR1cm47XG4gICAgaWYgKFxuICAgICAgaWR4ICYmXG4gICAgICBpc0FjdGlvbkZpbHRlcmVkKFxuICAgICAgICBsaWZ0ZWRTdGF0ZS5jb21wdXRlZFN0YXRlc1tpZHhdLFxuICAgICAgICBsaWZ0ZWRBY3Rpb24sXG4gICAgICAgIHByZWRpY2F0ZSxcbiAgICAgICAgc2FmZWxpc3QsXG4gICAgICAgIGJsb2NrbGlzdFxuICAgICAgKVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmaWx0ZXJlZEFjdGlvbnNCeUlkW2lkXSA9IGxpZnRlZEFjdGlvbjtcbiAgICBmaWx0ZXJlZFN0YWdlZEFjdGlvbklkcy5wdXNoKGlkKTtcbiAgICBmaWx0ZXJlZENvbXB1dGVkU3RhdGVzLnB1c2gobGlmdGVkU3RhdGUuY29tcHV0ZWRTdGF0ZXNbaWR4XSk7XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIC4uLmxpZnRlZFN0YXRlLFxuICAgIHN0YWdlZEFjdGlvbklkczogZmlsdGVyZWRTdGFnZWRBY3Rpb25JZHMsXG4gICAgYWN0aW9uc0J5SWQ6IGZpbHRlcmVkQWN0aW9uc0J5SWQsXG4gICAgY29tcHV0ZWRTdGF0ZXM6IGZpbHRlcmVkQ29tcHV0ZWRTdGF0ZXMsXG4gIH07XG59XG5cbi8qKlxuICogUmV0dXJuIHRydWUgaXMgdGhlIGFjdGlvbiBzaG91bGQgYmUgaWdub3JlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNBY3Rpb25GaWx0ZXJlZChcbiAgc3RhdGU6IGFueSxcbiAgYWN0aW9uOiBMaWZ0ZWRBY3Rpb24sXG4gIHByZWRpY2F0ZT86IFByZWRpY2F0ZSxcbiAgc2FmZWxpc3Q/OiBzdHJpbmdbXSxcbiAgYmxvY2tlZGxpc3Q/OiBzdHJpbmdbXVxuKSB7XG4gIGNvbnN0IHByZWRpY2F0ZU1hdGNoID0gcHJlZGljYXRlICYmICFwcmVkaWNhdGUoc3RhdGUsIGFjdGlvbi5hY3Rpb24pO1xuICBjb25zdCBzYWZlbGlzdE1hdGNoID1cbiAgICBzYWZlbGlzdCAmJlxuICAgICFhY3Rpb24uYWN0aW9uLnR5cGUubWF0Y2goc2FmZWxpc3QubWFwKChzKSA9PiBlc2NhcGVSZWdFeHAocykpLmpvaW4oJ3wnKSk7XG4gIGNvbnN0IGJsb2NrbGlzdE1hdGNoID1cbiAgICBibG9ja2VkbGlzdCAmJlxuICAgIGFjdGlvbi5hY3Rpb24udHlwZS5tYXRjaChibG9ja2VkbGlzdC5tYXAoKHMpID0+IGVzY2FwZVJlZ0V4cChzKSkuam9pbignfCcpKTtcbiAgcmV0dXJuIHByZWRpY2F0ZU1hdGNoIHx8IHNhZmVsaXN0TWF0Y2ggfHwgYmxvY2tsaXN0TWF0Y2g7XG59XG5cbi8qKlxuICogUmV0dXJuIHN0cmluZyB3aXRoIGVzY2FwZWQgUmVnRXhwIHNwZWNpYWwgY2hhcmFjdGVyc1xuICogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzY5Njk0ODYvMTMzNzM0N1xuICovXG5mdW5jdGlvbiBlc2NhcGVSZWdFeHAoczogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHMucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csICdcXFxcJCYnKTtcbn1cbiJdfQ==