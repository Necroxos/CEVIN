// Módulo de Rutas
import { Routes } from '@angular/router';
// Componentes
import { ActivoNuevoComponent } from './activo-nuevo/activo-nuevo.component';
import { ActivoEditarComponent } from './activo-editar/activo-editar.component';
import { ActivoDetalleComponent } from './activo-detalle/activo-detalle.component';
import { ActivoQrComponent } from './activo-qr/activo-qr.component';
// Rutas
export const ACTIVO_ROUTES: Routes = [
    { path: 'nuevo', component: ActivoNuevoComponent },
    { path: 'editar', component: ActivoEditarComponent },
    { path: 'detalle', component: ActivoDetalleComponent },
    { path: 'escaner', component: ActivoQrComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'detalle' }
];

