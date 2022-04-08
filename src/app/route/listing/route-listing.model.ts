import * as i from '../../../app/interfaces/interfaces';
import { ShellModel } from '../../shell/data-store';

export class RouteItemModel {
  companyId:             i.Company;
  cronExpression:        string;
  routeDepartureTime:    Date;
  routeDestinationCity:  string;
  routeDestinationPlace: string;
  routeId:               number;
  routeImage:            string;
  routeName:             string;
  routeNotes:            string;
  statusId:              i.Status;
  stops:                 string;
}

export class RouteListingModel extends ShellModel {
  items: Array<RouteItemModel> = [
    new RouteItemModel(),
    new RouteItemModel(),
    new RouteItemModel(),
    new RouteItemModel()
  ];

  constructor() {
    super();
  }
}

export class CompanyModel {
  companyId:    number;
  companyName:  string;
  since:        Date;
  statusId:     i.Status;
  companyPhoto: null | string;
}

export class AccountModel {
  companyId:    number;
  companyName:  string;
  since:        Date;
  statusId:     i.Status;
  companyPhoto: null | string;
}

export class ScheduleRouteModel {
  lstRouteEmployees: i.LstRouteEmployee[];
  lstRouteTransport: null[];
  routeDate:         Date;
  routeId:           i.Route;
  routeType:         number;
  scheduleRouteId:   number;
}

export class scheduleRouteListingModel extends ShellModel {
  items: Array<ScheduleRouteModel> = [
    new ScheduleRouteModel(),
    new ScheduleRouteModel(),
  ];

  constructor() {
    super();
  }
}

