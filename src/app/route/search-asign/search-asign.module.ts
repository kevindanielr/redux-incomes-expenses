import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchAsignPageRoutingModule } from './search-asign-routing.module';

import { SearchAsignPage } from './search-asign.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchAsignPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SearchAsignPage]
})
export class SearchAsignPageModule {}
