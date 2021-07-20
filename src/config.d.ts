import { ActionReducer, Action } from '@ngrx/store';
import { InjectionToken } from '@angular/core';
export declare type ActionSanitizer = (action: Action, id: number) => Action;
export declare type StateSanitizer = (state: any, index: number) => any;
export declare type SerializationOptions = {
    options?: boolean | any;
    replacer?: (key: any, value: any) => {};
    reviver?: (key: any, value: any) => {};
    immutable?: any;
    refs?: Array<any>;
};
export declare type Predicate = (state: any, action: Action) => boolean;
/**
 * @see http://extension.remotedev.io/docs/API/Arguments.html#features
 */
export interface DevToolsFeatureOptions {
    /**
     * Start/pause recording of dispatched actions
     */
    pause?: boolean;
    /**
     * Lock/unlock dispatching actions and side effects
     */
    lock?: boolean;
    /**
     * Persist states on page reloading
     */
    persist?: boolean;
    /**
     * Export history of actions in a file
     */
    export?: boolean;
    /**
     * Import history of actions from a file
     */
    import?: 'custom' | boolean;
    /**
     * Jump back and forth (time travelling)
     */
    jump?: boolean;
    /**
     * Skip (cancel) actions
     */
    skip?: boolean;
    /**
     * Drag and drop actions in the history list
     */
    reorder?: boolean;
    /**
     * Dispatch custom actions or action creators
     */
    dispatch?: boolean;
    /**
     * Generate tests for the selected actions
     */
    test?: boolean;
}
/**
 * @see http://extension.remotedev.io/docs/API/Arguments.html
 */
export declare class StoreDevtoolsConfig {
    /**
     * Maximum allowed actions to be stored in the history tree (default: `false`)
     */
    maxAge: number | false;
    monitor?: ActionReducer<any, any>;
    /**
     * Function which takes `action` object and id number as arguments, and should return `action` object back.
     */
    actionSanitizer?: ActionSanitizer;
    /**
     * Function which takes `state` object and index as arguments, and should return `state` object back.
     */
    stateSanitizer?: StateSanitizer;
    /**
     * The instance name to be shown on the monitor page (default: `document.title`)
     */
    name?: string;
    serialize?: boolean | SerializationOptions;
    logOnly?: boolean;
    features?: DevToolsFeatureOptions;
    /**
     * Action types to be hidden in the monitors. If `actionsSafelist` specified, `actionsBlocklist` is ignored.
     */
    actionsBlocklist?: string[];
    /**
     * Action types to be shown in the monitors
     */
    actionsSafelist?: string[];
    /**
     * Called for every action before sending, takes state and action object, and returns true in case it allows sending the current data to the monitor.
     */
    predicate?: Predicate;
    /**
     * Auto pauses when the extension’s window is not opened, and so has zero impact on your app when not in use.
     */
    autoPause?: boolean;
}
export declare const STORE_DEVTOOLS_CONFIG: InjectionToken<StoreDevtoolsConfig>;
/**
 * Used to provide a `StoreDevtoolsConfig` for the store-devtools.
 */
export declare const INITIAL_OPTIONS: InjectionToken<StoreDevtoolsConfig>;
export declare type StoreDevtoolsOptions = Partial<StoreDevtoolsConfig> | (() => Partial<StoreDevtoolsConfig>);
export declare function noMonitor(): null;
export declare const DEFAULT_NAME = "NgRx Store DevTools";
export declare function createConfig(optionsInput: StoreDevtoolsOptions): StoreDevtoolsConfig;
