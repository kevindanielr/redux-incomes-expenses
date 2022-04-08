import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormFindPageRoutingModule } from './form-find-routing.module';

import { FormFindPage } from './form-find.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormFindPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [FormFindPage]
})
export class FormFindPageModule {}
