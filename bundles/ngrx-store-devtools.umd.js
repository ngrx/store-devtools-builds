(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@ngrx/store'), require('rxjs'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('@ngrx/store-devtools', ['exports', '@angular/core', '@ngrx/store', 'rxjs', 'rxjs/operators'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.ngrx = global.ngrx || {}, global.ngrx['store-devtools'] = {}), global.ng.core, global.ngrx.store, global.rxjs, global.rxjs.operators));
}(this, (function (exports, core, store, rxjs, operators) { 'use strict';

    var StoreDevtoolsConfig = /** @class */ (function () {
        function StoreDevtoolsConfig() {
            this.maxAge = false;
        }
        return StoreDevtoolsConfig;
    }());
    var STORE_DEVTOOLS_CONFIG = new core.InjectionToken('@ngrx/store-devtools Options');
    var INITIAL_OPTIONS = new core.InjectionToken('@ngrx/store-devtools Initial Config');
    function noMonitor() {
        return null;
    }
    var DEFAULT_NAME = 'NgRx Store DevTools';
    function createConfig(optionsInput) {
        var DEFAULT_OPTIONS = {
            maxAge: false,
            monitor: noMonitor,
            actionSanitizer: undefined,
            stateSanitizer: undefined,
            name: DEFAULT_NAME,
            serialize: false,
            logOnly: false,
            autoPause: false,
            // Add all features explicitly. This prevent buggy behavior for
            // options like "lock" which might otherwise not show up.
            features: {
                pause: true,
                lock: true,
                persist: true,
                export: true,
                import: 'custom',
                jump: true,
                skip: true,
                reorder: true,
                dispatch: true,
                test: true, // generate tests for the selected actions
            },
        };
        var options = typeof optionsInput === 'function' ? optionsInput() : optionsInput;
        var logOnly = options.logOnly
            ? { pause: true, export: true, test: true }
            : false;
        var features = options.features || logOnly || DEFAULT_OPTIONS.features;
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
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
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
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    }
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
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m")
            throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    var PERFORM_ACTION = 'PERFORM_ACTION';
    var REFRESH = 'REFRESH';
    var RESET = 'RESET';
    var ROLLBACK = 'ROLLBACK';
    var COMMIT = 'COMMIT';
    var SWEEP = 'SWEEP';
    var TOGGLE_ACTION = 'TOGGLE_ACTION';
    var SET_ACTIONS_ACTIVE = 'SET_ACTIONS_ACTIVE';
    var JUMP_TO_STATE = 'JUMP_TO_STATE';
    var JUMP_TO_ACTION = 'JUMP_TO_ACTION';
    var IMPORT_STATE = 'IMPORT_STATE';
    var LOCK_CHANGES = 'LOCK_CHANGES';
    var PAUSE_RECORDING = 'PAUSE_RECORDING';
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
    var Refresh = /** @class */ (function () {
        function Refresh() {
            this.type = REFRESH;
        }
        return Refresh;
    }());
    var Reset = /** @class */ (function () {
        function Reset(timestamp) {
            this.timestamp = timestamp;
            this.type = RESET;
        }
        return Reset;
    }());
    var Rollback = /** @class */ (function () {
        function Rollback(timestamp) {
            this.timestamp = timestamp;
            this.type = ROLLBACK;
        }
        return Rollback;
    }());
    var Commit = /** @class */ (function () {
        function Commit(timestamp) {
            this.timestamp = timestamp;
            this.type = COMMIT;
        }
        return Commit;
    }());
    var Sweep = /** @class */ (function () {
        function Sweep() {
            this.type = SWEEP;
        }
        return Sweep;
    }());
    var ToggleAction = /** @class */ (function () {
        function ToggleAction(id) {
            this.id = id;
            this.type = TOGGLE_ACTION;
        }
        return ToggleAction;
    }());
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
    var JumpToState = /** @class */ (function () {
        function JumpToState(index) {
            this.index = index;
            this.type = JUMP_TO_STATE;
        }
        return JumpToState;
    }());
    var JumpToAction = /** @class */ (function () {
        function JumpToAction(actionId) {
            this.actionId = actionId;
            this.type = JUMP_TO_ACTION;
        }
        return JumpToAction;
    }());
    var ImportState = /** @class */ (function () {
        function ImportState(nextLiftedState) {
            this.nextLiftedState = nextLiftedState;
            this.type = IMPORT_STATE;
        }
        return ImportState;
    }());
    var LockChanges = /** @class */ (function () {
        function LockChanges(status) {
            this.status = status;
            this.type = LOCK_CHANGES;
        }
        return LockChanges;
    }());
    var PauseRecording = /** @class */ (function () {
        function PauseRecording(status) {
            this.status = status;
            this.type = PAUSE_RECORDING;
        }
        return PauseRecording;
    }());

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

    function difference(first, second) {
        return first.filter(function (item) { return second.indexOf(item) < 0; });
    }
    /**
     * Provides an app's view into the state of the lifted store.
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
    function unliftAction(liftedState) {
        return liftedState.actionsById[liftedState.nextActionId - 1];
    }
    /**
     * Lifts an app's action into an action on the lifted store.
     */
    function liftAction(action) {
        return new PerformAction(action, +Date.now());
    }
    /**
     * Sanitizes given actions with given function.
     */
    function sanitizeActions(actionSanitizer, actions) {
        return Object.keys(actions).reduce(function (sanitizedActions, actionIdx) {
            var idx = Number(actionIdx);
            sanitizedActions[idx] = sanitizeAction(actionSanitizer, actions[idx], idx);
            return sanitizedActions;
        }, {});
    }
    /**
     * Sanitizes given action with given function.
     */
    function sanitizeAction(actionSanitizer, action, actionIdx) {
        return Object.assign(Object.assign({}, action), { action: actionSanitizer(action.action, actionIdx) });
    }
    /**
     * Sanitizes given states with given function.
     */
    function sanitizeStates(stateSanitizer, states) {
        return states.map(function (computedState, idx) { return ({
            state: sanitizeState(stateSanitizer, computedState.state, idx),
            error: computedState.error,
        }); });
    }
    /**
     * Sanitizes given state with given function.
     */
    function sanitizeState(stateSanitizer, state, stateIdx) {
        return stateSanitizer(state, stateIdx);
    }
    /**
     * Read the config and tell if actions should be filtered
     */
    function shouldFilterActions(config) {
        return config.predicate || config.actionsSafelist || config.actionsBlocklist;
    }
    /**
     * Return a full filtered lifted state
     */
    function filterLiftedState(liftedState, predicate, safelist, blocklist) {
        var filteredStagedActionIds = [];
        var filteredActionsById = {};
        var filteredComputedStates = [];
        liftedState.stagedActionIds.forEach(function (id, idx) {
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
        });
        return Object.assign(Object.assign({}, liftedState), { stagedActionIds: filteredStagedActionIds, actionsById: filteredActionsById, computedStates: filteredComputedStates });
    }
    /**
     * Return true is the action should be ignored
     */
    function isActionFiltered(state, action, predicate, safelist, blockedlist) {
        var predicateMatch = predicate && !predicate(state, action.action);
        var safelistMatch = safelist &&
            !action.action.type.match(safelist.map(function (s) { return escapeRegExp(s); }).join('|'));
        var blocklistMatch = blockedlist &&
            action.action.type.match(blockedlist.map(function (s) { return escapeRegExp(s); }).join('|'));
        return predicateMatch || safelistMatch || blocklistMatch;
    }
    /**
     * Return string with escaped RegExp special characters
     * https://stackoverflow.com/a/6969486/1337347
     */
    function escapeRegExp(s) {
        return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    var ExtensionActionTypes = {
        START: 'START',
        DISPATCH: 'DISPATCH',
        STOP: 'STOP',
        ACTION: 'ACTION',
    };
    var REDUX_DEVTOOLS_EXTENSION = new core.InjectionToken('@ngrx/store-devtools Redux Devtools Extension');
    var DevtoolsExtension = /** @class */ (function () {
        function DevtoolsExtension(devtoolsExtension, config, dispatcher) {
            this.config = config;
            this.dispatcher = dispatcher;
            this.devtoolsExtension = devtoolsExtension;
            this.createActionStreams();
        }
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
                var currentState = unliftState(state);
                if (shouldFilterActions(this.config) &&
                    isActionFiltered(currentState, action, this.config.predicate, this.config.actionsSafelist, this.config.actionsBlocklist)) {
                    return;
                }
                var sanitizedState_1 = this.config.stateSanitizer
                    ? sanitizeState(this.config.stateSanitizer, currentState, state.currentStateIndex)
                    : currentState;
                var sanitizedAction_1 = this.config.actionSanitizer
                    ? sanitizeAction(this.config.actionSanitizer, action, state.nextActionId)
                    : action;
                this.sendToReduxDevtools(function () { return _this.extensionConnection.send(sanitizedAction_1, sanitizedState_1); });
            }
            else {
                // Requires full state update
                var sanitizedLiftedState_1 = Object.assign(Object.assign({}, state), { stagedActionIds: state.stagedActionIds, actionsById: this.config.actionSanitizer
                        ? sanitizeActions(this.config.actionSanitizer, state.actionsById)
                        : state.actionsById, computedStates: this.config.stateSanitizer
                        ? sanitizeStates(this.config.stateSanitizer, state.computedStates)
                        : state.computedStates });
                this.sendToReduxDevtools(function () { return _this.devtoolsExtension.send(null, sanitizedLiftedState_1, _this.getExtensionConfig(_this.config)); });
            }
        };
        DevtoolsExtension.prototype.createChangesObservable = function () {
            var _this = this;
            if (!this.devtoolsExtension) {
                return rxjs.EMPTY;
            }
            return new rxjs.Observable(function (subscriber) {
                var connection = _this.devtoolsExtension.connect(_this.getExtensionConfig(_this.config));
                _this.extensionConnection = connection;
                connection.init();
                connection.subscribe(function (change) { return subscriber.next(change); });
                return connection.unsubscribe;
            });
        };
        DevtoolsExtension.prototype.createActionStreams = function () {
            var _this = this;
            // Listens to all changes
            var changes$ = this.createChangesObservable().pipe(operators.share());
            // Listen for the start action
            var start$ = changes$.pipe(operators.filter(function (change) { return change.type === ExtensionActionTypes.START; }));
            // Listen for the stop action
            var stop$ = changes$.pipe(operators.filter(function (change) { return change.type === ExtensionActionTypes.STOP; }));
            // Listen for lifted actions
            var liftedActions$ = changes$.pipe(operators.filter(function (change) { return change.type === ExtensionActionTypes.DISPATCH; }), operators.map(function (change) { return _this.unwrapAction(change.payload); }), operators.concatMap(function (action) {
                if (action.type === IMPORT_STATE) {
                    // State imports may happen in two situations:
                    // 1. Explicitly by user
                    // 2. User activated the "persist state accross reloads" option
                    //    and now the state is imported during reload.
                    // Because of option 2, we need to give possible
                    // lazy loaded reducers time to instantiate.
                    // As soon as there is no UPDATE action within 1 second,
                    // it is assumed that all reducers are loaded.
                    return _this.dispatcher.pipe(operators.filter(function (action) { return action.type === store.UPDATE; }), operators.timeout(1000), operators.debounceTime(1000), operators.map(function () { return action; }), operators.catchError(function () { return rxjs.of(action); }), operators.take(1));
                }
                else {
                    return rxjs.of(action);
                }
            }));
            // Listen for unlifted actions
            var actions$ = changes$.pipe(operators.filter(function (change) { return change.type === ExtensionActionTypes.ACTION; }), operators.map(function (change) { return _this.unwrapAction(change.payload); }));
            var actionsUntilStop$ = actions$.pipe(operators.takeUntil(stop$));
            var liftedUntilStop$ = liftedActions$.pipe(operators.takeUntil(stop$));
            this.start$ = start$.pipe(operators.takeUntil(stop$));
            // Only take the action sources between the start/stop events
            this.actions$ = this.start$.pipe(operators.switchMap(function () { return actionsUntilStop$; }));
            this.liftedActions$ = this.start$.pipe(operators.switchMap(function () { return liftedUntilStop$; }));
        };
        DevtoolsExtension.prototype.unwrapAction = function (action) {
            return typeof action === 'string' ? eval("(" + action + ")") : action;
        };
        DevtoolsExtension.prototype.getExtensionConfig = function (config) {
            var _a;
            var extensionOptions = {
                name: config.name,
                features: config.features,
                serialize: config.serialize,
                autoPause: (_a = config.autoPause) !== null && _a !== void 0 ? _a : false,
                // The action/state sanitizers are not added to the config
                // because sanitation is done in this class already.
                // It is done before sending it to the devtools extension for consistency:
                // - If we call extensionConnection.send(...),
                //   the extension would call the sanitizers.
                // - If we call devtoolsExtension.send(...) (aka full state update),
                //   the extension would NOT call the sanitizers, so we have to do it ourselves.
            };
            if (config.maxAge !== false /* support === 0 */) {
                extensionOptions.maxAge = config.maxAge;
            }
            return extensionOptions;
        };
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

    var INIT_ACTION = { type: store.INIT };
    var RECOMPUTE = '@ngrx/store-devtools/recompute';
    var RECOMPUTE_ACTION = { type: RECOMPUTE };
    /**
     * Computes the next entry in the log by applying an action.
     */
    function computeNextEntry(reducer, action, state, error, errorHandler) {
        if (error) {
            return {
                state: state,
                error: 'Interrupted by an error up the chain',
            };
        }
        var nextState = state;
        var nextError;
        try {
            nextState = reducer(state, action);
        }
        catch (err) {
            nextError = err.toString();
            errorHandler.handleError(err);
        }
        return {
            state: nextState,
            error: nextError,
        };
    }
    /**
     * Runs the reducer on invalidated actions to get a fresh computation log.
     */
    function recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, errorHandler, isPaused) {
        // Optimization: exit early and return the same reference
        // if we know nothing could have changed.
        if (minInvalidatedStateIndex >= computedStates.length &&
            computedStates.length === stagedActionIds.length) {
            return computedStates;
        }
        var nextComputedStates = computedStates.slice(0, minInvalidatedStateIndex);
        // If the recording is paused, recompute all states up until the pause state,
        // else recompute all states.
        var lastIncludedActionId = stagedActionIds.length - (isPaused ? 1 : 0);
        for (var i = minInvalidatedStateIndex; i < lastIncludedActionId; i++) {
            var actionId = stagedActionIds[i];
            var action = actionsById[actionId].action;
            var previousEntry = nextComputedStates[i - 1];
            var previousState = previousEntry ? previousEntry.state : committedState;
            var previousError = previousEntry ? previousEntry.error : undefined;
            var shouldSkip = skippedActionIds.indexOf(actionId) > -1;
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
     */
    function liftReducerWith(initialCommittedState, initialLiftedState, errorHandler, monitorReducer, options) {
        if (options === void 0) { options = {}; }
        /**
         * Manages how the history actions modify the history state.
         */
        return function (reducer) { return function (liftedState, liftedAction) {
            var _a;
            var _b = liftedState || initialLiftedState, monitorState = _b.monitorState, actionsById = _b.actionsById, nextActionId = _b.nextActionId, stagedActionIds = _b.stagedActionIds, skippedActionIds = _b.skippedActionIds, committedState = _b.committedState, currentStateIndex = _b.currentStateIndex, computedStates = _b.computedStates, isLocked = _b.isLocked, isPaused = _b.isPaused;
            if (!liftedState) {
                // Prevent mutating initialLiftedState
                actionsById = Object.create(actionsById);
            }
            function commitExcessActions(n) {
                // Auto-commits n-number of excess actions.
                var excess = n;
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
                skippedActionIds = skippedActionIds.filter(function (id) { return idsToDelete.indexOf(id) === -1; });
                stagedActionIds = __spreadArray([0], __read(stagedActionIds.slice(excess + 1)));
                committedState = computedStates[excess].state;
                computedStates = computedStates.slice(excess);
                currentStateIndex =
                    currentStateIndex > excess ? currentStateIndex - excess : 0;
            }
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
                        stagedActionIds = __spreadArray(__spreadArray([], __read(stagedActionIds)), [nextActionId]);
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
                    var index = skippedActionIds.indexOf(actionId_1);
                    if (index === -1) {
                        skippedActionIds = __spreadArray([actionId_1], __read(skippedActionIds));
                    }
                    else {
                        skippedActionIds = skippedActionIds.filter(function (id) { return id !== actionId_1; });
                    }
                    // Optimization: we know history before this action hasn't changed
                    minInvalidatedStateIndex = stagedActionIds.indexOf(actionId_1);
                    break;
                }
                case SET_ACTIONS_ACTIVE: {
                    // Toggle whether an action with given ID is skipped.
                    // Being skipped means it is a no-op during the computation.
                    var start = liftedAction.start, end = liftedAction.end, active = liftedAction.active;
                    var actionIds = [];
                    for (var i = start; i < end; i++)
                        actionIds.push(i);
                    if (active) {
                        skippedActionIds = difference(skippedActionIds, actionIds);
                    }
                    else {
                        skippedActionIds = __spreadArray(__spreadArray([], __read(skippedActionIds)), __read(actionIds));
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
                        var lastState = computedStates[computedStates.length - 1];
                        computedStates = __spreadArray(__spreadArray([], __read(computedStates.slice(0, -1))), [
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
                    var actionId = nextActionId++;
                    // Mutation! This is the hottest path, and we optimize on purpose.
                    // It is safe because we set a new key in a cache dictionary.
                    actionsById[actionId] = liftedAction;
                    stagedActionIds = __spreadArray(__spreadArray([], __read(stagedActionIds)), [actionId]);
                    // Optimization: we know that only the new action needs computing.
                    minInvalidatedStateIndex = stagedActionIds.length - 1;
                    break;
                }
                case IMPORT_STATE: {
                    // Completely replace everything.
                    (_a = liftedAction.nextLiftedState, monitorState = _a.monitorState, actionsById = _a.actionsById, nextActionId = _a.nextActionId, stagedActionIds = _a.stagedActionIds, skippedActionIds = _a.skippedActionIds, committedState = _a.committedState, currentStateIndex = _a.currentStateIndex, computedStates = _a.computedStates, isLocked = _a.isLocked, isPaused = _a.isPaused);
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
                    var stateHasErrors = computedStates.filter(function (state) { return state.error; }).length > 0;
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
                            var actionId = nextActionId++;
                            actionsById[actionId] = new PerformAction(liftedAction, +Date.now());
                            stagedActionIds = __spreadArray(__spreadArray([], __read(stagedActionIds)), [actionId]);
                            minInvalidatedStateIndex = stagedActionIds.length - 1;
                            computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, errorHandler, isPaused);
                        }
                        // Recompute state history with latest reducer and update action
                        computedStates = computedStates.map(function (cmp) { return (Object.assign(Object.assign({}, cmp), { state: reducer(cmp.state, RECOMPUTE_ACTION) })); });
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
        }; };
    }

    var StoreDevtools = /** @class */ (function () {
        function StoreDevtools(dispatcher, actions$, reducers$, extension, scannedActions, errorHandler, initialState, config) {
            var _this = this;
            var liftedInitialState = liftInitialState(initialState, config.monitor);
            var liftReducer = liftReducerWith(initialState, liftedInitialState, errorHandler, config.monitor, config);
            var liftedAction$ = rxjs.merge(rxjs.merge(actions$.asObservable().pipe(operators.skip(1)), extension.actions$).pipe(operators.map(liftAction)), dispatcher, extension.liftedActions$).pipe(operators.observeOn(rxjs.queueScheduler));
            var liftedReducer$ = reducers$.pipe(operators.map(liftReducer));
            var liftedStateSubject = new rxjs.ReplaySubject(1);
            var liftedStateSubscription = liftedAction$
                .pipe(operators.withLatestFrom(liftedReducer$), operators.scan(function (_a, _b) {
                var liftedState = _a.state;
                var _c = __read(_b, 2), action = _c[0], reducer = _c[1];
                var reducedLiftedState = reducer(liftedState, action);
                // On full state update
                // If we have actions filters, we must filter completely our lifted state to be sync with the extension
                if (action.type !== PERFORM_ACTION && shouldFilterActions(config)) {
                    reducedLiftedState = filterLiftedState(reducedLiftedState, config.predicate, config.actionsSafelist, config.actionsBlocklist);
                }
                // Extension should be sent the sanitized lifted state
                extension.notify(action, reducedLiftedState);
                return { state: reducedLiftedState, action: action };
            }, { state: liftedInitialState, action: null }))
                .subscribe(function (_a) {
                var state = _a.state, action = _a.action;
                liftedStateSubject.next(state);
                if (action.type === PERFORM_ACTION) {
                    var unliftedAction = action.action;
                    scannedActions.next(unliftedAction);
                }
            });
            var extensionStartSubscription = extension.start$.subscribe(function () {
                _this.refresh();
            });
            var liftedState$ = liftedStateSubject.asObservable();
            var state$ = liftedState$.pipe(operators.map(unliftState));
            this.extensionStartSubscription = extensionStartSubscription;
            this.stateSubscription = liftedStateSubscription;
            this.dispatcher = dispatcher;
            this.liftedState = liftedState$;
            this.state = state$;
        }
        StoreDevtools.prototype.dispatch = function (action) {
            this.dispatcher.next(action);
        };
        StoreDevtools.prototype.next = function (action) {
            this.dispatcher.next(action);
        };
        StoreDevtools.prototype.error = function (error) { };
        StoreDevtools.prototype.complete = function () { };
        StoreDevtools.prototype.performAction = function (action) {
            this.dispatch(new PerformAction(action, +Date.now()));
        };
        StoreDevtools.prototype.refresh = function () {
            this.dispatch(new Refresh());
        };
        StoreDevtools.prototype.reset = function () {
            this.dispatch(new Reset(+Date.now()));
        };
        StoreDevtools.prototype.rollback = function () {
            this.dispatch(new Rollback(+Date.now()));
        };
        StoreDevtools.prototype.commit = function () {
            this.dispatch(new Commit(+Date.now()));
        };
        StoreDevtools.prototype.sweep = function () {
            this.dispatch(new Sweep());
        };
        StoreDevtools.prototype.toggleAction = function (id) {
            this.dispatch(new ToggleAction(id));
        };
        StoreDevtools.prototype.jumpToAction = function (actionId) {
            this.dispatch(new JumpToAction(actionId));
        };
        StoreDevtools.prototype.jumpToState = function (index) {
            this.dispatch(new JumpToState(index));
        };
        StoreDevtools.prototype.importState = function (nextLiftedState) {
            this.dispatch(new ImportState(nextLiftedState));
        };
        StoreDevtools.prototype.lockChanges = function (status) {
            this.dispatch(new LockChanges(status));
        };
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

    var IS_EXTENSION_OR_MONITOR_PRESENT = new core.InjectionToken('@ngrx/store-devtools Is Devtools Extension or Monitor Present');
    function createIsExtensionOrMonitorPresent(extension, config) {
        return Boolean(extension) || config.monitor !== noMonitor;
    }
    function createReduxDevtoolsExtension() {
        var extensionKey = '__REDUX_DEVTOOLS_EXTENSION__';
        if (typeof window === 'object' &&
            typeof window[extensionKey] !== 'undefined') {
            return window[extensionKey];
        }
        else {
            return null;
        }
    }
    function createStateObservable(devtools) {
        return devtools.state;
    }
    var StoreDevtoolsModule = /** @class */ (function () {
        function StoreDevtoolsModule() {
        }
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
     * DO NOT EDIT
     *
     * This file is automatically generated at build
     */

    /**
     * Generated bundle index. Do not edit.
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
