// Módulo de Rutas
import { Routes } from '@angular/router';
// Componentes
import { LlenosComponent } from './llenos/llenos.component';
import { VaciosComponent } from './vacios/vacios.component';
import { ArrendadosComponent } from './arrendados/arrendados.component';

// Rutas
export const STOCK_ROUTES: Routes = [
    { path: 'llenos', component: LlenosComponent },
    { path: 'vacios', component: VaciosComponent },
    { path: 'arrendados', component: ArrendadosComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'llenos' }
];

