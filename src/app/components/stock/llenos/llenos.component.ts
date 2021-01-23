/************************************************************************************************************************************
 *                                              IMPORTACIONES Y DECORADOR COMPONENT                                                 *
 ************************************************************************************************************************************/
// Angular
import { Component, OnInit, ViewChild } from '@angular/core';
// Servicios
import { StockService } from '../../../services/stock.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Modelos
import { CilindroModel } from 'src/app/models/cilindro.model';
// Módulos
import Swal from 'sweetalert2';
// Material
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-llenos',
  templateUrl: './llenos.component.html',
  styles: [
  ]
})
export class LlenosComponent implements OnInit {

  /**********************************************************************************************************************************
   *                                                       VARIABLES                                                                *
   **********************************************************************************************************************************/

  cilindros: CilindroModel[];
  cilindrosMarcados: CilindroModel[];

  // Variables para la tabla de cilindros
  displayedColumns: string[] = ['sel', 'codigo', 'propietario', 'tipo_gas'];
  dataSource: MatTableDataSource<CilindroModel>;
  panelOpenState = false;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  /**********************************************************************************************************************************
   *                                                    EJECUCIÓN AL INICIAR                                                        *
   **********************************************************************************************************************************/

  /**
   * Inicializa servicios
   * @param servicio Servicio con peticiones HTTP al Back End
   * @param cilindroServ Servicio con peticiones HTTP al Back End
   * @param estadoPeticion Servicio con funciones de Carga y Error
   */
  constructor(
    private servicio: StockService,
    private estadoPeticion: PeticionesService
    ) { }

  ngOnInit(): void {
    this.obtenerCilindros();
  }

  /**
   * Cargamos la información de los cilindros
   */
  obtenerCilindros(): void {
    this.servicio.obtenerCilindrosLlenos().subscribe((res: any) => {
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
  cilindroVenta(cilindro: CilindroModel, evento: boolean): void {
    cilindro.escogido = evento;
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

  rotarCilindros(): void {
    const checkLista = this.checkCilindros();
    console.log('Lista vacia', !checkLista);
  }

}
