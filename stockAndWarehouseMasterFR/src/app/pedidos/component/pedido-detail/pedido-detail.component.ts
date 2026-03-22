import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Pedido } from "../../model/pedido";
import { PedidosService } from "../../service/pedidos.service";

@Component({
    selector: 'app-pedido-detail',
    templateUrl: './pedido-detail.component.html'
})
export class PedidoDetailComponent implements OnInit {

    pedido: Pedido = new Pedido;

    estados: { numero: number, nombre: string }[] = [];

    constructor(private router: Router,
        private route: ActivatedRoute,
        private service: PedidosService,
    ) {
    }

    ngOnInit() {
        this.estados = [
            { numero: 5, nombre: 'Pendiente' },
            { numero: 6, nombre: 'Aceptado, en preparación' },
            { numero: 7, nombre: 'En reparto' },
            { numero: 8, nombre: 'Entregado' }
        ];
        const id = this.route.snapshot.params['id'];
        this.service.detail(id).subscribe((response) => {
            if (response) {
                this.pedido = response;
                this.cargarEstados();
            }
        });
    }

    cargarEstados(): void {
        switch (this.pedido.estado) {
            case 5:
                this.pedido.estadoString = 'PENDIENTE';
                break;
            case 6:
                this.pedido.estadoString = 'ACEPTADO, EN PREPARACIÓN';
                break;
            case 7:
                this.pedido.estadoString = 'EN REPARTO';
                break;
            case 8:
                this.pedido.estadoString = 'ENTREGADO';
                break;
            case 9:
                this.pedido.estadoString = 'SOLICITADO PARA DEVOLUCIÓN';
                break;
            case 10:
                this.pedido.estadoString = 'DEVOLUCIÓN ACEPTADA';
                break;
            case 11:
                this.pedido.estadoString = 'DEVUELTO';
                break;
        }
        if(this.pedido.tipoEnvio === 14 ){
            this.pedido.tipoEnvioString = 'Envío Estándar';
        }else if(this.pedido.tipoEnvio === 15 ){
            this.pedido.tipoEnvioString = 'Envío Rápido';
        }
    }

    volverAtras() {
        this.router.navigate(['/pedidos']);
    }
}
