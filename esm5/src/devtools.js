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
import { liftAction, unliftState } from './utils';
import { DevtoolsDispatcher } from './devtools-dispatcher';
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
            // // Extension should be sent the sanitized lifted state
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
    StoreDevtools.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    StoreDevtools.ctorParameters = function () { return [
        { type: DevtoolsDispatcher },
        { type: ActionsSubject },
        { type: ReducerObservable },
        { type: DevtoolsExtension },
        { type: ScannedActionsSubject },
        { type: ErrorHandler },
        { type: undefined, decorators: [{ type: Inject, args: [INITIAL_STATE,] }] },
        { type: StoreDevtoolsConfig, decorators: [{ type: Inject, args: [STORE_DEVTOOLS_CONFIG,] }] }
    ]; };
    return StoreDevtools;
}());
export { StoreDevtools };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2dG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3N0b3JlLWRldnRvb2xzL3NyYy9kZXZ0b29scy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2pFLE9BQU8sRUFHTCxjQUFjLEVBQ2QsYUFBYSxFQUNiLGlCQUFpQixFQUNqQixxQkFBcUIsR0FDdEIsTUFBTSxhQUFhLENBQUM7QUFDckIsT0FBTyxFQUNMLEtBQUssRUFHTCxjQUFjLEVBQ2QsYUFBYSxHQUVkLE1BQU0sTUFBTSxDQUFDO0FBQ2QsT0FBTyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU1RSxPQUFPLEtBQUssT0FBTyxNQUFNLFdBQVcsQ0FBQztBQUNyQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDdEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ2hELE9BQU8sRUFBZSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDM0UsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDbEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFM0Q7SUFRRSx1QkFDRSxVQUE4QixFQUM5QixRQUF3QixFQUN4QixTQUE0QixFQUM1QixTQUE0QixFQUM1QixjQUFxQyxFQUNyQyxZQUEwQixFQUNILFlBQWlCLEVBQ1QsTUFBMkI7UUFSNUQsaUJBNEVDO1FBbEVDLElBQU0sa0JBQWtCLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLE1BQU0s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QVcsR0FBWCxVQUFZLEtBQWE7UUFDdkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsbUNBQVcsR0FBWCxVQUFZLGVBQW9CO1FBQzlCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVELG1DQUFXLEdBQVgsVUFBWSxNQUFlO1FBQ3pCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELHNDQUFjLEdBQWQsVUFBZSxNQUFlO1FBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDcEQsQ0FBQzs7Z0JBaEpGLFVBQVU7Ozs7Z0JBRkYsa0JBQWtCO2dCQXBCekIsY0FBYztnQkFFZCxpQkFBaUI7Z0JBZVYsaUJBQWlCO2dCQWR4QixxQkFBcUI7Z0JBUE0sWUFBWTtnREF5Q3BDLE1BQU0sU0FBQyxhQUFhO2dCQXJCTyxtQkFBbUIsdUJBc0I5QyxNQUFNLFNBQUMscUJBQXFCOztJQWlJakMsb0JBQUM7Q0FBQSxBQWpKRCxJQWlKQztTQWhKWSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0LCBFcnJvckhhbmRsZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEFjdGlvbixcbiAgQWN0aW9uUmVkdWNlcixcbiAgQWN0aW9uc1N1YmplY3QsXG4gIElOSVRJQUxfU1RBVEUsXG4gIFJlZHVjZXJPYnNlcnZhYmxlLFxuICBTY2FubmVkQWN0aW9uc1N1YmplY3QsXG59IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7XG4gIG1lcmdlLFxuICBPYnNlcnZhYmxlLFxuICBPYnNlcnZlcixcbiAgcXVldWVTY2hlZHVsZXIsXG4gIFJlcGxheVN1YmplY3QsXG4gIFN1YnNjcmlwdGlvbixcbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAsIG9ic2VydmVPbiwgc2Nhbiwgc2tpcCwgd2l0aExhdGVzdEZyb20gfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCAqIGFzIEFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7IFNUT1JFX0RFVlRPT0xTX0NPTkZJRywgU3RvcmVEZXZ0b29sc0NvbmZpZyB9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7IERldnRvb2xzRXh0ZW5zaW9uIH0gZnJvbSAnLi9leHRlbnNpb24nO1xuaW1wb3J0IHsgTGlmdGVkU3RhdGUsIGxpZnRJbml0aWFsU3RhdGUsIGxpZnRSZWR1Y2VyV2l0aCB9IGZyb20gJy4vcmVkdWNlcic7XG5pbXBvcnQgeyBsaWZ0QWN0aW9uLCB1bmxpZnRTdGF0ZSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgRGV2dG9vbHNEaXNwYXRjaGVyIH0gZnJvbSAnLi9kZXZ0b29scy1kaXNwYXRjaGVyJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0b3JlRGV2dG9vbHMgaW1wbGVtZW50cyBPYnNlcnZlcjxhbnk+IHtcbiAgcHJpdmF0ZSBzdGF0ZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcml2YXRlIGV4dGVuc2lvblN0YXJ0U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHB1YmxpYyBkaXNwYXRjaGVyOiBBY3Rpb25zU3ViamVjdDtcbiAgcHVibGljIGxpZnRlZFN0YXRlOiBPYnNlcnZhYmxlPExpZnRlZFN0YXRlPjtcbiAgcHVibGljIHN0YXRlOiBPYnNlcnZhYmxlPGFueT47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZGlzcGF0Y2hlcjogRGV2dG9vbHNEaXNwYXRjaGVyLFxuICAgIGFjdGlvbnMkOiBBY3Rpb25zU3ViamVjdCxcbiAgICByZWR1Y2VycyQ6IFJlZHVjZXJPYnNlcnZhYmxlLFxuICAgIGV4dGVuc2lvbjogRGV2dG9vbHNFeHRlbnNpb24sXG4gICAgc2Nhbm5lZEFjdGlvbnM6IFNjYW5uZWRBY3Rpb25zU3ViamVjdCxcbiAgICBlcnJvckhhbmRsZXI6IEVycm9ySGFuZGxlcixcbiAgICBASW5qZWN0KElOSVRJQUxfU1RBVEUpIGluaXRpYWxTdGF0ZTogYW55LFxuICAgIEBJbmplY3QoU1RPUkVfREVWVE9PTFNfQ09ORklHKSBjb25maWc6IFN0b3JlRGV2dG9vbHNDb25maWdcbiAgKSB7XG4gICAgY29uc3QgbGlmdGVkSW5pdGlhbFN0YXRlID0gbGlmdEluaXRpYWxTdGF0ZShpbml0aWFsU3RhdGUsIGNvbmZpZy5tb25pdG9yKTtcbiAgICBjb25zdCBsaWZ0UmVkdWNlciA9IGxpZnRSZWR1Y2VyV2l0aChcbiAgICAgIGluaXRpYWxTdGF0ZSxcbiAgICAgIGxpZnRlZEluaXRpYWxTdGF0ZSxcbiAgICAgIGVycm9ySGFuZGxlcixcbiAgICAgIGNvbmZpZy5tb25pdG9yLFxuICAgICAgY29uZmlnXG4gICAgKTtcblxuICAgIGNvbnN0IGxpZnRlZEFjdGlvbiQgPSBtZXJnZShcbiAgICAgIG1lcmdlKGFjdGlvbnMkLmFzT2JzZXJ2YWJsZSgpLnBpcGUoc2tpcCgxKSksIGV4dGVuc2lvbi5hY3Rpb25zJCkucGlwZShcbiAgICAgICAgbWFwKGxpZnRBY3Rpb24pXG4gICAgICApLFxuICAgICAgZGlzcGF0Y2hlcixcbiAgICAgIGV4dGVuc2lvbi5saWZ0ZWRBY3Rpb25zJFxuICAgICkucGlwZShvYnNlcnZlT24ocXVldWVTY2hlZHVsZXIpKTtcblxuICAgIGNvbnN0IGxpZnRlZFJlZHVjZXIkID0gcmVkdWNlcnMkLnBpcGUobWFwKGxpZnRSZWR1Y2VyKSk7XG5cbiAgICBjb25zdCBsaWZ0ZWRTdGF0ZVN1YmplY3QgPSBuZXcgUmVwbGF5U3ViamVjdDxMaWZ0ZWRTdGF0ZT4oMSk7XG5cbiAgICBjb25zdCBsaWZ0ZWRTdGF0ZVN1YnNjcmlwdGlvbiA9IGxpZnRlZEFjdGlvbiRcbiAgICAgIC5waXBlKFxuICAgICAgICB3aXRoTGF0ZXN0RnJvbShsaWZ0ZWRSZWR1Y2VyJCksXG4gICAgICAgIHNjYW48XG4gICAgICAgICAgW2FueSwgQWN0aW9uUmVkdWNlcjxMaWZ0ZWRTdGF0ZSwgQWN0aW9ucy5BbGw+XSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGF0ZTogTGlmdGVkU3RhdGU7XG4gICAgICAgICAgICBhY3Rpb246IGFueTtcbiAgICAgICAgICB9XG4gICAgICAgID4oXG4gICAgICAgICAgKHsgc3RhdGU6IGxpZnRlZFN0YXRlIH0sIFthY3Rpb24sIHJlZHVjZXJdKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZWR1Y2VkTGlmdGVkU3RhdGUgPSByZWR1Y2VyKGxpZnRlZFN0YXRlLCBhY3Rpb24pO1xuXG4gICAgICAgICAgICAvLyAvLyBFeHRlbnNpb24gc2hvdWxkIGJlIHNlbnQgdGhlIHNhbml0aXplZCBsaWZ0ZWQgc3RhdGVcbiAgICAgICAgICAgIGV4dGVuc2lvbi5ub3RpZnkoYWN0aW9uLCByZWR1Y2VkTGlmdGVkU3RhdGUpO1xuXG4gICAgICAgICAgICByZXR1cm4geyBzdGF0ZTogcmVkdWNlZExpZnRlZFN0YXRlLCBhY3Rpb24gfTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHsgc3RhdGU6IGxpZnRlZEluaXRpYWxTdGF0ZSwgYWN0aW9uOiBudWxsIGFzIGFueSB9XG4gICAgICAgIClcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKHsgc3RhdGUsIGFjdGlvbiB9KSA9PiB7XG4gICAgICAgIGxpZnRlZFN0YXRlU3ViamVjdC5uZXh0KHN0YXRlKTtcblxuICAgICAgICBpZiAoYWN0aW9uLnR5cGUgPT09IEFjdGlvbnMuUEVSRk9STV9BQ1RJT04pIHtcbiAgICAgICAgICBjb25zdCB1bmxpZnRlZEFjdGlvbiA9IChhY3Rpb24gYXMgQWN0aW9ucy5QZXJmb3JtQWN0aW9uKS5hY3Rpb247XG5cbiAgICAgICAgICBzY2FubmVkQWN0aW9ucy5uZXh0KHVubGlmdGVkQWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICBjb25zdCBleHRlbnNpb25TdGFydFN1YnNjcmlwdGlvbiA9IGV4dGVuc2lvbi5zdGFydCQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMucmVmcmVzaCgpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgbGlmdGVkU3RhdGUkID0gbGlmdGVkU3RhdGVTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpIGFzIE9ic2VydmFibGU8XG4gICAgICBMaWZ0ZWRTdGF0ZVxuICAgID47XG4gICAgY29uc3Qgc3RhdGUkID0gbGlmdGVkU3RhdGUkLnBpcGUobWFwKHVubGlmdFN0YXRlKSk7XG5cbiAgICB0aGlzLmV4dGVuc2lvblN0YXJ0U3Vic2NyaXB0aW9uID0gZXh0ZW5zaW9uU3RhcnRTdWJzY3JpcHRpb247XG4gICAgdGhpcy5zdGF0ZVN1YnNjcmlwdGlvbiA9IGxpZnRlZFN0YXRlU3Vic2NyaXB0aW9uO1xuICAgIHRoaXMuZGlzcGF0Y2hlciA9IGRpc3BhdGNoZXI7XG4gICAgdGhpcy5saWZ0ZWRTdGF0ZSA9IGxpZnRlZFN0YXRlJDtcbiAgICB0aGlzLnN0YXRlID0gc3RhdGUkO1xuICB9XG5cbiAgZGlzcGF0Y2goYWN0aW9uOiBBY3Rpb24pIHtcbiAgICB0aGlzLmRpc3BhdGNoZXIubmV4dChhY3Rpb24pO1xuICB9XG5cbiAgbmV4dChhY3Rpb246IGFueSkge1xuICAgIHRoaXMuZGlzcGF0Y2hlci5uZXh0KGFjdGlvbik7XG4gIH1cblxuICBlcnJvcihlcnJvcjogYW55KSB7fVxuXG4gIGNvbXBsZXRlKCkge31cblxuICBwZXJmb3JtQWN0aW9uKGFjdGlvbjogYW55KSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5QZXJmb3JtQWN0aW9uKGFjdGlvbiwgK0RhdGUubm93KCkpKTtcbiAgfVxuXG4gIHJlZnJlc2goKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5SZWZyZXNoKCkpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5SZXNldCgrRGF0ZS5ub3coKSkpO1xuICB9XG5cbiAgcm9sbGJhY2soKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5Sb2xsYmFjaygrRGF0ZS5ub3coKSkpO1xuICB9XG5cbiAgY29tbWl0KCkge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuQ29tbWl0KCtEYXRlLm5vdygpKSk7XG4gIH1cblxuICBzd2VlcCgpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLlN3ZWVwKCkpO1xuICB9XG5cbiAgdG9nZ2xlQWN0aW9uKGlkOiBudW1iZXIpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLlRvZ2dsZUFjdGlvbihpZCkpO1xuICB9XG5cbiAganVtcFRvQWN0aW9uKGFjdGlvbklkOiBudW1iZXIpIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLkp1bXBUb0FjdGlvbihhY3Rpb25JZCkpO1xuICB9XG5cbiAganVtcFRvU3RhdGUoaW5kZXg6IG51bWJlcikge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuSnVtcFRvU3RhdGUoaW5kZXgpKTtcbiAgfVxuXG4gIGltcG9ydFN0YXRlKG5leHRMaWZ0ZWRTdGF0ZTogYW55KSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgQWN0aW9ucy5JbXBvcnRTdGF0ZShuZXh0TGlmdGVkU3RhdGUpKTtcbiAgfVxuXG4gIGxvY2tDaGFuZ2VzKHN0YXR1czogYm9vbGVhbikge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IEFjdGlvbnMuTG9ja0NoYW5nZXMoc3RhdHVzKSk7XG4gIH1cblxuICBwYXVzZVJlY29yZGluZyhzdGF0dXM6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBBY3Rpb25zLlBhdXNlUmVjb3JkaW5nKHN0YXR1cykpO1xuICB9XG59XG4iXX0=