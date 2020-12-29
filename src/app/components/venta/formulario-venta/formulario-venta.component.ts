// Angular
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
// Servicios
import { ClienteService } from '../../../services/cliente.service';
import { CilindroService } from 'src/app/services/cilindro.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Módulos
import * as moment from 'moment';
// Modelos
import { VentaModel } from '../../../models/venta.model';
import { ClienteModel } from '../../../models/cliente.model';
import { CilindroModel } from 'src/app/models/cilindro.model';

@Component({
  selector: 'app-formulario-venta',
  templateUrl: './formulario-venta.component.html',
  styleUrls: []
})
export class FormularioVentaComponent implements OnInit {

  // Variables del componenete
  venta = new VentaModel();
  clientes: [ClienteModel];
  cilindros: [CilindroModel];
  fechaOk = true;
  // Variables recibidas de componentes hijos
  @Input() accionBtn: string;
  @Input() VentaEdit: VentaModel;
  // Variables enviadas a componentes hijos
  @Output() registrarVenta: EventEmitter<VentaModel>;

  constructor(private clienteServ: ClienteService, private estadoPeticion: PeticionesService,
              private cilindroServ: CilindroService) {
    this.registrarVenta = new EventEmitter();
  }

  ngOnInit(): void {
    this.obtenerClientes();
    this.obtenerCilindros();
    this.venta.entrega = moment();
    if (this.VentaEdit) { this.venta = this.VentaEdit; }
  }

  /**
   * Angular From tiene la facultad de actualizar la información automáticamente
   * En este caso, la función se encarga de enviar la información que se guarda en el modelo de Venta
   * @param form Escucha al formulario de Angular
   */
  registrar(form: NgForm): void {
    if (form.invalid) { return; }

    this.transformarDatos();

    if (this.fechaOk) {
      this.registrarVenta.emit(this.venta);
    }

  }

  /**
   * Cargamos la información de los posibles clientes
   */
  obtenerClientes(): void {
    this.clienteServ.obtenerTodos().subscribe((res: any) => {
      this.clientes = res.response;
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

  /**
   * Cargamos la información de los cilindros
   */
  obtenerCilindros(): void {
    this.cilindroServ.obtenerTodos().subscribe((res: any) => {
      this.cilindros = res.response;
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

  /**
   * Función que se encarga de transforma la Fecha en un String con formato 'dd/mm/yyyy'
   */
  transformarDatos(): void {
    if (this.venta.entrega && this.venta.entrega.isValid()) {
      this.venta.fecha_entrega = moment(this.venta.entrega).format('DD/MM/YYYY').toString();
      this.fechaOk = true;
    } else {
      this.venta.fecha_entrega = null;
      this.fechaOk = false;
    }
  }

  /**
   * Función que se encarga de limpiar la fecha de mantención
   */
  limpiarFecha(): void {
    this.venta.fecha_entrega = null;
    this.venta.entrega = null;
  }

}
