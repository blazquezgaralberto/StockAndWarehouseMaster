import { Component, Input, OnInit } from '@angular/core';
import { Producto } from '../../productos/model/producto';
import { ProductosService } from '../../productos/service/productos.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-modal-producto-catalogo',
    templateUrl: './producto-catalogo-modal.component.html'
})
export class ProductoCatalogoDetailComponent implements OnInit {

    @Input() producto!: Producto;

    form = this.formBuilder.group({
        cantidad: [null, [Validators.min(1),]]
    });

    constructor(
        public activeModal: NgbActiveModal,
        private readonly formBuilder: FormBuilder,
        private service: ProductosService,
        private toastr: ToastrService
    ) {
    }

    ngOnInit(): void {
        switch(this.producto.categoria){
            case 1: this.producto.categoriaString = 'TEXTILES';
                break;
            case 2: this.producto.categoriaString = 'ELECTRODOMÉSTICOS';
                break;
            case 3: this.producto.categoriaString = 'MUEBLES';
                break;
            case 4: this.producto.categoriaString = 'MATERIAL DEPORTIVO';
                break;
            default:
                this.producto.categoriaString = 'Se ha producido un error';
        }
    }

    salir(){
        this.activeModal.close();
    }

    aniadirAlCarrito():void{

        if(this.form.controls.cantidad.value && this.form.controls.cantidad.value>0){
            if(this.producto.stock < this.form.controls.cantidad.value){
                this.toastr.warning('No hay stock suficiente del producto', 'QUEDA POCO STOCK', {
                    timeOut: 3000, positionClass: 'toast-top-center'
                });
            }else{
                this.producto.cantidadProductoPedido = this.form.controls.cantidad.value;
                this.producto.precioCantidadTotal = Number((this.producto.cantidadProductoPedido * this.producto.precio).toFixed(2));
                this.activeModal.close(this.producto);
            }
        }else{
            this.toastr.error('Introduzca una cantidad válida', 'ACCIÓN NO VÁLIDA', {
                timeOut: 3000, positionClass: 'toast-top-center'
            });
        }
    }
}
