// Angular
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Peticiones
import { HttpClientModule } from '@angular/common/http';
// Módulos
import { QRCodeModule } from 'angularx-qrcode';
import { NgQrScannerModule } from 'angular2-qrscanner';
import { MaterialModule } from './modules/material.module';
// Rutas
import { APP_ROUTING } from './app.routes';
// Servicios
import { AuthService } from './services/auth.service';
import { PeticionesService } from './services/peticiones.service';
// Pipes
import { BooleanPipe } from './pipes/boolean.pipe';
import { NotNullPipe } from './pipes/not-null.pipe';
// Configuraciones
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
// Componentes
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { EscanerQrComponent } from './components/escaner-qr/escaner-qr.component';
// Activo
import { ActivoComponent } from './components/activo/activo.component';
import { ActivoQrComponent } from './components/activo/activo-qr/activo-qr.component';
import { ActivoNuevoComponent } from './components/activo/activo-nuevo/activo-nuevo.component';
import { ActivoEditarComponent } from './components/activo/activo-editar/activo-editar.component';
import { ActivoDetalleComponent } from './components/activo/activo-detalle/activo-detalle.component';
import { FormularioCilindroComponent } from './components/activo/formulario-cilindro/formulario-cilindro.component';
// Usuario
import { UsuarioComponent } from './components/usuario/usuario.component';
import { UsuarioNuevoComponent } from './components/usuario/usuario-nuevo/usuario-nuevo.component';
import { UsuarioEditarComponent } from './components/usuario/usuario-editar/usuario-editar.component';
import { UsuarioDetalleComponent } from './components/usuario/usuario-detalle/usuario-detalle.component';
import { FormularioUsuarioComponent } from './components/usuario/formulario-usuario/formulario-usuario.component';
// Cliente
import { ClienteComponent } from './components/cliente/cliente.component';
import { ClienteNuevoComponent } from './components/cliente/cliente-nuevo/cliente-nuevo.component';
import { ClienteEditarComponent } from './components/cliente/cliente-editar/cliente-editar.component';
import { ClienteDetalleComponent } from './components/cliente/cliente-detalle/cliente-detalle.component';
import { FormularioClienteComponent } from './components/cliente/formulario-cliente/formulario-cliente.component';
// Venta
import { VentaComponent } from './components/venta/venta.component';
import { VentaNuevoComponent } from './components/venta/venta-nuevo/venta-nuevo.component';
import { VentaDetalleComponent } from './components/venta/venta-detalle/venta-detalle.component';
import { FormularioVentaComponent } from './components/venta/formulario-venta/formulario-venta.component';
// Otros
import { RolComponent } from './components/rol/rol.component';
import { TipoComponent } from './components/tipo/tipo.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    EscanerQrComponent,
    // Activo
    ActivoComponent,
    ActivoNuevoComponent,
    ActivoEditarComponent,
    ActivoDetalleComponent,
    ActivoQrComponent,
    FormularioCilindroComponent,
    // Usuario
    UsuarioComponent,
    UsuarioDetalleComponent,
    UsuarioNuevoComponent,
    UsuarioEditarComponent,
    FormularioUsuarioComponent,
    // Cliente
    ClienteComponent,
    ClienteNuevoComponent,
    ClienteEditarComponent,
    ClienteDetalleComponent,
    FormularioClienteComponent,
    // Venta
    VentaComponent,
    VentaNuevoComponent,
    VentaDetalleComponent,
    FormularioVentaComponent,
    // Otros
    RolComponent,
    TipoComponent,
    // Pipes
    BooleanPipe,
    NotNullPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    QRCodeModule,
    NgQrScannerModule,
    MaterialModule,
    APP_ROUTING
  ],
  providers: [
    // Services
    AuthService,
    PeticionesService,
    // Moment config
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
