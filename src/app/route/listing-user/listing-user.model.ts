import * as i from '../../interfaces/interfaces';
import { ShellModel } from '../../shell/data-store';

export class RouteEmployeeModel{

  employeeId:           i.Employee;
  onBoard:              boolean;
  routeEmployeeId:      number;
  routeTransportUnitId: i.RouteTransportUnit;
  scheduleRouteId:      i.ScheduleRoute;
}

export class RouteEmployeeListingModel extends ShellModel {
  items: Array<RouteEmployeeModel> = [
    new RouteEmployeeModel()
  ];

  constructor() {
    super();
  }
}

export class RouteEquipmentModel{

  companyId:            i.Company;
  equipmentDescription: string;
  equipmentId:          number;
  equipmentName:        string;
  finalPhoto:           string;
  initialPhoto:         string;
  latitude:             number;
  longitude:            number;
  routeTransportUnitId: i.RouteTransportUnit;
  scheduleRouteId:      i.ScheduleRoute;
  verified:             boolean;
}

export class RouteEquipmentListingModel extends ShellModel {
  items: Array<RouteEquipmentModel> = [
    new RouteEquipmentModel()
  ];

  constructor() {
    super();
  }
}

