import { InjectionToken, Injector, ModuleWithProviders } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DevtoolsDispatcher } from './devtools';
import { StoreDevtoolsConfig, StoreDevtoolsOptions } from './config';
import { ReduxDevtoolsExtension } from './extension';
export declare const IS_EXTENSION_OR_MONITOR_PRESENT: InjectionToken<boolean>;
export declare function createIsExtensionOrMonitorPresent(extension: ReduxDevtoolsExtension | null, config: StoreDevtoolsConfig): boolean;
export declare function createReduxDevtoolsExtension(): any;
export declare function createStateObservable(shouldInstrument: boolean, injector: Injector): Observable<any>;
export declare function createReducerManagerDispatcher(shouldInstrument: boolean, injector: Injector): DevtoolsDispatcher;
export declare function noMonitor(): null;
export declare function createConfig(_options: StoreDevtoolsOptions): StoreDevtoolsConfig;
export declare function createShouldInstrument(injector: Injector, config: StoreDevtoolsConfig): boolean;
export declare class StoreDevtoolsModule {
    static instrument(options?: StoreDevtoolsOptions): ModuleWithProviders;
}
