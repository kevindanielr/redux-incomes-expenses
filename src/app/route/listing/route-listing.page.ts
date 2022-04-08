import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { UiServiceService } from '../../../shared/ui-service.service';
import { RouteDetailsPage } from '../details/route-details.page';
import { RequestDiurnoPage } from '../request-diurno/request-diurno.page';
import { RequestExpressPage } from '../request-express/request-express.page';
import { RouteService } from '../route.service';
import { scheduleRouteListingModel } from './route-listing.model';

@Component({
  selector: 'app-route-listing',
  templateUrl: './route-listing.page.html',
  styleUrls: [
    './styles/route-listing.page.scss',
    './styles/route-listing.shell.scss',
    './styles/route-listing.ios.scss'
  ]
})
export class RouteListingPage implements OnInit {
  // Gather all component subscription in one place. Can be one Subscription or multiple (chained using the Subscription.add() method)
  showFilter = false;
  listing: scheduleRouteListingModel;
  typeUser: any = 1;// Por defecto 1- Usuario Callcenter
  flagAccount: boolean = true;
  companys: any = [];
  accounts: any = [];
  expressRequest: any[] = [];
  searchQuery: string = "";

  dateToday = new Date();
  companyId: number;
  employeeId: number;
  driverId: number;
  isMyRoute: boolean = false;

  sliderOptions = {
    allowSlidePrev: false,
    allowSlideNext: false
  }

  @HostBinding('class.is-shell') get isShell() {
    return (this.listing && this.listing.isShell) ? true : false;
  }

  constructor(
    private routeService: RouteService,
    private modalCtrl: ModalController,
    private router: Router,
    private uiService: UiServiceService
  ) { }

  ngOnInit(): void {
  }

  ionViewWillEnter() {    
    // Obteniendo tipo de Usuario    
    this.typeUser = JSON.parse(localStorage.getItem('userData')).rolId.rolId || undefined;
    this.companyId = JSON.parse(localStorage.getItem('employeeData'))?.companyId?.companyId || undefined;
    this.employeeId = JSON.parse(localStorage.getItem('employeeData'))?.employeeId || undefined;
    this.driverId = JSON.parse(localStorage.getItem('driverData'))?.driverId || undefined;     

    // si el Usuario escogio "Mis rutas"
    this.isMyRoute = this.router.url.includes('my-route');
    if (this.isMyRoute) {
      if (this.typeUser === 5) {// 5 -Rol de Conductor
        this.getDriverRoutes();
        this.getExpressRequestDriver();
      } else {
        this.getUserScheduleRoutes();// Peticion de rutas inscritas por el usuario
      }

    } else {

      // // Si es Usuario Operador Shalom
      // if (this.typeUser === 4 || this.typeUser === 3) {// 4 -Operador Shalom / 3 - Supervisor
      //   this.getCompanys();// Obteniendo todas las compañias
      // } else { // Si es usuario Coordinador, Callcenter
      //   this.getScheduleRoutesCompany();// Obteniendo Rutas por compañia
      // }

      // Cambios: Peticion para traer todas las rutas del sistema, cualquier usuario se puede registrar a cualquier ruta
      this.getScheduleRoutes();
    }

  }

  doRefresh(event) {
    this.ionViewWillEnter();
    event.target.complete();
  }

  ionViewDidEnter() { 
  }

  // Obtiene elementos de la busqueda
  obtenerItems(ev: any) {
    // obtengo valor de la searchbar
    const val = ev.target.value;
    this.searchQuery = val;
  }

   // Funcion para obtener todas las rutas agendadas del sistema por dia y compañia
   getScheduleRoutesCompanyDate() {
    this.listing = new scheduleRouteListingModel();// Creando objeto vacio, para loading
    this.routeService.getScheduleRoutesDay( this.companyId , this.dateToday ).subscribe( resp => {
      this.listing = resp;          
    });
  }

  getExpressRequestDriver() {
    this.routeService.getExpressRequestDriver( this.driverId ).subscribe( (resp: any) => {
      this.expressRequest = resp;
      console.log(this.expressRequest);
                
    });
  }

