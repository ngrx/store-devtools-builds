import { NgModule } from '@angular/core';
import { provideStoreDevtools } from './provide-store-devtools';
import * as i0 from "@angular/core";
export function createStateObservable(devtools) {
    return devtools.state;
}
class StoreDevtoolsModule {
    static instrument(options = {}) {
        return {
            ngModule: StoreDevtoolsModule,
            providers: [provideStoreDevtools(options)],
        };
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: StoreDevtoolsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: StoreDevtoolsModule }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: StoreDevtoolsModule }); }
}
export { StoreDevtoolsModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: StoreDevtoolsModule, decorators: [{
            type: NgModule,
            args: [{}]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdHJ1bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21vZHVsZXMvc3RvcmUtZGV2dG9vbHMvc3JjL2luc3RydW1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUF1QixRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFJOUQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7O0FBRWhFLE1BQU0sVUFBVSxxQkFBcUIsQ0FDbkMsUUFBdUI7SUFFdkIsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDO0FBQ3hCLENBQUM7QUFFRCxNQUNhLG1CQUFtQjtJQUM5QixNQUFNLENBQUMsVUFBVSxDQUNmLFVBQWdDLEVBQUU7UUFFbEMsT0FBTztZQUNMLFFBQVEsRUFBRSxtQkFBbUI7WUFDN0IsU0FBUyxFQUFFLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDM0MsQ0FBQztJQUNKLENBQUM7aUlBUlUsbUJBQW1CO2tJQUFuQixtQkFBbUI7a0lBQW5CLG1CQUFtQjs7U0FBbkIsbUJBQW1COzJGQUFuQixtQkFBbUI7a0JBRC9CLFFBQVE7bUJBQUMsRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdGF0ZU9ic2VydmFibGUgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBTdG9yZURldnRvb2xzT3B0aW9ucyB9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7IFN0b3JlRGV2dG9vbHMgfSBmcm9tICcuL2RldnRvb2xzJztcbmltcG9ydCB7IHByb3ZpZGVTdG9yZURldnRvb2xzIH0gZnJvbSAnLi9wcm92aWRlLXN0b3JlLWRldnRvb2xzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVN0YXRlT2JzZXJ2YWJsZShcbiAgZGV2dG9vbHM6IFN0b3JlRGV2dG9vbHNcbik6IFN0YXRlT2JzZXJ2YWJsZSB7XG4gIHJldHVybiBkZXZ0b29scy5zdGF0ZTtcbn1cblxuQE5nTW9kdWxlKHt9KVxuZXhwb3J0IGNsYXNzIFN0b3JlRGV2dG9vbHNNb2R1bGUge1xuICBzdGF0aWMgaW5zdHJ1bWVudChcbiAgICBvcHRpb25zOiBTdG9yZURldnRvb2xzT3B0aW9ucyA9IHt9XG4gICk6IE1vZHVsZVdpdGhQcm92aWRlcnM8U3RvcmVEZXZ0b29sc01vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogU3RvcmVEZXZ0b29sc01vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW3Byb3ZpZGVTdG9yZURldnRvb2xzKG9wdGlvbnMpXSxcbiAgICB9O1xuICB9XG59XG4iXX0=