import { NgZone } from '@angular/core';
export type ZoneConfig = {
    connectOutsideZone: true;
    ngZone: NgZone;
} | {
    connectOutsideZone: false;
    ngZone: null;
};
export declare function injectZoneConfig(connectOutsideZone: boolean): ZoneConfig;
