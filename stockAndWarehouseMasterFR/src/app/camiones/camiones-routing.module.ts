import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CamionesComponent } from "./component/camiones.component";

const routes: Routes = [
    { path: '', component: CamionesComponent,
     data:{
        breadcrumb: 'header.camiones',
        roles:[]
        },
        canActivate:[]  }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CamionesRoutingModule{ }