import * as i from '../../interfaces/interfaces';
import { ShellModel } from '../../shell/data-store';

export class ExpresModel {
  date:             Date;
  driverId:         i.Driver;
  endLat:           number;
  endLon:           number;
  endTime:          Date;
  expressRequestId: number;
  expressUserId:    i.ExpressUser;
  from:             string;
  startLat:         number;
  startLon:         number;
  startTime:        Date;
  statusId:         i.Status;
  to:               string;
  transportUnitId:  i.TransportUnit;
}


export class listingExpressModel extends ShellModel {
  items: Array<ExpresModel> = [
    new ExpresModel(),
    new ExpresModel(),
  ];

  constructor() {
    super();
  }
}
