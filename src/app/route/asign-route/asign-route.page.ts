import { Component, Input, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { RouteService } from '../route.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { UiServiceService } from '../../../shared/ui-service.service';

@Component({
  selector: 'app-asign-route',
  templateUrl: './asign-route.page.html',
  styleUrls: [
    './asign-route.page.scss',
    './styles/firebase-listing.page.scss',
    './styles/firebase-listing.ios.scss',
    './styles/firebase-listing.shell.scss'
  ],
})
export class AsignRoutePage implements OnInit {

  asignForm: FormGroup;
  drivers: any[] = [];
  equipment: any[] = null;
  transportUnit: any[];
  flagSelectDriver: boolean = false;
  flagSelectTransport: boolean = false;
  searchQuery: string = "";

  selectedDriver: any;
  selectedTransport: any;
  employee: any = null;
  loading: any;

  @Input() scheduleRouteId;
  @Input() dataRoute;
  @Input() dataAsign;

  constructor(
    private routeService: RouteService,
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private uiService: UiServiceService
  ) { }

  async ngOnInit() {
    this.presentLoading();
    this.createForm();
    const valDrivers = await this.getDrivers();
    const valTransport = await this.getTransportUnit();
    
    if (valDrivers && valTransport) {// Si ya se tiene la informacion de el formulario
      // Funcion para modificacion
      if (this.dataAsign !== undefined) { // Asignacion de Ruta Modificar
        this.setValueForm();
        this.getListAsignEmployee();
        this.getAsignPendingEquipment();
      } else {// Asignacion de Ruta nueva
        this.getEmployeeNoAsign();
        this.getEquimentNoAsign();
      }
      this.loading.dismiss();
    } else {
      this.loading.dismiss();
    }
    
  }

  doRefresh(event) {
    this.ngOnInit();
    event.target.complete();
  }

  onSubmit(values) {
    console.log(this.asignForm);
    
    if ( this.asignForm.invalid ) {
      this.uiService.toastInformativo('El formulario tiene campos requeridos.','warning','warning');
      return Object.values( this.asignForm.controls ).forEach( control =>{

        if ( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( control => control.markAllAsTouched() )
        }

        control.markAsTouched();
      });
      
    }
    console.log(this.dataRoute);
    
    if (this.dataRoute?.tripTypeId?.tripTypeId === 4) { // Si es Transporte de Equipos y Empleados
      
      let employeeCount = this.employee.filter(emp => emp.checked === true);
      let equipmentCount = this.equipment.filter(emp => emp.checked === true);
      if (employeeCount.length <= 0 && equipmentCount.length <= 0) {
        this.uiService.toastInformativo('Seleccione uno o más empleados/equipos para asignar a la unidad de transporte.','warning','warning');
        return;
      }

    } else if (this.dataRoute?.tripTypeId?.tripTypeId === 6) { //Transporte solo de Empleados
      let equipmentCount = this.equipment.filter(emp => emp.checked === true);
      if (equipmentCount.length <= 0) {
        this.uiService.toastInformativo('Seleccione uno o más equipos para asignar a la unidad de transporte.','warning','warning');
        return;
      }

    } else { //Transporte solo de Equipos
      let employeeCount = this.employee.filter(emp => emp.checked === true);
      if (employeeCount.length <= 0) {
        this.uiService.toastInformativo('Seleccione uno o más empleados para asignar a la unidad de transporte.','warning','warning');
        return;
      }
    }

    this.asignRouteTransportDriver(values);
  }

  // Creacion de formulario
  createForm() {
    this.asignForm = this.fb.group({
      routeTransportUnitId: [null],
      driverId: this.fb.group({
        driverId: [null, Validators.required],
      }),
      scheduleRouteId: this.fb.group({
        scheduleRouteId: [this.scheduleRouteId, Validators.required],
      }),
      transportUnitId: this.fb.group({
        transportUnitId: [null, Validators.required],
      })
    })
  }

  // Funcion para settear valores al formularios
  setValueForm() {
    this.asignForm.reset(
      {
        "routeTransportUnitId": this.dataAsign.routeTransportUnitId,
        "driverId": {
          "driverId": this.dataAsign.driverId.driverId
        },
        "scheduleRouteId": {
          "scheduleRouteId": this.scheduleRouteId
        },
        "transportUnitId": {
          "transportUnitId": this.dataAsign.transportUnitId.transportUnitId
        },
      }
     );
  }

  // Funcion para loading
  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Espere por favor...',
      mode: 'ios',
      translucent: true
    });
    await this.loading.present();
  }

  // Función para cerrar modal
  closeModal(){
    this.modalCtrl.dismiss(
      {
        refresh: true
      }
    );
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
    this.selectedDriver = this.drivers.find( dr => dr.driverId === event.detail.value );
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
    this.selectedTransport = this.transportUnit.find( tu => tu.transportUnitId === event.detail.value );
    setTimeout(() => {
      this.flagSelectTransport = true;
    }, 300);
  }

  // Funcion que obtiene los empleados sin ruta asignada
  getEmployeeNoAsign() {
    this.routeService.getNumberEmployeeRoute(this.scheduleRouteId, false).subscribe( resp => {
      this.employee = resp;
    })
  }

  // Funcion que obtiene los equipos sin ruta asignada
  getEquimentNoAsign() {
    this.routeService.getNumberEquipmentRoute(this.scheduleRouteId, false).subscribe( (resp: any) => {
      this.equipment = resp;
    })
  }

  // Funcion que obtiene los empleados de la ruta asignada y los pendientes asignar
  getListAsignEmployee() {
    this.routeService.getListAsignEmployee(this.scheduleRouteId  ,this.dataAsign.routeTransportUnitId).subscribe( resp => {
      this.employee = resp;
    })
  }

  // Funcion que obtiene los equipos de la ruta asignada y los pendientes asignar
  getListAsignEquipment() {
    this.routeService.getListAsignEquipment(this.dataRoute.routeRequestId).subscribe( (resp : any) => {
      this.equipment = resp;
    })
  }

  getAsignPendingEquipment() {
    console.log("DataAsign: ", this.dataAsign);
    
    this.routeService.getEquipmentCheck(this.scheduleRouteId, this.dataAsign?.routeTransportUnitId).subscribe( (resp : any) => {
      this.equipment = resp;
    }, error => {
      console.log("ERROR RARE: ", error);
      
    })
  }

  // Funcion qpara asignar Ruta-Conductor-Transporte
  asignRouteTransportDriver( values ) {
    this.presentLoading();
    if (this.dataAsign === undefined) {
      
      // Nueva Asignacion
      this.routeService.asignRouteTransportDriver( values ).subscribe( (resp: any) => {
  
        // Creacion de objeyo para guardar los empleados checkeados
        let data = [];
        this.employee.forEach(emp => {
          if (emp.checked === true) {
            data.push(
              {
                "employeeId": emp?.employeeId?.employeeId
              }
            );
          }
        });

        let routeTransportUnitId = resp.routeTransportUnitId;
        
        this.routeService.onSaveListRouteEmployee( this.scheduleRouteId, routeTransportUnitId, data ).subscribe( (resp: any) => {

          // Creacion de objeyo para guardar los equipos checkeados
          let dataEquipmnet = [];

          this.equipment.forEach(emp => {
            console.log(emp);
            
            if (emp.checked === true) {
              dataEquipmnet.push(
                {
                  "equipmentId": emp?.equipmentId
                }
              );
            }
          });
          
          this.routeService.onSaveListEquipmentEmployee( this.scheduleRouteId, routeTransportUnitId, dataEquipmnet ).subscribe( resp => {
            this.uiService.toastInformativo('Ruta actualizada con exito.','success','save');
            this.loading.dismiss();
            this.modalCtrl.dismiss({
              'refresh': true
            });
          }, error => {
            this.loading.dismiss();
            this.uiService.toastInformativo('No fue posible actualizar la ruta, intentelo de nuevo','danger','warning');
          });

        }, error => {
          this.loading.dismiss();
          this.uiService.toastInformativo('No fue posible asignar la ruta, intentelo de nuevo.','danger','warning');
        });
      }, error => {
        this.uiService.toastInformativo('Error en el servidor, intentelo de nuevo.','danger','warning');
        this.loading.dismiss();
      });

    } else {
      // Modificacion
  
      this.routeService.updateAsignRouteTransportDriver( values ).subscribe( (resp: any) => {
  
        // Creacion de objeyo para guardar los empleados checkeados
        let data = [];
        let routeTransportUnitId = resp.routeTransportUnitId;
        this.employee.forEach(emp => {
          if (emp.checked === true) {
            data.push(
              {
                "employeeId": emp?.employeeId?.employeeId
              }
            );
          }
        });
        
        this.routeService.onSaveListRouteEmployee( this.scheduleRouteId, routeTransportUnitId, data ).subscribe( resp => {
          
          // Creacion de objeyo para guardar los equipos checkeados
          let dataEquipmnet = [];
          this.equipment.forEach(emp => {
            console.log(emp);
            
            if (emp.checked === true) {
              dataEquipmnet.push(
                {
                  "equipmentId": emp?.equipmentId
                }
              );
            }
          });
          
          this.routeService.onSaveListEquipmentEmployee( this.scheduleRouteId, routeTransportUnitId, dataEquipmnet ).subscribe( resp => {
            this.uiService.toastInformativo('Ruta actualizada con exito.','success','save');
            this.loading.dismiss();
            this.modalCtrl.dismiss({
              'refresh': true
            });
          }, error => {
            this.loading.dismiss();
            this.uiService.toastInformativo('No fue posible actualizar la ruta, intentelo de nuevo','danger','warning');
          });


        }, error => {
          this.loading.dismiss();
          this.uiService.toastInformativo('No fue posible actualizar la ruta, intentelo de nuevo','danger','warning');
        });


      }, error => {
        this.uiService.toastInformativo('Error en el servidor, intentelo de nuevo.','danger','warning');
        this.loading.dismiss();
      });

    }


  }


}

