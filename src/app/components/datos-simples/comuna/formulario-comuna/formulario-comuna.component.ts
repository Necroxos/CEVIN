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
import { ComunaComponent } from '../comuna.component';
// Módulos
import Swal from 'sweetalert2';
// Servicios
import { ComunaService } from '../../../../services/comuna.service';
import { PeticionesService } from '../../../../services/peticiones.service';

export interface DialogData {
  descripcion: string;
  titulo: string;
  id: number;
}

@Component({
  selector: 'app-formulario-comuna',
  templateUrl: './formulario-comuna.component.html',
  styleUrls: []
})
export class FormularioComunaComponent implements OnInit {

  comuna = new EstandarModel();
  nuevo = true;

  constructor(
    public dialogRef: MatDialogRef<ComunaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private servicio: ComunaService,
    private estadoPeticion: PeticionesService) { }

  ngOnInit(): void {
    if (this.data.descripcion) {
      this.comuna.descripcion = this.data.descripcion;
      this.comuna.id = this.data.id;
      this.nuevo = false;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  registrar(): void {
    this.estadoPeticion.loading();

    this.servicio.registrar(this.comuna).subscribe(() => {
      Swal.close();
      this.estadoPeticion.success('Nueva comuna ingresada con éxito!', ['comuna'], 1000);
      this.dialogRef.close();
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

  editar(): void {
    this.estadoPeticion.loading();

    this.servicio.actualizar(this.comuna).subscribe(() => {
      Swal.close();
      this.estadoPeticion.success('Comuna actualizada!', ['comuna'], 1000);
      this.dialogRef.close();
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

}
