// Angular
import { Injectable } from '@angular/core';
// Peticiones a la API
import { HttpClient, HttpHeaders } from '@angular/common/http';
// Decoder para el token
import jwt_decode from 'jwt-decode';
// Modelos para la información
import { LoginModel } from '../models/login.model';
// Operadores para mapear la infrormación de las respuestas
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // URL donde corre la API
  readonly url = 'http://192.168.0.9:3000';

  // Guardamos el token del usuario
  userToken: string;
  esAdmin = false;
  esAuth = false;

  constructor(private http: HttpClient) {
    this.actualializar();
  }

  // Remueve el token al finalizar la sesión
  logout(): void {
    localStorage.removeItem('token');
    this.actualializar();
    return;
  }

  // Cargamos el header para las peticiones
  headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: this.leerToken() });
  }

  /**
   * Verifica que el usuario esté en el sistema
   * Mandando la información al Back End
   * Y se le devuelve el token de verificación
   * @param usuario Recibe la información de sesión (email/pass)
   */
  login(usuario: LoginModel): any {
    return this.http.post(`${this.url}/login`,
      usuario
    ).pipe(
      map((resp: any) => {
        this.guardarToken(resp['token']);
        this.actualializar();
        return resp;
      }, (err: any) => {
        return err;
      })
    );
  }

  // Actualiza la información ante cambios
  actualializar(): void {
    this.esAdmin = this.esAdministrador();
    this.esAuth = this.estaAutenticado();
  }

  /**
   * Guarda el token recibido en una variable local
   * Y en las cookies del navegador
   * @param idToken Recibe el token completo como un string
   */
  private guardarToken(idToken: string): void {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);
  }

  /**
   * Se lee cada vez que se desea verificar el token de las cookies
   * Y se guarda en la variable local
   */
  leerToken(): string {
    if (localStorage.getItem('token')) { this.userToken = localStorage.getItem('token'); }
    else { this.userToken = ''; }

    return this.userToken;
  }

  /**
   * Verifica que el usuario tenga un token y que sea válido
   * (Obs: El Back End también verifica que el token no esté manipulado para sus rutas)
   */
  estaAutenticado(): boolean {
    this.leerToken();
    if (this.userToken.length < 2) { return false; }

    const token = jwt_decode(this.userToken);
    const tokenDate = new Date(token['exp'] * 1000);

    return (tokenDate > new Date() ? true : false);
  }

  /**
   * Verifica que el usuario autenticado tenga permisos de administrador
   * (Obs: El Back End también verifica que el token no esté manipulado para sus rutas)
   */
  esAdministrador(): any {
    this.leerToken();
    if (this.userToken.length < 2) { return false; }
    const token = jwt_decode(this.userToken);

    if (token['usuario']['id'] === 1) { return true; }
    return false;
  }

}
