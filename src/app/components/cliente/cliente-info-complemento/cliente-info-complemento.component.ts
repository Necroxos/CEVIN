import { Component, Input, OnInit } from '@angular/core';
import { DireccionModel } from '../../../models/direccion.model';
import { ClienteModel } from '../../../models/cliente.model';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-cliente-info-complemento',
  templateUrl: './cliente-info-complemento.component.html',
  styles: [
  ]
})
export class ClienteInfoComplementoComponent implements OnInit {

  @Input() direcciones: DireccionModel[];
  @Input() cliente: ClienteModel;

  single: any[];
  view: any[] = [700, 400];

  // options
  gradient = true;
  showLegend = true;
  showLabels = true;
  isDoughnut = false;

  colorScheme = 'cool';

  constructor(private servicio: ClienteService) {
    Object.assign(this, { single: this.single });
  }

  /**
   * Pasa la información del Back End a una variable del componente
   * Información para el gráfico
   */
  ngOnInit(): void {
    this.servicio.obtenerCilindrosComprados(this.cliente).subscribe((res: any) => {
      this.single = [ ...res.response ];
    }, (err: any) => {
      console.log(err);
    });
  }

}
