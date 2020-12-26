// Angular
import { Component } from '@angular/core';
// Servicios
import { UsuarioService } from '../../../services/usuario.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Módulos
import Swal from 'sweetalert2';
// Modelos
import { UsuarioModel } from '../../../models/usuario.model';

@Component({
  selector: 'app-usuario-editar',
  templateUrl: './usuario-editar.component.html',
  styleUrls: []
})
export class UsuarioEditarComponent {

  // Variables locales
  mostrar = false;
  accionBtn = 'Editar';
  usuario = new UsuarioModel();
  usuarioLocal = this.usuarioServ.leerUsuario();

  constructor(private estadoPeticion: PeticionesService, private usuarioServ: UsuarioService) { }

  /**
   * Leemos el [codigo_activo] del locaStorage y buscamos el usuario en la BD para poder editarlo
   */
  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterContentInit(): void {
    if (this.usuarioLocal) {
      this.usuario.rut = this.usuarioLocal;
      this.cargarInfo();
    } else {
      this.estadoPeticion.recargar(['usuario', 'detalle']);
    }
  }

  /**
   * Función que carga la información en el usuario
   * @param res Recibe la respuesta de la subscripción
   */
  cargarInfo(): void {
    this.estadoPeticion.loading();
    this.usuarioServ.obtenerUno(this.usuario).subscribe((res: any) => {
      Swal.close();
      this.estadoPeticion.success(res.message, [], 650);
      this.usuario = { ...res.response };
      this.mostrar = true;
    }, (err: any) => {
      this.estadoPeticion.error(err);
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
      this.estadoPeticion.success('Usuario actualizado con éxito!', ['usuario', 'detalle'], 1000);
    }, (err: any) => {
      this.estadoPeticion.error(err);
      this.estadoPeticion.recargar(['usuario', 'editar']);
    });
  }

}
