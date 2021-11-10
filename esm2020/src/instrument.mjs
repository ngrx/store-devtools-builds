import { InjectionToken, NgModule } from '@angular/core';
import { ReducerManagerDispatcher, StateObservable } from '@ngrx/store';
import { INITIAL_OPTIONS, STORE_DEVTOOLS_CONFIG, noMonitor, createConfig, } from './config';
import { StoreDevtools } from './devtools';
import { DevtoolsExtension, REDUX_DEVTOOLS_EXTENSION, } from './extension';
import { DevtoolsDispatcher } from './devtools-dispatcher';
import * as i0 from "@angular/core";
export const IS_EXTENSION_OR_MONITOR_PRESENT = new InjectionToken('@ngrx/store-devtools Is Devtools Extension or Monitor Present');
export function createIsExtensionOrMonitorPresent(extension, config) {
    return Boolean(extension) || config.monitor !== noMonitor;
}
export function createReduxDevtoolsExtension() {
    const extensionKey = '__REDUX_DEVTOOLS_EXTENSION__';
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
export class StoreDevtoolsModule {
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
/** @nocollapse */ /** @nocollapse */ StoreDevtoolsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: StoreDevtoolsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ /** @nocollapse */ StoreDevtoolsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: StoreDevtoolsModule });
/** @nocollapse */ /** @nocollapse */ StoreDevtoolsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: StoreDevtoolsModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: StoreDevtoolsModule, decorators: [{
            type: NgModule,
            args: [{}]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdHJ1bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21vZHVsZXMvc3RvcmUtZGV2dG9vbHMvc3JjL2luc3RydW1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGNBQWMsRUFBdUIsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxlQUFlLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFHeEUsT0FBTyxFQUNMLGVBQWUsRUFDZixxQkFBcUIsRUFHckIsU0FBUyxFQUNULFlBQVksR0FDYixNQUFNLFVBQVUsQ0FBQztBQUNsQixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQzNDLE9BQU8sRUFDTCxpQkFBaUIsRUFDakIsd0JBQXdCLEdBRXpCLE1BQU0sYUFBYSxDQUFDO0FBQ3JCLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDOztBQUUzRCxNQUFNLENBQUMsTUFBTSwrQkFBK0IsR0FBRyxJQUFJLGNBQWMsQ0FDL0QsK0RBQStELENBQ2hFLENBQUM7QUFFRixNQUFNLFVBQVUsaUNBQWlDLENBQy9DLFNBQXdDLEVBQ3hDLE1BQTJCO0lBRTNCLE9BQU8sT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDO0FBQzVELENBQUM7QUFFRCxNQUFNLFVBQVUsNEJBQTRCO0lBQzFDLE1BQU0sWUFBWSxHQUFHLDhCQUE4QixDQUFDO0lBRXBELElBQ0UsT0FBTyxNQUFNLEtBQUssUUFBUTtRQUMxQixPQUFRLE1BQWMsQ0FBQyxZQUFZLENBQUMsS0FBSyxXQUFXLEVBQ3BEO1FBQ0EsT0FBUSxNQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDdEM7U0FBTTtRQUNMLE9BQU8sSUFBSSxDQUFDO0tBQ2I7QUFDSCxDQUFDO0FBRUQsTUFBTSxVQUFVLHFCQUFxQixDQUNuQyxRQUF1QjtJQUV2QixPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUM7QUFDeEIsQ0FBQztBQUdELE1BQU0sT0FBTyxtQkFBbUI7SUFDOUIsTUFBTSxDQUFDLFVBQVUsQ0FDZixVQUFnQyxFQUFFO1FBRWxDLE9BQU87WUFDTCxRQUFRLEVBQUUsbUJBQW1CO1lBQzdCLFNBQVMsRUFBRTtnQkFDVCxpQkFBaUI7Z0JBQ2pCLGtCQUFrQjtnQkFDbEIsYUFBYTtnQkFDYjtvQkFDRSxPQUFPLEVBQUUsZUFBZTtvQkFDeEIsUUFBUSxFQUFFLE9BQU87aUJBQ2xCO2dCQUNEO29CQUNFLE9BQU8sRUFBRSwrQkFBK0I7b0JBQ3hDLElBQUksRUFBRSxDQUFDLHdCQUF3QixFQUFFLHFCQUFxQixDQUFDO29CQUN2RCxVQUFVLEVBQUUsaUNBQWlDO2lCQUM5QztnQkFDRDtvQkFDRSxPQUFPLEVBQUUsd0JBQXdCO29CQUNqQyxVQUFVLEVBQUUsNEJBQTRCO2lCQUN6QztnQkFDRDtvQkFDRSxPQUFPLEVBQUUscUJBQXFCO29CQUM5QixJQUFJLEVBQUUsQ0FBQyxlQUFlLENBQUM7b0JBQ3ZCLFVBQVUsRUFBRSxZQUFZO2lCQUN6QjtnQkFDRDtvQkFDRSxPQUFPLEVBQUUsZUFBZTtvQkFDeEIsSUFBSSxFQUFFLENBQUMsYUFBYSxDQUFDO29CQUNyQixVQUFVLEVBQUUscUJBQXFCO2lCQUNsQztnQkFDRDtvQkFDRSxPQUFPLEVBQUUsd0JBQXdCO29CQUNqQyxXQUFXLEVBQUUsa0JBQWtCO2lCQUNoQzthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7O3NKQXZDVSxtQkFBbUI7dUpBQW5CLG1CQUFtQjt1SkFBbkIsbUJBQW1COzJGQUFuQixtQkFBbUI7a0JBRC9CLFFBQVE7bUJBQUMsRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGlvblRva2VuLCBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUmVkdWNlck1hbmFnZXJEaXNwYXRjaGVyLCBTdGF0ZU9ic2VydmFibGUgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7XG4gIElOSVRJQUxfT1BUSU9OUyxcbiAgU1RPUkVfREVWVE9PTFNfQ09ORklHLFxuICBTdG9yZURldnRvb2xzQ29uZmlnLFxuICBTdG9yZURldnRvb2xzT3B0aW9ucyxcbiAgbm9Nb25pdG9yLFxuICBjcmVhdGVDb25maWcsXG59IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7IFN0b3JlRGV2dG9vbHMgfSBmcm9tICcuL2RldnRvb2xzJztcbmltcG9ydCB7XG4gIERldnRvb2xzRXh0ZW5zaW9uLFxuICBSRURVWF9ERVZUT09MU19FWFRFTlNJT04sXG4gIFJlZHV4RGV2dG9vbHNFeHRlbnNpb24sXG59IGZyb20gJy4vZXh0ZW5zaW9uJztcbmltcG9ydCB7IERldnRvb2xzRGlzcGF0Y2hlciB9IGZyb20gJy4vZGV2dG9vbHMtZGlzcGF0Y2hlcic7XG5cbmV4cG9ydCBjb25zdCBJU19FWFRFTlNJT05fT1JfTU9OSVRPUl9QUkVTRU5UID0gbmV3IEluamVjdGlvblRva2VuPGJvb2xlYW4+KFxuICAnQG5ncngvc3RvcmUtZGV2dG9vbHMgSXMgRGV2dG9vbHMgRXh0ZW5zaW9uIG9yIE1vbml0b3IgUHJlc2VudCdcbik7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVJc0V4dGVuc2lvbk9yTW9uaXRvclByZXNlbnQoXG4gIGV4dGVuc2lvbjogUmVkdXhEZXZ0b29sc0V4dGVuc2lvbiB8IG51bGwsXG4gIGNvbmZpZzogU3RvcmVEZXZ0b29sc0NvbmZpZ1xuKSB7XG4gIHJldHVybiBCb29sZWFuKGV4dGVuc2lvbikgfHwgY29uZmlnLm1vbml0b3IgIT09IG5vTW9uaXRvcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVJlZHV4RGV2dG9vbHNFeHRlbnNpb24oKSB7XG4gIGNvbnN0IGV4dGVuc2lvbktleSA9ICdfX1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTl9fJztcblxuICBpZiAoXG4gICAgdHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcgJiZcbiAgICB0eXBlb2YgKHdpbmRvdyBhcyBhbnkpW2V4dGVuc2lvbktleV0gIT09ICd1bmRlZmluZWQnXG4gICkge1xuICAgIHJldHVybiAod2luZG93IGFzIGFueSlbZXh0ZW5zaW9uS2V5XTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3RhdGVPYnNlcnZhYmxlKFxuICBkZXZ0b29sczogU3RvcmVEZXZ0b29sc1xuKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgcmV0dXJuIGRldnRvb2xzLnN0YXRlO1xufVxuXG5ATmdNb2R1bGUoe30pXG5leHBvcnQgY2xhc3MgU3RvcmVEZXZ0b29sc01vZHVsZSB7XG4gIHN0YXRpYyBpbnN0cnVtZW50KFxuICAgIG9wdGlvbnM6IFN0b3JlRGV2dG9vbHNPcHRpb25zID0ge31cbiAgKTogTW9kdWxlV2l0aFByb3ZpZGVyczxTdG9yZURldnRvb2xzTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBTdG9yZURldnRvb2xzTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIERldnRvb2xzRXh0ZW5zaW9uLFxuICAgICAgICBEZXZ0b29sc0Rpc3BhdGNoZXIsXG4gICAgICAgIFN0b3JlRGV2dG9vbHMsXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBJTklUSUFMX09QVElPTlMsXG4gICAgICAgICAgdXNlVmFsdWU6IG9wdGlvbnMsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBJU19FWFRFTlNJT05fT1JfTU9OSVRPUl9QUkVTRU5ULFxuICAgICAgICAgIGRlcHM6IFtSRURVWF9ERVZUT09MU19FWFRFTlNJT04sIFNUT1JFX0RFVlRPT0xTX0NPTkZJR10sXG4gICAgICAgICAgdXNlRmFjdG9yeTogY3JlYXRlSXNFeHRlbnNpb25Pck1vbml0b3JQcmVzZW50LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IGNyZWF0ZVJlZHV4RGV2dG9vbHNFeHRlbnNpb24sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBTVE9SRV9ERVZUT09MU19DT05GSUcsXG4gICAgICAgICAgZGVwczogW0lOSVRJQUxfT1BUSU9OU10sXG4gICAgICAgICAgdXNlRmFjdG9yeTogY3JlYXRlQ29uZmlnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogU3RhdGVPYnNlcnZhYmxlLFxuICAgICAgICAgIGRlcHM6IFtTdG9yZURldnRvb2xzXSxcbiAgICAgICAgICB1c2VGYWN0b3J5OiBjcmVhdGVTdGF0ZU9ic2VydmFibGUsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBSZWR1Y2VyTWFuYWdlckRpc3BhdGNoZXIsXG4gICAgICAgICAgdXNlRXhpc3Rpbmc6IERldnRvb2xzRGlzcGF0Y2hlcixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfTtcbiAgfVxufVxuIl19