import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { LoginModule } from './login/login.module';
import { CatalogoModule } from './catalogo/catalogo.module';
import { ProductosModule } from './productos/productos.module';
import { UtilsModule } from './utils/utils.module';
import { CestaModule } from './cesta/cesta.module';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { InterceptorService } from './interceptors/interceptorHTTP.service';
import { CamionesModule } from './camiones/camion.module';
import { AlmacenesModule } from './almacen/almacen.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { PedidosModule } from './pedidos/pedidos.module';
import { UsuariosDetailsModule } from './usuarios-detail/usuarios-detail.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    UtilsModule,
    HomeModule,
    CatalogoModule,
    LoginModule,
    ProductosModule,
    PedidosModule,
    UsuariosDetailsModule,
    AlmacenesModule,
    CamionesModule,
    CestaModule,
    NgxSpinnerModule,
    AppRoutingModule,
  ],
  providers: [ InterceptorService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
