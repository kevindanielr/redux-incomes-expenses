import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { RouteService } from '../route.service';
import { format, parseISO } from 'date-fns';
import { UiServiceService } from '../../../shared/ui-service.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { RouteEmployeeListingModel, RouteEquipmentListingModel } from '../listing-user/listing-user.model';
import { ListingAsignPage } from '../listing-asign/listing-asign.page';
import { FormEquipmentPage } from '../form-equipment/form-equipment.page';
import { ListingCheckPage } from '../listing-check/listing-check.page';

@Component({
  selector: 'app-request-diurno',
  templateUrl: './request-diurno.page.html',
  styleUrls: [
    './styles/request-diurno.page.scss',
    './styles/request-diurno.shell.scss',
    './styles/request-diurno.ios.scss',
    './styles/request-diurno.md.scss'
  ],
})
export class RequestDiurnoPage implements OnInit {


  data: RouteEmployeeListingModel;
  filter: RouteEmployeeListingModel;

  dataEquipment: RouteEquipmentListingModel;
  filterEquipment: RouteEquipmentListingModel;

  searchQuery = '';
  formattedDate?: string;

  dateValue = '';
  companyId: any;

  typesTrip: any[] = [];
  routes: any[] = [];
  companys: any[] = [];
  
  loading: any;
  typeUser: any = 1;
  typeTripSelected: any;
  valueCheck: boolean = false;

  @Input() isSaveRequest: boolean = false;
  @Input() scheduleRouteId: any;
  @Input() dataRequest: any;
  @Input() routeTransportUnitId: any;

  public validationsForm: FormGroup;

  @HostBinding('class.is-shell') get isShell() {
    return (this.data && this.data.isShell) ? true : false;
  }

  constructor(
    private routeService: RouteService,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private fb: FormBuilder,
    private uiService: UiServiceService,
    private barcodeScanner: BarcodeScanner,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
    ) { }

  ngOnInit(): void {

    this.companyId = JSON.parse(localStorage.getItem('employeeData'))?.companyId?.companyId || undefined;
    this.typeUser = JSON.parse(localStorage.getItem('userData'))?.rolId?.rolId || undefined;        
    this.crearForm();
    this.getTypeTrip();    
    this.getRoutesLite();

    // Validacion de tipo de usuario activo
    if (this.typeUser === 3 || this.typeUser === 4 || this.typeUser === 5) {
      this.getCompanys();
    }

    if (this.isSaveRequest) { // Es modificar
      console.log("Modificando");
      
      this.getListRouteEmployee();
      this.getListEquipment();
      this.setForm();
    } else {
      this.validationsForm.get('routeId').get('routeId').disable();
    }


    // if (this.typeUser === 5) {
    //   this.validationsForm.disable();
    // } else {
    //   this.validationsForm.enable();
    // }
  }

  //Creacion de formulaio
  crearForm() {
    this.validationsForm = this.fb.group({
      companyId: this.fb.group({
        companyId: [this.companyId, Validators.required],
      }),
      date: [null, Validators.required],
      from: [null, Validators.required],
      to: [null, Validators.required],
      routeId: this.fb.group({
        routeId: [null, Validators.required],
      }),
      tripTypeId: this.fb.group({
        tripTypeId: [null, Validators.required],
      }),
      notes: [null],
      routeRequestId: [null],
      userId: {
        userId: JSON.parse(localStorage.getItem('userData'))?.userId
      }
    });

    // this.validationsForm.get("routeId").get("routeId").setValidators([Validators.required]);
    // this.validationsForm.get("routeId").get("routeId").disable();
    // this.validationsForm.get("from").enable();
    // this.validationsForm.get("to").enable();
  }

  // Getters
  get dateNoValido() {
    return this.validationsForm.get('date').invalid && this.validationsForm.get('date').touched;
  }

  get fromNoValido() {
    return this.validationsForm.get('from').invalid && this.validationsForm.get('from').touched;
  }

  get toNoValido() {
    return this.validationsForm.get('to').invalid && this.validationsForm.get('to').touched;
  }

  get tripTypeNoValido() {
    return this.validationsForm.get('tripTypeId').get('tripTypeId').invalid && this.validationsForm.get('tripTypeId').get('tripTypeId').touched;
  }

  get companyIdNoValido() {
    return this.validationsForm.get('companyId').get('companyId').invalid && this.validationsForm.get('companyId').get('companyId').touched;
  }

  get routeIdNoValido() {
    return this.validationsForm.get('routeId').get('routeId').invalid && this.validationsForm.get('routeId').get('routeId').touched;
  }


