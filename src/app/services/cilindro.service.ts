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
}
