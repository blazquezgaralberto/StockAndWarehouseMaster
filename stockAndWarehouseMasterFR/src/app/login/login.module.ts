import { NgModule } from "@angular/core";
import { UtilsModule } from "../utils/utils.module";
import { LoginComponent } from "./component/login.component";
import { LoginRoutingModule } from "./login-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [LoginComponent],
    imports: [
        LoginRoutingModule,
        UtilsModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
    ]
})
export class LoginModule{ }