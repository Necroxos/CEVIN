// Angualr
import { Component, ViewChild, OnInit } from '@angular/core';
// Servicios
import { PeticionesService } from '../../../services/peticiones.service';
import { CilindroService } from '../../../services/cilindro.service';
// Módulos
import { QrScannerComponent } from 'angular2-qrscanner';
import Swal from 'sweetalert2';
// Modelos
import { CilindroModel } from '../../../models/cilindro.model';

@Component({
  selector: 'app-activo-qr',
  templateUrl: './activo-qr.component.html',
  styleUrls: ['./activo-qr.component.css']
})
export class ActivoQrComponent implements OnInit {

  // Variables locales para guardar información
  videoDevices: MediaDeviceInfo[] = [];
  choosenDev: MediaDeviceInfo;
  cilindro: CilindroModel;
  esconder = false;
  mostrar = false;
  ancho = 640;
  alto = 480;

  // Genera el elemento que leerá los códigos
  @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent;

  constructor(private estadoPeticion: PeticionesService, private cilindroServ: CilindroService) { }

  // Al cargar el componente inicializamos un Cilindro
  ngOnInit(): void {
    this.cilindro = new CilindroModel();
  }

  /**
   * En el AfterInit inicializaremos los dispositivos de video que estén disponibles en el equipo
   * Luego se seleccionará el primero de ellos (en el Array que se genere) como cámara
   * Y se inicia el escaneo de códigos QR
   */
  // tslint:disable-next-line: use-lifecycle-interface
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
        for (const dev of videoDevices) {
          if (dev.label.includes('front')) {
            this.choosenDev = dev;
            break;
          }
        }
        if (!this.choosenDev) { this.choosenDev = videoDevices[0]; }
        this.qrScannerComponent.chooseCamera.next(this.choosenDev);
      }
    });

    this.qrScannerComponent.capturedQr.subscribe( (codigoQR: string) => {
      this.mostrarCodigo(codigoQR);
    });
  }

  /**
   * Al captar un código se dispara esta función que muestra un mensaje con el código escaneado
   * @param codigoQR Recibe el string del código QR
   */
  mostrarCodigo(codigoQR: string): void {
    this.esconder = true;
    this.estadoPeticion.loading();

    this.cilindro.codigo_activo = codigoQR;
    this.cilindroServ.obtenerUno(this.cilindro).subscribe( (res: any) => {
      Swal.close();
      this.estadoPeticion.success(res.message, [], 1500);
      this.cilindro = {...res.response};
      this.mostrar = true;
    }, (err: any) => {
      this.estadoPeticion.error(err, `Error con código: ${codigoQR}`);
      this.recargar();
    });
  }

  /**
   * Esta función se encarga de cambiar el dispositivo de video que se desea utilizar como cámara
   * @param device Recibe el dispositivo a usar como cámara
   */
  cambiarCam(device: string): void {
    for (const dev of this.videoDevices) {
      if (dev.label.includes(device)) {
        this.choosenDev = dev;
        break;
      }
    }
    this.qrScannerComponent.chooseCamera.next(this.choosenDev);
  }

  // Utilizamos esta función para refrescar el componente y que no hayan errores con el Scanner-QR
  recargar(): void {
    this.estadoPeticion.recargar(['activo', 'escaner']);
  }

  /**
   * Al presionar editar, guardamos el código único del cilindro en local storage
   * Y redirigimos al componente de edición
   */
  guardar(): void {
    this.cilindroServ.guardarCilindro(this.cilindro);
    this.estadoPeticion.recargar(['activo', 'editar']);
  }

}
