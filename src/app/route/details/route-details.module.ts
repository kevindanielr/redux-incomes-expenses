
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../components/components.module';

import { RouteService } from '../route.service';
import { RouteDetailsPage } from './route-details.page';
import { UserListingPageModule } from '../listing-user/listing-user.module';
import { AsignRoutePageModule } from '../asign-route/asign-route.module';
import { ListingAsignPageModule } from '../listing-asign/listing-asign.module';
import { ListingCheckPageModule } from '../listing-check/listing-check.module';

const routes: Routes = [
  {
    path: '',
    component: RouteDetailsPage,
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    UserListingPageModule,
    AsignRoutePageModule,
    ListingAsignPageModule,
    ListingCheckPageModule
  ],
  declarations: [
    RouteDetailsPage
  ],
  exports: [
  ],
  providers: [
    RouteService
  ],
  entryComponents: [
    
  ]
})
export class RouteDetailsPageModule {}
