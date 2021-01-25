/************************************************************************************************************************************
 *                                              IMPORTACIONES Y DECORADOR COMPONENT                                                 *
 ************************************************************************************************************************************/
// Angular
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
// Servicios
import { StockService } from '../../../services/stock.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Modelos
import { CilindroModel } from 'src/app/models/cilindro.model';
// Módulos
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
// Material
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-rotados',
  templateUrl: './rotados.component.html',
  styles: [
  ]
})
export class RotadosComponent implements OnInit {

  /**********************************************************************************************************************************
   *                                                       VARIABLES                                                                *
   **********************************************************************************************************************************/

  cilindros: CilindroModel[];
  cilindrosMarcados: CilindroModel[];

  smallDevice = false;

  // Variables para la tabla de cilindros
  displayedColumns: string[] = ['sel', 'codigo', 'propietario', 'tipo_gas', 'metros_cubicos'];
  dataSource: MatTableDataSource<CilindroModel>;
  panelOpenState = false;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  /**********************************************************************************************************************************
   *                                                    EJECUCIÓN AL INICIAR                                                        *
   **********************************************************************************************************************************/
  @HostListener('window:resize', ['$event']) onResize(event: any): void {
    // guard against resize before view is rendered
    const tmpWidth = window.innerWidth;
    if (tmpWidth < 992) { this.smallDevice = true; }
    else { this.smallDevice = false; }
  }

  /**
   * Inicializa servicios
   * @param toastr Servicio con funciones de mensajes
   * @param servicio Servicio con peticiones HTTP al Back End
   * @param cilindroServ Servicio con peticiones HTTP al Back End
   * @param estadoPeticion Servicio con funciones de Carga y Error
   */
  constructor(
    private toastr: ToastrService,
    private servicio: StockService,
    private estadoPeticion: PeticionesService
    ) { }

  ngOnInit(): void {
    this.onResize(0);
    this.obtenerCilindros();
  }

  /**
   * Cargamos la información de los cilindros
   */
  obtenerCilindros(): void {
    this.servicio.obtenerCilindrosRotados().subscribe((res: any) => {
      this.cilindros = res.response;
      this.dataSource = new MatTableDataSource(this.cilindros);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isRateLimitReached = false;
      this.isLoadingResults = false;
    }, (err: any) => {
      console.log(err);
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
   * Función que se encarga de marcar como "Cilindro escogido" para la venta
   * @param cilindo Obtiene el objeto cilindro de la tabla
   * @param evento Obtiene el check o uncheck (boolean)
   */
  marcarCilindro(cilindro: CilindroModel, evento: boolean): void {
    cilindro.escogido = evento;
    if (evento) { cilindro.activo = true; }
    else { cilindro.activo = false; }
  }

  /**
   * Función que revisa que a lo menos vaya un cilindro en la venta
   */
  checkCilindros(): boolean {
    this.cilindrosMarcados = new Array<CilindroModel>();
    this.cilindros.forEach(cilindro => {
      if (cilindro.escogido) { this.cilindrosMarcados.push(cilindro); }
    });
    if (this.cilindrosMarcados.length > 0) { return true; }
    return false;
  }

  /**
   * Función que se encarga de enviar un listado de cilindros
   * Mediante el servicio de StockService
   * Y marca los cilindros como 'Activados' en el sistema
   * Por rotación llegada de su rotación
   */
  rotarCilindros(): void {
    const checkLista = this.checkCilindros();
    if (checkLista) {
      this.servicio.rotarCilindros(this.cilindrosMarcados).subscribe((res: any) => {
        Swal.close();
        this.estadoPeticion.success(res.message, ['stock', 'rotados'], 750);
      }, (err: any) => {
        this.estadoPeticion.error(err);
      });
    } else {
      this.toastr.error('Debe seleccionar un activo', 'Sin datos', {
        timeOut: 3000,
        positionClass: 'toast-bottom-right'
      });
    }
  }

}
