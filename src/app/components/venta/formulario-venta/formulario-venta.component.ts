/************************************************************************************************************************************
 *                                              IMPORTACIONES Y DECORADOR COMPONENT                                                 *
 ************************************************************************************************************************************/
// Angular
import { Component, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
// Servicios
import { VentaService } from 'src/app/services/venta.service';
import { ClienteService } from '../../../services/cliente.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Módulos
import * as moment from 'moment';
// Modelos
import { VentaModel } from '../../../models/venta.model';
import { ClienteModel } from '../../../models/cliente.model';
import { CilindroModel } from 'src/app/models/cilindro.model';
import { MatTableDataSource } from '@angular/material/table';
//
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-formulario-venta',
  templateUrl: './formulario-venta.component.html',
  styleUrls: ['./formulario-venta.component.css']
})
export class FormularioVentaComponent implements OnInit {

  /**********************************************************************************************************************************
   *                                                       VARIABLES                                                                *
   **********************************************************************************************************************************/

  venta = new VentaModel();
  clientes: [ClienteModel];
  cilindros: [CilindroModel];
  fechaOk = true;
  cilindrosOk = true;
  // Variables recibidas de componentes hijos
  @Input() accionBtn: string;
  @Input() VentaEdit: VentaModel;
  // Variables enviadas a componentes hijos
  @Output() registrarVenta: EventEmitter<VentaModel>;
  // Variables para la tabla de cilindros
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['num', 'codigo', 'opciones'];
  dataSource: MatTableDataSource<CilindroModel>;
  // Variable para el stepper
  isLinear = false;

  /**********************************************************************************************************************************
   *                                                    EJECUCIÓN AL INICIAR                                                        *
   **********************************************************************************************************************************/

  /**
   * Inicializa servicios y el Emitter
   * @param ventaServ Servicio con peticiones HTTP al Back End
   * @param clienteServ Servicio con peticiones HTTP al Back End
   * @param estadoPeticion Servicio con funciones de Carga y Error
   */
  constructor(private clienteServ: ClienteService, private estadoPeticion: PeticionesService,
              private ventaServ: VentaService) {
    this.registrarVenta = new EventEmitter();
  }

  /**
   * Al iniciar el componente obtenemos los datos necesarios para los selectors
   * Inicializamos la fecha actual como predeterminado e inicializamos la lista de cilindros en venta
   * Si existe información previa la cargamos a modo de edición
   */
  ngOnInit(): void {
    this.obtenerClientes();
    this.obtenerCilindros();
    this.venta.entrega = moment();
    this.venta.cilindros = new Array();
    this.transformarDatos();
    if (this.VentaEdit) { this.venta = this.VentaEdit; }
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
    this.ventaServ.obtenerCilindros().subscribe((res: any) => {
      this.cilindros = res.response;
      this.dataSource = new MatTableDataSource(res.response);
    }, (err: any) => {
      console.log(err);
      this.estadoPeticion.error(err);
    });
  }

  /**
   * Función que busca un elemento (cilindro) en la tabla
   * @param event Recibe el input del filtro
   */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**********************************************************************************************************************************
   *                                                  FUNCIONES DEL COMPONENTE                                                      *
   **********************************************************************************************************************************/

  /**
   * Angular From tiene la facultad de actualizar la información automáticamente
   * En este caso, la función se encarga de enviar la información que se guarda en el modelo de Venta
   * @param form Escucha al formulario de Angular
   */
  registrar(form: NgForm): void {

    this.transformarDatos();
    this.cilindrosEscogidos();

    if (form.invalid) { return; }

    if (this.fechaOk && this.cilindrosOk) {
      this.registrarVenta.emit(this.venta);
    }

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

  /**
   * Función que extrae el Texto del elemnto HTML
   * @param cliente Obtiene el elemento HTML <option> del cliente
   */
  clienteVenta(cliente: any): void {
    const idx = cliente.options.selectedIndex;
    const selectElementText = cliente.options[idx].text;
    let text = selectElementText.split('(');
    text = text[1].replace(')', '');
    this.venta.rut_cliente = text;
  }

  /**
   * Función que se encarga de marcar como "Cilindro escogido" para la venta
   * @param cilindo Obtiene el objeto cilindro de la tabla
   * @param evento Obtiene el check o uncheck (boolean)
   */
  cilindroVenta(cilindo: CilindroModel, evento: boolean): void {
    cilindo.escogido = evento;
    this.cilindrosEscogidos();
  }

  /**
   * Función que revisa los cilindros marcados y los agrega a la lista de venta
   * Para ser enviados al Back End
   * También revisa que a lo menos vaya un cilindro
   */
  cilindrosEscogidos(): void {
    this.cilindros.forEach(cilindro => {
      if (cilindro.escogido) {
        if (this.venta.cilindros.indexOf(cilindro.cilindro_id) === -1) {
          this.venta.cilindros.push(cilindro.cilindro_id);
        }
      }
    });

    if (this.venta.cilindros.length > 0) { this.cilindrosOk = true; }
    else { this.cilindrosOk = false; }
  }

  /**
   * Función que limpia los cilindros marcados de la tabla
   */
  limpiarLista(): void {
    this.cilindros.forEach(cilindro => cilindro.escogido = false);
    this.venta.cilindros = new Array();
  }

  /**
   * Función que limpia todo el formulario
   */
  limpiarTodo(): void {
    this.limpiarLista();
    this.venta = new VentaModel();
    this.venta.entrega = moment();
    this.venta.cilindros = new Array();
    this.transformarDatos();
  }

}
