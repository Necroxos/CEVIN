/************************************************************************************************************************************
 *                                              IMPORTACIONES Y DECORADOR COMPONENT                                                 *
 ************************************************************************************************************************************/
// Angular
import { Component, Input, OnInit, ViewChild } from '@angular/core';
// Angular Material
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
// Servicios
import { VentaService } from '../../../services/venta.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Módulos
import Swal from 'sweetalert2';
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
  templateUrl: './venta-info.component.html',
  styleUrls: ['./venta-info.component.css']
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
  displayedColumns: string[] = ['correlativo', 'codigo_activo', 'metros_cubicos', 'fecha_retorno', 'opciones'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() ventaCard: VentaModel;
  @Input() cilindrosElegidos: CilindroModel[];
  ventaLocal = this.ventaServ.leerVenta();

  /**********************************************************************************************************************************
   *                                                    EJECUCIÓN AL INICIAR                                                        *
   **********************************************************************************************************************************/

  /**
   * Inicializa servicios
   * @param clienteServ Servicio con peticiones HTTP al Back End
   * @param estadoPeticion Servicio con funciones de Carga y Error
   */
  constructor(private estadoPeticion: PeticionesService, private ventaServ: VentaService,
              private router: Router, public dialog: MatDialog) { }

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
      this.cilindrosDeVenta(this.venta);
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

  cilindrosDeVenta(venta: VentaModel): void {
    this.ventaServ.obtenerCilindrosDeVenta(venta).subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res.response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoadingResults = false;
      this.isRateLimitReached = false;
    }, (err: any) => {
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

  devolver(cilindro: CilindroModel): void {
    this.dialog.open(FechaRetornoComponent, {
      width: '40vh',
      data: {
        titulo: 'Confirmar fecha de devolución',
        cilindro_id: cilindro.cilindro_id,
        venta_id: this.venta.venta_id,
        codigo: this.venta.codigo,
        estado: true
      }
    });
  }

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

  checkEstado(cilindro: CilindroModel): void {
    if (cilindro.stock) { this.devolver(cilindro); }
    else { this.cancelar(cilindro); }
  }

}
