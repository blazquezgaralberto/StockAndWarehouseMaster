import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CatalogoComponent } from "./component/catalogo.component";

const routes: Routes = [
    { path: '', component: CatalogoComponent,
     data:{
        breadcrumb: 'header.catalogo',
        roles:[]
        },
        canActivate:[]  }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CatalogoRoutingModule{ }