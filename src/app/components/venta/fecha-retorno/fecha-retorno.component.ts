/************************************************************************************************************************************
 *                                              IMPORTACIONES Y DECORADOR COMPONENT                                                 *
 ************************************************************************************************************************************/
// Angular
import { Component, Inject, OnInit } from '@angular/core';
// Angular Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// Modelos
import { VentaModel } from '../../../models/venta.model';
import { EstandarModel } from '../../../models/estandar.model';
// Componentes
import { VentaInfoComponent } from '../venta-info/venta-info.component';
// Módulos
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
// Servicios
import { VentaService } from '../../../services/venta.service';
import { PeticionesService } from '../../../services/peticiones.service';

export interface DialogData {
  titulo: string;
  codigo: string;
  estado: boolean;
  venta_id: number;
  cilindro_id: number;
  entrega: moment.Moment;
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

  demoras = new Array<EstandarModel>();
  minDate = this.data.entrega;
  venta = new VentaModel();
  maxDate = new Date();
  demoraOK = true;
  dias = 0;
  costo = 0;

  /**********************************************************************************************************************************
   *                                                    EJECUCIÓN AL INICIAR                                                        *
   **********************************************************************************************************************************/

  constructor(
    public dialogRef: MatDialogRef<VentaInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private servicio: VentaService,
    private estadoPeticion: PeticionesService) {
      dialogRef.disableClose = true;
    }

  ngOnInit(): void {
    this.cargarVenta();
    this.cargarDias();
    // this.cargarTiposAtrasos();
  }

  /**
   * Pasa la información entregada por el componente padre
   * A un nuevo modelo de venta
   */
  cargarVenta(): void {
    this.venta.retorno = moment();
    this.venta.entrega = this.data.entrega;
    this.venta.venta_id = this.data.venta_id;
    this.venta.cilindro_id = this.data.cilindro_id;
    this.venta.finalizado = this.data.estado;
    this.venta.codigo = this.data.codigo;
  }

  /**
   * Se encarga de calcular los días transcurridos desde la entrega
   * hasta la fecha ingresada en el componente como 'retorno'
   */
  cargarDias(): void {
    const inicio = moment(this.venta.entrega);
    const final = moment(this.venta.retorno);
    this.dias = final.diff(inicio, 'days');
    this.costo = this.dias * 200;
  }

  /**********************************************************************************************************************************
   *                                                  FUNCIONES DEL COMPONENTE                                                      *
   **********************************************************************************************************************************/

  /**
   * Función que se encarga de transforma la Fecha en un String con formato 'dd/mm/yyyy'
   */
  transformarFecha(): boolean {
    if (this.venta.retorno && this.venta.retorno.isValid()) {
      this.venta.fecha_retorno = moment(this.venta.retorno).format('DD/MM/YYYY').toString();
      return true;
    } else {
      this.venta.fecha_retorno = null;
      Swal.fire({
        icon: 'error',
        title: 'Datos incorrectos',
        text: 'No se pudo transformar la fecha'
      });
      return false;
    }
  }

  /**
   * Función que se encarga de confirmar que exista
   * Un tipo de atraso seleccionado
   */
  verificarDemora(): void {
    if (this.venta.demora_id) { this.demoraOK = true; }
    else { this.demoraOK = false; }
  }

  /**
   * Función que se ejecuta al cambiar la fecha en el datepicker
   * @param event Recibe la fecha del datepicker
   */
  cambioDias(event: MatDatepickerInputEvent<Date>): void {
    this.venta.retorno = moment(event.value);
    this.cargarDias();
  }

  /**
   * Poner un tipo de atraso para la devolución
   */
  calcularAtraso(): void {
    if (this.dias <= 15) { this.venta.demora_id = 2; }
    else if (this.dias <= 30 && this.dias > 15) { this.venta.demora_id = 3; }
    else if (this.dias <= 60 && this.dias > 30) { this.venta.demora_id = 4; }
    else if (this.dias > 60) { this.venta.demora_id = 5; }
  }

  /**
   * Se encarga de cancelar el proceso de devolución de activo
   */
  onNoClick(): void {
    this.servicio.guardarVenta(this.venta);
    this.estadoPeticion.recargar(['venta', 'info']);
    this.dialogRef.close();
  }

  /**
   * Proceso de registro para el retorno de un activo
   * Posee una doble validación para la fecha entregada
   */
  registrar(): void {
    const fechaOk = this.transformarFecha();
    this.calcularAtraso();
    this.verificarDemora();

    if (fechaOk && this.demoraOK) {
      this.estadoPeticion.loading();
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
      alert('nope');
    }
  }

}
