import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormFindPage } from './form-find.page';

const routes: Routes = [
  {
    path: '',
    component: FormFindPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormFindPageRoutingModule {}
