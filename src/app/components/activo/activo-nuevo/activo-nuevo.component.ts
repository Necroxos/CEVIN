import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { CilindroModel } from 'src/app/models/cilindro.model';
import { CilindroService } from '../../../services/cilindro.service';

import * as moment from 'moment';
import { PeticionesService } from '../../../services/peticiones.service';

@Component({
  selector: 'app-activo-nuevo',
  templateUrl: './activo-nuevo.component.html',
  styleUrls: []
})

export class ActivoNuevoComponent implements OnInit {

  QrValue = 'Código QR de ejemplo';
  Width = 256;
  maxDate = new Date();
  esconder = true;
  cilindro: CilindroModel = new CilindroModel();

  constructor(private _service: CilindroService,
    private estadoPeticion: PeticionesService,
    private router: Router) { }

  ngOnInit(): void { }

  changeQRVal(texto: string) {
    if (texto != '') this.QrValue = 'activo-cevin-' + texto;
    else this.QrValue = 'Código QR de ejemplo';
  }

  registrar(form: NgForm) {
    if (form.invalid) return;
    else if (!this.cilindro.mantencion) {
      this.esconder = false;
      return;
    }

    this.estadoPeticion.loading();

    moment.locale('es');
    this.cilindro.fecha_mantencion = this.cilindro.mantencion.format('l');
    this.cilindro.codigo_activo = this.QrValue;
    delete this.cilindro.mantencion;

    this._service.registrar(this.cilindro).subscribe(resp => {
      Swal.close();
      this.success();
    }, (err) => {
      this.cilindro.codigo_activo = this.QrValue.replace('activo-cevin-', '')
      this.estadoPeticion.error(err, 'Error al ingresar Cilindro');
    });
  }

  success() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'success',
      text: 'Nuevo activo ingresado con éxito!',
      showConfirmButton: false
    });
    setTimeout(() => {
      Swal.close();
      this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
        this.router.navigate(['activo', 'nuevo']);
      });
    }, 1500);
  }
}