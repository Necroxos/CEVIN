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
// Material
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
// Enrutador
import { Router } from '@angular/router';

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

  smallDevice = false;

  // Variables para la tabla de cilindros
  displayedColumns: string[] = ['codigo', 'propietario', 'tipo_gas', 'metros_cubicos'];
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
   * @param servicio Servicio con peticiones HTTP al Back End
   * @param cilindroServ Servicio con peticiones HTTP al Back End
   * @param estadoPeticion Servicio con funciones de Carga y Error
   */
  constructor(
    private router: Router,
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

  /**
   * Función de redirección al componente de escaner
   */
  escaner(): void {
    this.router.navigate(['activo', 'escaner']);
  }

}
