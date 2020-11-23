// Angular
import { Injectable } from '@angular/core';
// Rutas
import { CanActivate, Router } from '@angular/router';
// Servicios
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor( private auth: AuthService,
               private router: Router) {}

  /**
   * Revisa que exista un usuario autenticado en el sistema
   * De ser así, no permite que el usuario regrese a la vista del Login
   */
  canActivate(): boolean  {
    if ( !this.auth.estaAutenticado() ) { return true; }
    else {
      this.router.navigateByUrl('/home');
      return false;
    }
  }

}
