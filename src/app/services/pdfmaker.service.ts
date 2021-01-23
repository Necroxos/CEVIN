import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfmakerService {

  greeting = 'activo-cevin';

  constructor() { }

  header(text: string): any {
    return { text, alignment: 'center' };
  }

  imprimirPDF(codigo: string): void {
    this.greeting = codigo;
    const docDefinition = {
      pageSize: {
        width: 300,
        height: 300
      },
      content: [
        {
          columns: [
            { qr: this.greeting, fit: 40, alignment: 'left' },
            { qr: this.greeting, fit: 40, alignment: 'right' }
          ]
        },
        this.header(''),
        { qr: this.greeting, fit: 150, alignment: 'center' },
        {
          columns: [
            { qr: this.greeting, fit: 40, alignment: 'left' },
            { qr: this.greeting, fit: 40, alignment: 'right' }
          ]
        }
      ]
    };

    pdfMake.createPdf(docDefinition).open();
  }
}
