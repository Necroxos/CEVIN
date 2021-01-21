// Angular
import { Injectable } from '@angular/core';
// Peticiones
import { HttpClient } from '@angular/common/http';
// Servicios
import { AuthService } from './auth.service';
import { ClienteModel } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  // URL donde corre la API
  private url: string;

  constructor(private http: HttpClient, private auth: AuthService) {
    this.url = auth.url;
  }

  /**
   * Manda la data a la API para registrar el cliente en la base de datos
   * @param cliente Recibe un modelo de cliente
   *                  (nombres, apellidos, dni, dv, email, razon_social, telefono, empresa)
   */
  registrar(cliente: any): any {
    const headers = this.auth.headers();
    return this.http.post(`${this.url}/cliente`, cliente, { headers });
  }

  /**
   * Se realiza una petición a la API para obtener un [cliente] por medio de su [rut]
   * @param cliente Recibe un modelo de cliente
   */
  obtenerUno(cliente: ClienteModel): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/cliente/${cliente.rut}`, { headers });
  }

  /**
   * Se realiza una petición a la API para obtener todos los clientes
   * @param cliente Recibe un modelo de cliente
   */
  obtenerTodos(): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/clientes`, { headers });
  }

  /**
   * Se realiza una petición a la API para obtener todos los cilindros comprados
   */
  obtenerCilindrosComprados(cliente: ClienteModel): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/cliente-cilindros/${cliente.cliente_id}`, { headers });
  }

  /**
   * Manda la data a la API para actualizar el cliente en la base de datos
   * @param cliente Recibe un modelo de cliente
   */
  actualizar(cliente: any): any {
    const headers = this.auth.headers();
    return this.http.put(`${this.url}/cliente`, cliente, { headers });
  }

  /**
   * Manda la data a la API para actualizar el estado de un cliente en la base de datos
   * @param cliente Recibe un modelo de cliente
   */
  cambiarEstado(cliente: ClienteModel): any {
    const headers = this.auth.headers();
    return this.http.put(`${this.url}/cambio-estado/cliente`, cliente, { headers });
  }

  /**
   * Esta función guarda el rut y direccion del Cliente y lo almacena en local
   * @param cliente Recibe el cliente del que se desea guardar información
   */
  guardarCliente(cliente: ClienteModel): void {
    localStorage.setItem('cliente', cliente.dni + '-' + cliente.dv);
    localStorage.setItem('direccion', String(cliente.direccion_id));
  }

  /**
   * Leemos la información del cliente guardada para regresarla al componente
   * Y la quitamos de la memoria local
   */
  leerCliente(): string {
    const rut = localStorage.getItem('cliente');
    localStorage.removeItem('cliente');
    return rut;
  }

  /**
   * Leemos la información de la dirección guardada para regresarla al componente
   * Y la quitamos de la memoria local
   */
  leerDireccion(): string {
    const direccionID = localStorage.getItem('direccion');
    localStorage.removeItem('direccion');
    return direccionID;
  }

  /**
   * Función que se encarga de buscar la última dirección válida de un cliente
   * @param id ID de la última dirección activa
   */
  obtenerDireccion(id: string): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/direccion/${id}`, { headers });
  }

  /**
   * Función que se encarga de buscar la última dirección válida de un cliente
   * @param id ID de la última dirección activa
   */
  obtenerDirecciones(cliente: ClienteModel): any {
    const headers = this.auth.headers();
    return this.http.get(`${this.url}/direccion/cliente/${cliente.cliente_id}`, { headers });
  }

}
