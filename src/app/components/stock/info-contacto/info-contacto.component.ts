/************************************************************************************************************************************
 *                                              IMPORTACIONES Y DECORADOR COMPONENT                                                 *
 ************************************************************************************************************************************/
// Angular
import { Component, Inject, OnInit } from '@angular/core';
// Angular Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// Componente padre
import { ArrendadosComponent } from '../arrendados/arrendados.component';
// Enrutador
import { Router } from '@angular/router';

export interface DialogData {
  fecha_entrega: string;
  telefono: string;
  codigo: string;
  email: string;
  rut: string;
}

@Component({
  selector: 'app-info-contacto',
  templateUrl: './info-contacto.component.html'
})
export class InfoContactoComponent implements OnInit {

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<ArrendadosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
  }

  /**
   * Redirecciona a la vista de la información detallada de un cliente
   */
  verCliente(): void {
    localStorage.setItem('cliente', this.data.rut);
    this.dialogRef.close();
    this.router.navigate(['cliente', 'info']);
  }

  /**
   * Redirecciona a la vista de la información detallada de una venta
   */
  verVenta(): void {
    localStorage.setItem('venta', this.data.codigo);
    this.dialogRef.close();
    this.router.navigate(['venta', 'info']);
  }

}
