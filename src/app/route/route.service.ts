import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataStore } from '../shell/data-store';
import { AccountModel, CompanyModel, RouteListingModel, scheduleRouteListingModel } from './listing/route-listing.model';
import { SheduleRouteModel } from './details/route-details.model';
import { TransferStateHelper } from '../utils/transfer-state-helper';
import { RouteEmployeeListingModel, RouteEquipmentListingModel } from './listing-user/listing-user.model';
import { listingAsignModel } from './listing-asign/listing-asign.model';
import { listingRequestDiurnoModel } from './listing-request-diurno/listing-request-diurno.model';
import { HttpService } from '../../shared/http.service';
import { listingExpressModel } from './listing-express/listing-request-express.model';

@Injectable()
export class RouteService {

  constructor(
    private http: HttpService
  ) { }

  //Funciones de Rutas

  // Obteniendo todas las rutas del aplicativo
  public getAllRoutes(): Observable<RouteListingModel> {
    const rawDataSource = this.http.get<RouteListingModel>('route')
    .pipe(
      map(
        (data: RouteListingModel) => {
          let dataTemp = {items: data}
          const response = new RouteListingModel();
          Object.assign(response, dataTemp);        
          return response;
        }
      )
    );
    return rawDataSource;
  }

  // Obteniendo todas las rutas agendadas por dia
  public getScheduleRoutesDay(companyId , date): Observable<scheduleRouteListingModel> {
    let yourDate = new Date()
    const offset = yourDate.getTimezoneOffset()
    yourDate = new Date(yourDate.getTime() - (offset*60*1000))
    date =  yourDate.toISOString().split('T')[0]     
    const rawDataSource = this.http.get<scheduleRouteListingModel>(`scheduleroute/lite/company/${ companyId }/date/${ date }`)
    .pipe(
      map(
        (data: scheduleRouteListingModel) => {
          let dataTemp = {items: data}
          const response = new scheduleRouteListingModel();
          Object.assign(response, dataTemp);        
          return response;
        }
      )
    );
    return rawDataSource;
  }

  // Obteniendo rutas agendadas por compañia
  public getScheduleRoutesCompany(companyId): Observable<scheduleRouteListingModel> {
    let yourDate = new Date()
    const offset = yourDate.getTimezoneOffset()
    yourDate = new Date(yourDate.getTime() - (offset*60*1000))
    let date =  yourDate.toISOString().split('T')[0]    
    
    const rawDataSource = this.http.get<scheduleRouteListingModel>(`scheduleroute/lite/company/${ companyId }/date/${ date }`)
    .pipe(
      map(
        (data: scheduleRouteListingModel) => {
          let dataTemp = {items: data}
          const response = new scheduleRouteListingModel();
          Object.assign(response, dataTemp);        
          return response;
        }
      )
    );
    return rawDataSource;
  }

   // Obteniendo todas las rutas agendadas
   public getScheduleRoutes(): Observable<scheduleRouteListingModel> {
    let yourDate = new Date()
    const offset = yourDate.getTimezoneOffset()
    yourDate = new Date(yourDate.getTime() - (offset*60*1000))
    let date =  yourDate.toISOString().split('T')[0]    
    
    const rawDataSource = this.http.get<scheduleRouteListingModel>(`scheduleroute/lite/date/${ date }`)
    .pipe(
      map(
        (data: scheduleRouteListingModel) => {
          let dataTemp = {items: data}
          const response = new scheduleRouteListingModel();
          Object.assign(response, dataTemp);        
          return response;
        }
      )
    );
    return rawDataSource;
  }

  // Obteniendo rutas a las que se unio el user por dia
  public getUserScheduleRoutes(employeeId, date): Observable<scheduleRouteListingModel> {
    let yourDate = new Date()
    const offset = yourDate.getTimezoneOffset()
    yourDate = new Date(yourDate.getTime() - (offset*60*1000))
    date =  yourDate.toISOString().split('T')[0]  
    const rawDataSource = this.http.get<scheduleRouteListingModel>(`routeemployee/lite/employee/${employeeId}/date/${ date }`)
    .pipe(
      map(
        (data: scheduleRouteListingModel) => {
          let dataTemp = {items: data}
          const response = new scheduleRouteListingModel();
          Object.assign(response, dataTemp);        
          return response;
        }
      )
    );
    return rawDataSource;
  }

