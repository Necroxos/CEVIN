// Angular
import { Injectable } from '@angular/core';
// Peticiones
import { HttpClient, HttpHeaders } from '@angular/common/http';
// Modelos
import { CilindroModel } from '../models/cilindro.model';
// Servicios
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CilindroService {

  // URL donde corre la API
  private url = 'http://localhost:3000';

  constructor(private http: HttpClient, private auth: AuthService) { }

  /**
   * Manda la data a la API para registrar el cilindro en la base de datos
   * @param cilindro Recibe un modelo de cilindro
   *                  (metros_cubicos, tipo_id, mantencion, fecha_mantencion, codigo_activo, desc_mantenimiento)
   */
  registrar(cilindro: CilindroModel): any {
    const headers = new HttpHeaders({ Authorization: this.auth.leerToken() });
    return this.http.post(`${this.url}/cilindro`, cilindro, { headers });
  }

  /**
   * Se realiza una petición a la API para obtener un [cilindro] por medio de su [codigo_activo]
   * @param cilindro Recibe un modelo de cilindro
   */
  obtenerUno(cilindro: CilindroModel): any {
    const headers = new HttpHeaders({ Authorization: this.auth.leerToken() });
    return this.http.get(`${this.url}/cilindro/${cilindro.codigo_activo}`, { headers });
  }

  /**
   * Manda la data a la API para actualizar el cilindro en la base de datos
   * @param cilindro Recibe un modelo de cilindro
   */
  actualizar(cilindro: CilindroModel): any {
    const headers = new HttpHeaders({ Authorization: this.auth.leerToken() });
    return this.http.put(`${this.url}/cilindro`, cilindro, { headers });
  }

  /**
   * Manda la data a la API para actualizar el cilindro en la base de datos
   * @param cilindro Recibe un modelo de cilindro
   */
  cambiarEstado(cilindro: CilindroModel): any {
    const headers = new HttpHeaders({ Authorization: this.auth.leerToken() });
    return this.http.put(`${this.url}/cambio-estado/cilindro`, cilindro, { headers });
  }

  /**
   * Esta función guarda el código único del Cilindro y lo almacena en local
   * @param cilindro Recibe el cilindro del que se desea guardar información
   */
  guardarCilindro(cilindro: CilindroModel): void {
    localStorage.setItem('cilindro', cilindro.codigo_activo);
  }

  /**
   * Leemos la información del cilindro guardada para regresarla al componente
   * Y la quitamos de la memoria local
   */
  leerCilindro(): string {
    const codigo = localStorage.getItem('cilindro');
    localStorage.removeItem('cilindro');
    return codigo;
  }
}
