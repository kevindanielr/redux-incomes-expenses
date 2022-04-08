import { Component, HostBinding, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { UiServiceService } from '../../../shared/ui-service.service';
import { ListingAsignPage } from '../listing-asign/listing-asign.page';
import { RequestExpressPage } from '../request-express/request-express.page';
import { RouteService } from '../route.service';
import { listingExpressModel } from './listing-request-express.model';

@Component({
  selector: 'app-listing-express',
  templateUrl: './listing-express.page.html',
  styleUrls: [
    './styles/listing.-express.page.scss',
    './styles/listing.-express.shell.scss',
    './styles/listing.-express.ios.scss'
  ],
})
export class ListingExpressPage implements OnInit {

  listing: listingExpressModel;
  typeUser;
  companyId;
  showFilter = false;
  companys: any[] = [];
  accounts: any[] = [];
  searchQuery: string = "";
  flagAccount: boolean = false;
  userExpress: any;

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

  doRefresh(event) {
    this.ionViewWillEnter();
    event.target.complete();
  }
  
  ionViewWillEnter() {

    this.userExpress = JSON.parse(localStorage.getItem('userExpress')) || undefined;
    if (this.userExpress !== undefined) {
      this.typeUser = 6
      this.getRequestExpressUser();
    } else {
      this.typeUser = JSON.parse(localStorage.getItem('userData')).rolId?.rolId || undefined;
      this.getListingRequestExpress();
    }
  }

  // Obtiene elementos de la busqueda
  obtenerItems(ev: any) {
    // obtengo valor de la searchbar
    const val = ev.target.value;
    this.searchQuery = val;
  }
  
  // Funcion para obtener Request Express
  getListingRequestExpress() {
    this.listing = new listingExpressModel();

    this.routeService.getListingRequestExpress().subscribe( (resp: any)  => {
      this.listing = resp;
    });
  }

  // Funcion para obtener Request express por usuario express
  getRequestExpressUser() {
    this.listing = new listingExpressModel();

    this.routeService.getListingRequestExpressUser( this.userExpress?.expressUserId ).subscribe( (resp: any)  => {
      this.listing = resp;
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
    if (data?.refresh && this.userExpress !== undefined) {
      this.getRequestExpressUser();
     } else {
       this.getListingRequestExpress();
     }
  }

  // Eliminar solitud de servicio express
  async deleteRequest( requestExpressId ) {
    const toast = await this.toastCtrl.create({
      header: '¿Realmente desea eliminar la solicitud de servicio express?.',
      color: 'primary',
      mode: 'ios',
      position: 'bottom',
      buttons: [
        {
          icon: 'trash',
          text: 'Eliminar',
          handler: () => {
            this.routeService.onDeleteExpressRequest( requestExpressId ).subscribe( (resp: any) => {
              this.uiService.toastInformativo('Solicitud de servicio express removido.','success','save');
              this.getRequestExpressUser();
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
      header: '¿Realmente desea rechazar la solicitud de servicio express?.',
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

