(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@ngrx/store'), require('rxjs'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('@ngrx/store-devtools', ['exports', '@angular/core', '@ngrx/store', 'rxjs', 'rxjs/operators'], factory) :
    (global = global || self, factory((global.ngrx = global.ngrx || {}, global.ngrx['store-devtools'] = {}), global.ng.core, global.store, global.rxjs, global.rxjs.operators));
}(this, (function (exports, core, store, rxjs, operators) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * Generated from: src/config.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * @record
     */
    function DevToolsFeatureOptions() { }
    if (false) {
        /** @type {?|undefined} */
        DevToolsFeatureOptions.prototype.pause;
        /** @type {?|undefined} */
        DevToolsFeatureOptions.prototype.lock;
        /** @type {?|undefined} */
        DevToolsFeatureOptions.prototype.persist;
        /** @type {?|undefined} */
        DevToolsFeatureOptions.prototype.export;
        /** @type {?|undefined} */
        DevToolsFeatureOptions.prototype.import;
        /** @type {?|undefined} */
        DevToolsFeatureOptions.prototype.jump;
        /** @type {?|undefined} */
        DevToolsFeatureOptions.prototype.skip;
        /** @type {?|undefined} */
        DevToolsFeatureOptions.prototype.reorder;
        /** @type {?|undefined} */
        DevToolsFeatureOptions.prototype.dispatch;
        /** @type {?|undefined} */
        DevToolsFeatureOptions.prototype.test;
    }
    var StoreDevtoolsConfig = /** @class */ (function () {
        function StoreDevtoolsConfig() {
            this.maxAge = false;
        }
        return StoreDevtoolsConfig;
    }());
    if (false) {
        /** @type {?} */
        StoreDevtoolsConfig.prototype.maxAge;
        /** @type {?} */
        StoreDevtoolsConfig.prototype.monitor;
        /** @type {?} */
        StoreDevtoolsConfig.prototype.actionSanitizer;
        /** @type {?} */
        StoreDevtoolsConfig.prototype.stateSanitizer;
        /** @type {?} */
        StoreDevtoolsConfig.prototype.name;
        /** @type {?} */
        StoreDevtoolsConfig.prototype.serialize;
        /** @type {?} */
        StoreDevtoolsConfig.prototype.logOnly;
        /** @type {?} */
        StoreDevtoolsConfig.prototype.features;
        /** @type {?} */
        StoreDevtoolsConfig.prototype.actionsBlocklist;
        /** @type {?} */
        StoreDevtoolsConfig.prototype.actionsSafelist;
        /** @type {?} */
        StoreDevtoolsConfig.prototype.predicate;
    }
    /** @type {?} */
    var STORE_DEVTOOLS_CONFIG = new core.InjectionToken('@ngrx/devtools Options');
    /** @type {?} */
    var INITIAL_OPTIONS = new core.InjectionToken('@ngrx/devtools Initial Config');
    /**
     * @return {?}
     */
    function noMonitor() {
        return null;
    }
    /** @type {?} */
    var DEFAULT_NAME = 'NgRx Store DevTools';
    /**
     * @param {?} _options
     * @return {?}
     */
    function createConfig(_options) {
        /** @type {?} */
        var DEFAULT_OPTIONS = {
            maxAge: false,
            monitor: noMonitor,
            actionSanitizer: undefined,
            stateSanitizer: undefined,
            name: DEFAULT_NAME,
            serialize: false,
            logOnly: false,
            // Add all features explicitly. This prevent buggy behavior for
            // options like "lock" which might otherwise not show up.
            features: {
                pause: true,
                // start/pause recording of dispatched actions
                lock: true,
                // lock/unlock dispatching actions and side effects
                persist: true,
                // persist states on page reloading
                export: true,
                // export history of actions in a file
                import: 'custom',
                // import history of actions from a file
                jump: true,
                // jump back and forth (time travelling)
                skip: true,
                // skip (cancel) actions
                reorder: true,
                // drag and drop actions in the history list
                dispatch: true,
                // dispatch custom actions or action creators
                test: true,
            },
        };
        /** @type {?} */
        var options = typeof _options === 'function' ? _options() : _options;
        /** @type {?} */
        var logOnly = options.logOnly
            ? { pause: true, export: true, test: true }
            : false;
        /** @type {?} */
        var features = options.features || logOnly || DEFAULT_OPTIONS.features;
        /** @type {?} */
        var config = Object.assign({}, DEFAULT_OPTIONS, { features: features }, options);
        if (config.maxAge && config.maxAge < 2) {
            throw new Error("Devtools 'maxAge' cannot be less than 2, got " + config.maxAge);
        }
        return config;
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, exports) {
        for (var p in m)
            if (p !== "default" && !exports.hasOwnProperty(p))
                __createBinding(exports, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    ;
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (Object.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }
    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/actions.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var PERFORM_ACTION = 'PERFORM_ACTION';
    /** @type {?} */
    var REFRESH = 'REFRESH';
    /** @type {?} */
    var RESET = 'RESET';
    /** @type {?} */
    var ROLLBACK = 'ROLLBACK';
    /** @type {?} */
    var COMMIT = 'COMMIT';
    /** @type {?} */
    var SWEEP = 'SWEEP';
    /** @type {?} */
    var TOGGLE_ACTION = 'TOGGLE_ACTION';
    /** @type {?} */
    var SET_ACTIONS_ACTIVE = 'SET_ACTIONS_ACTIVE';
    /** @type {?} */
    var JUMP_TO_STATE = 'JUMP_TO_STATE';
    /** @type {?} */
    var JUMP_TO_ACTION = 'JUMP_TO_ACTION';
    /** @type {?} */
    var IMPORT_STATE = 'IMPORT_STATE';
    /** @type {?} */
    var LOCK_CHANGES = 'LOCK_CHANGES';
    /** @type {?} */
    var PAUSE_RECORDING = 'PAUSE_RECORDING';
    var PerformAction = /** @class */ (function () {
        /**
         * @param {?} action
         * @param {?} timestamp
         */
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
    if (false) {
        /** @type {?} */
        Refresh.prototype.type;
    }
    var Reset = /** @class */ (function () {
        /**
         * @param {?} timestamp
         */
        function Reset(timestamp) {
            this.timestamp = timestamp;
            this.type = RESET;
        }
        return Reset;
    }());
    if (false) {
        /** @type {?} */
        Reset.prototype.type;
        /** @type {?} */
        Reset.prototype.timestamp;
    }
    var Rollback = /** @class */ (function () {
        /**
         * @param {?} timestamp
         */
        function Rollback(timestamp) {
            this.timestamp = timestamp;
            this.type = ROLLBACK;
        }
        return Rollback;
    }());
    if (false) {
        /** @type {?} */
        Rollback.prototype.type;
        /** @type {?} */
        Rollback.prototype.timestamp;
    }
    var Commit = /** @class */ (function () {
        /**
         * @param {?} timestamp
         */
        function Commit(timestamp) {
            this.timestamp = timestamp;
            this.type = COMMIT;
        }
        return Commit;
    }());
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
    if (false) {
        /** @type {?} */
        Sweep.prototype.type;
    }
    var ToggleAction = /** @class */ (function () {
        /**
         * @param {?} id
         */
        function ToggleAction(id) {
            this.id = id;
            this.type = TOGGLE_ACTION;
        }
        return ToggleAction;
    }());
    if (false) {
        /** @type {?} */
        ToggleAction.prototype.type;
        /** @type {?} */
        ToggleAction.prototype.id;
    }
    var SetActionsActive = /** @class */ (function () {
        /**
         * @param {?} start
         * @param {?} end
         * @param {?=} active
         */
        function SetActionsActive(start, end, active) {
            if (active === void 0) { active = true; }
            this.start = start;
            this.end = end;
            this.active = active;
            this.type = SET_ACTIONS_ACTIVE;
        }
        return SetActionsActive;
    }());
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
        /**
         * @param {?} index
         */
        function JumpToState(index) {
            this.index = index;
            this.type = JUMP_TO_STATE;
        }
        return JumpToState;
    }());
    if (false) {
        /** @type {?} */
        JumpToState.prototype.type;
        /** @type {?} */
        JumpToState.prototype.index;
    }
    var JumpToAction = /** @class */ (function () {
        /**
         * @param {?} actionId
         */
        function JumpToAction(actionId) {
            this.actionId = actionId;
            this.type = JUMP_TO_ACTION;
        }
        return JumpToAction;
    }());
    if (false) {
        /** @type {?} */
        JumpToAction.prototype.type;
        /** @type {?} */
        JumpToAction.prototype.actionId;
    }
    var ImportState = /** @class */ (function () {
        /**
         * @param {?} nextLiftedState
         */
        function ImportState(nextLiftedState) {
            this.nextLiftedState = nextLiftedState;
            this.type = IMPORT_STATE;
        }
        return ImportState;
    }());
    if (false) {
        /** @type {?} */
        ImportState.prototype.type;
        /** @type {?} */
        ImportState.prototype.nextLiftedState;
    }
    var LockChanges = /** @class */ (function () {
        /**
         * @param {?} status
         */
        function LockChanges(status) {
            this.status = status;
            this.type = LOCK_CHANGES;
        }
        return LockChanges;
    }());
    if (false) {
        /** @type {?} */
        LockChanges.prototype.type;
        /** @type {?} */
        LockChanges.prototype.status;
    }
    var PauseRecording = /** @class */ (function () {
        /**
         * @param {?} status
         */
        function PauseRecording(status) {
            this.status = status;
            this.type = PAUSE_RECORDING;
        }
        return PauseRecording;
    }());
    if (false) {
        /** @type {?} */
        PauseRecording.prototype.type;
        /** @type {?} */
        PauseRecording.prototype.status;
    }

    var DevtoolsDispatcher = /** @class */ (function (_super) {
        __extends(DevtoolsDispatcher, _super);
        function DevtoolsDispatcher() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return DevtoolsDispatcher;
    }(store.ActionsSubject));
    DevtoolsDispatcher.decorators = [
        { type: core.Injectable }
    ];

    /**
     * @fileoverview added by tsickle
     * Generated from: src/utils.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * @param {?} first
     * @param {?} second
     * @return {?}
     */
    function difference(first, second) {
        return first.filter(( /**
         * @param {?} item
         * @return {?}
         */function (item) { return second.indexOf(item) < 0; }));
    }
    /**
     * Provides an app's view into the state of the lifted store.
     * @param {?} liftedState
     * @return {?}
     */
    function unliftState(liftedState) {
        var computedStates = liftedState.computedStates, currentStateIndex = liftedState.currentStateIndex;
        // At start up NgRx dispatches init actions,
        // When these init actions are being filtered out by the predicate or safe/block list options
        // we don't have a complete computed states yet.
        // At this point it could happen that we're out of bounds, when this happens we fall back to the last known state
        if (currentStateIndex >= computedStates.length) {
            var state_1 = computedStates[computedStates.length - 1].state;
            return state_1;
        }
        var state = computedStates[currentStateIndex].state;
        return state;
    }
    /**
     * @param {?} liftedState
     * @return {?}
     */
    function unliftAction(liftedState) {
        return liftedState.actionsById[liftedState.nextActionId - 1];
    }
    /**
     * Lifts an app's action into an action on the lifted store.
     * @param {?} action
     * @return {?}
     */
    function liftAction(action) {
        return new PerformAction(action, +Date.now());
    }
    /**
     * Sanitizes given actions with given function.
     * @param {?} actionSanitizer
     * @param {?} actions
     * @return {?}
     */
    function sanitizeActions(actionSanitizer, actions) {
        return Object.keys(actions).reduce(( /**
         * @param {?} sanitizedActions
         * @param {?} actionIdx
         * @return {?}
         */function (sanitizedActions, actionIdx) {
            /** @type {?} */
            var idx = Number(actionIdx);
            sanitizedActions[idx] = sanitizeAction(actionSanitizer, actions[idx], idx);
            return sanitizedActions;
        }), ( /** @type {?} */({})));
    }
    /**
     * Sanitizes given action with given function.
     * @param {?} actionSanitizer
     * @param {?} action
     * @param {?} actionIdx
     * @return {?}
     */
    function sanitizeAction(actionSanitizer, action, actionIdx) {
        return Object.assign(Object.assign({}, action), { action: actionSanitizer(action.action, actionIdx) });
    }
    /**
     * Sanitizes given states with given function.
     * @param {?} stateSanitizer
     * @param {?} states
     * @return {?}
     */
    function sanitizeStates(stateSanitizer, states) {
        return states.map(( /**
         * @param {?} computedState
         * @param {?} idx
         * @return {?}
         */function (computedState, idx) { return ({
            state: sanitizeState(stateSanitizer, computedState.state, idx),
            error: computedState.error,
        }); }));
    }
    /**
     * Sanitizes given state with given function.
     * @param {?} stateSanitizer
     * @param {?} state
     * @param {?} stateIdx
     * @return {?}
     */
    function sanitizeState(stateSanitizer, state, stateIdx) {
        return stateSanitizer(state, stateIdx);
    }
    /**
     * Read the config and tell if actions should be filtered
     * @param {?} config
     * @return {?}
     */
    function shouldFilterActions(config) {
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
    function filterLiftedState(liftedState, predicate, safelist, blocklist) {
        /** @type {?} */
        var filteredStagedActionIds = [];
        /** @type {?} */
        var filteredActionsById = {};
        /** @type {?} */
        var filteredComputedStates = [];
        liftedState.stagedActionIds.forEach(( /**
         * @param {?} id
         * @param {?} idx
         * @return {?}
         */function (id, idx) {
            /** @type {?} */
            var liftedAction = liftedState.actionsById[id];
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
    function isActionFiltered(state, action, predicate, safelist, blockedlist) {
        /** @type {?} */
        var predicateMatch = predicate && !predicate(state, action.action);
        /** @type {?} */
        var safelistMatch = safelist &&
            !action.action.type.match(safelist.map(( /**
             * @param {?} s
             * @return {?}
             */function (s) { return escapeRegExp(s); })).join('|'));
        /** @type {?} */
        var blocklistMatch = blockedlist &&
            action.action.type.match(blockedlist.map(( /**
             * @param {?} s
             * @return {?}
             */function (s) { return escapeRegExp(s); })).join('|'));
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

    /**
     * @fileoverview added by tsickle
     * Generated from: src/extension.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var ExtensionActionTypes = {
        START: 'START',
        DISPATCH: 'DISPATCH',
        STOP: 'STOP',
        ACTION: 'ACTION',
    };
    /** @type {?} */
    var REDUX_DEVTOOLS_EXTENSION = new core.InjectionToken('Redux Devtools Extension');
    /**
     * @record
     */
    function ReduxDevtoolsExtensionConnection() { }
    if (false) {
        /**
         * @param {?} listener
         * @return {?}
         */
        ReduxDevtoolsExtensionConnection.prototype.subscribe = function (listener) { };
        /**
         * @return {?}
         */
        ReduxDevtoolsExtensionConnection.prototype.unsubscribe = function () { };
        /**
         * @param {?} action
         * @param {?} state
         * @return {?}
         */
        ReduxDevtoolsExtensionConnection.prototype.send = function (action, state) { };
        /**
         * @param {?=} state
         * @return {?}
         */
        ReduxDevtoolsExtensionConnection.prototype.init = function (state) { };
        /**
         * @param {?} anyErr
         * @return {?}
         */
        ReduxDevtoolsExtensionConnection.prototype.error = function (anyErr) { };
    }
    /**
     * @record
     */
    function ReduxDevtoolsExtensionConfig() { }
    if (false) {
        /** @type {?|undefined} */
        ReduxDevtoolsExtensionConfig.prototype.features;
        /** @type {?} */
        ReduxDevtoolsExtensionConfig.prototype.name;
        /** @type {?|undefined} */
        ReduxDevtoolsExtensionConfig.prototype.maxAge;
        /** @type {?|undefined} */
        ReduxDevtoolsExtensionConfig.prototype.serialize;
    }
    /**
     * @record
     */
    function ReduxDevtoolsExtension() { }
    if (false) {
        /**
         * @param {?} options
         * @return {?}
         */
        ReduxDevtoolsExtension.prototype.connect = function (options) { };
        /**
         * @param {?} action
         * @param {?} state
         * @param {?} options
         * @return {?}
         */
        ReduxDevtoolsExtension.prototype.send = function (action, state, options) { };
    }
    var DevtoolsExtension = /** @class */ (function () {
        /**
         * @param {?} devtoolsExtension
         * @param {?} config
         * @param {?} dispatcher
         */
        function DevtoolsExtension(devtoolsExtension, config, dispatcher) {
            this.config = config;
            this.dispatcher = dispatcher;
            this.devtoolsExtension = devtoolsExtension;
            this.createActionStreams();
        }
        /**
         * @param {?} action
         * @param {?} state
         * @return {?}
         */
        DevtoolsExtension.prototype.notify = function (action, state) {
            var _this = this;
            if (!this.devtoolsExtension) {
                return;
            }
            // Check to see if the action requires a full update of the liftedState.
            // If it is a simple action generated by the user's app and the recording
            // is not locked/paused, only send the action and the current state (fast).
            //
            // A full liftedState update (slow: serializes the entire liftedState) is
            // only required when:
            //   a) redux-devtools-extension fires the @@Init action (ignored by
            //      @ngrx/store-devtools)
            //   b) an action is generated by an @ngrx module (e.g. @ngrx/effects/init
            //      or @ngrx/store/update-reducers)
            //   c) the state has been recomputed due to time-traveling
            //   d) any action that is not a PerformAction to err on the side of
            //      caution.
            if (action.type === PERFORM_ACTION) {
                if (state.isLocked || state.isPaused) {
                    return;
                }
                /** @type {?} */
                var currentState = unliftState(state);
                if (shouldFilterActions(this.config) &&
                    isActionFiltered(currentState, action, this.config.predicate, this.config.actionsSafelist, this.config.actionsBlocklist)) {
                    return;
                }
                /** @type {?} */
                var sanitizedState_1 = this.config.stateSanitizer
                    ? sanitizeState(this.config.stateSanitizer, currentState, state.currentStateIndex)
                    : currentState;
                /** @type {?} */
                var sanitizedAction_1 = this.config.actionSanitizer
                    ? sanitizeAction(this.config.actionSanitizer, action, state.nextActionId)
                    : action;
                this.sendToReduxDevtools(( /**
                 * @return {?}
                 */function () { return _this.extensionConnection.send(sanitizedAction_1, sanitizedState_1); }));
            }
            else {
                // Requires full state update
                /** @type {?} */
                var sanitizedLiftedState_1 = Object.assign(Object.assign({}, state), { stagedActionIds: state.stagedActionIds, actionsById: this.config.actionSanitizer
                        ? sanitizeActions(this.config.actionSanitizer, state.actionsById)
                        : state.actionsById, computedStates: this.config.stateSanitizer
                        ? sanitizeStates(this.config.stateSanitizer, state.computedStates)
                        : state.computedStates });
                this.sendToReduxDevtools(( /**
                 * @return {?}
                 */function () { return _this.devtoolsExtension.send(null, sanitizedLiftedState_1, _this.getExtensionConfig(_this.config)); }));
            }
        };
        /**
         * @private
         * @return {?}
         */
        DevtoolsExtension.prototype.createChangesObservable = function () {
            var _this = this;
            if (!this.devtoolsExtension) {
                return rxjs.empty();
            }
            return new rxjs.Observable(( /**
             * @param {?} subscriber
             * @return {?}
             */function (subscriber) {
                /** @type {?} */
                var connection = _this.devtoolsExtension.connect(_this.getExtensionConfig(_this.config));
                _this.extensionConnection = connection;
                connection.init();
                connection.subscribe(( /**
                 * @param {?} change
                 * @return {?}
                 */function (change) { return subscriber.next(change); }));
                return connection.unsubscribe;
            }));
        };
        /**
         * @private
         * @return {?}
         */
        DevtoolsExtension.prototype.createActionStreams = function () {
            var _this = this;
            // Listens to all changes
            /** @type {?} */
            var changes$ = this.createChangesObservable().pipe(operators.share());
            // Listen for the start action
            /** @type {?} */
            var start$ = changes$.pipe(operators.filter(( /**
             * @param {?} change
             * @return {?}
             */function (change) { return change.type === ExtensionActionTypes.START; })));
            // Listen for the stop action
            /** @type {?} */
            var stop$ = changes$.pipe(operators.filter(( /**
             * @param {?} change
             * @return {?}
             */function (change) { return change.type === ExtensionActionTypes.STOP; })));
            // Listen for lifted actions
            /** @type {?} */
            var liftedActions$ = changes$.pipe(operators.filter(( /**
             * @param {?} change
             * @return {?}
             */function (change) { return change.type === ExtensionActionTypes.DISPATCH; })), operators.map(( /**
             * @param {?} change
             * @return {?}
             */function (change) { return _this.unwrapAction(change.payload); })), operators.concatMap(( /**
             * @param {?} action
             * @return {?}
             */function (action) {
                if (action.type === IMPORT_STATE) {
                    // State imports may happen in two situations:
                    // 1. Explicitly by user
                    // 2. User activated the "persist state accross reloads" option
                    //    and now the state is imported during reload.
                    // Because of option 2, we need to give possible
                    // lazy loaded reducers time to instantiate.
                    // As soon as there is no UPDATE action within 1 second,
                    // it is assumed that all reducers are loaded.
                    return _this.dispatcher.pipe(operators.filter(( /**
                     * @param {?} action
                     * @return {?}
                     */function (action) { return action.type === store.UPDATE; })), operators.timeout(1000), operators.debounceTime(1000), operators.map(( /**
                     * @return {?}
                     */function () { return action; })), operators.catchError(( /**
                     * @return {?}
                     */function () { return rxjs.of(action); })), operators.take(1));
                }
                else {
                    return rxjs.of(action);
                }
            })));
            // Listen for unlifted actions
            /** @type {?} */
            var actions$ = changes$.pipe(operators.filter(( /**
             * @param {?} change
             * @return {?}
             */function (change) { return change.type === ExtensionActionTypes.ACTION; })), operators.map(( /**
             * @param {?} change
             * @return {?}
             */function (change) { return _this.unwrapAction(change.payload); })));
            /** @type {?} */
            var actionsUntilStop$ = actions$.pipe(operators.takeUntil(stop$));
            /** @type {?} */
            var liftedUntilStop$ = liftedActions$.pipe(operators.takeUntil(stop$));
            this.start$ = start$.pipe(operators.takeUntil(stop$));
            // Only take the action sources between the start/stop events
            this.actions$ = this.start$.pipe(operators.switchMap(( /**
             * @return {?}
             */function () { return actionsUntilStop$; })));
            this.liftedActions$ = this.start$.pipe(operators.switchMap(( /**
             * @return {?}
             */function () { return liftedUntilStop$; })));
        };
        /**
         * @private
         * @param {?} action
         * @return {?}
         */
        DevtoolsExtension.prototype.unwrapAction = function (action) {
            return typeof action === 'string' ? eval("(" + action + ")") : action;
        };
        /**
         * @private
         * @param {?} config
         * @return {?}
         */
        DevtoolsExtension.prototype.getExtensionConfig = function (config) {
            /** @type {?} */
            var extensionOptions = {
                name: config.name,
                features: config.features,
                serialize: config.serialize,
            };
            if (config.maxAge !== false /* support === 0 */) {
                extensionOptions.maxAge = config.maxAge;
            }
            return extensionOptions;
        };
        /**
         * @private
         * @param {?} send
         * @return {?}
         */
        DevtoolsExtension.prototype.sendToReduxDevtools = function (send) {
            try {
                send();
            }
            catch (err) {
                console.warn('@ngrx/store-devtools: something went wrong inside the redux devtools', err);
            }
        };
        return DevtoolsExtension;
    }());
    DevtoolsExtension.decorators = [
        { type: core.Injectable }
    ];
    /** @nocollapse */
    DevtoolsExtension.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: core.Inject, args: [REDUX_DEVTOOLS_EXTENSION,] }] },
        { type: StoreDevtoolsConfig, decorators: [{ type: core.Inject, args: [STORE_DEVTOOLS_CONFIG,] }] },
        { type: DevtoolsDispatcher }
    ]; };
    if (false) {
        /**
         * @type {?}
         * @private
         */
        DevtoolsExtension.prototype.devtoolsExtension;
        /**
         * @type {?}
         * @private
         */
        DevtoolsExtension.prototype.extensionConnection;
        /** @type {?} */
        DevtoolsExtension.prototype.liftedActions$;
        /** @type {?} */
        DevtoolsExtension.prototype.actions$;
        /** @type {?} */
        DevtoolsExtension.prototype.start$;
        /**
         * @type {?}
         * @private
         */
        DevtoolsExtension.prototype.config;
        /**
         * @type {?}
         * @private
         */
        DevtoolsExtension.prototype.dispatcher;
    }

    /** @type {?} */
    var INIT_ACTION = { type: store.INIT };
    /** @type {?} */
    var RECOMPUTE = ( /** @type {?} */('@ngrx/store-devtools/recompute'));
    /** @type {?} */
    var RECOMPUTE_ACTION = { type: RECOMPUTE };
    /**
     * @record
     */
    function ComputedState() { }
    if (false) {
        /** @type {?} */
        ComputedState.prototype.state;
        /** @type {?} */
        ComputedState.prototype.error;
    }
    /**
     * @record
     */
    function LiftedAction() { }
    if (false) {
        /** @type {?} */
        LiftedAction.prototype.type;
        /** @type {?} */
        LiftedAction.prototype.action;
    }
    /**
     * @record
     */
    function LiftedActions() { }
    /**
     * @record
     */
    function LiftedState() { }
    if (false) {
        /** @type {?} */
        LiftedState.prototype.monitorState;
        /** @type {?} */
        LiftedState.prototype.nextActionId;
        /** @type {?} */
        LiftedState.prototype.actionsById;
        /** @type {?} */
        LiftedState.prototype.stagedActionIds;
        /** @type {?} */
        LiftedState.prototype.skippedActionIds;
        /** @type {?} */
        LiftedState.prototype.committedState;
        /** @type {?} */
        LiftedState.prototype.currentStateIndex;
        /** @type {?} */
        LiftedState.prototype.computedStates;
        /** @type {?} */
        LiftedState.prototype.isLocked;
        /** @type {?} */
        LiftedState.prototype.isPaused;
    }
    /**
     * Computes the next entry in the log by applying an action.
     * @param {?} reducer
     * @param {?} action
     * @param {?} state
     * @param {?} error
     * @param {?} errorHandler
     * @return {?}
     */
    function computeNextEntry(reducer, action, state, error, errorHandler) {
        if (error) {
            return {
                state: state,
                error: 'Interrupted by an error up the chain',
            };
        }
        /** @type {?} */
        var nextState = state;
        /** @type {?} */
        var nextError;
        try {
            nextState = reducer(state, action);
        }
        catch (err) {
            nextError = err.toString();
            errorHandler.handleError(err.stack || err);
        }
        return {
            state: nextState,
            error: nextError,
        };
    }
    /**
     * Runs the reducer on invalidated actions to get a fresh computation log.
     * @param {?} computedStates
     * @param {?} minInvalidatedStateIndex
     * @param {?} reducer
     * @param {?} committedState
     * @param {?} actionsById
     * @param {?} stagedActionIds
     * @param {?} skippedActionIds
     * @param {?} errorHandler
     * @param {?} isPaused
     * @return {?}
     */
    function recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, errorHandler, isPaused) {
        // Optimization: exit early and return the same reference
        // if we know nothing could have changed.
        if (minInvalidatedStateIndex >= computedStates.length &&
            computedStates.length === stagedActionIds.length) {
            return computedStates;
        }
        /** @type {?} */
        var nextComputedStates = computedStates.slice(0, minInvalidatedStateIndex);
        // If the recording is paused, recompute all states up until the pause state,
        // else recompute all states.
        /** @type {?} */
        var lastIncludedActionId = stagedActionIds.length - (isPaused ? 1 : 0);
        for (var i = minInvalidatedStateIndex; i < lastIncludedActionId; i++) {
            /** @type {?} */
            var actionId = stagedActionIds[i];
            /** @type {?} */
            var action = actionsById[actionId].action;
            /** @type {?} */
            var previousEntry = nextComputedStates[i - 1];
            /** @type {?} */
            var previousState = previousEntry ? previousEntry.state : committedState;
            /** @type {?} */
            var previousError = previousEntry ? previousEntry.error : undefined;
            /** @type {?} */
            var shouldSkip = skippedActionIds.indexOf(actionId) > -1;
            /** @type {?} */
            var entry = shouldSkip
                ? previousEntry
                : computeNextEntry(reducer, action, previousState, previousError, errorHandler);
            nextComputedStates.push(entry);
        }
        // If the recording is paused, the last state will not be recomputed,
        // because it's essentially not part of the state history.
        if (isPaused) {
            nextComputedStates.push(computedStates[computedStates.length - 1]);
        }
        return nextComputedStates;
    }
    /**
     * @param {?=} initialCommittedState
     * @param {?=} monitorReducer
     * @return {?}
     */
    function liftInitialState(initialCommittedState, monitorReducer) {
        return {
            monitorState: monitorReducer(undefined, {}),
            nextActionId: 1,
            actionsById: { 0: liftAction(INIT_ACTION) },
            stagedActionIds: [0],
            skippedActionIds: [],
            committedState: initialCommittedState,
            currentStateIndex: 0,
            computedStates: [],
            isLocked: false,
            isPaused: false,
        };
    }
    /**
     * Creates a history state reducer from an app's reducer.
     * @param {?} initialCommittedState
     * @param {?} initialLiftedState
     * @param {?} errorHandler
     * @param {?=} monitorReducer
     * @param {?=} options
     * @return {?}
     */
    function liftReducerWith(initialCommittedState, initialLiftedState, errorHandler, monitorReducer, options) {
        if (options === void 0) { options = {}; }
        /**
         * Manages how the history actions modify the history state.
         */
        return ( /**
         * @param {?} reducer
         * @return {?}
         */function (reducer) { return ( /**
         * @param {?} liftedState
         * @param {?} liftedAction
         * @return {?}
         */function (liftedState, liftedAction) {
            var _a;
            var _b = liftedState || initialLiftedState, monitorState = _b.monitorState, actionsById = _b.actionsById, nextActionId = _b.nextActionId, stagedActionIds = _b.stagedActionIds, skippedActionIds = _b.skippedActionIds, committedState = _b.committedState, currentStateIndex = _b.currentStateIndex, computedStates = _b.computedStates, isLocked = _b.isLocked, isPaused = _b.isPaused;
            if (!liftedState) {
                // Prevent mutating initialLiftedState
                actionsById = Object.create(actionsById);
            }
            /**
             * @param {?} n
             * @return {?}
             */
            function commitExcessActions(n) {
                // Auto-commits n-number of excess actions.
                /** @type {?} */
                var excess = n;
                /** @type {?} */
                var idsToDelete = stagedActionIds.slice(1, excess + 1);
                for (var i = 0; i < idsToDelete.length; i++) {
                    if (computedStates[i + 1].error) {
                        // Stop if error is found. Commit actions up to error.
                        excess = i;
                        idsToDelete = stagedActionIds.slice(1, excess + 1);
                        break;
                    }
                    else {
                        delete actionsById[idsToDelete[i]];
                    }
                }
                skippedActionIds = skippedActionIds.filter(( /**
                 * @param {?} id
                 * @return {?}
                 */function (id) { return idsToDelete.indexOf(id) === -1; }));
                stagedActionIds = __spread([0], stagedActionIds.slice(excess + 1));
                committedState = computedStates[excess].state;
                computedStates = computedStates.slice(excess);
                currentStateIndex =
                    currentStateIndex > excess ? currentStateIndex - excess : 0;
            }
            /**
             * @return {?}
             */
            function commitChanges() {
                // Consider the last committed state the new starting point.
                // Squash any staged actions into a single committed state.
                actionsById = { 0: liftAction(INIT_ACTION) };
                nextActionId = 1;
                stagedActionIds = [0];
                skippedActionIds = [];
                committedState = computedStates[currentStateIndex].state;
                currentStateIndex = 0;
                computedStates = [];
            }
            // By default, aggressively recompute every state whatever happens.
            // This has O(n) performance, so we'll override this to a sensible
            // value whenever we feel like we don't have to recompute the states.
            /** @type {?} */
            var minInvalidatedStateIndex = 0;
            switch (liftedAction.type) {
                case LOCK_CHANGES: {
                    isLocked = liftedAction.status;
                    minInvalidatedStateIndex = Infinity;
                    break;
                }
                case PAUSE_RECORDING: {
                    isPaused = liftedAction.status;
                    if (isPaused) {
                        // Add a pause action to signal the devtools-user the recording is paused.
                        // The corresponding state will be overwritten on each update to always contain
                        // the latest state (see Actions.PERFORM_ACTION).
                        stagedActionIds = __spread(stagedActionIds, [nextActionId]);
                        actionsById[nextActionId] = new PerformAction({
                            type: '@ngrx/devtools/pause',
                        }, +Date.now());
                        nextActionId++;
                        minInvalidatedStateIndex = stagedActionIds.length - 1;
                        computedStates = computedStates.concat(computedStates[computedStates.length - 1]);
                        if (currentStateIndex === stagedActionIds.length - 2) {
                            currentStateIndex++;
                        }
                        minInvalidatedStateIndex = Infinity;
                    }
                    else {
                        commitChanges();
                    }
                    break;
                }
                case RESET: {
                    // Get back to the state the store was created with.
                    actionsById = { 0: liftAction(INIT_ACTION) };
                    nextActionId = 1;
                    stagedActionIds = [0];
                    skippedActionIds = [];
                    committedState = initialCommittedState;
                    currentStateIndex = 0;
                    computedStates = [];
                    break;
                }
                case COMMIT: {
                    commitChanges();
                    break;
                }
                case ROLLBACK: {
                    // Forget about any staged actions.
                    // Start again from the last committed state.
                    actionsById = { 0: liftAction(INIT_ACTION) };
                    nextActionId = 1;
                    stagedActionIds = [0];
                    skippedActionIds = [];
                    currentStateIndex = 0;
                    computedStates = [];
                    break;
                }
                case TOGGLE_ACTION: {
                    // Toggle whether an action with given ID is skipped.
                    // Being skipped means it is a no-op during the computation.
                    var actionId_1 = liftedAction.id;
                    /** @type {?} */
                    var index = skippedActionIds.indexOf(actionId_1);
                    if (index === -1) {
                        skippedActionIds = __spread([actionId_1], skippedActionIds);
                    }
                    else {
                        skippedActionIds = skippedActionIds.filter(( /**
                         * @param {?} id
                         * @return {?}
                         */function (id) { return id !== actionId_1; }));
                    }
                    // Optimization: we know history before this action hasn't changed
                    minInvalidatedStateIndex = stagedActionIds.indexOf(actionId_1);
                    break;
                }
                case SET_ACTIONS_ACTIVE: {
                    // Toggle whether an action with given ID is skipped.
                    // Being skipped means it is a no-op during the computation.
                    var start = liftedAction.start, end = liftedAction.end, active = liftedAction.active;
                    /** @type {?} */
                    var actionIds = [];
                    for (var i = start; i < end; i++)
                        actionIds.push(i);
                    if (active) {
                        skippedActionIds = difference(skippedActionIds, actionIds);
                    }
                    else {
                        skippedActionIds = __spread(skippedActionIds, actionIds);
                    }
                    // Optimization: we know history before this action hasn't changed
                    minInvalidatedStateIndex = stagedActionIds.indexOf(start);
                    break;
                }
                case JUMP_TO_STATE: {
                    // Without recomputing anything, move the pointer that tell us
                    // which state is considered the current one. Useful for sliders.
                    currentStateIndex = liftedAction.index;
                    // Optimization: we know the history has not changed.
                    minInvalidatedStateIndex = Infinity;
                    break;
                }
                case JUMP_TO_ACTION: {
                    // Jumps to a corresponding state to a specific action.
                    // Useful when filtering actions.
                    /** @type {?} */
                    var index = stagedActionIds.indexOf(liftedAction.actionId);
                    if (index !== -1)
                        currentStateIndex = index;
                    minInvalidatedStateIndex = Infinity;
                    break;
                }
                case SWEEP: {
                    // Forget any actions that are currently being skipped.
                    stagedActionIds = difference(stagedActionIds, skippedActionIds);
                    skippedActionIds = [];
                    currentStateIndex = Math.min(currentStateIndex, stagedActionIds.length - 1);
                    break;
                }
                case PERFORM_ACTION: {
                    // Ignore action and return state as is if recording is locked
                    if (isLocked) {
                        return liftedState || initialLiftedState;
                    }
                    if (isPaused ||
                        (liftedState &&
                            isActionFiltered(liftedState.computedStates[currentStateIndex], liftedAction, options.predicate, options.actionsSafelist, options.actionsBlocklist))) {
                        // If recording is paused or if the action should be ignored, overwrite the last state
                        // (corresponds to the pause action) and keep everything else as is.
                        // This way, the app gets the new current state while the devtools
                        // do not record another action.
                        /** @type {?} */
                        var lastState = computedStates[computedStates.length - 1];
                        computedStates = __spread(computedStates.slice(0, -1), [
                            computeNextEntry(reducer, liftedAction.action, lastState.state, lastState.error, errorHandler),
                        ]);
                        minInvalidatedStateIndex = Infinity;
                        break;
                    }
                    // Auto-commit as new actions come in.
                    if (options.maxAge && stagedActionIds.length === options.maxAge) {
                        commitExcessActions(1);
                    }
                    if (currentStateIndex === stagedActionIds.length - 1) {
                        currentStateIndex++;
                    }
                    /** @type {?} */
                    var actionId = nextActionId++;
                    // Mutation! This is the hottest path, and we optimize on purpose.
                    // It is safe because we set a new key in a cache dictionary.
                    actionsById[actionId] = liftedAction;
                    stagedActionIds = __spread(stagedActionIds, [actionId]);
                    // Optimization: we know that only the new action needs computing.
                    minInvalidatedStateIndex = stagedActionIds.length - 1;
                    break;
                }
                case IMPORT_STATE: {
                    // Completely replace everything.
                    (_a = liftedAction.nextLiftedState, monitorState = _a.monitorState, actionsById = _a.actionsById, nextActionId = _a.nextActionId, stagedActionIds = _a.stagedActionIds, skippedActionIds = _a.skippedActionIds, committedState = _a.committedState, currentStateIndex = _a.currentStateIndex, computedStates = _a.computedStates, isLocked = _a.isLocked, 
                    // prettier-ignore
                    isPaused = _a.isPaused);
                    break;
                }
                case store.INIT: {
                    // Always recompute states on hot reload and init.
                    minInvalidatedStateIndex = 0;
                    if (options.maxAge && stagedActionIds.length > options.maxAge) {
                        // States must be recomputed before committing excess.
                        computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, errorHandler, isPaused);
                        commitExcessActions(stagedActionIds.length - options.maxAge);
                        // Avoid double computation.
                        minInvalidatedStateIndex = Infinity;
                    }
                    break;
                }
                case store.UPDATE: {
                    /** @type {?} */
                    var stateHasErrors = computedStates.filter(( /**
                     * @param {?} state
                     * @return {?}
                     */function (state) { return state.error; })).length > 0;
                    if (stateHasErrors) {
                        // Recompute all states
                        minInvalidatedStateIndex = 0;
                        if (options.maxAge && stagedActionIds.length > options.maxAge) {
                            // States must be recomputed before committing excess.
                            computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, errorHandler, isPaused);
                            commitExcessActions(stagedActionIds.length - options.maxAge);
                            // Avoid double computation.
                            minInvalidatedStateIndex = Infinity;
                        }
                    }
                    else {
                        // If not paused/locked, add a new action to signal devtools-user
                        // that there was a reducer update.
                        if (!isPaused && !isLocked) {
                            if (currentStateIndex === stagedActionIds.length - 1) {
                                currentStateIndex++;
                            }
                            // Add a new action to only recompute state
                            /** @type {?} */
                            var actionId = nextActionId++;
                            actionsById[actionId] = new PerformAction(liftedAction, +Date.now());
                            stagedActionIds = __spread(stagedActionIds, [actionId]);
                            minInvalidatedStateIndex = stagedActionIds.length - 1;
                            computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, errorHandler, isPaused);
                        }
                        // Recompute state history with latest reducer and update action
                        computedStates = computedStates.map(( /**
                         * @param {?} cmp
                         * @return {?}
                         */function (cmp) { return (Object.assign(Object.assign({}, cmp), { state: reducer(cmp.state, RECOMPUTE_ACTION) })); }));
                        currentStateIndex = stagedActionIds.length - 1;
                        if (options.maxAge && stagedActionIds.length > options.maxAge) {
                            commitExcessActions(stagedActionIds.length - options.maxAge);
                        }
                        // Avoid double computation.
                        minInvalidatedStateIndex = Infinity;
                    }
                    break;
                }
                default: {
                    // If the action is not recognized, it's a monitor action.
                    // Optimization: a monitor action can't change history.
                    minInvalidatedStateIndex = Infinity;
                    break;
                }
            }
            computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, errorHandler, isPaused);
            monitorState = monitorReducer(monitorState, liftedAction);
            return {
                monitorState: monitorState,
                actionsById: actionsById,
                nextActionId: nextActionId,
                stagedActionIds: stagedActionIds,
                skippedActionIds: skippedActionIds,
                committedState: committedState,
                currentStateIndex: currentStateIndex,
                computedStates: computedStates,
                isLocked: isLocked,
                isPaused: isPaused,
            };
        }); });
    }

    var StoreDevtools = /** @class */ (function () {
        /**
         * @param {?} dispatcher
         * @param {?} actions$
         * @param {?} reducers$
         * @param {?} extension
         * @param {?} scannedActions
         * @param {?} errorHandler
         * @param {?} initialState
         * @param {?} config
         */
        function StoreDevtools(dispatcher, actions$, reducers$, extension, scannedActions, errorHandler, initialState, config) {
            var _this = this;
            /** @type {?} */
            var liftedInitialState = liftInitialState(initialState, config.monitor);
            /** @type {?} */
            var liftReducer = liftReducerWith(initialState, liftedInitialState, errorHandler, config.monitor, config);
            /** @type {?} */
            var liftedAction$ = rxjs.merge(rxjs.merge(actions$.asObservable().pipe(operators.skip(1)), extension.actions$).pipe(operators.map(liftAction)), dispatcher, extension.liftedActions$).pipe(operators.observeOn(rxjs.queueScheduler));
            /** @type {?} */
            var liftedReducer$ = reducers$.pipe(operators.map(liftReducer));
            /** @type {?} */
            var liftedStateSubject = new rxjs.ReplaySubject(1);
            /** @type {?} */
            var liftedStateSubscription = liftedAction$
                .pipe(operators.withLatestFrom(liftedReducer$), operators.scan(( /**
         * @param {?} __0
         * @param {?} __1
         * @return {?}
         */function (_a, _b) {
                var liftedState = _a.state;
                var _c = __read(_b, 2), action = _c[0], reducer = _c[1];
                /** @type {?} */
                var reducedLiftedState = reducer(liftedState, action);
                // On full state update
                // If we have actions filters, we must filter completely our lifted state to be sync with the extension
                if (action.type !== PERFORM_ACTION && shouldFilterActions(config)) {
                    reducedLiftedState = filterLiftedState(reducedLiftedState, config.predicate, config.actionsSafelist, config.actionsBlocklist);
                }
                // Extension should be sent the sanitized lifted state
                extension.notify(action, reducedLiftedState);
                return { state: reducedLiftedState, action: action };
            }), { state: liftedInitialState, action: ( /** @type {?} */(null)) }))
                .subscribe(( /**
         * @param {?} __0
         * @return {?}
         */function (_a) {
                var state = _a.state, action = _a.action;
                liftedStateSubject.next(state);
                if (action.type === PERFORM_ACTION) {
                    /** @type {?} */
                    var unliftedAction = (( /** @type {?} */(action))).action;
                    scannedActions.next(unliftedAction);
                }
            }));
            /** @type {?} */
            var extensionStartSubscription = extension.start$.subscribe(( /**
             * @return {?}
             */function () {
                _this.refresh();
            }));
            /** @type {?} */
            var liftedState$ = ( /** @type {?} */(liftedStateSubject.asObservable()));
            /** @type {?} */
            var state$ = liftedState$.pipe(operators.map(unliftState));
            this.extensionStartSubscription = extensionStartSubscription;
            this.stateSubscription = liftedStateSubscription;
            this.dispatcher = dispatcher;
            this.liftedState = liftedState$;
            this.state = state$;
        }
        /**
         * @param {?} action
         * @return {?}
         */
        StoreDevtools.prototype.dispatch = function (action) {
            this.dispatcher.next(action);
        };
        /**
         * @param {?} action
         * @return {?}
         */
        StoreDevtools.prototype.next = function (action) {
            this.dispatcher.next(action);
        };
        /**
         * @param {?} error
         * @return {?}
         */
        StoreDevtools.prototype.error = function (error) { };
        /**
         * @return {?}
         */
        StoreDevtools.prototype.complete = function () { };
        /**
         * @param {?} action
         * @return {?}
         */
        StoreDevtools.prototype.performAction = function (action) {
            this.dispatch(new PerformAction(action, +Date.now()));
        };
        /**
         * @return {?}
         */
        StoreDevtools.prototype.refresh = function () {
            this.dispatch(new Refresh());
        };
        /**
         * @return {?}
         */
        StoreDevtools.prototype.reset = function () {
            this.dispatch(new Reset(+Date.now()));
        };
        /**
         * @return {?}
         */
        StoreDevtools.prototype.rollback = function () {
            this.dispatch(new Rollback(+Date.now()));
        };
        /**
         * @return {?}
         */
        StoreDevtools.prototype.commit = function () {
            this.dispatch(new Commit(+Date.now()));
        };
        /**
         * @return {?}
         */
        StoreDevtools.prototype.sweep = function () {
            this.dispatch(new Sweep());
        };
        /**
         * @param {?} id
         * @return {?}
         */
        StoreDevtools.prototype.toggleAction = function (id) {
            this.dispatch(new ToggleAction(id));
        };
        /**
         * @param {?} actionId
         * @return {?}
         */
        StoreDevtools.prototype.jumpToAction = function (actionId) {
            this.dispatch(new JumpToAction(actionId));
        };
        /**
         * @param {?} index
         * @return {?}
         */
        StoreDevtools.prototype.jumpToState = function (index) {
            this.dispatch(new JumpToState(index));
        };
        /**
         * @param {?} nextLiftedState
         * @return {?}
         */
        StoreDevtools.prototype.importState = function (nextLiftedState) {
            this.dispatch(new ImportState(nextLiftedState));
        };
        /**
         * @param {?} status
         * @return {?}
         */
        StoreDevtools.prototype.lockChanges = function (status) {
            this.dispatch(new LockChanges(status));
        };
        /**
         * @param {?} status
         * @return {?}
         */
        StoreDevtools.prototype.pauseRecording = function (status) {
            this.dispatch(new PauseRecording(status));
        };
        return StoreDevtools;
    }());
    StoreDevtools.decorators = [
        { type: core.Injectable }
    ];
    /** @nocollapse */
    StoreDevtools.ctorParameters = function () { return [
        { type: DevtoolsDispatcher },
        { type: store.ActionsSubject },
        { type: store.ReducerObservable },
        { type: DevtoolsExtension },
        { type: store.ScannedActionsSubject },
        { type: core.ErrorHandler },
        { type: undefined, decorators: [{ type: core.Inject, args: [store.INITIAL_STATE,] }] },
        { type: StoreDevtoolsConfig, decorators: [{ type: core.Inject, args: [STORE_DEVTOOLS_CONFIG,] }] }
    ]; };
    if (false) {
        /**
         * @type {?}
         * @private
         */
        StoreDevtools.prototype.stateSubscription;
        /**
         * @type {?}
         * @private
         */
        StoreDevtools.prototype.extensionStartSubscription;
        /** @type {?} */
        StoreDevtools.prototype.dispatcher;
        /** @type {?} */
        StoreDevtools.prototype.liftedState;
        /** @type {?} */
        StoreDevtools.prototype.state;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/instrument.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var IS_EXTENSION_OR_MONITOR_PRESENT = new core.InjectionToken('Is Devtools Extension or Monitor Present');
    /**
     * @param {?} extension
     * @param {?} config
     * @return {?}
     */
    function createIsExtensionOrMonitorPresent(extension, config) {
        return Boolean(extension) || config.monitor !== noMonitor;
    }
    /**
     * @return {?}
     */
    function createReduxDevtoolsExtension() {
        /** @type {?} */
        var extensionKey = '__REDUX_DEVTOOLS_EXTENSION__';
        if (typeof window === 'object' &&
            typeof (( /** @type {?} */(window)))[extensionKey] !== 'undefined') {
            return (( /** @type {?} */(window)))[extensionKey];
        }
        else {
            return null;
        }
    }
    /**
     * @param {?} devtools
     * @return {?}
     */
    function createStateObservable(devtools) {
        return devtools.state;
    }
    var StoreDevtoolsModule = /** @class */ (function () {
        function StoreDevtoolsModule() {
        }
        /**
         * @param {?=} options
         * @return {?}
         */
        StoreDevtoolsModule.instrument = function (options) {
            if (options === void 0) { options = {}; }
            return {
                ngModule: StoreDevtoolsModule,
                providers: [
                    DevtoolsExtension,
                    DevtoolsDispatcher,
                    StoreDevtools,
                    {
                        provide: INITIAL_OPTIONS,
                        useValue: options,
                    },
                    {
                        provide: IS_EXTENSION_OR_MONITOR_PRESENT,
                        deps: [REDUX_DEVTOOLS_EXTENSION, STORE_DEVTOOLS_CONFIG],
                        useFactory: createIsExtensionOrMonitorPresent,
                    },
                    {
                        provide: REDUX_DEVTOOLS_EXTENSION,
                        useFactory: createReduxDevtoolsExtension,
                    },
                    {
                        provide: STORE_DEVTOOLS_CONFIG,
                        deps: [INITIAL_OPTIONS],
                        useFactory: createConfig,
                    },
                    {
                        provide: store.StateObservable,
                        deps: [StoreDevtools],
                        useFactory: createStateObservable,
                    },
                    {
                        provide: store.ReducerManagerDispatcher,
                        useExisting: DevtoolsDispatcher,
                    },
                ],
            };
        };
        return StoreDevtoolsModule;
    }());
    StoreDevtoolsModule.decorators = [
        { type: core.NgModule, args: [{},] }
    ];

    /**
     * @fileoverview added by tsickle
     * Generated from: src/index.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * Generated from: public_api.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * Generated from: index.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * Generated from: ngrx-store-devtools.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    exports.INITIAL_OPTIONS = INITIAL_OPTIONS;
    exports.RECOMPUTE = RECOMPUTE;
    exports.StoreDevtools = StoreDevtools;
    exports.StoreDevtoolsConfig = StoreDevtoolsConfig;
    exports.StoreDevtoolsModule = StoreDevtoolsModule;
    exports.ɵa = IS_EXTENSION_OR_MONITOR_PRESENT;
    exports.ɵb = createIsExtensionOrMonitorPresent;
    exports.ɵc = createReduxDevtoolsExtension;
    exports.ɵd = createStateObservable;
    exports.ɵe = STORE_DEVTOOLS_CONFIG;
    exports.ɵf = noMonitor;
    exports.ɵg = createConfig;
    exports.ɵh = REDUX_DEVTOOLS_EXTENSION;
    exports.ɵi = DevtoolsExtension;
    exports.ɵj = DevtoolsDispatcher;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngrx-store-devtools.umd.js.map
