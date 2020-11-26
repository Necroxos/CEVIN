// Angular
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
// Servicios
import { CilindroService } from '../../../services/cilindro.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Formulario
import { NgForm } from '@angular/forms';
// Módulos
import * as moment from 'moment';
import Swal from 'sweetalert2';
// Modelos
import { CilindroModel } from 'src/app/models/cilindro.model';

@Component({
  selector: 'app-activo-nuevo',
  templateUrl: './activo-nuevo.component.html'
})

export class ActivoNuevoComponent {

  constructor(private cilindroServ: CilindroService, private estadoPeticion: PeticionesService) {
    this.Width = window.innerWidth;
  }

  // Variables para guardar información de forma local
  QrValue = 'Código QR de ejemplo';
  Width = screen.availWidth / 4;
  maxDate = new Date();
  esconder = true;
  cilindro: CilindroModel = new CilindroModel();

  /**
   * Esta función cambia la escala de la imagen del QR
   * Escuchando el width del dispositivo
   */
  @ViewChild('reescalado') parentDiv: ElementRef;
  @HostListener('window:resize') onResize(): void {
    // guard against resize before view is rendered
    if (this.parentDiv) {
      const tmpWidth = this.parentDiv.nativeElement.clientWidth;
      if (tmpWidth < 200) { this.Width = 200; }
      else if (tmpWidth > 1000) { this.Width = 720; }
      else { this.Width = tmpWidth - 150; }
    }
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
   * Y la envía (por medio del servicio de CilindroService) al Back End
   * Además, hace uso de los servicios de Estado de Petición para mostrar mensajes de Loading y Error (si es necesario)
   * @param form Escucha al formulario de Angular
   */
  registrar(form: NgForm): void {
    if (form.invalid) { return; }
    else if (!this.cilindro.mantencion) {
      this.esconder = false;
      return;
    }

    this.estadoPeticion.loading();
    this.transformarData();

    this.cilindroServ.registrar(this.cilindro).subscribe(() => {
      Swal.close();
      this.estadoPeticion.success('Nuevo activo ingresado con éxito!', ['activo', 'nuevo'], 1500);
    }, (err: any) => {
      this.cilindro.codigo_activo = this.QrValue.replace('activo-cevin-', '');
      this.estadoPeticion.error(err, 'Error al ingresar Cilindro');
    });
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

}
