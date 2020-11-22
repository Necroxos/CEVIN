import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';

import { map } from 'rxjs/operators';
import { LoginModel } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'http://localhost:3000';

  userToken: string;

  constructor(private http: HttpClient) {
    this.leerToken();
  }


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expira');
  }

  login(usuario: LoginModel) {

    return this.http.post(`${this.url}/login`,
      usuario
    ).pipe(
      map( resp => {
        this.guardarToken( resp['token'] );
        return resp;
      })
    );
  }

  nuevoUsuario(usuario: UsuarioModel) {

    const authData = {
      ...usuario,
      returnSecureToken: true
    };

    return this.http.post(`${this.url}/usuario`, authData);
      // .pipe(
      //   map(resp => {
      //     this.guardarToken(resp['token']);
      //     return resp;
      //   })
      // );
  }


  private guardarToken(idToken: string) {

    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let hoy = new Date();
    hoy.setSeconds(3600);

    localStorage.setItem('expira', hoy.getTime().toString());
  }

  leerToken() {

    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }


  estaAutenticado(): boolean {

    if (this.userToken.length < 2) {
      return false;
    }

    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if (expiraDate > new Date()) {
      return true;
    } else {
      return false;
    }

  }

}
