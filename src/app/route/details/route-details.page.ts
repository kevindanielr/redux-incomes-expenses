import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { SheduleRouteModel } from './route-details.model';
import { RouteService } from '../route.service';

import { UserListingPage } from '../listing-user/listing-user.page';
import { ListingAsignPage } from '../listing-asign/listing-asign.page';
import { ListingCheckPage } from '../listing-check/listing-check.page';
import { LstRouteEmployee, RouteStop } from '../../interfaces/interfaces';
import { UiServiceService } from '../../../shared/ui-service.service';

declare var mapboxgl: any;

@Component({
  selector: 'app-route-details',
  templateUrl: './route-details.page.html',
  styleUrls: [
    './styles/route-details.page.scss',
    './styles/route-details.shell.scss'
  ]
})
export class RouteDetailsPage implements OnInit {
  // Gather all component subscription in one place. Can be one Subscription or multiple (chained using the Subscription.add() method)
  subscriptions: Subscription;
  typeUser: any = 1;
  details: SheduleRouteModel;
  isInRoute: boolean = false;
  employeeId; // id de empleado temporal

  @Input() scheduleRouteId;
  @Input() routeTransportUnitId;

  @HostBinding('class.is-shell') get isShell() {
    return (this.details && this.details.isShell) ? true : false;
  }

  constructor(
    private routeService: RouteService,
    private modalCtrl: ModalController,
    private uiService: UiServiceService,
    private toastCtrl: ToastController
    ) { }

  ngOnInit(): void {
  }
  
  ionViewWillEnter() {
    this.typeUser = JSON.parse(localStorage.getItem('userData')).rolId.rolId;// Tipo de Usuario logeado
    this.employeeId = JSON.parse(localStorage.getItem('employeeData'))?.employeeId || undefined;  
    this.getDetailRoute();

  }

  // Abrir modal de lista de usuarios
  async openModalListUser( scheduleRouteId, dataRoute ){
    const modal = await this.modalCtrl.create({
      component: UserListingPage,
      componentProps: {
        scheduleRouteId,
        dataRoute
      }
    });
    await modal.present();
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
      this.getDetailRoute();
     }

  }

  doRefresh(event) {
    this.ionViewWillEnter();
    event.target.complete();
  }

  // Abrir modal de lista de chequeo
  async openModalStartRoute( scheduleRouteId, dataRoute ){ 
       
    const modal = await this.modalCtrl.create({
      component: ListingCheckPage,
      componentProps: {
        scheduleRouteId,
        dataRoute,
        'routeTransportUnitId': this.routeTransportUnitId
      }
    });
    await modal.present();
  }

  // Funcion que cierra el modal
  closeModal(){
    this.modalCtrl.dismiss();
  }

  // Funcion para obtener el detalle de la lista
  getDetailRoute() {
    this.details = new SheduleRouteModel();
    console.log(this.scheduleRouteId);
    
    this.routeService.getDetailsScheduleRoute( this.scheduleRouteId ).subscribe( resp => {
      this.details = resp;
      this.isInRoute = this.findEmployeeRoute( this.details.lstRouteEmployees);
      // this.generateMap( resp.routeId.stops );
    });
  }

  // Funcion para unirse a la ruta (Usuario CC)
  joinRouteEmployee() {

    let data = {
      "employeeId": {
        "employeeId": this.employeeId// Usuario actual
      },
      "scheduleRouteId": {
        "scheduleRouteId": this.details?.scheduleRouteId
      }
    }
    
    this.routeService.joinRouteEmployee(data).subscribe( resp => {
      this.uiService.toastInformativo('Usuario inscrito en ruta.','success','save');
      this.getDetailRoute();
    }, error => {
      if (error.status === 409) {
        this.uiService.toastInformativo('Este usuario ya esta en la lista de empleados de la ruta','warning','warning');
      } else {
        this.uiService.toastInformativo('Ha ocurrido un error al agregarse a la lista de empleados. intentelo de nuevo.','danger','warning');
      }
    });
  }

  // Funcion que busca si el empledo esta ingresado a la Ruta
  findEmployeeRoute(lstRouteEmployees: LstRouteEmployee[]): boolean {
    let employee = lstRouteEmployees.find( emp => emp.employeeId.employeeId === this.employeeId );
    if (employee !== undefined) {
      console.log(employee);
      
      return true;
    } else {
      return false;
    }
  }

  // Eliminar empleado de la lista
  async deleteEmployee( ) {
    const toast = await this.toastCtrl.create({
      header: '¿Realmente desea salirse de la ruta?.',
      color: 'primary',
      mode: 'ios',
      position: 'bottom',
      buttons: [
        {
          icon: 'checkbox',
          text: 'Salirme',
          handler: () => {
            this.routeService.onDeleteRouteEmployee( this.details?.scheduleRouteId, this.employeeId ).subscribe( (resp: any) => {
              this.uiService.toastInformativo('Usuario removido de la lista de empleados.','success','save');
              this.getDetailRoute();
            }, error => {
              this.uiService.toastInformativo('Error al intentar salirse de la ruta, intentelo de nuevo.','danger','warning');
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

  // Generando mapa con puntos de paradas
  generateMap(stops : RouteStop[]) {    
    mapboxgl.accessToken = 'pk.eyJ1Ijoia2V2aW5kYW5pZWxyIiwiYSI6ImNrOWE0MjBmeTF6NGwzcW15bXoxcHVubWEifQ.vWENv018FnYJvGAu1yaRrQ';
    let map;

    stops.forEach( (stop, index) => {
      if (index === 0) {
        map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [stop.lon, stop.lat],
          zoom: 10.00
        });
      }
    });

    //edificios en 3D
    map.on('load', () => {
      map.resize();
      
      stops.forEach((stop) => {        
        // create the popup
       var popup = new mapboxgl.Popup({ offset: 25 }).setText( stop.stopName );
 
       //Marker
       new mapboxgl.Marker({
         })
         .setLngLat([stop.lon, stop.lat])
         .setPopup(popup)
         .addTo(map);

      });

    });
    
  }

}
