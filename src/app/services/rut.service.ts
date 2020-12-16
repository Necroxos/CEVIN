import { Injectable } from '@angular/core';
import { PeticionesService } from './peticiones.service';

@Injectable({
  providedIn: 'root'
})
export class RutService {

  constructor(private estadoPeticion: PeticionesService) { }

  async CheckRUT(rutInput: any): Promise<boolean> {
    let crut = '';
    let rut: any;
    let dv = '';
    let len: number;

    if (rutInput.length > 0) {
      rut = rutInput;
      len = rut.length;

      if (len < 2) { return false; }

      rut = this.quitarFormato(rutInput);
      crut = rut;
      len = crut.length;

      if (len > 2) { rut = crut.substring(0, len - 1); }
      else { rut = crut.charAt(0); }

      dv = crut.charAt(len - 1);

      if (rut == null || dv == null) { return false; }

      let dvr = '0';
      let add = 0;
      let mul = 2;

      for (let i = rut.length - 1; i >= 0; i--) {
        add = add + rut.charAt(i) * mul;
        if (mul === 7) { mul = 2; }
        else { mul++; }
      }

      const sub: number = add % 11;
      if (sub === 1) { dvr = 'k'; }
      else if (sub === 0) { dvr = '0'; }
      else {
        const dvi: number = 11 - sub;
        dvr = dvi + '';
      }

      if (dvr !== dv.toLowerCase()) {
        return false;
      }

      return true;
    }
  }

  quitarFormato(rut: string): string {
    while (rut.indexOf('.') !== -1) { rut = rut.replace('.', ''); }
    while (rut.indexOf('-') !== -1) { rut = rut.replace('-', ''); }
    while (rut.indexOf(',') !== -1) { rut = rut.replace(',', ''); }
    while (rut.indexOf(' ') !== -1) { rut = rut.replace(' ', ''); }
    return rut;
  }

  formatear(sRut: string, digitoVerificador: string): string {
    let sRutFormateado = '';
    let sDV = '';
    if (digitoVerificador) {
      sDV = sRut.charAt(sRut.length - 1);
      sRut = sRut.substring(0, sRut.length - 1);
    }
    while (sRut.length > 3) {
      sRutFormateado = '.' + sRut.substr(sRut.length - 3) + sRutFormateado;
      sRut = sRut.substring(0, sRut.length - 3);
    }
    sRutFormateado = sRut + sRutFormateado;
    if (sRutFormateado !== '' && digitoVerificador) { sRutFormateado += '-' + sDV; }
    else if (digitoVerificador) { sRutFormateado += sDV; }
    return sRutFormateado;
  }

  rutInvalido(): void {
    const error = { status: -1, error: {err: { message: 'El rut es inválido' }}};
    this.estadoPeticion.error(error);
  }

}
