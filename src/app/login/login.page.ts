import { Component } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../../../src/shared/auth.service';
import { UiServiceService } from '../../../src/shared/ui-service.service';
import OneSignal from 'onesignal-cordova-plugin';
import { RouteService } from '../route/route.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: [
    './styles/login.page.scss',
    './styles/walkthrough.page.scss',
    './styles/walkthrough.responsive.scss'
  ]
})
export class LoginPage {
  loginForm: FormGroup;

  validation_messages = {
    'email': [
      { type: 'required', message: 'Correo electronico es requerido.' },
      { type: 'pattern', message: 'Introduzca un correo electrónico válido.' }
    ],
    'password': [
      { type: 'required', message: 'La contraseña es requerida.' },
      { type: 'minlength', message: 'La contraseña debe tener al menos 5 caracteres.' }
    ]
  };

  constructor(
    public router: Router,
    public menu: MenuController,
    private auth: AuthService,
    private uiService: UiServiceService,
    private routeService: RouteService
  ) {
    this.loginForm = new FormGroup({
      'userEmail': new FormControl('', Validators.compose([
        Validators.required,
        // Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'password': new FormControl('', Validators.compose([
        Validators.minLength(3),
        Validators.required
      ]))
    });
  }

  // Disable side menu for this page
  ionViewDidEnter(): void {
    this.menu.enable(false);
  }

  // Restore to default when leaving this page
  ionViewDidLeave(): void {
    this.menu.enable(true);
  }

  // Login
  async doLogin() {

    if ( this.loginForm.invalid ) {
      this.uiService.toastInformativo('Algunos campos no han sido completados correctamente','warning','warning');
      return Object.values( this.loginForm.controls ).forEach( control =>{
  
        if ( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( control => control.markAllAsTouched() )
        }
        control.markAsTouched();
      });
    }

    //login
    await this.auth.login( this.loginForm.value ).subscribe( (resp: any) => {
      console.log(resp);
      this.auth.setToken( resp.token );

      // Guardando datos del empleado
      window.localStorage.setItem("userData", JSON.stringify(resp) );
      this.uiService.toastInformativo(`Bienvenid@ a Transportes Shalom ${resp.userName}.`, 'success', 'checkmark-circle');
      if ( resp.rolId.rolId === 5 ) {
        this.getDriverData(resp.userId);
      } else if (resp.rolId.rolId === 1 || resp.rolId.rolId === 2) {
        this.getEmployeeData(resp.userId);
      } 
      this.router.navigate(['home']);

      // obteniendo userId, unico de dispositivo
      try {
        OneSignal.getDeviceState( resp => {
          console.log("State: ", resp);
          let data = {
            "deviceId": resp.userId,
            "userId": JSON.parse(localStorage.getItem("userData"))?.userId
          };

          this.routeService.onUpdateDevice(data).subscribe( resp => {
            console.log("Se actualizo el device ID: ", resp);
          }, error => {
            console.log("No se actualizo el device ID");
          });
        });
      } catch (error) {
        console.log("*** Utilizando navegador Web *** Notificaciones Onesignal ");
        
      }

    }, error => {
      this.loginForm.reset();
      if (error.status === 403) {
        this.uiService.toastInformativo('Usuario/Contraseña incorrectos, intente nuevamente.','warning','warning');
      } else {
        this.uiService.toastInformativo('Ha ocurrido un error en la comunicación con el servidor, intentalo de nuevo.','danger','warning');
      }
      
    })

  }

  getEmployeeData( userId ) {
    this.auth.getDataEmployee(userId).subscribe( resp => {
      localStorage.setItem('employeeData', JSON.stringify(resp));
    });
  }

  getDriverData(userId) {
    this.auth.getDataDriver(userId).subscribe( resp => {
      localStorage.setItem('driverData', JSON.stringify(resp));
    });
  }

}
