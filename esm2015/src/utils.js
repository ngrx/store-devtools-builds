/**
 * @fileoverview added by tsickle
 * Generated from: modules/store-devtools/src/utils.ts
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
        s => escapeRegExp(s))).join('|'));
    /** @type {?} */
    const blocklistMatch = blockedlist &&
        action.action.type.match(blockedlist.map((/**
         * @param {?} s
         * @return {?}
         */
        s => escapeRegExp(s))).join('|'));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3N0b3JlLWRldnRvb2xzL3NyYy91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUVBLE9BQU8sS0FBSyxPQUFPLE1BQU0sV0FBVyxDQUFDOzs7Ozs7QUFjckMsTUFBTSxVQUFVLFVBQVUsQ0FBQyxLQUFZLEVBQUUsTUFBYTtJQUNwRCxPQUFPLEtBQUssQ0FBQyxNQUFNOzs7O0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDO0FBQ3hELENBQUM7Ozs7OztBQUtELE1BQU0sVUFBVSxXQUFXLENBQUMsV0FBd0I7VUFDNUMsRUFBRSxjQUFjLEVBQUUsaUJBQWlCLEVBQUUsR0FBRyxXQUFXO0lBRXpELDRDQUE0QztJQUM1Qyw2RkFBNkY7SUFDN0YsZ0RBQWdEO0lBQ2hELGlIQUFpSDtJQUNqSCxJQUFJLGlCQUFpQixJQUFJLGNBQWMsQ0FBQyxNQUFNLEVBQUU7Y0FDeEMsRUFBRSxLQUFLLEVBQUUsR0FBRyxjQUFjLENBQUMsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDM0QsT0FBTyxLQUFLLENBQUM7S0FDZDtVQUVLLEVBQUUsS0FBSyxFQUFFLEdBQUcsY0FBYyxDQUFDLGlCQUFpQixDQUFDO0lBQ25ELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQzs7Ozs7QUFFRCxNQUFNLFVBQVUsWUFBWSxDQUFDLFdBQXdCO0lBQ25ELE9BQU8sV0FBVyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQy9ELENBQUM7Ozs7OztBQUtELE1BQU0sVUFBVSxVQUFVLENBQUMsTUFBYztJQUN2QyxPQUFPLElBQUksT0FBTyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUN4RCxDQUFDOzs7Ozs7O0FBS0QsTUFBTSxVQUFVLGVBQWUsQ0FDN0IsZUFBZ0MsRUFDaEMsT0FBc0I7SUFFdEIsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU07Ozs7O0lBQ2hDLENBQUMsZ0JBQWdCLEVBQUUsU0FBUyxFQUFFLEVBQUU7O2NBQ3hCLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQzdCLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxHQUFHLGNBQWMsQ0FDcEMsZUFBZSxFQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFDWixHQUFHLENBQ0osQ0FBQztRQUNGLE9BQU8sZ0JBQWdCLENBQUM7SUFDMUIsQ0FBQyxHQUNELG1CQUFlLEVBQUUsRUFBQSxDQUNsQixDQUFDO0FBQ0osQ0FBQzs7Ozs7Ozs7QUFLRCxNQUFNLFVBQVUsY0FBYyxDQUM1QixlQUFnQyxFQUNoQyxNQUFvQixFQUNwQixTQUFpQjtJQUVqQix1Q0FDSyxNQUFNLEtBQ1QsTUFBTSxFQUFFLGVBQWUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxJQUNqRDtBQUNKLENBQUM7Ozs7Ozs7QUFLRCxNQUFNLFVBQVUsY0FBYyxDQUM1QixjQUE4QixFQUM5QixNQUF1QjtJQUV2QixPQUFPLE1BQU0sQ0FBQyxHQUFHOzs7OztJQUFDLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN6QyxLQUFLLEVBQUUsYUFBYSxDQUFDLGNBQWMsRUFBRSxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQztRQUM5RCxLQUFLLEVBQUUsYUFBYSxDQUFDLEtBQUs7S0FDM0IsQ0FBQyxFQUFDLENBQUM7QUFDTixDQUFDOzs7Ozs7OztBQUtELE1BQU0sVUFBVSxhQUFhLENBQzNCLGNBQThCLEVBQzlCLEtBQVUsRUFDVixRQUFnQjtJQUVoQixPQUFPLGNBQWMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDekMsQ0FBQzs7Ozs7O0FBS0QsTUFBTSxVQUFVLG1CQUFtQixDQUFDLE1BQTJCO0lBQzdELE9BQU8sTUFBTSxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQUMsZUFBZSxJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztBQUMvRSxDQUFDOzs7Ozs7Ozs7QUFLRCxNQUFNLFVBQVUsaUJBQWlCLENBQy9CLFdBQXdCLEVBQ3hCLFNBQXFCLEVBQ3JCLFFBQW1CLEVBQ25CLFNBQW9COztVQUVkLHVCQUF1QixHQUFhLEVBQUU7O1VBQ3RDLG1CQUFtQixHQUFrQixFQUFFOztVQUN2QyxzQkFBc0IsR0FBb0IsRUFBRTtJQUNsRCxXQUFXLENBQUMsZUFBZSxDQUFDLE9BQU87Ozs7O0lBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUU7O2NBQ3hDLFlBQVksR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQztRQUNoRCxJQUFJLENBQUMsWUFBWTtZQUFFLE9BQU87UUFDMUIsSUFDRSxHQUFHO1lBQ0gsZ0JBQWdCLENBQ2QsV0FBVyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFDL0IsWUFBWSxFQUNaLFNBQVMsRUFDVCxRQUFRLEVBQ1IsU0FBUyxDQUNWLEVBQ0Q7WUFDQSxPQUFPO1NBQ1I7UUFDRCxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUM7UUFDdkMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDL0QsQ0FBQyxFQUFDLENBQUM7SUFDSCx1Q0FDSyxXQUFXLEtBQ2QsZUFBZSxFQUFFLHVCQUF1QixFQUN4QyxXQUFXLEVBQUUsbUJBQW1CLEVBQ2hDLGNBQWMsRUFBRSxzQkFBc0IsSUFDdEM7QUFDSixDQUFDOzs7Ozs7Ozs7O0FBS0QsTUFBTSxVQUFVLGdCQUFnQixDQUM5QixLQUFVLEVBQ1YsTUFBb0IsRUFDcEIsU0FBcUIsRUFDckIsUUFBbUIsRUFDbkIsV0FBc0I7O1VBRWhCLGNBQWMsR0FBRyxTQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUM7O1VBQzlELGFBQWEsR0FDakIsUUFBUTtRQUNSLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHOzs7O1FBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7O1VBQ25FLGNBQWMsR0FDbEIsV0FBVztRQUNYLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBRzs7OztRQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzNFLE9BQU8sY0FBYyxJQUFJLGFBQWEsSUFBSSxjQUFjLENBQUM7QUFDM0QsQ0FBQzs7Ozs7OztBQU1ELFNBQVMsWUFBWSxDQUFDLENBQVM7SUFDN0IsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2xELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY3Rpb24gfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5cbmltcG9ydCAqIGFzIEFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7XG4gIEFjdGlvblNhbml0aXplcixcbiAgU3RhdGVTYW5pdGl6ZXIsXG4gIFByZWRpY2F0ZSxcbiAgU3RvcmVEZXZ0b29sc0NvbmZpZyxcbn0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHtcbiAgQ29tcHV0ZWRTdGF0ZSxcbiAgTGlmdGVkQWN0aW9uLFxuICBMaWZ0ZWRBY3Rpb25zLFxuICBMaWZ0ZWRTdGF0ZSxcbn0gZnJvbSAnLi9yZWR1Y2VyJztcblxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZlcmVuY2UoZmlyc3Q6IGFueVtdLCBzZWNvbmQ6IGFueVtdKSB7XG4gIHJldHVybiBmaXJzdC5maWx0ZXIoaXRlbSA9PiBzZWNvbmQuaW5kZXhPZihpdGVtKSA8IDApO1xufVxuXG4vKipcbiAqIFByb3ZpZGVzIGFuIGFwcCdzIHZpZXcgaW50byB0aGUgc3RhdGUgb2YgdGhlIGxpZnRlZCBzdG9yZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVubGlmdFN0YXRlKGxpZnRlZFN0YXRlOiBMaWZ0ZWRTdGF0ZSkge1xuICBjb25zdCB7IGNvbXB1dGVkU3RhdGVzLCBjdXJyZW50U3RhdGVJbmRleCB9ID0gbGlmdGVkU3RhdGU7XG5cbiAgLy8gQXQgc3RhcnQgdXAgTmdSeCBkaXNwYXRjaGVzIGluaXQgYWN0aW9ucyxcbiAgLy8gV2hlbiB0aGVzZSBpbml0IGFjdGlvbnMgYXJlIGJlaW5nIGZpbHRlcmVkIG91dCBieSB0aGUgcHJlZGljYXRlIG9yIHNhZmUvYmxvY2sgbGlzdCBvcHRpb25zXG4gIC8vIHdlIGRvbid0IGhhdmUgYSBjb21wbGV0ZSBjb21wdXRlZCBzdGF0ZXMgeWV0LlxuICAvLyBBdCB0aGlzIHBvaW50IGl0IGNvdWxkIGhhcHBlbiB0aGF0IHdlJ3JlIG91dCBvZiBib3VuZHMsIHdoZW4gdGhpcyBoYXBwZW5zIHdlIGZhbGwgYmFjayB0byB0aGUgbGFzdCBrbm93biBzdGF0ZVxuICBpZiAoY3VycmVudFN0YXRlSW5kZXggPj0gY29tcHV0ZWRTdGF0ZXMubGVuZ3RoKSB7XG4gICAgY29uc3QgeyBzdGF0ZSB9ID0gY29tcHV0ZWRTdGF0ZXNbY29tcHV0ZWRTdGF0ZXMubGVuZ3RoIC0gMV07XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgY29uc3QgeyBzdGF0ZSB9ID0gY29tcHV0ZWRTdGF0ZXNbY3VycmVudFN0YXRlSW5kZXhdO1xuICByZXR1cm4gc3RhdGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bmxpZnRBY3Rpb24obGlmdGVkU3RhdGU6IExpZnRlZFN0YXRlKTogTGlmdGVkQWN0aW9uIHtcbiAgcmV0dXJuIGxpZnRlZFN0YXRlLmFjdGlvbnNCeUlkW2xpZnRlZFN0YXRlLm5leHRBY3Rpb25JZCAtIDFdO1xufVxuXG4vKipcbiAqIExpZnRzIGFuIGFwcCdzIGFjdGlvbiBpbnRvIGFuIGFjdGlvbiBvbiB0aGUgbGlmdGVkIHN0b3JlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbGlmdEFjdGlvbihhY3Rpb246IEFjdGlvbikge1xuICByZXR1cm4gbmV3IEFjdGlvbnMuUGVyZm9ybUFjdGlvbihhY3Rpb24sICtEYXRlLm5vdygpKTtcbn1cblxuLyoqXG4gKiBTYW5pdGl6ZXMgZ2l2ZW4gYWN0aW9ucyB3aXRoIGdpdmVuIGZ1bmN0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVBY3Rpb25zKFxuICBhY3Rpb25TYW5pdGl6ZXI6IEFjdGlvblNhbml0aXplcixcbiAgYWN0aW9uczogTGlmdGVkQWN0aW9uc1xuKTogTGlmdGVkQWN0aW9ucyB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhhY3Rpb25zKS5yZWR1Y2UoXG4gICAgKHNhbml0aXplZEFjdGlvbnMsIGFjdGlvbklkeCkgPT4ge1xuICAgICAgY29uc3QgaWR4ID0gTnVtYmVyKGFjdGlvbklkeCk7XG4gICAgICBzYW5pdGl6ZWRBY3Rpb25zW2lkeF0gPSBzYW5pdGl6ZUFjdGlvbihcbiAgICAgICAgYWN0aW9uU2FuaXRpemVyLFxuICAgICAgICBhY3Rpb25zW2lkeF0sXG4gICAgICAgIGlkeFxuICAgICAgKTtcbiAgICAgIHJldHVybiBzYW5pdGl6ZWRBY3Rpb25zO1xuICAgIH0sXG4gICAgPExpZnRlZEFjdGlvbnM+e31cbiAgKTtcbn1cblxuLyoqXG4gKiBTYW5pdGl6ZXMgZ2l2ZW4gYWN0aW9uIHdpdGggZ2l2ZW4gZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZUFjdGlvbihcbiAgYWN0aW9uU2FuaXRpemVyOiBBY3Rpb25TYW5pdGl6ZXIsXG4gIGFjdGlvbjogTGlmdGVkQWN0aW9uLFxuICBhY3Rpb25JZHg6IG51bWJlclxuKTogTGlmdGVkQWN0aW9uIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5hY3Rpb24sXG4gICAgYWN0aW9uOiBhY3Rpb25TYW5pdGl6ZXIoYWN0aW9uLmFjdGlvbiwgYWN0aW9uSWR4KSxcbiAgfTtcbn1cblxuLyoqXG4gKiBTYW5pdGl6ZXMgZ2l2ZW4gc3RhdGVzIHdpdGggZ2l2ZW4gZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZVN0YXRlcyhcbiAgc3RhdGVTYW5pdGl6ZXI6IFN0YXRlU2FuaXRpemVyLFxuICBzdGF0ZXM6IENvbXB1dGVkU3RhdGVbXVxuKTogQ29tcHV0ZWRTdGF0ZVtdIHtcbiAgcmV0dXJuIHN0YXRlcy5tYXAoKGNvbXB1dGVkU3RhdGUsIGlkeCkgPT4gKHtcbiAgICBzdGF0ZTogc2FuaXRpemVTdGF0ZShzdGF0ZVNhbml0aXplciwgY29tcHV0ZWRTdGF0ZS5zdGF0ZSwgaWR4KSxcbiAgICBlcnJvcjogY29tcHV0ZWRTdGF0ZS5lcnJvcixcbiAgfSkpO1xufVxuXG4vKipcbiAqIFNhbml0aXplcyBnaXZlbiBzdGF0ZSB3aXRoIGdpdmVuIGZ1bmN0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVTdGF0ZShcbiAgc3RhdGVTYW5pdGl6ZXI6IFN0YXRlU2FuaXRpemVyLFxuICBzdGF0ZTogYW55LFxuICBzdGF0ZUlkeDogbnVtYmVyXG4pIHtcbiAgcmV0dXJuIHN0YXRlU2FuaXRpemVyKHN0YXRlLCBzdGF0ZUlkeCk7XG59XG5cbi8qKlxuICogUmVhZCB0aGUgY29uZmlnIGFuZCB0ZWxsIGlmIGFjdGlvbnMgc2hvdWxkIGJlIGZpbHRlcmVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzaG91bGRGaWx0ZXJBY3Rpb25zKGNvbmZpZzogU3RvcmVEZXZ0b29sc0NvbmZpZykge1xuICByZXR1cm4gY29uZmlnLnByZWRpY2F0ZSB8fCBjb25maWcuYWN0aW9uc1NhZmVsaXN0IHx8IGNvbmZpZy5hY3Rpb25zQmxvY2tsaXN0O1xufVxuXG4vKipcbiAqIFJldHVybiBhIGZ1bGwgZmlsdGVyZWQgbGlmdGVkIHN0YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJMaWZ0ZWRTdGF0ZShcbiAgbGlmdGVkU3RhdGU6IExpZnRlZFN0YXRlLFxuICBwcmVkaWNhdGU/OiBQcmVkaWNhdGUsXG4gIHNhZmVsaXN0Pzogc3RyaW5nW10sXG4gIGJsb2NrbGlzdD86IHN0cmluZ1tdXG4pOiBMaWZ0ZWRTdGF0ZSB7XG4gIGNvbnN0IGZpbHRlcmVkU3RhZ2VkQWN0aW9uSWRzOiBudW1iZXJbXSA9IFtdO1xuICBjb25zdCBmaWx0ZXJlZEFjdGlvbnNCeUlkOiBMaWZ0ZWRBY3Rpb25zID0ge307XG4gIGNvbnN0IGZpbHRlcmVkQ29tcHV0ZWRTdGF0ZXM6IENvbXB1dGVkU3RhdGVbXSA9IFtdO1xuICBsaWZ0ZWRTdGF0ZS5zdGFnZWRBY3Rpb25JZHMuZm9yRWFjaCgoaWQsIGlkeCkgPT4ge1xuICAgIGNvbnN0IGxpZnRlZEFjdGlvbiA9IGxpZnRlZFN0YXRlLmFjdGlvbnNCeUlkW2lkXTtcbiAgICBpZiAoIWxpZnRlZEFjdGlvbikgcmV0dXJuO1xuICAgIGlmIChcbiAgICAgIGlkeCAmJlxuICAgICAgaXNBY3Rpb25GaWx0ZXJlZChcbiAgICAgICAgbGlmdGVkU3RhdGUuY29tcHV0ZWRTdGF0ZXNbaWR4XSxcbiAgICAgICAgbGlmdGVkQWN0aW9uLFxuICAgICAgICBwcmVkaWNhdGUsXG4gICAgICAgIHNhZmVsaXN0LFxuICAgICAgICBibG9ja2xpc3RcbiAgICAgIClcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZmlsdGVyZWRBY3Rpb25zQnlJZFtpZF0gPSBsaWZ0ZWRBY3Rpb247XG4gICAgZmlsdGVyZWRTdGFnZWRBY3Rpb25JZHMucHVzaChpZCk7XG4gICAgZmlsdGVyZWRDb21wdXRlZFN0YXRlcy5wdXNoKGxpZnRlZFN0YXRlLmNvbXB1dGVkU3RhdGVzW2lkeF0pO1xuICB9KTtcbiAgcmV0dXJuIHtcbiAgICAuLi5saWZ0ZWRTdGF0ZSxcbiAgICBzdGFnZWRBY3Rpb25JZHM6IGZpbHRlcmVkU3RhZ2VkQWN0aW9uSWRzLFxuICAgIGFjdGlvbnNCeUlkOiBmaWx0ZXJlZEFjdGlvbnNCeUlkLFxuICAgIGNvbXB1dGVkU3RhdGVzOiBmaWx0ZXJlZENvbXB1dGVkU3RhdGVzLFxuICB9O1xufVxuXG4vKipcbiAqIFJldHVybiB0cnVlIGlzIHRoZSBhY3Rpb24gc2hvdWxkIGJlIGlnbm9yZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQWN0aW9uRmlsdGVyZWQoXG4gIHN0YXRlOiBhbnksXG4gIGFjdGlvbjogTGlmdGVkQWN0aW9uLFxuICBwcmVkaWNhdGU/OiBQcmVkaWNhdGUsXG4gIHNhZmVsaXN0Pzogc3RyaW5nW10sXG4gIGJsb2NrZWRsaXN0Pzogc3RyaW5nW11cbikge1xuICBjb25zdCBwcmVkaWNhdGVNYXRjaCA9IHByZWRpY2F0ZSAmJiAhcHJlZGljYXRlKHN0YXRlLCBhY3Rpb24uYWN0aW9uKTtcbiAgY29uc3Qgc2FmZWxpc3RNYXRjaCA9XG4gICAgc2FmZWxpc3QgJiZcbiAgICAhYWN0aW9uLmFjdGlvbi50eXBlLm1hdGNoKHNhZmVsaXN0Lm1hcChzID0+IGVzY2FwZVJlZ0V4cChzKSkuam9pbignfCcpKTtcbiAgY29uc3QgYmxvY2tsaXN0TWF0Y2ggPVxuICAgIGJsb2NrZWRsaXN0ICYmXG4gICAgYWN0aW9uLmFjdGlvbi50eXBlLm1hdGNoKGJsb2NrZWRsaXN0Lm1hcChzID0+IGVzY2FwZVJlZ0V4cChzKSkuam9pbignfCcpKTtcbiAgcmV0dXJuIHByZWRpY2F0ZU1hdGNoIHx8IHNhZmVsaXN0TWF0Y2ggfHwgYmxvY2tsaXN0TWF0Y2g7XG59XG5cbi8qKlxuICogUmV0dXJuIHN0cmluZyB3aXRoIGVzY2FwZWQgUmVnRXhwIHNwZWNpYWwgY2hhcmFjdGVyc1xuICogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzY5Njk0ODYvMTMzNzM0N1xuICovXG5mdW5jdGlvbiBlc2NhcGVSZWdFeHAoczogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHMucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csICdcXFxcJCYnKTtcbn1cbiJdfQ==