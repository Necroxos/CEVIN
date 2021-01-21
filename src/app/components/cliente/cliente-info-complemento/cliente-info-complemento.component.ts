import { Component, Input, OnInit } from '@angular/core';
import { DireccionModel } from '../../../models/direccion.model';

@Component({
  selector: 'app-cliente-info-complemento',
  templateUrl: './cliente-info-complemento.component.html',
  styles: [
  ]
})
export class ClienteInfoComplementoComponent implements OnInit {

  @Input() direcciones: DireccionModel[];

  constructor() { }

  ngOnInit(): void {
  }

}
