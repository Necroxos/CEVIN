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

  listadoRutas = [
    { id: 0, ruta: ['usuario', 'detalle'] },
    { id: 1, ruta: ['usuario', 'nuevo'] }
  ];

  constructor(private route: Router) { }

  ngOnInit(): void {
  }

  cambioVineta(event: MatTabChangeEvent): void {
    const idx = this.listadoRutas.find((item) => item.id === event.index );
    this.route.navigate(idx.ruta);
  }

}
