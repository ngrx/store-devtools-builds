var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import { Injectable, Inject, ErrorHandler } from '@angular/core';
import { ActionsSubject, INITIAL_STATE, ReducerObservable, ScannedActionsSubject, } from '@ngrx/store';
import { merge, queueScheduler, ReplaySubject, } from 'rxjs';
import { map, observeOn, scan, skip, withLatestFrom } from 'rxjs/operators';
import * as Actions from './actions';
import { STORE_DEVTOOLS_CONFIG, StoreDevtoolsConfig } from './config';
import { DevtoolsExtension } from './extension';
import { liftInitialState, liftReducerWith } from './reducer';
import { liftAction, unliftState, shouldFilterActions, filterLiftedState, } from './utils';
import { DevtoolsDispatcher } from './devtools-dispatcher';
import { PERFORM_ACTION } from './actions';
var StoreDevtools = /** @class */ (function () {
    function StoreDevtools(dispatcher, actions$, reducers$, extension, scannedActions, errorHandler, initialState, config) {
        var _this = this;
        var liftedInitialState = liftInitialState(initialState, config.monitor);
        var liftReducer = liftReducerWith(initialState, liftedInitialState, errorHandler, config.monitor, config);
        var liftedAction$ = merge(merge(actions$.asObservable().pipe(skip(1)), extension.actions$).pipe(map(liftAction)), dispatcher, extension.liftedActions$).pipe(observeOn(queueScheduler));
        var liftedReducer$ = reducers$.pipe(map(liftReducer));
        var liftedStateSubject = new ReplaySubject(1);
        var liftedStateSubscription = liftedAction$
            .pipe(withLatestFrom(liftedReducer$), scan(function (_a, _b) {
            var liftedState = _a.state;
            var _c = __read(_b, 2), action = _c[0], reducer = _c[1];
            var reducedLiftedState = reducer(liftedState, action);
            // On full state update
            // If we have actions filters, we must filter completly our lifted state to be sync with the extension
            if (action.type !== PERFORM_ACTION && shouldFilterActions(config)) {
                reducedLiftedState = filterLiftedState(reducedLiftedState, config.predicate, config.actionsWhitelist, config.actionsBlacklist);
            }
            // Extension should be sent the sanitized lifted state
            extension.notify(action, reducedLiftedState);
            return { state: reducedLiftedState, action: action };
        }, { state: liftedInitialState, action: null }))
            .subscribe(function (_a) {
            var state = _a.state, action = _a.action;
            liftedStateSubject.next(state);
            if (action.type === Actions.PERFORM_ACTION) {
                var unliftedAction = action.action;
                scannedActions.next(unliftedAction);
            }
        });
        var extensionStartSubscription = extension.start$.subscribe(function () {
            _this.refresh();
        });
        var liftedState$ = liftedStateSubject.asObservable();
        var state$ = liftedState$.pipe(map(unliftState));
        this.extensionStartSubscription = extensionStartSubscription;
        this.stateSubscription = liftedStateSubscription;
        this.dispatcher = dispatcher;
        this.liftedState = liftedState$;
        this.state = state$;
    }
    StoreDevtools.prototype.dispatch = function (action) {
        this.dispatcher.next(action);
    };
    StoreDevtools.prototype.next = function (action) {
        this.dispatcher.next(action);
    };
    StoreDevtools.prototype.error = function (error) { };
    StoreDevtools.prototype.complete = function () { };
    StoreDevtools.prototype.performAction = function (action) {
        this.dispatch(new Actions.PerformAction(action, +Date.now()));
    };
    StoreDevtools.prototype.refresh = function () {
        this.dispatch(new Actions.Refresh());
    };
    StoreDevtools.prototype.reset = function () {
        this.dispatch(new Actions.Reset(+Date.now()));
    };
    StoreDevtools.prototype.rollback = function () {
        this.dispatch(new Actions.Rollback(+Date.now()));
    };
    StoreDevtools.prototype.commit = function () {
        this.dispatch(new Actions.Commit(+Date.now()));
    };
    StoreDevtools.prototype.sweep = function () {
        this.dispatch(new Actions.Sweep());
    };
    StoreDevtools.prototype.toggleAction = function (id) {
        this.dispatch(new Actions.ToggleAction(id));
    };
    StoreDevtools.prototype.jumpToAction = function (actionId) {
        this.dispatch(new Actions.JumpToAction(actionId));
    };
    StoreDevtools.prototype.jumpToState = function (index) {
        this.dispatch(new Actions.JumpToState(index));
    };
    StoreDevtools.prototype.importState = function (nextLiftedState) {
        this.dispatch(new Actions.ImportState(nextLiftedState));
    };
    StoreDevtools.prototype.lockChanges = function (status) {
        this.dispatch(new Actions.LockChanges(status));
    };
    StoreDevtools.prototype.pauseRecording = function (status) {
        this.dispatch(new Actions.PauseRecording(status));
    };
    StoreDevtools = __decorate([
        Injectable(),
        __param(6, Inject(INITIAL_STATE)),
        __param(7, Inject(STORE_DEVTOOLS_CONFIG)),
        __metadata("design:paramtypes", [DevtoolsDispatcher,
            ActionsSubject,
            ReducerObservable,
            DevtoolsExtension,
            ScannedActionsSubject,
            ErrorHandler, Object, StoreDevtoolsConfig])
    ], StoreDevtools);
    return StoreDevtools;
}());
export { StoreDevtools };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2dG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3N0b3JlLWRldnRvb2xzL3NyYy9kZXZ0b29scy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2pFLE9BQU8sRUFHTCxjQUFjLEVBQ2QsYUFBYSxFQUNiLGlCQUFpQixFQUNqQixxQkFBcUIsR0FDdEIsTUFBTSxhQUFhLENBQUM7QUFDckIsT0FBTyxFQUNMLEtBQUssRUFHTCxjQUFjLEVBQ2QsYUFBYSxHQUVkLE1BQU0sTUFBTSxDQUFDO0FBQ2QsT0FBTyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU1RSxPQUFPLEtBQUssT0FBTyxNQUFNLFdBQVcsQ0FBQztBQUNyQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDdEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ2hELE9BQU8sRUFBZSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDM0UsT0FBTyxFQUNMLFVBQVUsRUFDVixXQUFXLEVBQ1gsbUJBQW1CLEVBQ25CLGlCQUFpQixHQUNsQixNQUFNLFNBQVMsQ0FBQztBQUNqQixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBRzNDO0lBT0UsdUJBQ0UsVUFBOEIsRUFDOUIsUUFBd0IsRUFDeEIsU0FBNEIsRUFDNUIsU0FBNEIsRUFDNUIsY0FBcUMsRUFDckMsWUFBMEIsRUFDSCxZ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QW1CO09BZmpELGFBQWEsQ0F3SnpCO0lBQUQsb0JBQUM7Q0FBQSxBQXhKRCxJQXdKQztTQXhKWSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0LCBFcnJvckhhbmRsZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEFjdGlvbixcbiAgQWN0aW9uUmVkdWNlcixcbiAgQWN0aW9uc1N1YmplY3QsXG4gIElOSVRJQUxfU1RBVEUsXG4gIFJlZHVjZXJPYnNlcnZhYmxlLFxuICBTY2FubmVkQWN0aW9uc1N1YmplY3QsXG59IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7XG4gIG1lcmdlLFxuICBPYnNlcnZhYmxlLFxuICBPYnNlcnZlcixcbiAgcXVldWVTY2hlZHVsZXIsXG4gIFJlcGxheVN1YmplY3QsXG4gIFN1YnNjcmlwdGlvbixcbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAsIG9ic2VydmVPbiwgc2Nhbiwgc2tpcCwgd2l0aExhdGVzdEZyb20gfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCAqIGFzIEFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7IFNUT1JFX0RFVlRPT0xTX0NPTkZJRywgU3RvcmVEZXZ0b29sc0NvbmZpZyB9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7IERldnRvb2xzRXh0ZW5zaW9uIH0gZnJvbSAnLi9leHRlbnNpb24nO1xuaW1wb3J0IHsgTGlmdGVkU3RhdGUsIGxpZnRJbml0aWFsU3RhdGUsIGxpZnRSZWR1Y2VyV2l0aCB9IGZyb20gJy4vcmVkdWNlcic7XG5pbXBvcnQge1xuICBsaWZ0QWN0aW9uLFxuICB1bmxpZnRTdGF0ZSxcbiAgc2hvdWxkRmlsdGVyQWN0aW9ucyxcbiAgZmlsdGVyTGlmdGVkU3RhdGUsXG59IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgRGV2dG9vbHNEaXNwYXRjaGVyIH0gZnJvbSAnLi9kZXZ0b29scy1kaXNwYXRjaGVyJztcbmltcG9ydCB7IFBFUkZPUk1fQUNUSU9OIH0gZnJvbSAnLi9hY3Rpb25zJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0b3JlRGV2dG9vbHMgaW1wbGVtZW50cyBPYnNlcnZlcjxhbnk+IHtcbiAgcHJpdmF0ZSBzdGF0ZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcml2YXRlIGV4dGVuc2lvblN0YXJ0U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHB1YmxpYyBkaXNwYXRjaGVyOiBBY3Rpb25zU3ViamVjdDtcbiAgcHVibGljIGxpZnRlZFN0YXRlOiBPYnNlcnZhYmxlPExpZnRlZFN0YXRlPjtcbiAgcHVibGljIHN0YXRlOiBPYnNlcnZhYmxlPGFueT47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZGlzcGF0Y2hlcjogRGV2dG9vbHNEaXNwYXRjaGVyLFxuICAgIGFjdGlvbnMkOiBBY3Rpb25zU3ViamVjdCxcbiAgICByZWR1Y2VycyQ6IFJlZHVjZXJPYnNlcnZhYmxlLFxuICAgIGV4dGVuc2lvbjogRGV2dG9vbHNFeHRlbnNpb24sXG4gICAgc2Nhbm5lZEFjdGlvbnM6IFNjYW5uZWRBY3Rpb25zU3ViamVjdCxcbiAgICBlcnJvckhhbmRsZXI6IEVycm9ySGFuZGxlcixcbiAgICBASW5qZWN0KElOSVRJQUxfU1RBVEUpIGluaXRpYWxTdGF0ZTogYW55LFxuICAgIEBJbmplY3QoU1RPUkVfREVWVE9PTFNfQ09ORklHKSBjb25maWc6IFN0b3JlRGV2dG9vbHNDb25maWdcbiAgKSB7XG4gICAgY29uc3QgbGlmdGVkSW5pdGlhbFN0YXRlID0gbGlmdEluaXRpYWxTdGF0ZShpbml0aWFsU3RhdGUsIGNvbmZpZy5tb25pdG9yKTtcbiAgICBjb25zdCBsaWZ0UmVkdWNlciA9IGxpZnRSZWR1Y2VyV2l0aChcbiAgICAgIGluaXRpYWxTdGF0ZSxcbiAgICAgIGxpZnRlZEluaXRpYWxTdGF0ZSxcbiAgICAgIGVycm9ySGFuZGxlcixcbiAgICAgIGNvbmZpZy5tb25pdG9yLFxuICAgICAgY29uZmlnXG4gICAgKTtcblxuICAgIGNvbnN0IGxpZnRlZEFjdGlvbiQgPSBtZXJnZShcbiAgICAgIG1lcmdlKGFjdGlvbnMkLmFzT2JzZXJ2YWJsZSgpLnBpcGUoc2tpcCgxKSksIGV4dGVuc2lvbi5hY3Rpb25zJCkucGlwZShcbiAgICAgICAgbWFwKGxpZnRBY3Rpb24pXG4gICAgICApLFxuICAgICAgZGlzcGF0Y2hlcixcbiAgICAgIGV4dGVuc2lvbi5saWZ0ZWRBY3Rpb25zJFxuICAgICkucGlwZShvYnNlcnZlT24ocXVldWVTY2hlZHVsZXIpKTtcblxuICAgIGNvbnN0IGxpZnRlZFJlZHVjZXIkID0gcmVkdWNlcnMkLnBpcGUobWFwKGxpZnRSZWR1Y2VyKSk7XG5cbiAgICBjb25zdCBsaWZ0ZWRTdGF0ZVN1YmplY3QgPSBuZXcgUmVwbGF5U3ViamVjdDxMaWZ0ZWRTdGF0ZT4oMSk7XG5cbiAgICBjb25zdCBsaWZ0ZWRTdGF0ZVN1YnNjcmlwdGlvbiA9IGxpZnRlZEFjdGlvbiRcbiAgICAgIC5waXBlKFxuICAgICAgICB3aXRoTGF0ZXN0RnJvbShsaWZ0ZWRSZWR1Y2VyJCksXG4gICAgICAgIHNjYW48XG4gICAgICAgICAgW2FueSwgQWN0aW9uUmVkdWNlcjxMaWZ0ZWRTdGF0ZSwgQWN0aW9ucy5BbGw+XSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGF0ZTogTGlmdGVkU3RhdGU7XG4gICAgICAgICAgICBhY3Rpb246IGFueTtcbiAgICAgICAgICB9XG4gICAgICAgID4oXG4gICAgICAgICAgKHsgc3RhdGU6IGxpZnRlZFN0YXRlIH0sIFthY3Rpb24sIHJlZHVjZXJdKSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVkdWNlZExpZnRlZFN0YXRlID0gcmVkdWNlcihsaWZ0ZWRTdGF0ZSwgYWN0aW9uKTtcbiAgICAgICAgICAgIC8vIE9uIGZ1bGwgc3RhdGUgdXBkYXRlXG4gICAgICAgICAgICAvLyBJZiB3ZSBoYXZlIGFjdGlvbnMgZmlsdGVycywgd2UgbXVzdCBmaWx0ZXIgY29tcGxldGx5IG91ciBsaWZ0ZWQgc3RhdGUgdG8gYmUgc3luYyB3aXRoIHRoZSBleHRlbnNpb25cbiAgICAgICAgICAgIGlmIChhY3Rpb24udHlwZSAhPT0gUEVSRk9STV9BQ1RJT04gJiYgc2hvdWxkRmlsdGVyQWN0aW9ucyhjb25maWcpKSB7XG4gICAgICAgICAgICAgIHJlZHVjZWRMaWZ0ZWRTdGF0ZSA9IGZpbHRlckxpZnRlZFN0YXRlKFxuICAgICAgICAgICAgICAgIHJlZHVjZWRMaWZ0ZWRTdGF0ZSxcbiAgICAgICAgICAgICAgICBjb25maWcucHJlZGljYXRlLFxuICAgICAgICAgICAgICAgIGNvbmZpZy5hY3Rpb25zV2hpdGVsaXN0LFxuICAgICAgICAgICAgICAgIGNvbmZpZy5hY3Rpb25zQmxhY2tsaXN0XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBFeHRlbnNpb24gc2hvdWxkIGJlIHNlbnQgdGhlIHNhbml0aXplZCBsaWZ0ZWQgc3RhdGVcbiAgICAgICAgICAgIGV4dGVuc2lvbi5ub3RpZnkoYWN0aW9uLCByZWR1Y2VkTGlmdGVkU3RhdGUpO1xuICAgICAgICAgICAgcmV0dXJuIHsgc3RhdGU6IHJlZHVjZWRMaWZ0ZWRTdGF0ZSwgYWN0aW9uIH07XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IHN0YXRlOiBsaWZ0ZWRJbml0aWFsU3RhdGUsIGFjdGlvbjogbnVsbCBhcyBhbnkgfVxuICAgICAgICApXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKCh7IHN0YXRlLCBhY3Rpb24gfSkgPT4ge1xuICAgICAgICBsaWZ0ZWRTdGF0ZVN1YmplY3QubmV4dChzdGF0ZSk7XG5cbiAgICAgICAgaWYgKGFjdGlvbi50eXBlID09PSBBY3Rpb25zLlBFUkZPUk1fQUNUSU9OKSB7XG4gICAgICAgICAgY29uc3QgdW5saWZ0ZWRBY3Rpb24gPSAoYWN0aW9uIGFzIEFjdGlvbnMuUGVyZm9ybUFjdGlvbikuYWN0aW9uO1xuXG4gICAgICAgICAgc2Nhbm5lZEFjdGlvbnMubmV4dCh1bmxpZnRlZEFjdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgY29uc3QgZXh0ZW5zaW9uU3RhcnRTdWJzY3JpcHRpb24gPSBleHRlbnNpb24uc3RhcnQkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnJlZnJlc2goKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGxpZnRlZFN0YXRlJCA9IGxpZnRlZFN0YXRlU3ViamVjdC5hc09ic2VydmFibGUoKSBhcyBPYnNlcnZhYmxlPFxuICAgICAgTGlmdGVkU3RhdGVcbiAgICA+O1xuICAgIGNvbnN0IHN0YXRlJCA9IGxpZnRlZFN0YXRlJC5waXBlKG1hcCh1bmxpZnRTdGF0ZSkpO1xuXG4gICAgdGhpcy5leHRlbnNpb25TdGFydFN1YnNjcmlwdGlvbiA9IGV4dGVuc2lvblN0YXJ0U3Vic2NyaXB0aW9uO1xuICAgIHRoaXMuc3RhdGVTdWJzY3JpcHRpb24gPSBsaWZ0ZWRTdGF0ZVN1YnNjcmlwdGlvbjtcbiAgICB0aGlzLmRpc3BhdGNoZXIgPSBkaXNwYXRjaGVyO1xuICAgIHRoaXMubGlmdGVkU3RhdGUgPSBsaWZ0ZWRTdGF0ZSQ7XG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlJDtcbiAgfVxuXG4gIGRpc3BhdGNoKGFjdGlvbjogQWN0aW9uKSB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLm5leHQoYWN0aW9uKTtcbiAgfVxuXG4gIG5leHQoYWN0aW9uOiBhbnkpIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIubmV4dChhY3Rpb24pO1xuICB9XG5cbiAgZXJyb3IoZXJyb3I6IGFueSkge31cblxuICBjb21wbGV0ZSgpIHt9XG5cbiAgcGVyZm9ybUFjdGlvbihhY3Rpb246IGFueSkge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuUGVyZm9ybUFjdGlvbihhY3Rpb24sICtEYXRlLm5vdygpKSk7XG4gIH1cblxuICByZWZyZXNoKCkge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuUmVmcmVzaCgpKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuUmVzZXQoK0RhdGUubm93KCkpKTtcbiAgfVxuXG4gIHJvbGxiYWNrKCkge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuUm9sbGJhY2soK0RhdGUubm93KCkpKTtcbiAgfVxuXG4gIGNvbW1pdCgpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLkNvbW1pdCgrRGF0ZS5ub3coKSkpO1xuICB9XG5cbiAgc3dlZXAoKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5Td2VlcCgpKTtcbiAgfVxuXG4gIHRvZ2dsZUFjdGlvbihpZDogbnVtYmVyKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5Ub2dnbGVBY3Rpb24oaWQpKTtcbiAgfVxuXG4gIGp1bXBUb0FjdGlvbihhY3Rpb25JZDogbnVtYmVyKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5KdW1wVG9BY3Rpb24oYWN0aW9uSWQpKTtcbiAgfVxuXG4gIGp1bXBUb1N0YXRlKGluZGV4OiBudW1iZXIpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLkp1bXBUb1N0YXRlKGluZGV4KSk7XG4gIH1cblxuICBpbXBvcnRTdGF0ZShuZXh0TGlmdGVkU3RhdGU6IGFueSkge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuSW1wb3J0U3RhdGUobmV4dExpZnRlZFN0YXRlKSk7XG4gIH1cblxuICBsb2NrQ2hhbmdlcyhzdGF0dXM6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLkxvY2tDaGFuZ2VzKHN0YXR1cykpO1xuICB9XG5cbiAgcGF1c2VSZWNvcmRpbmcoc3RhdHVzOiBib29sZWFuKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5QYXVzZVJlY29yZGluZyhzdGF0dXMpKTtcbiAgfVxufVxuIl19