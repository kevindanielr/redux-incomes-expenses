import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormEquipmentPage } from './form-equipment.page';

const routes: Routes = [
  {
    path: '',
    component: FormEquipmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormEquipmentPageRoutingModule {}
