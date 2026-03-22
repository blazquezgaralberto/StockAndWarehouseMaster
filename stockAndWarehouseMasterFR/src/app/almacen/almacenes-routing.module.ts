import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AlmacenesComponent } from "./component/almacenes.component";

const routes: Routes = [
    { path: '', component: AlmacenesComponent,
     data:{
        breadcrumb: 'header.almacenes',
        roles:[]
        },
        canActivate:[]  }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AlmacenesRoutingModule{ }