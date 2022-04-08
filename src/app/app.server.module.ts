import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// Tell Ionic components how to render on the server
import { IonicServerModule } from '@ionic/angular-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { InterceptorService } from '../app/interceptors/interceptor.service';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    IonicServerModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true},
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
