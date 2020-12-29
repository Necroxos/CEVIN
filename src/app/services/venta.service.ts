// Angular
import { Injectable } from '@angular/core';
// Peticiones
import { HttpClient } from '@angular/common/http';
// Modelos
import { VentaModel } from '../models/venta.model';
// Servicios
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  // URL donde corre la API
  private url: string;

  constructor(private http: HttpClient, private auth: AuthService) {
    this.url = auth.url;
  }

  /**
   * Manda la data a la API para registrar la venta en la base de datos
   * @param venta Recibe un modelo de venta
   *                  (codigo, finalizado, cliente_id, fecha_entrega, cilindros)
   */
  registrar(venta: VentaModel): any {
    const headers = this.auth.headers();
    return this.http.post(`${this.url}/venta`, venta, { headers });
  }

  /**
   * Se realiza una petición a la API para obtener un [venta] por medio de su [codigo]
   * @param venta Recibe un modelo de venta
   */
  obtenerUno(venta: VentaModel): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/venta/${venta.codigo}`, { headers });
  }

  /**
   * Se realiza una petición a la API para obtener todas las ventas
   * @param venta Recibe un modelo de venta
   */
  obtenerTodos(): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/ventas`, { headers });
  }
}
