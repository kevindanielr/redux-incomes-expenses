import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListingRequestDiurnoPage } from './listing-request-diurno.page';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from '../../components/components.module';
import { RouteService } from '../route.service';
import { PipesModule } from '../../pipes/pipes.module';
import { RequestDiurnoPageModule } from '../request-diurno/request-diurno.module';
import { ListingAsignPageModule } from '../listing-asign/listing-asign.module';

const routes: Routes = [
  {
    path: '',
    component: ListingRequestDiurnoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    PipesModule,
    RequestDiurnoPageModule,
    ListingAsignPageModule,
    PipesModule
  ],
  providers: [
    RouteService
  ],
  declarations: [ListingRequestDiurnoPage]
})
export class ListingRequestDiurnoPageModule {}
