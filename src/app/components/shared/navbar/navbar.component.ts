// Angular
import { Component, OnInit } from '@angular/core';
// Enrutador
import { Router } from '@angular/router';
// Servicios
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void { }

  /**
   * Función que ejecuta el Logout del sistema
   * Llamando la funcion desde el servicio auth
   */
  salir(): void {
    this.auth.logout();
    this.router.navigate(['login']);
  }

  /**
   * Si usamos el botón de ingresar, nos aseguramos de borrar la información de las cookies
   * Y nos redirige a la vista del Login
   */
  ingresar(): void {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }

  /**
   * Esta función se encarga de revisar si existe un usuario autenticado en el sistema
   * De se ser así, nos retorna un True
   */
  verificarValidez(): boolean {
    return this.auth.esAuth;
  }

  verficarAdmin(): boolean {
    return this.auth.esAdmin;
  }

}
