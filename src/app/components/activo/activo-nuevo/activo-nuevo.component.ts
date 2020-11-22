import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-activo-nuevo',
  templateUrl: './activo-nuevo.component.html',
  styleUrls: ['./activo-nuevo.component.css']
})
export class ActivoNuevoComponent implements OnInit {

  QrValue: string = null;
  Width: number = 256;

  constructor() {
    this.QrValue = 'Código QR de ejemplo';
  }

  ngOnInit(): void {
  }

  changeQRVal(texto: string) {
    if (texto != '' ) this.QrValue = texto;
    else this.QrValue = 'Código QR de ejemplo';
  }

}
