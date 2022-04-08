import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NgFloorPipeModule } from 'angular-pipes';

import { TimeDifferencePipe } from './time-difference.pipe';
import { TimeAgoPipe } from './time-ago.pipe';
import { FiltroEmpleadoPipe } from './filtro-empleado.pipe';
import { FiltroBusquedaPipe } from './filtro-busqueda.pipe';
import { FiltroAsignPipe } from './filtro-asign.pipe';
import { filtroDiurnoPipe } from './filtro-diurno.pipe';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    NgFloorPipeModule
  ],
  declarations: [
    TimeDifferencePipe,
    TimeAgoPipe,
    FiltroEmpleadoPipe,
    FiltroBusquedaPipe,
    FiltroAsignPipe,
    filtroDiurnoPipe
  ],
  exports: [
    NgFloorPipeModule,
    TimeDifferencePipe,
    TimeAgoPipe,
    FiltroEmpleadoPipe,
    FiltroBusquedaPipe,
    FiltroAsignPipe,
    filtroDiurnoPipe
  ]
})
export class PipesModule {}
