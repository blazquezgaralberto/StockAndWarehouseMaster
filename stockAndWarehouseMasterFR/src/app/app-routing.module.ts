import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UtilidadesComboResolver } from './resolvers/utilidades-combo.service';
import { RolesUserComboResolver } from './resolvers/role-user.resolver.service';
import { ProdGuardService } from './resolvers/roles-resolver.service';


const routes: Routes = [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
            path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
            data: { roles: [] },
            resolve: {
            },
            canLoad: []
      },
      {
            path: 'catalogo', loadChildren: () => import('./catalogo/catalogo.module').then(m => m.CatalogoModule),
            data: { roles: [] },
            canLoad: []
      },
      {
            path: 'registro', loadChildren: () => import('./registro/registro.module').then(m => m.RegistroModule),
            data: { roles: [] },
            canLoad: []
      },
      {
            path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
            data: { roles: [] },
            canLoad: []
      },
      {
            path: 'cesta', loadChildren: () => import('./cesta/cesta.module').then(m => m.CestaModule),
            data: { roles: [] },
            canLoad: []
      },
      {
            path: 'productos', loadChildren: () => import('./productos/productos.module').then(m => m.ProductosModule),
            canActivate:[ProdGuardService],
            data: { expectedRol: ['admin', 'fabricante', 'almacen'] },
            resolve: {
                  desplegableCategorias: () => inject(UtilidadesComboResolver).resolve(1),
            },
            canLoad: []
      },
      {
            path: 'pedidos', loadChildren: () => import('./pedidos/pedidos.module').then(m => m.PedidosModule),
            canActivate:[ProdGuardService],
            data: { expectedRol: ['admin', 'user', 'almacen'] },
            canLoad: []
      },
      {
            path: 'camiones', loadChildren: () => import('./camiones/camion.module').then(m => m.CamionesModule),
            canActivate:[ProdGuardService],
            data: { expectedRol: ['admin', 'almacen'] },
            resolve: {
                  desplegableCamiones: () => inject(UtilidadesComboResolver).resolve(3),
            },
            canLoad: []
      },
      {
            path: 'almacenes', loadChildren: () => import('./almacen/almacen.module').then(m => m.AlmacenesModule),
            canActivate:[ProdGuardService],
            data: { expectedRol: ['admin'] },
            canLoad: []
      },
      {
            path: 'usuarios', loadChildren: () => import('./usuarios-detail/usuarios-detail.module').then(m => m.UsuariosDetailsModule),
            canActivate:[ProdGuardService],
            data: { expectedRol: ['admin', 'fabricante', 'almacen', 'user']},
            resolve: {
                  comboRoles: () => inject(RolesUserComboResolver).resolve(),
            },
            canLoad: []
      },
      { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
      imports: [RouterModule.forRoot(routes)],
      exports: [RouterModule]
})
export class AppRoutingModule { }
