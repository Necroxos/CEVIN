/************************************************************************************************************************************
 *                                              IMPORTACIONES Y DECORADOR COMPONENT                                                 *
 ************************************************************************************************************************************/
// Angular
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
// Servicios
import { RutService } from '../../../services/rut.service';
import { AuthService } from '../../../services/auth.service';
import { UsuarioService } from '../../../services/usuario.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Modelos
import { UsuarioModel } from '../../../models/usuario.model';
// Módulos
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
// Componente
import { PasswordComponent } from './password/password.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {

  /**********************************************************************************************************************************
   *                                                       VARIABLES                                                                *
   **********************************************************************************************************************************/

  usuario: UsuarioModel = new UsuarioModel();

  /**********************************************************************************************************************************
   *                                                    EJECUCIÓN AL INICIAR                                                        *
   **********************************************************************************************************************************/

  /**
   * Inicializa módulos y servicios
   * @param auth Servicio de autenticación
   * @param rutServ Servicio que verifica validéz del rut
   * @param estadoPeticion Servicio con funciones de Carga y Error
   */
  constructor(
    public dialog: MatDialog,
    private auth: AuthService,
    private rutServ: RutService,
    private usuarioServ: UsuarioService,
    private estadoPeticion: PeticionesService) { }

  ngOnInit(): void {
    this.cargarInfo();
  }

  /**
   * Función que carga la información en el usuario
   * @param res Recibe la respuesta de la subscripción
   */
  cargarInfo(): void {
    let usuario = this.auth.obtenerUsuario();
    usuario = usuario.usuario;
    usuario.rut = usuario.dni + '-' + usuario.dv;
    this.estadoPeticion.loading();
    this.usuarioServ.obtenerUno(usuario).subscribe((res: any) => {
      Swal.close();
      this.usuario = { ...res.response };
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

  /**********************************************************************************************************************************
   *                                                  FUNCIONES DEL COMPONENTE                                                      *
   **********************************************************************************************************************************/

  /**
   * Angular From tiene la facultad de actualizar la información automáticamente
   * En este caso, la función se encarga de enviar la información que se guarda en el modelo de Usuario
   * @param form Escucha al formulario de Angular
   */
  registrar(form: NgForm): void {
    if (form.invalid) { return; }

    this.rutServ.CheckRUT(this.usuario.rut).then((res) => {
      if (res) {
        const rut = String(this.rutServ.quitarFormato(this.usuario.rut));
        const len = rut.length;
        this.usuario.dni = rut.substring(0, len - 1);
        this.usuario.dv = rut.substring(len - 1);
        this.actualizar(this.usuario);
      } else {
        this.rutServ.rutInvalido();
      }
    });
  }

  /**
   * Esta función recibe el usuario enviado por el componente [formulario-usuario]
   * Y hace uso de los servicio de [UsuarioService] para enviar la información al Back End
   * Además de usar el servicio de [PeticionesService] para mostrar mensajes de [loading] y [error]
   * @param usuario Escucha la información emitida por el componente hijo
   */
  actualizar(usuario: UsuarioModel): void {
    this.estadoPeticion.loading();

    this.usuarioServ.actualizar(usuario).subscribe((res) => {
      Swal.close();
      this.estadoPeticion.success('Usuario actualizado con éxito!', ['perfil'], 1000);
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

  /**
   * Enviar al formulario de cambiar contraseña
   */
  cambiarPass(): void {
    this.dialog.open(PasswordComponent, {
      width: '40vh',
      data: { id: this.usuario.usuario_id }
    });
  }

}
