// Módulo de Rutas
import { Routes } from '@angular/router';
// Componentes

// Rutas
export const STOCK_ROUTES: Routes = [
    // { path: 'nuevo', component: UsuarioNuevoComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'completos' }
];

