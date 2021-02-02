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
   * Se realiza una petición a la API para obtener un [venta] por medio de su [codigo]
   * @param venta Recibe un modelo de venta
   */
  obtenerUno(venta: VentaModel): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/venta/${venta.codigo}`, { headers });
  }

  /**
   * Se realiza una petición a la API para obtener todas las ventas
   */
  obtenerTodos(): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/ventas`, { headers });
  }

  /**
   * Se realiza una petición a la API para obtener todos los tipos de atrasos
   */
  obtenerClientes(): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/clientes/venta`, { headers });
  }

  /**
   * Se realiza una petición a la API para obtener todos los activos de tipo [cilindro]
   * Relacionados a una [Venta]
   */
  obtenerCilindros(): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/ventas/cilindros`, { headers });
  }

  /**
   * Se realiza una petición a la API para obtener todos los tipos de atrasos
   */
  obtenerDemoras(): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/demoras`, { headers });
  }

  /**
   * Se realiza una petición a la API para obtener todos los activos de tipo [cilindro]
   * Relacionados a una [Venta]
   */
  obtenerCilindrosDeVenta(venta: VentaModel): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/cilindros/venta/${venta.venta_id}`, { headers });
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
   * Manda la data a la API para actualizar la venta en la base de datos
   * @param venta Recibe un modelo de venta
   *                  (codigo, finalizado, cliente_id, fecha_entrega, cilindros)
   */
  actualizar(venta: VentaModel): any {
    const headers = this.auth.headers();
    return this.http.put(`${this.url}/venta`, venta, { headers });
  }

  /**
   * Manda la data a la API para realizar la devolución de un cilindro
   * @param venta Recibe un modelo de venta
   *                  (finalizado, venta_id, fecha_retorno, cilindro_id)
   */
  devolverCilindro(venta: VentaModel): any {
    const headers = this.auth.headers();
    return this.http.put(`${this.url}/devolver/cilindro`, venta, { headers });
  }

  /**
   * Manda la data a la API para actualizar el estado de una venta en la base de datos
   * Junto con los cilindros asociados
   * @param venta Recibe un modelo de venta
   */
  cambiarEstado(venta: VentaModel): any {
    const headers = this.auth.headers();
    return this.http.put(`${this.url}/cambio-estado/venta`, venta, { headers });
  }

  /**
   * Esta función guarda el código único de la Venta y lo almacena en local
   * @param venta Recibe la venta de la que se desea guardar información
   */
  guardarVenta(venta: VentaModel): void {
    localStorage.setItem('venta', venta.codigo);
  }

  /**
   * Leemos la información de la Venta guardada para regresarla al componente
   * Y la quitamos de la memoria local
   */
  leerVenta(): string {
    const codigo = localStorage.getItem('venta');
    localStorage.removeItem('venta');
    return codigo;
  }
}
