/************************************************************************************************************************************
 *                                              IMPORTACIONES Y DECORADOR COMPONENT                                                 *
 ************************************************************************************************************************************/
// Angular
import { Component, Inject, OnInit } from '@angular/core';
// Angular Material
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
// Modelos
import { EstandarModel } from '../../../../models/estandar.model';
// Componentes
import { PropietarioComponent } from '../propietario.component';
// Módulos
import Swal from 'sweetalert2';
// Servicios
import { PropietarioService } from '../../../../services/propietario.service';
import { PeticionesService } from '../../../../services/peticiones.service';

export interface DialogData {
  descripcion: string;
  titulo: string;
  id: number;
}

@Component({
  selector: 'app-formulario-propietario',
  templateUrl: './formulario-propietario.component.html',
  styleUrls: []
})
export class FormularioPropietarioComponent implements OnInit {

  propietario = new EstandarModel();
  nuevo = true;

  constructor(
    public dialogRef: MatDialogRef<PropietarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private servicio: PropietarioService,
    private estadoPeticion: PeticionesService) { }

  ngOnInit(): void {
    if (this.data.descripcion) {
      this.propietario.descripcion = this.data.descripcion;
      this.propietario.id = this.data.id;
      this.nuevo = false;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  registrar(): void {
    this.estadoPeticion.loading();

    this.servicio.registrar(this.propietario).subscribe(() => {
      Swal.close();
      this.estadoPeticion.success('Nuevo propietario ingresado con éxito!', ['propietario'], 1000);
      this.dialogRef.close();
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

  editar(): void {
    this.estadoPeticion.loading();

    this.servicio.actualizar(this.propietario).subscribe(() => {
      Swal.close();
      this.estadoPeticion.success('Propietario actualizado!', ['propietario'], 1000);
      this.dialogRef.close();
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

}
