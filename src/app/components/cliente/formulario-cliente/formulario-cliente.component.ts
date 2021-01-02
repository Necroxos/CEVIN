// Angular
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
// Servicios
import { RutService } from '../../../services/rut.service';
import { AuthService } from '../../../services/auth.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Modelos
import { ClienteModel } from '../../../models/cliente.model';
import { ZonaService } from '../../../services/zona.service';
import { EstandarModel } from '../../../models/estandar.model';
import { DireccionModel } from '../../../models/direccion.model';
import { ComunaService } from '../../../services/comuna.service';

@Component({
  selector: 'app-formulario-cliente',
  templateUrl: './formulario-cliente.component.html',
  styleUrls: []
})
export class FormularioClienteComponent implements OnInit {

  // Variables del componenete
  zonas: EstandarModel[];
  comunas: EstandarModel[];
  cliente = new ClienteModel();
  direccion = new DireccionModel();
  // Variables recibidas de componentes hijos
  @Input() accionBtn: string;
  @Input() ClienteEdit: ClienteModel;
  @Input() DireccionEdit: DireccionModel;
  // Variables enviadas a componentes hijos
  @Output() registrarCliente: EventEmitter<any>;
  // Variable para el stepper
  isLinear = false;

  constructor(private auth: AuthService, private rutServ: RutService, private comunaServ: ComunaService,
              private zonaServ: ZonaService, private estadoPeticion: PeticionesService) {
    this.registrarCliente = new EventEmitter();
  }

  ngOnInit(): void {
    this.obtenerComunas();
    this.cliente.empresa = false;
    this.cliente.razon_social = null;
    if (this.ClienteEdit) { this.cliente = this.ClienteEdit; }
    if (this.DireccionEdit) {
      this.direccion = this.DireccionEdit;
      this.obtenerZonas(this.direccion.comuna_id);
    }
  }

  /**
   * Angular From tiene la facultad de actualizar la información automáticamente
   * En este caso, la función se encarga de enviar la información que se guarda en el modelo de Cliente
   * @param form Escucha al formulario de Angular
   */
  registrar(form: NgForm): void {
    if (form.invalid) { return; }

    this.rutServ.CheckRUT(this.cliente.rut).then((res) => {
      if (res) {
        this.transformarDatos();
        this.registrarCliente.emit({cliente: this.cliente, direccion: this.direccion});
      } else {
        this.rutServ.rutInvalido();
      }
    });
  }

  /**
   * Transformamos la información del cliente para pasar los datos correctos al Back End
   */
  transformarDatos(): void {
    const rut = String(this.rutServ.quitarFormato(this.cliente.rut));
    const len = rut.length;
    this.cliente.dni = rut.substring(0, len - 1);
    this.cliente.dv = rut.substring(len - 1);

    if (!this.cliente.empresa){ this.cliente.razon_social = null; }
  }

  /**
   * Función que revisa que el cliente autenticado tenga permisos de administrador administrador
   * Regresa un true o false para habilitar funciones en la vista
   */
  esAdmin(): boolean {
    return this.auth.esAdmin;
  }

  /**
   * Función que busca todas las zonas disponibles en la base de datos
   */
  obtenerZonas(event: number): void {
    this.zonaServ.obtenerPorComuna(event).subscribe((res: any) => {
      this.zonas = res.response;
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

  /**
   * Función que busca todas las comunas disponibles en la base de datos
   */
  obtenerComunas(): void {
    this.comunaServ.obtenerTodos().subscribe((res: any) => {
      this.comunas = res.response;
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

  /**
   * Función que limpia todo el formulario
   */
  limpiarTodo(): void {
    this.cliente = new ClienteModel();
    this.direccion = new DireccionModel();
    this.zonas = new Array<EstandarModel>();
    this.cliente.empresa = false;
    this.cliente.razon_social = null;
  }

}
