// Angular
import { Injectable } from '@angular/core';
// Módulos
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PeticionesService {

  constructor() { }

  /**
   * Muestra mensaje de carga
   * No se puede quitar si no se usa un Swal.close()
   */
  loading(): void {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });

    Swal.showLoading();
  }

  /**
   * Muestra un mensaje de error
   * @param err Recibe el error de las peticiones
   * @param titulo Recibe un titulo para el mensaje
   */
  error(err: any, titulo: string): void {
    let mensaje: string;
    switch (err.satatus) {
      case 0: mensaje = 'No hay respuesta del servidor';
              break;
      case 404: mensaje = 'No existe la ruta';
                break;
      case 500: mensaje = 'Error interno del servidor';
                break;
      default: mensaje = err.error.err.message;
    }

    Swal.close();
    Swal.fire({
      icon: 'error',
      title: titulo,
      text: mensaje
    });
  }
}
