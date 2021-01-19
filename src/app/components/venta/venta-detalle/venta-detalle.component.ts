/************************************************************************************************************************************
 *                                              IMPORTACIONES Y DECORADOR COMPONENT                                                 *
 ************************************************************************************************************************************/
// Angular
import { Component, HostListener, ViewChild, OnInit } from '@angular/core';
// Angular Material
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
// Servicios
import { AuthService } from '../../../services/auth.service';
import { VentaService } from '../../../services/venta.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Módulos
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
// Modelos
import { VentaModel } from '../../../models/venta.model';
// Componente
import { VentaEliminarComponent } from '../venta-eliminar/venta-eliminar.component';

@Component({
  selector: 'app-venta-detalle',
  templateUrl: './venta-detalle.component.html',
  styleUrls: ['./venta-detalle.component.css']
})
export class VentaDetalleComponent implements OnInit {

  /**********************************************************************************************************************************
   *                                                       VARIABLES                                                                *
   **********************************************************************************************************************************/

  displayedColumns: string[] = ['codigo', 'rut_cliente', 'codigo_activo', 'finalizado', 'activo', 'opciones'];

  cilindrosDevueltos = 0;
  cilindrosRestantes = 0;

  isAdmin = false;
  tableSmall = false;
  panelOpenState = false;
  isLoadingResults = true;
  isRateLimitReached = false;
  dataSource: MatTableDataSource<VentaModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  /**********************************************************************************************************************************
   *                                                    EJECUCIÓN AL INICIAR                                                        *
   **********************************************************************************************************************************/

  @HostListener('window:resize', ['$event']) onResize(event: any): void {
    // guard against resize before view is rendered
    const tmpWidth = window.innerWidth;
    if (tmpWidth < 992) { this.tableSmall = true; }
    else { this.tableSmall = false; }
  }

  /**
   * Inicializa servicios
   * @param auth Servicio de autenticación
   * @param ventaServ Servicio con peticiones HTTP al Back End
   * @param estadoPeticion Servicio con funciones de Carga y Error
   */
  constructor(private ventaServ: VentaService, private auth: AuthService,
              private estadoPeticion: PeticionesService, public dialog: MatDialog) { }

  /**
   * Escucha el tamaño de escala de la ventana
   */
  ngOnInit(): void {
    this.onResize(0);
  }

  /**
   * Obtenemos la información del Back End y la usamos en el mat-table
   * también verificamos los privilegios del usuario
   */
  ngAfterViewInit(): void {
    this.ventaServ.obtenerTodos().subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res.response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoadingResults = false;
      this.isRateLimitReached = false;
      this.isAdmin = this.esAdmin();
    }, (err: any) => {
      console.log(err);
      this.isRateLimitReached = true;
      this.isLoadingResults = false;
      this.estadoPeticion.error(err);
    });
  }

  /**
   * Función que revisa que el usuario autenticado tenga permisos de administrador administrador
   * Regresa un true o false para habilitar funciones en la vista
   */
  esAdmin(): boolean {
    return this.auth.esAdmin;
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
   * Función que se encarga de redirigir a la vista de Editar
   * @param evento Recibe el objeto Cilindro de la fila
   */
  editar(evento: VentaModel): void {
    this.ventaServ.guardarVenta(evento);
    this.estadoPeticion.recargar(['venta', 'editar']);
  }

  /**
   * Función que desactiva el estado de una venta en la base de datos
   * @param evento Recibe la venta a eliminar
   */
  confirmarAccion(evento: VentaModel): void {
    this.dialog.open(VentaEliminarComponent, {
      width: '40vh',
      data: evento
    });
  }

  info(evento: VentaModel): void {
    this.ventaServ.guardarVenta(evento);
    this.estadoPeticion.recargar(['venta', 'info']);
  }

}
