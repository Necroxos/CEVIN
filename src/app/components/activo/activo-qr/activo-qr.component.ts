/************************************************************************************************************************************
 *                                              IMPORTACIONES Y DECORADOR COMPONENT                                                 *
 ************************************************************************************************************************************/
// Angualr
import { Component, OnInit } from '@angular/core';
// Servicios
import { AuthService } from '../../../services/auth.service';
import { CilindroService } from '../../../services/cilindro.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Módulos
import Swal from 'sweetalert2';
// Modelos
import { CilindroModel } from '../../../models/cilindro.model';
// Enrutador
import { Router } from '@angular/router';

@Component({
  selector: 'app-activo-qr',
  templateUrl: './activo-qr.component.html',
  styleUrls: ['./activo-qr.component.css']
})
export class ActivoQrComponent implements OnInit {

  /**********************************************************************************************************************************
   *                                                       VARIABLES                                                                *
   **********************************************************************************************************************************/
  cilindro: CilindroModel;
  escaner = true;
  mostrar = false;
  estado: string;
  cliente: any;

  /**********************************************************************************************************************************
   *                                                    EJECUCIÓN AL INICIAR                                                        *
   **********************************************************************************************************************************/

  /**
   * Inicializa módulos y servicios
   * @param auth Servicio de autenticación
   * @param router Módulo que enruta y redirecciona
   * @param clienteServ Servicio con peticiones HTTP al Back End
   * @param cilindroServ Servicio con peticiones HTTP al Back End
   * @param estadoPeticion Servicio con funciones de Carga y Error
   */
  constructor(
    private router: Router,
    private auth: AuthService,
    private cilindroServ: CilindroService,
    private estadoPeticion: PeticionesService) { }

  // Al cargar el componente inicializamos un Cilindro
  ngOnInit(): void {
    this.cilindro = new CilindroModel();
    const code = localStorage.getItem('cilindro');
    localStorage.removeItem('cilindro');
    if (code) {
      this.escaner = false;
      this.mostrarCodigo(code);
    }
  }

  /**
   * Al captar un código se dispara esta función que muestra un mensaje con el código escaneado
   * @param codigoQR Recibe el string del código QR
   */
  mostrarCodigo(codigoQR: string): void {
    this.estadoPeticion.loading();

    this.cilindro.codigo_activo = codigoQR;
    this.cilindroServ.obtenerUno(this.cilindro).subscribe((res: any) => {
      Swal.close();
      this.estadoPeticion.success(res.message, [], 700);
      this.cilindro = { ...res.response };
      this.verCliente();
    }, (err: any) => {
      this.estadoPeticion.error(err);
      this.recargar();
    });
  }

  /**
   * Revisa si existe un cliente que posea el cilindro
   */
  verCliente(): void {
    this.cilindroServ.obtenerCliente(this.cilindro).subscribe((res: any) => {
      this.cliente = res.response;
      this.verEstado();
      this.mostrar = true;
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

  /**
   * Revisamos el estado del cilindro para mostrar un mensaje
   */
  verEstado(): void {
    if (!this.cilindro.activo) { this.estado = 'Rotando a Santiago'; }
    else if (this.cilindro.cargado) { this.estado = 'En CEVIN (Con Carga)'; }
    else if (!this.cilindro.cargado && this.cilindro.stock) { this.estado = 'En CEVIN (Sin Carga)'; }
    else if (!this.cilindro.stock) { this.estado = 'En Arriendo'; }
  }

  /**
   * Función que revisa que el usuario autenticado tenga permisos de administrador administrador
   * Regresa un true o false para habilitar funciones en la vista
   */
  esAdmin(): boolean {
    return this.auth.esAdmin;
  }

  /**********************************************************************************************************************************
   *                                                  FUNCIONES DEL COMPONENTE                                                      *
   **********************************************************************************************************************************/

  /**
   * Función que cambia el estado de un cilindro a desactivado en la base de datos
   */
  cambiarEstado(): void {
    this.estadoPeticion.loading();
    this.cilindro.activo = !this.cilindro.activo;
    this.cilindro.stock = !this.cilindro.stock;
    this.cilindro.cargado = !this.cilindro.cargado;
    this.cilindroServ.cambiarEstado(this.cilindro).subscribe((res: any) => {
      Swal.close();
      this.estadoPeticion.success(res.message, [], 700);
    }, (err: any) => {
      this.estadoPeticion.error(err);
      this.recargar();
    });
  }

  // Utilizamos esta función para refrescar el componente y que no hayan errores con el Scanner-QR
  recargar(): void {
    this.estadoPeticion.recargar(['activo', 'escaner']);
  }

  /**
   * Al presionar editar, guardamos el código único del cilindro en local storage
   * Y redirigimos al componente de edición
   */
  editar(): void {
    this.cilindroServ.guardarCilindro(this.cilindro);
    this.router.navigate(['activo', 'editar']);
  }

  /**
   * Función para volver a detalle
   */
  regresar(): void {
    this.estadoPeticion.recargar(['activo', 'detalle']);
  }

}