  // Obteniendo detalle de una ruta agendada
  public getDetailsScheduleRoute(routeId): Observable<SheduleRouteModel> {
    const rawDataSource = this.http.get<SheduleRouteModel>(`scheduleroute/lite/${routeId}`)
    .pipe(
      map(
        (data: SheduleRouteModel) => {
          const response = new SheduleRouteModel();
          Object.assign(response, data);        
          return response;
        }
      )
    );
    return rawDataSource;
  }

  // Obteniendo compañias de todo el aplicativo
  public getCompanys(): Observable<CompanyModel[]> {
    const rawDataSource = this.http.get<CompanyModel[]>(`company/lite`);
    return rawDataSource;
  }

  // Obteniendo cuentas por compañia
  public getAccount( companyId ): Observable<AccountModel[]> {
    const rawDataSource = this.http.get<AccountModel[]>(`account/company/noreferences/${ companyId }`);
    return rawDataSource;
  }

  // Obteniendo lista de empleados inscritos en ruta agendada
  public getListRouteEmployee( scheduleRouteId ): Observable<RouteEmployeeListingModel> {

    const rawDataSource = this.http.get<RouteEmployeeListingModel>(`routeemployee/scheduleroute/noreferences/${ scheduleRouteId }`)
    .pipe(
      map(
        (data: RouteEmployeeListingModel) => {
          let dataTemp = {items: data}
          const response = new RouteEmployeeListingModel();
          Object.assign(response, dataTemp);        
          return response;
        }
      )
    );
    return rawDataSource;
  }

  
  // Obteniendo lista de equipos inscritos en ruta agendada
  public getListRouteEquipment( requestRouteId ): Observable<RouteEquipmentListingModel> {

    const rawDataSource = this.http.get<RouteEquipmentListingModel>(`equipment/requestroute/${requestRouteId}`)
    .pipe(
      map(
        (data: RouteEquipmentListingModel) => {
          let dataTemp = {items: data}
          const response = new RouteEquipmentListingModel();
          Object.assign(response, dataTemp);        
          return response;
        }
      )
    );
    return rawDataSource;
  }
  
  // Funcion que guarda un Empleado a una ruta agendada
  onSaveRouteEmployee( numberEmployee, data ) {
    return this.http.post<RouteEmployeeListingModel>(`routeemployee/employeeNumber/${ numberEmployee }`, data)
  }

  // Funcion que borra empleado de una ruta agendada
  onDeleteRouteEmployee(scheduleRouteId, employeeId) {
    return this.http.delete(`routeemployee/scheduleRoute/${ scheduleRouteId }/employee/${ employeeId }`);
  }

  // Funcion que borra equipo de una ruta agendada
  onDeleteRouteEquipment(equipmentId) {
    return this.http.delete(`equipment/${equipmentId}`);
  }

  // Funcion para borrar solicitud de ruta
  onDeleteRequestDiurno( routeRequestId ) {
    return this.http.delete(`routerequest/${ routeRequestId }`);
  }

  // Funcion que obtiene transporte de una ruta agendada
  public getRouteTransportUnit( scheduleRouteId ): Observable<listingAsignModel> {

    const rawDataSource = this.http.get<listingAsignModel>(`routetransportunit/lite/scheduleroute/${ scheduleRouteId }`)
    .pipe(
      map(
        (data: listingAsignModel) => {
          let dataTemp = {items: data}
          const response = new listingAsignModel();
          Object.assign(response, dataTemp);        
          return response;
        }
      )
    );
    return rawDataSource;
  }

  // Funcion que obtiene transporte de una ruta agendada sin formato de lista, para usar en select
  public getRouteTransportUnitSelect( scheduleRouteId ) {
    return this.http.get(`routetransportunit/lite/scheduleroute/${ scheduleRouteId }`)
  }

  // Funcion para obtener todas las rutas agendadas del sistema por dia
  public getDriverRoutes(driverId , date): Observable<scheduleRouteListingModel> {
    let yourDate = new Date()
    const offset = yourDate.getTimezoneOffset()
    yourDate = new Date(yourDate.getTime() - (offset*60*1000))
    date =  yourDate.toISOString().split('T')[0]   
    const rawDataSource = this.http.get<scheduleRouteListingModel>(`routetransportunit/lite/driver/${ driverId }/date/${ date }`)
    .pipe(
      map(
        (data: scheduleRouteListingModel) => {
          let dataTemp = {items: data}
          const response = new scheduleRouteListingModel();
          Object.assign(response, dataTemp);        
          return response;
        }
      )
    );
    return rawDataSource;
  }

