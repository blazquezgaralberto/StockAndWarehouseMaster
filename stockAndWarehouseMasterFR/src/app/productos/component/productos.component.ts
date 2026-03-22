import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ProductosService } from '../service/productos.service';
import { Producto } from '../model/producto';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProductoDetailComponent } from '../../utils/producto-detail/producto-detail.component';
import { ActivatedRoute } from '@angular/router';
import { ConfirmacionesModalComponent } from '../../utils/confirmaciones-modal/confirmaciones-modal.component';
import { StocksDetailComponent } from '../../utils/stocks-detail/stocks-detail.component';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../users/service/user.service';
import { UsuariosDetailsService } from '../../usuarios-detail/service/usuarios-detail.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html'
})
export class ProductosComponent implements OnInit,AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => this.cargarPaginacion());
  }
  
  productos: Producto[] = [];
  pagedProds: Producto[] = [];
  pageSize = 4;

  modalReference!: NgbModalRef;

  desplegableCategorias = this.route.snapshot.data['desplegableCategorias'];

  username = '';
  isAdmin = false;
  isFabrica = false;
  isAlmacen = false;
  roles: Array<string> = [];

  constructor(
    private readonly modalService: NgbModal,
    private readonly route: ActivatedRoute,
    private service: ProductosService,
    private toastr: ToastrService,
    private userService: UserService,
    private detailsUserService: UsuariosDetailsService,
  ) {
  }

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos(): void {
    if (this.userService.getToken()) {
      this.username = this.userService.getUserName();
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
    }
  
    if(this.isAdmin || this.isAlmacen){
      this.service.lista().subscribe((response) => {
        if (response) {
          this.productos = response;
          this.cargarPaginacion();
        }
      });

    }else if(this.isFabrica){
      this.service.listaFabrica(this.username).subscribe((response) => {
        if (response) {
          this.productos = response;
          this.cargarPaginacion();
        }
      });

    }
  }

  cargarPaginacion(): void {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      const endIndex = startIndex + this.paginator.pageSize;
      this.pagedProds = this.productos.slice(startIndex, endIndex);
    }
  }

  async crearProducto(): Promise<void> {
    this.modalReference = this.modalService.open(ProductoDetailComponent, {
      ariaLabelledBy: 'Detalle productos',
      backdrop: 'static',
      centered: true,
      keyboard: true,
      size: 'lg',
      scrollable: true,
      windowClass: 'custom-modal',
    });
    if(this.isFabrica){
      (this.modalReference.componentInstance as ProductoDetailComponent).fabrica = this.username;
    }
    (this.modalReference.componentInstance as ProductoDetailComponent).producto = new Producto();
    (this.modalReference.componentInstance as ProductoDetailComponent).desplegableCategorias = this.desplegableCategorias;

    try {
      const result = await this.modalReference.result;
      if (result && result.producto && result.file) {
        const formData: any = new FormData();
        formData.append('nombre', result.producto.nombre);
        formData.append('precio', result.producto.precio);
        formData.append('idFabricante', result.producto.idFabricante);
        formData.append('disponible', result.producto.disponible);
        formData.append('categoria', result.producto.categoria);
        formData.append('imagen', result.file);
        if(result.producto.descripcion){
          formData.append('descripcion', result.producto.descripcion);
        }

        this.service.insertProducto(formData).subscribe((response) => {
          if (response) {
            this.toastr.success(response.message, 'ACCIÓN COMPLETADA CORRECAMENTE', {
              timeOut: 3000, positionClass: 'toast-top-center'
            });
            this.cargarProductos();
          }
        });
      }
    } catch (rejectedPromise) {
    }

  }

  async editarProducto(productoLista: Producto): Promise<void> {
    this.modalReference = this.modalService.open(ProductoDetailComponent, {
      ariaLabelledBy: 'Detalle productos',
      backdrop: 'static',
      centered: true,
      keyboard: true,
      size: 'lg',
      scrollable: true,
      windowClass: 'custom-modal',
    });

    if(this.isFabrica){
      (this.modalReference.componentInstance as ProductoDetailComponent).fabrica = this.username;
    }
    (this.modalReference.componentInstance as ProductoDetailComponent).producto = productoLista;
    (this.modalReference.componentInstance as ProductoDetailComponent).desplegableCategorias = this.desplegableCategorias;
    try {
      const result = await this.modalReference.result;
      if (result && result.producto) {
        if (result.file) {
          const formData: any = new FormData();
          formData.append('id', result.producto.id);
          formData.append('nombre', result.producto.nombre);
          formData.append('precio', result.producto.precio);
          formData.append('idFabricante', result.producto.idFabricante);
          formData.append('disponible', result.producto.disponible);
          formData.append('categoria', result.producto.categoria);
          formData.append('imagen', result.file);
          if(result.producto.descripcion){
            formData.append('descripcion', result.producto.descripcion);
          }  

          this.service.insertProducto(formData).subscribe((response) => {
            if (response) {
              this.toastr.success(response.message, 'ACCIÓN COMPLETADA CORRECAMENTE', {
                timeOut: 3000, positionClass: 'toast-top-center'
              });
              this.cargarProductos();
            }
          });

        } else {
          this.service.updateProducto(result.producto).subscribe((response) => {
            if (response) {
              this.toastr.success(response.message, 'ACCIÓN COMPLETADA CORRECAMENTE', {
                timeOut: 3000, positionClass: 'toast-top-center'
              });
              this.cargarProductos();
            }
          });
        }

      }
    } catch (rejectedPromise) {
    }

  }

  async borrar(productoEliminar: Producto): Promise<void> {
    this.modalReference = this.modalService.open(ConfirmacionesModalComponent, {
      ariaLabelledBy: 'Eliminar productos',
      backdrop: 'static',
      centered: true,
      keyboard: true,
      size: 'lg',
      scrollable: true,
      windowClass: 'custom-modal',
    });

    try {
      const guardarProducto = await this.modalReference.result;
      if (guardarProducto) {
        this.service.delete(productoEliminar).subscribe(() => {
          this.cargarProductos();
        });
      }
    } catch (rejectedPromise) {
    }
  }

  async darStcok(prodID: Producto): Promise<void> {
    this.modalReference = this.modalService.open(StocksDetailComponent, {
      ariaLabelledBy: 'Dar stock',
      backdrop: 'static',
      centered: true,
      keyboard: true,
      size: 'lg',
      scrollable: true,
      windowClass: 'custom-modal',
    });
    (this.modalReference.componentInstance as StocksDetailComponent).productoListado = prodID;

    try {
      const stockAlmacen = await this.modalReference.result;
      if (stockAlmacen) {
        this.service.darStock(stockAlmacen).subscribe((response) => {
          if (response) {
            this.toastr.success(response.message, 'ACCIÓN COMPLETADA CORRECAMENTE', {
              timeOut: 3000, positionClass: 'toast-top-center'
            });
            this.cargarProductos();
          }
        });
      }
    } catch (rejectedPromise) {
    }

  }

}
