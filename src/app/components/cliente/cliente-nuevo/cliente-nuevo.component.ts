// Angular
import { Component, OnInit } from '@angular/core';
// Servicios
import { ClienteService } from '../../../services/cliente.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Módulos
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente-nuevo',
  templateUrl: './cliente-nuevo.component.html',
  styleUrls: []
})
export class ClienteNuevoComponent implements OnInit {

  accionBtn = 'Registrar';

  constructor(private clienteServ: ClienteService, private estadoPeticion: PeticionesService) { }

  ngOnInit(): void {}

  /**
   * Esta función recibe el cliente enviado por el componente [formulario-cliente]
   * Y hace uso de los servicio de [ClienteService] para enviar la información al Back End
   * Además de usar el servicio de [PeticionesService] para mostrar mensajes de [loading] y [error]
   * @param cliente Escucha la información emitida por el componente hijo
   */
  registrar(event: any): void {

    this.estadoPeticion.loading();

    this.clienteServ.registrar(event).subscribe(() => {
      Swal.close();
      this.estadoPeticion.success('Nuevo cliente ingresado con éxito!', ['cliente', 'nuevo'], 1000);
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });

  }

}