  // Funcion para borrar ruta de transporte asignada a ruta agendada
  onDeleteRouteTransportUnit ( routeTransportUnitId ) {
    return this.http.delete(`routetransportunit/${routeTransportUnitId}`);
  }

  // Funcion para borrar solicitud de servicio Express
  onDeleteExpressRequest ( requestExpressId ) {
    return this.http.delete(`expressrequest/${requestExpressId}`);
  }


  // Obtener lista de empleados para asignados y no asignados
  getNumberEmployeeRoute( scheduleRouteId, assigned ) {
    return this.http.get(`routeemployee/lite/scheduleroute/${ scheduleRouteId }/assigned/${ assigned }`);
  }

  // Obtener lista de equipos aignados y no asignados
  getNumberEquipmentRoute( scheduleRouteId, assigned ) {
    return this.http.get((`equipment/scheduleroute/${scheduleRouteId}/assigned/${assigned}`));
  }

  // Funcion para obtener motoristas por status
  getDrivers( statusId ) {
    return this.http.get(`driver/status/${ statusId }`);
  }

  // Funcion para obtener unidades de transporte
  getTransportUnit( statusId ) {
    return this.http.get(`transportunit/status/${ statusId }`);
  }

  // Funcion para aprobar lista agendada
  approvedList( scheduleRouteId, approved ) {
    return this.http.get(`scheduleroute/${ scheduleRouteId }/approved/${ approved }`);
  }

  // Funcion para unirse a ruta agendada
  joinRouteEmployee(data) {
    return this.http.post(`routeemployee`, data);
  }

  // Asignacion de la ruta con unidad de transporte y conductor
  asignRouteTransportDriver(data) {
    return this.http.post(`routetransportunit`, data);
  }

  // Actualizacion de asignacion de la ruta con unidad de transporte y conductor
  updateAsignRouteTransportDriver(data) {
    return this.http.put(`routetransportunit`, data);
  }

  // Actualizacion de asignacion de la ruta con unidad de transporte y conductor
  asignNovedadesListCheck(data) {
    return this.http.put(`routeemployee/notes`, data);
  }


  // Funcion que obtiene empleados que estan en la unidad de transporte
  getListAsignEmployee(scheduleRouteId, routeUnitTransportId) {
    return this.http.get(`routeemployee/lite/scheduleroute/${scheduleRouteId}/routetransportunit/${routeUnitTransportId}`);
  }

  // Funcion que obtiene equipos que estan en la unidad de transporte
  getListAsignEquipment(requestRouteId) {
    return this.http.get(`equipment/requestroute/${requestRouteId}`);
  }

   // Funcion que obtiene equipos que estan en la unidad de transporte
   getEquipmentCheck(scheduleRouteId, routeTransportUnitId) {
    return this.http.get(`equipment/scheduleRoute/${scheduleRouteId}/routeTransport/${routeTransportUnitId}`);
  }

  // Funcion que obtiene equipos que estan en la unidad de transporte para lista de chequeo
  public getListAsignEquipmentCheck( routeTransportUnitId ): Observable<RouteEquipmentListingModel> {

    const rawDataSource = this.http.get<RouteEquipmentListingModel>(`equipment/routeTransportUnit/${routeTransportUnitId}`)
    .pipe(
      map(
        (data: RouteEquipmentListingModel) => {
          let dataTemp = {items: data}
          const response = new RouteEquipmentListingModel();
          Object.assign(response, dataTemp);        
          return response;
        }
      )
    );
    return rawDataSource;
  }

  // Funcion que obtiene empleados que estan en la unidad de transporte para lista de chequeo
  public getListRouteCheck( scheduleRouteId, routeUnitTransportId ): Observable<RouteEmployeeListingModel> {

    const rawDataSource = this.http.get<RouteEmployeeListingModel>(`routeemployee/lite/scheduleroute/${scheduleRouteId}/routetransportunit/${routeUnitTransportId}`)
    .pipe(
      map(
        (data: RouteEmployeeListingModel) => {
          let dataTemp = {items: data}
          const response = new RouteEmployeeListingModel();
          Object.assign(response, dataTemp);        
          return response;
        }
      )
    );
    return rawDataSource;
  }

