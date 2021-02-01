/************************************************************************************************************************************
 *                                              IMPORTACIONES Y DECORADOR COMPONENT                                                 *
 ************************************************************************************************************************************/
// Angular
import { Component, Inject, OnInit } from '@angular/core';
// Angular Material
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
// Modelos
import { UsuarioModel } from '../../../models/usuario.model';
// Módulos
import Swal from 'sweetalert2';
// Servicios
import { UsuarioService } from '../../../services/usuario.service';
import { PeticionesService } from '../../../services/peticiones.service';

export interface DialogData {
  email: string;
}

@Component({
  selector: 'app-recuperar-pass',
  templateUrl: './recuperar-pass.component.html'
})
export class RecuperarPassComponent implements OnInit {

  usuario = new UsuarioModel();

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private servicio: UsuarioService,
    private estadoPeticion: PeticionesService) { }

  ngOnInit(): void {
    this.usuario.email = this.data.email;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  registrar(): void {
    this.estadoPeticion.loading();

    this.servicio.restablecerPass(this.usuario).subscribe(() => {
      Swal.close();
      this.estadoPeticion.success('Contraseña enviada al correo', [], 1500);
      this.dialogRef.close();
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

}
