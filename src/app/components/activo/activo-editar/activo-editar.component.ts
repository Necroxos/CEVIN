// Angular
import { Component } from '@angular/core';
// Servicios
import { CilindroService } from '../../../services/cilindro.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Módulos
import Swal from 'sweetalert2';
// Modelos
import { CilindroModel } from '../../../models/cilindro.model';

@Component({
  selector: 'app-activo-editar',
  templateUrl: './activo-editar.component.html',
  styleUrls: []
})
export class ActivoEditarComponent {

  // Variables locales
  QrValue: string;
  mostrar = false;
  accionBtn = 'Editar';
  cilindro = new CilindroModel();
  cilindroLocal = this.cilindroServ.leerCilindro();

  constructor(private estadoPeticion: PeticionesService, private cilindroServ: CilindroService) { }

  /**
   * Si se redirigió desde la lectura de QR (Donde se guarda el code en localStorage) ejecutamos esta función
   * Leemos el [codigo_activo] del locaStorage y buscamos el cilindro en la BD para poder editarlo
   */
  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterContentInit(): void {
    if (this.cilindroLocal) {
      this.QrValue = this.cilindroLocal;
      this.cilindro.codigo_activo = this.cilindroLocal;
      this.cargarInfo();
    } else {
      this.estadoPeticion.recargar(['activo', 'detalle']);
    }
  }

  /**
   * Función que carga la información en el cilindro
   * @param res Recibe la respuesta de la subscripción
   */
  cargarInfo(): void {
    this.estadoPeticion.loading();
    this.cilindroServ.obtenerUno(this.cilindro).subscribe((res: any) => {
      Swal.close();
      this.estadoPeticion.success(res.message, [], 650);
      this.cilindro = { ...res.response };
      this.QrValue = this.cilindro.codigo_activo;
      this.cilindro.codigo_activo = this.cilindro.codigo_activo.replace(this.estadoPeticion.prefijoCodigo, '');
      this.mostrar = true;
    }, (err: any) => {
      this.estadoPeticion.error(err);
    });
  }

  /**
   * Esta función recibe el cilindro enviado por el componente [formulario-cilindro]
   * Y hace uso de los servicio de [CilindroService] para enviar la información al Back End
   * Además de usar el servicio de [PeticionesService] para mostrar mensajes de [loading] y [error]
   * @param cilindro Escucha la información emitida por el componente hijo
   */
  actualizar(cilindro: CilindroModel): void {
    this.estadoPeticion.loading();

    this.cilindroServ.actualizar(cilindro).subscribe(() => {
      Swal.close();
      this.estadoPeticion.success('Activo actualizado con éxito!', ['activo', 'detalle'], 1000);
    }, (err: any) => {
      cilindro.codigo_activo = this.QrValue.replace(this.estadoPeticion.prefijoCodigo, '');
      this.estadoPeticion.error(err);
      this.estadoPeticion.recargar(['activo', 'editar']);
    });
  }

}
