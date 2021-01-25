/************************************************************************************************************************************
 *                                              IMPORTACIONES Y DECORADOR COMPONENT                                                 *
 ************************************************************************************************************************************/
// Angular
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
// Angular Material
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
// Servicios
import { VentaService } from '../../../services/venta.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Módulos
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
// Modelos
import { VentaModel } from '../../../models/venta.model';
import { CilindroModel } from 'src/app/models/cilindro.model';
// Enrutador
import { Router } from '@angular/router';
// Componente
import { FechaRetornoComponent } from '../fecha-retorno/fecha-retorno.component';

@Component({
  selector: 'app-venta-info',
  templateUrl: './venta-info.component.html'
})
export class VentaInfoComponent implements OnInit {

  /**********************************************************************************************************************************
   *                                                       VARIABLES                                                                *
   **********************************************************************************************************************************/
  mostrar = false;

  venta = new VentaModel();
  cilindros = new Array<CilindroModel>();

  panelOpenState = false;
  isLoadingResults = true;
  isRateLimitReached = false;
  dataSource: MatTableDataSource<CilindroModel>;
  displayedColumns: string[] = ['correlativo', 'codigo_activo', 'cilindro', 'cobros', 'fecha_retorno', 'opciones'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() ventaCard: VentaModel;
  @Input() cilindrosElegidos: CilindroModel[];
  ventaLocal = this.ventaServ.leerVenta();

  // Variables enviadas a componentes hijos
  @Output() cambioPrecio: EventEmitter<void>;

  /**********************************************************************************************************************************
   *                                                    EJECUCIÓN AL INICIAR                                                        *
   **********************************************************************************************************************************/

  /**
   * Inicializa servicios
   * @param router Módulo que enruta y redirecciona
   * @param ventaServ Servicio con peticiones HTTP al Back End
   * @param estadoPeticion Servicio con funciones de Carga y Error
   */
  constructor(
    private router: Router,
    private ventaServ: VentaService,
    private estadoPeticion: PeticionesService,
    public dialog: MatDialog) { this.cambioPrecio = new EventEmitter(); }

  /**
   * Leemos el [rut] del locaStorage y buscamos el cliente en la BD para poder editarlo
   */
  ngOnInit(): void {
    if (this.ventaLocal) {
      this.venta.codigo = this.ventaLocal;
      this.cargarInfo();
    } else if (this.ventaCard) {
      this.venta = this.ventaCard;
      this.cilindros = this.cilindrosElegidos;
      this.mostrar = true;
    }

    this.checkRuta();
  }

  /**
   * Redirigimos si no hay info para mostrar
   * sólo ocurre en la ruta /cliente/info
   */
  checkRuta(): void {
    if (this.router.url.indexOf('info') > -1) {
      if (!this.venta.codigo) {
        this.router.navigate(['venta', 'detalle']);
      }
    }
  }

  /**
   * Función que carga la información en la venta
   */
  cargarInfo(): void {
    this.estadoPeticion.loading();
    this.ventaServ.obtenerUno(this.venta).subscribe((res: any) => {
      Swal.close();
      this.venta = { ...res.response };
      this.venta.entrega = moment(this.venta.fecha_entrega, 'DD/MM/YYYY');
      this.cilindrosDeVenta(this.venta);
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

  /**
   * Función que se encarga de buscar los cilindros de una venta, mediante el servicio de VentaService
   * Y luego carga la información en el mat-table
   * @param venta Recibe un modelo de venta
   */
  cilindrosDeVenta(venta: VentaModel): void {
    this.ventaServ.obtenerCilindrosDeVenta(venta).subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res.response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoadingResults = false;
      this.isRateLimitReached = false;
    }, (err: any) => {
      this.isRateLimitReached = true;
      this.isLoadingResults = false;
      this.estadoPeticion.error(err);
    });
  }

  /**
   * Filtro para el mat-table
   * @param event Recibe el texto escrito en el buscador
   */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**********************************************************************************************************************************
   *                                                  FUNCIONES DEL COMPONENTE                                                      *
   **********************************************************************************************************************************/

  /**
   * Función que se encarga de abrir el sub-componente
   * con el formulario para la devolución
   * @param cilindro Recibe el modelo de cilindro
   */
  devolver(cilindro: CilindroModel): void {
    this.dialog.open(FechaRetornoComponent, {
      width: '40vh',
      data: {
        estado: true,
        codigo: this.venta.codigo,
        entrega: this.venta.entrega,
        venta_id: this.venta.venta_id,
        cilindro_id: cilindro.cilindro_id,
        titulo: 'Confirmar fecha de devolución'
      }
    });
  }

  /**
   * Función que se encarga de hacer la petición al servicio
   * Para cancelar una devolución
   * @param cilindro Recibe el modelo de cilindro
   */
  cancelar(cilindro: CilindroModel): void {
    this.estadoPeticion.loading();
    this.venta.cilindro_id = cilindro.cilindro_id;
    this.venta.finalizado = false;
    this.venta.fecha_retorno = '01/01/1990';
    this.ventaServ.devolverCilindro(this.venta).subscribe((res: any) => {
      Swal.close();
      this.ventaServ.guardarVenta(this.venta);
      this.estadoPeticion.success(res.message, ['venta', 'info'], 750);
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

  /**
   * Función ligada al HTML, escucha el botón 'Toggle'
   * Según el estado de 'Stock' llama a una función u otra
   * @param cilindro Recibe el modelo de cilindro
   */
  checkEstado(cilindro: CilindroModel): void {
    if (cilindro.stock) { this.devolver(cilindro); }
    else { this.cancelar(cilindro); }
  }

  /**
   * Función que se encarga de revisar que todos los cilindros
   * Asociados a una venta posean asignado un precio
   */
  checkPrecios(): boolean {
    let seguir = false;
    if (this.cilindros.length > 0) {
      this.cilindros.forEach(cilindro => {
        if (cilindro.cobro && cilindro.cobro !== 0) { seguir = true; }
        else { seguir = false; }
      });
    }
    return seguir;
  }

  /**
   * Función que se encarga de escuchar cambios en el input del precio
   * Para obligar a recalcular el monto total de la venta
   * Esto emitiendo una señal al componente padre
   */
  checkPrecio(): void {
    this.cambioPrecio.emit();
  }

  /**
   * Función para volver a detalle
   */
  recargar(): void {
    this.estadoPeticion.recargar(['venta', 'detalle']);
  }


}
