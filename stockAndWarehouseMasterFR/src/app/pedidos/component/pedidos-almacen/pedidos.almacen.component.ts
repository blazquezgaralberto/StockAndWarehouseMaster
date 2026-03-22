import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Pedido } from "../../model/pedido";
import { PedidosService } from "../../service/pedidos.service";
import { UserService } from "../../../users/service/user.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { delay } from "rxjs";

@Component({
    selector: 'app-almacen-pedidos',
    templateUrl: './pedidos.almacen.component.html'
})
export class AlmacenPedidosComponent implements OnInit {

    mostrarSinGestion: boolean = true;
    mostrarGestionados: boolean = false;

    username = '';
    pedidosTotales: Pedido[] = [];
    pedidosAlmacen: Pedido[] = [];
    pedidosAAceptar: Pedido[] = [];
    pedidosGestionados: Pedido[] = [];
    isAdmin = false;
    isAlmacen = false;
    roles: Array<string> = [];

    constructor(private router: Router,
        private route: ActivatedRoute,
        private service: PedidosService,
        private userService: UserService,
        private toastr: ToastrService,
        private spinner: NgxSpinnerService,
    ) {
    }

    ngOnInit() {
        if (this.userService.getToken()) {
            this.roles = this.userService.getAuthorities();
            this.roles.forEach(rol => {
                if (rol === 'ROLE_ADMIN') {
                    this.isAdmin = true;
                }
                if (rol === 'ROLE_ALMACEN') {
                    this.isAlmacen = true;
                }
            });
        }
        this.cargarPedidos();
    }

    cargarPedidos(): void {
        if (this.isAlmacen) {
            this.username = this.userService.getUserName();
            this.service.getPedidosUserAlmacen(this.username).subscribe((response) => {
                if (response) {
                    this.pedidosAlmacen = response;
                    this.verEstadoProductos(this.pedidosAlmacen);
                }
            });
        } else if (this.isAdmin) {
            this.service.getAllPedidos().subscribe((response) => {
                if (response) {
                    this.pedidosTotales = response;
                    this.verEstadoProductos(this.pedidosTotales);
                }
            });
        }
    }

    verEstadoProductos(pedidosAlmacen: Pedido[]) {
        pedidosAlmacen.forEach(p => {
            if (p.estado === 5) {
                this.pedidosAAceptar.push(p);
            } else {
                this.pedidosGestionados.push(p);
            }
        });
    }

    aceptarPedido(pedido: Pedido): void {
        this.spinner.show();

        this.service.aceptarPedido(pedido).subscribe((response) => {
            setTimeout(() => {
                this.spinner.hide();
                if (response) {
                    this.toastr.success(response.message, 'ACCIÓN COMPLETADA CORRECAMENTE', {
                        timeOut: 3000, positionClass: 'toast-top-center',
                    });
                    this.cargarPedidos();
                    window.location.reload();
                }
            }, 10000);
        });
    }

    mostrarGestionadosNo() {
        this.mostrarSinGestion = true;
        this.mostrarGestionados = false;
    }

    mostrarGestionadosSi() {
        this.mostrarSinGestion = false;
        this.mostrarGestionados = true;
    }
}
