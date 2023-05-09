import { InjectionToken } from '@angular/core';
/**
 * Chrome extension documentation
 * @see https://github.com/reduxjs/redux-devtools/blob/main/extension/docs/API/Arguments.md
 * Firefox extension documentation
 * @see https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md
 */
export class StoreDevtoolsConfig {
    constructor() {
        /**
         * Maximum allowed actions to be stored in the history tree (default: `false`)
         */
        this.maxAge = false;
    }
}
export const STORE_DEVTOOLS_CONFIG = new InjectionToken('@ngrx/store-devtools Options');
/**
 * Used to provide a `StoreDevtoolsConfig` for the store-devtools.
 */
export const INITIAL_OPTIONS = new InjectionToken('@ngrx/store-devtools Initial Config');
export function noMonitor() {
    return null;
}
export const DEFAULT_NAME = 'NgRx Store DevTools';
export function createConfig(optionsInput) {
    const DEFAULT_OPTIONS = {
        maxAge: false,
        monitor: noMonitor,
        actionSanitizer: undefined,
        stateSanitizer: undefined,
        name: DEFAULT_NAME,
        serialize: false,
        logOnly: false,
        autoPause: false,
        trace: false,
        traceLimit: 75,
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
            test: true, // Generate tests for the selected actions
        },
    };
    const options = typeof optionsInput === 'function' ? optionsInput() : optionsInput;
    const logOnly = options.logOnly
        ? { pause: true, export: true, test: true }
        : false;
    const features = options.features ||
        logOnly ||
        DEFAULT_OPTIONS.features;
    if (features.import === true) {
        features.import = 'custom';
    }
    const config = Object.assign({}, DEFAULT_OPTIONS, { features }, options);
    if (config.maxAge && config.maxAge < 2) {
        throw new Error(`Devtools 'maxAge' cannot be less than 2, got ${config.maxAge}`);
    }
    return config;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9zdG9yZS1kZXZ0b29scy9zcmMvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxlQUFlLENBQUM7QUE4RC9DOzs7OztHQUtHO0FBQ0gsTUFBTSxPQUFPLG1CQUFtQjtJQUFoQztRQUNFOztXQUVHO1FBQ0gsV0FBTSxHQUFtQixLQUFLLENBQUM7SUEyQ2pDLENBQUM7Q0FBQTtBQUVELE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUFHLElBQUksY0FBYyxDQUNyRCw4QkFBOEIsQ0FDL0IsQ0FBQztBQUVGOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUFHLElBQUksY0FBYyxDQUMvQyxxQ0FBcUMsQ0FDdEMsQ0FBQztBQU1GLE1BQU0sVUFBVSxTQUFTO0lBQ3ZCLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLFlBQVksR0FBRyxxQkFBcUIsQ0FBQztBQUVsRCxNQUFNLFVBQVUsWUFBWSxDQUMxQixZQUFrQztJQUVsQyxNQUFNLGVBQWUsR0FBd0I7UUFDM0MsTUFBTSxFQUFFLEtBQUs7UUFDYixPQUFPLEVBQUUsU0FBUztRQUNsQixlQUFlLEVBQUUsU0FBUztRQUMxQixjQUFjLEVBQUUsU0FBUztRQUN6QixJQUFJLEVBQUUsWUFBWTtRQUNsQixTQUFTLEVBQUUsS0FBSztRQUNoQixPQUFPLEVBQUUsS0FBSztRQUNkLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLEtBQUssRUFBRSxLQUFLO1FBQ1osVUFBVSxFQUFFLEVBQUU7UUFDZCwrREFBK0Q7UUFDL0QseURBQXlEO1FBQ3pELFFBQVEsRUFBRTtZQUNSLEtBQUssRUFBRSxJQUFJO1lBQ1gsSUFBSSxFQUFFLElBQUk7WUFDVixPQUFPLEVBQUUsSUFBSTtZQUNiLE1BQU0sRUFBRSxJQUFJO1lBQ1osTUFBTSxFQUFFLFFBQVE7WUFDaEIsSUFBSSxFQUFFLElBQUk7WUFDVixJQUFJLEVBQUUsSUFBSTtZQUNWLE9BQU8sRUFBRSxJQUFJO1lBQ2IsUUFBUSxFQUFFLElBQUk7WUFDZCxJQUFJLEVBQUUsSUFBSSxFQUFFLDBDQUEwQztTQUN2RDtLQUNGLENBQUM7SUFFRixNQUFNLE9BQU8sR0FDWCxPQUFPLFlBQVksS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUM7SUFDckUsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU87UUFDN0IsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7UUFDM0MsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUNWLE1BQU0sUUFBUSxHQUNaLE9BQU8sQ0FBQyxRQUFRO1FBQ2hCLE9BQU87UUFDTixlQUFlLENBQUMsUUFFZixDQUFDO0lBQ0wsSUFBSSxRQUFRLENBQUMsTUFBTSxLQUFLLElBQUksRUFBRTtRQUM1QixRQUFRLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQztLQUM1QjtJQUNELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLGVBQWUsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRXpFLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUN0QyxNQUFNLElBQUksS0FBSyxDQUNiLGdEQUFnRCxNQUFNLENBQUMsTUFBTSxFQUFFLENBQ2hFLENBQUM7S0FDSDtJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY3Rpb25SZWR1Y2VyLCBBY3Rpb24gfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBJbmplY3Rpb25Ub2tlbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5leHBvcnQgdHlwZSBBY3Rpb25TYW5pdGl6ZXIgPSAoYWN0aW9uOiBBY3Rpb24sIGlkOiBudW1iZXIpID0+IEFjdGlvbjtcbmV4cG9ydCB0eXBlIFN0YXRlU2FuaXRpemVyID0gKHN0YXRlOiBhbnksIGluZGV4OiBudW1iZXIpID0+IGFueTtcbmV4cG9ydCB0eXBlIFNlcmlhbGl6YXRpb25PcHRpb25zID0ge1xuICBvcHRpb25zPzogYm9vbGVhbiB8IGFueTtcbiAgcmVwbGFjZXI/OiAoa2V5OiBhbnksIHZhbHVlOiBhbnkpID0+IHt9O1xuICByZXZpdmVyPzogKGtleTogYW55LCB2YWx1ZTogYW55KSA9PiB7fTtcbiAgaW1tdXRhYmxlPzogYW55O1xuICByZWZzPzogQXJyYXk8YW55Pjtcbn07XG5leHBvcnQgdHlwZSBQcmVkaWNhdGUgPSAoc3RhdGU6IGFueSwgYWN0aW9uOiBBY3Rpb24pID0+IGJvb2xlYW47XG5cbi8qKlxuICogQ2hyb21lIGV4dGVuc2lvbiBkb2N1bWVudGF0aW9uXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9yZWR1eGpzL3JlZHV4LWRldnRvb2xzL2Jsb2IvbWFpbi9leHRlbnNpb24vZG9jcy9BUEkvQXJndW1lbnRzLm1kI2ZlYXR1cmVzXG4gKiBGaXJlZm94IGV4dGVuc2lvbiBkb2N1bWVudGF0aW9uXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS96YWxtb3hpc3VzL3JlZHV4LWRldnRvb2xzLWV4dGVuc2lvbi9ibG9iL21hc3Rlci9kb2NzL0FQSS9Bcmd1bWVudHMubWQjZmVhdHVyZXNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEZXZUb29sc0ZlYXR1cmVPcHRpb25zIHtcbiAgLyoqXG4gICAqIFN0YXJ0L3BhdXNlIHJlY29yZGluZyBvZiBkaXNwYXRjaGVkIGFjdGlvbnNcbiAgICovXG4gIHBhdXNlPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIExvY2svdW5sb2NrIGRpc3BhdGNoaW5nIGFjdGlvbnMgYW5kIHNpZGUgZWZmZWN0c1xuICAgKi9cbiAgbG9jaz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBQZXJzaXN0IHN0YXRlcyBvbiBwYWdlIHJlbG9hZGluZ1xuICAgKi9cbiAgcGVyc2lzdD86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBFeHBvcnQgaGlzdG9yeSBvZiBhY3Rpb25zIGluIGEgZmlsZVxuICAgKi9cbiAgZXhwb3J0PzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIEltcG9ydCBoaXN0b3J5IG9mIGFjdGlvbnMgZnJvbSBhIGZpbGVcbiAgICovXG4gIGltcG9ydD86ICdjdXN0b20nIHwgYm9vbGVhbjtcbiAgLyoqXG4gICAqIEp1bXAgYmFjayBhbmQgZm9ydGggKHRpbWUgdHJhdmVsbGluZylcbiAgICovXG4gIGp1bXA/OiBib29sZWFuO1xuICAvKipcbiAgICogU2tpcCAoY2FuY2VsKSBhY3Rpb25zXG4gICAqL1xuICBza2lwPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIERyYWcgYW5kIGRyb3AgYWN0aW9ucyBpbiB0aGUgaGlzdG9yeSBsaXN0XG4gICAqL1xuICByZW9yZGVyPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIERpc3BhdGNoIGN1c3RvbSBhY3Rpb25zIG9yIGFjdGlvbiBjcmVhdG9yc1xuICAgKi9cbiAgZGlzcGF0Y2g/OiBib29sZWFuO1xuICAvKipcbiAgICogR2VuZXJhdGUgdGVzdHMgZm9yIHRoZSBzZWxlY3RlZCBhY3Rpb25zXG4gICAqL1xuICB0ZXN0PzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBDaHJvbWUgZXh0ZW5zaW9uIGRvY3VtZW50YXRpb25cbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3JlZHV4anMvcmVkdXgtZGV2dG9vbHMvYmxvYi9tYWluL2V4dGVuc2lvbi9kb2NzL0FQSS9Bcmd1bWVudHMubWRcbiAqIEZpcmVmb3ggZXh0ZW5zaW9uIGRvY3VtZW50YXRpb25cbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3phbG1veGlzdXMvcmVkdXgtZGV2dG9vbHMtZXh0ZW5zaW9uL2Jsb2IvbWFzdGVyL2RvY3MvQVBJL0FyZ3VtZW50cy5tZFxuICovXG5leHBvcnQgY2xhc3MgU3RvcmVEZXZ0b29sc0NvbmZpZyB7XG4gIC8qKlxuICAgKiBNYXhpbXVtIGFsbG93ZWQgYWN0aW9ucyB0byBiZSBzdG9yZWQgaW4gdGhlIGhpc3RvcnkgdHJlZSAoZGVmYXVsdDogYGZhbHNlYClcbiAgICovXG4gIG1heEFnZTogbnVtYmVyIHwgZmFsc2UgPSBmYWxzZTtcbiAgbW9uaXRvcj86IEFjdGlvblJlZHVjZXI8YW55LCBhbnk+O1xuICAvKipcbiAgICogRnVuY3Rpb24gd2hpY2ggdGFrZXMgYGFjdGlvbmAgb2JqZWN0IGFuZCBpZCBudW1iZXIgYXMgYXJndW1lbnRzLCBhbmQgc2hvdWxkIHJldHVybiBgYWN0aW9uYCBvYmplY3QgYmFjay5cbiAgICovXG4gIGFjdGlvblNhbml0aXplcj86IEFjdGlvblNhbml0aXplcjtcbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHdoaWNoIHRha2VzIGBzdGF0ZWAgb2JqZWN0IGFuZCBpbmRleCBhcyBhcmd1bWVudHMsIGFuZCBzaG91bGQgcmV0dXJuIGBzdGF0ZWAgb2JqZWN0IGJhY2suXG4gICAqL1xuICBzdGF0ZVNhbml0aXplcj86IFN0YXRlU2FuaXRpemVyO1xuICAvKipcbiAgICogVGhlIGluc3RhbmNlIG5hbWUgdG8gYmUgc2hvd24gb24gdGhlIG1vbml0b3IgcGFnZSAoZGVmYXVsdDogYGRvY3VtZW50LnRpdGxlYClcbiAgICovXG4gIG5hbWU/OiBzdHJpbmc7XG4gIHNlcmlhbGl6ZT86IGJvb2xlYW4gfCBTZXJpYWxpemF0aW9uT3B0aW9ucztcbiAgbG9nT25seT86IGJvb2xlYW47XG4gIGZlYXR1cmVzPzogRGV2VG9vbHNGZWF0dXJlT3B0aW9ucztcbiAgLyoqXG4gICAqIEFjdGlvbiB0eXBlcyB0byBiZSBoaWRkZW4gaW4gdGhlIG1vbml0b3JzLiBJZiBgYWN0aW9uc1NhZmVsaXN0YCBzcGVjaWZpZWQsIGBhY3Rpb25zQmxvY2tsaXN0YCBpcyBpZ25vcmVkLlxuICAgKi9cbiAgYWN0aW9uc0Jsb2NrbGlzdD86IHN0cmluZ1tdO1xuICAvKipcbiAgICogQWN0aW9uIHR5cGVzIHRvIGJlIHNob3duIGluIHRoZSBtb25pdG9yc1xuICAgKi9cbiAgYWN0aW9uc1NhZmVsaXN0Pzogc3RyaW5nW107XG4gIC8qKlxuICAgKiBDYWxsZWQgZm9yIGV2ZXJ5IGFjdGlvbiBiZWZvcmUgc2VuZGluZywgdGFrZXMgc3RhdGUgYW5kIGFjdGlvbiBvYmplY3QsIGFuZCByZXR1cm5zIHRydWUgaW4gY2FzZSBpdCBhbGxvd3Mgc2VuZGluZyB0aGUgY3VycmVudCBkYXRhIHRvIHRoZSBtb25pdG9yLlxuICAgKi9cbiAgcHJlZGljYXRlPzogUHJlZGljYXRlO1xuICAvKipcbiAgICogQXV0byBwYXVzZXMgd2hlbiB0aGUgZXh0ZW5zaW9u4oCZcyB3aW5kb3cgaXMgbm90IG9wZW5lZCwgYW5kIHNvIGhhcyB6ZXJvIGltcGFjdCBvbiB5b3VyIGFwcCB3aGVuIG5vdCBpbiB1c2UuXG4gICAqL1xuICBhdXRvUGF1c2U/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJZiBzZXQgdG8gdHJ1ZSwgd2lsbCBpbmNsdWRlIHN0YWNrIHRyYWNlIGZvciBldmVyeSBkaXNwYXRjaGVkIGFjdGlvblxuICAgKi9cbiAgdHJhY2U/OiBib29sZWFuIHwgKCgpID0+IHN0cmluZyk7XG5cbiAgLyoqXG4gICAqIE1heGltdW0gc3RhY2sgdHJhY2UgZnJhbWVzIHRvIGJlIHN0b3JlZCAoaW4gY2FzZSB0cmFjZSBvcHRpb24gd2FzIHByb3ZpZGVkIGFzIHRydWUpLlxuICAgKi9cbiAgdHJhY2VMaW1pdD86IG51bWJlcjtcbn1cblxuZXhwb3J0IGNvbnN0IFNUT1JFX0RFVlRPT0xTX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxTdG9yZURldnRvb2xzQ29uZmlnPihcbiAgJ0BuZ3J4L3N0b3JlLWRldnRvb2xzIE9wdGlvbnMnXG4pO1xuXG4vKipcbiAqIFVzZWQgdG8gcHJvdmlkZSBhIGBTdG9yZURldnRvb2xzQ29uZmlnYCBmb3IgdGhlIHN0b3JlLWRldnRvb2xzLlxuICovXG5leHBvcnQgY29uc3QgSU5JVElBTF9PUFRJT05TID0gbmV3IEluamVjdGlvblRva2VuPFN0b3JlRGV2dG9vbHNDb25maWc+KFxuICAnQG5ncngvc3RvcmUtZGV2dG9vbHMgSW5pdGlhbCBDb25maWcnXG4pO1xuXG5leHBvcnQgdHlwZSBTdG9yZURldnRvb2xzT3B0aW9ucyA9XG4gIHwgUGFydGlhbDxTdG9yZURldnRvb2xzQ29uZmlnPlxuICB8ICgoKSA9PiBQYXJ0aWFsPFN0b3JlRGV2dG9vbHNDb25maWc+KTtcblxuZXhwb3J0IGZ1bmN0aW9uIG5vTW9uaXRvcigpOiBudWxsIHtcbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX05BTUUgPSAnTmdSeCBTdG9yZSBEZXZUb29scyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDb25maWcoXG4gIG9wdGlvbnNJbnB1dDogU3RvcmVEZXZ0b29sc09wdGlvbnNcbik6IFN0b3JlRGV2dG9vbHNDb25maWcge1xuICBjb25zdCBERUZBVUxUX09QVElPTlM6IFN0b3JlRGV2dG9vbHNDb25maWcgPSB7XG4gICAgbWF4QWdlOiBmYWxzZSxcbiAgICBtb25pdG9yOiBub01vbml0b3IsXG4gICAgYWN0aW9uU2FuaXRpemVyOiB1bmRlZmluZWQsXG4gICAgc3RhdGVTYW5pdGl6ZXI6IHVuZGVmaW5lZCxcbiAgICBuYW1lOiBERUZBVUxUX05BTUUsXG4gICAgc2VyaWFsaXplOiBmYWxzZSxcbiAgICBsb2dPbmx5OiBmYWxzZSxcbiAgICBhdXRvUGF1c2U6IGZhbHNlLFxuICAgIHRyYWNlOiBmYWxzZSxcbiAgICB0cmFjZUxpbWl0OiA3NSxcbiAgICAvLyBBZGQgYWxsIGZlYXR1cmVzIGV4cGxpY2l0bHkuIFRoaXMgcHJldmVudCBidWdneSBiZWhhdmlvciBmb3JcbiAgICAvLyBvcHRpb25zIGxpa2UgXCJsb2NrXCIgd2hpY2ggbWlnaHQgb3RoZXJ3aXNlIG5vdCBzaG93IHVwLlxuICAgIGZlYXR1cmVzOiB7XG4gICAgICBwYXVzZTogdHJ1ZSwgLy8gU3RhcnQvcGF1c2UgcmVjb3JkaW5nIG9mIGRpc3BhdGNoZWQgYWN0aW9uc1xuICAgICAgbG9jazogdHJ1ZSwgLy8gTG9jay91bmxvY2sgZGlzcGF0Y2hpbmcgYWN0aW9ucyBhbmQgc2lkZSBlZmZlY3RzXG4gICAgICBwZXJzaXN0OiB0cnVlLCAvLyBQZXJzaXN0IHN0YXRlcyBvbiBwYWdlIHJlbG9hZGluZ1xuICAgICAgZXhwb3J0OiB0cnVlLCAvLyBFeHBvcnQgaGlzdG9yeSBvZiBhY3Rpb25zIGluIGEgZmlsZVxuICAgICAgaW1wb3J0OiAnY3VzdG9tJywgLy8gSW1wb3J0IGhpc3Rvcnkgb2YgYWN0aW9ucyBmcm9tIGEgZmlsZVxuICAgICAganVtcDogdHJ1ZSwgLy8gSnVtcCBiYWNrIGFuZCBmb3J0aCAodGltZSB0cmF2ZWxsaW5nKVxuICAgICAgc2tpcDogdHJ1ZSwgLy8gU2tpcCAoY2FuY2VsKSBhY3Rpb25zXG4gICAgICByZW9yZGVyOiB0cnVlLCAvLyBEcmFnIGFuZCBkcm9wIGFjdGlvbnMgaW4gdGhlIGhpc3RvcnkgbGlzdFxuICAgICAgZGlzcGF0Y2g6IHRydWUsIC8vIERpc3BhdGNoIGN1c3RvbSBhY3Rpb25zIG9yIGFjdGlvbiBjcmVhdG9yc1xuICAgICAgdGVzdDogdHJ1ZSwgLy8gR2VuZXJhdGUgdGVzdHMgZm9yIHRoZSBzZWxlY3RlZCBhY3Rpb25zXG4gICAgfSxcbiAgfTtcblxuICBjb25zdCBvcHRpb25zID1cbiAgICB0eXBlb2Ygb3B0aW9uc0lucHV0ID09PSAnZnVuY3Rpb24nID8gb3B0aW9uc0lucHV0KCkgOiBvcHRpb25zSW5wdXQ7XG4gIGNvbnN0IGxvZ09ubHkgPSBvcHRpb25zLmxvZ09ubHlcbiAgICA/IHsgcGF1c2U6IHRydWUsIGV4cG9ydDogdHJ1ZSwgdGVzdDogdHJ1ZSB9XG4gICAgOiBmYWxzZTtcbiAgY29uc3QgZmVhdHVyZXM6IE5vbk51bGxhYmxlPFBhcnRpYWw8U3RvcmVEZXZ0b29sc0NvbmZpZ1snZmVhdHVyZXMnXT4+ID1cbiAgICBvcHRpb25zLmZlYXR1cmVzIHx8XG4gICAgbG9nT25seSB8fFxuICAgIChERUZBVUxUX09QVElPTlMuZmVhdHVyZXMgYXMgTm9uTnVsbGFibGU8XG4gICAgICBQYXJ0aWFsPFN0b3JlRGV2dG9vbHNDb25maWdbJ2ZlYXR1cmVzJ10+XG4gICAgPik7XG4gIGlmIChmZWF0dXJlcy5pbXBvcnQgPT09IHRydWUpIHtcbiAgICBmZWF0dXJlcy5pbXBvcnQgPSAnY3VzdG9tJztcbiAgfVxuICBjb25zdCBjb25maWcgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX09QVElPTlMsIHsgZmVhdHVyZXMgfSwgb3B0aW9ucyk7XG5cbiAgaWYgKGNvbmZpZy5tYXhBZ2UgJiYgY29uZmlnLm1heEFnZSA8IDIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgRGV2dG9vbHMgJ21heEFnZScgY2Fubm90IGJlIGxlc3MgdGhhbiAyLCBnb3QgJHtjb25maWcubWF4QWdlfWBcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIGNvbmZpZztcbn1cbiJdfQ==