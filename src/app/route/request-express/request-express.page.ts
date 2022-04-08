import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { RouteService } from '../route.service';
import { UiServiceService } from '../../../shared/ui-service.service';
import { RouteEmployeeListingModel } from '../listing-user/listing-user.model';
import { ListingAsignPage } from '../listing-asign/listing-asign.page';
import { Geolocation, Geoposition } from '@awesome-cordova-plugins/geolocation/ngx';
import moment from 'moment';


@Component({
  selector: 'app-request-express',
  templateUrl: './request-express.page.html',
  styleUrls: [
    './styles/request-express.page.scss',
    './styles/request-express.shell.scss',
    './styles/request-express.ios.scss',
    './styles/request-express.md.scss'
  ],
})
export class RequestExpressPage implements OnInit {


  data: RouteEmployeeListingModel;
  filter: RouteEmployeeListingModel;

  searchQuery = '';
  formattedDate?: string;

  dateValue = '';
  
  loading: any;
  typeUser: any = 1;
  userExpress: any;
  selectedCar: any;

  // Datos de WhatsApp
  countryCode: string = "503";
  whatsAppNumber: string = "64201679";
  urlWhatsApp: string = "https://wa.me/" + this.countryCode + this.whatsAppNumber + "?text=Hello World!"

  @Input() isSaveRequest: boolean = false;
  @Input() scheduleRouteId: any;
  @Input() dataRequest: any;

  drivers: any[];
  transportUnit: any[];
  flagSelectDriver: boolean = false;
  flagSelectTransport: boolean = false;

  selectedDriver: any;
  selectedTransport: any;

  isFoundExpressUser: boolean = false;
  selectedExpressUser: any;

