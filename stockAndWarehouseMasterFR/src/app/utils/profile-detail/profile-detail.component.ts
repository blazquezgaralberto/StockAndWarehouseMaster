import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Usuario } from "../../users/model/usuario";
import { UsuariosDetailsService } from "../../usuarios-detail/service/usuarios-detail.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-profile-deatail',
    templateUrl: './profile-detail.component.html'
})
export class ProfileDetailModalComponent implements OnInit {

    @Input() username?: string;

    isLogged = false;
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

    constructor(public activeModal: NgbActiveModal,
        private readonly formBuilder: FormBuilder,
        private detailsUserService: UsuariosDetailsService
    ) {
    }

    ngOnInit() {
        this.form.reset();
        if (this.username) {
            this.detailsUserService.getUserByUsername(this.username).subscribe((response) => {
                if (response) {
                    this.usuarioLoggeado = response;
                    this.cargarDetalle();
                }
            })

        } else {
            this.activeModal.close();
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
                        this.editarPerfil = false;
                        this.activeModal.close(true);
                    }
                });

            } else {
                this.detailsUserService.updateUser(this.usuarioLoggeado).subscribe((response) => {
                    if (response) {
                        this.editarPerfil = false;
                        this.activeModal.close(true);
                    }
                });
            }
        }
    }

    cancel() {
        this.activeModal.close();
    }

}
