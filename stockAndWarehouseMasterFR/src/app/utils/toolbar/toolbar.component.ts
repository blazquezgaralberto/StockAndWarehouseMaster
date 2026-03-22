import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../users/service/user.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html'
})
export class ToolbarComponent implements OnInit {


  isCollapsed = true;
  isMenuCollapsed2 = true;
  isLogged = false;
  isAdmin = false;
  isAlmacen = false;
  isFabrica = false;

  roles: Array<string> = [];
  username = '';

  constructor(
    private router: Router,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    if (this.userService.getToken()) {
      this.isLogged = true;
      this.roles = this.userService.getAuthorities();
      this.roles.forEach(rol => {
        if (rol === 'ROLE_ADMIN') {
          this.isAdmin = true;
        }
        if (rol === 'ROLE_ALMACEN') {
          this.isAlmacen = true;
        }
        if (rol === 'ROLE_FABRICANTE') {
          this.isFabrica = true;
        }
      });
    } else {
      this.isLogged = false;
      this.username = '';
    }
  }

  navigateToCatalogo(): void {
    this.router.navigate(['/catalogo']);
  }
  navigateToHome(): void {
    this.router.navigate(['/home']);
  }
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
  navigateToCesta(): void {
    this.router.navigate(['/cesta']);
  }
  navigateToUsuarios(): void {
    this.router.navigate(['/usuarios']);
  }
  navigateToProductos(): void {
    this.router.navigate(['/productos']);
  }
  navigateToCamiones(): void {
    this.router.navigate(['/camiones']);
  }
  navigateToAlmacenes(): void {
    this.router.navigate(['/almacenes']);
  }
  navigateToPedidos(): void {
    this.router.navigate(['/pedidos']);
  }
  navigateToPedidosAlmacen(): void {
    this.router.navigate(['/pedidos/almacen']);
  }
  navigateToProfile():void{
    this.router.navigate(['/usuarios/perfil']);
  }

  option1(): void {
    this.router.navigate(['/home']);
  }

  onLogOut(): void {
    this.userService.deleteSession();
    //this.navigateToHome();
    window.location.reload();
  }

}
