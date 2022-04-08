import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormEquipmentValidatePage } from './form-equipment-validate.page';

const routes: Routes = [
  {
    path: '',
    component: FormEquipmentValidatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormEquipmentValidatePageRoutingModule {}
