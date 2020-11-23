import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void { }

  salir(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  ingresar(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expira');
    this.router.navigateByUrl('/login');
  }

  verificarValidez(): boolean {
    return this.auth.estaAutenticado();
  }

}
