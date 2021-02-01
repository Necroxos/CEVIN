import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-venta-escaner',
  templateUrl: './venta-escaner.component.html'
})
export class VentaEscanerComponent implements OnInit {

  onScann: EventEmitter<string>;

  constructor(public dialogRef: MatDialogRef<any>) {
    this.onScann = new EventEmitter();
  }

  ngOnInit(): void {}

  /**
   * Envía el código al componente padre
   * @param codigo Código QR escaneado
   */
  mostrarCodigo(codigo: string): void {
    this.onScann.emit(codigo);
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
