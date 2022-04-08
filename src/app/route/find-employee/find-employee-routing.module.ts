import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FindEmployeePage } from './find-employee.page';

const routes: Routes = [
  {
    path: '',
    component: FindEmployeePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FindEmployeePageRoutingModule {}
