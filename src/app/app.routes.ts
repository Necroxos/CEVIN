import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ActivoComponent } from './components/activo/activo.component';
import { LoginComponent } from './components/login/login.component';

import { ACTIVO_ROUTES } from './components/activo/activo.routes';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

const APP_ROUTES: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  {
    path: 'activo',
    component: ActivoComponent,
    canActivate: [AuthGuard],
    children: ACTIVO_ROUTES
  },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: '**', pathMatch: 'full', redirectTo: 'home' },
  { path: '', pathMatch: 'full', redirectTo: 'login' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true });