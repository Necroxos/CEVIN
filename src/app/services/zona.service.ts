// Angular
import { Injectable } from '@angular/core';
// Peticiones
import { HttpClient } from '@angular/common/http';
// Servicios
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ZonaService {

  // URL donde corre la API
  private url: string;

  constructor(private http: HttpClient, private auth: AuthService) {
    this.url = auth.url;
  }

  /**
   * Se realiza una petición a la API para obtener todas las [zonas] de la base de datos
   */
  obtenerTodos(): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/zonas`, { headers });
  }

  /**
   * Se realiza una petición a la API para obtener las [zonas] de una comuna
   */
  obtenerPorComuna(id: number): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/zonas/comuna/${id}`, { headers });
  }

}
