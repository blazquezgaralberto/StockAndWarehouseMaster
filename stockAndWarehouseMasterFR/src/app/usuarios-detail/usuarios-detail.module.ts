import { NgModule } from "@angular/core";
import { UtilsModule } from "../utils/utils.module";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { UsuariosDetailsService } from "./service/usuarios-detail.service";
import { UsuariosDetailComponent } from "./component/usuarios-detail.component";
import { UsuariosDetailsRoutingModule } from "./usuarios-detail-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { ProfileUserComponent } from "./component/profile-user/profile-user.component";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";

@NgModule({
    providers:  [ UsuariosDetailsService],
    declarations: [UsuariosDetailComponent, ProfileUserComponent],
    imports: [
        UsuariosDetailsRoutingModule,
        UtilsModule,
        HttpClientModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        MatPaginatorModule,
        MatTableModule
    ]
})
export class UsuariosDetailsModule{ }