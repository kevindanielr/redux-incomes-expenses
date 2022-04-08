import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';


import { ListingExpressPage } from './listing-express.page';
import { RouteService } from '../route.service';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';
import { RequestExpressPageModule } from '../request-express/request-express.module';

const routes: Routes = [
  {
    path: '',
    component: ListingExpressPage,
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ComponentsModule,
    RequestExpressPageModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ListingExpressPage],
  providers: [
    RouteService
  ]
})
export class ListingExpressPageModule {}
