import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CestaComponent } from "./component/cesta.component";

const routes: Routes = [
    { path: '', component: CestaComponent,
     data:{
        breadcrumb: 'header.cesta',
        roles:[]
        },
        canActivate:[]  }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CestaRoutingModule{ }