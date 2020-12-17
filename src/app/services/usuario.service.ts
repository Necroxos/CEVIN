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

}
