// Angular
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
// Módulos
import * as moment from 'moment';
// Modelos
import { CilindroModel } from '../../../models/cilindro.model';

@Component({
  selector: 'app-formulario-cilindro',
  templateUrl: './formulario-cilindro.component.html',
  styles: [
  ]
})
export class FormularioCilindroComponent {

  // Variables para guardar información de forma local
  Width = 200;
  esconder = true;
  maxDate = new Date();
  @Input() QrValue: string;
  @Input() accionBtn: string;
  @Input() CilindroEdit: CilindroModel;
  cilindro: CilindroModel = new CilindroModel();
  @Output() registrarCilindro: EventEmitter<CilindroModel>;

  constructor() {
    this.registrarCilindro = new EventEmitter();
  }

  /**
   * Función que transforma un string a un código QR
   * @param texto Recibe el string del input correspondiente al número de serie del cilindro
   */
  changeQRVal(texto: string): void {
    if (texto !== '') { this.QrValue = 'activo-cevin-' + texto; }
    else { this.QrValue = 'Código QR de ejemplo'; }
  }

  /**
   * Angular From tiene la facultad de actualizar la información automáticamente
   * En este caso, la función se encarga de enviar la información que se guarda en el modelo de Cilindro
   * @param form Escucha al formulario de Angular
   */
  registrar(form: NgForm): void {
    if (form.invalid) { return; }
    else if (!this.cilindro.mantencion) {
      this.esconder = false;
      return;
    }

    this.transformarData();
    this.registrarCilindro.emit(this.cilindro);
  }

  /**
   * Función que se encarga de transforma la Fecha en un String con formato 'dd/mm/yyyy'
   * Guarda el código concatenado con 'activo-cevin-'
   * Y borra información innecesaria
   */
  transformarData(): void {
    moment.locale('es');
    this.cilindro.fecha_mantencion = this.cilindro.mantencion.format('l');
    this.cilindro.codigo_activo = this.QrValue;
    delete this.cilindro.mantencion;
  }

  /**
   * Función que se encarga de recibir un cilindro en caso de que se desee actualizar la información
   * Sólo se ejecuta si se le otorga el cilindro que viene del componente de [activo-editar]
   */
  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterContentInit(): void {
    if (this.CilindroEdit) {
      this.QrValue = this.CilindroEdit.codigo_activo;
      this.cilindro = this.CilindroEdit;
      this.cilindro.mantencion = moment(this.CilindroEdit.fecha_mantencion, 'DD/MM/YYYY');
    }
  }

}
