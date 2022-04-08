import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormEquipmentPageRoutingModule } from './form-equipment-routing.module';

import { FormEquipmentPage } from './form-equipment.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormEquipmentPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  declarations: [FormEquipmentPage]
})
export class FormEquipmentPageModule {}
