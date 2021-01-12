// Angular
import { Injectable } from '@angular/core';
// Peticiones
import { HttpClient } from '@angular/common/http';
// Modelos
import { EstandarModel } from '../models/estandar.model';
// Servicios
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TipoGasService {

  // URL donde corre la API
  private url: string;

  constructor(private http: HttpClient, private auth: AuthService) {
    this.url = auth.url;
  }

  /**
   * Se realiza una petición a la API para obtener todos los [tipoGas] de la base de datos
   */
  obtenerTodos(): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/gases`, { headers });
  }

  /**
   * Se realiza una petición a la API para obtener todos los [tipoGas] de la base de datos
   * que posean [activo = true]
   */
  obtenerActivos(): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/gases/activos`, { headers });
  }

  /**
   * Manda la data a la API para registrar el tipo en la base de datos
   * @param tipo Recibe un modelo de estándar
   */
  registrar(tipo: EstandarModel): any {
    const headers = this.auth.headers();
    return this.http.post(`${this.url}/gas`, tipo, { headers });
  }

  /**
   * Manda la data a la API para actualizar el tipo de gas en la base de datos
   * @param tipo Recibe un modelo estándar
   */
  actualizar(tipo: EstandarModel): any {
    const headers = this.auth.headers();
    return this.http.put(`${this.url}/gas`, tipo, { headers });
  }

  /**
   * Manda la data a la API para actualizar el estado de un tipo de gas en la base de datos
   * @param tipo Recibe un modelo de estándar
   */
  cambiarEstado(tipo: EstandarModel): any {
    const headers = this.auth.headers();
    return this.http.put(`${this.url}/cambio-estado/gas`, tipo, { headers });
  }

}
