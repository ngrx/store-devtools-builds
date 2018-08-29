/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
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
        typeof (/** @type {?} */ (window))[extensionKey] !== 'undefined') {
        return (/** @type {?} */ (window))[extensionKey];
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdHJ1bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvc3RvcmUtZGV2dG9vbHMvc3JjL2luc3RydW1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxjQUFjLEVBQXVCLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5RSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsZUFBZSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBR3hFLE9BQU8sRUFDTCxlQUFlLEVBQ2YscUJBQXFCLEVBR3JCLFNBQVMsRUFDVCxZQUFZLEdBQ2IsTUFBTSxVQUFVLENBQUM7QUFDbEIsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUMzQyxPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLHdCQUF3QixHQUV6QixNQUFNLGFBQWEsQ0FBQztBQUNyQixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQzs7QUFFM0QsYUFBYSwrQkFBK0IsR0FBRyxJQUFJLGNBQWMsQ0FDL0QsMENBQTBDLENBQzNDLENBQUM7Ozs7OztBQUVGLE1BQU0sNENBQ0osU0FBd0MsRUFDeEMsTUFBMkI7SUFFM0IsT0FBTyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUM7Q0FDM0Q7Ozs7QUFFRCxNQUFNOztJQUNKLE1BQU0sWUFBWSxHQUFHLDhCQUE4QixDQUFDO0lBRXBELElBQ0UsT0FBTyxNQUFNLEtBQUssUUFBUTtRQUMxQixPQUFPLG1CQUFDLE1BQWEsRUFBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLFdBQVcsRUFDcEQ7UUFDQSxPQUFPLG1CQUFDLE1BQWEsRUFBQyxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQ3RDO1NBQU07UUFDTCxPQUFPLElBQUksQ0FBQztLQUNiO0NBQ0Y7Ozs7O0FBRUQsTUFBTSxnQ0FDSixRQUF1QjtJQUV2QixPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUM7Q0FDdkI7QUFHRCxNQUFNOzs7OztJQUNKLE1BQU0sQ0FBQyxVQUFVLENBQUMsVUFBZ0MsRUFBRTtRQUNsRCxPQUFPO1lBQ0wsUUFBUSxFQUFFLG1CQUFtQjtZQUM3QixTQUFTLEVBQUU7Z0JBQ1QsaUJBQWlCO2dCQUNqQixrQkFBa0I7Z0JBQ2xCLGFBQWE7Z0JBQ2I7b0JBQ0UsT0FBTyxFQUFFLGVBQWU7b0JBQ3hCLFFBQVEsRUFBRSxPQUFPO2lCQUNsQjtnQkFDRDtvQkFDRSxPQUFPLEVBQUUsK0JBQStCO29CQUN4QyxJQUFJLEVBQUUsQ0FBQyx3QkFBd0IsRUFBRSxxQkFBcUIsQ0FBQztvQkFDdkQsVUFBVSxFQUFFLGlDQUFpQztpQkFDOUM7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLHdCQUF3QjtvQkFDakMsVUFBVSxFQUFFLDRCQUE0QjtpQkFDekM7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLHFCQUFxQjtvQkFDOUIsSUFBSSxFQUFFLENBQUMsZUFBZSxDQUFDO29CQUN2QixVQUFVLEVBQUUsWUFBWTtpQkFDekI7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLGVBQWU7b0JBQ3hCLElBQUksRUFBRSxDQUFDLGFBQWEsQ0FBQztvQkFDckIsVUFBVSxFQUFFLHFCQUFxQjtpQkFDbEM7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLHdCQUF3QjtvQkFDakMsV0FBVyxFQUFFLGtCQUFrQjtpQkFDaEM7YUFDRjtTQUNGLENBQUM7S0FDSDs7O1lBdENGLFFBQVEsU0FBQyxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0aW9uVG9rZW4sIE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSZWR1Y2VyTWFuYWdlckRpc3BhdGNoZXIsIFN0YXRlT2JzZXJ2YWJsZSB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHtcbiAgSU5JVElBTF9PUFRJT05TLFxuICBTVE9SRV9ERVZUT09MU19DT05GSUcsXG4gIFN0b3JlRGV2dG9vbHNDb25maWcsXG4gIFN0b3JlRGV2dG9vbHNPcHRpb25zLFxuICBub01vbml0b3IsXG4gIGNyZWF0ZUNvbmZpZyxcbn0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgU3RvcmVEZXZ0b29scyB9IGZyb20gJy4vZGV2dG9vbHMnO1xuaW1wb3J0IHtcbiAgRGV2dG9vbHNFeHRlbnNpb24sXG4gIFJFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTixcbiAgUmVkdXhEZXZ0b29sc0V4dGVuc2lvbixcbn0gZnJvbSAnLi9leHRlbnNpb24nO1xuaW1wb3J0IHsgRGV2dG9vbHNEaXNwYXRjaGVyIH0gZnJvbSAnLi9kZXZ0b29scy1kaXNwYXRjaGVyJztcblxuZXhwb3J0IGNvbnN0IElTX0VYVEVOU0lPTl9PUl9NT05JVE9SX1BSRVNFTlQgPSBuZXcgSW5qZWN0aW9uVG9rZW48Ym9vbGVhbj4oXG4gICdJcyBEZXZ0b29scyBFeHRlbnNpb24gb3IgTW9uaXRvciBQcmVzZW50J1xuKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUlzRXh0ZW5zaW9uT3JNb25pdG9yUHJlc2VudChcbiAgZXh0ZW5zaW9uOiBSZWR1eERldnRvb2xzRXh0ZW5zaW9uIHwgbnVsbCxcbiAgY29uZmlnOiBTdG9yZURldnRvb2xzQ29uZmlnXG4pIHtcbiAgcmV0dXJuIEJvb2xlYW4oZXh0ZW5zaW9uKSB8fCBjb25maWcubW9uaXRvciAhPT0gbm9Nb25pdG9yO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUmVkdXhEZXZ0b29sc0V4dGVuc2lvbigpIHtcbiAgY29uc3QgZXh0ZW5zaW9uS2V5ID0gJ19fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18nO1xuXG4gIGlmIChcbiAgICB0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JyAmJlxuICAgIHR5cGVvZiAod2luZG93IGFzIGFueSlbZXh0ZW5zaW9uS2V5XSAhPT0gJ3VuZGVmaW5lZCdcbiAgKSB7XG4gICAgcmV0dXJuICh3aW5kb3cgYXMgYW55KVtleHRlbnNpb25LZXldO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTdGF0ZU9ic2VydmFibGUoXG4gIGRldnRvb2xzOiBTdG9yZURldnRvb2xzXG4pOiBPYnNlcnZhYmxlPGFueT4ge1xuICByZXR1cm4gZGV2dG9vbHMuc3RhdGU7XG59XG5cbkBOZ01vZHVsZSh7fSlcbmV4cG9ydCBjbGFzcyBTdG9yZURldnRvb2xzTW9kdWxlIHtcbiAgc3RhdGljIGluc3RydW1lbnQob3B0aW9uczogU3RvcmVEZXZ0b29sc09wdGlvbnMgPSB7fSk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogU3RvcmVEZXZ0b29sc01vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICBEZXZ0b29sc0V4dGVuc2lvbixcbiAgICAgICAgRGV2dG9vbHNEaXNwYXRjaGVyLFxuICAgICAgICBTdG9yZURldnRvb2xzLFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogSU5JVElBTF9PUFRJT05TLFxuICAgICAgICAgIHVzZVZhbHVlOiBvcHRpb25zLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogSVNfRVhURU5TSU9OX09SX01PTklUT1JfUFJFU0VOVCxcbiAgICAgICAgICBkZXBzOiBbUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OLCBTVE9SRV9ERVZUT09MU19DT05GSUddLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IGNyZWF0ZUlzRXh0ZW5zaW9uT3JNb25pdG9yUHJlc2VudCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IFJFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTixcbiAgICAgICAgICB1c2VGYWN0b3J5OiBjcmVhdGVSZWR1eERldnRvb2xzRXh0ZW5zaW9uLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogU1RPUkVfREVWVE9PTFNfQ09ORklHLFxuICAgICAgICAgIGRlcHM6IFtJTklUSUFMX09QVElPTlNdLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IGNyZWF0ZUNvbmZpZyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IFN0YXRlT2JzZXJ2YWJsZSxcbiAgICAgICAgICBkZXBzOiBbU3RvcmVEZXZ0b29sc10sXG4gICAgICAgICAgdXNlRmFjdG9yeTogY3JlYXRlU3RhdGVPYnNlcnZhYmxlLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogUmVkdWNlck1hbmFnZXJEaXNwYXRjaGVyLFxuICAgICAgICAgIHVzZUV4aXN0aW5nOiBEZXZ0b29sc0Rpc3BhdGNoZXIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==