/**
 * @fileoverview added by tsickle
 * Generated from: src/actions.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21vZHVsZXMvc3RvcmUtZGV2dG9vbHMvc3JjL2FjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsTUFBTSxPQUFPLGNBQWMsR0FBRyxnQkFBZ0I7O0FBQzlDLE1BQU0sT0FBTyxPQUFPLEdBQUcsU0FBUzs7QUFDaEMsTUFBTSxPQUFPLEtBQUssR0FBRyxPQUFPOztBQUM1QixNQUFNLE9BQU8sUUFBUSxHQUFHLFVBQVU7O0FBQ2xDLE1BQU0sT0FBTyxNQUFNLEdBQUcsUUFBUTs7QUFDOUIsTUFBTSxPQUFPLEtBQUssR0FBRyxPQUFPOztBQUM1QixNQUFNLE9BQU8sYUFBYSxHQUFHLGVBQWU7O0FBQzVDLE1BQU0sT0FBTyxrQkFBa0IsR0FBRyxvQkFBb0I7O0FBQ3RELE1BQU0sT0FBTyxhQUFhLEdBQUcsZUFBZTs7QUFDNUMsTUFBTSxPQUFPLGNBQWMsR0FBRyxnQkFBZ0I7O0FBQzlDLE1BQU0sT0FBTyxZQUFZLEdBQUcsY0FBYzs7QUFDMUMsTUFBTSxPQUFPLFlBQVksR0FBRyxjQUFjOztBQUMxQyxNQUFNLE9BQU8sZUFBZSxHQUFHLGlCQUFpQjtBQUVoRCxNQUFNLE9BQU8sYUFBYTs7Ozs7SUFHeEIsWUFBbUIsTUFBYyxFQUFTLFNBQWlCO1FBQXhDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBUyxjQUFTLEdBQVQsU0FBUyxDQUFRO1FBRmxELFNBQUksR0FBRyxjQUFjLENBQUM7UUFHN0IsSUFBSSxPQUFPLE1BQU0sQ0FBQyxJQUFJLEtBQUssV0FBVyxFQUFFO1lBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQ2IscURBQXFEO2dCQUNuRCxpQ0FBaUMsQ0FDcEMsQ0FBQztTQUNIO0lBQ0gsQ0FBQztDQUNGOzs7SUFWQyw2QkFBK0I7O0lBRW5CLCtCQUFxQjs7SUFBRSxrQ0FBd0I7O0FBVTdELE1BQU0sT0FBTyxPQUFPO0lBQXBCO1FBQ1csU0FBSSxHQUFHLE9BQU8sQ0FBQztJQUMxQixDQUFDO0NBQUE7OztJQURDLHVCQUF3Qjs7QUFHMUIsTUFBTSxPQUFPLEtBQUs7Ozs7SUFHaEIsWUFBbUIsU0FBaUI7UUFBakIsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUYzQixTQUFJLEdBQUcsS0FBSyxDQUFDO0lBRWlCLENBQUM7Q0FDekM7OztJQUhDLHFCQUFzQjs7SUFFViwwQkFBd0I7O0FBR3RDLE1BQU0sT0FBTyxRQUFROzs7O0lBR25CLFlBQW1CLFNBQWlCO1FBQWpCLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFGM0IsU0FBSSxHQUFHLFFBQVEsQ0FBQztJQUVjLENBQUM7Q0FDekM7OztJQUhDLHdCQUF5Qjs7SUFFYiw2QkFBd0I7O0FBR3RDLE1BQU0sT0FBTyxNQUFNOzs7O0lBR2pCLFlBQW1CLFNBQWlCO1FBQWpCLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFGM0IsU0FBSSxHQUFHLE1BQU0sQ0FBQztJQUVnQixDQUFDO0NBQ3pDOzs7SUFIQyxzQkFBdUI7O0lBRVgsMkJBQXdCOztBQUd0QyxNQUFNLE9BQU8sS0FBSztJQUFsQjtRQUNXLFNBQUksR0FBRyxLQUFLLENBQUM7SUFDeEIsQ0FBQztDQUFBOzs7SUFEQyxxQkFBc0I7O0FBR3hCLE1BQU0sT0FBTyxZQUFZOzs7O0lBR3ZCLFlBQW1CLEVBQVU7UUFBVixPQUFFLEdBQUYsRUFBRSxDQUFRO1FBRnBCLFNBQUksR0FBRyxhQUFhLENBQUM7SUFFRSxDQUFDO0NBQ2xDOzs7SUFIQyw0QkFBOEI7O0lBRWxCLDBCQUFpQjs7QUFHL0IsTUFBTSxPQUFPLGdCQUFnQjs7Ozs7O0lBRzNCLFlBQ1MsS0FBYSxFQUNiLEdBQVcsRUFDWCxTQUFrQixJQUFJO1FBRnRCLFVBQUssR0FBTCxLQUFLLENBQVE7UUFDYixRQUFHLEdBQUgsR0FBRyxDQUFRO1FBQ1gsV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7UUFMdEIsU0FBSSxHQUFHLGtCQUFrQixDQUFDO0lBTWhDLENBQUM7Q0FDTDs7O0lBUEMsZ0NBQW1DOztJQUdqQyxpQ0FBb0I7O0lBQ3BCLCtCQUFrQjs7SUFDbEIsa0NBQTZCOztBQUlqQyxNQUFNLE9BQU8sV0FBVzs7OztJQUd0QixZQUFtQixLQUFhO1FBQWIsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUZ2QixTQUFJLEdBQUcsYUFBYSxDQUFDO0lBRUssQ0FBQztDQUNyQzs7O0lBSEMsMkJBQThCOztJQUVsQiw0QkFBb0I7O0FBR2xDLE1BQU0sT0FBTyxZQUFZOzs7O0lBR3ZCLFlBQW1CLFFBQWdCO1FBQWhCLGFBQVEsR0FBUixRQUFRLENBQVE7UUFGMUIsU0FBSSxHQUFHLGNBQWMsQ0FBQztJQUVPLENBQUM7Q0FDeEM7OztJQUhDLDRCQUErQjs7SUFFbkIsZ0NBQXVCOztBQUdyQyxNQUFNLE9BQU8sV0FBVzs7OztJQUd0QixZQUFtQixlQUFvQjtRQUFwQixvQkFBZSxHQUFmLGVBQWUsQ0FBSztRQUY5QixTQUFJLEdBQUcsWUFBWSxDQUFDO0lBRWEsQ0FBQztDQUM1Qzs7O0lBSEMsMkJBQTZCOztJQUVqQixzQ0FBMkI7O0FBR3pDLE1BQU0sT0FBTyxXQUFXOzs7O0lBR3RCLFlBQW1CLE1BQWU7UUFBZixXQUFNLEdBQU4sTUFBTSxDQUFTO1FBRnpCLFNBQUksR0FBRyxZQUFZLENBQUM7SUFFUSxDQUFDO0NBQ3ZDOzs7SUFIQywyQkFBNkI7O0lBRWpCLDZCQUFzQjs7QUFHcEMsTUFBTSxPQUFPLGNBQWM7Ozs7SUFHekIsWUFBbUIsTUFBZTtRQUFmLFdBQU0sR0FBTixNQUFNLENBQVM7UUFGekIsU0FBSSxHQUFHLGVBQWUsQ0FBQztJQUVLLENBQUM7Q0FDdkM7OztJQUhDLDhCQUFnQzs7SUFFcEIsZ0NBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuXG5leHBvcnQgY29uc3QgUEVSRk9STV9BQ1RJT04gPSAnUEVSRk9STV9BQ1RJT04nO1xuZXhwb3J0IGNvbnN0IFJFRlJFU0ggPSAnUkVGUkVTSCc7XG5leHBvcnQgY29uc3QgUkVTRVQgPSAnUkVTRVQnO1xuZXhwb3J0IGNvbnN0IFJPTExCQUNLID0gJ1JPTExCQUNLJztcbmV4cG9ydCBjb25zdCBDT01NSVQgPSAnQ09NTUlUJztcbmV4cG9ydCBjb25zdCBTV0VFUCA9ICdTV0VFUCc7XG5leHBvcnQgY29uc3QgVE9HR0xFX0FDVElPTiA9ICdUT0dHTEVfQUNUSU9OJztcbmV4cG9ydCBjb25zdCBTRVRfQUNUSU9OU19BQ1RJVkUgPSAnU0VUX0FDVElPTlNfQUNUSVZFJztcbmV4cG9ydCBjb25zdCBKVU1QX1RPX1NUQVRFID0gJ0pVTVBfVE9fU1RBVEUnO1xuZXhwb3J0IGNvbnN0IEpVTVBfVE9fQUNUSU9OID0gJ0pVTVBfVE9fQUNUSU9OJztcbmV4cG9ydCBjb25zdCBJTVBPUlRfU1RBVEUgPSAnSU1QT1JUX1NUQVRFJztcbmV4cG9ydCBjb25zdCBMT0NLX0NIQU5HRVMgPSAnTE9DS19DSEFOR0VTJztcbmV4cG9ydCBjb25zdCBQQVVTRV9SRUNPUkRJTkcgPSAnUEFVU0VfUkVDT1JESU5HJztcblxuZXhwb3J0IGNsYXNzIFBlcmZvcm1BY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gUEVSRk9STV9BQ1RJT047XG5cbiAgY29uc3RydWN0b3IocHVibGljIGFjdGlvbjogQWN0aW9uLCBwdWJsaWMgdGltZXN0YW1wOiBudW1iZXIpIHtcbiAgICBpZiAodHlwZW9mIGFjdGlvbi50eXBlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnQWN0aW9ucyBtYXkgbm90IGhhdmUgYW4gdW5kZWZpbmVkIFwidHlwZVwiIHByb3BlcnR5LiAnICtcbiAgICAgICAgICAnSGF2ZSB5b3UgbWlzc3BlbGxlZCBhIGNvbnN0YW50PydcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSZWZyZXNoIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IFJFRlJFU0g7XG59XG5cbmV4cG9ydCBjbGFzcyBSZXNldCBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBSRVNFVDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgdGltZXN0YW1wOiBudW1iZXIpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBSb2xsYmFjayBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBST0xMQkFDSztcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgdGltZXN0YW1wOiBudW1iZXIpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBDb21taXQgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gQ09NTUlUO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0aW1lc3RhbXA6IG51bWJlcikge31cbn1cblxuZXhwb3J0IGNsYXNzIFN3ZWVwIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IFNXRUVQO1xufVxuXG5leHBvcnQgY2xhc3MgVG9nZ2xlQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IFRPR0dMRV9BQ1RJT047XG5cbiAgY29uc3RydWN0b3IocHVibGljIGlkOiBudW1iZXIpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBTZXRBY3Rpb25zQWN0aXZlIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IFNFVF9BQ1RJT05TX0FDVElWRTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgc3RhcnQ6IG51bWJlcixcbiAgICBwdWJsaWMgZW5kOiBudW1iZXIsXG4gICAgcHVibGljIGFjdGl2ZTogYm9vbGVhbiA9IHRydWVcbiAgKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgSnVtcFRvU3RhdGUgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gSlVNUF9UT19TVEFURTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgaW5kZXg6IG51bWJlcikge31cbn1cblxuZXhwb3J0IGNsYXNzIEp1bXBUb0FjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBKVU1QX1RPX0FDVElPTjtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgYWN0aW9uSWQ6IG51bWJlcikge31cbn1cblxuZXhwb3J0IGNsYXNzIEltcG9ydFN0YXRlIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IElNUE9SVF9TVEFURTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgbmV4dExpZnRlZFN0YXRlOiBhbnkpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBMb2NrQ2hhbmdlcyBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBMT0NLX0NIQU5HRVM7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHN0YXR1czogYm9vbGVhbikge31cbn1cblxuZXhwb3J0IGNsYXNzIFBhdXNlUmVjb3JkaW5nIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IFBBVVNFX1JFQ09SRElORztcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RhdHVzOiBib29sZWFuKSB7fVxufVxuXG5leHBvcnQgdHlwZSBBbGwgPVxuICB8IFBlcmZvcm1BY3Rpb25cbiAgfCBSZWZyZXNoXG4gIHwgUmVzZXRcbiAgfCBSb2xsYmFja1xuICB8IENvbW1pdFxuICB8IFN3ZWVwXG4gIHwgVG9nZ2xlQWN0aW9uXG4gIHwgU2V0QWN0aW9uc0FjdGl2ZVxuICB8IEp1bXBUb1N0YXRlXG4gIHwgSnVtcFRvQWN0aW9uXG4gIHwgSW1wb3J0U3RhdGVcbiAgfCBMb2NrQ2hhbmdlc1xuICB8IFBhdXNlUmVjb3JkaW5nO1xuIl19