  // Funcion que guarda los Id de los empleados que van en una ruta asignada
  onSaveListRouteEmployee( scheduleRouteId, routeTransportUnitId, data ) {
    return this.http.post(`routeemployee/scheduleRoute/${ scheduleRouteId }/routeTransport/${ routeTransportUnitId }`, data);
  }

  // Funcion que guarda los Id de los equipos que van en una ruta asignada
  onSaveListEquipmentEmployee( scheduleRouteId, routeTransportUnitId, data ) {
    return this.http.post(`equipment/scheduleRoute/${scheduleRouteId}/routeTransport/${routeTransportUnitId}`, data);
  }

  // Funcion que sirve para checkear el empleado que se subio a la ruta
  onCheckListRouteEmployee( numberEmployee, scheduleRouteId, flag ) {
    return this.http.get(`routeemployee/board/employeeNumber/${numberEmployee}/scheduleRoute/${scheduleRouteId}/${ flag }`);
  }

  // Funcion que sirve para empezar Ruta
  startRoute( data ) {
    return this.http.post(`routetransportunit/startRide`, data);
  }

  // Funcion que sirve para finalizar Ruta
  endRoute( data ) {
    return this.http.post(`routetransportunit/finishRide`, data);
  }

  // Funcion que sirve para empezar Ruta Express
  startRouteExpress( data ) {
    return this.http.post(`expressrequest/startRide`, data);
  }

  // Funcion que sirve para finalizar Ruta Express
  endRouteExpress( data ) {
    return this.http.post(`expressrequest/endRide`, data);
  }

  // Funcion para obtener todas las solicitudes de servicio diurno
  getRouteRequest() {
    return this.http.get(`routerequest`);
  }

  // funcion que obtiene la lista de Solicitudes Diurnas
  public getListingRequestDiurno(): Observable<listingRequestDiurnoModel> {
    const rawDataSource = this.http.get<listingRequestDiurnoModel>('routerequest')
    .pipe(
      map(
        (data: listingRequestDiurnoModel) => {
          let dataTemp = {items: data}
          const requestsDiurno = new listingRequestDiurnoModel();
          Object.assign(requestsDiurno, dataTemp);        
          return requestsDiurno;
        }
      )
    );

    return rawDataSource;
  }


  // funcion que obtiene la lista de Solicitudes Diurnas
  public getListingRequestExpress(): Observable<listingExpressModel> {
    const rawDataSource = this.http.get<listingExpressModel>('expressrequest')
    .pipe(
      map(
        (data: listingExpressModel) => {
          let dataTemp = {items: data}
          const requestExpress = new listingExpressModel();
          Object.assign(requestExpress, dataTemp);        
          return requestExpress;
        }
      )
    );

    return rawDataSource;
  }

  // funcion que obtiene la lista de Solicitudes Diurnas por compañia
  public getListingRequestDiurnoCompany(companyId): Observable<listingRequestDiurnoModel> {
    const rawDataSource = this.http.get<listingRequestDiurnoModel>(`routerequest/company/${companyId}`)
    .pipe(
      map(
        (data: listingRequestDiurnoModel) => {
          let dataTemp = {items: data}
          const requestsDiurno = new listingRequestDiurnoModel();
          Object.assign(requestsDiurno, dataTemp);        
          return requestsDiurno;
        }
      )
    );

    return rawDataSource;
  }

  // funcion que obtiene la lista de Solicitudes Express por userExpress
  public getListingRequestExpressUser(userId): Observable<listingExpressModel> {
    const rawDataSource = this.http.get<listingExpressModel>(`expressrequest/user/${userId}`)
    .pipe(
      map(
        (data: listingExpressModel) => {
          let dataTemp = {items: data}
          const requestExpress = new listingExpressModel();
          Object.assign(requestExpress, dataTemp);        
          return requestExpress;
        }
      )
    );

    return rawDataSource;
  }

  // Funcion para obtener tipos de de viaje
  getTypeTrip() {
    return this.http.get(`triptype`);
  }

  // Funcion para obtener rutas de una empresa
  getRoutesCompany( companyId ) {
    return this.http.get(`route/lite/company/${companyId}`);
  }

