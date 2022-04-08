import { Component } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, MenuController } from '@ionic/angular';
import { AuthService } from '../../shared/auth.service';
import { UiServiceService } from '../../shared/ui-service.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: [
    './styles/signup.page.scss'
  ]
})
export class SignupPage {
  signupForm: FormGroup;
  constructor(
    public router: Router,
    public modalController: ModalController,
    public menu: MenuController,
    private fb: FormBuilder,
    private authService: AuthService,
    private uiService: UiServiceService
  ) {
    this.signupForm = this.fb.group({
      identifier: [null, Validators.required],
      name: [null, Validators.required],
      phone: [null, Validators.required]
    });
  }

  // Getters
  get identifierValido() {
    return this.signupForm.get('identifier').invalid && this.signupForm.get('identifier').touched;
  }

  get nameValido() {
    return this.signupForm.get('name').invalid && this.signupForm.get('name').touched;
  }

  get phoneValido() {
    return this.signupForm.get('phone').invalid && this.signupForm.get('phone').touched;
  }

  // Disable side menu for this page
  ionViewDidEnter(): void {
    this.menu.enable(false);
  }

  // Restore to default when leaving this page
  ionViewDidLeave(): void {
    this.menu.enable(true);
  }

  doSignup() {

    if ( this.signupForm.invalid ) {
      this.uiService.toastInformativo('El formulario tiene campos requeridos.','warning','warning');
      return Object.values( this.signupForm.controls ).forEach( control =>{
        if ( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( control => control.markAllAsTouched() )
        }
        control.markAsTouched();
      });
    }

    this.authService.onSaveExpressUser(this.signupForm.value).subscribe( (resp: any) => {
      this.uiService.toastInformativo('Usuario express registrado correctamente, Bievenid@ ' + resp.name + ".",'success','save');
      localStorage.setItem('userExpress', JSON.stringify(resp));
      this.router.navigate(['listing-express']);
    }, error => {
      console.log(error);
      if (error.status === 302) {
        this.uiService.toastInformativo('El usuario ya existe, regrese al menú de servicios e ingrese su DUI/Pasaporte/Teléfono.','warning','warning');
      } else {
        this.uiService.toastInformativo('Ha ocurrido un error interno, comunícate con soporte técnico.','warning','warning');
      }
    })
  }
}
