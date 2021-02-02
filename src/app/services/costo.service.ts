// Angular
import { Injectable } from '@angular/core';
// Peticiones
import { HttpClient } from '@angular/common/http';
// Servicios
import { AuthService } from './auth.service';
// Modelo
import { CostoModel } from '../models/costo.model';

@Injectable({
  providedIn: 'root'
})
export class CostoService {

  // URL donde corre la API
  private url: string;

  constructor(private http: HttpClient, private auth: AuthService) {
    this.url = auth.url;
  }

  /**
   * Manda la data a la API para registrar el costo unitario de un gas
   * @param costo Recibe un modelo Costo
   */
  registrar(costo: CostoModel): any {
    const headers = this.auth.headers();
    return this.http.post(`${this.url}/costo`, costo, { headers });
  }

  /**
   * Manda la data a la API para actualizar el costo unitario de un gas
   * @param costo Recibe un modelo Costo
   */
  actualizar(costo: CostoModel): any {
    const headers = this.auth.headers();
    return this.http.put(`${this.url}/costo`, costo, { headers });
  }
}
