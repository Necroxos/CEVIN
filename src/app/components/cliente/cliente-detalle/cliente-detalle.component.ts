/************************************************************************************************************************************
 *                                              IMPORTACIONES Y DECORADOR COMPONENT                                                 *
 ************************************************************************************************************************************/
// Angular
import { Component, HostListener, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Angular Material
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
// Servicios
import { AuthService } from '../../../services/auth.service';
import { ClienteService } from '../../../services/cliente.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Módulos
import Swal from 'sweetalert2';
// Modelos
import { ClienteModel } from '../../../models/cliente.model';

@Component({
  selector: 'app-cliente-detalle',
  templateUrl: './cliente-detalle.component.html',
  styleUrls: ['./cliente-detalle.component.css']
})
export class ClienteDetalleComponent implements OnInit {
  /**********************************************************************************************************************************
   *                                                       VARIABLES                                                                *
   **********************************************************************************************************************************/

  displayedColumns: string[] = ['cliente_id', 'rut', 'contacto', 'email', 'telefono', 'razon_social', 'activo', 'opciones'];

  dataSource: MatTableDataSource<ClienteModel>;
  isAdmin = false;
  tableSmall = false;
  panelOpenState = false;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  /**********************************************************************************************************************************
   *                                                    EJECUCIÓN AL INICIAR                                                        *
   **********************************************************************************************************************************/

  @HostListener('window:resize', ['$event']) onResize(event): void {
    // guard against resize before view is rendered
    const tmpWidth = window.innerWidth;
    if (tmpWidth < 2500) { this.tableSmall = true; }
    else { this.tableSmall = false; }
  }

  /**
   * Inicializa módulos y servicios
   * @param auth Servicio de autenticación
   * @param router Módulo que enruta y redirecciona
   * @param clienteServ Servicio con peticiones HTTP al Back End
   * @param estadoPeticion Servicio con funciones de Carga y Error
   */
  constructor(private router: Router, private clienteServ: ClienteService,
              private auth: AuthService, private estadoPeticion: PeticionesService) { }

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
    this.clienteServ.obtenerTodos().subscribe((res: any) => {
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
   * Función que revisa que el usuario autenticado tenga permisos de administrador administrador
   * Regresa un true o false para habilitar funciones en la vista
   */
  esAdmin(): boolean {
    return this.auth.esAdmin;
  }

  /**********************************************************************************************************************************
   *                                                  FUNCIONES DEL COMPONENTE                                                      *
   **********************************************************************************************************************************/

  /**
   * Función que se encarga de redirigir a la vista de Editar
   * @param evento Recibe el objeto Cilindro de la fila
   */
  editar(evento: ClienteModel): void {
    this.clienteServ.guardarCliente(evento);
    this.router.navigate(['cliente', 'editar']);
  }

  /**
   * Función que se encarga de redirigir a la vista de Información
   * @param evento Recibe el objeto Cilindro de la fila
   */
  info(evento: ClienteModel): void {
    this.clienteServ.guardarCliente(evento);
    this.router.navigate(['cliente', 'info']);
  }

  /**
   * Función que cambia el estado de un cilindro a desactivado en la base de datos
   */
  cambiarEstado(evento: ClienteModel): void {
    this.estadoPeticion.loading();
    evento.activo = !evento.activo;
    this.clienteServ.cambiarEstado(evento).subscribe((res: any) => {
      Swal.close();
      this.estadoPeticion.success(res.message, [], 700);
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

}
