import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';
import { ProfileComponent } from './profile.component';
import { Routes, RouterModule } from '@angular/router';
import { RouteService } from '../route.service';

import { NgxBarcodeModule } from 'ngx-barcode';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    PipesModule,
    NgxBarcodeModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ProfileComponent],
  providers:[RouteService]
})
export class ProfilePageModule {}