  identifier: any;

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
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private geolocation: Geolocation
    ) { }

  ngOnInit(): void {
    this.userExpress = JSON.parse(localStorage.getItem('userExpress')) || undefined;
    this.typeUser = JSON.parse(localStorage.getItem('userData'))?.rolId?.rolId;// Tipo de Usuario logeado
    this.getDrivers();
    this.getTransportUnit();

    
    this.crearForm(); 
    
    if (this.userExpress !== undefined) {
      this.typeUser = 6
      if ( this.typeUser !== 3 || this.typeUser !== 4 || this.typeUser !== 5 ) {
        this.validationsForm.get('driverId').get('driverId').disable();
        this.validationsForm.get('transportUnitId').get('transportUnitId').disable();
      }
    } 

    if (this.isSaveRequest) { // Es modificar
      this.getStatusRoute();
      this.setForm();
    } else {

    }
  }

  //Creacion de formulaio
  crearForm() {
    this.validationsForm = this.fb.group({
      expressRequestId: [null],
      expressUserId: this.fb.group({
        expressUserId: [this.userExpress?.expressUserId, Validators.required],
      }),
      date: [null, Validators.required],
      from: [null, Validators.required],
      to: [null, Validators.required],
      tipoVehiculo: [null, Validators.required],
      formaPago: [null, Validators.required],
      numeroEquipaje: [0, Validators.required],
      numeroPersonas: [1, Validators.required],
      notes: [null],
      driverId: this.fb.group({
        driverId: [null],
      }),
      transportUnitId: this.fb.group({
        transportUnitId: [null],
      })
    });
  }

  // Getters
  get dateNoValido() {
    return this.validationsForm.get('date').invalid && this.validationsForm.get('date').touched;
  }

  get numeroEquipajeNoValido() {
    return this.validationsForm.get('numeroEquipaje').invalid && this.validationsForm.get('numeroEquipaje').touched;
  }

  get numeroPersonasNoValido() {
    return this.validationsForm.get('numeroPersonas').invalid && this.validationsForm.get('numeroPersonas').touched;
  }

  get userExpressNoValido() {
    return this.validationsForm.get('expressUserId').get('expressUserId').invalid && this.validationsForm.get('expressUserId').get('expressUserId').touched;
  }

  get vehiculoNoValido() {
    return this.validationsForm.get('tipoVehiculo').invalid && this.validationsForm.get('tipoVehiculo').touched;
  }

  get pagoNoValido() {
    return this.validationsForm.get('formaPago').invalid && this.validationsForm.get('formaPago').touched;
  }

  get fromNoValido() {
    return this.validationsForm.get('from').invalid && this.validationsForm.get('from').touched;
  }

  get toNoValido() {
    return this.validationsForm.get('to').invalid && this.validationsForm.get('to').touched;
  }


  // Rellenando formulario
  setForm() {
    this.presentLoading();
    this.isFoundExpressUser = false;
    this.routeService.getExpressUserbyId(this.dataRequest.expressUserId.expressUserId).subscribe( (resp: any) => {
      this.selectedExpressUser = resp;
      
      setTimeout(() => {
        this.dateValue = this.dataRequest.date;
         this.validationsForm.reset({
          expressRequestId: this.dataRequest.expressRequestId,
          expressUserId: {
            expressUserId: this.dataRequest.expressUserId.expressUserId,
          },
          date: this.dataRequest.date,
          from: this.dataRequest.from,
          to: this.dataRequest.to,
          tipoVehiculo: this.dataRequest.tipoVehiculo,
          formaPago: this.dataRequest.formaPago,
          numeroEquipaje: this.dataRequest?.numeroEquipaje,
          numeroPersonas: this.dataRequest?.numeroPersonas,
          notes: this.dataRequest.notes,
          driverId: {
            driverId: this.dataRequest?.driverId?.driverId,
          },
          transportUnitId: {
            transportUnitId: this.dataRequest?.transportUnitId?.transportUnitId,
          }
        });
  
        this.selectedDriver = this.drivers?.find( dr => dr.driverId === this.dataRequest?.driverId?.driverId );
        this.selectedTransport = this.transportUnit?.find( tu => tu.transportUnitId === this.dataRequest?.transportUnitId?.transportUnitId );
  
        if (this.selectedDriver !== undefined || this.selectedTransport !== undefined) {
          this.flagSelectDriver = true;
          this.flagSelectTransport = true;
        }

        console.log("DRIVER: ", this.selectedDriver);
        
  
        console.log(this.validationsForm.value);
        this.isFoundExpressUser = true;
        this.loading.dismiss();
      }, 1000);
    } );

  }

  setIdentifier(event) {
    this.identifier = event.detail?.value;
    console.log(this.identifier);
    
  }

  searchExpressUser() {
    this.isFoundExpressUser = false;
    this.presentLoading();
    this.routeService.getExpressUser(this.identifier).subscribe( (resp: any) => {
      console.log("DUI/Passport", resp);
      this.selectedExpressUser= resp;
      this.validationsForm.get('expressUserId').get('expressUserId').setValue(resp?.expressUserId);
      this.isFoundExpressUser = true;
      this.loading?.dismiss();
    }, error => {
      if (error.status === 404) {
        this.isFoundExpressUser = false;
        this.validationsForm.get('expressUserId').get('expressUserId').setValue(null);
        this.routeService.getExpressUserPhone(this.identifier).subscribe( (resp: any) => {
          console.log("Phone: ", resp);
          this.selectedExpressUser= resp;
          this.validationsForm.get('expressUserId').get('expressUserId').setValue(resp?.expressUserId);
          this.isFoundExpressUser = true;
          this.loading?.dismiss();
        }, error => {
          this.loading?.dismiss();
          this.isFoundExpressUser = false;
          this.validationsForm.get('expressUserId').get('expressUserId').setValue(null);
          this.uiService.toastInformativo('No se encontraron resultados con la búsqueda de DUI/Pasaporte/Teléfono.','warning','warning');
        });
      } else {
        this.loading?.dismiss();
        this.isFoundExpressUser = false;
      }
    });

    setTimeout(() => {
      this.loading?.dismiss();
    }, 3000);

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
      this.routeService.onUpdateRequestExpress(this.validationsForm.value).subscribe( (resp: any) => {
        this.isSaveRequest = true;        
        this.uiService.toastInformativo('Solicitud de servicio express modificada.','success','save');
        this.modalController.dismiss({ 'refresh': true }, '', 'requestDiurno')
      });
    } else {
      
      // Guardar nueva solicitud
      this.routeService.onSaveRequestExpress(this.validationsForm.value).subscribe( (resp: any) => {
        this.uiService.toastInformativo('Solicitud express creada exitosamente, espere a que uno de nuestros agentes apruebe su solicitud.','success','save');
        this.modalController.dismiss({ 'refresh': true }, '', 'requestDiurno')
      });
    }
    
  }

  // Función para cerrar modal
  dismiss() {
    this.modalController.dismiss({ 'refresh': true }, '', 'requestDiurno')
  }

  // Función para abrir menu action-sheet
  async openOptions() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Asignar servicio Express',
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
      ]
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

  // Funcion para loading
  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Cargando...',
      mode: 'ios',
      translucent: true
    });
    await this.loading.present();
  }

  openWhatsApp(){ 
    
    if ( this.validationsForm.invalid ) {
      this.uiService.toastInformativo('Llene el formulario para recibir ayuda personalizada por WhatsApp.','primary','warning');
      return Object.values( this.validationsForm.controls ).forEach( control =>{

        if ( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( control => control.markAllAsTouched() )
        }
        control.markAsTouched();
      });
    }

    moment.locale(); 
    let date = moment(new Date (this.validationsForm.controls.date.value)).format('DD/MM/YYYY');
    let hour = moment(new Date (this.validationsForm.controls.date.value)).format('LT');
    let from = this.validationsForm.controls.from.value;
    let to = this.validationsForm.controls.to.value;
    let type = this.validationsForm.controls.tipoVehiculo.value;
    let typePay = this.validationsForm.controls.formaPago.value;
    let stringMessage = 
    `Muy buenas Transporte Shalom 🚘, mi nombre es *${ this.userExpress.name }.* Me gustaría cotizar un servicio *VIP*.%0A📅 *Día:* ${ date }.%0A🕐 *Hora:* ${ hour }.%0A☑️ *Punto de origen:* ${from}%0A☑️ *Punto de destino:* ${ to }%0AViaje a realizar con tipo de vehículo *${ type }*, forma de pago en *${ typePay }.*`
    this.urlWhatsApp = "https://wa.me/" + this.countryCode + this.whatsAppNumber + "?text=" + stringMessage
    window.open(this.urlWhatsApp, "_blank");
}

  changeType( event ) {

    let opt = event.detail.value;

    switch (opt) {
      case "Sedan":
        this.selectedCar = {
          name: "Sedan",
          image: '../../../assets/sedan.jpg'
        }
        break;
      
      case "Camioneta":
        this.selectedCar = {
          name: "Camioneta VIP",
          image: '../../../assets/camioneta.jpg'
        }
        break;
          
      case "MiniVAN":
        this.selectedCar = {
          name: "MiniVAN (Microbus)",
          image: '../../../assets/microbus.jpg'
        }
        break;

      case "Pickup":
        this.selectedCar = {
          name: "Pickup",
          image: '../../../assets/pickup.jpg'
        }
        break;
      
      case "Bus":
        this.selectedCar = {
          name: "Bus",
          image: '../../../assets/bus.jpg'
        }
        break;
          
      case "Furgón":
        this.selectedCar = {
          name: "Furgón (1-8 Toneladas)",
          image: '../../../assets/furgon.jpg'
        }
        break;
    
      default:
        break;
    }
  }

  // funcion para obtener motoristas
  async getDrivers() {
    return new Promise(resolve => {
      this.routeService.getDrivers( 5 ).subscribe( (resp : any) => { // 5- Estado Activo en Motoristas
        this.drivers = resp;
        resolve(true);
      }, error => {
        resolve(false);
      });

    })
  }

  changeDriver( event ) {
    this.flagSelectDriver = false;
        
    this.selectedDriver = this.drivers?.find( dr => dr.driverId === event.detail.value );
    setTimeout(() => {
      this.flagSelectDriver = true;      
    }, 300);
  }

  // funcion para obtener motoristas
  async getTransportUnit() {
    return new Promise(resolve => {
      this.routeService.getTransportUnit( 6 ).subscribe( (resp : any) => { // 6 -Activo en Transport Unit
        this.transportUnit = resp;
        resolve(true);
      }, error => {
        resolve(false);
      });

    })
  }

  changeTransport( event ) {
    this.flagSelectTransport = false;
    this.selectedTransport = this.transportUnit?.find( tu => tu.transportUnitId === event.detail.value );
    setTimeout(() => {
      this.flagSelectTransport = true;
    }, 300);
  }

  // Funcion para finalizar o empezar Ruta
  startEndRoute(op: string) {
    // this.getStatusRoute();
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition) => {
      let lat = geoposition.coords.latitude;
      let lng = geoposition.coords.longitude;

      if (op === 'start') {
  
        let data= {
          "expressRequestId": this.dataRequest.expressRequestId,
          "startLat": lat,
          "startLon": lng
        };
  
        this.routeService.startRouteExpress(data).subscribe( resp => {
          this.uiService.toastInformativo('Ruta iniciada, presione finalizar ruta al finalizar su destino.','success','flag');
          console.log(resp);
          this.getStatusRoute();
        }, error => {
          this.uiService.toastInformativo('Error al iniciar Ruta, intentelo de nuevo','danger','warning');
        });
      } else {
        let data = {
          "endLat": lat,
          "endLon": lng,
          "expressRequestId": this.dataRequest.expressRequestId,
        };
        console.log(data);
        
        this.routeService.endRouteExpress(data).subscribe( resp => {
          this.uiService.toastInformativo('Ruta finalizada.','success','flag');
          console.log(resp);
          this.getStatusRoute();
        },  error => {
          this.uiService.toastInformativo('Error al finalizar Ruta, intentelo de nuevo','danger','warning');
        });
      }

    });
  }

  getStatusRoute() {
    this.routeService.getDetailExpressRequest( this.dataRequest.expressRequestId ).subscribe( resp => {
      this.dataRequest = resp;
      console.log(this.dataRequest);
      
    });
  }
  
}
