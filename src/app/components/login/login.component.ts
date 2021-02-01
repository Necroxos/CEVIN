// Angular
import { Component, OnInit } from '@angular/core';
// Servicios
import { AuthService } from '../../services/auth.service';
import { PeticionesService } from '../../services/peticiones.service';
// Formulario
import { NgForm } from '@angular/forms';
// Modelos
import { LoginModel } from '../../models/login.model';
// Módulos
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { RecuperarPassComponent } from './recuperar-pass/recuperar-pass.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // Algunas variables para almacenar información
  authUser: LoginModel = new LoginModel();
  recordarme = false;

  constructor(
    public dialog: MatDialog,
    private auth: AuthService,
    private estadoPeticion: PeticionesService) { }

  /**
   * Sacamos información guardada en las cookies locales (si existe)
   * Y autocompletamos información del Login
   */
  ngOnInit(): void {
    if (localStorage.getItem('email')) {
      this.authUser.email = localStorage.getItem('email');
      this.recordarme = true;
    }
  }

  /**
   * Angular From tiene la facultad de actualizar la información automáticamente
   * En esta caso cada campo del formulario guarda la información en el modelo authUser
   * Además, la función hace uso de los servicios de Estado de Petición para mostrar mensajes de Loading y Error (si es necesario)
   * @param form Verifica que la información sea correcta, según las validaciones que hayamos definido
   */
  login(form: NgForm): void {
    if (form.invalid) { return; }

    this.estadoPeticion.loading();

    this.auth.login(this.authUser)
      .subscribe( () => {
        Swal.close();

        if (this.recordarme) { localStorage.setItem('email', this.authUser.email); }
        else { localStorage.removeItem('email'); }

        this.estadoPeticion.success('Ingreso éxitoso!', ['stock', 'llenos'], 800);

      }, (err: any) => {
        this.estadoPeticion.error(err);
      });
  }

  /**
   * Abre un 'modal' para preguntar el correo donde se enviará la contraseña restablecida por el Back End
   */
  openDialog(): void {
    this.dialog.open(RecuperarPassComponent, {
      width: '40vh',
      data: { email: this.authUser.email }
    });
  }
}
