import { Component, Input, OnInit } from "@angular/core";
import { Producto } from "../../productos/model/producto";
import { FormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Utilidad } from "../model/utilidades";
import { UsuariosDetailsService } from "../../usuarios-detail/service/usuarios-detail.service";
import { Usuario } from "../../users/model/usuario";

@Component({
    selector: 'app-productos-detail',
    templateUrl: './producto-detail.component.html'
})
export class ProductoDetailComponent implements OnInit {

    @Input() fabrica?: string;
    @Input() producto!: Producto;
    @Input() desplegableCategorias!: Utilidad[];

    fileSelected?: File;

    usuariosFabricantes: Usuario[] = [];
    form = this.formBuilder.group({
        nombre: ['', [Validators.required,]],
        precio: [0, [Validators.required,]],
        idFabricante: [0, [Validators.required,]],
        disponible: [true, [Validators.required,]],
        descripcion: ['', ],
        categoria: [0, [Validators.required,]]
    });

    constructor(
        public activeModal: NgbActiveModal,
        private readonly formBuilder: FormBuilder,
        private userService: UsuariosDetailsService,
    ) {
    }

    ngOnInit() {

        this.form.controls.precio.setValue(null);
        this.form.controls.idFabricante.setValue(null);
        this.form.controls.disponible.setValue(null);
        this.form.controls.categoria.setValue(null);
        this.form.controls.descripcion.setValue(null);

        this.userService.listadoUsuariosTipo(3).subscribe((response) => {
            if (response) {
                this.usuariosFabricantes = response;
                this.cargarDetalles();
            }
        });

    }

    cargarDetalles(): void {
        if (this.producto.id) {
            this.form.controls.nombre.setValue(this.producto.nombre);
            this.form.controls.precio.setValue(this.producto.precio);
            this.form.controls.disponible.setValue(this.producto.disponible);
            this.form.controls.descripcion.setValue(this.producto.descripcion);
            this.usuariosFabricantes.forEach(fab => {
                if (fab.id === this.producto.idFabricante) {
                    this.form.controls.idFabricante.setValue(fab.id);
                }
            });
            this.desplegableCategorias.forEach(cat => {
                if (cat.id === this.producto.categoria) {
                    this.form.controls.categoria.setValue(cat.id);
                }
            });
        }
        if(this.fabrica){
            this.form.controls.idFabricante.disable();
            this.usuariosFabricantes.forEach(fab => {
                if (fab.username === this.fabrica) {
                    this.form.controls.idFabricante.setValue(fab.id);
                }
            });
        }
    }

    cancel() {
        this.activeModal.close();
    }

    guardar() {
        if (!this.form.errors && this.form.controls.nombre.value && this.form.controls.precio.value
            && this.form.controls.idFabricante.value && this.form.controls.disponible.value
            && this.form.controls.categoria.value && this.fileSelected) {

            const productoAGuardar: Producto = new Producto();
            productoAGuardar.nombre = this.form.controls.nombre.value;
            productoAGuardar.precio = this.form.controls.precio.value;
            productoAGuardar.idFabricante = this.form.controls.idFabricante.value;
            productoAGuardar.disponible = this.form.controls.disponible.value;
            productoAGuardar.categoria = this.form.controls.categoria.value;
            if(this.form.controls.descripcion.value){
                productoAGuardar.descripcion = this.form.controls.descripcion.value;
            }

            this.activeModal.close({ producto: productoAGuardar, file: this.fileSelected });
        }
    }

    actualizar() {

        if (!this.form.errors && this.form.controls.nombre.value && this.form.controls.precio.value
            && this.form.controls.idFabricante.value && this.form.controls.disponible.value
            && this.form.controls.categoria.value) {

            this.producto.nombre = this.form.controls.nombre.value;
            this.producto.precio = this.form.controls.precio.value;
            this.producto.idFabricante = this.form.controls.idFabricante.value;
            this.producto.disponible = this.form.controls.disponible.value;
            this.producto.categoria = this.form.controls.categoria.value;
            if(this.form.controls.descripcion.value){
                this.producto.descripcion = this.form.controls.descripcion.value;
            }

            if (this.fileSelected) {
                this.activeModal.close({ producto: this.producto, file: this.fileSelected });
            } else {
                this.activeModal.close({ producto: this.producto, file: null });
            }

        }
    }

    onSelectFile(event: any): void {
        this.fileSelected = event.target.files[0];
    }
}
