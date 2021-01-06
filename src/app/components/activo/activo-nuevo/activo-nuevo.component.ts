// Angular
import { Component } from '@angular/core';
// Servicios
import { CilindroService } from '../../../services/cilindro.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Módulos
import Swal from 'sweetalert2';
// Modelos
import { CilindroModel } from 'src/app/models/cilindro.model';

@Component({
  selector: 'app-activo-nuevo',
  templateUrl: './activo-nuevo.component.html'
})

export class ActivoNuevoComponent {

  // Variables
  accionBtn = 'Registrar';

  /**
   * Inicializa servicios
   * @param cilindroServ Servicio con peticiones HTTP al Back End
   * @param estadoPeticion Servicio con funciones de Carga y Error
   */
   constructor(private cilindroServ: CilindroService, private estadoPeticion: PeticionesService) { }

  /**
   * Esta función recibe el cilindro enviado por el componente [formulario-cilindro]
   * Y hace uso de los servicio de [CilindroService] para enviar la información al Back End
   * Además de usar el servicio de [PeticionesService] para mostrar mensajes de [loading] y [error]
   * @param cilindro Escucha la información emitida por el componente hijo
   */
  registrar(cilindro: CilindroModel): void {

    this.estadoPeticion.loading();

    this.cilindroServ.registrar(cilindro).subscribe(() => {
      Swal.close();
      this.estadoPeticion.success('Nuevo activo ingresado con éxito!', ['activo', 'nuevo'], 1000);
    }, (err: any) => {
      cilindro.codigo_activo = cilindro.codigo_activo.replace(this.estadoPeticion.prefijoCodigo, '');
      this.estadoPeticion.error(err);
    });
  }

}
