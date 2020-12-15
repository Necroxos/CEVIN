// Angular
import { Injectable } from '@angular/core';
// Peticiones
import { HttpClient, HttpHeaders } from '@angular/common/http';
// Modelos
import { TipoGasModel } from '../models/tipo.model';
// Servicios
import { AuthService } from './auth.service';

export interface GithubApi {
  items: TipoGasModel[];
  total_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class TipoGasService {

  // URL donde corre la API
  private url = 'http://localhost:3000';

  constructor(private http: HttpClient, private auth: AuthService) { }

  /**
   * Se realiza una petición a la API para obtener un [tipoGas] por medio de su [codigo_activo]
   * @param tipoGas Recibe un modelo de tipoGas
   */
  obtenerTodos(): any {
    const headers = new HttpHeaders({ Authorization: this.auth.leerToken() });
    return this.http.get(`${this.url}/gases`, { headers });
  }

}
