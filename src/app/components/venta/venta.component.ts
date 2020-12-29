// Angular
import { Component, OnInit } from '@angular/core';
// Módulos
import { MatTabChangeEvent } from '@angular/material/tabs';
// Enrutador
import { Router } from '@angular/router';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: []
})
export class VentaComponent implements OnInit {

  // Variables del componente
  listadoRutas = [
    { id: 0, ruta: ['venta', 'detalle'] },
    { id: 1, ruta: ['venta', 'nuevo'] }
  ];
  currTab: number;

  constructor(private router: Router) { }

  /**
   * Al iniciar el componente nos encargamos de seleccionar correctamente el Tab
   */
  ngOnInit(): void {
    this.listadoRutas.find((item) => {
      if (this.router.url.indexOf(item.ruta[1]) > -1) {
        this.currTab = item.id;
      }
    });
  }

  /**
   * Función que se encarga de enrutar según la viñeta que seleccionemos
   * @param event Recibe un objeto de materials con el index de la viñeta
   */
  cambioVineta(event: MatTabChangeEvent): void {
    const idx = this.listadoRutas.find((item) => item.id === event.index );
    this.router.navigate(idx.ruta);
  }

}
