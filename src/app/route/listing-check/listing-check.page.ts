import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { RouteService } from '../route.service';
import { ActionSheetController, AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { UiServiceService } from '../../../shared/ui-service.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { RouteEmployeeListingModel, RouteEquipmentListingModel } from '../listing-user/listing-user.model';

//Geolocation
import { Geolocation, Geoposition } from '@awesome-cordova-plugins/geolocation/ngx';
import { FormEquipmentValidatePage } from '../form-equipment-validate/form-equipment-validate.page';
import { SheduleRouteModel } from '../details/route-details.model';


@Component({
  selector: 'app-listing-check',
  templateUrl: './listing-check.page.html',
  styleUrls: [
    './styles/listing-asign.scss',
    './styles/listing-asign.shell.scss',
    './styles/listing-asign.ios.scss',
    './styles/listing-asign.md.scss'
  ],
})
export class ListingCheckPage implements OnInit {

  // Gather all component subscription in one place. Can be one Subscription or multiple (chained using the Subscription.add() method)
  subscriptions: Subscription;

  data: RouteEmployeeListingModel;
  filter: RouteEmployeeListingModel;

  dataE: RouteEquipmentListingModel;
  filterE: RouteEquipmentListingModel;

  @Input() scheduleRouteId: string;
  @Input() dataRoute: any;
  @Input() routeTransportUnitId;

  segmentValue = 'friends';
  friendsList: Array<any>;
  followersList: Array<any>;
  followingList: Array<any>;
  searchQuery = '';
  showFilters = false;
  loading: any;
  newDate = new Date();
  details: any;
  typeUser;
  routesAsign: any[] = [];
  flagSelectDriver: boolean = false;
  selectedDriver: any;
  selectedTransport: any;

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
    private loadingController: LoadingController,
    public geolocation: Geolocation
    ) { }

  ngOnInit(): void {
    
  }

  ionViewWillEnter() {    
    // Obteniendo tipo de Usuario    
    this.typeUser = JSON.parse(localStorage.getItem('userData')).rolId.rolId || undefined;

    if (this.typeUser === 4 || this.typeUser === 3) { // 3- Supervisor. 4- Operador
      this.getRouteTransportUnitSelect();
    } else {
      this.getListRouteEmployee();
      this.getListRouteEquipment();
      this.getStatusRoute();
    }

  }

  changeRoute( event ) {
    this.flagSelectDriver = false;
    this.selectedDriver = this.routesAsign.find( r => r.routeTransportUnitId === event.detail.value );
    this.routeTransportUnitId = this.selectedDriver?.routeTransportUnitId;

    this.getListRouteEmployee();
    this.getListRouteEquipment();
    this.getStatusRoute();

    setTimeout(() => {
      this.flagSelectDriver = true;      
    }, 1000);
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

  // Funcion para obtener lista de vehiculos asignados para Select(Cmbbox)
  getRouteTransportUnitSelect() {
    this.routeService.getRouteTransportUnitSelect( this.scheduleRouteId ).subscribe( (resp: any) => {
      this.routesAsign = resp;
      console.log(this.routesAsign);
      
    });
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
    this.routeService.getListRouteCheck( this.scheduleRouteId, this.routeTransportUnitId ).subscribe( state => {
      this.data = state;
      console.log(this.data);
      
      this.filter = state;
    });  
  }

  getListRouteEquipment() {  
    console.log("Equipment");
    if (this.dataRoute?.routeRequestId === null) {
      return;
    }
    this.dataE = new RouteEquipmentListingModel();
    this.filterE = new RouteEquipmentListingModel();
    this.routeService.getListAsignEquipmentCheck( this.routeTransportUnitId ).subscribe( state => {
      this.dataE = state;
      console.log("Equipment: ", this.dataE);
            
      this.filterE = state;
    });  
  }

  // getListAsignEquipment

  // Función para cerrar modal
  closeModal(){
    this.modalCtrl.dismiss();
  }

  // Función para abrir menu action-sheet
  async openOptions() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Verificar por código de barra',
          icon: 'barcode-outline',
          cssClass: 'action-dark',
          handler: () => {
            this.openScanBar();
          }
        },
        {
          text: 'Verificar por código de empleado',
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
          text: 'VERIFICAR',
          handler: ( data ) => {
            if (data.employeeId === '') {
              this.uiService.toastInformativo('Ingrese un número de identificación del empleado','warning','warning');
              return;
            }
            this.onCheckRouteEmployee( data.employeeId, true );
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
  onCheckRouteEmployee( numberEmployee, flag ) {

    this.presentLoading();
    this.routeService.onCheckListRouteEmployee(numberEmployee, this.scheduleRouteId, flag).subscribe( (resp: any) => {
      this.getListRouteEmployee();
      this.loading.dismiss();
      if (flag) {
        this.uiService.toastInformativo('Empleado verificado.','success','checkbox-outline');
      } else {
        this.uiService.toastInformativo('Verificación removida.','success','checkbox-outline');
      }
    }, error => {
      this.loading.dismiss();
      this.uiService.toastInformativo('No se pudo realizar la acción, intentelo nuevamente.','danger','warning');
    });
  }


  onCheckEquipment( dataEquipment ) {

    let dataEquipmentTemp = {...dataEquipment, verified: false}; 

    this.presentLoading();
    this.routeService.verifyEquipment( dataEquipmentTemp  ).subscribe( (resp: any) => {
      this.getListRouteEquipment();
      this.loading.dismiss();
      this.uiService.toastInformativo('Verificación removida.','success','checkbox-outline');
    }, error => {
      this.loading.dismiss();
      this.uiService.toastInformativo('No se pudo realizar la acción, intentelo nuevamente.','danger','warning');
    });
  }

  // Eliminar verifiacion de empleado de la lista
  async removeEmployee( numberEmployee, onBoard ) {

    if (!onBoard) {
      this.uiService.toastInformativo('El empleado seleccionado aun no esta verificado.','primary','information-circle-outline');
      return;
    }

    const toast = await this.toastCtrl.create({
      header: '¿Realmente desea remover la verificación?.',
      color: 'primary',
      mode: 'ios',
      position: 'bottom',
      buttons: [
        {
          icon: 'remove-circle-outline',
          text: 'Remover',
          handler: () => {

            this.onCheckRouteEmployee( numberEmployee, false );

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

  // Eliminar verificacion de equipo  de la lista
  async removeEquipment( equipmentData, onBoard ) {

    if (!onBoard) {
      this.uiService.toastInformativo('El equipo seleccionado aun no esta verificado.','primary','information-circle-outline');
      return;
    }

    const toast = await this.toastCtrl.create({
      header: '¿Realmente desea remover la verificación?.',
      color: 'primary',
      mode: 'ios',
      position: 'bottom',
      buttons: [
        {
          icon: 'remove-circle-outline',
          text: 'Remover',
          handler: () => {

            this.onCheckEquipment( equipmentData );

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
  openScanBar( ) {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log(barcodeData);
      
      if (barcodeData.text !== '') {
        this.onCheckRouteEmployee(barcodeData.text, true);
      }
     }).catch(err => {
      this.uiService.toastInformativo('Ha ocurrido un error en la lectura del código de barra, intentelo nuevamente.','danger','warning');
     });
  }

  // Funcion para loading
  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Espere...',
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


  // Funcion para finalizar o empezar Ruta
  startEndRoute(op: string) {
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition) => {
      let lat = geoposition.coords.latitude;
      let lng = geoposition.coords.longitude;

      if (op === 'start') {
  
        let data= {
          "routeTransportUnitId": this.routeTransportUnitId,
          "startLat": lat,
          "startLon": lng
        };

        this.routeService.startRoute(data).subscribe( resp => {
          this.uiService.toastInformativo('Ruta iniciada, presione finalizar ruta al dejar al último empleado en su destino.','success','flag');
          console.log(resp);
          this.getStatusRoute();
        }, error => {
          this.uiService.toastInformativo('Error al iniciar Ruta, intentelo de nuevo','danger','warning');
        });
      } else {
        let data = {
          "endLat": lat,
          "endLon": lng,
          "routeTransportUnitId": this.routeTransportUnitId,
        };
        console.log(data);
        
        this.routeService.endRoute(data).subscribe( resp => {
          this.uiService.toastInformativo('Ruta finalizada.','success','flag');
          console.log(resp);
          this.getStatusRoute();
        },  error => {
          this.uiService.toastInformativo('Error al finalizar Ruta, intentelo de nuevo','danger','warning');
        });
      }

    });
  }

  // Abrir modal para validar
  async openValidationPage(equipmentId){
    const modal = await this.modalCtrl.create({
      component: FormEquipmentValidatePage,
      componentProps: {
        equipmentId
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.refresh) {
      this.getListRouteEmployee();
      this.getListRouteEquipment();
      this.getStatusRoute();
     }
  }

  getStatusRoute() {
    this.presentLoading();
    this.routeService.getDetailsScheduleRoute( this.scheduleRouteId ).subscribe( resp => {
      this.details = resp;
      console.log(this.details);
      this.loading?.dismiss();
      setTimeout(() => {
        this.loading?.dismiss();
      }, 1000);
    }, error => {
      this.loading?.dismiss();
    });

  }

  doRefresh(event) {
    this.ionViewWillEnter();
    event.target.complete();
  }


  async addNovedad(routeEmployeeId) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Novedades',
      inputs: [
        {
          name: 'novedad',
          type: 'textarea',
          placeholder: 'Descripción'
        },
      ],
      buttons: [
        {
          text: 'AGREGAR',
          handler: ( data ) => {
            if (data.novedad === '') {
              this.uiService.toastInformativo('Ingrese un descripción de la novedad.','warning','warning');
              return;
            }

            let datatemp = {
              "routeEmployeeId": routeEmployeeId,
              "routeNotes": data.novedad
            };

            this.routeService.asignNovedadesListCheck(datatemp).subscribe( resp => {
              this.uiService.toastInformativo('Novedad agregada','success','save');
              this.getListRouteEmployee();
            }, error => {
              console.log(error);
            });
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



}

