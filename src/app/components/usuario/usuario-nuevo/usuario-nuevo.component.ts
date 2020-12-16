// Angular
import { Component, OnInit } from '@angular/core';
// Servicios
import { UsuarioService } from '../../../services/usuario.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Módulos
import Swal from 'sweetalert2';
// Modelos
import { UsuarioModel } from '../../../models/usuario.model';

@Component({
  selector: 'app-usuario-nuevo',
  templateUrl: './usuario-nuevo.component.html',
  styleUrls: ['./usuario-nuevo.component.css']
})
export class UsuarioNuevoComponent implements OnInit {

  accionBtn = 'Registrar';

  constructor(private usuarioServ: UsuarioService, private estadoPeticion: PeticionesService) { }

  ngOnInit(): void {
  }

  /**
   * Esta función recibe el usuario enviado por el componente [formulario-usuario]
   * Y hace uso de los servicio de [UsuarioService] para enviar la información al Back End
   * Además de usar el servicio de [PeticionesService] para mostrar mensajes de [loading] y [error]
   * @param usuario Escucha la información emitida por el componente hijo
   */
  registrar(usuario: UsuarioModel): void {

    this.estadoPeticion.loading();

    this.usuarioServ.registrar(usuario).subscribe(() => {
      Swal.close();
      this.estadoPeticion.success('Nuevo usuario ingresado con éxito!', ['usuario', 'nuevo'], 1000);
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });

  }

}
