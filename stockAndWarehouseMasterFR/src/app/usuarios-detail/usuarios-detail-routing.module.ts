import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UsuariosDetailComponent } from "./component/usuarios-detail.component";
import { ProfileUserComponent } from "./component/profile-user/profile-user.component";
import { ProdGuardService } from "../resolvers/roles-resolver.service";

const routes: Routes = [
    {
        path: '', component: UsuariosDetailComponent,
        data: {
            breadcrumb: 'header.usuarios',
            roles: []
        },
        canActivate: []
    }
    ,
    {
        path: 'perfil', component: ProfileUserComponent,
        canActivate:[ProdGuardService],
        data: {
            breadcrumb: 'header.perfil',
            expectedRol: ['admin', 'fabricante', 'almacen', 'user'],
        },
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsuariosDetailsRoutingModule { }