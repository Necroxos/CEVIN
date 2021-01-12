// Angular
import { Injectable } from '@angular/core';
// Peticiones
import { HttpClient } from '@angular/common/http';
// Servicios
import { AuthService } from './auth.service';
// Modelos
import { EstandarModel } from '../models/estandar.model';

@Injectable({
  providedIn: 'root'
})
export class ComunaService {

  // URL donde corre la API
  private url: string;

  constructor(private http: HttpClient, private auth: AuthService) {
    this.url = auth.url;
  }

  /**
   * Se realiza una petición a la API para obtener todas las [comunas] de la base de datos
   */
  obtenerTodos(): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/comunas`, { headers });
  }

  /**
   * Se realiza una petición a la API para obtener todas las [comunas] de la base de datos
   * que posean [activo = true]
   */
  obtenerActivos(): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/comunas/activas`, { headers });
  }

  /**
   * Manda la data a la API para registrar la comuna en la base de datos
   * @param comuna Recibe un modelo estándar
   */
  registrar(comuna: EstandarModel): any {
    const headers = this.auth.headers();
    return this.http.post(`${this.url}/comuna`, comuna, { headers });
  }

  /**
   * Manda la data a la API para actualizar la comuna en la base de datos
   * @param comuna Recibe un modelo estándar
   */
  actualizar(comuna: EstandarModel): any {
    const headers = this.auth.headers();
    return this.http.put(`${this.url}/comuna`, comuna, { headers });
  }

  /**
   * Manda la data a la API para actualizar el estado de una comuna en la base de datos
   * @param comuna Recibe un modelo de estándar
   */
  cambiarEstado(comuna: EstandarModel): any {
    const headers = this.auth.headers();
    return this.http.put(`${this.url}/cambio-estado/comuna`, comuna, { headers });
  }

}
