// Angular
import { Component, OnInit } from '@angular/core';
// Módulos
import { MatTabChangeEvent } from '@angular/material/tabs';
// Enrutador
import { Router } from '@angular/router';

@Component({
  selector: 'app-activo',
  templateUrl: './activo.component.html'
})
export class ActivoComponent implements OnInit {

  listadoRutas = [
    { id: 0, ruta: ['activo', 'detalle'] },
    { id: 1, ruta: ['activo', 'nuevo'] },
    { id: 2, ruta: ['activo', 'escaner'] },
  ];

  constructor(private route: Router) { }

  ngOnInit(): void {}

  /**
   * Función que se encarga de enrutar según la viñeta que seleccionemos
   * @param event Recibe un objeto de materials con el index de la viñeta
   */
  cambioVineta(event: MatTabChangeEvent): void {
    const idx = this.listadoRutas.find((item) => item.id === event.index );
    this.route.navigate(idx.ruta);
  }

}
