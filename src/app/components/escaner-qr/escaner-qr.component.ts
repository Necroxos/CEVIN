// Angular
import { Component, Output, ViewChild, EventEmitter } from '@angular/core';
// Módulos
import { QrScannerComponent } from 'angular2-qrscanner';

@Component({
  selector: 'app-escaner-qr',
  templateUrl: './escaner-qr.component.html',
  styleUrls: ['./escaner-qr.component.css']
})
export class EscanerQrComponent {

  /**********************************************************************************************************************************
   *                                                       VARIABLES                                                                *
   **********************************************************************************************************************************/

  // Variables locales para guardar información
  videoDevices: MediaDeviceInfo[] = [];
  choosenDev: MediaDeviceInfo;
  // Variables del escaner en el HTML
  tiempoActualizacion = 500;
  esconder = false;
  detenerEscaner = true;
  ancho = 320;
  alto = 320;

  // Variables enviadas a componentes hijos
  @Output() mostrarCodigo: EventEmitter<string>;

  // Genera el elemento que leerá los códigos
  @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent;

  /**********************************************************************************************************************************
   *                                                    EJECUCIÓN AL INICIAR                                                        *
   **********************************************************************************************************************************/

  /**
   * Inicializa el Emitter para enviar la información al componente padre
   */
  constructor() { this.mostrarCodigo = new EventEmitter(); }

  /**
   * En el AfterInit inicializaremos los dispositivos de video que estén disponibles en el equipo
   * Luego se seleccionará el primero de ellos (en el Array que se genere) como cámara
   * Y se inicia el escaneo de códigos QR
   */
  ngAfterViewInit(): void {
    this.qrScannerComponent.getMediaDevices().then(devices => {
      const videoDevices: MediaDeviceInfo[] = [];

      for (const device of devices) {
        console.log(device);
        if (device.kind.toString() === 'videoinput' || device.kind.toString() === 'audioinput') {
          videoDevices.push(device);
          if (device.label !== '') {
            this.videoDevices.push(device);
          }
        }
      }

      this.prefCam();
      if (!this.choosenDev) { this.choosenDev = videoDevices[0]; }
      this.qrScannerComponent.chooseCamera.next(this.choosenDev);
    });

    this.lecturaQR();
  }

  prefCam(): void {
    if (this.videoDevices.length > 0) {
      for (const dev of this.videoDevices) {
        if (dev.label.includes('back')) {
          this.choosenDev = dev;
          break;
        }
      }
    }
  }

  /**********************************************************************************************************************************
   *                                                  FUNCIONES DEL COMPONENTE                                                      *
   **********************************************************************************************************************************/

  /**
   * Función que se encarga de escuchar al escaner y devolver el string leído
   */
  lecturaQR(): void {
    this.qrScannerComponent.capturedQr.subscribe((codigoQR: string) => {
      this.esconder = true;
      this.mostrarCodigo.emit(codigoQR);
    });
  }

  /**
   * Esta función se encarga de cambiar el dispositivo de video que se desea utilizar como cámara
   * @param device Recibe el dispositivo a usar como cámara
   */
  cambiarCam(device: string): void {
    for (const dev of this.videoDevices) {
      if (device === dev.groupId) {
        this.choosenDev = dev;
        break;
      }
    }
    this.qrScannerComponent.chooseCamera.next(this.choosenDev);
  }

}
