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
export const IS_EXTENSION_OR_MONITOR_PRESENT = new InjectionToken('Is Devtools Extension or Monitor Present');
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
    const extensionKey = '__REDUX_DEVTOOLS_EXTENSION__';
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
export class StoreDevtoolsModule {
    /**
     * @param {?=} options
     * @return {?}
     */
    static instrument(options = {}) {
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
    }
}
StoreDevtoolsModule.decorators = [
    { type: NgModule, args: [{},] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdHJ1bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21vZHVsZXMvc3RvcmUtZGV2dG9vbHMvc3JjL2luc3RydW1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsY0FBYyxFQUF1QixRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDOUUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLGVBQWUsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUd4RSxPQUFPLEVBQ0wsZUFBZSxFQUNmLHFCQUFxQixFQUdyQixTQUFTLEVBQ1QsWUFBWSxHQUNiLE1BQU0sVUFBVSxDQUFDO0FBQ2xCLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDM0MsT0FBTyxFQUNMLGlCQUFpQixFQUNqQix3QkFBd0IsR0FFekIsTUFBTSxhQUFhLENBQUM7QUFDckIsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7O0FBRTNELE1BQU0sT0FBTywrQkFBK0IsR0FBRyxJQUFJLGNBQWMsQ0FDL0QsMENBQTBDLENBQzNDOzs7Ozs7QUFFRCxNQUFNLFVBQVUsaUNBQWlDLENBQy9DLFNBQXdDLEVBQ3hDLE1BQTJCO0lBRTNCLE9BQU8sT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDO0FBQzVELENBQUM7Ozs7QUFFRCxNQUFNLFVBQVUsNEJBQTRCOztVQUNwQyxZQUFZLEdBQUcsOEJBQThCO0lBRW5ELElBQ0UsT0FBTyxNQUFNLEtBQUssUUFBUTtRQUMxQixPQUFPLENBQUMsbUJBQUEsTUFBTSxFQUFPLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxXQUFXLEVBQ3BEO1FBQ0EsT0FBTyxDQUFDLG1CQUFBLE1BQU0sRUFBTyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDdEM7U0FBTTtRQUNMLE9BQU8sSUFBSSxDQUFDO0tBQ2I7QUFDSCxDQUFDOzs7OztBQUVELE1BQU0sVUFBVSxxQkFBcUIsQ0FDbkMsUUFBdUI7SUFFdkIsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDO0FBQ3hCLENBQUM7QUFHRCxNQUFNLE9BQU8sbUJBQW1COzs7OztJQUM5QixNQUFNLENBQUMsVUFBVSxDQUNmLFVBQWdDLEVBQUU7UUFFbEMsT0FBTztZQUNMLFFBQVEsRUFBRSxtQkFBbUI7WUFDN0IsU0FBUyxFQUFFO2dCQUNULGlCQUFpQjtnQkFDakIsa0JBQWtCO2dCQUNsQixhQUFhO2dCQUNiO29CQUNFLE9BQU8sRUFBRSxlQUFlO29CQUN4QixRQUFRLEVBQUUsT0FBTztpQkFDbEI7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLCtCQUErQjtvQkFDeEMsSUFBSSxFQUFFLENBQUMsd0JBQXdCLEVBQUUscUJBQXFCLENBQUM7b0JBQ3ZELFVBQVUsRUFBRSxpQ0FBaUM7aUJBQzlDO2dCQUNEO29CQUNFLE9BQU8sRUFBRSx3QkFBd0I7b0JBQ2pDLFVBQVUsRUFBRSw0QkFBNEI7aUJBQ3pDO2dCQUNEO29CQUNFLE9BQU8sRUFBRSxxQkFBcUI7b0JBQzlCLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBQztvQkFDdkIsVUFBVSxFQUFFLFlBQVk7aUJBQ3pCO2dCQUNEO29CQUNFLE9BQU8sRUFBRSxlQUFlO29CQUN4QixJQUFJLEVBQUUsQ0FBQyxhQUFhLENBQUM7b0JBQ3JCLFVBQVUsRUFBRSxxQkFBcUI7aUJBQ2xDO2dCQUNEO29CQUNFLE9BQU8sRUFBRSx3QkFBd0I7b0JBQ2pDLFdBQVcsRUFBRSxrQkFBa0I7aUJBQ2hDO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQzs7O1lBeENGLFFBQVEsU0FBQyxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0aW9uVG9rZW4sIE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSZWR1Y2VyTWFuYWdlckRpc3BhdGNoZXIsIFN0YXRlT2JzZXJ2YWJsZSB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHtcbiAgSU5JVElBTF9PUFRJT05TLFxuICBTVE9SRV9ERVZUT09MU19DT05GSUcsXG4gIFN0b3JlRGV2dG9vbHNDb25maWcsXG4gIFN0b3JlRGV2dG9vbHNPcHRpb25zLFxuICBub01vbml0b3IsXG4gIGNyZWF0ZUNvbmZpZyxcbn0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgU3RvcmVEZXZ0b29scyB9IGZyb20gJy4vZGV2dG9vbHMnO1xuaW1wb3J0IHtcbiAgRGV2dG9vbHNFeHRlbnNpb24sXG4gIFJFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTixcbiAgUmVkdXhEZXZ0b29sc0V4dGVuc2lvbixcbn0gZnJvbSAnLi9leHRlbnNpb24nO1xuaW1wb3J0IHsgRGV2dG9vbHNEaXNwYXRjaGVyIH0gZnJvbSAnLi9kZXZ0b29scy1kaXNwYXRjaGVyJztcblxuZXhwb3J0IGNvbnN0IElTX0VYVEVOU0lPTl9PUl9NT05JVE9SX1BSRVNFTlQgPSBuZXcgSW5qZWN0aW9uVG9rZW48Ym9vbGVhbj4oXG4gICdJcyBEZXZ0b29scyBFeHRlbnNpb24gb3IgTW9uaXRvciBQcmVzZW50J1xuKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUlzRXh0ZW5zaW9uT3JNb25pdG9yUHJlc2VudChcbiAgZXh0ZW5zaW9uOiBSZWR1eERldnRvb2xzRXh0ZW5zaW9uIHwgbnVsbCxcbiAgY29uZmlnOiBTdG9yZURldnRvb2xzQ29uZmlnXG4pIHtcbiAgcmV0dXJuIEJvb2xlYW4oZXh0ZW5zaW9uKSB8fCBjb25maWcubW9uaXRvciAhPT0gbm9Nb25pdG9yO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUmVkdXhEZXZ0b29sc0V4dGVuc2lvbigpIHtcbiAgY29uc3QgZXh0ZW5zaW9uS2V5ID0gJ19fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18nO1xuXG4gIGlmIChcbiAgICB0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JyAmJlxuICAgIHR5cGVvZiAod2luZG93IGFzIGFueSlbZXh0ZW5zaW9uS2V5XSAhPT0gJ3VuZGVmaW5lZCdcbiAgKSB7XG4gICAgcmV0dXJuICh3aW5kb3cgYXMgYW55KVtleHRlbnNpb25LZXldO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTdGF0ZU9ic2VydmFibGUoXG4gIGRldnRvb2xzOiBTdG9yZURldnRvb2xzXG4pOiBPYnNlcnZhYmxlPGFueT4ge1xuICByZXR1cm4gZGV2dG9vbHMuc3RhdGU7XG59XG5cbkBOZ01vZHVsZSh7fSlcbmV4cG9ydCBjbGFzcyBTdG9yZURldnRvb2xzTW9kdWxlIHtcbiAgc3RhdGljIGluc3RydW1lbnQoXG4gICAgb3B0aW9uczogU3RvcmVEZXZ0b29sc09wdGlvbnMgPSB7fVxuICApOiBNb2R1bGVXaXRoUHJvdmlkZXJzPFN0b3JlRGV2dG9vbHNNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFN0b3JlRGV2dG9vbHNNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgRGV2dG9vbHNFeHRlbnNpb24sXG4gICAgICAgIERldnRvb2xzRGlzcGF0Y2hlcixcbiAgICAgICAgU3RvcmVEZXZ0b29scyxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IElOSVRJQUxfT1BUSU9OUyxcbiAgICAgICAgICB1c2VWYWx1ZTogb3B0aW9ucyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IElTX0VYVEVOU0lPTl9PUl9NT05JVE9SX1BSRVNFTlQsXG4gICAgICAgICAgZGVwczogW1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTiwgU1RPUkVfREVWVE9PTFNfQ09ORklHXSxcbiAgICAgICAgICB1c2VGYWN0b3J5OiBjcmVhdGVJc0V4dGVuc2lvbk9yTW9uaXRvclByZXNlbnQsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBSRURVWF9ERVZUT09MU19FWFRFTlNJT04sXG4gICAgICAgICAgdXNlRmFjdG9yeTogY3JlYXRlUmVkdXhEZXZ0b29sc0V4dGVuc2lvbixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IFNUT1JFX0RFVlRPT0xTX0NPTkZJRyxcbiAgICAgICAgICBkZXBzOiBbSU5JVElBTF9PUFRJT05TXSxcbiAgICAgICAgICB1c2VGYWN0b3J5OiBjcmVhdGVDb25maWcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBTdGF0ZU9ic2VydmFibGUsXG4gICAgICAgICAgZGVwczogW1N0b3JlRGV2dG9vbHNdLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IGNyZWF0ZVN0YXRlT2JzZXJ2YWJsZSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IFJlZHVjZXJNYW5hZ2VyRGlzcGF0Y2hlcixcbiAgICAgICAgICB1c2VFeGlzdGluZzogRGV2dG9vbHNEaXNwYXRjaGVyLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuICB9XG59XG4iXX0=