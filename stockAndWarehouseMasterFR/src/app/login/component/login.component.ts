import { Component, Injector, OnInit } from '@angular/core';
import { AuthService } from '../../users/service/auth.service';
import { UserService } from '../../users/service/user.service';
import { Router } from '@angular/router';
import { TokenUsuario } from '../../utils/model/tokenUsuario';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  form = this.formBuilder.group({
    username: ['', [Validators.required,]],
    password: ['', [Validators.required,]]
  });

  isLogged = false;
  isLoginFail = false;
  loginUSuario: TokenUsuario | undefined;
  roles: string[] = [];
  errMsj = false;
  errorMensaje: string | undefined;

  constructor(private authService: AuthService,
    private userService: UserService,
    private readonly router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    if (this.userService.getToken()) {
      this.isLogged = true;
      this.isLoginFail = false;
      this.roles = this.userService.getAuthorities();
    }
  }


  onLogin(): void {

    var uname = this.form.controls.username.value;
    var pass = this.form.controls.password.value

    if (uname && pass) {

      this.authService.login(uname, pass).subscribe((response) => {

        console.log("RESPONSE - " + JSON.stringify(response));

        if (response.body) {

          var usuario = response.body as TokenUsuario;
          console.log(usuario);
          this.userService.setUserName(usuario.uname);
          this.userService.setToken(usuario.token);
          this.userService.setAuthorities(usuario.roles);
          this.userService.updateRoles(usuario.roles);

          this.toastr.success('Bienvenido ' + usuario.uname, 'ACCIÓN COMPLETADA CORRECAMENTE', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.router.navigate(['/']);
        }

      }, (error) => {
        this.isLogged = false;
        this.errMsj = true;
        this.errorMensaje = error.error.message;
        this.toastr.error(this.errorMensaje, 'Fail', {
          timeOut: 3000, positionClass: 'toast-top-center',
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
