/************************************************************************************************************************************
 *                                              IMPORTACIONES Y DECORADOR COMPONENT                                                 *
 ************************************************************************************************************************************/
// Angular
import { Component, HostListener, ViewChild, OnInit } from '@angular/core';
// Componentes
import { FormularioZonaComponent } from './formulario-zona/formulario-zona.component';
// Angular Material
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
// Servicios
import { AuthService } from '../../../services/auth.service';
import { ZonaService } from '../../../services/zona.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Modelos
import { EstandarModel } from '../../../models/estandar.model';
// Módulos
import Swal from 'sweetalert2';

@Component({
  selector: 'app-zona',
  templateUrl: './zona.component.html',
  styleUrls: ['./zona.component.css']
})
export class ZonaComponent implements OnInit {

  /**********************************************************************************************************************************
   *                                                       VARIABLES                                                                *
   **********************************************************************************************************************************/

  displayedColumns: string[] = ['correlativo', 'descripcion', 'comuna', 'activo', 'opciones'];

  cilindrosDevueltos = 0;
  cilindrosRestantes = 0;

  propietario = new EstandarModel();

  isAdmin = false;
  tableSmall = false;
  panelOpenState = false;
  isLoadingResults = true;
  isRateLimitReached = false;
  dataSource: MatTableDataSource<EstandarModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  /**********************************************************************************************************************************
   *                                                    EJECUCIÓN AL INICIAR                                                        *
   **********************************************************************************************************************************/

  @HostListener('window:resize', ['$event']) onResize(event: any): void {
    // guard against resize before view is rendered
    const tmpWidth = window.innerWidth;
    if (tmpWidth < 780) { this.tableSmall = true; }
    else { this.tableSmall = false; }
  }

  /**
   * Inicializa servicios
   * @param auth Servicio de autenticación
   * @param estadoPeticion Servicio con funciones de Carga y Error
   * @param servicio Servicio con peticiones HTTP al Back End
   */
  constructor(private servicio: ZonaService, private estadoPeticion: PeticionesService,
              private auth: AuthService, public dialog: MatDialog) { }

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
    this.servicio.obtenerTodos().subscribe((res: any) => {
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
   * @param evento Recibe el objeto Estandar de la fila
   */
  editar(evento: any): void {
    this.dialog.open(FormularioZonaComponent, {
      width: '40vh',
      data: {
        titulo: 'Editar la zona',
        descripcion: evento.descripcion,
        id: evento.id,
        comuna_id: evento.comuna_id
      }
    });
  }

  /**
   * Función que cambia el estado de activo para una zona en la base de datos
   */
  cambiarEstado(evento: EstandarModel): void {
    this.estadoPeticion.loading();
    evento.activo = !evento.activo;

    this.servicio.cambiarEstado(evento).subscribe(() => {
      Swal.close();
      this.estadoPeticion.success('Estado cambiado', ['zona'], 1000);
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

  /**
   * Función que abre el modal para el formulario de registrar
   */
  openDialog(): void {
    this.dialog.open(FormularioZonaComponent, {
      width: '40vh',
      data: {titulo: 'Ingresar una nueva zona'}
    });
  }

}
