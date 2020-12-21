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

  public prefijoCodigo = 'activo-cevin-';

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
    const titulo = this.tituloError(err);
    let mensaje = 'No se pudo conectar al servidor';
    if (err.status !== 0) {
      mensaje = this.mensajeError(err);
    }

    console.log(err);

    Swal.close();
    Swal.fire({
      icon: 'error',
      title: titulo,
      text: mensaje
    });
  }

  // Especificando el título
  private tituloError(err: any): string {
    switch (err.status) {
      case 0: return 'No hay respuesta del servidor';
      case 404: return 'No existe la ruta';
      case 500: return 'Error interno del servidor';
      default: return err.error.response;
    }
  }

  // Especificando el mensaje
  private mensajeError(err: any): string {
    const error = err.error.err;
    switch (error.code) {
      case 201: return 'Falta un parámetro para el procedimiento almacenado';
      case 241: return 'Error al convertir un dato en el procedimiento almacenado';
      case 515: return `Se entregó un valor nulo "${this.valorNulo(error)}" al procedimiento almacendo`;
      case 547: return `La FK entregada: "${this.valorFK(error)}" es errónea`;
      case 2627: return `El valor "${this.valorDuplicado(error)}" ya existe en la base de datos`;
      default: return error.message;
    }
  }

  // Obtenemos el valor duplicado
  private valorDuplicado(err: any): string {
    const arreglo = err['message'].split('(');
    let valor = arreglo[1].replace(').', '');
    valor = valor.replace(this.prefijoCodigo, '');
    return valor;
  }

  // Obtenemos el valor nulo
  private valorNulo(err: any): string {
    const arreglo = err['message'].split("'");
    const valor = arreglo[1];
    return valor;
  }

  /**
   * Obtenemos la FK errónea
   * Observación: el nombre viene del script de creación de la base de datos
   */
  private valorFK(err: any): string {
    const arreglo = err['message'].split('"');
    const valor = arreglo[1];
    return valor;
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
      if (ruta.length > 0){ this.recargar(ruta); }
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
