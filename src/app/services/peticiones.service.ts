// Angular
import { Injectable } from '@angular/core';
// Enrutador
import { Router } from '@angular/router';
// Módulos
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PeticionesService {

  constructor(private router: Router) { }

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
   */
  error(err: any): void {
    let titulo: string;
    switch (err.status) {
      case 0: titulo = 'No hay respuesta del servidor';
              break;
      case 404: titulo = 'No existe la ruta';
                break;
      case 500: titulo = 'Error interno del servidor';
                break;
      default: titulo = err.error.response;
    }

    console.log(err.error.err);

    Swal.close();
    Swal.fire({
      icon: 'error',
      title: titulo,
      text: err.error.err.message
    });
  }

  /**
   * Función que se encarga de mostrar un mensaje de éxito
   * @param texto Recibe el mensaje que se desea mostrar
   * @param ruta Recibe un Array de Strings con las rutas
   * @param ms Recibe el tiempo que estará activo el mensaje (en milisegundos)
   */
  success(texto: string, ruta: string[], ms: number): void {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'success',
      text: texto,
      showConfirmButton: false
    });
    setTimeout(() => {
      Swal.close();
      if (ruta.length > 0){
        this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
          this.router.navigate(ruta);
        });
      }
    }, ms);
  }

  /**
   * Función que permite recargar el componente
   * @param ruta Recibe un Array de Strings con las rutas
   */
  recargar(ruta: string[]): void {
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(ruta);
    });
  }
}
