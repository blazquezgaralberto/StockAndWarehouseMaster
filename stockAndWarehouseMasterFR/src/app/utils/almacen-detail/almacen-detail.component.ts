import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Usuario } from "../../users/model/usuario";
import { Almacen } from "../../almacen/model/almacen";

@Component({
    selector: 'app-almacen-detail',
    templateUrl: './almacen-detail.component.html'
})
export class AlmacenDetailComponent implements OnInit {

    @Input() almacenUpdate!: Almacen;
    @Input() usuario!: Usuario;
    form = this.formBuilder.group({
        nombre: ['', [Validators.required,]],
        ubicacion: ['', [Validators.required,]]
    });

    constructor(
        public activeModal: NgbActiveModal,
        private readonly formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        this.form.controls.nombre.setValue(null);
        this.form.controls.ubicacion.setValue(null);

        if(this.usuario){
            this.form.controls.nombre.setValue(this.usuario.nombre);
        }
        
        if(this.almacenUpdate){
            this.form.controls.nombre.setValue(this.almacenUpdate.nombre);
            this.form.controls.ubicacion.setValue(this.almacenUpdate.ubicacion);
        }
    }

    cancel(){
        this.activeModal.close();
    }

    guardar():void{
        if (!this.form.errors &&  this.form.controls.ubicacion.value) {
            this.usuario.ubicacion = this.form.controls.ubicacion.value;
            this.activeModal.close(this.usuario);
        }
    }

    actualizar():void{
        if (!this.form.errors &&  this.form.controls.nombre.value &&  this.form.controls.ubicacion.value) {
            this.almacenUpdate.nombre = this.form.controls.nombre.value;
            this.almacenUpdate.ubicacion = this.form.controls.ubicacion.value;
            this.activeModal.close(this.almacenUpdate);
        }
    }
}