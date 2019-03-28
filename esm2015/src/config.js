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
    StoreDevtoolsConfig.prototype.actionsBlacklist;
    /** @type {?} */
    StoreDevtoolsConfig.prototype.actionsWhitelist;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9zdG9yZS1kZXZ0b29scy9zcmMvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSxPQUFPLEVBQUUsY0FBYyxFQUFRLE1BQU0sZUFBZSxDQUFDO0FBYXJELE1BQU0sT0FBTyxtQkFBbUI7Q0FZL0I7OztJQVhDLHFDQUF1Qjs7SUFDdkIsc0NBQWlDOztJQUNqQyw4Q0FBa0M7O0lBQ2xDLDZDQUFnQzs7SUFDaEMsbUNBQWM7O0lBQ2Qsd0NBQTJDOztJQUMzQyxzQ0FBa0I7O0lBQ2xCLHVDQUFlOztJQUNmLCtDQUE0Qjs7SUFDNUIsK0NBQTRCOztJQUM1Qix3Q0FBc0I7OztBQUd4QixNQUFNLE9BQU8scUJBQXFCLEdBQUcsSUFBSSxjQUFjLENBQ3JELHdCQUF3QixDQUN6Qjs7QUFDRCxNQUFNLE9BQU8sZUFBZSxHQUFHLElBQUksY0FBYyxDQUMvQywrQkFBK0IsQ0FDaEM7Ozs7QUFNRCxNQUFNLFVBQVUsU0FBUztJQUN2QixPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7O0FBRUQsTUFBTSxPQUFPLFlBQVksR0FBRyxxQkFBcUI7Ozs7O0FBRWpELE1BQU0sVUFBVSxZQUFZLENBQzFCLFFBQThCOztVQUV4QixlQUFlLEdBQXdCO1FBQzNDLE1BQU0sRUFBRSxLQUFLO1FBQ2IsT0FBTyxFQUFFLFNBQVM7UUFDbEIsZUFBZSxFQUFFLFNBQVM7UUFDMUIsY0FBYyxFQUFFLFNBQVM7UUFDekIsSUFBSSxFQUFFLFlBQVk7UUFDbEIsU0FBUyxFQUFFLEtBQUs7UUFDaEIsT0FBTyxFQUFFLEtBQUs7OztRQUdkLFFBQVEsRUFBRTtZQUNSLEtBQUssRUFBRSxJQUFJOztZQUNYLElBQUksRUFBRSxJQUFJOztZQUNWLE9BQU8sRUFBRSxJQUFJOztZQUNiLE1BQU0sRUFBRSxJQUFJOztZQUNaLE1BQU0sRUFBRSxRQUFROztZQUNoQixJQUFJLEVBQUUsSUFBSTs7WUFDVixJQUFJLEVBQUUsSUFBSTs7WUFDVixPQUFPLEVBQUUsSUFBSTs7WUFDYixRQUFRLEVBQUUsSUFBSTs7WUFDZCxJQUFJLEVBQUUsSUFBSTtTQUNYO0tBQ0Y7O1FBRUcsT0FBTyxHQUFHLE9BQU8sUUFBUSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVE7O1VBQzlELE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTztRQUM3QixDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtRQUMzQyxDQUFDLENBQUMsS0FBSzs7VUFDSCxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLElBQUksZUFBZSxDQUFDLFFBQVE7O1VBQ2xFLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxlQUFlLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxPQUFPLENBQUM7SUFFeEUsSUFBSSxNQUFNLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQ2IsZ0RBQWdELE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FDaEUsQ0FBQztLQUNIO0lBRUQsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjdGlvblJlZHVjZXIsIEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IEluamVjdGlvblRva2VuLCBUeXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmV4cG9ydCB0eXBlIEFjdGlvblNhbml0aXplciA9IChhY3Rpb246IEFjdGlvbiwgaWQ6IG51bWJlcikgPT4gQWN0aW9uO1xuZXhwb3J0IHR5cGUgU3RhdGVTYW5pdGl6ZXIgPSAoc3RhdGU6IGFueSwgaW5kZXg6IG51bWJlcikgPT4gYW55O1xuZXhwb3J0IHR5cGUgU2VyaWFsaXphdGlvbk9wdGlvbnMgPSB7XG4gIG9wdGlvbnM/OiBib29sZWFuIHwgYW55O1xuICByZXBsYWNlcj86IChrZXk6IGFueSwgdmFsdWU6IGFueSkgPT4ge307XG4gIHJldml2ZXI/OiAoa2V5OiBhbnksIHZhbHVlOiBhbnkpID0+IHt9O1xuICBpbW11dGFibGU/OiBhbnk7XG4gIHJlZnM/OiBBcnJheTxhbnk+O1xufTtcbmV4cG9ydCB0eXBlIFByZWRpY2F0ZSA9IChzdGF0ZTogYW55LCBhY3Rpb246IEFjdGlvbikgPT4gYm9vbGVhbjtcblxuZXhwb3J0IGNsYXNzIFN0b3JlRGV2dG9vbHNDb25maWcge1xuICBtYXhBZ2U6IG51bWJlciB8IGZhbHNlO1xuICBtb25pdG9yOiBBY3Rpb25SZWR1Y2VyPGFueSwgYW55PjtcbiAgYWN0aW9uU2FuaXRpemVyPzogQWN0aW9uU2FuaXRpemVyO1xuICBzdGF0ZVNhbml0aXplcj86IFN0YXRlU2FuaXRpemVyO1xuICBuYW1lPzogc3RyaW5nO1xuICBzZXJpYWxpemU/OiBib29sZWFuIHwgU2VyaWFsaXphdGlvbk9wdGlvbnM7XG4gIGxvZ09ubHk/OiBib29sZWFuO1xuICBmZWF0dXJlcz86IGFueTtcbiAgYWN0aW9uc0JsYWNrbGlzdD86IHN0cmluZ1tdO1xuICBhY3Rpb25zV2hpdGVsaXN0Pzogc3RyaW5nW107XG4gIHByZWRpY2F0ZT86IFByZWRpY2F0ZTtcbn1cblxuZXhwb3J0IGNvbnN0IFNUT1JFX0RFVlRPT0xTX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxTdG9yZURldnRvb2xzQ29uZmlnPihcbiAgJ0BuZ3J4L2RldnRvb2xzIE9wdGlvbnMnXG4pO1xuZXhwb3J0IGNvbnN0IElOSVRJQUxfT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxTdG9yZURldnRvb2xzQ29uZmlnPihcbiAgJ0BuZ3J4L2RldnRvb2xzIEluaXRpYWwgQ29uZmlnJ1xuKTtcblxuZXhwb3J0IHR5cGUgU3RvcmVEZXZ0b29sc09wdGlvbnMgPVxuICB8IFBhcnRpYWw8U3RvcmVEZXZ0b29sc0NvbmZpZz5cbiAgfCAoKCkgPT4gUGFydGlhbDxTdG9yZURldnRvb2xzQ29uZmlnPik7XG5cbmV4cG9ydCBmdW5jdGlvbiBub01vbml0b3IoKTogbnVsbCB7XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgY29uc3QgREVGQVVMVF9OQU1FID0gJ05nUnggU3RvcmUgRGV2VG9vbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29uZmlnKFxuICBfb3B0aW9uczogU3RvcmVEZXZ0b29sc09wdGlvbnNcbik6IFN0b3JlRGV2dG9vbHNDb25maWcge1xuICBjb25zdCBERUZBVUxUX09QVElPTlM6IFN0b3JlRGV2dG9vbHNDb25maWcgPSB7XG4gICAgbWF4QWdlOiBmYWxzZSxcbiAgICBtb25pdG9yOiBub01vbml0b3IsXG4gICAgYWN0aW9uU2FuaXRpemVyOiB1bmRlZmluZWQsXG4gICAgc3RhdGVTYW5pdGl6ZXI6IHVuZGVmaW5lZCxcbiAgICBuYW1lOiBERUZBVUxUX05BTUUsXG4gICAgc2VyaWFsaXplOiBmYWxzZSxcbiAgICBsb2dPbmx5OiBmYWxzZSxcbiAgICAvLyBBZGQgYWxsIGZlYXR1cmVzIGV4cGxpY2l0ZWx5LiBUaGlzIHByZXZlbnQgYnVnZ3kgYmVoYXZpb3IgZm9yXG4gICAgLy8gb3B0aW9ucyBsaWtlIFwibG9ja1wiIHdoaWNoIG1pZ2h0IG90aGVyd2lzZSBub3Qgc2hvdyB1cC5cbiAgICBmZWF0dXJlczoge1xuICAgICAgcGF1c2U6IHRydWUsIC8vIHN0YXJ0L3BhdXNlIHJlY29yZGluZyBvZiBkaXNwYXRjaGVkIGFjdGlvbnNcbiAgICAgIGxvY2s6IHRydWUsIC8vIGxvY2svdW5sb2NrIGRpc3BhdGNoaW5nIGFjdGlvbnMgYW5kIHNpZGUgZWZmZWN0c1xuICAgICAgcGVyc2lzdDogdHJ1ZSwgLy8gcGVyc2lzdCBzdGF0ZXMgb24gcGFnZSByZWxvYWRpbmdcbiAgICAgIGV4cG9ydDogdHJ1ZSwgLy8gZXhwb3J0IGhpc3Rvcnkgb2YgYWN0aW9ucyBpbiBhIGZpbGVcbiAgICAgIGltcG9ydDogJ2N1c3RvbScsIC8vIGltcG9ydCBoaXN0b3J5IG9mIGFjdGlvbnMgZnJvbSBhIGZpbGVcbiAgICAgIGp1bXA6IHRydWUsIC8vIGp1bXAgYmFjayBhbmQgZm9ydGggKHRpbWUgdHJhdmVsbGluZylcbiAgICAgIHNraXA6IHRydWUsIC8vIHNraXAgKGNhbmNlbCkgYWN0aW9uc1xuICAgICAgcmVvcmRlcjogdHJ1ZSwgLy8gZHJhZyBhbmQgZHJvcCBhY3Rpb25zIGluIHRoZSBoaXN0b3J5IGxpc3RcbiAgICAgIGRpc3BhdGNoOiB0cnVlLCAvLyBkaXNwYXRjaCBjdXN0b20gYWN0aW9ucyBvciBhY3Rpb24gY3JlYXRvcnNcbiAgICAgIHRlc3Q6IHRydWUsIC8vIGdlbmVyYXRlIHRlc3RzIGZvciB0aGUgc2VsZWN0ZWQgYWN0aW9uc1xuICAgIH0sXG4gIH07XG5cbiAgbGV0IG9wdGlvbnMgPSB0eXBlb2YgX29wdGlvbnMgPT09ICdmdW5jdGlvbicgPyBfb3B0aW9ucygpIDogX29wdGlvbnM7XG4gIGNvbnN0IGxvZ09ubHkgPSBvcHRpb25zLmxvZ09ubHlcbiAgICA/IHsgcGF1c2U6IHRydWUsIGV4cG9ydDogdHJ1ZSwgdGVzdDogdHJ1ZSB9XG4gICAgOiBmYWxzZTtcbiAgY29uc3QgZmVhdHVyZXMgPSBvcHRpb25zLmZlYXR1cmVzIHx8IGxvZ09ubHkgfHwgREVGQVVMVF9PUFRJT05TLmZlYXR1cmVzO1xuICBjb25zdCBjb25maWcgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX09QVElPTlMsIHsgZmVhdHVyZXMgfSwgb3B0aW9ucyk7XG5cbiAgaWYgKGNvbmZpZy5tYXhBZ2UgJiYgY29uZmlnLm1heEFnZSA8IDIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgRGV2dG9vbHMgJ21heEFnZScgY2Fubm90IGJlIGxlc3MgdGhhbiAyLCBnb3QgJHtjb25maWcubWF4QWdlfWBcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIGNvbmZpZztcbn1cbiJdfQ==