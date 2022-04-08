import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, ToastController } from '@ionic/angular';
import { UiServiceService } from '../../../shared/ui-service.service';
import { AsignRoutePage } from '../asign-route/asign-route.page';
import { RouteService } from '../route.service';
import { listingAsignModel } from './listing-asign.model';

@Component({
  selector: 'app-listing-asign',
  templateUrl: './listing-asign.page.html',
  styleUrls: [
    './styles/listing-asign.scss',
    './styles/listing-asign.shell.scss',
    './styles/listing-asign.ios.scss',
    './styles/listing-asign.md.scss'
  ],
})
export class ListingAsignPage implements OnInit {

  @Input() scheduleRouteId;
  @Input() dataRoute;
  data: listingAsignModel;

  searchQuery = '';
  showFilters = false;

  numberAssigned: any = null;
  numberNotAssigned: any = null;

  equipmentAssigned: any = null;
  equipmentNotAssigned: any = null;

  @HostBinding('class.is-shell') get isShell() {
    return (this.data && this.data.isShell) ? true : false;
  }

  constructor(
    private routeService: RouteService,
    private modalCtrl: ModalController,
    private actionSheetController: ActionSheetController,
    private toastCtrl: ToastController,
    private uiService: UiServiceService
    ) { }

  ngOnInit(): void {
    this.getRouteTransportUnit();
  }

  doRefresh(event) {
    this.ngOnInit();
    event.target.complete();
  }

  segmentChanged(ev): void {
    // Check if there's any filter and apply it
    this.searchList();
  }

  searchList(): void {
    const query = (this.searchQuery && this.searchQuery !== null) ? this.searchQuery : '';
  }

  filterList(list, query): Array<any> {
    return list.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
  }

  // Función para cerrar modal
  closeModal(){
    this.modalCtrl.dismiss({
      'refresh': true
    });
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

          }
        },
        {
          text: 'Agregar por código de empleado',
          icon: 'id-card-outline',
          cssClass: 'action-dark',
          handler: () => {

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

  // Abrir modal de asignaciones
  async openModalAsignRoute(dataAsign?: any){
    const modal = await this.modalCtrl.create({
      component: AsignRoutePage,
      componentProps: {
        'dataRoute': this.dataRoute,
        'scheduleRouteId': this.scheduleRouteId,
        dataAsign
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.refresh) {
      this.getRouteTransportUnit();
     }
  }

  // Funcion que obtiene los transportes asignados a una ruta
  getRouteTransportUnit() {
    this.data = new listingAsignModel();
    this.routeService.getRouteTransportUnit( this.scheduleRouteId ).subscribe( resp => {
      this.data = resp;
      this.getNumberEmployeeRoute( true );
      this.getNumberEmployeeRoute( false );

      this.getNumberEquipmentRoute( true );
      this.getNumberEquipmentRoute( false );

    });
  }

  //Obtener numero de empleados Asignado/No Asignado
  getNumberEmployeeRoute(assigned: boolean) {
    this.routeService.getNumberEmployeeRoute( this.scheduleRouteId, assigned ).subscribe( (resp: any) => {
      if (assigned) {
        this.numberAssigned = resp?.length;
      } else {
        this.numberNotAssigned = resp?.length;
      }
    });
  }

  // Obtener numero de equipos Asignados/No asignados
  getNumberEquipmentRoute(assigned: boolean) {
    this.routeService.getNumberEquipmentRoute( this.scheduleRouteId, assigned ).subscribe( (resp: any) => {
      if (assigned) {
        this.equipmentAssigned = resp?.length;
      } else {
        this.equipmentNotAssigned = resp?.length;
      }
    });
  }

  // Eliminar ruta de transporte asignada con empleados
  async deleteTransportUnit( routeTransportUnitId ) {
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

            this.routeService.onDeleteRouteTransportUnit( routeTransportUnitId ).subscribe( (resp: any) => {
              this.getRouteTransportUnit();
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


}

