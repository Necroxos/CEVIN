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
export class PropietarioService {

  // URL donde corre la API
  private url: string;

  constructor(private http: HttpClient, private auth: AuthService) {
    this.url = auth.url;
  }

  /**
   * Se realiza una petición a la API para obtener todos los [propietarios] de la base de datos
   */
  obtenerTodos(): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/propietarios`, { headers });
  }

  /**
   * Se realiza una petición a la API para obtener todos los [propietarios] de la base de datos
   * que posean [activo = true]
   */
  obtenerActivos(): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/propietarios/activos`, { headers });
  }

  /**
   * Manda la data a la API para registrar el propietario en la base de datos
   * @param propietario Recibe un modelo estándar
   */
  registrar(propietario: EstandarModel): any {
    const headers = this.auth.headers();
    return this.http.post(`${this.url}/propietario`, propietario, { headers });
  }

  /**
   * Manda la data a la API para actualizar el propietario en la base de datos
   * @param propietario Recibe un modelo estándar
   */
  actualizar(propietario: EstandarModel): any {
    const headers = this.auth.headers();
    return this.http.put(`${this.url}/propietario`, propietario, { headers });
  }

  /**
   * Manda la data a la API para actualizar el estado de un propietario en la base de datos
   * @param propietario Recibe un modelo de estándar
   */
  cambiarEstado(propietario: EstandarModel): any {
    const headers = this.auth.headers();
    return this.http.put(`${this.url}/cambio-estado/propietario`, propietario, { headers });
  }

}
