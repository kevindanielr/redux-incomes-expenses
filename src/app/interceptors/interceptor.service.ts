import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { UiServiceService } from '../../shared/ui-service.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(
    private router: Router,
    private uiService: UiServiceService
  ) { }

  token: string = null;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.token = localStorage.getItem("token");
    if (!req.url.includes('expressuser') && !req.url.includes('expressrequest')) {

    } else {
      console.log("Usuario Express");
    }

    // Agregando cabeceras
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    }); 

    let reqClone;
    reqClone = req.clone({ headers });

    return next.handle( reqClone ).pipe(
      tap( data => {

      }),
      catchError( error => {
        console.log("Interceptor");
        
        if (error.status === 401) {
          this.uiService.toastInformativo('La sesión caduca periódicamente para mantener la seguridad, vuelva a ingresar sus credenciales.','warning','exit');
          this.router.navigate(['auth/login']);
        }
        return throwError(error);

      })

    );
  }

}
