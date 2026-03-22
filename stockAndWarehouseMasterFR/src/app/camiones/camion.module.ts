import { NgModule } from "@angular/core";
import { UtilsModule } from "../utils/utils.module";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { CamionesService } from "./service/camiones.service";
import { CamionesRoutingModule } from "./camiones-routing.module";
import { CamionesComponent } from "./component/camiones.component";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

@NgModule({
    providers:  [ CamionesService],
    declarations: [CamionesComponent],
    imports: [
        CamionesRoutingModule,
        UtilsModule,
        HttpClientModule,
        CommonModule,
        MatPaginatorModule,
        MatTableModule
    ]
})
export class CamionesModule{ }