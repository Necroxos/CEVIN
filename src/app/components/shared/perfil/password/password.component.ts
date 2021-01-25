/************************************************************************************************************************************
 *                                              IMPORTACIONES Y DECORADOR COMPONENT                                                 *
 ************************************************************************************************************************************/
// Angular
import { NgForm } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
// Angular Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// Componentes
import { PerfilComponent } from '../perfil.component';
// Módulos
import Swal from 'sweetalert2';
// Modelos
import { UsuarioModel } from '../../../../models/usuario.model';
// Servicios
import { UsuarioService } from '../../../../services/usuario.service';
import { PeticionesService } from '../../../../services/peticiones.service';

export interface DialogData {
  id: number;
}

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styles: [
  ]
})
export class PasswordComponent implements OnInit {

  usuario = new UsuarioModel();
  errorPassword = false;
  hide = true;

  constructor(
    private servicio: UsuarioService,
    public dialogRef: MatDialogRef<PerfilComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private estadoPeticion: PeticionesService) { }

  ngOnInit(): void {
    this.usuario.usuario_id = this.data.id;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * Angular From tiene la facultad de actualizar la información automáticamente
   * En este caso, la función se encarga de enviar la información que se guarda en el modelo de Usuario
   * @param form Escucha al formulario de Angular
   */
  editar(form: NgForm): void {
    if (form.invalid) { return; }
    else if (this.usuario.password !== this.usuario.confirm_password) {
      this.errorPassword = true;
      return;
    } else {
      this.errorPassword = false;
    }
    this.estadoPeticion.loading();

    this.servicio.cambiarPass(this.usuario).subscribe(() => {
      Swal.close();
      this.estadoPeticion.success('Contraseña cambiada!', ['perfil'], 1000);
      this.dialogRef.close();
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

}
