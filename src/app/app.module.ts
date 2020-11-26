// Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Peticiones
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
// Módulos
import { QRCodeModule } from 'angularx-qrcode';
import { NgQrScannerModule } from 'angular2-qrscanner';
import { MaterialModule } from './modules/material.module';
// Rutas
import { APP_ROUTING } from './app.routes';
// Servicios
import { AuthService } from './services/auth.service';
import { PeticionesService } from './services/peticiones.service';
// Configuraciones
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
// Componentes
import { AppComponent } from './app.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { ActivoComponent } from './components/activo/activo.component';
import { ActivoNuevoComponent } from './components/activo/activo-nuevo/activo-nuevo.component';
import { ActivoEditarComponent } from './components/activo/activo-editar/activo-editar.component';
import { ActivoDetalleComponent } from './components/activo/activo-detalle/activo-detalle.component';
import { ActivoQrComponent } from './components/activo/activo-qr/activo-qr.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    ActivoComponent,
    ActivoNuevoComponent,
    ActivoEditarComponent,
    ActivoDetalleComponent,
    LoginComponent,
    ActivoQrComponent
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
    AuthService,
    PeticionesService,
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
