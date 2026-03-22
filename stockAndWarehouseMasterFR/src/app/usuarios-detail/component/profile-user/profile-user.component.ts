import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "../../../users/service/user.service";
import { UsuariosDetailsService } from "../../service/usuarios-detail.service";
import { Usuario } from "../../../users/model/usuario";
import { FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: 'app-profile-user',
    templateUrl: './profile-user.component.html'
})
export class ProfileUserComponent implements OnInit {

    isLogged = false;
    username = '';
    usuarioLoggeado!: Usuario;

    editarPerfil = false;

    fileSelected?: File;

    form = this.formBuilder.group({
        nombre: ['', [Validators.required,]],
        username: ['', [Validators.required,]],
        email: ['', [Validators.required,]],
        fechaAlta: ['', [Validators.required,]],
        telefono: ['', [Validators.required,]],
    });

    constructor(private router: Router,
        private route: ActivatedRoute,
        private readonly formBuilder: FormBuilder,
        private userService: UserService,
        private detailsUserService: UsuariosDetailsService,
        private toastr: ToastrService,
    ) {
    }

    ngOnInit() {
        this.form.reset();
        if (this.userService.getToken()) {
            this.isLogged = true;
            this.username = this.userService.getUserName();
            this.detailsUserService.getUserByUsername(this.username).subscribe((response) => {
                if (response) {
                    this.usuarioLoggeado = response;
                    this.cargarDetalle();
                }
            })

        } else {
            this.isLogged = false;
            this.username = '';
        }
    }

    cargarDetalle(): void {
        this.form.controls.nombre.setValue(this.usuarioLoggeado.nombre);
        this.form.controls.username.setValue(this.usuarioLoggeado.username);
        this.form.controls.email.setValue(this.usuarioLoggeado.email);
        this.form.controls.fechaAlta.setValue(this.usuarioLoggeado.fechaAlta.toString());
        this.form.controls.fechaAlta.disable();
        this.form.controls.telefono.setValue(this.usuarioLoggeado.telefono);
    }

    onSelectFile(event: any): void {
        this.fileSelected = event.target.files[0];
    }

    edicionPerfil(): void {
        this.editarPerfil = true;
    }

    actualizar(): void {
        if (!this.form.errors && this.form.controls.nombre.value &&
            this.form.controls.username.value && this.form.controls.email.value &&
            this.form.controls.telefono.value
        ) {
            this.usuarioLoggeado.nombre = this.form.controls.nombre.value;
            this.usuarioLoggeado.username = this.form.controls.username.value;
            this.usuarioLoggeado.email = this.form.controls.email.value;
            this.usuarioLoggeado.telefono = this.form.controls.telefono.value;

            if (this.fileSelected) {
                const formData: any = new FormData();
                formData.append('id', this.usuarioLoggeado.id);
                formData.append('nombre', this.usuarioLoggeado.nombre);
                formData.append('username', this.usuarioLoggeado.username);
                formData.append('email', this.usuarioLoggeado.email);
                formData.append('telefono', this.usuarioLoggeado.telefono);

                formData.append('imagen', this.fileSelected);
                this.detailsUserService.updateUserPhoto(formData).subscribe((response) => {
                    if (response) {
                        this.toastr.success(response.message, 'ACCIÓN COMPLETADA CORRECAMENTE', {
                            timeOut: 3000, positionClass: 'toast-top-center'
                        });
                        this.editarPerfil = false;
                        this.ngOnInit();
                    }
                });

            } else {
                this.detailsUserService.updateUser(this.usuarioLoggeado).subscribe((response) => {
                    if (response) {
                        this.toastr.success(response.message, 'ACCIÓN COMPLETADA CORRECAMENTE', {
                            timeOut: 3000, positionClass: 'toast-top-center'
                        });
                        this.editarPerfil = false;
                        this.ngOnInit();
                    }
                });
            }
        }
    }

    cancelar(): void {
        this.editarPerfil = false;
    }

}
