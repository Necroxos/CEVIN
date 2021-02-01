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
import { ToastrService } from 'ngx-toastr';
import { PdfmakerService } from '../../../services/pdfmaker.service';
import { CilindroService } from '../../../services/cilindro.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Módulos
import Swal from 'sweetalert2';
// Modelos
import { CilindroModel } from 'src/app/models/cilindro.model';

@Component({
  selector: 'app-activo-detalle',
  templateUrl: './activo-detalle.component.html'
})
export class ActivoDetalleComponent implements OnInit {

  /**********************************************************************************************************************************
   *                                                       VARIABLES                                                                *
   **********************************************************************************************************************************/

  displayedColumns: string[] = ['correlativo', 'codigo_activo', 'fecha_mantencion', 'tipo_gas', 'metros_cubicos', 'propietario', 'activo', 'opciones'];

  dataSource: MatTableDataSource<CilindroModel>;
  tableSmall = false;
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
    if (tmpWidth < 1200) { this.tableSmall = true; }
    else { this.tableSmall = false; }
  }

  /**
   * Inicializa módulos y servicios
   * @param router Módulo que enruta y redirecciona
   * @param toastr Servicio con funciones de mensajes
   * @param pdfmaker Servicio con funciones de impresión
   * @param cilindroServ Servicio con peticiones HTTP al Back End
   * @param estadoPeticion Servicio con funciones de Carga y Error
   */
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private pdfmaker: PdfmakerService,
    private cilindroServ: CilindroService,
    private estadoPeticion: PeticionesService) { }

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
    this.cilindroServ.obtenerTodos().subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res.response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoadingResults = false;
      this.isRateLimitReached = false;
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
   * Función que se encarga de imprimir la etiqueta del cilindro con el código QR
   * @param evento Recibe el objeto Cilindro de la fila
   */
  imprimir(evento: CilindroModel): void {
    this.pdfmaker.imprimirPDF(evento.codigo_activo);
  }

  info(evento: CilindroModel): void {
    localStorage.setItem('cilindro', evento.codigo_activo);
    this.estadoPeticion.recargar(['activo', 'escaner']);
  }

  /**
   * Función que se encarga de redirigir a la vista de Editar
   * @param evento Recibe el objeto Cilindro de la fila
   */
  editar(evento: CilindroModel): void {
    this.cilindroServ.guardarCilindro(evento);
    this.router.navigate(['activo', 'editar']);
  }

  /**
   * Verifica que se pueda enviar al Back End
   * Y debe estar en la empresa, además de que no esté en una venta
   */
  cambiarEstado(evento: CilindroModel): void {
    if (evento.stock || !evento.activo) {
      this.enviarEstado(evento);
    } else {
      this.toastr.error('El cilindro no está en Stock', 'Acción no permitida', {
        timeOut: 3000,
        positionClass: 'toast-bottom-right'
      });
    }
  }

  /**
   * Función que cambia el estado de un cilindro a desactivado en la base de datos
   */
  enviarEstado(cilindro: CilindroModel): void {
    this.estadoPeticion.loading();
    cilindro.activo = !cilindro.activo;
    this.cilindroServ.cambiarEstado(cilindro).subscribe((res: any) => {
      Swal.close();
      this.estadoPeticion.success(res.message, ['activo', 'detalle'], 700);
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

}
