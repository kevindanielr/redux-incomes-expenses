export interface RouteRequest {
    companyId:      Company;
    date:           Date;
    from:           string;
    routeId:        Route;
    routeRequestId: number;
    to:             string;
    tripTypeId:     TripType;
}


export interface Status {
    routeStatus: boolean;
    statusId:    number;
    statusName:  string;
}


export interface TripType {
    statusId:   Status;
    tripName:   string;
    tripTypeId: number;
}


export interface ExpressRequest {
    date:             Date;
    driverId:         Driver;
    endLat:           number;
    endLon:           number;
    endTime:          Date;
    expressRequestId: number;
    expressUserId:    ExpressRequest;
    from:             string;
    startLat:         number;
    startLon:         number;
    startTime:        Date;
    statusId:         Status;
    to:               string;
    transportUnitId:  TransportUnit;
}


export interface User {
    password:  string;
    rolId:     Rol;
    statusId:  Status;
    user:      string;
    userEmail: string;
    userId:    number;
    userName:  string;
}

export interface Rol {
    rolId:    number;
    rolName:  string;
    statusId: Status;
}

export interface ExpressUser {
    expressUserId: number;
    identifier:    string;
    name:          string;
    phone:         string;
    statusId:      Status;
}

export interface TransportUnit {
    doors:           number;
    licensePlate:    string;
    passengers:      number;
    seats:           number;
    statusId:        Status;
    transportImage:  string;
    transportUnitId: number;
    unitNumber:      string;
}


export interface Route {
    companyId:             Company;
    cronExpression:        string;
    routeDepartureTime:    Date;
    routeDestinationCity:  string;
    routeDestinationPlace: string;
    routeId:               number;
    routeImage:            string;
    routeName:             string;
    routeNotes:            string;
    statusId:              Status;
    stops:                 RouteStop[];
}

export interface RouteStop {
    estimatedTime: Date;
    lat:           number;
    lon:           number;
    route:         Route;
    routeStopId:   number;
    stopName:      string;
}

export interface ScheduleRoute {
    lstRouteEmployees: LstRouteEmployee[];
    lstRouteTransport: LstRouteTransport[];
    routeDate:         Date;
    routeId:           Route;
    routeType:         number;
    scheduleRouteId:   number;
}

export interface LstRouteEmployee {
    employeeId:           Employee;
    onBoard:              boolean;
    routeEmployeeId:      number;
    routeTransportUnitId: LstRouteTransport;
}

export interface Employee {
    accountId:         Account;
    companyId:         Company;
    employeeEmail:     string;
    employeeFirstName: string;
    employeeId:        number;
    employeeLastName:  string;
    employeeNumber:    string;
    employeePhone:     string;
    employeePhoto:     string;
    statusId:          Status;
    userId:            User;
    checked: boolean;
}

export interface Account {
    accountId:   number;
    accountName: string;
    companyId:   Company;
    statusId:    Status;
}


export interface LstRouteTransport {
    driverId:             Driver;
    endLat:               number;
    endLon:               number;
    endTime:              Date;
    routeTransportUnitId: number;
    startLat:             number;
    startLon:             number;
    startTime:            Date;
    transportUnitId:      TransportUnit;
}

export interface Driver {
    driverId:      number;
    driverLicense: string;
    driverPhoto:   string;
    statusId:      Status;
    userId:        User;
}

export interface Company {
    companyId:    number;
    companyName:  string;
    since:        Date;
    statusId:     Status;
    companyPhoto: null | string;
}

export interface Account {
    accountId:   number;
    accountName: string;
    companyId:   Company;
    statusId:    Status;
}

export interface RouteTransportUnit {
    driverId:             Driver;
    endLat:               number;
    endLon:               number;
    endTime:              Date;
    routeTransportUnitId: number;
    scheduleRouteId:      ScheduleRoute;
    startLat:             number;
    startLon:             number;
    startTime:            Date;
    transportUnitId:      TransportUnit;
}


