/************************************************************************************************************************************
 *                                              IMPORTACIONES Y DECORADOR COMPONENT                                                 *
 ************************************************************************************************************************************/
// Angular
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
// Servicios
import { TipoGasService } from '../../../services/tipo.service';
import { PeticionesService } from '../../../services/peticiones.service';
import { PropietarioService } from '../../../services/propietario.service';
// Módulos
import * as moment from 'moment';
// Modelos
import { EstandarModel } from '../../../models/estandar.model';
import { CilindroModel } from '../../../models/cilindro.model';

@Component({
  selector: 'app-formulario-cilindro',
  templateUrl: './formulario-cilindro.component.html',
  styles: [
  ]
})
export class FormularioCilindroComponent implements OnInit {

  /**********************************************************************************************************************************
   *                                                       VARIABLES                                                                *
   **********************************************************************************************************************************/

  Width = 200;
  QrValue = 'Código QR de ejemplo';
  esconder = true;
  seccionEdit = false;
  maxDate = new Date();
  gases: [EstandarModel];
  propietarios: [EstandarModel];
  cilindro = new CilindroModel();
  // Variables recibidas del componente padre
  @Input() accionBtn: string;
  @Input() CilindroEdit: CilindroModel;
  // Variables enviadas al componente padre
  @Output() registrarCilindro: EventEmitter<CilindroModel>;

  /**********************************************************************************************************************************
   *                                                    EJECUCIÓN AL INICIAR                                                        *
   **********************************************************************************************************************************/

  /**
   * Inicializa servicios
   * @param gasServ Servicio con peticiones HTTP al Back End
   * @param estadoPeticion Servicio con funciones de Carga y Error
   * @param propietarioServ Servicio con peticiones HTTP al Back End
   */
  constructor(private estadoPeticion: PeticionesService, private gasServ: TipoGasService,
              private propietarioServ: PropietarioService) {
    this.registrarCilindro = new EventEmitter();
  }

  /**
   * Al iniciar el componente pre cargamos la información necesaria
   * Para mostrarlo en los selectables del formulario
   */
  ngOnInit(): void {
    this.obtenerTipoGases();
    this.obtenerPropietarios();
  }

  /**
   * Función que se encarga de recibir un cilindro en caso de que se desee actualizar la información
   * Sólo se ejecuta si se le otorga el cilindro que viene del componente de [activo-editar]
   */
  ngAfterContentInit(): void {
    if (this.accionBtn === 'Editar') {
      this.cilindro = this.CilindroEdit;
      this.cilindro.mantencion = moment(this.CilindroEdit.fecha_mantencion, 'DD/MM/YYYY');
      this.seccionEdit = true;
    } else {
      this.cilindro = new CilindroModel();
    }
  }

  /**
   * Cargamos la información de los tipos de gases
   */
  obtenerTipoGases(): void {
    this.gasServ.obtenerTodos().subscribe((res: any) => {
      this.gases = res.response;
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

  /**
   * Cargamos la información de los posibles propietarios
   */
  obtenerPropietarios(): void {
    this.propietarioServ.obtenerTodos().subscribe((res: any) => {
      this.propietarios = res.response;
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

  /**********************************************************************************************************************************
   *                                                  FUNCIONES DEL COMPONENTE                                                      *
   **********************************************************************************************************************************/

  /**
   * Función que transforma un string a un código QR
   * @param texto Recibe el string del input correspondiente al número de serie del cilindro
   */
  changeQRVal(texto: string): void {
    if (texto !== '') { this.QrValue = this.estadoPeticion.prefijoCodigo + texto; }
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
    this.transformarDatos();
    this.registrarCilindro.emit(this.cilindro);
  }

  /**
   * Función que se encarga de transforma la Fecha en un String con formato 'dd/mm/yyyy'
   * Guarda el código concatenado con 'activo-cevin-'
   */
  transformarDatos(): void {
    if (this.cilindro.mantencion && this.cilindro.mantencion.isValid()) {
      this.cilindro.fecha_mantencion = moment(this.cilindro.mantencion).format('DD/MM/YYYY').toString();
    } else {
      this.cilindro.fecha_mantencion = null;
    }
    this.cilindro.codigo_activo = this.QrValue;
  }

  /**
   * Función que se encarga de limpiar la fecha de mantención
   */
  limpiarFecha(): void {
    this.cilindro.fecha_mantencion = null;
    this.cilindro.mantencion = null;
  }

}
