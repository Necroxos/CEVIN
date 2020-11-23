import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-activo-detalle',
  templateUrl: './activo-detalle.component.html',
  styleUrls: ['./activo-detalle.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ActivoDetalleComponent implements OnInit {

  constructor() { }

  videoDevices: MediaDeviceInfo[] = [];
  choosenDev;
  esconder = false;
  ancho = 640;
  alto = 480;

  @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent;

  ngOnInit() {

  }

  ngAfterViewInit(): void {

    this.qrScannerComponent.getMediaDevices().then(devices => {
      const videoDevices: MediaDeviceInfo[] = [];
      for (const device of devices) {
        if (device.kind.toString() === 'videoinput') {
          videoDevices.push(device);
          this.videoDevices.push(device);
        }
      }
      if (videoDevices.length > 0) {
        this.choosenDev;
        for (const dev of videoDevices) {
          if (dev.label.includes('front')) {
            this.choosenDev = dev;
            break;
          }
        }
        if (!this.choosenDev) this.choosenDev = videoDevices[0];
        this.qrScannerComponent.chooseCamera.next(this.choosenDev);
      }
    });

    this.qrScannerComponent.capturedQr.subscribe(codigoQR => {
      this.mostrarCodigo(codigoQR);
    });
  }

  mostrarCodigo(codigoQR) {
    this.esconder = true;
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });

    Swal.showLoading();

    setTimeout(() => { // Aquí debe ir la petición de la información del activo
      Swal.close();

      Swal.fire({
        title: codigoQR,
        showClass: { popup: 'animate__animated animate__fadeInDown' },
        hideClass: { popup: 'animate__animated animate__fadeOutUp' },
        willClose: () => {
          this.qrScannerComponent.chooseCamera.next(this.choosenDev);
          setTimeout(() => this.esconder = false, 200);
        }
      });
    }, 1000);
  }

  cambiarCam(device: string) {
    for (const dev of this.videoDevices) {
      if (dev.label.includes(device)) {
        this.choosenDev = dev;
        break;
      }
    }
    this.qrScannerComponent.chooseCamera.next(this.choosenDev);
  }

}
