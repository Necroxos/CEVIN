// Angular
import { Injectable } from '@angular/core';
// Peticiones
import { HttpClient, HttpHeaders } from '@angular/common/http';
// Servicios
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PropietarioService {

  // URL donde corre la API
  private url = 'http://localhost:3000';

  constructor(private http: HttpClient, private auth: AuthService) { }

  /**
   * Se realiza una petición a la API para obtener todos los [propietarios] de la base de datos
   */
  obtenerTodos(): any {
    const headers = new HttpHeaders({ Authorization: this.auth.leerToken() });
    return this.http.get(`${this.url}/propietarios`, { headers });
  }

}
