/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { InjectionToken } from '@angular/core';
/** @typedef {?} */
var ActionSanitizer;
export { ActionSanitizer };
/** @typedef {?} */
var StateSanitizer;
export { StateSanitizer };
/** @typedef {?} */
var SerializationOptions;
export { SerializationOptions };
/** @typedef {?} */
var Predicate;
export { Predicate };
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
/** @typedef {?} */
var StoreDevtoolsOptions;
export { StoreDevtoolsOptions };
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9zdG9yZS1kZXZ0b29scy9zcmMvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSxPQUFPLEVBQUUsY0FBYyxFQUFRLE1BQU0sZUFBZSxDQUFDOzs7Ozs7Ozs7Ozs7O0FBYXJELE1BQU0sT0FBTyxtQkFBbUI7Q0FZL0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUQsYUFBYSxxQkFBcUIsR0FBRyxJQUFJLGNBQWMsQ0FDckQsd0JBQXdCLENBQ3pCLENBQUM7O0FBQ0YsYUFBYSxlQUFlLEdBQUcsSUFBSSxjQUFjLENBQy9DLCtCQUErQixDQUNoQyxDQUFDOzs7Ozs7O0FBTUYsTUFBTSxVQUFVLFNBQVM7SUFDdkIsT0FBTyxJQUFJLENBQUM7Q0FDYjs7QUFFRCxhQUFhLFlBQVksR0FBRyxxQkFBcUIsQ0FBQzs7Ozs7QUFFbEQsTUFBTSxVQUFVLFlBQVksQ0FDMUIsUUFBOEI7O0lBRTlCLE1BQU0sZUFBZSxHQUF3QjtRQUMzQyxNQUFNLEVBQUUsS0FBSztRQUNiLE9BQU8sRUFBRSxTQUFTO1FBQ2xCLGVBQWUsRUFBRSxTQUFTO1FBQzFCLGNBQWMsRUFBRSxTQUFTO1FBQ3pCLElBQUksRUFBRSxZQUFZO1FBQ2xCLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLE9BQU8sRUFBRSxLQUFLOzs7UUFHZCxRQUFRLEVBQUU7WUFDUixLQUFLLEVBQUUsSUFBSTs7WUFDWCxJQUFJLEVBQUUsSUFBSTs7WUFDVixPQUFPLEVBQUUsSUFBSTs7WUFDYixNQUFNLEVBQUUsSUFBSTs7WUFDWixNQUFNLEVBQUUsUUFBUTs7WUFDaEIsSUFBSSxFQUFFLElBQUk7O1lBQ1YsSUFBSSxFQUFFLElBQUk7O1lBQ1YsT0FBTyxFQUFFLElBQUk7O1lBQ2IsUUFBUSxFQUFFLElBQUk7O1lBQ2QsSUFBSSxFQUFFLElBQUk7U0FDWDtLQUNGLENBQUM7O0lBRUYsSUFBSSxPQUFPLEdBQUcsT0FBTyxRQUFRLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDOztJQUNyRSxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTztRQUM3QixDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtRQUMzQyxDQUFDLENBQUMsS0FBSyxDQUFDOztJQUNWLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxJQUFJLGVBQWUsQ0FBQyxRQUFRLENBQUM7O0lBQ3pFLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLGVBQWUsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRXpFLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUN0QyxNQUFNLElBQUksS0FBSyxDQUNiLGdEQUFnRCxNQUFNLENBQUMsTUFBTSxFQUFFLENBQ2hFLENBQUM7S0FDSDtJQUVELE9BQU8sTUFBTSxDQUFDO0NBQ2YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY3Rpb25SZWR1Y2VyLCBBY3Rpb24gfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBJbmplY3Rpb25Ub2tlbiwgVHlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5leHBvcnQgdHlwZSBBY3Rpb25TYW5pdGl6ZXIgPSAoYWN0aW9uOiBBY3Rpb24sIGlkOiBudW1iZXIpID0+IEFjdGlvbjtcbmV4cG9ydCB0eXBlIFN0YXRlU2FuaXRpemVyID0gKHN0YXRlOiBhbnksIGluZGV4OiBudW1iZXIpID0+IGFueTtcbmV4cG9ydCB0eXBlIFNlcmlhbGl6YXRpb25PcHRpb25zID0ge1xuICBvcHRpb25zPzogYm9vbGVhbiB8IGFueTtcbiAgcmVwbGFjZXI/OiAoa2V5OiBhbnksIHZhbHVlOiBhbnkpID0+IHt9O1xuICByZXZpdmVyPzogKGtleTogYW55LCB2YWx1ZTogYW55KSA9PiB7fTtcbiAgaW1tdXRhYmxlPzogYW55O1xuICByZWZzPzogQXJyYXk8YW55Pjtcbn07XG5leHBvcnQgdHlwZSBQcmVkaWNhdGUgPSAoc3RhdGU6IGFueSwgYWN0aW9uOiBBY3Rpb24pID0+IGJvb2xlYW47XG5cbmV4cG9ydCBjbGFzcyBTdG9yZURldnRvb2xzQ29uZmlnIHtcbiAgbWF4QWdlOiBudW1iZXIgfCBmYWxzZTtcbiAgbW9uaXRvcjogQWN0aW9uUmVkdWNlcjxhbnksIGFueT47XG4gIGFjdGlvblNhbml0aXplcj86IEFjdGlvblNhbml0aXplcjtcbiAgc3RhdGVTYW5pdGl6ZXI/OiBTdGF0ZVNhbml0aXplcjtcbiAgbmFtZT86IHN0cmluZztcbiAgc2VyaWFsaXplPzogYm9vbGVhbiB8IFNlcmlhbGl6YXRpb25PcHRpb25zO1xuICBsb2dPbmx5PzogYm9vbGVhbjtcbiAgZmVhdHVyZXM/OiBhbnk7XG4gIGFjdGlvbnNCbGFja2xpc3Q/OiBzdHJpbmdbXTtcbiAgYWN0aW9uc1doaXRlbGlzdD86IHN0cmluZ1tdO1xuICBwcmVkaWNhdGU/OiBQcmVkaWNhdGU7XG59XG5cbmV4cG9ydCBjb25zdCBTVE9SRV9ERVZUT09MU19DT05GSUcgPSBuZXcgSW5qZWN0aW9uVG9rZW48U3RvcmVEZXZ0b29sc0NvbmZpZz4oXG4gICdAbmdyeC9kZXZ0b29scyBPcHRpb25zJ1xuKTtcbmV4cG9ydCBjb25zdCBJTklUSUFMX09QVElPTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48U3RvcmVEZXZ0b29sc0NvbmZpZz4oXG4gICdAbmdyeC9kZXZ0b29scyBJbml0aWFsIENvbmZpZydcbik7XG5cbmV4cG9ydCB0eXBlIFN0b3JlRGV2dG9vbHNPcHRpb25zID1cbiAgfCBQYXJ0aWFsPFN0b3JlRGV2dG9vbHNDb25maWc+XG4gIHwgKCgpID0+IFBhcnRpYWw8U3RvcmVEZXZ0b29sc0NvbmZpZz4pO1xuXG5leHBvcnQgZnVuY3Rpb24gbm9Nb25pdG9yKCk6IG51bGwge1xuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfTkFNRSA9ICdOZ1J4IFN0b3JlIERldlRvb2xzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNvbmZpZyhcbiAgX29wdGlvbnM6IFN0b3JlRGV2dG9vbHNPcHRpb25zXG4pOiBTdG9yZURldnRvb2xzQ29uZmlnIHtcbiAgY29uc3QgREVGQVVMVF9PUFRJT05TOiBTdG9yZURldnRvb2xzQ29uZmlnID0ge1xuICAgIG1heEFnZTogZmFsc2UsXG4gICAgbW9uaXRvcjogbm9Nb25pdG9yLFxuICAgIGFjdGlvblNhbml0aXplcjogdW5kZWZpbmVkLFxuICAgIHN0YXRlU2FuaXRpemVyOiB1bmRlZmluZWQsXG4gICAgbmFtZTogREVGQVVMVF9OQU1FLFxuICAgIHNlcmlhbGl6ZTogZmFsc2UsXG4gICAgbG9nT25seTogZmFsc2UsXG4gICAgLy8gQWRkIGFsbCBmZWF0dXJlcyBleHBsaWNpdGVseS4gVGhpcyBwcmV2ZW50IGJ1Z2d5IGJlaGF2aW9yIGZvclxuICAgIC8vIG9wdGlvbnMgbGlrZSBcImxvY2tcIiB3aGljaCBtaWdodCBvdGhlcndpc2Ugbm90IHNob3cgdXAuXG4gICAgZmVhdHVyZXM6IHtcbiAgICAgIHBhdXNlOiB0cnVlLCAvLyBzdGFydC9wYXVzZSByZWNvcmRpbmcgb2YgZGlzcGF0Y2hlZCBhY3Rpb25zXG4gICAgICBsb2NrOiB0cnVlLCAvLyBsb2NrL3VubG9jayBkaXNwYXRjaGluZyBhY3Rpb25zIGFuZCBzaWRlIGVmZmVjdHNcbiAgICAgIHBlcnNpc3Q6IHRydWUsIC8vIHBlcnNpc3Qgc3RhdGVzIG9uIHBhZ2UgcmVsb2FkaW5nXG4gICAgICBleHBvcnQ6IHRydWUsIC8vIGV4cG9ydCBoaXN0b3J5IG9mIGFjdGlvbnMgaW4gYSBmaWxlXG4gICAgICBpbXBvcnQ6ICdjdXN0b20nLCAvLyBpbXBvcnQgaGlzdG9yeSBvZiBhY3Rpb25zIGZyb20gYSBmaWxlXG4gICAgICBqdW1wOiB0cnVlLCAvLyBqdW1wIGJhY2sgYW5kIGZvcnRoICh0aW1lIHRyYXZlbGxpbmcpXG4gICAgICBza2lwOiB0cnVlLCAvLyBza2lwIChjYW5jZWwpIGFjdGlvbnNcbiAgICAgIHJlb3JkZXI6IHRydWUsIC8vIGRyYWcgYW5kIGRyb3AgYWN0aW9ucyBpbiB0aGUgaGlzdG9yeSBsaXN0XG4gICAgICBkaXNwYXRjaDogdHJ1ZSwgLy8gZGlzcGF0Y2ggY3VzdG9tIGFjdGlvbnMgb3IgYWN0aW9uIGNyZWF0b3JzXG4gICAgICB0ZXN0OiB0cnVlLCAvLyBnZW5lcmF0ZSB0ZXN0cyBmb3IgdGhlIHNlbGVjdGVkIGFjdGlvbnNcbiAgICB9LFxuICB9O1xuXG4gIGxldCBvcHRpb25zID0gdHlwZW9mIF9vcHRpb25zID09PSAnZnVuY3Rpb24nID8gX29wdGlvbnMoKSA6IF9vcHRpb25zO1xuICBjb25zdCBsb2dPbmx5ID0gb3B0aW9ucy5sb2dPbmx5XG4gICAgPyB7IHBhdXNlOiB0cnVlLCBleHBvcnQ6IHRydWUsIHRlc3Q6IHRydWUgfVxuICAgIDogZmFsc2U7XG4gIGNvbnN0IGZlYXR1cmVzID0gb3B0aW9ucy5mZWF0dXJlcyB8fCBsb2dPbmx5IHx8IERFRkFVTFRfT1BUSU9OUy5mZWF0dXJlcztcbiAgY29uc3QgY29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9PUFRJT05TLCB7IGZlYXR1cmVzIH0sIG9wdGlvbnMpO1xuXG4gIGlmIChjb25maWcubWF4QWdlICYmIGNvbmZpZy5tYXhBZ2UgPCAyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYERldnRvb2xzICdtYXhBZ2UnIGNhbm5vdCBiZSBsZXNzIHRoYW4gMiwgZ290ICR7Y29uZmlnLm1heEFnZX1gXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBjb25maWc7XG59XG4iXX0=