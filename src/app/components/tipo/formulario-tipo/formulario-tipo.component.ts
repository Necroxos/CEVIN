/************************************************************************************************************************************
 *                                              IMPORTACIONES Y DECORADOR COMPONENT                                                 *
 ************************************************************************************************************************************/
// Angular
import { Component, Inject, OnInit } from '@angular/core';
// Angular Material
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
// Modelos
import { EstandarModel } from '../../../models/estandar.model';
// Componentes
import { TipoComponent } from '../tipo.component';
// Módulos
import Swal from 'sweetalert2';
// Servicios
import { TipoGasService } from '../../../services/tipo.service';
import { PeticionesService } from '../../../services/peticiones.service';

export interface DialogData {
  titulo: string;
  descripcion: string;
  id: number;
}

@Component({
  selector: 'app-formulario-tipo',
  templateUrl: './formulario-tipo.component.html',
  styleUrls: ['./formulario-tipo.component.css']
})
export class FormularioTipoComponent implements OnInit{

  tipo = new EstandarModel();
  nuevo = true;

  constructor(
    public dialogRef: MatDialogRef<TipoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private tipoServ: TipoGasService,
    private estadoPeticion: PeticionesService) {}

  ngOnInit(): void {
    if (this.data.descripcion !== null) {
      this.tipo.descripcion = this.data.descripcion;
      this.tipo.id = this.data.id;
      this.nuevo = false;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  registrar(): void {
    this.estadoPeticion.loading();

    this.tipoServ.registrar(this.tipo).subscribe(() => {
      Swal.close();
      this.estadoPeticion.success('Nuevo tipo de gas ingresado con éxito!', ['tipo'], 1000);
      this.dialogRef.close();
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

  editar(): void {
    this.estadoPeticion.loading();

    this.tipoServ.actualizar(this.tipo).subscribe(() => {
      Swal.close();
      this.estadoPeticion.success('Tipo de gas actualizado!', ['tipo'], 1000);
      this.dialogRef.close();
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

}
