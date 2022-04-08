import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestDiurnoPage } from './request-diurno.page';
import { RouteService } from '../route.service';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [RequestDiurnoPage],
  providers: [
    RouteService
  ]
})
export class RequestDiurnoPageModule {}
