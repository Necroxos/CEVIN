import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { LoginModel } from '../../models/login.model';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';
import { PeticionesService } from '../../services/peticiones.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  authUser: LoginModel = new LoginModel();
  recordarme = false;

  // tslint:disable-next-line: variable-name
  constructor(private _auth: AuthService, private estadoPeticion: PeticionesService, private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem('email')) {
      this.authUser.email = localStorage.getItem('email');
      this.recordarme = true;
    }
  }


  login(form: NgForm): void {
    if (form.invalid) { return; }

    this.estadoPeticion.loading();

    this._auth.login(this.authUser)
      .subscribe( () => {
        Swal.close();
        if (this.recordarme) { localStorage.setItem('email', this.authUser.email); }
        this.router.navigateByUrl('/home');
      }, (err: any) => {
        this.estadoPeticion.error(err, 'Error al autenticar');
      });
  }
}
