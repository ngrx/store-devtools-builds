/**
 * @fileoverview added by tsickle
 * Generated from: src/config.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { InjectionToken } from '@angular/core';
/**
 * @record
 */
export function DevToolsFeatureOptions() { }
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
export { StoreDevtoolsConfig };
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
export var STORE_DEVTOOLS_CONFIG = new InjectionToken('@ngrx/devtools Options');
/** @type {?} */
export var INITIAL_OPTIONS = new InjectionToken('@ngrx/devtools Initial Config');
/**
 * @return {?}
 */
export function noMonitor() {
    return null;
}
/** @type {?} */
export var DEFAULT_NAME = 'NgRx Store DevTools';
/**
 * @param {?} _options
 * @return {?}
 */
export function createConfig(_options) {
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
//# sourceMappingURL=config.js.map