  // Funcion para obtener rutas de todas las empresas
  getRoutesAllCompany() {
    return this.http.get(`route`);
  }

  // Funcion que guarda una solicitud de servicio Diurno
  onSaveRequestRoute( data ) {
    return this.http.post(`routerequest`, data);
  }

  // Funcion que guarda una solicitud de servicio Express
  onSaveRequestExpress( data ) {
    return this.http.post(`expressrequest`, data);
  }

  // Funcion que guarda una solicitud de servicio Diurno
  onUpdateRequestRoute( data ) {
    return this.http.put(`routerequest`, data);
  }

  // Funcion que guarda una solicitud de servicio Express
  onUpdateRequestExpress( data ) {
    return this.http.put(`expressrequest`, data);
  }

  // Funcion para obtener usuario Express
  getExpressUser( identifier ) {
    return this.http.get(`expressuser/identifier/${identifier}`);
  }

  getExpressUserbyId( expressUserId ) {
    return this.http.get(`expressuser/${expressUserId}`);
  }

  // Actualizar deviceId para recibir notificaciones
  onUpdateDevice (data) {
    return this.http.put(`user/device`, data);
  }

  // Función para buscar a empleado
  getSearchEmployee(companyId, employeeNumber) { 
    return this.http.get(`employee/company/${companyId}/employeeNumber/${employeeNumber}`);
  }

  // Funcion para obtener equipo en ruta asignada
  getEquipmentRouteAsign(requestRouteId) {
    return this.http.get(`equipment/requestroute/${requestRouteId}`);
  }

  // Función para obtener rutas de solicitudes Express
  getExpressRequestDriver(driverId) {
    let yourDate = new Date()
    const offset = yourDate.getTimezoneOffset()
    yourDate = new Date(yourDate.getTime() - (offset*60*1000))
    let date =  yourDate.toISOString().split('T')[0];   
    return this.http.get(`expressrequest/driver/${driverId}/date/${date}`);
  }

   // Función para buscar a empleado
   getSearchEmployeeRoute(employeeNumber) {
    let yourDate = new Date()
    const offset = yourDate.getTimezoneOffset()
    yourDate = new Date(yourDate.getTime() - (offset*60*1000))
    let date =  yourDate.toISOString().split('T')[0];       
    return this.http.get(`routeemployee/lite/employeeNumber/${employeeNumber}/date/${date}`);
  }

  // Funcion que guarda equipo en request diurno
  onSaveEquipment( data ) {
    return this.http.post(`equipment`, data);
  }

  // Funcion que guarda equipo en request diurno
  verifyEquipment( data ) {
    return this.http.put(`equipment/verify`, data);
  }

  // Funcion que actualiza el perfil del usuario
  onSaveUser( data ) {
    return this.http.put(`user`, data);
  }

  onSaveEmployee( data ) {
    return this.http.put(`employee`, data);
  }

  // Funcion para obtener unidades de transporte
  getDetailExpressRequest( expressRequestId ) {
    return this.http.get(`expressrequest/${expressRequestId}`);
  }

  getListRouteUser( companyId ) {

    let yourDate = new Date()
    const offset = yourDate.getTimezoneOffset()
    yourDate = new Date(yourDate.getTime() - (offset*60*1000))
    let date =  yourDate.toISOString().split('T')[0];    

    return this.http.get(`scheduleroute/lite/aggregate/company/${companyId}/date/${date}`);
  }

  getDataScheduleRoute( scheduleRouteId ) {
    return this.http.get(`scheduleroute/lite/${scheduleRouteId}`);
  }

  getExpressUserPhone( phone ) {
    return this.http.get(`expressuser/phone/${phone}`);
  }

  getRoutesScheduleDay( ) {
    let yourDate = new Date()
    const offset = yourDate.getTimezoneOffset()
    yourDate = new Date(yourDate.getTime() - (offset*60*1000))
    let date =  yourDate.toISOString().split('T')[0]; 
    return this.http.get(`scheduleroute/litenp/date/${date}`);
  }

  getRoutesLite( ) {
    return this.http.get(`route/lite`);
  }

  searchEmployee(employeeNumber ) {
    return this.http.get(`employee/employeeNumber/${employeeNumber}`);
  }

}

