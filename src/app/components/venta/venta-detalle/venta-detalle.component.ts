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
import { PdfmakerService } from '../../../services/pdfmaker.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Módulos
import { MatDialog } from '@angular/material/dialog';
// Modelos
import { VentaModel } from '../../../models/venta.model';
import { CilindroModel } from '../../../models/cilindro.model';
// Componente
import { VentaEliminarComponent } from '../venta-eliminar/venta-eliminar.component';

@Component({
  selector: 'app-venta-detalle',
  templateUrl: './venta-detalle.component.html'
})
export class VentaDetalleComponent implements OnInit {

  /**********************************************************************************************************************************
   *                                                       VARIABLES                                                                *
   **********************************************************************************************************************************/

  displayedColumns: string[] = ['codigo', 'rut_cliente', 'codigo_activo', 'fecha', 'finalizado', 'activo', 'opciones'];

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
  constructor(
    private auth: AuthService,
    private ventaServ: VentaService,
    private pdfmaker: PdfmakerService,
    private estadoPeticion: PeticionesService,
    public dialog: MatDialog) { }

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

  mostrarBtn(venta: any): boolean {
    let ok = false;
    if (venta.activo && !venta.finalizado) { ok = true; }
    else { ok = false; }

    if (venta.restoCilindros !== 0) { ok = false; }

    return ok;
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
      width: '60vh',
      data: evento
    });
  }

  /**
   * Función que redirige a la vista con información detallada
   * @param evento Recibe la fila seleccionada, de tipo venta
   */
  info(evento: VentaModel): void {
    this.ventaServ.guardarVenta(evento);
    this.estadoPeticion.recargar(['venta', 'info']);
  }

  /**
   * Función que se encarga de imprimir el boucher de Venta
   * También busca los cilindros de una venta, mediante el servicio de VentaService
   * @param evento Recibe el objeto Venta de la fila
   */
  async imprimir(evento: VentaModel): Promise<any> {
    try {
      let cilindros: any[];
      const response: any = await this.ventaServ.obtenerCilindrosDeVenta(evento).toPromise();
      cilindros = [...response.response];
      this.pdfmaker.imprimirBoucher(evento, cilindros);
    } catch (error) {
      console.log(error);
      this.estadoPeticion.error(error);
    }
  }

}
