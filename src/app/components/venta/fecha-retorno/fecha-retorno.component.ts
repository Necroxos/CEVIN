/************************************************************************************************************************************
 *                                              IMPORTACIONES Y DECORADOR COMPONENT                                                 *
 ************************************************************************************************************************************/
// Angular
import { Component, Inject, OnInit } from '@angular/core';
// Angular Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// Modelos
import { VentaModel } from '../../../models/venta.model';
// Componentes
import { VentaInfoComponent } from '../venta-info/venta-info.component';
// Módulos
import Swal from 'sweetalert2';
import * as moment from 'moment';
// Servicios
import { VentaService } from '../../../services/venta.service';
import { PeticionesService } from '../../../services/peticiones.service';

export interface DialogData {
  titulo: string;
  codigo: string;
  estado: boolean;
  venta_id: number;
  cilindro_id: number;
}

@Component({
  selector: 'app-fecha-retorno',
  templateUrl: './fecha-retorno.component.html',
  styleUrls: []
})
export class FechaRetornoComponent implements OnInit {

  /**********************************************************************************************************************************
   *                                                       VARIABLES                                                                *
   **********************************************************************************************************************************/

  venta = new VentaModel();
  maxDate = new Date();
  fechaOk = false;

  /**********************************************************************************************************************************
   *                                                    EJECUCIÓN AL INICIAR                                                        *
   **********************************************************************************************************************************/

  constructor(
    public dialogRef: MatDialogRef<VentaInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private servicio: VentaService,
    private estadoPeticion: PeticionesService) { }

  ngOnInit(): void {
    this.venta.retorno = moment();
    this.venta.venta_id = this.data.venta_id;
    this.venta.cilindro_id = this.data.cilindro_id;
    this.venta.finalizado = this.data.estado;
    this.venta.codigo = this.data.codigo;
  }

  /**********************************************************************************************************************************
   *                                                  FUNCIONES DEL COMPONENTE                                                      *
   **********************************************************************************************************************************/

  /**
   * Función que se encarga de transforma la Fecha en un String con formato 'dd/mm/yyyy'
   */
  transformarDatos(): void {
    if (this.venta.retorno && this.venta.retorno.isValid()) {
      this.venta.fecha_retorno = moment(this.venta.retorno).format('DD/MM/YYYY').toString();
      this.fechaOk = true;
    } else {
      this.venta.fecha_retorno = null;
      this.fechaOk = false;
    }
  }

  onNoClick(): void {
    this.servicio.guardarVenta(this.venta);
    this.estadoPeticion.recargar(['venta', 'info']);
    this.dialogRef.close();
  }

  registrar(): void {
    this.estadoPeticion.loading();
    this.transformarDatos();

    if (this.fechaOk) {
      this.servicio.devolverCilindro(this.venta).subscribe(() => {
        Swal.close();
        this.dialogRef.close();
        this.servicio.guardarVenta(this.venta);
        this.estadoPeticion.success('Devolución registrada!', ['venta', 'info'], 750);
      }, (err: any) => {
        console.log(err);
        this.estadoPeticion.error(err);
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Fecha incorrecta',
        text: 'No se pudo transformar la fecha'
      });
    }
  }

}
