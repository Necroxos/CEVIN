// Angular
import { Injectable } from '@angular/core';
// Peticiones
import { HttpClient } from '@angular/common/http';
// Servicios
import { AuthService } from './auth.service';
// Modelos
import { ZonaModel } from '../models/zona.model';
import { EstandarModel } from '../models/estandar.model';

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
   * Se realiza una petición a la API para obtener todas las [comunas] de la base de datos
   * que posean [activo = true]
   */
  obtenerActivos(): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/zona/activas`, { headers });
  }

  /**
   * Se realiza una petición a la API para obtener las [zonas] de una comuna
   */
  obtenerPorComuna(id: number): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/zonas/comuna/${id}`, { headers });
  }

  /**
   * Manda la data a la API para registrar la zona en la base de datos
   * @param zona Recibe un modelo estándar
   */
  registrar(zona: ZonaModel): any {
    const headers = this.auth.headers();
    return this.http.post(`${this.url}/zona`, zona, { headers });
  }

  /**
   * Manda la data a la API para actualizar la zona en la base de datos
   * @param zona Recibe un modelo estándar
   */
  actualizar(zona: ZonaModel): any {
    const headers = this.auth.headers();
    return this.http.put(`${this.url}/zona`, zona, { headers });
  }

  /**
   * Manda la data a la API para actualizar el estado de una zona en la base de datos
   * @param zona Recibe un modelo de estándar
   */
  cambiarEstado(zona: EstandarModel): any {
    const headers = this.auth.headers();
    return this.http.put(`${this.url}/cambio-estado/zona`, zona, { headers });
  }

}
