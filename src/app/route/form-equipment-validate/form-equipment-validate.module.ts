import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormEquipmentValidatePageRoutingModule } from './form-equipment-validate-routing.module';

import { FormEquipmentValidatePage } from './form-equipment-validate.page';
import { ComponentsModule } from '../../../app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormEquipmentValidatePageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  declarations: [FormEquipmentValidatePage]
})
export class FormEquipmentValidatePageModule {}
