// Angular
import { Injectable } from '@angular/core';
// Rutas
import { CanActivate, Router } from '@angular/router';
// Servicios
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private auth: AuthService,
               private router: Router) {}

  /**
   * Revisa que el usuario esté autenticado en el sistema
   * Para dejarle ver las vistas protegidas
   * De no estar autenticado, lo redirige al Login
   */
  canActivate(): boolean  {
    if ( this.auth.estaAutenticado() ) { return true; }
    else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }

}
