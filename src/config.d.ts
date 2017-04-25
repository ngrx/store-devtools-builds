import { ActionReducer } from '@ngrx/store';
import { InjectionToken, Type } from '@angular/core';
export interface StoreDevtoolsConfig {
    maxAge: number | false;
    monitor: ActionReducer<any, any>;
    shouldInstrument: Type<boolean> | InjectionToken<boolean>;
}
export declare const STORE_DEVTOOLS_CONFIG: InjectionToken<{}>;
export declare const INITIAL_OPTIONS: InjectionToken<{}>;
export declare const SHOULD_INSTRUMENT: InjectionToken<boolean>;
export declare type StoreDevtoolsOptions = Partial<StoreDevtoolsConfig> | (() => Partial<StoreDevtoolsConfig>);
