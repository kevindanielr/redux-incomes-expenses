import * as i from '../../interfaces/interfaces';
import { ShellModel } from '../../shell/data-store';

export class AsignModel extends ShellModel {
    driverId:             i.Driver;
    endLat:               number;
    endLon:               number;
    endTime:              Date;
    routeTransportUnitId: number;
    scheduleRouteId:      i.ScheduleRoute;
    startLat:             number;
    startLon:             number;
    startTime:            Date;
    transportUnitId:      i.TransportUnit
}

export class listingAsignModel extends ShellModel {
  items: Array<AsignModel> = [
    new AsignModel(),
    new AsignModel(),
    new AsignModel(),
    new AsignModel()
  ];
}

