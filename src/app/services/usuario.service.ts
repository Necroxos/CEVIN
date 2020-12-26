// Angular
import { Injectable } from '@angular/core';
// Peticiones
import { HttpClient } from '@angular/common/http';
// Servicios
import { AuthService } from './auth.service';
import { UsuarioModel } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // URL donde corre la API
  private url: string;

  constructor(private http: HttpClient, private auth: AuthService) {
    this.url = auth.url;
  }

  /**
   * Manda la data a la API para registrar el usuario en la base de datos
   * @param usuario Recibe un modelo de usuario
   *                  (nombre, apellido, dni, dv, email, password, rol_id)
   */
  registrar(usuario: UsuarioModel): any {
    const headers = this.auth.headers();
    return this.http.post(`${this.url}/usuario`, usuario, { headers });
  }

  /**
   * Se realiza una petición a la API para obtener un [usuario] por medio de su [rut]
   * @param usuario Recibe un modelo de usuario
   */
  obtenerUno(usuario: UsuarioModel): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/usuario/${usuario.rut}`, { headers });
  }

  /**
   * Se realiza una petición a la API para obtener todos los usuarios
   * @param usuario Recibe un modelo de usuario
   */
  obtenerTodos(): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/usuarios`, { headers });
  }

  /**
   * Manda la data a la API para actualizar el usuario en la base de datos
   * @param usuario Recibe un modelo de usuario
   */
  actualizar(usuario: UsuarioModel): any {
    const headers = this.auth.headers();
    return this.http.put(`${this.url}/usuario`, usuario, { headers });
  }

  /**
   * Manda la data a la API para actualizar el estado de un usuario en la base de datos
   * @param usuario Recibe un modelo de usuario
   */
  cambiarEstado(usuario: UsuarioModel): any {
    const headers = this.auth.headers();
    return this.http.put(`${this.url}/cambio-estado/usuario`, usuario, { headers });
  }

  /**
   * Esta función guarda el rut del Usuario y lo almacena en local
   * @param usuario Recibe el usuario del que se desea guardar información
   */
  guardarUsuario(usuario: UsuarioModel): void {
    localStorage.setItem('usuario', usuario.dni + '-' + usuario.dv);
  }

  /**
   * Leemos la información del usuario guardada para regresarla al componente
   * Y la quitamos de la memoria local
   */
  leerUsuario(): string {
    const rut = localStorage.getItem('usuario');
    localStorage.removeItem('usuario');
    return rut;
  }

}
