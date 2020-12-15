// Módulo de Rutas
import { Routes } from '@angular/router';
// Componentes
import { UsuarioNuevoComponent } from './usuario-nuevo/usuario-nuevo.component';
import { UsuarioEditarComponent } from './usuario-editar/usuario-editar.component';
import { UsuarioDetalleComponent } from './usuario-detalle/usuario-detalle.component';
// Rutas
export const USUARIO_ROUTES: Routes = [
    { path: 'nuevo', component: UsuarioNuevoComponent },
    { path: 'editar', component: UsuarioEditarComponent },
    { path: 'detalle', component: UsuarioDetalleComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'detalle' }
];

