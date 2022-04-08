import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, LoadingController } from '@ionic/angular';
import { UiServiceService } from '../../../shared/ui-service.service';
import { RouteService } from '../route.service';

@Component({
  selector: 'app-form-find',
  templateUrl: './form-find.page.html',
  styleUrls: ['./form-find.page.scss'],
})
export class FormFindPage implements OnInit {

  companys: any[];
  asignForm: FormGroup;
  loading: any;

  constructor(
    private routeService: RouteService,
    private fb: FormBuilder,
    private uiService: UiServiceService,
    private modalCtrl: ModalController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.getCompanys();
    this.createForm();
  }

  get companyIdNoValido() {
    return this.asignForm.get('companyId').invalid && this.asignForm.get('companyId').touched;
  }

  get employeeNumberNoValido() {
    return this.asignForm.get('employeeNumber').invalid && this.asignForm.get('employeeNumber').touched;
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

    // 
    this.getSearchEmployee(this.asignForm.controls.companyId.value, this.asignForm.controls.employeeNumber.value);

  }

   // Funcion para obtener todas las compañias
   getCompanys() {
    this.routeService.getCompanys().subscribe( (resp: any) => {
      this.companys = resp;
    });
  }

  // Creacion de formulario
  createForm() {
    this.asignForm = this.fb.group({
      companyId: [null, Validators.required],
      employeeNumber: [null, Validators.required],
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

  getSearchEmployee(companyId, employeeId) {
    let employeeData;
    let details;
    this.presentLoading();
    this.routeService.getSearchEmployee(companyId,employeeId).subscribe( (resp: any) => {
      employeeData = resp;
      console.log("EmployeeData: ", employeeData);
      
      this.routeService.getSearchEmployeeRoute(employeeId).subscribe( (resp: any) => {
        if (resp.length > 0) {
          details = resp;
          console.log("detalle: ", details);
        } else {
          this.uiService.toastInformativo('El empleado no tiene una ruta asignada.','primary','information-circle-outline');
        }
        this.loading.dismiss();
        this.modalCtrl.dismiss(
          {
            employeeData,
            details
          }
          );

      }, error => {      
        this.loading.dismiss();  
      });
    }, error => {
      this.loading.dismiss();
      this.uiService.toastInformativo('El empleado no existe en la base de datos.','primary','information-circle-outline');
    });
  }

  // Función para cerrar modal
  closeModal(){
    this.modalCtrl.dismiss();
  }

}
