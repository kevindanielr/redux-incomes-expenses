import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FindEmployeePageRoutingModule } from './find-employee-routing.module';

import { FindEmployeePage } from './find-employee.page';
import { ComponentsModule } from '../../../app/components/components.module';
import { RouteService } from '../route.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FindEmployeePageRoutingModule,
    ComponentsModule
  ],
  declarations: [FindEmployeePage],
  providers: [RouteService]
})
export class FindEmployeePageModule {}