  // Rellenando formulario
  setForm() {
    setTimeout(() => {
      this.dateValue = this.dataRequest.date;

      if (this.dataRequest?.routeId?.routeId === undefined) {
        this.valueCheck = false;
      } else {
        this.valueCheck = true;
      }
           
       this.validationsForm.reset({
        companyId: {
          companyId: this.dataRequest.companyId.companyId,
        },
        date: this.dataRequest.date,
        from: this.dataRequest.from,
        to: this.dataRequest.to,
        routeId: {
          routeId: this.dataRequest?.routeId?.routeId,
        },
        tripTypeId: {
          tripTypeId: this.dataRequest.tripTypeId.tripTypeId,
        },
        notes: this.dataRequest.notes,
        routeRequestId: this.dataRequest.routeRequestId,
        userId: {
          userId: JSON.parse(localStorage.getItem('userData'))?.userId
        }
      });
      console.log(this.validationsForm.value);
    }, 1000);
    
  }


  //onsubmit de Formulario
  onSubmit() {
    console.log(this.validationsForm);
        
    if ( this.validationsForm.invalid ) {
      this.uiService.toastInformativo('El formulario tiene campos requeridos.','warning','warning');
      return Object.values( this.validationsForm.controls ).forEach( control =>{

        if ( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( control => control.markAllAsTouched() )
        }
        control.markAsTouched();
      });
    }
    
    if (this.isSaveRequest) { // Modificar
      // Guardar nueva solicitud
      this.validationsForm.controls.routeRequestId.setValue(this.dataRequest?.routeRequestId);
      this.routeService.onUpdateRequestRoute(this.validationsForm.value).subscribe( (resp: any) => {
        this.isSaveRequest = true;        
        this.getListRouteEmployee();
        this.uiService.toastInformativo('Solicitud de servicio diurno modificada.','success','save');
        this.modalController.dismiss({ 'refresh': true }, '', 'requestDiurno')
      });
    } else {
      
      // Guardar nueva solicitud
      this.routeService.onSaveRequestRoute(this.validationsForm.value).subscribe( (resp: any) => {
        this.isSaveRequest = true;
        this.scheduleRouteId = resp.scheduleRouteId;
        this.dataRequest = resp;
        this.uiService.toastInformativo('Solicitud diurna creada, agregue empleados que se abordaran en esta solicitud.','primary','add-circle-outline');
        this.getListRouteEmployee();
      });
    }
    
  }

  // Función para cerrar modal
  dismiss() {
    this.modalController.dismiss({ 'refresh': true }, '', 'requestDiurno')
  }

  // Funcion que cambia formulario con el checkbox
  changeChkbox( event ) {
    
    if (!event.detail.checked) {
      
      this.validationsForm.get("routeId").get("routeId").setValue(null);
      this.validationsForm.get("routeId").get("routeId").clearValidators()
      this.validationsForm.get("routeId").get("routeId").disable();

      this.validationsForm.get("from").enable();
      this.validationsForm.get("to").enable();
      
    } else {
      
      this.validationsForm.get("routeId").get("routeId").setValidators([Validators.required]);
      this.validationsForm.get("routeId").get("routeId").enable();

      this.validationsForm.get("from").disable();
      this.validationsForm.get("to").disable();
    }
  }


  // Fucion que obtiene los tipos de viaje
  getTypeTrip() {
    this.routeService.getTypeTrip().subscribe( (resp: any) => {
      this.typesTrip = resp;      
    });
  }

  // Fucion que obtiene las rutas de la empresa
  getRoutesLite() {
    this.routeService.getRoutesLite().subscribe( (resp: any) => {
      this.routes = resp;
      console.log(this.routes);
                 
    });
  }

  // Fucion que obtiene todas la rutas del aplicativo
  getRoutesAll() {
    this.routeService.getRoutesAllCompany().subscribe( (resp: any) => {
      this.routes = resp;           
    });
  }

  getCompanys() {
    this.routeService.getCompanys().subscribe( (resp: any) => {
      this.companys = resp;           
    });
  }

