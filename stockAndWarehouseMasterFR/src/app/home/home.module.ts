import { NgModule } from "@angular/core";
import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./component/home.component";
import { UtilsModule } from "../utils/utils.module";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { CarouselModule } from "ngx-owl-carousel-o";

@NgModule({
    declarations: [HomeComponent],
    imports: [
        HomeRoutingModule,
        UtilsModule,
        CommonModule,
        CarouselModule
    ]
})
export class HomeModule{ }