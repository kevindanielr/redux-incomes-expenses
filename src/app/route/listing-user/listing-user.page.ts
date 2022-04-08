import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { RouteEmployeeListingModel } from './listing-user.model';
import { RouteService } from '../route.service';
import { ActionSheetController, AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { UiServiceService } from '../../../shared/ui-service.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-listing-user',
  templateUrl: './listing-user.page.html',
  styleUrls: [
    './styles/listing-user.page.scss',
    './styles/listing-user.shell.scss',
    './styles/listing-user.ios.scss',
    './styles/listing-user.md.scss'
  ]
})
export class UserListingPage implements OnInit {
  // Gather all component subscription in one place. Can be one Subscription or multiple (chained using the Subscription.add() method)
  subscriptions: Subscription;

  data: RouteEmployeeListingModel;
  filter: RouteEmployeeListingModel;

  @Input() scheduleRouteId: string;
  @Input() dataRoute: any;

  segmentValue = 'friends';
  friendsList: Array<any>;
  followersList: Array<any>;
  followingList: Array<any>;
  searchQuery = '';
  showFilters = false;
  loading: any;

  sliderOptions = {
    allowSlidePrev: false,
    allowSlideNext: false
  }

  @HostBinding('class.is-shell') get isShell() {
    return (this.data && this.data.isShell) ? true : false;
  }

  constructor(
    private routeService: RouteService,
    private modalCtrl: ModalController,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private uiService: UiServiceService,
    private barcodeScanner: BarcodeScanner,
    private toastCtrl: ToastController,
    private loadingController: LoadingController
    ) { }

  ngOnInit(): void {
    this.getListRouteEmployee();
  }

  doRefresh(event) {
    this.ngOnInit();
    event.target.complete();
  }


  segmentChanged(ev): void {
    this.segmentValue = ev.detail.value;

    // Check if there's any filter and apply it
    this.searchList();
  }

  searchList(): void {
    const query = (this.searchQuery && this.searchQuery !== null) ? this.searchQuery : '';
    this.data.items = this.filterList(this.data.items, query);
  }

  filterList(list, query): Array<any> {
    if (query !== '') {
      return list.filter(item => {
        let nameComplete = item.employeeId.employeeFirstName + ' ' + item.employeeId.employeeLastName;
        return nameComplete.toLowerCase().includes(query.toLowerCase())
      });
    } else {
      return this.filter.items;
    }
  }

  // Funcion que obtiene los usuarios inscritos en ruta agendada
  getListRouteEmployee() {
    this.data = new RouteEmployeeListingModel();
    this.filter = new RouteEmployeeListingModel();
    this.routeService.getListRouteEmployee(this.scheduleRouteId).subscribe( state => {
      this.data = state;
      this.filter = state;
    });  
  }

  // Función para cerrar modal
  closeModal(){
    this.modalCtrl.dismiss();
  }

  // Función para abrir menu action-sheet
  async openOptions() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Escanear código de barra',
          icon: 'barcode-outline',
          cssClass: 'action-dark',
          handler: () => {
            this.openScanBar();
          }
        },
        {
          text: 'Agregar por código de empleado',
          icon: 'id-card-outline',
          cssClass: 'action-dark',
          handler: () => {
            this.alertSaveUser();
          }
        },
        {
          text: 'Cancelar',
          icon: 'arrow-back',
          cssClass: 'action-dark',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  // Funcion para abrir Alert de ID de Empleado
  async alertSaveUser() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'No. ID de Empleado',
      inputs: [
        {
          name: 'employeeId',
          type: 'text',
          placeholder: 'ID'
        },
      ],
      buttons: [
        {
          text: 'AGREGAR',
          handler: ( data ) => {
            if (data.employeeId === '') {
              this.uiService.toastInformativo('Ingrese un número de identificación del empleado','warning','warning');
              return;
            }
            this.onSaveRouteEmployee( data.employeeId );
          }
        },{
          text: 'CANCELAR',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }
      ]
    });

    await alert.present();
  }
  

  // Funcion para agregar empleado a la lista de ruta agendada
  onSaveRouteEmployee( numberEmployee ) {
    let data = {
      "scheduleRouteId": {
        "scheduleRouteId": this.scheduleRouteId // ID de Ruta agendada
      }
    };
    this.presentLoading();
    this.routeService.onSaveRouteEmployee(numberEmployee, data).subscribe( (resp: any) => {

      if (resp?.code === '409') {
        this.uiService.toastInformativo(resp.message,'warning','warning');
        return;
      }

      this.getListRouteEmployee();
      this.loading.dismiss();
      this.uiService.toastInformativo('Empleado agregado a la lista de la ruta.','success','save');
    }, error => {
      this.loading.dismiss();
      if (error.status === 409) {
        this.uiService.toastInformativo('El empleado ya ha sido agregado a la lista, intente con otro número de identificación.','warning','warning');
      } else {
        this.uiService.toastInformativo('No se encontro el número de identificación del empleado, intentelo nuevamente.','danger','warning');
      }
      
    });
  }

  // Eliminar empleado de la lista
  async deleteEmployee( employeeId ) {
    const toast = await this.toastCtrl.create({
      header: '¿Realmente desea remover de la lista?.',
      color: 'danger',
      mode: 'ios',
      position: 'bottom',
      buttons: [
        {
          icon: 'trash',
          text: 'Eliminar',
          handler: () => {

            this.routeService.onDeleteRouteEmployee( this.scheduleRouteId, employeeId ).subscribe( (resp: any) => {
              this.getListRouteEmployee();
              this.uiService.toastInformativo('Empleado removido de la ruta.','success','save');
            }, error => {
              this.uiService.toastInformativo('Error al intentar eliminar el registro, intentelo de nuevo','danger','warning');
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

  // Funcion que abre camara y extrae código de barra
  openScanBar() {
    this.barcodeScanner.scan().then(barcodeData => {
      if (barcodeData.text !== '') {
        this.onSaveRouteEmployee(barcodeData.text);
      }
     }).catch(err => {
      this.uiService.toastInformativo('Ha ocurrido un error en la lectura del código de barra, intentelo nuevamente.','danger','warning');
     });
  }

  // Funcion para loading
  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Buscando número de identificación...',
      mode: 'ios',
      translucent: true
    });
    await this.loading.present();
  }

  // Funcion para aprobar lista
  async approvedList() {

    const toast = await this.toastCtrl.create({
      header: '¿Estás seguro de que deseas aprobar la lista?, si apruebas la lista no podrás agregar empleados.',
      color: 'primary',
      mode: 'ios',
      position: 'bottom',
      buttons: [
        {
          icon: 'checkbox-outline',
          text: 'Aceptar',
          handler: () => {
            this.routeService.approvedList( this.scheduleRouteId, true ).subscribe( (resp: any) => {
              this.modalCtrl.dismiss();
            }, error => {
              this.uiService.toastInformativo('Error al intentar aprobar la lista, intentelo de nuevo','danger','warning');
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


}
