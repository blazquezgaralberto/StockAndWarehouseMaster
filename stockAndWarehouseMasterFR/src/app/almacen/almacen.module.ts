import { NgModule } from "@angular/core";
import { UtilsModule } from "../utils/utils.module";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { AlmacenesRoutingModule } from "./almacenes-routing.module";
import { AlmacenService } from "./service/almacen.service";
import { AlmacenesComponent } from "./component/almacenes.component";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

@NgModule({
    providers:  [ AlmacenService ],
    declarations: [AlmacenesComponent],
    imports: [
        AlmacenesRoutingModule,
        UtilsModule,
        HttpClientModule,
        CommonModule,
        MatSlideToggleModule,
        MatPaginatorModule,
        MatTableModule
    ]
})
export class AlmacenesModule{ }