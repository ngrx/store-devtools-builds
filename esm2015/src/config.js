/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { InjectionToken } from '@angular/core';
export class StoreDevtoolsConfig {
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
        // Add all features explicitely. This prevent buggy behavior for
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9zdG9yZS1kZXZ0b29scy9zcmMvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSxPQUFPLEVBQUUsY0FBYyxFQUFRLE1BQU0sZUFBZSxDQUFDO0FBYXJELE1BQU0sT0FBTyxtQkFBbUI7Q0FZL0I7OztJQVhDLHFDQUF1Qjs7SUFDdkIsc0NBQWlDOztJQUNqQyw4Q0FBa0M7O0lBQ2xDLDZDQUFnQzs7SUFDaEMsbUNBQWM7O0lBQ2Qsd0NBQTJDOztJQUMzQyxzQ0FBa0I7O0lBQ2xCLHVDQUFlOztJQUNmLCtDQUE0Qjs7SUFDNUIsOENBQTJCOztJQUMzQix3Q0FBc0I7OztBQUd4QixNQUFNLE9BQU8scUJBQXFCLEdBQUcsSUFBSSxjQUFjLENBQ3JELHdCQUF3QixDQUN6Qjs7QUFDRCxNQUFNLE9BQU8sZUFBZSxHQUFHLElBQUksY0FBYyxDQUMvQywrQkFBK0IsQ0FDaEM7Ozs7QUFNRCxNQUFNLFVBQVUsU0FBUztJQUN2QixPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7O0FBRUQsTUFBTSxPQUFPLFlBQVksR0FBRyxxQkFBcUI7Ozs7O0FBRWpELE1BQU0sVUFBVSxZQUFZLENBQzFCLFFBQThCOztVQUV4QixlQUFlLEdBQXdCO1FBQzNDLE1BQU0sRUFBRSxLQUFLO1FBQ2IsT0FBTyxFQUFFLFNBQVM7UUFDbEIsZUFBZSxFQUFFLFNBQVM7UUFDMUIsY0FBYyxFQUFFLFNBQVM7UUFDekIsSUFBSSxFQUFFLFlBQVk7UUFDbEIsU0FBUyxFQUFFLEtBQUs7UUFDaEIsT0FBTyxFQUFFLEtBQUs7OztRQUdkLFFBQVEsRUFBRTtZQUNSLEtBQUssRUFBRSxJQUFJOztZQUNYLElBQUksRUFBRSxJQUFJOztZQUNWLE9BQU8sRUFBRSxJQUFJOztZQUNiLE1BQU0sRUFBRSxJQUFJOztZQUNaLE1BQU0sRUFBRSxRQUFROztZQUNoQixJQUFJLEVBQUUsSUFBSTs7WUFDVixJQUFJLEVBQUUsSUFBSTs7WUFDVixPQUFPLEVBQUUsSUFBSTs7WUFDYixRQUFRLEVBQUUsSUFBSTs7WUFDZCxJQUFJLEVBQUUsSUFBSTtTQUNYO0tBQ0Y7O1FBRUcsT0FBTyxHQUFHLE9BQU8sUUFBUSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVE7O1VBQzlELE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTztRQUM3QixDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtRQUMzQyxDQUFDLENBQUMsS0FBSzs7VUFDSCxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLElBQUksZUFBZSxDQUFDLFFBQVE7O1VBQ2xFLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxlQUFlLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxPQUFPLENBQUM7SUFFeEUsSUFBSSxNQUFNLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQ2IsZ0RBQWdELE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FDaEUsQ0FBQztLQUNIO0lBRUQsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjdGlvblJlZHVjZXIsIEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IEluamVjdGlvblRva2VuLCBUeXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmV4cG9ydCB0eXBlIEFjdGlvblNhbml0aXplciA9IChhY3Rpb246IEFjdGlvbiwgaWQ6IG51bWJlcikgPT4gQWN0aW9uO1xuZXhwb3J0IHR5cGUgU3RhdGVTYW5pdGl6ZXIgPSAoc3RhdGU6IGFueSwgaW5kZXg6IG51bWJlcikgPT4gYW55O1xuZXhwb3J0IHR5cGUgU2VyaWFsaXphdGlvbk9wdGlvbnMgPSB7XG4gIG9wdGlvbnM/OiBib29sZWFuIHwgYW55O1xuICByZXBsYWNlcj86IChrZXk6IGFueSwgdmFsdWU6IGFueSkgPT4ge307XG4gIHJldml2ZXI/OiAoa2V5OiBhbnksIHZhbHVlOiBhbnkpID0+IHt9O1xuICBpbW11dGFibGU/OiBhbnk7XG4gIHJlZnM/OiBBcnJheTxhbnk+O1xufTtcbmV4cG9ydCB0eXBlIFByZWRpY2F0ZSA9IChzdGF0ZTogYW55LCBhY3Rpb246IEFjdGlvbikgPT4gYm9vbGVhbjtcblxuZXhwb3J0IGNsYXNzIFN0b3JlRGV2dG9vbHNDb25maWcge1xuICBtYXhBZ2U6IG51bWJlciB8IGZhbHNlO1xuICBtb25pdG9yOiBBY3Rpb25SZWR1Y2VyPGFueSwgYW55PjtcbiAgYWN0aW9uU2FuaXRpemVyPzogQWN0aW9uU2FuaXRpemVyO1xuICBzdGF0ZVNhbml0aXplcj86IFN0YXRlU2FuaXRpemVyO1xuICBuYW1lPzogc3RyaW5nO1xuICBzZXJpYWxpemU/OiBib29sZWFuIHwgU2VyaWFsaXphdGlvbk9wdGlvbnM7XG4gIGxvZ09ubHk/OiBib29sZWFuO1xuICBmZWF0dXJlcz86IGFueTtcbiAgYWN0aW9uc0Jsb2NrbGlzdD86IHN0cmluZ1tdO1xuICBhY3Rpb25zU2FmZWxpc3Q/OiBzdHJpbmdbXTtcbiAgcHJlZGljYXRlPzogUHJlZGljYXRlO1xufVxuXG5leHBvcnQgY29uc3QgU1RPUkVfREVWVE9PTFNfQ09ORklHID0gbmV3IEluamVjdGlvblRva2VuPFN0b3JlRGV2dG9vbHNDb25maWc+KFxuICAnQG5ncngvZGV2dG9vbHMgT3B0aW9ucydcbik7XG5leHBvcnQgY29uc3QgSU5JVElBTF9PUFRJT05TID0gbmV3IEluamVjdGlvblRva2VuPFN0b3JlRGV2dG9vbHNDb25maWc+KFxuICAnQG5ncngvZGV2dG9vbHMgSW5pdGlhbCBDb25maWcnXG4pO1xuXG5leHBvcnQgdHlwZSBTdG9yZURldnRvb2xzT3B0aW9ucyA9XG4gIHwgUGFydGlhbDxTdG9yZURldnRvb2xzQ29uZmlnPlxuICB8ICgoKSA9PiBQYXJ0aWFsPFN0b3JlRGV2dG9vbHNDb25maWc+KTtcblxuZXhwb3J0IGZ1bmN0aW9uIG5vTW9uaXRvcigpOiBudWxsIHtcbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX05BTUUgPSAnTmdSeCBTdG9yZSBEZXZUb29scyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDb25maWcoXG4gIF9vcHRpb25zOiBTdG9yZURldnRvb2xzT3B0aW9uc1xuKTogU3RvcmVEZXZ0b29sc0NvbmZpZyB7XG4gIGNvbnN0IERFRkFVTFRfT1BUSU9OUzogU3RvcmVEZXZ0b29sc0NvbmZpZyA9IHtcbiAgICBtYXhBZ2U6IGZhbHNlLFxuICAgIG1vbml0b3I6IG5vTW9uaXRvcixcbiAgICBhY3Rpb25TYW5pdGl6ZXI6IHVuZGVmaW5lZCxcbiAgICBzdGF0ZVNhbml0aXplcjogdW5kZWZpbmVkLFxuICAgIG5hbWU6IERFRkFVTFRfTkFNRSxcbiAgICBzZXJpYWxpemU6IGZhbHNlLFxuICAgIGxvZ09ubHk6IGZhbHNlLFxuICAgIC8vIEFkZCBhbGwgZmVhdHVyZXMgZXhwbGljaXRlbHkuIFRoaXMgcHJldmVudCBidWdneSBiZWhhdmlvciBmb3JcbiAgICAvLyBvcHRpb25zIGxpa2UgXCJsb2NrXCIgd2hpY2ggbWlnaHQgb3RoZXJ3aXNlIG5vdCBzaG93IHVwLlxuICAgIGZlYXR1cmVzOiB7XG4gICAgICBwYXVzZTogdHJ1ZSwgLy8gc3RhcnQvcGF1c2UgcmVjb3JkaW5nIG9mIGRpc3BhdGNoZWQgYWN0aW9uc1xuICAgICAgbG9jazogdHJ1ZSwgLy8gbG9jay91bmxvY2sgZGlzcGF0Y2hpbmcgYWN0aW9ucyBhbmQgc2lkZSBlZmZlY3RzXG4gICAgICBwZXJzaXN0OiB0cnVlLCAvLyBwZXJzaXN0IHN0YXRlcyBvbiBwYWdlIHJlbG9hZGluZ1xuICAgICAgZXhwb3J0OiB0cnVlLCAvLyBleHBvcnQgaGlzdG9yeSBvZiBhY3Rpb25zIGluIGEgZmlsZVxuICAgICAgaW1wb3J0OiAnY3VzdG9tJywgLy8gaW1wb3J0IGhpc3Rvcnkgb2YgYWN0aW9ucyBmcm9tIGEgZmlsZVxuICAgICAganVtcDogdHJ1ZSwgLy8ganVtcCBiYWNrIGFuZCBmb3J0aCAodGltZSB0cmF2ZWxsaW5nKVxuICAgICAgc2tpcDogdHJ1ZSwgLy8gc2tpcCAoY2FuY2VsKSBhY3Rpb25zXG4gICAgICByZW9yZGVyOiB0cnVlLCAvLyBkcmFnIGFuZCBkcm9wIGFjdGlvbnMgaW4gdGhlIGhpc3RvcnkgbGlzdFxuICAgICAgZGlzcGF0Y2g6IHRydWUsIC8vIGRpc3BhdGNoIGN1c3RvbSBhY3Rpb25zIG9yIGFjdGlvbiBjcmVhdG9yc1xuICAgICAgdGVzdDogdHJ1ZSwgLy8gZ2VuZXJhdGUgdGVzdHMgZm9yIHRoZSBzZWxlY3RlZCBhY3Rpb25zXG4gICAgfSxcbiAgfTtcblxuICBsZXQgb3B0aW9ucyA9IHR5cGVvZiBfb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJyA/IF9vcHRpb25zKCkgOiBfb3B0aW9ucztcbiAgY29uc3QgbG9nT25seSA9IG9wdGlvbnMubG9nT25seVxuICAgID8geyBwYXVzZTogdHJ1ZSwgZXhwb3J0OiB0cnVlLCB0ZXN0OiB0cnVlIH1cbiAgICA6IGZhbHNlO1xuICBjb25zdCBmZWF0dXJlcyA9IG9wdGlvbnMuZmVhdHVyZXMgfHwgbG9nT25seSB8fCBERUZBVUxUX09QVElPTlMuZmVhdHVyZXM7XG4gIGNvbnN0IGNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfT1BUSU9OUywgeyBmZWF0dXJlcyB9LCBvcHRpb25zKTtcblxuICBpZiAoY29uZmlnLm1heEFnZSAmJiBjb25maWcubWF4QWdlIDwgMikge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBEZXZ0b29scyAnbWF4QWdlJyBjYW5ub3QgYmUgbGVzcyB0aGFuIDIsIGdvdCAke2NvbmZpZy5tYXhBZ2V9YFxuICAgICk7XG4gIH1cblxuICByZXR1cm4gY29uZmlnO1xufVxuIl19