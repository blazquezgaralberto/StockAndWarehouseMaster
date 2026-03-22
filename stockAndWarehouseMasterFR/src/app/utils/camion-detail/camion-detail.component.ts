import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Camion } from "../../camiones/model/camion";
import { Utilidad } from "../model/utilidades";

@Component({
    selector: 'app-camiones-detail',
    templateUrl: './camion-detail.component.html'
})
export class CamionDetailComponent implements OnInit {

    @Input() camion!: Camion;
    @Input() desplegableCamiones!: Utilidad[];
    form = this.formBuilder.group({
        matricula: ['', [Validators.required,]],
        modelo: ['', [Validators.required,]],
        carga: [0, [Validators.required,]],
        estado: [12, [Validators.required,]]
    });

    constructor(
        public activeModal: NgbActiveModal,
        private readonly formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        this.form.controls.carga.setValue(null);
        this.form.controls.estado.setValue(null);
        if(this.camion.id){
            this.form.controls.matricula.setValue(this.camion.matricula);
            this.form.controls.modelo.setValue(this.camion.marca);
            this.form.controls.carga.setValue(this.camion.capacidadCarga);
            this.desplegableCamiones.forEach(c=>{
                if(c.id === this.camion.estado){
                    this.form.controls.estado.setValue(c.id);
                }
            });
        }
    }

    cancel(){
        this.activeModal.close();
    }

    guardar(){
        if (!this.form.errors && this.form.controls.matricula.value && this.form.controls.modelo.value &&
            this.form.controls.carga.value && this.form.controls.estado.value) {

            this.camion.matricula = this.form.controls.matricula.value;
            this.camion.marca = this.form.controls.modelo.value;
            this.camion.capacidadCarga = this.form.controls.carga.value;
            this.camion.estado = this.form.controls.estado.value;

            this.activeModal.close(this.camion);
        }

    }


}