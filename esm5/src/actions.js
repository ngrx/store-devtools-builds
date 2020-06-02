/**
 * @fileoverview added by tsickle
 * Generated from: src/actions.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
export var PERFORM_ACTION = 'PERFORM_ACTION';
/** @type {?} */
export var REFRESH = 'REFRESH';
/** @type {?} */
export var RESET = 'RESET';
/** @type {?} */
export var ROLLBACK = 'ROLLBACK';
/** @type {?} */
export var COMMIT = 'COMMIT';
/** @type {?} */
export var SWEEP = 'SWEEP';
/** @type {?} */
export var TOGGLE_ACTION = 'TOGGLE_ACTION';
/** @type {?} */
export var SET_ACTIONS_ACTIVE = 'SET_ACTIONS_ACTIVE';
/** @type {?} */
export var JUMP_TO_STATE = 'JUMP_TO_STATE';
/** @type {?} */
export var JUMP_TO_ACTION = 'JUMP_TO_ACTION';
/** @type {?} */
export var IMPORT_STATE = 'IMPORT_STATE';
/** @type {?} */
export var LOCK_CHANGES = 'LOCK_CHANGES';
/** @type {?} */
export var PAUSE_RECORDING = 'PAUSE_RECORDING';
var PerformAction = /** @class */ (function () {
    function PerformAction(action, timestamp) {
        this.action = action;
        this.timestamp = timestamp;
        this.type = PERFORM_ACTION;
        if (typeof action.type === 'undefined') {
            throw new Error('Actions may not have an undefined "type" property. ' +
                'Have you misspelled a constant?');
        }
    }
    return PerformAction;
}());
export { PerformAction };
if (false) {
    /** @type {?} */
    PerformAction.prototype.type;
    /** @type {?} */
    PerformAction.prototype.action;
    /** @type {?} */
    PerformAction.prototype.timestamp;
}
var Refresh = /** @class */ (function () {
    function Refresh() {
        this.type = REFRESH;
    }
    return Refresh;
}());
export { Refresh };
if (false) {
    /** @type {?} */
    Refresh.prototype.type;
}
var Reset = /** @class */ (function () {
    function Reset(timestamp) {
        this.timestamp = timestamp;
        this.type = RESET;
    }
    return Reset;
}());
export { Reset };
if (false) {
    /** @type {?} */
    Reset.prototype.type;
    /** @type {?} */
    Reset.prototype.timestamp;
}
var Rollback = /** @class */ (function () {
    function Rollback(timestamp) {
        this.timestamp = timestamp;
        this.type = ROLLBACK;
    }
    return Rollback;
}());
export { Rollback };
if (false) {
    /** @type {?} */
    Rollback.prototype.type;
    /** @type {?} */
    Rollback.prototype.timestamp;
}
var Commit = /** @class */ (function () {
    function Commit(timestamp) {
        this.timestamp = timestamp;
        this.type = COMMIT;
    }
    return Commit;
}());
export { Commit };
if (false) {
    /** @type {?} */
    Commit.prototype.type;
    /** @type {?} */
    Commit.prototype.timestamp;
}
var Sweep = /** @class */ (function () {
    function Sweep() {
        this.type = SWEEP;
    }
    return Sweep;
}());
export { Sweep };
if (false) {
    /** @type {?} */
    Sweep.prototype.type;
}
var ToggleAction = /** @class */ (function () {
    function ToggleAction(id) {
        this.id = id;
        this.type = TOGGLE_ACTION;
    }
    return ToggleAction;
}());
export { ToggleAction };
if (false) {
    /** @type {?} */
    ToggleAction.prototype.type;
    /** @type {?} */
    ToggleAction.prototype.id;
}
var SetActionsActive = /** @class */ (function () {
    function SetActionsActive(start, end, active) {
        if (active === void 0) { active = true; }
        this.start = start;
        this.end = end;
        this.active = active;
        this.type = SET_ACTIONS_ACTIVE;
    }
    return SetActionsActive;
}());
export { SetActionsActive };
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
var JumpToState = /** @class */ (function () {
    function JumpToState(index) {
        this.index = index;
        this.type = JUMP_TO_STATE;
    }
    return JumpToState;
}());
export { JumpToState };
if (false) {
    /** @type {?} */
    JumpToState.prototype.type;
    /** @type {?} */
    JumpToState.prototype.index;
}
var JumpToAction = /** @class */ (function () {
    function JumpToAction(actionId) {
        this.actionId = actionId;
        this.type = JUMP_TO_ACTION;
    }
    return JumpToAction;
}());
export { JumpToAction };
if (false) {
    /** @type {?} */
    JumpToAction.prototype.type;
    /** @type {?} */
    JumpToAction.prototype.actionId;
}
var ImportState = /** @class */ (function () {
    function ImportState(nextLiftedState) {
        this.nextLiftedState = nextLiftedState;
        this.type = IMPORT_STATE;
    }
    return ImportState;
}());
export { ImportState };
if (false) {
    /** @type {?} */
    ImportState.prototype.type;
    /** @type {?} */
    ImportState.prototype.nextLiftedState;
}
var LockChanges = /** @class */ (function () {
    function LockChanges(status) {
        this.status = status;
        this.type = LOCK_CHANGES;
    }
    return LockChanges;
}());
export { LockChanges };
if (false) {
    /** @type {?} */
    LockChanges.prototype.type;
    /** @type {?} */
    LockChanges.prototype.status;
}
var PauseRecording = /** @class */ (function () {
    function PauseRecording(status) {
        this.status = status;
        this.type = PAUSE_RECORDING;
    }
    return PauseRecording;
}());
export { PauseRecording };
if (false) {
    /** @type {?} */
    PauseRecording.prototype.type;
    /** @type {?} */
    PauseRecording.prototype.status;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3J4L3N0b3JlLWRldnRvb2xzLyIsInNvdXJjZXMiOlsic3JjL2FjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsTUFBTSxLQUFPLGNBQWMsR0FBRyxnQkFBZ0I7O0FBQzlDLE1BQU0sS0FBTyxPQUFPLEdBQUcsU0FBUzs7QUFDaEMsTUFBTSxLQUFPLEtBQUssR0FBRyxPQUFPOztBQUM1QixNQUFNLEtBQU8sUUFBUSxHQUFHLFVBQVU7O0FBQ2xDLE1BQU0sS0FBTyxNQUFNLEdBQUcsUUFBUTs7QUFDOUIsTUFBTSxLQUFPLEtBQUssR0FBRyxPQUFPOztBQUM1QixNQUFNLEtBQU8sYUFBYSxHQUFHLGVBQWU7O0FBQzVDLE1BQU0sS0FBTyxrQkFBa0IsR0FBRyxvQkFBb0I7O0FBQ3RELE1BQU0sS0FBTyxhQUFhLEdBQUcsZUFBZTs7QUFDNUMsTUFBTSxLQUFPLGNBQWMsR0FBRyxnQkFBZ0I7O0FBQzlDLE1BQU0sS0FBTyxZQUFZLEdBQUcsY0FBYzs7QUFDMUMsTUFBTSxLQUFPLFlBQVksR0FBRyxjQUFjOztBQUMxQyxNQUFNLEtBQU8sZUFBZSxHQUFHLGlCQUFpQjtBQUVoRDtJQUdFLHVCQUFtQixNQUFjLEVBQVMsU0FBaUI7UUFBeEMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFTLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFGbEQsU0FBSSxHQUFHLGNBQWMsQ0FBQztRQUc3QixJQUFJLE9BQU8sTUFBTSxDQUFDLElBQUksS0FBSyxXQUFXLEVBQUU7WUFDdEMsTUFBTSxJQUFJLEtBQUssQ0FDYixxREFBcUQ7Z0JBQ25ELGlDQUFpQyxDQUNwQyxDQUFDO1NBQ0g7SUFDSCxDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBWEQsSUFXQzs7OztJQVZDLDZCQUErQjs7SUFFbkIsK0JBQXFCOztJQUFFLGtDQUF3Qjs7QUFVN0Q7SUFBQTtRQUNXLFNBQUksR0FBRyxPQUFPLENBQUM7SUFD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cG9ydCBjb25zdCBQRVJGT1JNX0FDVElPTiA9ICdQRVJGT1JNX0FDVElPTic7XG5leHBvcnQgY29uc3QgUkVGUkVTSCA9ICdSRUZSRVNIJztcbmV4cG9ydCBjb25zdCBSRVNFVCA9ICdSRVNFVCc7XG5leHBvcnQgY29uc3QgUk9MTEJBQ0sgPSAnUk9MTEJBQ0snO1xuZXhwb3J0IGNvbnN0IENPTU1JVCA9ICdDT01NSVQnO1xuZXhwb3J0IGNvbnN0IFNXRUVQID0gJ1NXRUVQJztcbmV4cG9ydCBjb25zdCBUT0dHTEVfQUNUSU9OID0gJ1RPR0dMRV9BQ1RJT04nO1xuZXhwb3J0IGNvbnN0IFNFVF9BQ1RJT05TX0FDVElWRSA9ICdTRVRfQUNUSU9OU19BQ1RJVkUnO1xuZXhwb3J0IGNvbnN0IEpVTVBfVE9fU1RBVEUgPSAnSlVNUF9UT19TVEFURSc7XG5leHBvcnQgY29uc3QgSlVNUF9UT19BQ1RJT04gPSAnSlVNUF9UT19BQ1RJT04nO1xuZXhwb3J0IGNvbnN0IElNUE9SVF9TVEFURSA9ICdJTVBPUlRfU1RBVEUnO1xuZXhwb3J0IGNvbnN0IExPQ0tfQ0hBTkdFUyA9ICdMT0NLX0NIQU5HRVMnO1xuZXhwb3J0IGNvbnN0IFBBVVNFX1JFQ09SRElORyA9ICdQQVVTRV9SRUNPUkRJTkcnO1xuXG5leHBvcnQgY2xhc3MgUGVyZm9ybUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBQRVJGT1JNX0FDVElPTjtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgYWN0aW9uOiBBY3Rpb24sIHB1YmxpYyB0aW1lc3RhbXA6IG51bWJlcikge1xuICAgIGlmICh0eXBlb2YgYWN0aW9uLnR5cGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdBY3Rpb25zIG1heSBub3QgaGF2ZSBhbiB1bmRlZmluZWQgXCJ0eXBlXCIgcHJvcGVydHkuICcgK1xuICAgICAgICAgICdIYXZlIHlvdSBtaXNzcGVsbGVkIGEgY29uc3RhbnQ/J1xuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJlZnJlc2ggaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gUkVGUkVTSDtcbn1cblxuZXhwb3J0IGNsYXNzIFJlc2V0IGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IFJFU0VUO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0aW1lc3RhbXA6IG51bWJlcikge31cbn1cblxuZXhwb3J0IGNsYXNzIFJvbGxiYWNrIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IFJPTExCQUNLO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0aW1lc3RhbXA6IG51bWJlcikge31cbn1cblxuZXhwb3J0IGNsYXNzIENvbW1pdCBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBDT01NSVQ7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHRpbWVzdGFtcDogbnVtYmVyKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgU3dlZXAgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gU1dFRVA7XG59XG5cbmV4cG9ydCBjbGFzcyBUb2dnbGVBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gVE9HR0xFX0FDVElPTjtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgaWQ6IG51bWJlcikge31cbn1cblxuZXhwb3J0IGNsYXNzIFNldEFjdGlvbnNBY3RpdmUgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gU0VUX0FDVElPTlNfQUNUSVZFO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBzdGFydDogbnVtYmVyLFxuICAgIHB1YmxpYyBlbmQ6IG51bWJlcixcbiAgICBwdWJsaWMgYWN0aXZlOiBib29sZWFuID0gdHJ1ZVxuICApIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBKdW1wVG9TdGF0ZSBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBKVU1QX1RPX1NUQVRFO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBpbmRleDogbnVtYmVyKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgSnVtcFRvQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IEpVTVBfVE9fQUNUSU9OO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBhY3Rpb25JZDogbnVtYmVyKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgSW1wb3J0U3RhdGUgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gSU1QT1JUX1NUQVRFO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBuZXh0TGlmdGVkU3RhdGU6IGFueSkge31cbn1cblxuZXhwb3J0IGNsYXNzIExvY2tDaGFuZ2VzIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IExPQ0tfQ0hBTkdFUztcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RhdHVzOiBib29sZWFuKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgUGF1c2VSZWNvcmRpbmcgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gUEFVU0VfUkVDT1JESU5HO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzdGF0dXM6IGJvb2xlYW4pIHt9XG59XG5cbmV4cG9ydCB0eXBlIEFsbCA9XG4gIHwgUGVyZm9ybUFjdGlvblxuICB8IFJlZnJlc2hcbiAgfCBSZXNldFxuICB8IFJvbGxiYWNrXG4gIHwgQ29tbWl0XG4gIHwgU3dlZXBcbiAgfCBUb2dnbGVBY3Rpb25cbiAgfCBTZXRBY3Rpb25zQWN0aXZlXG4gIHwgSnVtcFRvU3RhdGVcbiAgfCBKdW1wVG9BY3Rpb25cbiAgfCBJbXBvcnRTdGF0ZVxuICB8IExvY2tDaGFuZ2VzXG4gIHwgUGF1c2VSZWNvcmRpbmc7XG4iXX0=