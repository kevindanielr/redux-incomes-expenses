import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListingCheckPage } from './listing-check.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';
import { CdTimerModule } from 'angular-cd-timer';
import { FormEquipmentValidatePageModule } from '../../../app/route/form-equipment-validate/form-equipment-validate.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PipesModule,
    CdTimerModule,
    FormEquipmentValidatePageModule
  ],
  declarations: [ListingCheckPage]
})
export class ListingCheckPageModule {}
