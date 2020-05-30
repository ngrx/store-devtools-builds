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
//# sourceMappingURL=actions.js.map