import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, Validators } from "@angular/forms";
import { Producto } from "../../productos/model/producto";
import { Almacen } from "../../almacen/model/almacen";
import { AlmacenService } from "../../almacen/service/almacen.service";

@Component({
    selector: 'app-stocks-detail',
    templateUrl: './stocks-detail.component.html'
})
export class StocksDetailComponent implements OnInit {

    @Input() productoListado!: Producto;
    
    almacenes: Almacen[] = [];
    form = this.formBuilder.group({
        cantidadStock: [null, [Validators.required,]],
        almacen: [null, [Validators.required,]]
    });

    constructor(
        public activeModal: NgbActiveModal,
        private readonly formBuilder: FormBuilder,
        private almacenesService: AlmacenService,
    ) { }

    ngOnInit() {
        this.almacenesService.lista().subscribe((response) => {
            if (response) {
              this.almacenes = response;
            }
          });
          
    }

    cancel() {
        this.activeModal.close();
    }
    darStock() {
        if (!this.form.errors && this.form.controls.cantidadStock.value && this.form.controls.almacen.value) {
            const stocksProducto: Producto = new Producto();
            stocksProducto.stockParaAlmacen = this.form.controls.cantidadStock.value;
            stocksProducto.idAlmacen = this.form.controls.almacen.value;
            stocksProducto.id = this.productoListado.id;
            stocksProducto.idFabricante = this.productoListado.idFabricante;
            this.activeModal.close(stocksProducto);
        }

    }
}
