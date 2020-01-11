/**
 * @fileoverview added by tsickle
 * Generated from: modules/store-devtools/src/config.ts
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
export class StoreDevtoolsConfig {
    constructor() {
        this.maxAge = false;
    }
}
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
export const STORE_DEVTOOLS_CONFIG = new InjectionToken('@ngrx/devtools Options');
/** @type {?} */
export const INITIAL_OPTIONS = new InjectionToken('@ngrx/devtools Initial Config');
/**
 * @return {?}
 */
export function noMonitor() {
    return null;
}
/** @type {?} */
export const DEFAULT_NAME = 'NgRx Store DevTools';
/**
 * @param {?} _options
 * @return {?}
 */
export function createConfig(_options) {
    /** @type {?} */
    const DEFAULT_OPTIONS = {
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
    let options = typeof _options === 'function' ? _options() : _options;
    /** @type {?} */
    const logOnly = options.logOnly
        ? { pause: true, export: true, test: true }
        : false;
    /** @type {?} */
    const features = options.features || logOnly || DEFAULT_OPTIONS.features;
    /** @type {?} */
    const config = Object.assign({}, DEFAULT_OPTIONS, { features }, options);
    if (config.maxAge && config.maxAge < 2) {
        throw new Error(`Devtools 'maxAge' cannot be less than 2, got ${config.maxAge}`);
    }
    return config;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9zdG9yZS1kZXZ0b29scy9zcmMvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7OztBQVkvQyw0Q0FXQzs7O0lBVkMsdUNBQWdCOztJQUNoQixzQ0FBZTs7SUFDZix5Q0FBa0I7O0lBQ2xCLHdDQUFpQjs7SUFDakIsd0NBQTRCOztJQUM1QixzQ0FBZTs7SUFDZixzQ0FBZTs7SUFDZix5Q0FBa0I7O0lBQ2xCLDBDQUFtQjs7SUFDbkIsc0NBQWU7O0FBR2pCLE1BQU0sT0FBTyxtQkFBbUI7SUFBaEM7UUFDRSxXQUFNLEdBQW1CLEtBQUssQ0FBQztJQVdqQyxDQUFDO0NBQUE7OztJQVhDLHFDQUErQjs7SUFDL0Isc0NBQWtDOztJQUNsQyw4Q0FBa0M7O0lBQ2xDLDZDQUFnQzs7SUFDaEMsbUNBQWM7O0lBQ2Qsd0NBQTJDOztJQUMzQyxzQ0FBa0I7O0lBQ2xCLHVDQUFrQzs7SUFDbEMsK0NBQTRCOztJQUM1Qiw4Q0FBMkI7O0lBQzNCLHdDQUFzQjs7O0FBR3hCLE1BQU0sT0FBTyxxQkFBcUIsR0FBRyxJQUFJLGNBQWMsQ0FDckQsd0JBQXdCLENBQ3pCOztBQUNELE1BQU0sT0FBTyxlQUFlLEdBQUcsSUFBSSxjQUFjLENBQy9DLCtCQUErQixDQUNoQzs7OztBQU1ELE1BQU0sVUFBVSxTQUFTO0lBQ3ZCLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQzs7QUFFRCxNQUFNLE9BQU8sWUFBWSxHQUFHLHFCQUFxQjs7Ozs7QUFFakQsTUFBTSxVQUFVLFlBQVksQ0FDMUIsUUFBOEI7O1VBRXhCLGVBQWUsR0FBd0I7UUFDM0MsTUFBTSxFQUFFLEtBQUs7UUFDYixPQUFPLEVBQUUsU0FBUztRQUNsQixlQUFlLEVBQUUsU0FBUztRQUMxQixjQUFjLEVBQUUsU0FBUztRQUN6QixJQUFJLEVBQUUsWUFBWTtRQUNsQixTQUFTLEVBQUUsS0FBSztRQUNoQixPQUFPLEVBQUUsS0FBSzs7O1FBR2QsUUFBUSxFQUFFO1lBQ1IsS0FBSyxFQUFFLElBQUk7O1lBQ1gsSUFBSSxFQUFFLElBQUk7O1lBQ1YsT0FBTyxFQUFFLElBQUk7O1lBQ2IsTUFBTSxFQUFFLElBQUk7O1lBQ1osTUFBTSxFQUFFLFFBQVE7O1lBQ2hCLElBQUksRUFBRSxJQUFJOztZQUNWLElBQUksRUFBRSxJQUFJOztZQUNWLE9BQU8sRUFBRSxJQUFJOztZQUNiLFFBQVEsRUFBRSxJQUFJOztZQUNkLElBQUksRUFBRSxJQUFJO1NBQ1g7S0FDRjs7UUFFRyxPQUFPLEdBQUcsT0FBTyxRQUFRLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTs7VUFDOUQsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPO1FBQzdCLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO1FBQzNDLENBQUMsQ0FBQyxLQUFLOztVQUNILFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sSUFBSSxlQUFlLENBQUMsUUFBUTs7VUFDbEUsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLGVBQWUsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLE9BQU8sQ0FBQztJQUV4RSxJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDdEMsTUFBTSxJQUFJLEtBQUssQ0FDYixnREFBZ0QsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUNoRSxDQUFDO0tBQ0g7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWN0aW9uUmVkdWNlciwgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgSW5qZWN0aW9uVG9rZW4gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZXhwb3J0IHR5cGUgQWN0aW9uU2FuaXRpemVyID0gKGFjdGlvbjogQWN0aW9uLCBpZDogbnVtYmVyKSA9PiBBY3Rpb247XG5leHBvcnQgdHlwZSBTdGF0ZVNhbml0aXplciA9IChzdGF0ZTogYW55LCBpbmRleDogbnVtYmVyKSA9PiBhbnk7XG5leHBvcnQgdHlwZSBTZXJpYWxpemF0aW9uT3B0aW9ucyA9IHtcbiAgb3B0aW9ucz86IGJvb2xlYW4gfCBhbnk7XG4gIHJlcGxhY2VyPzogKGtleTogYW55LCB2YWx1ZTogYW55KSA9PiB7fTtcbiAgcmV2aXZlcj86IChrZXk6IGFueSwgdmFsdWU6IGFueSkgPT4ge307XG4gIGltbXV0YWJsZT86IGFueTtcbiAgcmVmcz86IEFycmF5PGFueT47XG59O1xuZXhwb3J0IHR5cGUgUHJlZGljYXRlID0gKHN0YXRlOiBhbnksIGFjdGlvbjogQWN0aW9uKSA9PiBib29sZWFuO1xuZXhwb3J0IGludGVyZmFjZSBEZXZUb29sc0ZlYXR1cmVPcHRpb25zIHtcbiAgcGF1c2U/OiBib29sZWFuO1xuICBsb2NrPzogYm9vbGVhbjtcbiAgcGVyc2lzdD86IGJvb2xlYW47XG4gIGV4cG9ydD86IGJvb2xlYW47XG4gIGltcG9ydD86ICdjdXN0b20nIHwgYm9vbGVhbjtcbiAganVtcD86IGJvb2xlYW47XG4gIHNraXA/OiBib29sZWFuO1xuICByZW9yZGVyPzogYm9vbGVhbjtcbiAgZGlzcGF0Y2g/OiBib29sZWFuO1xuICB0ZXN0PzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNsYXNzIFN0b3JlRGV2dG9vbHNDb25maWcge1xuICBtYXhBZ2U6IG51bWJlciB8IGZhbHNlID0gZmFsc2U7XG4gIG1vbml0b3I/OiBBY3Rpb25SZWR1Y2VyPGFueSwgYW55PjtcbiAgYWN0aW9uU2FuaXRpemVyPzogQWN0aW9uU2FuaXRpemVyO1xuICBzdGF0ZVNhbml0aXplcj86IFN0YXRlU2FuaXRpemVyO1xuICBuYW1lPzogc3RyaW5nO1xuICBzZXJpYWxpemU/OiBib29sZWFuIHwgU2VyaWFsaXphdGlvbk9wdGlvbnM7XG4gIGxvZ09ubHk/OiBib29sZWFuO1xuICBmZWF0dXJlcz86IERldlRvb2xzRmVhdHVyZU9wdGlvbnM7XG4gIGFjdGlvbnNCbG9ja2xpc3Q/OiBzdHJpbmdbXTtcbiAgYWN0aW9uc1NhZmVsaXN0Pzogc3RyaW5nW107XG4gIHByZWRpY2F0ZT86IFByZWRpY2F0ZTtcbn1cblxuZXhwb3J0IGNvbnN0IFNUT1JFX0RFVlRPT0xTX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxTdG9yZURldnRvb2xzQ29uZmlnPihcbiAgJ0BuZ3J4L2RldnRvb2xzIE9wdGlvbnMnXG4pO1xuZXhwb3J0IGNvbnN0IElOSVRJQUxfT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxTdG9yZURldnRvb2xzQ29uZmlnPihcbiAgJ0BuZ3J4L2RldnRvb2xzIEluaXRpYWwgQ29uZmlnJ1xuKTtcblxuZXhwb3J0IHR5cGUgU3RvcmVEZXZ0b29sc09wdGlvbnMgPVxuICB8IFBhcnRpYWw8U3RvcmVEZXZ0b29sc0NvbmZpZz5cbiAgfCAoKCkgPT4gUGFydGlhbDxTdG9yZURldnRvb2xzQ29uZmlnPik7XG5cbmV4cG9ydCBmdW5jdGlvbiBub01vbml0b3IoKTogbnVsbCB7XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgY29uc3QgREVGQVVMVF9OQU1FID0gJ05nUnggU3RvcmUgRGV2VG9vbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29uZmlnKFxuICBfb3B0aW9uczogU3RvcmVEZXZ0b29sc09wdGlvbnNcbik6IFN0b3JlRGV2dG9vbHNDb25maWcge1xuICBjb25zdCBERUZBVUxUX09QVElPTlM6IFN0b3JlRGV2dG9vbHNDb25maWcgPSB7XG4gICAgbWF4QWdlOiBmYWxzZSxcbiAgICBtb25pdG9yOiBub01vbml0b3IsXG4gICAgYWN0aW9uU2FuaXRpemVyOiB1bmRlZmluZWQsXG4gICAgc3RhdGVTYW5pdGl6ZXI6IHVuZGVmaW5lZCxcbiAgICBuYW1lOiBERUZBVUxUX05BTUUsXG4gICAgc2VyaWFsaXplOiBmYWxzZSxcbiAgICBsb2dPbmx5OiBmYWxzZSxcbiAgICAvLyBBZGQgYWxsIGZlYXR1cmVzIGV4cGxpY2l0bHkuIFRoaXMgcHJldmVudCBidWdneSBiZWhhdmlvciBmb3JcbiAgICAvLyBvcHRpb25zIGxpa2UgXCJsb2NrXCIgd2hpY2ggbWlnaHQgb3RoZXJ3aXNlIG5vdCBzaG93IHVwLlxuICAgIGZlYXR1cmVzOiB7XG4gICAgICBwYXVzZTogdHJ1ZSwgLy8gc3RhcnQvcGF1c2UgcmVjb3JkaW5nIG9mIGRpc3BhdGNoZWQgYWN0aW9uc1xuICAgICAgbG9jazogdHJ1ZSwgLy8gbG9jay91bmxvY2sgZGlzcGF0Y2hpbmcgYWN0aW9ucyBhbmQgc2lkZSBlZmZlY3RzXG4gICAgICBwZXJzaXN0OiB0cnVlLCAvLyBwZXJzaXN0IHN0YXRlcyBvbiBwYWdlIHJlbG9hZGluZ1xuICAgICAgZXhwb3J0OiB0cnVlLCAvLyBleHBvcnQgaGlzdG9yeSBvZiBhY3Rpb25zIGluIGEgZmlsZVxuICAgICAgaW1wb3J0OiAnY3VzdG9tJywgLy8gaW1wb3J0IGhpc3Rvcnkgb2YgYWN0aW9ucyBmcm9tIGEgZmlsZVxuICAgICAganVtcDogdHJ1ZSwgLy8ganVtcCBiYWNrIGFuZCBmb3J0aCAodGltZSB0cmF2ZWxsaW5nKVxuICAgICAgc2tpcDogdHJ1ZSwgLy8gc2tpcCAoY2FuY2VsKSBhY3Rpb25zXG4gICAgICByZW9yZGVyOiB0cnVlLCAvLyBkcmFnIGFuZCBkcm9wIGFjdGlvbnMgaW4gdGhlIGhpc3RvcnkgbGlzdFxuICAgICAgZGlzcGF0Y2g6IHRydWUsIC8vIGRpc3BhdGNoIGN1c3RvbSBhY3Rpb25zIG9yIGFjdGlvbiBjcmVhdG9yc1xuICAgICAgdGVzdDogdHJ1ZSwgLy8gZ2VuZXJhdGUgdGVzdHMgZm9yIHRoZSBzZWxlY3RlZCBhY3Rpb25zXG4gICAgfSxcbiAgfTtcblxuICBsZXQgb3B0aW9ucyA9IHR5cGVvZiBfb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJyA/IF9vcHRpb25zKCkgOiBfb3B0aW9ucztcbiAgY29uc3QgbG9nT25seSA9IG9wdGlvbnMubG9nT25seVxuICAgID8geyBwYXVzZTogdHJ1ZSwgZXhwb3J0OiB0cnVlLCB0ZXN0OiB0cnVlIH1cbiAgICA6IGZhbHNlO1xuICBjb25zdCBmZWF0dXJlcyA9IG9wdGlvbnMuZmVhdHVyZXMgfHwgbG9nT25seSB8fCBERUZBVUxUX09QVElPTlMuZmVhdHVyZXM7XG4gIGNvbnN0IGNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfT1BUSU9OUywgeyBmZWF0dXJlcyB9LCBvcHRpb25zKTtcblxuICBpZiAoY29uZmlnLm1heEFnZSAmJiBjb25maWcubWF4QWdlIDwgMikge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBEZXZ0b29scyAnbWF4QWdlJyBjYW5ub3QgYmUgbGVzcyB0aGFuIDIsIGdvdCAke2NvbmZpZy5tYXhBZ2V9YFxuICAgICk7XG4gIH1cblxuICByZXR1cm4gY29uZmlnO1xufVxuIl19