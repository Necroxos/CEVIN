/************************************************************************************************************************************
 *                                              IMPORTACIONES Y DECORADOR COMPONENT                                                 *
 ************************************************************************************************************************************/
// Angular
import { Component, Input, OnInit } from '@angular/core';
// Servicios
import { ClienteService } from '../../../services/cliente.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Módulos
import Swal from 'sweetalert2';
// Modelos
import { ClienteModel } from '../../../models/cliente.model';
import { DireccionModel } from '../../../models/direccion.model';
// Enrutador
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-info',
  templateUrl: './cliente-info.component.html',
  styleUrls: []
})
export class ClienteInfoComponent implements OnInit {

  /**********************************************************************************************************************************
   *                                                       VARIABLES                                                                *
   **********************************************************************************************************************************/
  mostrar = false;
  cliente = new ClienteModel();
  direcciones: DireccionModel[];
  @Input() clienteCard: ClienteModel;
  @Input() direccionCard: DireccionModel;
  clienteLocal = this.clienteServ.leerCliente();

  /**********************************************************************************************************************************
   *                                                    EJECUCIÓN AL INICIAR                                                        *
   **********************************************************************************************************************************/

  /**
   * Inicializa servicios
   * @param clienteServ Servicio con peticiones HTTP al Back End
   * @param estadoPeticion Servicio con funciones de Carga y Error
   */
  constructor(private estadoPeticion: PeticionesService, private clienteServ: ClienteService,
              private router: Router) {
    localStorage.removeItem('direccion');
  }

  /**
   * Leemos el [rut] del locaStorage y buscamos el cliente en la BD para poder editarlo
   */
  ngOnInit(): void {
    if (this.clienteLocal) {
      this.cliente.rut = this.clienteLocal;
      this.cargarInfo();
    } else if (this.clienteCard) {
      this.cliente = this.clienteCard;
      this.direcciones = [this.direccionCard];
    }

    this.checkRuta();
  }

  /**
   * Redirigimos si no hay info para mostrar
   * sólo ocurre en la ruta /cliente/info
   */
  checkRuta(): void {
    if (this.router.url.indexOf('info') > -1) {
      if (!this.cliente.rut) {
        this.router.navigate(['cliente', 'detalle']);
      }
    }
  }

  /**
   * Función que carga la información en el cliente
   */
  cargarInfo(): void {
    this.estadoPeticion.loading();
    this.clienteServ.obtenerUno(this.cliente).subscribe((res: any) => {
      Swal.close();
      this.estadoPeticion.success(res.message, [], 650);
      this.cliente = { ...res.response };
      this.obtenerDirecciones();
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

  /**
   * Función que se encarga de buscar la última dirección activa
   */
  obtenerDirecciones(): void {
    this.clienteServ.obtenerDirecciones(this.cliente).subscribe((res: any) => {
      this.direcciones = res.response;
      this.mostrar = true;
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

  /**
   * Función para volver a detalle
   */
  recargar(): void {
    this.estadoPeticion.recargar(['cliente', 'detalle']);
  }

}
