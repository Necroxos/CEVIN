// Módulo de Rutas
import { Routes } from '@angular/router';
// Componentes
import { VentaNuevoComponent } from './venta-nuevo/venta-nuevo.component';
import { VentaDetalleComponent } from './venta-detalle/venta-detalle.component';
// Rutas
export const VENTA_ROUTES: Routes = [
    { path: 'nuevo', component: VentaNuevoComponent },
    { path: 'detalle', component: VentaDetalleComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'detalle' }
];

