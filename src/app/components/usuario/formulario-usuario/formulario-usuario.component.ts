// Angular
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
// Servicios
import { RolService } from '../../../services/rol.service';
import { RutService } from '../../../services/rut.service';
import { AuthService } from '../../../services/auth.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Modelos
import { EstandarModel } from '../../../models/estandar.model';
import { UsuarioModel } from '../../../models/usuario.model';

@Component({
  selector: 'app-formulario-usuario',
  templateUrl: './formulario-usuario.component.html',
  styleUrls: []
})
export class FormularioUsuarioComponent implements OnInit {

  // Variables del componenete
  usuario: UsuarioModel = new UsuarioModel();
  roles: [EstandarModel];
  errorPassword = false;
  hide = true;
  // Variables recibidas de componentes hijos
  @Input() accionBtn: string;
  @Input() UsuarioEdit: UsuarioModel;
  // Variables enviadas a componentes hijos
  @Output() registrarUsuario: EventEmitter<UsuarioModel>;

  constructor(private estadoPeticion: PeticionesService, private auth: AuthService,
              private rolServ: RolService, private rutServ: RutService) {
    this.registrarUsuario = new EventEmitter();
  }

  ngOnInit(): void {
    this.obtenerRoles();
    if (this.UsuarioEdit) { this.usuario = this.UsuarioEdit; }
  }

  /**
   * Angular From tiene la facultad de actualizar la información automáticamente
   * En este caso, la función se encarga de enviar la información que se guarda en el modelo de Cilindro
   * @param form Escucha al formulario de Angular
   */
  registrar(form: NgForm): void {
    if (form.invalid) { return; }
    else if (this.usuario.password !== this.usuario.confirm_password) {
      this.errorPassword = true;
      return;
    } else {
      this.errorPassword = false;
    }

    this.rutServ.CheckRUT(this.usuario.rut).then((res) => {
      if (res) {
        const rut = String(this.rutServ.quitarFormato(this.usuario.rut));
        const len = rut.length;
        this.usuario.dni = rut.substring(0, len - 1);
        this.usuario.dv = rut.substring(len - 1);
        this.registrarUsuario.emit(this.usuario);
      } else {
        this.rutServ.rutInvalido();
      }
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
   * Cargamos la información de los posibles roles
   */
  obtenerRoles(): void {
    this.rolServ.obtenerTodos().subscribe((res: any) => {
      this.roles = res.response;
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

}
