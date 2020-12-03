// Angular
import { Component, ViewChild } from '@angular/core';
// Angular Material
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
// Servicios
import { CilindroService } from '../../../services/cilindro.service';
// Modelos
import { CilindroModel } from 'src/app/models/cilindro.model';

@Component({
  selector: 'app-activo-detalle',
  templateUrl: './activo-detalle.component.html',
  styleUrls: ['./activo-detalle.component.css']
})
export class ActivoDetalleComponent {

  displayedColumns: string[] = ['cilindro_id', 'codigo_activo', 'fecha_mantencion', 'tipo_gas', 'propietario', 'opciones'];
  dataSource: MatTableDataSource<CilindroModel>;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private cilindroServ: CilindroService) { }

  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewInit(): void {
    this.cilindroServ.obtenerTodos().subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res.response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoadingResults = false;
      this.isRateLimitReached = false;
    }, (err: any) => {
      console.log(err);
      this.isLoadingResults = false;
      this.isRateLimitReached = true;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  imprimir(evento: CilindroModel): void {
    console.log(evento);
  }

}
