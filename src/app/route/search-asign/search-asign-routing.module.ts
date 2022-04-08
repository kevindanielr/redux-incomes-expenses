import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchAsignPage } from './search-asign.page';

const routes: Routes = [
  {
    path: '',
    component: SearchAsignPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchAsignPageRoutingModule {}
