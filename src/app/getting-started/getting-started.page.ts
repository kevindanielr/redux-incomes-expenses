import { isPlatformBrowser } from '@angular/common';
import { Component, AfterViewInit, ViewChild, HostBinding, Inject, PLATFORM_ID } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { AlertController, IonSlides, MenuController } from '@ionic/angular';
import { UiServiceService } from '../../shared/ui-service.service';
import { RouteService } from '../route/route.service';

@Component({
  selector: 'app-getting-started',
  templateUrl: './getting-started.page.html',
  styleUrls: [
    './styles/getting-started.page.scss',
    './styles/getting-started.shell.scss',
    './styles/getting-started.responsive.scss',
  ]
})
export class GettingStartedPage implements AfterViewInit {
  @ViewChild(IonSlides, { static: true }) slides: IonSlides;
  @HostBinding('class.last-slide-active') isLastSlide = false;

  gettingStartedForm: FormGroup;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    public menu: MenuController,
    private router: Router,
    private routerService: RouteService,
    private alertController: AlertController,
    private uiService: UiServiceService
  ) {
    this.gettingStartedForm = new FormGroup({
      browsingCategory: new FormControl('nocturno')
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

  ngAfterViewInit(): void {
    // Accessing slides in server platform throw errors
    if (isPlatformBrowser(this.platformId)) {
      // ViewChild is set
      this.slides.isEnd().then(isEnd => {
        this.isLastSlide = isEnd;
      });

      // Subscribe to changes
      this.slides.ionSlideWillChange.subscribe(changes => {
        this.slides.isEnd().then(isEnd => {
          this.isLastSlide = isEnd;
        });
      });
    }
  }

  async alertExpressUser() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'identifícate',
      inputs: [
        {
          name: 'expressUserId',
          type: 'text',
          placeholder: 'DUI/Pasaporte/Teléfono'
        },
      ],
      buttons: [
        {
          text: 'ACEPTAR',
          handler: ( data ) => {

            if (data.expressUserId === '') {
              this.uiService.toastInformativo('El campo de número de identificación esta vacio.','warning','warning');
              return;
            } 

            this.routerService.getExpressUser( data.expressUserId ).subscribe( (resp: any) => {
              localStorage.setItem('userExpress', JSON.stringify(resp))
              this.uiService.toastInformativo('Bienvenid@ ' + resp.name + ", disfruta de nuestro servicio Express.",'success','save');
              this.router.navigate(['listing-express']);
            }, error => {
              console.log(error);
              this.routerService.getExpressUserPhone( data.expressUserId ).subscribe( (resp: any) => {
                localStorage.setItem('userExpress', JSON.stringify(resp))
                this.uiService.toastInformativo('Bienvenid@ ' + resp.name + ", disfruta de nuestro servicio Express.",'success','save');
                this.router.navigate(['listing-express']);
              }, error => {
                  this.uiService.toastInformativo("Usuario express no registrado, por favor presione registrar y complete sus datos.",'warning','warning');
              })
            })
            
          }
        }, {
          text: 'REGISTRARSE',
          handler: () => {
            this.router.navigate(['auth/signup']);
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

  gotoMenu() {
    localStorage.setItem('typeMenu', this.gettingStartedForm.controls.browsingCategory.value);
    if (this.gettingStartedForm.controls.browsingCategory.value !== 'express') {
      this.router.navigate(['auth/login']);
    } else {
      this.alertExpressUser();
    }
  }
}
