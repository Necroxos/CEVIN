// Angular
import { Component } from '@angular/core';
// Servicios
import { ClienteService } from '../../../services/cliente.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Módulos
import Swal from 'sweetalert2';
// Modelos
import { ClienteModel } from '../../../models/cliente.model';

@Component({
  selector: 'app-cliente-editar',
  templateUrl: './cliente-editar.component.html',
  styleUrls: []
})
export class ClienteEditarComponent {

  // Variables locales
  mostrar = false;
  accionBtn = 'Editar';
  cliente = new ClienteModel();
  clienteLocal = this.clienteServ.leerCliente();

  constructor(private estadoPeticion: PeticionesService, private clienteServ: ClienteService) { }

  /**
   * Leemos el [codigo_activo] del locaStorage y buscamos el cliente en la BD para poder editarlo
   */
  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterContentInit(): void {
    if (this.clienteLocal) {
      this.cliente.rut = this.clienteLocal;
      this.cargarInfo();
    } else {
      this.estadoPeticion.recargar(['cliente', 'detalle']);
    }
  }

  /**
   * Función que carga la información en el cliente
   * @param res Recibe la respuesta de la subscripción
   */
  cargarInfo(): void {
    this.estadoPeticion.loading();
    this.clienteServ.obtenerUno(this.cliente).subscribe((res: any) => {
      Swal.close();
      this.estadoPeticion.success(res.message, [], 650);
      this.cliente = { ...res.response };
      this.mostrar = true;
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

  /**
   * Esta función recibe el cliente enviado por el componente [formulario-cliente]
   * Y hace uso de los servicio de [UsuarioService] para enviar la información al Back End
   * Además de usar el servicio de [PeticionesService] para mostrar mensajes de [loading] y [error]
   * @param cliente Escucha la información emitida por el componente hijo
   */
  actualizar(cliente: ClienteModel): void {
    this.estadoPeticion.loading();

    this.clienteServ.actualizar(cliente).subscribe((res) => {
      Swal.close();
      this.estadoPeticion.success('Cliente actualizado con éxito!', ['cliente', 'detalle'], 1000);
    }, (err: any) => {
      this.estadoPeticion.error(err);
      this.estadoPeticion.recargar(['cliente', 'editar']);
    });
  }

}
