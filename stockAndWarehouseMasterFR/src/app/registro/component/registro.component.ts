import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../users/service/auth.service';
import { UserService } from '../../users/service/user.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html'
})
export class RegistroComponent implements OnInit {

  errMsj = false;
  errorMensaje: string = "";
  isLogged = false;

  form = this.formBuilder.group({
    nombre: ['', [Validators.required,]],
    username: ['', [Validators.required,]],
    password: ['', [Validators.required,]],
    password2: ['', [Validators.required,]],
    email: ['', [Validators.required, Validators.email]]
  });

  constructor(private authService: AuthService,
    private userService: UserService,
    private readonly router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    if (this.userService.getToken()) {
      this.isLogged = true;
    }
  }


  onRegister(): void {

    this.errMsj = false;
    this.errorMensaje = "";

    var name = this.form.controls.nombre.value;
    var username = this.form.controls.username.value;
    var pass = this.form.controls.password.value;
    var pass2 = this.form.controls.password2.value;
    var email = this.form.controls.email.value

    if (!name || !username || !pass || !pass2 || !email) {
      this.errMsj = true;
      this.errorMensaje = "Error, hay valores vacíos";

    } else if (this.form.controls.password.value !== this.form.controls.password2.value) {

      this.errMsj = true;
      this.errorMensaje = "Error, la contraseña no concuerda";

    } else if (!this.form.controls.email.valid) {

      this.errMsj = true;
      this.errorMensaje = "Error, email inválido";

    } else { //TODO Add validation to username
      this.authService.signup(name, username, pass, email).subscribe(response => {

        this.toastr.success('Cuenta Creada', 'ACCIÓN COMPLETADA CORRECAMENTE', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });

        this.router.navigate(['/login']);
      },
        error => {
          this.errMsj = true;
          this.errorMensaje = error.error.message;
          this.toastr.error(this.errorMensaje, 'Fail', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          });
        });
    }

  }


  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToRegistro(): void {
    this.router.navigate(['/registro']);
  }
}
