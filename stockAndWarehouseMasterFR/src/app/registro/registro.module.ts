import { NgModule } from "@angular/core";
import { UtilsModule } from "../utils/utils.module";
import { RegistroComponent } from "./component/registro.component";
import { RegistroRoutingModule } from "./registro-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [RegistroComponent],
    imports: [
        RegistroRoutingModule,
        UtilsModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
    ]
})
export class RegistroModule{ }