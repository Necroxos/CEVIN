import { Routes } from '@angular/router';

import { ActivoNuevoComponent } from "./activo-nuevo/activo-nuevo.component";
import { ActivoEditarComponent } from "./activo-editar/activo-editar.component";
import { ActivoDetalleComponent } from "./activo-detalle/activo-detalle.component";

export const ACTIVO_ROUTES: Routes = [
    { path: 'nuevo', component: ActivoNuevoComponent },
    { path: 'editar', component: ActivoEditarComponent },
    { path: 'detalle', component: ActivoDetalleComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'nuevo' }
];

