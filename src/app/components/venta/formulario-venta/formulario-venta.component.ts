/************************************************************************************************************************************
 *                                              IMPORTACIONES Y DECORADOR COMPONENT                                                 *
 ************************************************************************************************************************************/
// Angular
import { Component, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormControl, NgControl } from '@angular/forms';
// Servicios
import { VentaService } from 'src/app/services/venta.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Módulos
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
// Modelos
import { VentaModel } from '../../../models/venta.model';
import { CilindroModel } from 'src/app/models/cilindro.model';
import { MatTableDataSource } from '@angular/material/table';
// Material
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
// Componente
import { VentaEscanerComponent } from '../venta-escaner/venta-escaner.component';

export interface Client {
  text: string;
  id: number;
}

@Component({
  selector: 'app-formulario-venta',
  templateUrl: './formulario-venta.component.html'
})
export class FormularioVentaComponent implements OnInit {

  /**********************************************************************************************************************************
   *                                                       VARIABLES                                                                *
   **********************************************************************************************************************************/

  maxDate = new Date();
  venta = new VentaModel();
  cliente: Client;
  clientes: Client[];
  cilindros: CilindroModel[];
  cilindrosCard = new Array<CilindroModel>();

  //
  myControl = new FormControl();
  filteredOptions: Observable<Client[]>;

  escanear = false;
  fechaOk = true;
  montoOk = true;
  clienteOk = true;
  preciosOk = false;
  cilindrosOk = true;
  confirmarPrecios = true;

  // Variables recibidas de componentes hijos
  @Input() accionBtn: string;
  @Input() VentaEdit: VentaModel;
  @Input() CilindrosEdit: CilindroModel[];
  // Variables enviadas a componentes hijos
  @Output() registrarVenta: EventEmitter<VentaModel>;
  // Variables para la tabla de cilindros
  isLoadingResults = true;
  isRateLimitReached = false;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
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
  constructor(
    public dialog: MatDialog,
    private ventaServ: VentaService,
    private estadoPeticion: PeticionesService) {
    this.registrarVenta = new EventEmitter();
  }

  /**
   * Al iniciar el componente obtenemos los datos necesarios para los selectors
   * Inicializamos la fecha actual como predeterminado e inicializamos la lista de cilindros en venta
   * Si existe información previa la cargamos a modo de edición
   */
  ngOnInit(): void {
    if (this.VentaEdit) { this.venta = this.VentaEdit; }
    this.venta.entrega = moment();
    this.venta.cilindros = new Array();
    this.obtenerClientes();
    this.obtenerCilindros();
    this.transformarDatos();
  }

  /**
   * Cargamos la información de los posibles clientes
   */
  obtenerClientes(): void {
    this.ventaServ.obtenerClientes().subscribe((res: any) => {
      this.clientes = res.response;
      this.filter();
      this.escogerCliente();
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

  /**
   * Pre selecionar cliente para edición
   */
  escogerCliente(): void {
    this.clientes.forEach(cliente => {
      if (cliente.id === this.venta.cliente_id) {
        this.myControl.setValue( cliente );
      }
    });
  }

  /**
   * Cargamos la información de los cilindros
   */
  obtenerCilindros(): void {
    this.ventaServ.obtenerCilindros().subscribe((res: any) => {
      this.cilindros = res.response;
      if (this.CilindrosEdit) { this.cilindrosParaEditar(this.cilindros); }
      this.dataSource = new MatTableDataSource(this.cilindros);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoadingResults = false;
      this.isRateLimitReached = false;
    }, (err: any) => {
      console.log(err);
      this.estadoPeticion.error(err);
    });
  }

  /**
   * Función que agrega a la tabla los cilindros que están involucrados en la venta
   */
  cilindrosParaEditar(cilindros: CilindroModel[]): void {
    this.CilindrosEdit.forEach(cilindro => {
      cilindro.escogido = true;
      cilindro.correlativo = cilindros.length + 1;
      cilindros.push(cilindro);
      this.cilindrosCard.push(cilindro);
      this.venta.cilindros.push(cilindro.cilindro_id);
    });
    this.checkCilindros();
  }

  /**
   * Función que busca un elemento (cilindro) en la tabla
   * @param event Recibe el input del filtro
   */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Inicializa el filtro de clientes
   */
  filter(): void {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.text),
        map(text => text ? this._filter(text) : this.clientes.slice())
      );
  }

  /**
   * Función que retorna los clientes
   * @param cliente Muestra la información del cliente
   */
  displayFn(cliente: Client): string {
    return cliente && cliente.text ? cliente.text : '';
  }

  /**
   * Filtro para el select de clientes
   * @param text Recibe el texto del input
   */
  private _filter(text: string): Client[] {
    const filterValue = text.toLowerCase();

    return this.clientes.filter(option => option.text.toLowerCase().indexOf(filterValue) === 0);
  }

  /**********************************************************************************************************************************
   *                                                  FUNCIONES DEL COMPONENTE                                                      *
   **********************************************************************************************************************************/

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
   * Abre un 'modal' con el escaner de QR activo
   * el cual emite el código leído
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(VentaEscanerComponent, {
      width: '60vh'
    });

    dialogRef.componentInstance.onScann.subscribe((codigo: string) => {
      let existe = false;
      this.cilindros.forEach(cilindro => {
        if (cilindro.codigo_activo === codigo) {
          this.cilindroVenta(cilindro, true);
          existe = true;
        }
      });
      if (!existe) {
        alert('El cilindro escaneado no está en el listado');
      }
    });
  }

