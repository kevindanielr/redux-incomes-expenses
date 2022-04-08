import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../components/components.module';

import { RouteService } from '../route.service';
import { RouteListingPage } from './route-listing.page';
import { PipesModule } from '../../pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: RouteListingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    PipesModule
  ],
  declarations: [
    RouteListingPage
  ],
  providers: [
    RouteService
  ]
})
export class RouteListingPageModule {}
