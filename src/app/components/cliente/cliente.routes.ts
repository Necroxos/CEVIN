// Módulo de Rutas
import { Routes } from '@angular/router';
// Componentes
import { ClienteInfoComponent } from './cliente-info/cliente-info.component';
import { ClienteNuevoComponent } from './cliente-nuevo/cliente-nuevo.component';
import { ClienteEditarComponent } from './cliente-editar/cliente-editar.component';
import { ClienteDetalleComponent } from './cliente-detalle/cliente-detalle.component';
// Rutas
export const CLIENTE_ROUTES: Routes = [
    { path: 'info', component: ClienteInfoComponent },
    { path: 'nuevo', component: ClienteNuevoComponent },
    { path: 'editar', component: ClienteEditarComponent },
    { path: 'detalle', component: ClienteDetalleComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'detalle' }
];

