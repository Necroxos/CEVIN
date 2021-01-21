// Angular
import { RouterModule, Routes } from '@angular/router';
// Componentes a cargar (Vistas)
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AboutComponent } from './components/about/about.component';
import { VentaComponent } from './components/venta/venta.component';
import { ActivoComponent } from './components/activo/activo.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { TipoComponent } from './components/datos-simples/tipo/tipo.component';
import { ZonaComponent } from './components/datos-simples/zona/zona.component';
import { ComunaComponent } from './components/datos-simples/comuna/comuna.component';
import { PropietarioComponent } from './components/datos-simples/propietario/propietario.component';
import { StockComponent } from './components/stock/stock.component';
// Rutas hijas
import { VENTA_ROUTES } from './components/venta/venta.routes';
import { ACTIVO_ROUTES } from './components/activo/activo.routes';
import { USUARIO_ROUTES } from './components/usuario/usuario.routes';
import { CLIENTE_ROUTES } from './components/cliente/cliente.routes';
import { STOCK_ROUTES } from './components/stock/stock.routes';
// Validaciones para las vistas
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { AdminGuard } from './guards/admin.guard';
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
    children: VENTA_ROUTES
  },
  {
    path: 'stock',
    component: StockComponent,
    canActivate: [AuthGuard],
    children: STOCK_ROUTES
  },
  {
    path: 'usuario',
    component: UsuarioComponent,
    canActivate: [AuthGuard],
    children: USUARIO_ROUTES
  },
  { path: 'tipo', component: TipoComponent, canActivate: [AdminGuard] },
  { path: 'zona', component: ZonaComponent, canActivate: [AdminGuard] },
  { path: 'comuna', component: ComunaComponent, canActivate: [AdminGuard] },
  { path: 'propietario', component: PropietarioComponent, canActivate: [AdminGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: '**', pathMatch: 'full', redirectTo: 'home' },
  { path: '', pathMatch: 'full', redirectTo: 'login' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true, relativeLinkResolution: 'legacy' });
