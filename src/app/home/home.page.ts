import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

  titulo: string;
  dataRoles : any [];
  version: any = "1.0.1";


  constructor(
    private menuCtrl: MenuController,
    ) {
     }

  ngOnInit() {
    this.titulo = 'ShalomApp';
    this.menuCtrl.enable(true);
  }

  // Funcion que recoge los roles del Usuario Ingresado

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

}
