import * as i from '../../interfaces/interfaces';
import { ShellModel } from '../../shell/data-store';

export class RouteRequestModel {
  companyId:      i.Company;
  date:           Date;
  from:           string;
  routeId:        i.Route;
  routeRequestId: number;
  to:             string;
  tripTypeId:     i.TripType;
}


export class listingRequestDiurnoModel extends ShellModel {
  items: Array<RouteRequestModel> = [
    new RouteRequestModel(),
    new RouteRequestModel()
  ];

  constructor() {
    super();
  }
}
