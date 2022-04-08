import { AnimationBuilder } from '@angular/animations';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UiServiceService {

  constructor( public toastCtrl: ToastController) { }

  //Toast
  async toastInformativo( message: string , color: string, icon: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 4000,
      mode: 'ios',
      icon,
      color,
      keyboardClose: true,
      buttons: [
        {
          text: 'x',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    toast.present();
  }

  async toastInformativoContact( message: string , color: string, icon: string) {
    const toast = await this.toastCtrl.create({
      message: `<ion-icon name="${ icon }"></ion-icon> ${ message }`,
      duration: 500,
      mode: 'ios',
      position:"top",
      leaveAnimation: undefined,
      color
    });

    toast.present();
  }


}
