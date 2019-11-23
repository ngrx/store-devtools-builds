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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9zdG9yZS1kZXZ0b29scy9zcmMvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxlQUFlLENBQUM7QUF5Qi9DO0lBQUE7SUFZQSxDQUFDO0lBQUQsMEJBQUM7QUFBRCxDQUFDLEFBWkQsSUFZQzs7QUFFRCxNQUFNLENBQUMsSUFBTSxxQkFBcUIsR0FBRyxJQUFJLGNBQWMsQ0FDckQsd0JBQXdCLENBQ3pCLENBQUM7QUFDRixNQUFNLENBQUMsSUFBTSxlQUFlLEdBQUcsSUFBSSxjQUFjLENBQy9DLCtCQUErQixDQUNoQyxDQUFDO0FBTUYsTUFBTSxVQUFVLFNBQVM7SUFDdkIsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQsTUFBTSxDQUFDLElBQU0sWUFBWSxHQUFHLHFCQUFxQixDQUFDO0FBRWxELE1BQU0sVUFBVSxZQUFZLENBQzFCLFFBQThCO0lBRTlCLElBQU0sZUFBZSxHQUF3QjtRQUMzQyxNQUFNLEVBQUUsS0FBSztRQUNiLE9BQU8sRUFBRSxTQUFTO1FBQ2xCLGVBQWUsRUFBRSxTQUFTO1FBQzFCLGNBQWMsRUFBRSxTQUFTO1FBQ3pCLElBQUksRUFBRSxZQUFZO1FBQ2xCLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLE9BQU8sRUFBRSxLQUFLO1FBQ2QsK0RBQStEO1FBQy9ELHlEQUF5RDtRQUN6RCxRQUFRLEVBQUU7WUFDUixLQUFLLEVBQUUsSUFBSTtZQUNYLElBQUksRUFBRSxJQUFJO1lBQ1YsT0FBTyxFQUFFLElBQUk7WUFDYixNQUFNLEVBQUUsSUFBSTtZQUNaLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLElBQUksRUFBRSxJQUFJO1lBQ1YsSUFBSSxFQUFFLElBQUk7WUFDVixPQUFPLEVBQUUsSUFBSTtZQUNiLFFBQVEsRUFBRSxJQUFJO1lBQ2QsSUFBSSxFQUFFLElBQUk7U0FDWDtLQUNGLENBQUM7SUFFRixJQUFJLE9BQU8sR0FBRyxPQUFPLFFBQVEsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7SUFDckUsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU87UUFDN0IsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7UUFDM0MsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUNWLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxJQUFJLGVBQWUsQ0FBQyxRQUFRLENBQUM7SUFDekUsSUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsZUFBZSxFQUFFLEVBQUUsUUFBUSxVQUFBLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUV6RSxJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDdEMsTUFBTSxJQUFJLEtBQUssQ0FDYixrREFBZ0QsTUFBTSxDQUFDLE1BQVEsQ0FDaEUsQ0FBQztLQUNIO0lBRUQsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjdGlvblJlZHVjZXIsIEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IEluamVjdGlvblRva2VuIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmV4cG9ydCB0eXBlIEFjdGlvblNhbml0aXplciA9IChhY3Rpb246IEFjdGlvbiwgaWQ6IG51bWJlcikgPT4gQWN0aW9uO1xuZXhwb3J0IHR5cGUgU3RhdGVTYW5pdGl6ZXIgPSAoc3RhdGU6IGFueSwgaW5kZXg6IG51bWJlcikgPT4gYW55O1xuZXhwb3J0IHR5cGUgU2VyaWFsaXphdGlvbk9wdGlvbnMgPSB7XG4gIG9wdGlvbnM/OiBib29sZWFuIHwgYW55O1xuICByZXBsYWNlcj86IChrZXk6IGFueSwgdmFsdWU6IGFueSkgPT4ge307XG4gIHJldml2ZXI/OiAoa2V5OiBhbnksIHZhbHVlOiBhbnkpID0+IHt9O1xuICBpbW11dGFibGU/OiBhbnk7XG4gIHJlZnM/OiBBcnJheTxhbnk+O1xufTtcbmV4cG9ydCB0eXBlIFByZWRpY2F0ZSA9IChzdGF0ZTogYW55LCBhY3Rpb246IEFjdGlvbikgPT4gYm9vbGVhbjtcbmV4cG9ydCBpbnRlcmZhY2UgRGV2VG9vbHNGZWF0dXJlT3B0aW9ucyB7XG4gIHBhdXNlPzogYm9vbGVhbjtcbiAgbG9jaz86IGJvb2xlYW47XG4gIHBlcnNpc3Q/OiBib29sZWFuO1xuICBleHBvcnQ/OiBib29sZWFuO1xuICBpbXBvcnQ/OiAnY3VzdG9tJyB8IGJvb2xlYW47XG4gIGp1bXA/OiBib29sZWFuO1xuICBza2lwPzogYm9vbGVhbjtcbiAgcmVvcmRlcj86IGJvb2xlYW47XG4gIGRpc3BhdGNoPzogYm9vbGVhbjtcbiAgdGVzdD86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjbGFzcyBTdG9yZURldnRvb2xzQ29uZmlnIHtcbiAgbWF4QWdlOiBudW1iZXIgfCBmYWxzZTtcbiAgbW9uaXRvcjogQWN0aW9uUmVkdWNlcjxhbnksIGFueT47XG4gIGFjdGlvblNhbml0aXplcj86IEFjdGlvblNhbml0aXplcjtcbiAgc3RhdGVTYW5pdGl6ZXI/OiBTdGF0ZVNhbml0aXplcjtcbiAgbmFtZT86IHN0cmluZztcbiAgc2VyaWFsaXplPzogYm9vbGVhbiB8IFNlcmlhbGl6YXRpb25PcHRpb25zO1xuICBsb2dPbmx5PzogYm9vbGVhbjtcbiAgZmVhdHVyZXM/OiBEZXZUb29sc0ZlYXR1cmVPcHRpb25zO1xuICBhY3Rpb25zQmxvY2tsaXN0Pzogc3RyaW5nW107XG4gIGFjdGlvbnNTYWZlbGlzdD86IHN0cmluZ1tdO1xuICBwcmVkaWNhdGU/OiBQcmVkaWNhdGU7XG59XG5cbmV4cG9ydCBjb25zdCBTVE9SRV9ERVZUT09MU19DT05GSUcgPSBuZXcgSW5qZWN0aW9uVG9rZW48U3RvcmVEZXZ0b29sc0NvbmZpZz4oXG4gICdAbmdyeC9kZXZ0b29scyBPcHRpb25zJ1xuKTtcbmV4cG9ydCBjb25zdCBJTklUSUFMX09QVElPTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48U3RvcmVEZXZ0b29sc0NvbmZpZz4oXG4gICdAbmdyeC9kZXZ0b29scyBJbml0aWFsIENvbmZpZydcbik7XG5cbmV4cG9ydCB0eXBlIFN0b3JlRGV2dG9vbHNPcHRpb25zID1cbiAgfCBQYXJ0aWFsPFN0b3JlRGV2dG9vbHNDb25maWc+XG4gIHwgKCgpID0+IFBhcnRpYWw8U3RvcmVEZXZ0b29sc0NvbmZpZz4pO1xuXG5leHBvcnQgZnVuY3Rpb24gbm9Nb25pdG9yKCk6IG51bGwge1xuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfTkFNRSA9ICdOZ1J4IFN0b3JlIERldlRvb2xzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNvbmZpZyhcbiAgX29wdGlvbnM6IFN0b3JlRGV2dG9vbHNPcHRpb25zXG4pOiBTdG9yZURldnRvb2xzQ29uZmlnIHtcbiAgY29uc3QgREVGQVVMVF9PUFRJT05TOiBTdG9yZURldnRvb2xzQ29uZmlnID0ge1xuICAgIG1heEFnZTogZmFsc2UsXG4gICAgbW9uaXRvcjogbm9Nb25pdG9yLFxuICAgIGFjdGlvblNhbml0aXplcjogdW5kZWZpbmVkLFxuICAgIHN0YXRlU2FuaXRpemVyOiB1bmRlZmluZWQsXG4gICAgbmFtZTogREVGQVVMVF9OQU1FLFxuICAgIHNlcmlhbGl6ZTogZmFsc2UsXG4gICAgbG9nT25seTogZmFsc2UsXG4gICAgLy8gQWRkIGFsbCBmZWF0dXJlcyBleHBsaWNpdGx5LiBUaGlzIHByZXZlbnQgYnVnZ3kgYmVoYXZpb3IgZm9yXG4gICAgLy8gb3B0aW9ucyBsaWtlIFwibG9ja1wiIHdoaWNoIG1pZ2h0IG90aGVyd2lzZSBub3Qgc2hvdyB1cC5cbiAgICBmZWF0dXJlczoge1xuICAgICAgcGF1c2U6IHRydWUsIC8vIHN0YXJ0L3BhdXNlIHJlY29yZGluZyBvZiBkaXNwYXRjaGVkIGFjdGlvbnNcbiAgICAgIGxvY2s6IHRydWUsIC8vIGxvY2svdW5sb2NrIGRpc3BhdGNoaW5nIGFjdGlvbnMgYW5kIHNpZGUgZWZmZWN0c1xuICAgICAgcGVyc2lzdDogdHJ1ZSwgLy8gcGVyc2lzdCBzdGF0ZXMgb24gcGFnZSByZWxvYWRpbmdcbiAgICAgIGV4cG9ydDogdHJ1ZSwgLy8gZXhwb3J0IGhpc3Rvcnkgb2YgYWN0aW9ucyBpbiBhIGZpbGVcbiAgICAgIGltcG9ydDogJ2N1c3RvbScsIC8vIGltcG9ydCBoaXN0b3J5IG9mIGFjdGlvbnMgZnJvbSBhIGZpbGVcbiAgICAgIGp1bXA6IHRydWUsIC8vIGp1bXAgYmFjayBhbmQgZm9ydGggKHRpbWUgdHJhdmVsbGluZylcbiAgICAgIHNraXA6IHRydWUsIC8vIHNraXAgKGNhbmNlbCkgYWN0aW9uc1xuICAgICAgcmVvcmRlcjogdHJ1ZSwgLy8gZHJhZyBhbmQgZHJvcCBhY3Rpb25zIGluIHRoZSBoaXN0b3J5IGxpc3RcbiAgICAgIGRpc3BhdGNoOiB0cnVlLCAvLyBkaXNwYXRjaCBjdXN0b20gYWN0aW9ucyBvciBhY3Rpb24gY3JlYXRvcnNcbiAgICAgIHRlc3Q6IHRydWUsIC8vIGdlbmVyYXRlIHRlc3RzIGZvciB0aGUgc2VsZWN0ZWQgYWN0aW9uc1xuICAgIH0sXG4gIH07XG5cbiAgbGV0IG9wdGlvbnMgPSB0eXBlb2YgX29wdGlvbnMgPT09ICdmdW5jdGlvbicgPyBfb3B0aW9ucygpIDogX29wdGlvbnM7XG4gIGNvbnN0IGxvZ09ubHkgPSBvcHRpb25zLmxvZ09ubHlcbiAgICA/IHsgcGF1c2U6IHRydWUsIGV4cG9ydDogdHJ1ZSwgdGVzdDogdHJ1ZSB9XG4gICAgOiBmYWxzZTtcbiAgY29uc3QgZmVhdHVyZXMgPSBvcHRpb25zLmZlYXR1cmVzIHx8IGxvZ09ubHkgfHwgREVGQVVMVF9PUFRJT05TLmZlYXR1cmVzO1xuICBjb25zdCBjb25maWcgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX09QVElPTlMsIHsgZmVhdHVyZXMgfSwgb3B0aW9ucyk7XG5cbiAgaWYgKGNvbmZpZy5tYXhBZ2UgJiYgY29uZmlnLm1heEFnZSA8IDIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgRGV2dG9vbHMgJ21heEFnZScgY2Fubm90IGJlIGxlc3MgdGhhbiAyLCBnb3QgJHtjb25maWcubWF4QWdlfWBcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIGNvbmZpZztcbn1cbiJdfQ==