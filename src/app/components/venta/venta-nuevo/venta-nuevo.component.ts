// Angular
import { Component, OnInit } from '@angular/core';
// Servicios
import { VentaService } from '../../../services/venta.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Módulos
import Swal from 'sweetalert2';
// Modelos
import { VentaModel } from 'src/app/models/venta.model';

@Component({
  selector: 'app-venta-nuevo',
  templateUrl: './venta-nuevo.component.html',
  styleUrls: []
})
export class VentaNuevoComponent implements OnInit {

  // Variables para guardar información de forma local
  accionBtn = 'Registrar';

  constructor(private estadoPeticion: PeticionesService, private ventaServ: VentaService) { }

  ngOnInit(): void {}

  /**
   * Esta función recibe la venta enviada por el componente [formulario-venta]
   * Y hace uso de los servicio de [VentaService] para enviar la información al Back End
   * Además de usar el servicio de [PeticionesService] para mostrar mensajes de [loading] y [error]
   * @param venta Escucha la información emitida por el componente hijo
   */
  registrar(venta: VentaModel): void {

    this.estadoPeticion.loading();

    this.ventaServ.registrar(venta).subscribe(() => {
      Swal.close();
      this.estadoPeticion.success('Nueva venta ingresada con éxito!', ['venta', 'nuevo'], 1000);
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

}
