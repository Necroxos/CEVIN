/************************************************************************************************************************************
 *                                              IMPORTACIONES Y DECORADOR COMPONENT                                                 *
 ************************************************************************************************************************************/
// Angular
import { Component, Inject, OnInit } from '@angular/core';
// Angular Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// Modelos
import { CostoModel } from '../../../../models/costo.model';
import { EstandarModel } from '../../../../models/estandar.model';
// Componentes
import { TipoComponent } from '../tipo.component';
// Módulos
import Swal from 'sweetalert2';
// Servicios
import { CostoService } from '../../../../services/costo.service';
import { TipoGasService } from '../../../../services/tipo.service';
import { PeticionesService } from '../../../../services/peticiones.service';

export interface DialogData {
  descripcion: string;
  titulo: string;
  costo: number;
  id: number;
}

@Component({
  selector: 'app-formulario-tipo',
  templateUrl: './formulario-tipo.component.html',
  styleUrls: []
})
export class FormularioTipoComponent implements OnInit {

  tipo = new EstandarModel();
  costo = new CostoModel();
  nuevo = true;

  constructor(
    private costoServ: CostoService,
    private servicio: TipoGasService,
    public dialogRef: MatDialogRef<TipoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private estadoPeticion: PeticionesService) { }

  ngOnInit(): void {
    if (this.data.descripcion) {
      this.tipo.descripcion = this.data.descripcion;
      this.tipo.id = this.data.id;
      this.nuevo = false;
      this.costo.costo = this.data.costo;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  registrar(): void {
    this.estadoPeticion.loading();

    this.servicio.registrar(this.tipo).subscribe((res: any) => {
      this.costo.tipo_id = res.response.id;
      this.costoServ.registrar(this.costo).subscribe(
        () => console.log('costo agregado'),
        (err: any) => this.estadoPeticion.error(err)
      );
      Swal.close();
      this.estadoPeticion.success('Nuevo tipo de gas ingresado con éxito!', ['tipo'], 1000);
      this.dialogRef.close();
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

  editar(): void {
    this.estadoPeticion.loading();

    this.servicio.actualizar(this.tipo).subscribe(() => {
      this.costo.tipo_id = this.tipo.id;
      this.costoServ.actualizar(this.costo).subscribe(
        () => console.log('costo actualizado'),
        (err: any) => this.estadoPeticion.error(err)
      );
      Swal.close();
      this.estadoPeticion.success('Tipo de gas actualizado!', ['tipo'], 1000);
      this.dialogRef.close();
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

}
