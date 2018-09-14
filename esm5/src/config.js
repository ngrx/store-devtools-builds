import { InjectionToken } from '@angular/core';
var StoreDevtoolsConfig = /** @class */ (function () {
    function StoreDevtoolsConfig() {
    }
    return StoreDevtoolsConfig;
}());
export { StoreDevtoolsConfig };
export var STORE_DEVTOOLS_CONFIG = new InjectionToken('@ngrx/devtools Options');
export var INITIAL_OPTIONS = new InjectionToken('@ngrx/devtools Initial Config');
export function noMonitor() {
    return null;
}
export var DEFAULT_NAME = 'NgRx Store DevTools';
export function createConfig(_options) {
    var DEFAULT_OPTIONS = {
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
            lock: true,
            persist: true,
            export: true,
            import: 'custom',
            jump: true,
            skip: true,
            reorder: true,
            dispatch: true,
            test: true,
        },
    };
    var options = typeof _options === 'function' ? _options() : _options;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9zdG9yZS1kZXZ0b29scy9zcmMvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxjQUFjLEVBQVEsTUFBTSxlQUFlLENBQUM7QUFhckQ7SUFBQTtJQVlBLENBQUM7SUFBRCwwQkFBQztBQUFELENBQUMsQUFaRCxJQVlDOztBQUVELE1BQU0sQ0FBQyxJQUFNLHFCQUFxQixHQUFHLElBQUksY0FBYyxDQUNyRCx3QkFBd0IsQ0FDekIsQ0FBQztBQUNGLE1BQU0sQ0FBQyxJQUFNLGVBQWUsR0FBRyxJQUFJLGNBQWMsQ0FDL0MsK0JBQStCLENBQ2hDLENBQUM7QUFNRixNQUFNO0lBQ0osT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQsTUFBTSxDQUFDLElBQU0sWUFBWSxHQUFHLHFCQUFxQixDQUFDO0FBRWxELE1BQU0sdUJBQ0osUUFBOEI7SUFFOUIsSUFBTSxlQUFlLEdBQXdCO1FBQzNDLE1BQU0sRUFBRSxLQUFLO1FBQ2IsT0FBTyxFQUFFLFNBQVM7UUFDbEIsZUFBZSxFQUFFLFNBQVM7UUFDMUIsY0FBYyxFQUFFLFNBQVM7UUFDekIsSUFBSSxFQUFFLFlBQVk7UUFDbEIsU0FBUyxFQUFFLEtBQUs7UUFDaEIsT0FBTyxFQUFFLEtBQUs7UUFDZCxnRUFBZ0U7UUFDaEUseURBQXlEO1FBQ3pELFFBQVEsRUFBRTtZQUNSLEtBQUssRUFBRSxJQUFJO1lBQ1gsSUFBSSxFQUFFLElBQUk7WUFDVixPQUFPLEVBQUUsSUFBSTtZQUNiLE1BQU0sRUFBRSxJQUFJO1lBQ1osTUFBTSxFQUFFLFFBQVE7WUFDaEIsSUFBSSxFQUFFLElBQUk7WUFDVixJQUFJLEVBQUUsSUFBSTtZQUNWLE9BQU8sRUFBRSxJQUFJO1lBQ2IsUUFBUSxFQUFFLElBQUk7WUFDZCxJQUFJLEVBQUUsSUFBSTtTQUNYO0tBQ0YsQ0FBQztJQUVGLElBQUksT0FBTyxHQUFHLE9BQU8sUUFBUSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztJQUNyRSxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTztRQUM3QixDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtRQUMzQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ1YsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLElBQUksZUFBZSxDQUFDLFFBQVEsQ0FBQztJQUN6RSxJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxlQUFlLEVBQUUsRUFBRSxRQUFRLFVBQUEsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRXpFLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUN0QyxNQUFNLElBQUksS0FBSyxDQUNiLGtEQUFnRCxNQUFNLENBQUMsTUFBUSxDQUNoRSxDQUFDO0tBQ0g7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWN0aW9uUmVkdWNlciwgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgSW5qZWN0aW9uVG9rZW4sIFR5cGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZXhwb3J0IHR5cGUgQWN0aW9uU2FuaXRpemVyID0gKGFjdGlvbjogQWN0aW9uLCBpZDogbnVtYmVyKSA9PiBBY3Rpb247XG5leHBvcnQgdHlwZSBTdGF0ZVNhbml0aXplciA9IChzdGF0ZTogYW55LCBpbmRleDogbnVtYmVyKSA9PiBhbnk7XG5leHBvcnQgdHlwZSBTZXJpYWxpemF0aW9uT3B0aW9ucyA9IHtcbiAgb3B0aW9ucz86IGJvb2xlYW4gfCBhbnk7XG4gIHJlcGxhY2VyPzogKGtleTogYW55LCB2YWx1ZTogYW55KSA9PiB7fTtcbiAgcmV2aXZlcj86IChrZXk6IGFueSwgdmFsdWU6IGFueSkgPT4ge307XG4gIGltbXV0YWJsZT86IGFueTtcbiAgcmVmcz86IEFycmF5PGFueT47XG59O1xuZXhwb3J0IHR5cGUgUHJlZGljYXRlID0gKHN0YXRlOiBhbnksIGFjdGlvbjogQWN0aW9uKSA9PiBib29sZWFuO1xuXG5leHBvcnQgY2xhc3MgU3RvcmVEZXZ0b29sc0NvbmZpZyB7XG4gIG1heEFnZTogbnVtYmVyIHwgZmFsc2U7XG4gIG1vbml0b3I6IEFjdGlvblJlZHVjZXI8YW55LCBhbnk+O1xuICBhY3Rpb25TYW5pdGl6ZXI/OiBBY3Rpb25TYW5pdGl6ZXI7XG4gIHN0YXRlU2FuaXRpemVyPzogU3RhdGVTYW5pdGl6ZXI7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIHNlcmlhbGl6ZT86IGJvb2xlYW4gfCBTZXJpYWxpemF0aW9uT3B0aW9ucztcbiAgbG9nT25seT86IGJvb2xlYW47XG4gIGZlYXR1cmVzPzogYW55O1xuICBhY3Rpb25zQmxhY2tsaXN0Pzogc3RyaW5nW107XG4gIGFjdGlvbnNXaGl0ZWxpc3Q/OiBzdHJpbmdbXTtcbiAgcHJlZGljYXRlPzogUHJlZGljYXRlO1xufVxuXG5leHBvcnQgY29uc3QgU1RPUkVfREVWVE9PTFNfQ09ORklHID0gbmV3IEluamVjdGlvblRva2VuPFN0b3JlRGV2dG9vbHNDb25maWc+KFxuICAnQG5ncngvZGV2dG9vbHMgT3B0aW9ucydcbik7XG5leHBvcnQgY29uc3QgSU5JVElBTF9PUFRJT05TID0gbmV3IEluamVjdGlvblRva2VuPFN0b3JlRGV2dG9vbHNDb25maWc+KFxuICAnQG5ncngvZGV2dG9vbHMgSW5pdGlhbCBDb25maWcnXG4pO1xuXG5leHBvcnQgdHlwZSBTdG9yZURldnRvb2xzT3B0aW9ucyA9XG4gIHwgUGFydGlhbDxTdG9yZURldnRvb2xzQ29uZmlnPlxuICB8ICgoKSA9PiBQYXJ0aWFsPFN0b3JlRGV2dG9vbHNDb25maWc+KTtcblxuZXhwb3J0IGZ1bmN0aW9uIG5vTW9uaXRvcigpOiBudWxsIHtcbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX05BTUUgPSAnTmdSeCBTdG9yZSBEZXZUb29scyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDb25maWcoXG4gIF9vcHRpb25zOiBTdG9yZURldnRvb2xzT3B0aW9uc1xuKTogU3RvcmVEZXZ0b29sc0NvbmZpZyB7XG4gIGNvbnN0IERFRkFVTFRfT1BUSU9OUzogU3RvcmVEZXZ0b29sc0NvbmZpZyA9IHtcbiAgICBtYXhBZ2U6IGZhbHNlLFxuICAgIG1vbml0b3I6IG5vTW9uaXRvcixcbiAgICBhY3Rpb25TYW5pdGl6ZXI6IHVuZGVmaW5lZCxcbiAgICBzdGF0ZVNhbml0aXplcjogdW5kZWZpbmVkLFxuICAgIG5hbWU6IERFRkFVTFRfTkFNRSxcbiAgICBzZXJpYWxpemU6IGZhbHNlLFxuICAgIGxvZ09ubHk6IGZhbHNlLFxuICAgIC8vIEFkZCBhbGwgZmVhdHVyZXMgZXhwbGljaXRlbHkuIFRoaXMgcHJldmVudCBidWdneSBiZWhhdmlvciBmb3JcbiAgICAvLyBvcHRpb25zIGxpa2UgXCJsb2NrXCIgd2hpY2ggbWlnaHQgb3RoZXJ3aXNlIG5vdCBzaG93IHVwLlxuICAgIGZlYXR1cmVzOiB7XG4gICAgICBwYXVzZTogdHJ1ZSwgLy8gc3RhcnQvcGF1c2UgcmVjb3JkaW5nIG9mIGRpc3BhdGNoZWQgYWN0aW9uc1xuICAgICAgbG9jazogdHJ1ZSwgLy8gbG9jay91bmxvY2sgZGlzcGF0Y2hpbmcgYWN0aW9ucyBhbmQgc2lkZSBlZmZlY3RzXG4gICAgICBwZXJzaXN0OiB0cnVlLCAvLyBwZXJzaXN0IHN0YXRlcyBvbiBwYWdlIHJlbG9hZGluZ1xuICAgICAgZXhwb3J0OiB0cnVlLCAvLyBleHBvcnQgaGlzdG9yeSBvZiBhY3Rpb25zIGluIGEgZmlsZVxuICAgICAgaW1wb3J0OiAnY3VzdG9tJywgLy8gaW1wb3J0IGhpc3Rvcnkgb2YgYWN0aW9ucyBmcm9tIGEgZmlsZVxuICAgICAganVtcDogdHJ1ZSwgLy8ganVtcCBiYWNrIGFuZCBmb3J0aCAodGltZSB0cmF2ZWxsaW5nKVxuICAgICAgc2tpcDogdHJ1ZSwgLy8gc2tpcCAoY2FuY2VsKSBhY3Rpb25zXG4gICAgICByZW9yZGVyOiB0cnVlLCAvLyBkcmFnIGFuZCBkcm9wIGFjdGlvbnMgaW4gdGhlIGhpc3RvcnkgbGlzdFxuICAgICAgZGlzcGF0Y2g6IHRydWUsIC8vIGRpc3BhdGNoIGN1c3RvbSBhY3Rpb25zIG9yIGFjdGlvbiBjcmVhdG9yc1xuICAgICAgdGVzdDogdHJ1ZSwgLy8gZ2VuZXJhdGUgdGVzdHMgZm9yIHRoZSBzZWxlY3RlZCBhY3Rpb25zXG4gICAgfSxcbiAgfTtcblxuICBsZXQgb3B0aW9ucyA9IHR5cGVvZiBfb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJyA/IF9vcHRpb25zKCkgOiBfb3B0aW9ucztcbiAgY29uc3QgbG9nT25seSA9IG9wdGlvbnMubG9nT25seVxuICAgID8geyBwYXVzZTogdHJ1ZSwgZXhwb3J0OiB0cnVlLCB0ZXN0OiB0cnVlIH1cbiAgICA6IGZhbHNlO1xuICBjb25zdCBmZWF0dXJlcyA9IG9wdGlvbnMuZmVhdHVyZXMgfHwgbG9nT25seSB8fCBERUZBVUxUX09QVElPTlMuZmVhdHVyZXM7XG4gIGNvbnN0IGNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfT1BUSU9OUywgeyBmZWF0dXJlcyB9LCBvcHRpb25zKTtcblxuICBpZiAoY29uZmlnLm1heEFnZSAmJiBjb25maWcubWF4QWdlIDwgMikge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBEZXZ0b29scyAnbWF4QWdlJyBjYW5ub3QgYmUgbGVzcyB0aGFuIDIsIGdvdCAke2NvbmZpZy5tYXhBZ2V9YFxuICAgICk7XG4gIH1cblxuICByZXR1cm4gY29uZmlnO1xufVxuIl19