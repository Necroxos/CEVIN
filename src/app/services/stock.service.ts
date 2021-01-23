// Angular
import { Injectable } from '@angular/core';
// Peticiones
import { HttpClient } from '@angular/common/http';
// Modelos
import { CilindroModel } from '../models/cilindro.model';
// Servicios
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  // URL donde corre la API
  private url: string;

  constructor(private http: HttpClient, private auth: AuthService) {
    this.url = auth.url;
  }

  /**
   * Se realiza una petición a la API para obtener los cilindros que estén llenos y en bodega
   */
  obtenerCilindrosLlenos(): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/stock/llenos`, { headers });
  }

  /**
   * Se realiza una petición a la API para obtener los cilindros que estén vacíos y en bodega
   */
  obtenerCilindrosVacios(): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/stock/vacios`, { headers });
  }

  /**
   * Se realiza una petición a la API para obtener los cilindros que estén arrendados
   * (En posesión de un cliente)
   */
  obtenerCilindrosArrendados(): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/stock/arrendados`, { headers });
  }

}
