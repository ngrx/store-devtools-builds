/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
export const PERFORM_ACTION = 'PERFORM_ACTION';
/** @type {?} */
export const REFRESH = 'REFRESH';
/** @type {?} */
export const RESET = 'RESET';
/** @type {?} */
export const ROLLBACK = 'ROLLBACK';
/** @type {?} */
export const COMMIT = 'COMMIT';
/** @type {?} */
export const SWEEP = 'SWEEP';
/** @type {?} */
export const TOGGLE_ACTION = 'TOGGLE_ACTION';
/** @type {?} */
export const SET_ACTIONS_ACTIVE = 'SET_ACTIONS_ACTIVE';
/** @type {?} */
export const JUMP_TO_STATE = 'JUMP_TO_STATE';
/** @type {?} */
export const JUMP_TO_ACTION = 'JUMP_TO_ACTION';
/** @type {?} */
export const IMPORT_STATE = 'IMPORT_STATE';
/** @type {?} */
export const LOCK_CHANGES = 'LOCK_CHANGES';
/** @type {?} */
export const PAUSE_RECORDING = 'PAUSE_RECORDING';
export class PerformAction {
    /**
     * @param {?} action
     * @param {?} timestamp
     */
    constructor(action, timestamp) {
        this.action = action;
        this.timestamp = timestamp;
        this.type = PERFORM_ACTION;
        if (typeof action.type === 'undefined') {
            throw new Error('Actions may not have an undefined "type" property. ' +
                'Have you misspelled a constant?');
        }
    }
}
if (false) {
    /** @type {?} */
    PerformAction.prototype.type;
    /** @type {?} */
    PerformAction.prototype.action;
    /** @type {?} */
    PerformAction.prototype.timestamp;
}
export class Refresh {
    constructor() {
        this.type = REFRESH;
    }
}
if (false) {
    /** @type {?} */
    Refresh.prototype.type;
}
export class Reset {
    /**
     * @param {?} timestamp
     */
    constructor(timestamp) {
        this.timestamp = timestamp;
        this.type = RESET;
    }
}
if (false) {
    /** @type {?} */
    Reset.prototype.type;
    /** @type {?} */
    Reset.prototype.timestamp;
}
export class Rollback {
    /**
     * @param {?} timestamp
     */
    constructor(timestamp) {
        this.timestamp = timestamp;
        this.type = ROLLBACK;
    }
}
if (false) {
    /** @type {?} */
    Rollback.prototype.type;
    /** @type {?} */
    Rollback.prototype.timestamp;
}
export class Commit {
    /**
     * @param {?} timestamp
     */
    constructor(timestamp) {
        this.timestamp = timestamp;
        this.type = COMMIT;
    }
}
if (false) {
    /** @type {?} */
    Commit.prototype.type;
    /** @type {?} */
    Commit.prototype.timestamp;
}
export class Sweep {
    constructor() {
        this.type = SWEEP;
    }
}
if (false) {
    /** @type {?} */
    Sweep.prototype.type;
}
export class ToggleAction {
    /**
     * @param {?} id
     */
    constructor(id) {
        this.id = id;
        this.type = TOGGLE_ACTION;
    }
}
if (false) {
    /** @type {?} */
    ToggleAction.prototype.type;
    /** @type {?} */
    ToggleAction.prototype.id;
}
export class SetActionsActive {
    /**
     * @param {?} start
     * @param {?} end
     * @param {?=} active
     */
    constructor(start, end, active = true) {
        this.start = start;
        this.end = end;
        this.active = active;
        this.type = SET_ACTIONS_ACTIVE;
    }
}
if (false) {
    /** @type {?} */
    SetActionsActive.prototype.type;
    /** @type {?} */
    SetActionsActive.prototype.start;
    /** @type {?} */
    SetActionsActive.prototype.end;
    /** @type {?} */
    SetActionsActive.prototype.active;
}
export class JumpToState {
    /**
     * @param {?} index
     */
    constructor(index) {
        this.index = index;
        this.type = JUMP_TO_STATE;
    }
}
if (false) {
    /** @type {?} */
    JumpToState.prototype.type;
    /** @type {?} */
    JumpToState.prototype.index;
}
export class JumpToAction {
    /**
     * @param {?} actionId
     */
    constructor(actionId) {
        this.actionId = actionId;
        this.type = JUMP_TO_ACTION;
    }
}
if (false) {
    /** @type {?} */
    JumpToAction.prototype.type;
    /** @type {?} */
    JumpToAction.prototype.actionId;
}
export class ImportState {
    /**
     * @param {?} nextLiftedState
     */
    constructor(nextLiftedState) {
        this.nextLiftedState = nextLiftedState;
        this.type = IMPORT_STATE;
    }
}
if (false) {
    /** @type {?} */
    ImportState.prototype.type;
    /** @type {?} */
    ImportState.prototype.nextLiftedState;
}
export class LockChanges {
    /**
     * @param {?} status
     */
    constructor(status) {
        this.status = status;
        this.type = LOCK_CHANGES;
    }
}
if (false) {
    /** @type {?} */
    LockChanges.prototype.type;
    /** @type {?} */
    LockChanges.prototype.status;
}
export class PauseRecording {
    /**
     * @param {?} status
     */
    constructor(status) {
        this.status = status;
        this.type = PAUSE_RECORDING;
    }
}
if (false) {
    /** @type {?} */
    PauseRecording.prototype.type;
    /** @type {?} */
    PauseRecording.prototype.status;
}
/** @typedef {?} */
var All;
export { All };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvc3RvcmUtZGV2dG9vbHMvc3JjL2FjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSxhQUFhLGNBQWMsR0FBRyxnQkFBZ0IsQ0FBQzs7QUFDL0MsYUFBYSxPQUFPLEdBQUcsU0FBUyxDQUFDOztBQUNqQyxhQUFhLEtBQUssR0FBRyxPQUFPLENBQUM7O0FBQzdCLGFBQWEsUUFBUSxHQUFHLFVBQVUsQ0FBQzs7QUFDbkMsYUFBYSxNQUFNLEdBQUcsUUFBUSxDQUFDOztBQUMvQixhQUFhLEtBQUssR0FBRyxPQUFPLENBQUM7O0FBQzdCLGFBQWEsYUFBYSxHQUFHLGVBQWUsQ0FBQzs7QUFDN0MsYUFBYSxrQkFBa0IsR0FBRyxvQkFBb0IsQ0FBQzs7QUFDdkQsYUFBYSxhQUFhLEdBQUcsZUFBZSxDQUFDOztBQUM3QyxhQUFhLGNBQWMsR0FBRyxnQkFBZ0IsQ0FBQzs7QUFDL0MsYUFBYSxZQUFZLEdBQUcsY0FBYyxDQUFDOztBQUMzQyxhQUFhLFlBQVksR0FBRyxjQUFjLENBQUM7O0FBQzNDLGFBQWEsZUFBZSxHQUFHLGlCQUFpQixDQUFDO0FBRWpELE1BQU07Ozs7O0lBR0osWUFBbUIsTUFBYyxFQUFTLFNBQWlCO1FBQXhDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBUyxjQUFTLEdBQVQsU0FBUyxDQUFRO29CQUYzQyxjQUFjO1FBRzVCLElBQUksT0FBTyxNQUFNLENBQUMsSUFBSSxLQUFLLFdBQVcsRUFBRTtZQUN0QyxNQUFNLElBQUksS0FBSyxDQUNiLHFEQUFxRDtnQkFDbkQsaUNBQWlDLENBQ3BDLENBQUM7U0FDSDtLQUNGO0NBQ0Y7Ozs7Ozs7OztBQUVELE1BQU07O29CQUNZLE9BQU87O0NBQ3hCOzs7OztBQUVELE1BQU07Ozs7SUFHSixZQUFtQixTQUFpQjtRQUFqQixjQUFTLEdBQVQsU0FBUyxDQUFRO29CQUZwQixLQUFLO0tBRW1CO0NBQ3pDOzs7Ozs7O0FBRUQsTUFBTTs7OztJQUdKLFlBQW1CLFNBQWlCO1FBQWpCLGNBQVMsR0FBVCxTQUFTLENBQVE7b0JBRnBCLFFBQVE7S0FFZ0I7Q0FDekM7Ozs7Ozs7QUFFRCxNQUFNOzs7O0lBR0osWUFBbUIsU0FBaUI7UUFBakIsY0FBUyxHQUFULFNBQVMsQ0FBUTtvQkFGcEIsTUFBTTtLQUVrQjtDQUN6Qzs7Ozs7OztBQUVELE1BQU07O29CQUNZLEtBQUs7O0NBQ3RCOzs7OztBQUVELE1BQU07Ozs7SUFHSixZQUFtQixFQUFVO1FBQVYsT0FBRSxHQUFGLEVBQUUsQ0FBUTtvQkFGYixhQUFhO0tBRUk7Q0FDbEM7Ozs7Ozs7QUFFRCxNQUFNOzs7Ozs7SUFHSixZQUNTLE9BQ0EsS0FDQSxTQUFrQixJQUFJO1FBRnRCLFVBQUssR0FBTCxLQUFLO1FBQ0wsUUFBRyxHQUFILEdBQUc7UUFDSCxXQUFNLEdBQU4sTUFBTTtvQkFMQyxrQkFBa0I7S0FNOUI7Q0FDTDs7Ozs7Ozs7Ozs7QUFFRCxNQUFNOzs7O0lBR0osWUFBbUIsS0FBYTtRQUFiLFVBQUssR0FBTCxLQUFLLENBQVE7b0JBRmhCLGFBQWE7S0FFTztDQUNyQzs7Ozs7OztBQUVELE1BQU07Ozs7SUFHSixZQUFtQixRQUFnQjtRQUFoQixhQUFRLEdBQVIsUUFBUSxDQUFRO29CQUZuQixjQUFjO0tBRVM7Q0FDeEM7Ozs7Ozs7QUFFRCxNQUFNOzs7O0lBR0osWUFBbUIsZUFBb0I7UUFBcEIsb0JBQWUsR0FBZixlQUFlLENBQUs7b0JBRnZCLFlBQVk7S0FFZTtDQUM1Qzs7Ozs7OztBQUVELE1BQU07Ozs7SUFHSixZQUFtQixNQUFlO1FBQWYsV0FBTSxHQUFOLE1BQU0sQ0FBUztvQkFGbEIsWUFBWTtLQUVVO0NBQ3ZDOzs7Ozs7O0FBRUQsTUFBTTs7OztJQUdKLFlBQW1CLE1BQWU7UUFBZixXQUFNLEdBQU4sTUFBTSxDQUFTO29CQUZsQixlQUFlO0tBRU87Q0FDdkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY3Rpb24gfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5cbmV4cG9ydCBjb25zdCBQRVJGT1JNX0FDVElPTiA9ICdQRVJGT1JNX0FDVElPTic7XG5leHBvcnQgY29uc3QgUkVGUkVTSCA9ICdSRUZSRVNIJztcbmV4cG9ydCBjb25zdCBSRVNFVCA9ICdSRVNFVCc7XG5leHBvcnQgY29uc3QgUk9MTEJBQ0sgPSAnUk9MTEJBQ0snO1xuZXhwb3J0IGNvbnN0IENPTU1JVCA9ICdDT01NSVQnO1xuZXhwb3J0IGNvbnN0IFNXRUVQID0gJ1NXRUVQJztcbmV4cG9ydCBjb25zdCBUT0dHTEVfQUNUSU9OID0gJ1RPR0dMRV9BQ1RJT04nO1xuZXhwb3J0IGNvbnN0IFNFVF9BQ1RJT05TX0FDVElWRSA9ICdTRVRfQUNUSU9OU19BQ1RJVkUnO1xuZXhwb3J0IGNvbnN0IEpVTVBfVE9fU1RBVEUgPSAnSlVNUF9UT19TVEFURSc7XG5leHBvcnQgY29uc3QgSlVNUF9UT19BQ1RJT04gPSAnSlVNUF9UT19BQ1RJT04nO1xuZXhwb3J0IGNvbnN0IElNUE9SVF9TVEFURSA9ICdJTVBPUlRfU1RBVEUnO1xuZXhwb3J0IGNvbnN0IExPQ0tfQ0hBTkdFUyA9ICdMT0NLX0NIQU5HRVMnO1xuZXhwb3J0IGNvbnN0IFBBVVNFX1JFQ09SRElORyA9ICdQQVVTRV9SRUNPUkRJTkcnO1xuXG5leHBvcnQgY2xhc3MgUGVyZm9ybUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBQRVJGT1JNX0FDVElPTjtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgYWN0aW9uOiBBY3Rpb24sIHB1YmxpYyB0aW1lc3RhbXA6IG51bWJlcikge1xuICAgIGlmICh0eXBlb2YgYWN0aW9uLnR5cGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdBY3Rpb25zIG1heSBub3QgaGF2ZSBhbiB1bmRlZmluZWQgXCJ0eXBlXCIgcHJvcGVydHkuICcgK1xuICAgICAgICAgICdIYXZlIHlvdSBtaXNzcGVsbGVkIGEgY29uc3RhbnQ/J1xuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJlZnJlc2ggaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gUkVGUkVTSDtcbn1cblxuZXhwb3J0IGNsYXNzIFJlc2V0IGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IFJFU0VUO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0aW1lc3RhbXA6IG51bWJlcikge31cbn1cblxuZXhwb3J0IGNsYXNzIFJvbGxiYWNrIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IFJPTExCQUNLO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0aW1lc3RhbXA6IG51bWJlcikge31cbn1cblxuZXhwb3J0IGNsYXNzIENvbW1pdCBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBDT01NSVQ7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHRpbWVzdGFtcDogbnVtYmVyKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgU3dlZXAgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gU1dFRVA7XG59XG5cbmV4cG9ydCBjbGFzcyBUb2dnbGVBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gVE9HR0xFX0FDVElPTjtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgaWQ6IG51bWJlcikge31cbn1cblxuZXhwb3J0IGNsYXNzIFNldEFjdGlvbnNBY3RpdmUgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gU0VUX0FDVElPTlNfQUNUSVZFO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBzdGFydDogbnVtYmVyLFxuICAgIHB1YmxpYyBlbmQ6IG51bWJlcixcbiAgICBwdWJsaWMgYWN0aXZlOiBib29sZWFuID0gdHJ1ZVxuICApIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBKdW1wVG9TdGF0ZSBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBKVU1QX1RPX1NUQVRFO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBpbmRleDogbnVtYmVyKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgSnVtcFRvQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IEpVTVBfVE9fQUNUSU9OO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBhY3Rpb25JZDogbnVtYmVyKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgSW1wb3J0U3RhdGUgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gSU1QT1JUX1NUQVRFO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBuZXh0TGlmdGVkU3RhdGU6IGFueSkge31cbn1cblxuZXhwb3J0IGNsYXNzIExvY2tDaGFuZ2VzIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IExPQ0tfQ0hBTkdFUztcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RhdHVzOiBib29sZWFuKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgUGF1c2VSZWNvcmRpbmcgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gUEFVU0VfUkVDT1JESU5HO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzdGF0dXM6IGJvb2xlYW4pIHt9XG59XG5cbmV4cG9ydCB0eXBlIEFsbCA9XG4gIHwgUGVyZm9ybUFjdGlvblxuICB8IFJlZnJlc2hcbiAgfCBSZXNldFxuICB8IFJvbGxiYWNrXG4gIHwgQ29tbWl0XG4gIHwgU3dlZXBcbiAgfCBUb2dnbGVBY3Rpb25cbiAgfCBTZXRBY3Rpb25zQWN0aXZlXG4gIHwgSnVtcFRvU3RhdGVcbiAgfCBKdW1wVG9BY3Rpb25cbiAgfCBJbXBvcnRTdGF0ZVxuICB8IExvY2tDaGFuZ2VzXG4gIHwgUGF1c2VSZWNvcmRpbmc7XG4iXX0=