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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvc3RvcmUtZGV2dG9vbHMvc3JjL2FjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSxhQUFhLGNBQWMsR0FBRyxnQkFBZ0IsQ0FBQzs7QUFDL0MsYUFBYSxPQUFPLEdBQUcsU0FBUyxDQUFDOztBQUNqQyxhQUFhLEtBQUssR0FBRyxPQUFPLENBQUM7O0FBQzdCLGFBQWEsUUFBUSxHQUFHLFVBQVUsQ0FBQzs7QUFDbkMsYUFBYSxNQUFNLEdBQUcsUUFBUSxDQUFDOztBQUMvQixhQUFhLEtBQUssR0FBRyxPQUFPLENBQUM7O0FBQzdCLGFBQWEsYUFBYSxHQUFHLGVBQWUsQ0FBQzs7QUFDN0MsYUFBYSxrQkFBa0IsR0FBRyxvQkFBb0IsQ0FBQzs7QUFDdkQsYUFBYSxhQUFhLEdBQUcsZUFBZSxDQUFDOztBQUM3QyxhQUFhLGNBQWMsR0FBRyxnQkFBZ0IsQ0FBQzs7QUFDL0MsYUFBYSxZQUFZLEdBQUcsY0FBYyxDQUFDOztBQUMzQyxhQUFhLFlBQVksR0FBRyxjQUFjLENBQUM7O0FBQzNDLGFBQWEsZUFBZSxHQUFHLGlCQUFpQixDQUFDO0FBRWpELE1BQU0sT0FBTyxhQUFhOzs7OztJQUd4QixZQUFtQixNQUFjLEVBQVMsU0FBaUI7UUFBeEMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFTLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFGM0QsWUFBZ0IsY0FBYyxDQUFDO1FBRzdCLElBQUksT0FBTyxNQUFNLENBQUMsSUFBSSxLQUFLLFdBQVcsRUFBRTtZQUN0QyxNQUFNLElBQUksS0FBSyxDQUNiLHFEQUFxRDtnQkFDbkQsaUNBQWlDLENBQ3BDLENBQUM7U0FDSDtLQUNGO0NBQ0Y7Ozs7Ozs7OztBQUVELE1BQU0sT0FBTyxPQUFPOztRQUNsQixZQUFnQixPQUFPLENBQUM7O0NBQ3pCOzs7OztBQUVELE1BQU0sT0FBTyxLQUFLOzs7O0lBR2hCLFlBQW1CLFNBQWlCO1FBQWpCLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFGcEMsWUFBZ0IsS0FBSyxDQUFDO0tBRWtCO0NBQ3pDOzs7Ozs7O0FBRUQsTUFBTSxPQUFPLFFBQVE7Ozs7SUFHbkIsWUFBbUIsU0FBaUI7UUFBakIsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUZwQyxZQUFnQixRQUFRLENBQUM7S0FFZTtDQUN6Qzs7Ozs7OztBQUVELE1BQU0sT0FBTyxNQUFNOzs7O0lBR2pCLFlBQW1CLFNBQWlCO1FBQWpCLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFGcEMsWUFBZ0IsTUFBTSxDQUFDO0tBRWlCO0NBQ3pDOzs7Ozs7O0FBRUQsTUFBTSxPQUFPLEtBQUs7O1FBQ2hCLFlBQWdCLEtBQUssQ0FBQzs7Q0FDdkI7Ozs7O0FBRUQsTUFBTSxPQUFPLFlBQVk7Ozs7SUFHdkIsWUFBbUIsRUFBVTtRQUFWLE9BQUUsR0FBRixFQUFFLENBQVE7UUFGN0IsWUFBZ0IsYUFBYSxDQUFDO0tBRUc7Q0FDbEM7Ozs7Ozs7QUFFRCxNQUFNLE9BQU8sZ0JBQWdCOzs7Ozs7SUFHM0IsWUFDUyxPQUNBLEtBQ0EsU0FBa0IsSUFBSTtRQUZ0QixVQUFLLEdBQUwsS0FBSztRQUNMLFFBQUcsR0FBSCxHQUFHO1FBQ0gsV0FBTSxHQUFOLE1BQU07UUFMZixZQUFnQixrQkFBa0IsQ0FBQztLQU0vQjtDQUNMOzs7Ozs7Ozs7OztBQUVELE1BQU0sT0FBTyxXQUFXOzs7O0lBR3RCLFlBQW1CLEtBQWE7UUFBYixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBRmhDLFlBQWdCLGFBQWEsQ0FBQztLQUVNO0NBQ3JDOzs7Ozs7O0FBRUQsTUFBTSxPQUFPLFlBQVk7Ozs7SUFHdkIsWUFBbUIsUUFBZ0I7UUFBaEIsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUZuQyxZQUFnQixjQUFjLENBQUM7S0FFUTtDQUN4Qzs7Ozs7OztBQUVELE1BQU0sT0FBTyxXQUFXOzs7O0lBR3RCLFlBQW1CLGVBQW9CO1FBQXBCLG9CQUFlLEdBQWYsZUFBZSxDQUFLO1FBRnZDLFlBQWdCLFlBQVksQ0FBQztLQUVjO0NBQzVDOzs7Ozs7O0FBRUQsTUFBTSxPQUFPLFdBQVc7Ozs7SUFHdEIsWUFBbUIsTUFBZTtRQUFmLFdBQU0sR0FBTixNQUFNLENBQVM7UUFGbEMsWUFBZ0IsWUFBWSxDQUFDO0tBRVM7Q0FDdkM7Ozs7Ozs7QUFFRCxNQUFNLE9BQU8sY0FBYzs7OztJQUd6QixZQUFtQixNQUFlO1FBQWYsV0FBTSxHQUFOLE1BQU0sQ0FBUztRQUZsQyxZQUFnQixlQUFlLENBQUM7S0FFTTtDQUN2QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcblxuZXhwb3J0IGNvbnN0IFBFUkZPUk1fQUNUSU9OID0gJ1BFUkZPUk1fQUNUSU9OJztcbmV4cG9ydCBjb25zdCBSRUZSRVNIID0gJ1JFRlJFU0gnO1xuZXhwb3J0IGNvbnN0IFJFU0VUID0gJ1JFU0VUJztcbmV4cG9ydCBjb25zdCBST0xMQkFDSyA9ICdST0xMQkFDSyc7XG5leHBvcnQgY29uc3QgQ09NTUlUID0gJ0NPTU1JVCc7XG5leHBvcnQgY29uc3QgU1dFRVAgPSAnU1dFRVAnO1xuZXhwb3J0IGNvbnN0IFRPR0dMRV9BQ1RJT04gPSAnVE9HR0xFX0FDVElPTic7XG5leHBvcnQgY29uc3QgU0VUX0FDVElPTlNfQUNUSVZFID0gJ1NFVF9BQ1RJT05TX0FDVElWRSc7XG5leHBvcnQgY29uc3QgSlVNUF9UT19TVEFURSA9ICdKVU1QX1RPX1NUQVRFJztcbmV4cG9ydCBjb25zdCBKVU1QX1RPX0FDVElPTiA9ICdKVU1QX1RPX0FDVElPTic7XG5leHBvcnQgY29uc3QgSU1QT1JUX1NUQVRFID0gJ0lNUE9SVF9TVEFURSc7XG5leHBvcnQgY29uc3QgTE9DS19DSEFOR0VTID0gJ0xPQ0tfQ0hBTkdFUyc7XG5leHBvcnQgY29uc3QgUEFVU0VfUkVDT1JESU5HID0gJ1BBVVNFX1JFQ09SRElORyc7XG5cbmV4cG9ydCBjbGFzcyBQZXJmb3JtQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IFBFUkZPUk1fQUNUSU9OO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBhY3Rpb246IEFjdGlvbiwgcHVibGljIHRpbWVzdGFtcDogbnVtYmVyKSB7XG4gICAgaWYgKHR5cGVvZiBhY3Rpb24udHlwZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0FjdGlvbnMgbWF5IG5vdCBoYXZlIGFuIHVuZGVmaW5lZCBcInR5cGVcIiBwcm9wZXJ0eS4gJyArXG4gICAgICAgICAgJ0hhdmUgeW91IG1pc3NwZWxsZWQgYSBjb25zdGFudD8nXG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUmVmcmVzaCBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBSRUZSRVNIO1xufVxuXG5leHBvcnQgY2xhc3MgUmVzZXQgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gUkVTRVQ7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHRpbWVzdGFtcDogbnVtYmVyKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgUm9sbGJhY2sgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gUk9MTEJBQ0s7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHRpbWVzdGFtcDogbnVtYmVyKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgQ29tbWl0IGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IENPTU1JVDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgdGltZXN0YW1wOiBudW1iZXIpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBTd2VlcCBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBTV0VFUDtcbn1cblxuZXhwb3J0IGNsYXNzIFRvZ2dsZUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBUT0dHTEVfQUNUSU9OO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBpZDogbnVtYmVyKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgU2V0QWN0aW9uc0FjdGl2ZSBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBTRVRfQUNUSU9OU19BQ1RJVkU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHN0YXJ0OiBudW1iZXIsXG4gICAgcHVibGljIGVuZDogbnVtYmVyLFxuICAgIHB1YmxpYyBhY3RpdmU6IGJvb2xlYW4gPSB0cnVlXG4gICkge31cbn1cblxuZXhwb3J0IGNsYXNzIEp1bXBUb1N0YXRlIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IEpVTVBfVE9fU1RBVEU7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGluZGV4OiBudW1iZXIpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBKdW1wVG9BY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gSlVNUF9UT19BQ1RJT047XG5cbiAgY29uc3RydWN0b3IocHVibGljIGFjdGlvbklkOiBudW1iZXIpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBJbXBvcnRTdGF0ZSBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBJTVBPUlRfU1RBVEU7XG5cbiAgY29uc3RydWN0b3IocHVibGljIG5leHRMaWZ0ZWRTdGF0ZTogYW55KSB7fVxufVxuXG5leHBvcnQgY2xhc3MgTG9ja0NoYW5nZXMgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gTE9DS19DSEFOR0VTO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzdGF0dXM6IGJvb2xlYW4pIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBQYXVzZVJlY29yZGluZyBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBQQVVTRV9SRUNPUkRJTkc7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHN0YXR1czogYm9vbGVhbikge31cbn1cblxuZXhwb3J0IHR5cGUgQWxsID1cbiAgfCBQZXJmb3JtQWN0aW9uXG4gIHwgUmVmcmVzaFxuICB8IFJlc2V0XG4gIHwgUm9sbGJhY2tcbiAgfCBDb21taXRcbiAgfCBTd2VlcFxuICB8IFRvZ2dsZUFjdGlvblxuICB8IFNldEFjdGlvbnNBY3RpdmVcbiAgfCBKdW1wVG9TdGF0ZVxuICB8IEp1bXBUb0FjdGlvblxuICB8IEltcG9ydFN0YXRlXG4gIHwgTG9ja0NoYW5nZXNcbiAgfCBQYXVzZVJlY29yZGluZztcbiJdfQ==