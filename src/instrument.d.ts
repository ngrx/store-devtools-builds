import { InjectionToken, ModuleWithProviders } from '@angular/core';
import { Observable } from 'rxjs';
import { StoreDevtoolsConfig, StoreDevtoolsOptions } from './config';
import { StoreDevtools } from './devtools';
import { ReduxDevtoolsExtension } from './extension';
export declare const IS_EXTENSION_OR_MONITOR_PRESENT: InjectionToken<boolean>;
export declare function createIsExtensionOrMonitorPresent(extension: ReduxDevtoolsExtension | null, config: StoreDevtoolsConfig): boolean;
export declare function createReduxDevtoolsExtension(): any;
export declare function createStateObservable(devtools: StoreDevtools): Observable<any>;
export declare class StoreDevtoolsModule {
    static instrument(options?: StoreDevtoolsOptions): ModuleWithProviders<StoreDevtoolsModule>;
}
