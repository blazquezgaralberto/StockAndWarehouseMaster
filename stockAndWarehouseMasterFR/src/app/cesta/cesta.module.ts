import { NgModule } from "@angular/core";
import { UtilsModule } from "../utils/utils.module";
import { CestaComponent } from "./component/cesta.component";
import { CestaRoutingModule } from "./cesta-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPayPalModule } from "ngx-paypal";

@NgModule({
    declarations: [CestaComponent],
    imports: [
        CestaRoutingModule,
        UtilsModule,
        HttpClientModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPayPalModule,
    ]
})
export class CestaModule{ }
