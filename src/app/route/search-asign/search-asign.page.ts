import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { UiServiceService } from '../../../shared/ui-service.service';
import { ListingAsignPage } from '../listing-asign/listing-asign.page';
import { RouteService } from '../route.service';

@Component({
  selector: 'app-search-asign',
  templateUrl: './search-asign.page.html',
  styleUrls: ['./search-asign.page.scss'],
})
export class SearchAsignPage implements OnInit {
  companys: any[];
  asignForm: FormGroup;
  loading: any;

  scheduleRoutes: any[] = [];

  @Input() employeeData;

  constructor(
    private routeService: RouteService,
    private fb: FormBuilder,
    private uiService: UiServiceService,
    private modalCtrl: ModalController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    console.log(this.employeeData);
    
    this.getScheduleRoutes();
    this.createForm();
  }


  get scheduleRouteIdNoValido() {
    return this.asignForm.get('scheduleRouteId').invalid && this.asignForm.get('scheduleRouteId').touched;
  }

  onSubmit() {
    if ( this.asignForm.invalid ) {
      this.uiService.toastInformativo('El formulario tiene campos requeridos.','warning','warning');
      return Object.values( this.asignForm.controls ).forEach( control =>{
        if ( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( control => control.markAllAsTouched() )
        }
        control.markAsTouched();
      });
    }

    // Post para inscribir en ruta
    this.joinRouteEmployee();

  }

   // Funcion para obtener todas las compañias
   getScheduleRoutes() {
    this.routeService.getRoutesScheduleDay().subscribe( (resp: any) => {
      this.scheduleRoutes = resp;
      console.log(this.scheduleRoutes);
      
    });
  }

  // Creacion de formulario
  createForm() {
    this.asignForm = this.fb.group({
      scheduleRouteId: [null, Validators.required],
    })
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
    this.modalCtrl.dismiss();
  }

  // Funcion para unirse a la ruta
  joinRouteEmployee() {

    let data = {
      "employeeId": {
        "employeeId": this.employeeData?.employeeId// Usuario actual
      },
      "scheduleRouteId": {
        "scheduleRouteId": this.asignForm?.controls?.scheduleRouteId?.value
      }
    }
    this.presentLoading();
    this.routeService.joinRouteEmployee(data).subscribe( resp => {
      // Request de scheduleRoute
      this.routeService.getDataScheduleRoute( this.asignForm?.controls?.scheduleRouteId?.value ).subscribe( resp => {
        this.uiService.toastInformativo('Usuario inscrito en ruta, favor asigne un transporte y un conductor','primary','save');
        this.loading?.dismiss();
        this.openModalAsignRoute(this.asignForm?.controls?.scheduleRouteId?.value, resp);
      }, error => {
        this.loading?.dismiss();
        this.uiService.toastInformativo('Ha ocurrido un error abrir la asignación. intentelo de nuevo.','danger','warning');
      });

      
    }, error => {
      this.loading?.dismiss();
      if (error.status === 409) {
        this.uiService.toastInformativo('Este usuario ya esta en la lista de empleados de la ruta','warning','warning');
      } else {
        this.uiService.toastInformativo('Ha ocurrido un error al agregarse a la lista de empleados. intentelo de nuevo.','danger','warning');
      }
    });
  }

  // Abrir modal para asignar Ruta
  async openModalAsignRoute( scheduleRouteId, dataRoute ){
    const modal = await this.modalCtrl.create({
      component: ListingAsignPage,
      componentProps: {
        scheduleRouteId,
        dataRoute
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.refresh) {
      this.modalCtrl.dismiss({
        refresh: true
      });
     }

  }

}
