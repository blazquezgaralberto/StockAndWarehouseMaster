import { NgModule } from "@angular/core";
import { UtilsModule } from "../utils/utils.module";
import { ProductosComponent } from "./component/productos.component";
import { ProductosRoutingModule } from "./productos-routing.module";
import { ProductosService } from "./service/productos.service";
import {  HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

@NgModule({
    providers:  [ ProductosService],
    declarations: [ProductosComponent],
    imports: [
        ProductosRoutingModule,
        UtilsModule,
        HttpClientModule,
        CommonModule,
        MatPaginatorModule,
        MatTableModule
    ]
})
export class ProductosModule{ }