import { Component, OnInit, HostBinding } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ListingAsignPage } from '../listing-asign/listing-asign.page';
import { UserListingPage } from '../listing-user/listing-user.page';
import { RequestDiurnoPage } from '../request-diurno/request-diurno.page';
import { RouteService } from '../route.service';
import { listingRequestDiurnoModel } from './listing-request-diurno.model';
import { UiServiceService } from '../../../shared/ui-service.service';

@Component({
  selector: 'app-listing-request-diurno',
  templateUrl: './listing-request-diurno.page.html',
  styleUrls: [
    './styles/listing.-request-diurno.page.scss',
    './styles/listing.-request-diurno.shell.scss',
    './styles/listing.-request-diurno.ios.scss'
  ],
})
export class ListingRequestDiurnoPage implements OnInit {

  listing: listingRequestDiurnoModel;
  typeUser;
  companyId;
  showFilter = false;
  companys: any[] = [];
  accounts: any[] = [];
  searchQuery: string = "";
  flagAccount: boolean = false;

  @HostBinding('class.is-shell') get isShell() {
    return (this.listing && this.listing.isShell) ? true : false;
  }

  constructor(
    private routeService: RouteService,
    private modalCtrl: ModalController,
    private uiService: UiServiceService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit(): void {

  }
  
  ionViewWillEnter() {
    this.typeUser = JSON.parse(localStorage.getItem('userData')).rolId?.rolId || undefined;
    
    if (this.typeUser === 1 || this.typeUser === 2 ) {// Condicion si es user 1 - Callcenter. 2 - Coordinador
      this.companyId = JSON.parse(localStorage.getItem('employeeData')).companyId?.companyId || undefined;
      this.getRequestDiurnosCompany(); 
    } else if (this.typeUser === 5) {//5- Es conductor
      
    } else {
      this.getRequestDiurnos();
      this.getCompanys();
    }
  }

  doRefresh(event) {
    this.ionViewWillEnter();
    event.target.complete();
  }


  // Obtiene elementos de la busqueda
  obtenerItems(ev: any) {
    // obtengo valor de la searchbar
    const val = ev.target.value;
    this.searchQuery = val;
  }
  
  // Funcion para obtener Request Diurnos
  getRequestDiurnos() {
    this.listing = new listingRequestDiurnoModel();

    this.routeService.getListingRequestDiurno().subscribe( (resp: any)  => {
      this.listing = resp;
    });
  }

  // Funcion para obtener Request Diurnos por compañia
  getRequestDiurnosCompany() {
    this.listing = new listingRequestDiurnoModel();

    this.routeService.getListingRequestDiurnoCompany( this.companyId ).subscribe( (resp: any)  => {
      this.listing = resp;
    });
  }

   // Funcion para obtener todas las compañias
   getCompanys() {
    this.routeService.getCompanys().subscribe( (resp: any) => {
      this.companys = resp;
      if (this.companys.length > 0) {
        this.companyId = this.companys[0].companyId;
      }
    });
  }

  // Funcion para cambiar compañia
  changeCompany( event ) {
    this.flagAccount = false;
    this.companyId = event.detail.value;
    this.getAccountsCompany(event.detail.value);
    this.getRequestDiurnosCompany();// Obteniendo solicitudes diurnas
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

  // Abrir modal de lista de usuarios
  async openModalAsignRoute(){
    const modal = await this.modalCtrl.create({
      component: ListingAsignPage,
      componentProps: {
        // incidencia: incidencia
      }
    });

    await modal.present();
  }


  async openModalRequestDiurno( scheduleRouteId?, isSaveRequest?, dataRequest? ) {
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
        // routeTransportUnitId
      },
      id: 'requestDiurno'
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data?.refresh) {
      if (this.typeUser === 1 || this.typeUser === 2) {// 1 -Callcenter, 2 - Coordiandor CC
        this.getRequestDiurnosCompany();
      } else {
        this.getRequestDiurnos();
      }
     }
  }

  // Eliminar solitud de servicio diurno
  async deleteRequest( routeRequestId ) {
    const toast = await this.toastCtrl.create({
      header: '¿Realmente desea eliminar la solicitud de servicio diurno?.',
      color: 'primary',
      mode: 'ios',
      position: 'bottom',
      buttons: [
        {
          icon: 'trash',
          text: 'Eliminar',
          handler: () => {
            this.routeService.onDeleteRequestDiurno( routeRequestId ).subscribe( (resp: any) => {
              this.uiService.toastInformativo('Solicitud de servicio diurno removido.','success','save');
              this.getRequestDiurnosCompany();
            }, error => {
              this.uiService.toastInformativo('Error al intentar remover la solicitud, intentelo de nuevo.','danger','warning');
            })

          }
        },
         {
          text: 'x',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    toast.present();
  }

   // Eliminar solitud de servicio diurno
   async rechazarRequest( ) {
    const toast = await this.toastCtrl.create({
      header: '¿Realmente desea rechazar la solicitud de servicio diurno?.',
      color: 'primary',
      mode: 'ios',
      position: 'bottom',
      buttons: [
        {
          icon: 'ban',
          text: 'Rechazar',
          handler: () => {
            // this.routeService.onDeleteRouteEmployee( this.details?.scheduleRouteId, this.employeeId ).subscribe( (resp: any) => {
            //   this.uiService.toastInformativo('Usuario removido de la lista de empleados.','success','save');
            //   this.getDetailRoute();
            // }, error => {
            //   this.uiService.toastInformativo('Error al intentar salirse de la ruta, intentelo de nuevo.','danger','warning');
            // })

          }
        },
         {
          text: 'x',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    toast.present();
  }

}
