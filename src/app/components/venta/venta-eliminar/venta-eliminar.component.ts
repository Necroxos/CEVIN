/************************************************************************************************************************************
 *                                              IMPORTACIONES Y DECORADOR COMPONENT                                                 *
 ************************************************************************************************************************************/
// Angular
import { Component, Inject, OnInit } from '@angular/core';
// Angular Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// Modelos
import { VentaModel } from '../../../models/venta.model';
// Componentes
import { VentaInfoComponent } from '../venta-info/venta-info.component';
// Módulos
import Swal from 'sweetalert2';
// Servicios
import { VentaService } from '../../../services/venta.service';
import { PeticionesService } from '../../../services/peticiones.service';

@Component({
  selector: 'app-venta-eliminar',
  templateUrl: './venta-eliminar.component.html'
})
export class VentaEliminarComponent implements OnInit {

  /**********************************************************************************************************************************
   *                                                    EJECUCIÓN AL INICIAR                                                        *
   **********************************************************************************************************************************/

  constructor(
    public dialogRef: MatDialogRef<VentaInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VentaModel,
    private servicio: VentaService,
    private estadoPeticion: PeticionesService) { }

  ngOnInit(): void { }

  /**********************************************************************************************************************************
   *                                                  FUNCIONES DEL COMPONENTE                                                      *
   **********************************************************************************************************************************/

  onNoClick(): void {
    this.dialogRef.close();
  }

  eliminar(): void {
    this.estadoPeticion.loading();
    this.data.activo = !this.data.activo;
    this.servicio.cambiarEstado(this.data).subscribe((res: any) => {
      Swal.close();
      this.estadoPeticion.success(res.message, ['venta', 'detalle'], 700);
      this.dialogRef.close();
    }, (err: any) => {
      this.data.activo = !this.data.activo;
      if (err.status === 304) { this.sinCambio(); }
      else { this.estadoPeticion.error(err); }
      this.dialogRef.close();
    });
  }

  sinCambio(): void {
    Swal.close();
    Swal.fire({
      icon: 'error',
      title: 'Sin cambios',
      text: 'No se pudo cambiar el estado'
    });
  }

}
