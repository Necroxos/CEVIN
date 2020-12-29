// Angular
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
// Servicios
import { RutService } from '../../../services/rut.service';
import { AuthService } from '../../../services/auth.service';
// Modelos
import { ClienteModel } from '../../../models/cliente.model';

@Component({
  selector: 'app-formulario-cliente',
  templateUrl: './formulario-cliente.component.html',
  styleUrls: []
})
export class FormularioClienteComponent implements OnInit {

  // Variables del componenete
  cliente = new ClienteModel();
  // Variables recibidas de componentes hijos
  @Input() accionBtn: string;
  @Input() ClienteEdit: ClienteModel;
  // Variables enviadas a componentes hijos
  @Output() registrarCliente: EventEmitter<ClienteModel>;

  constructor(private auth: AuthService, private rutServ: RutService) {
    this.registrarCliente = new EventEmitter();
  }

  ngOnInit(): void {
    this.cliente.empresa = false;
    this.cliente.razon_social = null;
    if (this.ClienteEdit) { this.cliente = this.ClienteEdit; }
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
        this.registrarCliente.emit(this.cliente);
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

}
