// Angular
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
// Servicios
import { CilindroService } from '../../../services/cilindro.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Módulos
import Swal from 'sweetalert2';
import * as moment from 'moment';
// Modelos
import { CilindroModel } from '../../../models/cilindro.model';

@Component({
  selector: 'app-formulario-cilindro',
  templateUrl: './formulario-cilindro.component.html',
  styles: [
  ]
})
export class FormularioCilindroComponent implements OnInit {

  // Variables para guardar información de forma local
  Width = 200;
  esconder = true;
  maxDate = new Date();
  prefijoCodigo = 'activo-cevin-';
  @Input() QrValue: string;
  @Input() accionBtn: string;
  @Input() deleteBtn: boolean;
  @Input() CilindroEdit: CilindroModel;
  cilindro: CilindroModel = new CilindroModel();
  @Output() registrarCilindro: EventEmitter<CilindroModel>;

  constructor(private cilindroServ: CilindroService, private estadoPeticion: PeticionesService) {
    this.registrarCilindro = new EventEmitter();
  }

  ngOnInit(): void { }

  /**
   * Función que transforma un string a un código QR
   * @param texto Recibe el string del input correspondiente al número de serie del cilindro
   */
  changeQRVal(texto: string): void {
    if (texto !== '') { this.QrValue = this.prefijoCodigo + texto; }
    else { this.QrValue = 'Código QR de ejemplo'; }
  }

  /**
   * Angular From tiene la facultad de actualizar la información automáticamente
   * En este caso, la función se encarga de enviar la información que se guarda en el modelo de Cilindro
   * @param form Escucha al formulario de Angular
   */
  registrar(form: NgForm): void {
    if (form.invalid) { return; }

    this.changeQRVal(this.cilindro.codigo_activo);
    this.transformarData();
    this.registrarCilindro.emit(this.cilindro);
  }

  /**
   * Función que se encarga de transforma la Fecha en un String con formato 'dd/mm/yyyy'
   * Guarda el código concatenado con 'activo-cevin-'
   * Y borra información innecesaria
   */
  transformarData(): void {
    if (this.cilindro.mantencion) {
      this.cilindro.fecha_mantencion = moment(this.cilindro.mantencion).format('DD/MM/YYYY').toString();
    }
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
      this.cilindro = this.CilindroEdit;
      this.cilindro.mantencion = moment(this.CilindroEdit.fecha_mantencion, 'DD/MM/YYYY');
    } else {
      this.cilindro = new CilindroModel();
    }
  }

  /**
   * Función que cambia el estado de un cilindro a desactivado en la base de datos
   */
  eliminar(): void {
    this.estadoPeticion.loading();
    this.cilindro.activo = false;
    this.cilindroServ.cambiarEstado(this.cilindro).subscribe((res: any) => {
      Swal.close();
      this.estadoPeticion.success(res.message, ['activo', 'editar'], 700);
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

}
