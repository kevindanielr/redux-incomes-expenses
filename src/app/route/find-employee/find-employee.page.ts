import { Component, OnInit } from '@angular/core';
import { RouteService } from '../route.service';
import { Employee } from '../../interfaces/interfaces';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { UiServiceService } from '../../../shared/ui-service.service';
import { FormFindPage } from '../form-find/form-find.page';
import { SearchAsignPage } from '../search-asign/search-asign.page';

@Component({
  selector: 'app-find-employee',
  templateUrl: './find-employee.page.html',
  styleUrls: ['./find-employee.page.scss'],
})
export class FindEmployeePage implements OnInit {

  employeeData: Employee;
  isInitSearch: boolean = false;
  details: any[];
  loading: any;

  constructor(
    private routeService: RouteService,
    private uiService: UiServiceService,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
  }

  // Funcion para abrir Alert de ID de Empleado
  async alertSearchUser() {

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Búsqueda',
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
            this.getSearchEmployee(data.employeeId);
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

   // Funcion para loading
   async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Espere por favor...',
      mode: 'ios',
      translucent: true
    });
    await this.loading.present();
  }

  getSearchEmployee(employeeNumber) {
    this.isInitSearch = false;
    let employeeData;
    let details;
    this.presentLoading();
    this.routeService.searchEmployee(employeeNumber).subscribe( (resp: any) => {
      employeeData = resp;
      this.employeeData = resp;
      console.log("EmployeeData: ", employeeData);
      
      this.routeService.getSearchEmployeeRoute(employeeNumber).subscribe( (resp: any) => {
        if (resp.length > 0) {
          details = resp;
          console.log("detalle: ", details);
        } else {
          this.uiService.toastInformativo('El empleado no tiene una ruta asignada.','primary','information-circle-outline');
        }
        this.loading.dismiss();
        this.details = details;
        this.isInitSearch = true;
      }, error => {      
        this.loading.dismiss();  
      });
    }, error => {
      // this.loading.dismiss();
      this.uiService.toastInformativo('El empleado no existe en la base de datos.','primary','information-circle-outline');
    });
  }


  // Abrir modal de asignacion de ruta
  async alertAsignUser(dataAsign?: any){
    const modal = await this.modalCtrl.create({
      component: SearchAsignPage,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        employeeData: this.employeeData
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.refresh) {
      this.modalCtrl.dismiss(
        {
          refresh: true
        }
      );
      console.log(this.employeeData?.employeeId);
      
      this.getSearchEmployee(this.employeeData?.employeeNumber);
     }
  }
  

}
