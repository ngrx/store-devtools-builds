var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { InjectionToken, NgModule } from '@angular/core';
import { ReducerManagerDispatcher, StateObservable } from '@ngrx/store';
import { INITIAL_OPTIONS, STORE_DEVTOOLS_CONFIG, noMonitor, createConfig, } from './config';
import { StoreDevtools } from './devtools';
import { DevtoolsExtension, REDUX_DEVTOOLS_EXTENSION, } from './extension';
import { DevtoolsDispatcher } from './devtools-dispatcher';
export var IS_EXTENSION_OR_MONITOR_PRESENT = new InjectionToken('Is Devtools Extension or Monitor Present');
export function createIsExtensionOrMonitorPresent(extension, config) {
    return Boolean(extension) || config.monitor !== noMonitor;
}
export function createReduxDevtoolsExtension() {
    var extensionKey = '__REDUX_DEVTOOLS_EXTENSION__';
    if (typeof window === 'object' &&
        typeof window[extensionKey] !== 'undefined') {
        return window[extensionKey];
    }
    else {
        return null;
    }
}
export function createStateObservable(devtools) {
    return devtools.state;
}
var StoreDevtoolsModule = /** @class */ (function () {
    function StoreDevtoolsModule() {
    }
    StoreDevtoolsModule_1 = StoreDevtoolsModule;
    StoreDevtoolsModule.instrument = function (options) {
        if (options === void 0) { options = {}; }
        return {
            ngModule: StoreDevtoolsModule_1,
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
    };
    var StoreDevtoolsModule_1;
    StoreDevtoolsModule = StoreDevtoolsModule_1 = __decorate([
        NgModule({})
    ], StoreDevtoolsModule);
    return StoreDevtoolsModule;
}());
export { StoreDevtoolsModule };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdHJ1bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvc3RvcmUtZGV2dG9vbHMvc3JjL2luc3RydW1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUFFLGNBQWMsRUFBdUIsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxlQUFlLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFHeEUsT0FBTyxFQUNMLGVBQWUsRUFDZixxQkFBcUIsRUFHckIsU0FBUyxFQUNULFlBQVksR0FDYixNQUFNLFVBQVUsQ0FBQztBQUNsQixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQzNDLE9BQU8sRUFDTCxpQkFBaUIsRUFDakIsd0JBQXdCLEdBRXpCLE1BQU0sYUFBYSxDQUFDO0FBQ3JCLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRTNELE1BQU0sQ0FBQyxJQUFNLCtCQUErQixHQUFHLElBQUksY0FBYyxDQUMvRCwwQ0FBMEMsQ0FDM0MsQ0FBQztBQUVGLE1BQU0sVUFBVSxpQ0FBaUMsQ0FDL0MsU0FBd0MsRUFDeEMsTUFBMkI7SUFFM0IsT0FBTyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUM7QUFDNUQsQ0FBQztBQUVELE1BQU0sVUFBVSw0QkFBNEI7SUFDMUMsSUFBTSxZQUFZLEdBQUcsOEJBQThCLENBQUM7SUFFcEQsSUFDRSxPQUFPLE1BQU0sS0FBSyxRQUFRO1FBQzFCLE9BQVEsTUFBYyxDQUFDLFlBQVksQ0FBQyxLQUFLLFdBQVcsRUFDcEQ7UUFDQSxPQUFRLE1BQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUN0QztTQUFNO1FBQ0wsT0FBTyxJQUFJLENBQUM7S0FDYjtBQUNILENBQUM7QUFFRCxNQUFNLFVBQVUscUJBQXFCLENBQ25DLFFBQXVCO0lBRXZCLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQztBQUN4QixDQUFDO0FBR0Q7SUFBQTtJQXdDQSxDQUFDOzRCQXhDWSxtQkFBbUI7SUFDdkIsOEJBQVUsR0FBakIsVUFDRSxPQUFrQztRQUFsQyx3QkFBQSxFQUFBLFlBQWtDO1FBRWxDLE9BQU87WUFDTCxRQUFRLEVBQUUscUJBQW1CO1lBQzdCLFNBQVMsRUFBRTtnQkFDVCxpQkFBaUI7Z0JBQ2pCLGtCQUFrQjtnQkFDbEIsYUFBYTtnQkFDYjtvQkFDRSxPQUFPLEVBQUUsZUFBZTtvQkFDeEIsUUFBUSxFQUFFLE9BQU87aUJBQ2xCO2dCQUNEO29CQUNFLE9BQU8sRUFBRSwrQkFBK0I7b0JBQ3hDLElBQUksRUFBRSxDQUFDLHdCQUF3QixFQUFFLHFCQUFxQixDQUFDO29CQUN2RCxVQUFVLEVBQUUsaUNBQWlDO2lCQUM5QztnQkFDRDtvQkFDRSxPQUFPLEVBQUUsd0JBQXdCO29CQUNqQyxVQUFVLEVBQUUsNEJBQTRCO2lCQUN6QztnQkFDRDtvQkFDRSxPQUFPLEVBQUUscUJBQXFCO29CQUM5QixJQUFJLEVBQUUsQ0FBQyxlQUFlLENBQUM7b0JBQ3ZCLFVBQVUsRUFBRSxZQUFZO2lCQUN6QjtnQkFDRDtvQkFDRSxPQUFPLEVBQUUsZUFBZTtvQkFDeEIsSUFBSSxFQUFFLENBQUMsYUFBYSxDQUFDO29CQUNyQixVQUFVLEVBQUUscUJBQXFCO2lCQUNsQztnQkFDRDtvQkFDRSxPQUFPLEVBQUUsd0JBQXdCO29CQUNqQyxXQUFXLEVBQUUsa0JBQWtCO2lCQUNoQzthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7O0lBdkNVLG1CQUFtQjtRQUQvQixRQUFRLENBQUMsRUFBRSxDQUFDO09BQ0EsbUJBQW1CLENBd0MvQjtJQUFELDBCQUFDO0NBQUEsQUF4Q0QsSUF3Q0M7U0F4Q1ksbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0aW9uVG9rZW4sIE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSZWR1Y2VyTWFuYWdlckRpc3BhdGNoZXIsIFN0YXRlT2JzZXJ2YWJsZSB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHtcbiAgSU5JVElBTF9PUFRJT05TLFxuICBTVE9SRV9ERVZUT09MU19DT05GSUcsXG4gIFN0b3JlRGV2dG9vbHNDb25maWcsXG4gIFN0b3JlRGV2dG9vbHNPcHRpb25zLFxuICBub01vbml0b3IsXG4gIGNyZWF0ZUNvbmZpZyxcbn0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgU3RvcmVEZXZ0b29scyB9IGZyb20gJy4vZGV2dG9vbHMnO1xuaW1wb3J0IHtcbiAgRGV2dG9vbHNFeHRlbnNpb24sXG4gIFJFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTixcbiAgUmVkdXhEZXZ0b29sc0V4dGVuc2lvbixcbn0gZnJvbSAnLi9leHRlbnNpb24nO1xuaW1wb3J0IHsgRGV2dG9vbHNEaXNwYXRjaGVyIH0gZnJvbSAnLi9kZXZ0b29scy1kaXNwYXRjaGVyJztcblxuZXhwb3J0IGNvbnN0IElTX0VYVEVOU0lPTl9PUl9NT05JVE9SX1BSRVNFTlQgPSBuZXcgSW5qZWN0aW9uVG9rZW48Ym9vbGVhbj4oXG4gICdJcyBEZXZ0b29scyBFeHRlbnNpb24gb3IgTW9uaXRvciBQcmVzZW50J1xuKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUlzRXh0ZW5zaW9uT3JNb25pdG9yUHJlc2VudChcbiAgZXh0ZW5zaW9uOiBSZWR1eERldnRvb2xzRXh0ZW5zaW9uIHwgbnVsbCxcbiAgY29uZmlnOiBTdG9yZURldnRvb2xzQ29uZmlnXG4pIHtcbiAgcmV0dXJuIEJvb2xlYW4oZXh0ZW5zaW9uKSB8fCBjb25maWcubW9uaXRvciAhPT0gbm9Nb25pdG9yO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUmVkdXhEZXZ0b29sc0V4dGVuc2lvbigpIHtcbiAgY29uc3QgZXh0ZW5zaW9uS2V5ID0gJ19fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18nO1xuXG4gIGlmIChcbiAgICB0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JyAmJlxuICAgIHR5cGVvZiAod2luZG93IGFzIGFueSlbZXh0ZW5zaW9uS2V5XSAhPT0gJ3VuZGVmaW5lZCdcbiAgKSB7XG4gICAgcmV0dXJuICh3aW5kb3cgYXMgYW55KVtleHRlbnNpb25LZXldO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTdGF0ZU9ic2VydmFibGUoXG4gIGRldnRvb2xzOiBTdG9yZURldnRvb2xzXG4pOiBPYnNlcnZhYmxlPGFueT4ge1xuICByZXR1cm4gZGV2dG9vbHMuc3RhdGU7XG59XG5cbkBOZ01vZHVsZSh7fSlcbmV4cG9ydCBjbGFzcyBTdG9yZURldnRvb2xzTW9kdWxlIHtcbiAgc3RhdGljIGluc3RydW1lbnQoXG4gICAgb3B0aW9uczogU3RvcmVEZXZ0b29sc09wdGlvbnMgPSB7fVxuICApOiBNb2R1bGVXaXRoUHJvdmlkZXJzPFN0b3JlRGV2dG9vbHNNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFN0b3JlRGV2dG9vbHNNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgRGV2dG9vbHNFeHRlbnNpb24sXG4gICAgICAgIERldnRvb2xzRGlzcGF0Y2hlcixcbiAgICAgICAgU3RvcmVEZXZ0b29scyxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IElOSVRJQUxfT1BUSU9OUyxcbiAgICAgICAgICB1c2VWYWx1ZTogb3B0aW9ucyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IElTX0VYVEVOU0lPTl9PUl9NT05JVE9SX1BSRVNFTlQsXG4gICAgICAgICAgZGVwczogW1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTiwgU1RPUkVfREVWVE9PTFNfQ09ORklHXSxcbiAgICAgICAgICB1c2VGYWN0b3J5OiBjcmVhdGVJc0V4dGVuc2lvbk9yTW9uaXRvclByZXNlbnQsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBSRURVWF9ERVZUT09MU19FWFRFTlNJT04sXG4gICAgICAgICAgdXNlRmFjdG9yeTogY3JlYXRlUmVkdXhEZXZ0b29sc0V4dGVuc2lvbixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IFNUT1JFX0RFVlRPT0xTX0NPTkZJRyxcbiAgICAgICAgICBkZXBzOiBbSU5JVElBTF9PUFRJT05TXSxcbiAgICAgICAgICB1c2VGYWN0b3J5OiBjcmVhdGVDb25maWcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBTdGF0ZU9ic2VydmFibGUsXG4gICAgICAgICAgZGVwczogW1N0b3JlRGV2dG9vbHNdLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IGNyZWF0ZVN0YXRlT2JzZXJ2YWJsZSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IFJlZHVjZXJNYW5hZ2VyRGlzcGF0Y2hlcixcbiAgICAgICAgICB1c2VFeGlzdGluZzogRGV2dG9vbHNEaXNwYXRjaGVyLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuICB9XG59XG4iXX0=