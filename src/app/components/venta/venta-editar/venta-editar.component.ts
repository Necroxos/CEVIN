/************************************************************************************************************************************
 *                                              IMPORTACIONES Y DECORADOR COMPONENT                                                 *
 ************************************************************************************************************************************/
// Angular
import { Component, OnInit } from '@angular/core';
// Servicios
import { VentaService } from '../../../services/venta.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Módulos
import Swal from 'sweetalert2';
import * as moment from 'moment';
// Modelos
import { VentaModel } from '../../../models/venta.model';
import { CilindroModel } from 'src/app/models/cilindro.model';

@Component({
  selector: 'app-venta-editar',
  templateUrl: './venta-editar.component.html',
  styles: [
  ]
})
export class VentaEditarComponent implements OnInit {

  accionBtn = 'Editar';
  mostrar = false;

  venta = new VentaModel();
  cilindros = new Array<CilindroModel>();

  ventaLocal = this.ventaServ.leerVenta();

  constructor(private ventaServ: VentaService, private estadoPeticion: PeticionesService) { }

  ngOnInit(): void {
    if (this.ventaLocal) {
      this.venta.cilindros = new Array();
      this.venta.codigo = this.ventaLocal;
      this.cargarInfo();
    } else {
      this.estadoPeticion.recargar(['venta', 'detalle']);
    }
  }

  /**
   * Función que carga la información en la venta
   */
  cargarInfo(): void {
    this.estadoPeticion.loading();
    this.ventaServ.obtenerUno(this.venta).subscribe((res: any) => {
      Swal.close();
      this.estadoPeticion.success(res.message, [], 650);
      this.venta = { ...res.response };
      this.venta.entrega = moment();
      this.venta.cilindros = new Array();
      this.cilindrosParaVenta(this.venta);
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

  /**
   * Función que se encarga de recibir los cilindros involucrados en una venta
   * @param venta Recibe una venta para editar
   */
  cilindrosParaVenta(venta: VentaModel): void {
    this.ventaServ.obtenerCilindrosDeVenta(venta).subscribe((res: any) => {
      this.cilindros = [...res.response];
      this.mostrar = true;
    }, (err: any) => {
      this.estadoPeticion.error(err, ['venta', 'detalle']);
    });
  }

  /**
   * Función que envía la información al Back End
   * @param evento Recibe una Venta
   */
  editar(evento: VentaModel): void {
    this.estadoPeticion.loading();

    this.ventaServ.actualizar(evento).subscribe(() => {
      Swal.close();
      this.estadoPeticion.success('Venta actualizada con éxito!', ['venta', 'detalle'], 1000);
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

}
