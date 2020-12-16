// Angular
import { Component, OnInit } from '@angular/core';
// Módulos
import { MatTabChangeEvent } from '@angular/material/tabs';
// Enrutador
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  // Variables del componente
  listadoRutas = [
    { id: 0, ruta: ['usuario', 'detalle'] },
    { id: 1, ruta: ['usuario', 'nuevo'] }
  ];
  currTab: number;

  constructor(private router: Router) { }

  /**
   * Al iniciar el componente nos encargamos de seleccionar correctamente el Tab
   */
  ngOnInit(): void {
    if (this.router.url.indexOf('/detalle') > -1) { this.currTab = 0; }
    else if (this.router.url.indexOf('/nuevo') > -1) { this.currTab = 1; }
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
