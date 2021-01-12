/************************************************************************************************************************************
 *                                              IMPORTACIONES Y DECORADOR COMPONENT                                                 *
 ************************************************************************************************************************************/
// Angular
import { Component, Inject, OnInit } from '@angular/core';
// Angular Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// Modelos
import { ZonaModel } from '../../../../models/zona.model';
import { EstandarModel } from '../../../../models/estandar.model';
// Componentes
import { ZonaComponent } from '../zona.component';
// Módulos
import Swal from 'sweetalert2';
import { FormControl, Validators, NgForm } from '@angular/forms';
// Servicios
import { ZonaService } from '../../../../services/zona.service';
import { ComunaService } from '../../../../services/comuna.service';
import { PeticionesService } from '../../../../services/peticiones.service';

export interface DialogData {
  descripcion: string;
  comuna_id: number;
  titulo: string;
  id: number;
}

@Component({
  selector: 'app-formulario-zona',
  templateUrl: './formulario-zona.component.html',
  styles: [
  ]
})
export class FormularioZonaComponent implements OnInit {

  /**********************************************************************************************************************************
   *                                                       VARIABLES                                                                *
   **********************************************************************************************************************************/
  zona = new ZonaModel();
  comunas: EstandarModel[];
  nuevo = true;

  animalControl = new FormControl('', Validators.required);
  selectFormControl = new FormControl('', Validators.required);

  /**********************************************************************************************************************************
   *                                                    EJECUCIÓN AL INICIAR                                                        *
   **********************************************************************************************************************************/
  constructor(
    public dialogRef: MatDialogRef<ZonaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private servicio: ZonaService,
    private estadoPeticion: PeticionesService,
    private comunaServ: ComunaService) {
      this.comunas = new Array<EstandarModel>();
    }

  ngOnInit(): void {
    this.obtenerComunas();

    if (this.data.descripcion) {
      this.zona.descripcion = this.data.descripcion;
      this.zona.comuna_id = this.data.comuna_id;
      this.zona.id = this.data.id;
      this.nuevo = false;
    }
  }

  /**
   * Función que busca todas las comunas disponibles en la base de datos
   */
  obtenerComunas(): void {
    this.comunaServ.obtenerActivos().subscribe((res: any) => {
      this.comunas = res.response;
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

  /**********************************************************************************************************************************
   *                                                  FUNCIONES DEL COMPONENTE                                                      *
   **********************************************************************************************************************************/

  /**
   * Angular From tiene la facultad de actualizar la información automáticamente
   * En este caso, la función se encarga de enviar la información que se guarda en el modelo de Zona
   * @param form Escucha al formulario de Angular
   */
  registrar(form: NgForm): void {
    if (form.invalid) { return; }

    this.estadoPeticion.loading();

    this.servicio.registrar(this.zona).subscribe(() => {
      Swal.close();
      this.estadoPeticion.success('Nueva zona ingresada con éxito!', ['zona'], 1000);
      this.dialogRef.close();
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

  editar(): void {
    this.estadoPeticion.loading();

    this.servicio.actualizar(this.zona).subscribe(() => {
      Swal.close();
      this.estadoPeticion.success('Comuna actualizada!', ['zona'], 1000);
      this.dialogRef.close();
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
