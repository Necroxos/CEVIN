// Angular
import { RouterModule, Routes } from '@angular/router';
// Componentes a cargar (Vistas)
import { RolComponent } from './components/rol/rol.component';
import { HomeComponent } from './components/home/home.component';
import { TipoComponent } from './components/tipo/tipo.component';
import { LoginComponent } from './components/login/login.component';
import { AboutComponent } from './components/about/about.component';
import { VentaComponent } from './components/venta/venta.component';
import { ActivoComponent } from './components/activo/activo.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { ClienteComponent } from './components/cliente/cliente.component';
// Rutas hijas
import { VENTA_ROUTES } from './components/venta/venta.routes';
import { ACTIVO_ROUTES } from './components/activo/activo.routes';
import { USUARIO_ROUTES } from './components/usuario/usuario.routes';
import { CLIENTE_ROUTES } from './components/cliente/cliente.routes';
// Validaciones para las vistas
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
// Rutas
const APP_ROUTES: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  {
    path: 'activo',
    component: ActivoComponent,
    canActivate: [AuthGuard],
    children: ACTIVO_ROUTES
  },
  {
    path: 'cliente',
    component: ClienteComponent,
    canActivate: [AuthGuard],
    children: CLIENTE_ROUTES
  },
  {
    path: 'venta',
    component: VentaComponent,
    canActivate: [AuthGuard],
    children: VENTA_ROUTES },
  {
    path: 'usuario',
    component: UsuarioComponent,
    canActivate: [AuthGuard],
    children: USUARIO_ROUTES
  },
  { path: 'rol', component: RolComponent, canActivate: [AuthGuard] },
  { path: 'tipo', component: TipoComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: '**', pathMatch: 'full', redirectTo: 'home' },
  { path: '', pathMatch: 'full', redirectTo: 'login' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true });
