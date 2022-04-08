import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    
  apiURL = environment.apiURL;
  token: string = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login( body ) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post( this.apiURL + `user/login`, body, {headers} );
  }

  // Guardar token
  async setToken(token : string) {
    this.token = token;
    if (this.token != null) {
      window.localStorage.setItem("token", this.token);
    }
  }

  // obtener token
  async getToken() {
    if (window.localStorage.getItem("token") != null) {
      this.token = window.localStorage.getItem("token");
      return this.token;
    } else {
      return null;
    }
  }

  // validar TOKEN y se guarda Usuario
  async validaToken(): Promise < boolean > {
    await this.getToken(); // Verifica si existe el token en el LocalStorage

    if (!this.token) { // si no existe el token 
      this.router.navigate(['auth/login']);
      return Promise.resolve(false);
    }

    //Si existe el token en el LocalStorage
    return new Promise < boolean > (resolve => {

      if (this.token !== null) {
        resolve(true);
      } else {
        this.router.navigate(['']);
        resolve(false);
      }
    });
  }

  getDataEmployee( userId ) {
    return this.http.get( this.apiURL + `employee/user/${userId}`);
  }

  getDataDriver( userId ) {
    return this.http.get( this.apiURL + `driver/user/${userId}`);
  }

  // Funcion para agregar un usuario express
  onSaveExpressUser(data) {
    return this.http.post( this.apiURL + `expressuser`, data);
  }

}
