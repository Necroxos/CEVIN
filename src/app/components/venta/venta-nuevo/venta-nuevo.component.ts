// Angular
import { Component, OnInit } from '@angular/core';
// Servicios
import { VentaService } from '../../../services/venta.service';
import { CostoService } from '../../../services/costo.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Módulos
import Swal from 'sweetalert2';
// Modelos
import { VentaModel } from 'src/app/models/venta.model';
import { CostoModel } from '../../../models/costo.model';

@Component({
  selector: 'app-venta-nuevo',
  templateUrl: './venta-nuevo.component.html',
  styleUrls: []
})
export class VentaNuevoComponent implements OnInit {

  // Variables para guardar información de forma local
  accionBtn = 'Registrar';
  costos = new Array<CostoModel>();

  constructor(
    private ventaServ: VentaService,
    private CostoServ: CostoService,
    private estadoPeticion: PeticionesService) { }

  ngOnInit(): void { }

  /**
   * Esta función recibe la venta enviada por el componente [formulario-venta]
   * Y hace uso de los servicio de [VentaService] para enviar la información al Back End
   * Además de usar el servicio de [PeticionesService] para mostrar mensajes de [loading] y [error]
   * @param venta Escucha la información emitida por el componente hijo
   */
  registrar(venta: VentaModel): void {

    this.estadoPeticion.loading();

    this.ventaServ.registrar(venta).subscribe((res: any) => {
      this.costos = res.list;
      this.CostoServ.registrarTotal(this.costos).subscribe((result) => {
        console.log(result);
      },
        (error) => {
          console.log(error);
        });
      Swal.close();
      this.estadoPeticion.success('Nueva venta ingresada con éxito!', ['venta', 'nuevo'], 1000);
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

}
