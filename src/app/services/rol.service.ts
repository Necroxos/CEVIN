// Angular
import { Injectable } from '@angular/core';
// Peticiones
import { HttpClient } from '@angular/common/http';
// Servicios
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  // URL donde corre la API
  private url: string;

  constructor(private http: HttpClient, private auth: AuthService) {
    this.url = auth.url;
  }

  /**
   * Se realiza una petición a la API para obtener todos los [roles] de la base de datos
   */
  obtenerTodos(): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/roles`, { headers });
  }

}
