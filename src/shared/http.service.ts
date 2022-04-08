import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../src/environments/environment.prod';

//Constantes
const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  
  constructor(
    private http: HttpClient
  ) { }

  // funcion generica que ejecuta un get
  get<T>( query: string ){
    query = apiURL + query;
    return this.http.get<T>( query );
  }

  // funcion generica que ejecuta un post
  post<T>( query: string, data: any ) {
    query = apiURL + query;
    return this.http.post<T>( query, data );
  }

  // funcion genreica que ejecuta un PUT
  put<T>( query: string, data: any ) {
    query = apiURL + query;
    return this.http.put<T>( query, data );
  }

  // funcion genreica que ejecuta un DELETE
  delete<T>( query: string ) {
    query = apiURL + query;
    return this.http.delete<T>( query );
  }

}
