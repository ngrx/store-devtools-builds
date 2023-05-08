import { ModuleWithProviders } from '@angular/core';
import { Observable } from 'rxjs';
import { StoreDevtoolsOptions } from './config';
import { StoreDevtools } from './devtools';
import * as i0 from "@angular/core";
export declare function createStateObservable(devtools: StoreDevtools): Observable<any>;
export declare class StoreDevtoolsModule {
    static instrument(options?: StoreDevtoolsOptions): ModuleWithProviders<StoreDevtoolsModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<StoreDevtoolsModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<StoreDevtoolsModule, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<StoreDevtoolsModule>;
}
