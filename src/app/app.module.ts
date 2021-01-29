// Angular
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Peticiones
import { HttpClientModule } from '@angular/common/http';
// Módulos
import { ToastrModule } from 'ngx-toastr';
import { QRCodeModule } from 'angularx-qrcode';
import { NgQrScannerModule } from 'angular2-qrscanner';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MaterialModule } from './modules/material.module';
import { MapboxComponent } from './components/shared/mapbox/mapbox.component';
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
import { PerfilComponent } from './components/shared/perfil/perfil.component';
import { PasswordComponent } from './components/shared/perfil/password/password.component';
import { UsuarioNuevoComponent } from './components/usuario/usuario-nuevo/usuario-nuevo.component';
import { UsuarioEditarComponent } from './components/usuario/usuario-editar/usuario-editar.component';
import { UsuarioDetalleComponent } from './components/usuario/usuario-detalle/usuario-detalle.component';
import { FormularioUsuarioComponent } from './components/usuario/formulario-usuario/formulario-usuario.component';
// Cliente
import { ClienteComponent } from './components/cliente/cliente.component';
import { ClienteInfoComponent } from './components/cliente/cliente-info/cliente-info.component';
import { ClienteNuevoComponent } from './components/cliente/cliente-nuevo/cliente-nuevo.component';
import { ClienteEditarComponent } from './components/cliente/cliente-editar/cliente-editar.component';
import { ClienteDetalleComponent } from './components/cliente/cliente-detalle/cliente-detalle.component';
import { FormularioClienteComponent } from './components/cliente/formulario-cliente/formulario-cliente.component';
import { ClienteInfoComplementoComponent } from './components/cliente/cliente-info-complemento/cliente-info-complemento.component';
// Venta
import { VentaComponent } from './components/venta/venta.component';
import { VentaInfoComponent } from './components/venta/venta-info/venta-info.component';
import { VentaNuevoComponent } from './components/venta/venta-nuevo/venta-nuevo.component';
import { VentaEditarComponent } from './components/venta/venta-editar/venta-editar.component';
import { VentaDetalleComponent } from './components/venta/venta-detalle/venta-detalle.component';
import { FechaRetornoComponent } from './components/venta/fecha-retorno/fecha-retorno.component';
import { VentaEliminarComponent } from './components/venta/venta-eliminar/venta-eliminar.component';
import { FormularioVentaComponent } from './components/venta/formulario-venta/formulario-venta.component';
// Datos Simples
import { TipoComponent } from './components/datos-simples/tipo/tipo.component';
import { FormularioTipoComponent } from './components/datos-simples/tipo/formulario-tipo/formulario-tipo.component';
import { PropietarioComponent } from './components/datos-simples/propietario/propietario.component';
import { FormularioPropietarioComponent } from './components/datos-simples/propietario/formulario-propietario/formulario-propietario.component';
import { ComunaComponent } from './components/datos-simples/comuna/comuna.component';
import { FormularioComunaComponent } from './components/datos-simples/comuna/formulario-comuna/formulario-comuna.component';
import { ZonaComponent } from './components/datos-simples/zona/zona.component';
import { FormularioZonaComponent } from './components/datos-simples/zona/formulario-zona/formulario-zona.component';
// Stocks
import { StockComponent } from './components/stock/stock.component';
import { LlenosComponent } from './components/stock/llenos/llenos.component';
import { VaciosComponent } from './components/stock/vacios/vacios.component';
import { RotadosComponent } from './components/stock/rotados/rotados.component';
import { ArrendadosComponent } from './components/stock/arrendados/arrendados.component';
import { InfoContactoComponent } from './components/stock/info-contacto/info-contacto.component';


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
    PerfilComponent,
    UsuarioComponent,
    PasswordComponent,
    UsuarioNuevoComponent,
    UsuarioEditarComponent,
    UsuarioDetalleComponent,
    FormularioUsuarioComponent,
    // Cliente
    ClienteComponent,
    ClienteInfoComponent,
    ClienteNuevoComponent,
    ClienteEditarComponent,
    ClienteDetalleComponent,
    FormularioClienteComponent,
    ClienteInfoComplementoComponent,
    // Venta
    VentaComponent,
    VentaInfoComponent,
    VentaNuevoComponent,
    VentaEditarComponent,
    VentaDetalleComponent,
    FechaRetornoComponent,
    VentaEliminarComponent,
    FormularioVentaComponent,
    // Otros
    TipoComponent,
    FormularioTipoComponent,
    PropietarioComponent,
    FormularioPropietarioComponent,
    ComunaComponent,
    FormularioComunaComponent,
    ZonaComponent,
    FormularioZonaComponent,
    // Stock
    StockComponent,
    LlenosComponent,
    VaciosComponent,
    RotadosComponent,
    ArrendadosComponent,
    InfoContactoComponent,
    // Mapa
    MapboxComponent,
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
    NgxChartsModule,
    ToastrModule.forRoot(),
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