  /**
   * Función que limpia los cilindros marcados de la tabla
   */
  limpiarLista(): void {
    this.cilindros.forEach(cilindro => {
      cilindro.escogido = false;
      this.cilindrosEscogidos(cilindro);
    });
    this.venta.cobros = new Array<CilindroModel>();
    this.venta.monto = 0;
    this.confirmarPrecios = true;
  }

  /**
   * Función que se encarga de marcar como "Cilindro escogido" para la venta
   * @param cilindo Obtiene el objeto cilindro de la tabla
   * @param evento Obtiene el check o uncheck (boolean)
   */
  cilindroVenta(cilindro: CilindroModel, evento: boolean): void {
    cilindro.escogido = evento;
    this.cilindrosEscogidos(cilindro);
  }

  /**
   * Función que revisa los cilindros marcados y los agrega a la lista de venta,
   * Además de eliminar los cilindros que se desmarquen,
   * Para ser enviados al Back End
   */
  cilindrosEscogidos(cilindro: CilindroModel): void {
    const index = this.venta.cilindros.indexOf(cilindro.cilindro_id);
    if (cilindro.escogido) {
      this.venta.cilindros.push(cilindro.cilindro_id);
      this.cilindrosCard.push(cilindro);
    } else {
      if (index > -1) {
        this.venta.cilindros.splice(index, 1);
        this.cilindrosCard.splice(index, 1);
      }
    }

    this.checkCilindros();
  }

  /**
   * Función que revisa que a lo menos vaya un cilindro en la venta
   */
  checkCilindros(): void {
    if (this.venta.cilindros.length > 0) { this.cilindrosOk = true; }
    else { this.cilindrosOk = false; }
  }

  /**
   * Revisa que se haya seleccionado un cliente
   */
  checkCliente(): boolean {
    if (this.cliente) { return true; }
    return false;
  }

  /**
   * Función que revisa que estén todos los precios para cada cilindro de la venta
   * Luego calcula el monto total de la venta
   * @param evento Recibe el componente hijo
   */
  calcularMonto(evento: any): void {
    if (!evento.checkPrecios()) {
      this.montoOk = false;
      return;
    }
    this.montoOk = true;

    if (!this.checkCliente()) {
      this.clienteOk = false;
      return;
    }
    this.clienteOk = true;

    this.venta.cliente_id = this.cliente.id;
    this.venta.monto = 0;
    this.venta.cobros = new Array<CilindroModel>();
    this.confirmarPrecios = false;
    this.cilindrosCard.forEach(cilindro => {
      this.venta.monto += cilindro.cobro;
      this.venta.cobros.push(cilindro);
    });
    this.preciosOk = true;
  }

  /**
   * Escucha la emisión del componente hijo
   * Si cambia algun precio para un cilindro
   * Y se actualizan los botonos mostrados en pantalla
   */
  cambiarBtn(): void {
    this.confirmarPrecios = true;
    this.preciosOk = false;
  }

  /**
   * Función que limpia todo el formulario
   */
  limpiarTodo(): void {
    this.limpiarLista();
    this.venta.codigo = '';
    this.venta.cliente_id = null;
    this.cliente = null;
    this.venta.entrega = moment();
    this.transformarDatos();
    this.preciosOk = false;
  }

  /**
   * Angular From tiene la facultad de actualizar la información automáticamente
   * En este caso, la función se encarga de enviar la información que se guarda en el modelo de Venta
   * @param form Escucha al formulario de Angular
   */
  registrar(form: NgForm): void {

    this.transformarDatos();
    this.checkCilindros();

    if (form.invalid) { return; }

    if (this.fechaOk && this.cilindrosOk) {
      this.registrarVenta.emit(this.venta);
    }

  }

  /**
   * Función para volver a detalle
   */
  recargar(): void {
    this.estadoPeticion.recargar(['venta', 'detalle']);
  }

}
