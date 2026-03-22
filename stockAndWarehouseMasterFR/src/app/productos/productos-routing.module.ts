import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProductosComponent } from "./component/productos.component";

const routes: Routes = [
    { path: '', component: ProductosComponent,
     data:{
        breadcrumb: 'header.productos',
        roles:[]
        },
        canActivate:[]  }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductosRoutingModule{ }