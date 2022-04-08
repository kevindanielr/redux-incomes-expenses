import { Injectable } from '@angular/core';
import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  userId: any;

  constructor(
    private oneSignal: OneSignal,
    private router: Router,
  ) { }

  configuracionInicial(){
    console.log("ENTRANDO CONFIGURACION DE PUSH NOTIFICATION");
    
    this.oneSignal.startInit('daf2f77a-b2d5-4d09-9e86-2dfeb39244ab', '584745899075');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe((noti) => {
     // do something when notification is received
     console.log("Notificación recibida", noti );
     
    });

    this.oneSignal.handleNotificationOpened().subscribe((noti) => {
      // do something when a notification is opened
      console.log("Notificación abierta", noti );
      this.router.navigate(['alertas']);
    });

    // Obtenr ids del subscriptor
    this.oneSignal.getIds().then( info => {
      this.userId = info.userId;
      console.log("userid: ", this.userId);
      
    } );

    this.oneSignal.endInit();
  }


}
