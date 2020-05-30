/**
 * @fileoverview added by tsickle
 * Generated from: src/instrument.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { InjectionToken, NgModule } from '@angular/core';
import { ReducerManagerDispatcher, StateObservable } from '@ngrx/store';
import { INITIAL_OPTIONS, STORE_DEVTOOLS_CONFIG, noMonitor, createConfig, } from './config';
import { StoreDevtools } from './devtools';
import { DevtoolsExtension, REDUX_DEVTOOLS_EXTENSION, } from './extension';
import { DevtoolsDispatcher } from './devtools-dispatcher';
/** @type {?} */
export var IS_EXTENSION_OR_MONITOR_PRESENT = new InjectionToken('Is Devtools Extension or Monitor Present');
/**
 * @param {?} extension
 * @param {?} config
 * @return {?}
 */
export function createIsExtensionOrMonitorPresent(extension, config) {
    return Boolean(extension) || config.monitor !== noMonitor;
}
/**
 * @return {?}
 */
export function createReduxDevtoolsExtension() {
    /** @type {?} */
    var extensionKey = '__REDUX_DEVTOOLS_EXTENSION__';
    if (typeof window === 'object' &&
        typeof ((/** @type {?} */ (window)))[extensionKey] !== 'undefined') {
        return ((/** @type {?} */ (window)))[extensionKey];
    }
    else {
        return null;
    }
}
/**
 * @param {?} devtools
 * @return {?}
 */
export function createStateObservable(devtools) {
    return devtools.state;
}
var StoreDevtoolsModule = /** @class */ (function () {
    function StoreDevtoolsModule() {
    }
    /**
     * @param {?=} options
     * @return {?}
     */
    StoreDevtoolsModule.instrument = /**
     * @param {?=} options
     * @return {?}
     */
    function (options) {
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
                    provide: StateObservable,
                    deps: [StoreDevtools],
                    useFactory: createStateObservable,
                },
                {
                    provide: ReducerManagerDispatcher,
                    useExisting: DevtoolsDispatcher,
                },
            ],
        };
    };
    StoreDevtoolsModule.decorators = [
        { type: NgModule, args: [{},] },
    ];
    return StoreDevtoolsModule;
}());
export { StoreDevtoolsModule };
//# sourceMappingURL=instrument.js.map