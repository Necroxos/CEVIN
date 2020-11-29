// Angular
import { Component, OnInit } from '@angular/core';
// Servicios
import { CilindroService } from '../../../services/cilindro.service';
import { PeticionesService } from '../../../services/peticiones.service';
// Módulos
import Swal from 'sweetalert2';
import * as moment from 'moment';
// Modelos
import { CilindroModel } from '../../../models/cilindro.model';

@Component({
  selector: 'app-activo-editar',
  templateUrl: './activo-editar.component.html',
  styleUrls: []
})
export class ActivoEditarComponent implements OnInit {

  // Variables locales
  mostrar = false;
  cilindro: CilindroModel;
  QrValue = 'Código QR de ejemplo';
  accionBtn = 'Editar';

  constructor(private estadoPeticion: PeticionesService, private cilindroServ: CilindroService) { }

  ngOnInit(): void {
    this.cilindro = new CilindroModel();
  }

  /**
   * Al captar un código se dispara esta función que muestra un mensaje con el código escaneado
   * @param termino Recibe el string del nñumero de serie
   */
  buscar(termino: string): void {
    this.mostrar = false;
    this.estadoPeticion.loading();
    this.cilindro.codigo_activo = 'activo-cevin-' + termino;
    this.cilindroServ.obtenerUno(this.cilindro).subscribe( (res: any) => {
      Swal.close();
      this.estadoPeticion.success(res.message, [], 650);
      this.cilindro = {...res.response};
      this.mostrar = true;
    }, (err: any) => {
      this.estadoPeticion.error(err, `Error con código: ${termino}`);
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
      this.estadoPeticion.success('Activo actualizado con éxito!', ['activo', 'editar'], 1000);
    }, (err: any) => {
      cilindro.codigo_activo = this.QrValue.replace('activo-cevin-', '');
      this.estadoPeticion.error(err, 'Error al actualizar Cilindro');
      this.estadoPeticion.recargar(['activo', 'editar']);
    });
  }

  /**
   * Si se redirigió desde la lectura de QR (Donde se guarda el code en localStorage) ejecutamos esta función
   * Leemos el [codigo_activo] del locaStorage y buscamos el cilindro en la BD para poder editarlo
   */
  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterContentInit(): void {
    const cilindroLocal = this.cilindroServ.leerCilindro();
    if (cilindroLocal) {
      this.cilindro.codigo_activo = cilindroLocal;
      this.estadoPeticion.loading();
      this.cilindroServ.obtenerUno(this.cilindro).subscribe( (res: any) => {
        Swal.close();
        this.estadoPeticion.success(res.message, [], 650);
        this.cilindro = {...res.response};
        this.QrValue = this.cilindro.codigo_activo;
        this.cilindro.mantencion = moment(this.cilindro.fecha_mantencion, 'DD/MM/YYYY');
        this.mostrar = true;
      }, (err: any) => {
        this.estadoPeticion.error(err, `Error con código: ${cilindroLocal}`);
      });
    }
  }

}
