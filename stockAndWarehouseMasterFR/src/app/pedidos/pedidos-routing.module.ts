import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PedidosComponent } from "./component/pedidos.component";
import { PedidoDetailComponent } from "./component/pedido-detail/pedido-detail.component";
import { AlmacenPedidosComponent } from "./component/pedidos-almacen/pedidos.almacen.component";
import { ProdGuardService } from "../resolvers/roles-resolver.service";

const routes: Routes = [
    {
        path: '', component: PedidosComponent,
        data: {
            breadcrumb: 'header.pedidos',
            roles: []
        },
        canActivate: []
    },
    {
        path: 'detalle-pedido/:id', component: PedidoDetailComponent,
        data: {
            breadcrumb: 'header.pedido-detail',
            roles: []
        },
        canActivate: []
    },
    {
        path: 'almacen', component: AlmacenPedidosComponent,
        canActivate:[ProdGuardService],
        data: {
            breadcrumb: 'header.pedido.almacen',
            expectedRol: ['admin', 'almacen']
        },
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PedidosRoutingModule { }