  // Funcion para obtener todas las rutas asignadas de usuario conductor
  getDriverRoutes() {
    this.listing = new scheduleRouteListingModel();// Creando objeto vacio, para loading
    this.routeService.getDriverRoutes( this.driverId , this.dateToday ).subscribe( resp => {
      this.listing = resp;          
    });
  }

  // Funcion para obtener todas las rutas agendadas por compañia
  getScheduleRoutesCompany() {
    this.listing = new scheduleRouteListingModel();// Creando objeto vacio, para loading
    this.routeService.getScheduleRoutesCompany(this.companyId).subscribe( resp => {
      this.listing = resp;          
    });
  }

  // Funcion para obtener todas las rutas agendadas
  getScheduleRoutes() {
    this.listing = new scheduleRouteListingModel();// Creando objeto vacio, para loading
    this.routeService.getScheduleRoutes().subscribe( resp => {
      this.listing = resp;          
    });
  }

  // Funcion para obtener todas las rutas a las que se unio el user
  getUserScheduleRoutes() {
    this.listing = new scheduleRouteListingModel();// Creando objeto vacio, para loading
    this.routeService.getUserScheduleRoutes(this.employeeId, this.dateToday).subscribe( resp => {
      this.listing = resp;
    });
  }

  // Funcion para obtener todas las compañias
  getCompanys() {
    this.routeService.getCompanys().subscribe( (resp: any) => {
      this.companys = resp;
      if (this.companys.length > 0) {
        this.companyId = this.companys[0].companyId;
        this.getScheduleRoutesCompany();// Obteniendo rutas por dia
      }
    });
  }

  // Funcion para obtener todas las compañias
  getAccountsCompany( companyId ) {
    this.routeService.getAccount( companyId ).subscribe( (resp: any) => {
      this.accounts = resp;
    }, error => {
      console.log(error);
      this.accounts = [];
      this.flagAccount = true;
    });
  }

  // Funcion para cambiar compañia
  changeCompany( event ) {
    this.flagAccount = false;
    this.companyId = event.detail.value;
    this.getAccountsCompany(event.detail.value);
    this.getScheduleRoutesCompany();// Obteniendo rutas por dia
  }

  // Abrir modal de detalle de Ruta
  async showRoute( scheduleRouteId, routeTransportUnitId ){
    
    if (scheduleRouteId === undefined) {
      this.uiService.toastInformativo('Aún no puedes seleccionar, espera que carguen las opciones.','primary','information-circle-outline');
      return;
    }
    
    const modal = await this.modalCtrl.create({
      component: RouteDetailsPage,
      componentProps: {
        scheduleRouteId,
        routeTransportUnitId
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.refresh) {
      this.getScheduleRoutes();
     }

  }

  // Abrir modal de detalle de Ruta
  async openModalRequestDiurno( scheduleRouteId?, isSaveRequest?, dataRequest?, routeTransportUnitId? ) {
    if ((scheduleRouteId === undefined || scheduleRouteId === null) && isSaveRequest !== false) {
      this.uiService.toastInformativo('Aún no puedes seleccionar, espera que carguen las opciones.','primary','information-circle-outline');
      return;
    }
    
    const modal = await this.modalCtrl.create({
      component: RequestDiurnoPage,
      componentProps: {
        scheduleRouteId,
        isSaveRequest,
        dataRequest,
        routeTransportUnitId
      },
      id: 'requestDiurno'
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data?.refresh) {
      // if (this.typeUser === 1 || this.typeUser === 2) {// 1 -Callcenter, 2 - Coordiandor CC
      //   this.getRequestDiurnosCompany();
      // } else {
      //   this.getRequestDiurnos();
      // }
     }
  }

  async openModalRequestExpress( scheduleRouteId?, isSaveRequest?, dataRequest? ) {
    if (scheduleRouteId === undefined && isSaveRequest !== false) {
      this.uiService.toastInformativo('Aún no puedes seleccionar, espera que carguen las opciones.','primary','information-circle-outline');
      return;
    }
    const modal = await this.modalCtrl.create({
      component: RequestExpressPage,
      componentProps: {
        scheduleRouteId,
        isSaveRequest,
        dataRequest
      },
      id: 'requestDiurno'
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
    // if (data?.refresh && this.userExpress !== undefined) {
    //   this.getRequestExpressUser();
    //  } else {
    //    this.getListingRequestExpress();
    //  }
  }

}