  // Función para abrir menu action-sheet
  async openOptions() {
    let buttonArray;
    if (this.typeUser  === 3 || this.typeUser  === 4) {

      buttonArray = [
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
          text: 'Agregar equipo informático',
          icon: 'laptop-outline',
          cssClass: 'action-dark',
          handler: () => {
            this.openModalEquipment();
          }
        },
        {
          text: 'Empezar Ruta',
          icon: 'flag-outline',
          cssClass: 'action-dark',
          handler: () => {
            this.openModalStartRoute();
          }
        },
        {
          text: 'Asignar servicio Diurno',
          icon: 'car-sport-outline',
          cssClass: 'action-dark',
          handler: () => {
            this.openModalAsignRoute();
          }
        },
        
        {
          text: 'Cancelar',
          icon: 'arrow-back',
          cssClass: 'action-dark',
          role: 'cancel'
        }
      ];

    } else if (this.typeUser  === 5) {

      buttonArray = [
        {
          text: 'Empezar Ruta',
          icon: 'flag-outline',
          cssClass: 'action-dark',
          handler: () => {
            this.openModalStartRoute();
          }
        },
        {
          text: 'Cancelar',
          icon: 'arrow-back',
          cssClass: 'action-dark',
          role: 'cancel'
        }
      ];

    } else {

      {

        buttonArray = [
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
            text: 'Agregar equipo informático',
            icon: 'laptop-outline',
            cssClass: 'action-dark',
            handler: () => {
              this.openModalEquipment();
            }
          },
          {
            text: 'Cancelar',
            icon: 'arrow-back',
            cssClass: 'action-dark',
            role: 'cancel'
          }
        ];
  
      }

    }



    const actionSheet = await this.actionSheetController.create({
      buttons: buttonArray
    });
    await actionSheet.present();
  }

  // Abrir modal para asignar Ruta
  async openModalAsignRoute(  dataRoute? ){
    const modal = await this.modalCtrl.create({
      component: ListingAsignPage,
      componentProps: {
        scheduleRouteId: this.scheduleRouteId,
        dataRoute: this.dataRequest
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    // if (data?.refresh) {
    //   this.getDetailRoute();
    //  }

  }

  // Abrir modal para asignar Ruta
  async openModalEquipment(  dataRoute? ){
    const modal = await this.modalCtrl.create({
      component: FormEquipmentPage,
      // cssClass: 'my-custom-modal-css-equipment',
      showBackdrop: true,
      componentProps: {
        scheduleRouteId: this.scheduleRouteId,
        companyId: this.validationsForm.controls.companyId.value
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.refresh) {
      this.getListEquipment();
     }

  }

  // Abrir modal de lista de chequeo
  async openModalStartRoute( ){ 
    
    const modal = await this.modalCtrl.create({
      component: ListingCheckPage,
      componentProps: {
        "scheduleRouteId": this.scheduleRouteId,
        "dataRoute": this.dataRequest,
        'routeTransportUnitId': this.routeTransportUnitId
      }
    });
    await modal.present();
  }

  // Abrir modal para asignar Ruta
  async openModalListCheck(  dataRoute? ){
    const modal = await this.modalCtrl.create({
      component: ListingCheckPage,
      // cssClass: 'my-custom-modal-css-equipment',
      showBackdrop: true,
      componentProps: {
        scheduleRouteId: this.scheduleRouteId,
        dataRoute,
        // 'routeTransportUnitId': this.routeTransportUnitId
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.refresh) {
      this.getListRouteEmployee();
     }

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

  // Funcion para loading
  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Buscando número de identificación...',
      mode: 'ios',
      translucent: true
    });
    await this.loading.present();
  }

  // Funcion que obtiene los usuarios inscritos en ruta agendada
  getListRouteEmployee() {
    
    this.data = new RouteEmployeeListingModel();
    this.filter = new RouteEmployeeListingModel();
    this.routeService.getListRouteEmployee( this.scheduleRouteId ).subscribe( state => {
      this.data = state;
      this.filter = state;
    });  
  }

  // Funcion que obtiene los usuarios inscritos en ruta agendada
  getListEquipment() {
    this.dataEquipment = new RouteEquipmentListingModel();
    this.filterEquipment = new RouteEquipmentListingModel();
    this.routeService.getListRouteEquipment( this.dataRequest.routeRequestId ).subscribe( state => {
      this.dataEquipment = state;
      this.filterEquipment = state;
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

  // Eliminar equipo de la lista
  async deleteEquipment( equipmentId ) {
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

            this.routeService.onDeleteRouteEquipment( equipmentId ).subscribe( (resp: any) => {
              this.getListEquipment();
              this.uiService.toastInformativo('Equipo removido de la ruta.','success','save');
            }, error => {
              this.uiService.toastInformativo('Error al intentar eliminar el equipo, intentelo de nuevo','danger','warning');
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

  changeTripType( event ) {
    this.typeTripSelected = event.detail.value;
  }


  
}
