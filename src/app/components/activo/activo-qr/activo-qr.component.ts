// Angualr
import { Component, ViewChild, OnInit } from '@angular/core';
// Servicios
import { CilindroService } from '../../../services/cilindro.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Módulos
import Swal from 'sweetalert2';
// Modelos
import { AuthService } from '../../../services/auth.service';
import { CilindroModel } from '../../../models/cilindro.model';
// Enrutador
import { Router } from '@angular/router';

@Component({
  selector: 'app-activo-qr',
  templateUrl: './activo-qr.component.html',
  styleUrls: ['./activo-qr.component.css']
})
export class ActivoQrComponent implements OnInit {

  // Variables locales para guardar información
  cilindro: CilindroModel;
  mostrar = false;

  constructor(private estadoPeticion: PeticionesService, private cilindroServ: CilindroService,
              private auth: AuthService, private router: Router) { }

  // Al cargar el componente inicializamos un Cilindro
  ngOnInit(): void {
    this.cilindro = new CilindroModel();
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
      this.mostrar = true;
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
  guardar(): void {
    this.cilindroServ.guardarCilindro(this.cilindro);
    this.router.navigate(['activo', 'editar']);
  }

  /**
   * Función que revisa que el usuario autenticado tenga permisos de administrador administrador
   * Regresa un true o false para habilitar funciones en la vista
   */
  esAdmin(): boolean {
    return this.auth.esAdmin;
  }

  /**
   * Función que cambia el estado de un cilindro a desactivado en la base de datos
   */
  cambiarEstado(): void {
    this.estadoPeticion.loading();
    this.cilindro.activo = !this.cilindro.activo;
    this.cilindroServ.cambiarEstado(this.cilindro).subscribe((res: any) => {
      Swal.close();
      this.estadoPeticion.success(res.message, [], 700);
    }, (err: any) => {
      this.estadoPeticion.error(err);
      this.recargar();
    });
  }

}
