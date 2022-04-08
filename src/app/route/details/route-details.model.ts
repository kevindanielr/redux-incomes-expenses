import * as i from '../../interfaces/interfaces';
import { ShellModel } from '../../shell/data-store';

export class SheduleRouteModel extends ShellModel {
  lstRouteEmployees: i.LstRouteEmployee[];
  lstRouteTransport: i.LstRouteTransport[];
  routeDate:         Date;
  routeId:           i.Route;
  routeType:         number;
  scheduleRouteId:   number;
  statusId:         i.Status;
  
  constructor() {
    super();
  }
}
