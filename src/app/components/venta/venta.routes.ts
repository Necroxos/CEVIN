// Módulo de Rutas
import { Routes } from '@angular/router';
// Componentes
import { VentaInfoComponent } from './venta-info/venta-info.component';
import { VentaNuevoComponent } from './venta-nuevo/venta-nuevo.component';
import { VentaEditarComponent } from './venta-editar/venta-editar.component';
import { VentaDetalleComponent } from './venta-detalle/venta-detalle.component';
// Rutas
export const VENTA_ROUTES: Routes = [
    { path: 'info', component: VentaInfoComponent },
    { path: 'nuevo', component: VentaNuevoComponent },
    { path: 'editar', component: VentaEditarComponent },
    { path: 'detalle', component: VentaDetalleComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'detalle' }
];

