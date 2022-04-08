import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../components/components.module';


import { RouteService } from '../route.service';
import { UserListingPage } from './listing-user.page';
import { PipesModule } from '../../pipes/pipes.module';

import { CdTimerModule } from 'angular-cd-timer';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    PipesModule,
    CdTimerModule
  ],
  declarations: [UserListingPage],
  providers: [
    RouteService
  ]
})
export class UserListingPageModule {}
