import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RegistroComponent } from "./component/registro.component";

const routes: Routes = [
    { path: '', component: RegistroComponent,
     data:{
        breadcrumb: 'header.registro',
        roles:[]
        },
        canActivate:[]  }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RegistroRoutingModule{ }