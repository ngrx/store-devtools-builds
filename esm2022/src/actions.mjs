export const PERFORM_ACTION = 'PERFORM_ACTION';
export const REFRESH = 'REFRESH';
export const RESET = 'RESET';
export const ROLLBACK = 'ROLLBACK';
export const COMMIT = 'COMMIT';
export const SWEEP = 'SWEEP';
export const TOGGLE_ACTION = 'TOGGLE_ACTION';
export const SET_ACTIONS_ACTIVE = 'SET_ACTIONS_ACTIVE';
export const JUMP_TO_STATE = 'JUMP_TO_STATE';
export const JUMP_TO_ACTION = 'JUMP_TO_ACTION';
export const IMPORT_STATE = 'IMPORT_STATE';
export const LOCK_CHANGES = 'LOCK_CHANGES';
export const PAUSE_RECORDING = 'PAUSE_RECORDING';
export class PerformAction {
    constructor(action, timestamp) {
        this.action = action;
        this.timestamp = timestamp;
        this.type = PERFORM_ACTION;
        if (typeof action.type === 'undefined') {
            throw new Error('Actions may not have an undefined "type" property. ' +
                'Have you misspelled a constant?');
        }
    }
}
export class Refresh {
    constructor() {
        this.type = REFRESH;
    }
}
export class Reset {
    constructor(timestamp) {
        this.timestamp = timestamp;
        this.type = RESET;
    }
}
export class Rollback {
    constructor(timestamp) {
        this.timestamp = timestamp;
        this.type = ROLLBACK;
    }
}
export class Commit {
    constructor(timestamp) {
        this.timestamp = timestamp;
        this.type = COMMIT;
    }
}
export class Sweep {
    constructor() {
        this.type = SWEEP;
    }
}
export class ToggleAction {
    constructor(id) {
        this.id = id;
        this.type = TOGGLE_ACTION;
    }
}
export class SetActionsActive {
    constructor(start, end, active = true) {
        this.start = start;
        this.end = end;
        this.active = active;
        this.type = SET_ACTIONS_ACTIVE;
    }
}
export class JumpToState {
    constructor(index) {
        this.index = index;
        this.type = JUMP_TO_STATE;
    }
}
export class JumpToAction {
    constructor(actionId) {
        this.actionId = actionId;
        this.type = JUMP_TO_ACTION;
    }
}
export class ImportState {
    constructor(nextLiftedState) {
        this.nextLiftedState = nextLiftedState;
        this.type = IMPORT_STATE;
    }
}
export class LockChanges {
    constructor(status) {
        this.status = status;
        this.type = LOCK_CHANGES;
    }
}
export class PauseRecording {
    constructor(status) {
        this.status = status;
        this.type = PAUSE_RECORDING;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21vZHVsZXMvc3RvcmUtZGV2dG9vbHMvc3JjL2FjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHLGdCQUFnQixDQUFDO0FBQy9DLE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxTQUFTLENBQUM7QUFDakMsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQztBQUM3QixNQUFNLENBQUMsTUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDO0FBQ25DLE1BQU0sQ0FBQyxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUM7QUFDL0IsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQztBQUM3QixNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsZUFBZSxDQUFDO0FBQzdDLE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFHLG9CQUFvQixDQUFDO0FBQ3ZELE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBRyxlQUFlLENBQUM7QUFDN0MsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHLGdCQUFnQixDQUFDO0FBQy9DLE1BQU0sQ0FBQyxNQUFNLFlBQVksR0FBRyxjQUFjLENBQUM7QUFDM0MsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHLGNBQWMsQ0FBQztBQUMzQyxNQUFNLENBQUMsTUFBTSxlQUFlLEdBQUcsaUJBQWlCLENBQUM7QUFFakQsTUFBTSxPQUFPLGFBQWE7SUFHeEIsWUFBbUIsTUFBYyxFQUFTLFNBQWlCO1FBQXhDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBUyxjQUFTLEdBQVQsU0FBUyxDQUFRO1FBRmxELFNBQUksR0FBRyxjQUFjLENBQUM7UUFHN0IsSUFBSSxPQUFPLE1BQU0sQ0FBQyxJQUFJLEtBQUssV0FBVyxFQUFFLENBQUM7WUFDdkMsTUFBTSxJQUFJLEtBQUssQ0FDYixxREFBcUQ7Z0JBQ25ELGlDQUFpQyxDQUNwQyxDQUFDO1FBQ0osQ0FBQztJQUNILENBQUM7Q0FDRjtBQUVELE1BQU0sT0FBTyxPQUFPO0lBQXBCO1FBQ1csU0FBSSxHQUFHLE9BQU8sQ0FBQztJQUMxQixDQUFDO0NBQUE7QUFFRCxNQUFNLE9BQU8sS0FBSztJQUdoQixZQUFtQixTQUFpQjtRQUFqQixjQUFTLEdBQVQsU0FBUyxDQUFRO1FBRjNCLFNBQUksR0FBRyxLQUFLLENBQUM7SUFFaUIsQ0FBQztDQUN6QztBQUVELE1BQU0sT0FBTyxRQUFRO0lBR25CLFlBQW1CLFNBQWlCO1FBQWpCLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFGM0IsU0FBSSxHQUFHLFFBQVEsQ0FBQztJQUVjLENBQUM7Q0FDekM7QUFFRCxNQUFNLE9BQU8sTUFBTTtJQUdqQixZQUFtQixTQUFpQjtRQUFqQixjQUFTLEdBQVQsU0FBUyxDQUFRO1FBRjNCLFNBQUksR0FBRyxNQUFNLENBQUM7SUFFZ0IsQ0FBQztDQUN6QztBQUVELE1BQU0sT0FBTyxLQUFLO0lBQWxCO1FBQ1csU0FBSSxHQUFHLEtBQUssQ0FBQztJQUN4QixDQUFDO0NBQUE7QUFFRCxNQUFNLE9BQU8sWUFBWTtJQUd2QixZQUFtQixFQUFVO1FBQVYsT0FBRSxHQUFGLEVBQUUsQ0FBUTtRQUZwQixTQUFJLEdBQUcsYUFBYSxDQUFDO0lBRUUsQ0FBQztDQUNsQztBQUVELE1BQU0sT0FBTyxnQkFBZ0I7SUFHM0IsWUFBbUIsS0FBYSxFQUFTLEdBQVcsRUFBUyxTQUFTLElBQUk7UUFBdkQsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUFTLFFBQUcsR0FBSCxHQUFHLENBQVE7UUFBUyxXQUFNLEdBQU4sTUFBTSxDQUFPO1FBRmpFLFNBQUksR0FBRyxrQkFBa0IsQ0FBQztJQUUwQyxDQUFDO0NBQy9FO0FBRUQsTUFBTSxPQUFPLFdBQVc7SUFHdEIsWUFBbUIsS0FBYTtRQUFiLFVBQUssR0FBTCxLQUFLLENBQVE7UUFGdkIsU0FBSSxHQUFHLGFBQWEsQ0FBQztJQUVLLENBQUM7Q0FDckM7QUFFRCxNQUFNLE9BQU8sWUFBWTtJQUd2QixZQUFtQixRQUFnQjtRQUFoQixhQUFRLEdBQVIsUUFBUSxDQUFRO1FBRjFCLFNBQUksR0FBRyxjQUFjLENBQUM7SUFFTyxDQUFDO0NBQ3hDO0FBRUQsTUFBTSxPQUFPLFdBQVc7SUFHdEIsWUFBbUIsZUFBb0I7UUFBcEIsb0JBQWUsR0FBZixlQUFlLENBQUs7UUFGOUIsU0FBSSxHQUFHLFlBQVksQ0FBQztJQUVhLENBQUM7Q0FDNUM7QUFFRCxNQUFNLE9BQU8sV0FBVztJQUd0QixZQUFtQixNQUFlO1FBQWYsV0FBTSxHQUFOLE1BQU0sQ0FBUztRQUZ6QixTQUFJLEdBQUcsWUFBWSxDQUFDO0lBRVEsQ0FBQztDQUN2QztBQUVELE1BQU0sT0FBTyxjQUFjO0lBR3pCLFlBQW1CLE1BQWU7UUFBZixXQUFNLEdBQU4sTUFBTSxDQUFTO1FBRnpCLFNBQUksR0FBRyxlQUFlLENBQUM7SUFFSyxDQUFDO0NBQ3ZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuXG5leHBvcnQgY29uc3QgUEVSRk9STV9BQ1RJT04gPSAnUEVSRk9STV9BQ1RJT04nO1xuZXhwb3J0IGNvbnN0IFJFRlJFU0ggPSAnUkVGUkVTSCc7XG5leHBvcnQgY29uc3QgUkVTRVQgPSAnUkVTRVQnO1xuZXhwb3J0IGNvbnN0IFJPTExCQUNLID0gJ1JPTExCQUNLJztcbmV4cG9ydCBjb25zdCBDT01NSVQgPSAnQ09NTUlUJztcbmV4cG9ydCBjb25zdCBTV0VFUCA9ICdTV0VFUCc7XG5leHBvcnQgY29uc3QgVE9HR0xFX0FDVElPTiA9ICdUT0dHTEVfQUNUSU9OJztcbmV4cG9ydCBjb25zdCBTRVRfQUNUSU9OU19BQ1RJVkUgPSAnU0VUX0FDVElPTlNfQUNUSVZFJztcbmV4cG9ydCBjb25zdCBKVU1QX1RPX1NUQVRFID0gJ0pVTVBfVE9fU1RBVEUnO1xuZXhwb3J0IGNvbnN0IEpVTVBfVE9fQUNUSU9OID0gJ0pVTVBfVE9fQUNUSU9OJztcbmV4cG9ydCBjb25zdCBJTVBPUlRfU1RBVEUgPSAnSU1QT1JUX1NUQVRFJztcbmV4cG9ydCBjb25zdCBMT0NLX0NIQU5HRVMgPSAnTE9DS19DSEFOR0VTJztcbmV4cG9ydCBjb25zdCBQQVVTRV9SRUNPUkRJTkcgPSAnUEFVU0VfUkVDT1JESU5HJztcblxuZXhwb3J0IGNsYXNzIFBlcmZvcm1BY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gUEVSRk9STV9BQ1RJT047XG5cbiAgY29uc3RydWN0b3IocHVibGljIGFjdGlvbjogQWN0aW9uLCBwdWJsaWMgdGltZXN0YW1wOiBudW1iZXIpIHtcbiAgICBpZiAodHlwZW9mIGFjdGlvbi50eXBlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnQWN0aW9ucyBtYXkgbm90IGhhdmUgYW4gdW5kZWZpbmVkIFwidHlwZVwiIHByb3BlcnR5LiAnICtcbiAgICAgICAgICAnSGF2ZSB5b3UgbWlzc3BlbGxlZCBhIGNvbnN0YW50PydcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSZWZyZXNoIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IFJFRlJFU0g7XG59XG5cbmV4cG9ydCBjbGFzcyBSZXNldCBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBSRVNFVDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgdGltZXN0YW1wOiBudW1iZXIpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBSb2xsYmFjayBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBST0xMQkFDSztcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgdGltZXN0YW1wOiBudW1iZXIpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBDb21taXQgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gQ09NTUlUO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0aW1lc3RhbXA6IG51bWJlcikge31cbn1cblxuZXhwb3J0IGNsYXNzIFN3ZWVwIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IFNXRUVQO1xufVxuXG5leHBvcnQgY2xhc3MgVG9nZ2xlQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IFRPR0dMRV9BQ1RJT047XG5cbiAgY29uc3RydWN0b3IocHVibGljIGlkOiBudW1iZXIpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBTZXRBY3Rpb25zQWN0aXZlIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IFNFVF9BQ1RJT05TX0FDVElWRTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RhcnQ6IG51bWJlciwgcHVibGljIGVuZDogbnVtYmVyLCBwdWJsaWMgYWN0aXZlID0gdHJ1ZSkge31cbn1cblxuZXhwb3J0IGNsYXNzIEp1bXBUb1N0YXRlIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IEpVTVBfVE9fU1RBVEU7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGluZGV4OiBudW1iZXIpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBKdW1wVG9BY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gSlVNUF9UT19BQ1RJT047XG5cbiAgY29uc3RydWN0b3IocHVibGljIGFjdGlvbklkOiBudW1iZXIpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBJbXBvcnRTdGF0ZSBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBJTVBPUlRfU1RBVEU7XG5cbiAgY29uc3RydWN0b3IocHVibGljIG5leHRMaWZ0ZWRTdGF0ZTogYW55KSB7fVxufVxuXG5leHBvcnQgY2xhc3MgTG9ja0NoYW5nZXMgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gTE9DS19DSEFOR0VTO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzdGF0dXM6IGJvb2xlYW4pIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBQYXVzZVJlY29yZGluZyBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBQQVVTRV9SRUNPUkRJTkc7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHN0YXR1czogYm9vbGVhbikge31cbn1cblxuZXhwb3J0IHR5cGUgQWxsID1cbiAgfCBQZXJmb3JtQWN0aW9uXG4gIHwgUmVmcmVzaFxuICB8IFJlc2V0XG4gIHwgUm9sbGJhY2tcbiAgfCBDb21taXRcbiAgfCBTd2VlcFxuICB8IFRvZ2dsZUFjdGlvblxuICB8IFNldEFjdGlvbnNBY3RpdmVcbiAgfCBKdW1wVG9TdGF0ZVxuICB8IEp1bXBUb0FjdGlvblxuICB8IEltcG9ydFN0YXRlXG4gIHwgTG9ja0NoYW5nZXNcbiAgfCBQYXVzZVJlY29yZGluZztcbiJdfQ==