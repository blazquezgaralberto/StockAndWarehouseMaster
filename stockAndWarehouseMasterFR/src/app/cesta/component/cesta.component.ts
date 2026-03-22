import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Producto } from '../../productos/model/producto';
import { ProductosService } from '../../productos/service/productos.service';
import { Usuario } from '../../users/model/usuario';
import { UserService } from '../../users/service/user.service';
import { UsuariosDetailsService } from '../../usuarios-detail/service/usuarios-detail.service';
import { PedidosService } from '../../pedidos/service/pedidos.service';
import { Pedido } from '../../pedidos/model/pedido';
import { Router } from '@angular/router';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-cesta',
  templateUrl: './cesta.component.html'
})
export class CestaComponent implements OnInit {

  productosCesta: Producto[] = [];

  public payPalConfig?: IPayPalConfig;

  isLogged = false;
  desplegableGestionPedido: boolean = false;
  username = '';
  usuarioLoggeado: Usuario | undefined;

  precioTotal: number = 0;
  envioEstandarFecha!: Date;
  envioRapidoFecha!: Date;

  form = this.formBuilder.group({
    nombre: ['', [Validators.required,]],
    telefono: ['', [Validators.required,]],
    direccion: ['', [Validators.required,]],
    codigoPostal: [null, [Validators.required,]],
    envio: ['estandar', Validators.required],
    observaciones: [''],

  });

  constructor(private router: Router,
    private cartService: ProductosService,
    private userService: UserService,
    private toastr: ToastrService,
    private readonly formBuilder: FormBuilder,
    private detailsUserService: UsuariosDetailsService,
    private pedidoService: PedidosService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {

    this.initConfig();

    this.form.controls.observaciones.setValue(null);
    this.envioEstandarFecha = this.calcularFecha(3);
    this.envioRapidoFecha = this.calcularFecha(1);

    if (this.userService.getToken()) {
      this.isLogged = true;
      this.username = this.userService.getUserName();
      this.detailsUserService.getUserByUsername(this.username).subscribe((response) => {
        if (response) {
          this.usuarioLoggeado = response;
        }
      })

    } else {
      this.isLogged = false;
      this.username = '';
    }

    this.productosCesta = this.obtenerProductosDelCarrito();

    this.calcularTotal();
  }

  removeItem(productoAEliminar: Producto): void {
    const index = this.productosCesta.findIndex(prod => prod.id === productoAEliminar.id);
    if (index !== -1) {
      this.productosCesta.splice(index, 1);
      localStorage.setItem('carrito', JSON.stringify(this.productosCesta));
      this.calcularTotal();
    }
    if(this.productosCesta.length<=0){
      this.desplegableGestionPedido = false;
    }
  }

  startOrder(): void {
    if (this.isLogged) {

      if (this.productosCesta.length > 0) {
        this.desplegableGestionPedido = true;
      } else {
        this.toastr.error('El carrito está vacío', 'ACCIÓN NO VÁLIDA', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
      }

    } else {
      this.toastr.error('Debes iniciar sesión para poder realizar el pedido', 'ACCIÓN NO VÁLIDA', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
    }
  }

  obtenerProductosDelCarrito(): Producto[] {
    const carritoString = localStorage.getItem('carrito');
    if (carritoString) {
      return JSON.parse(carritoString);
    } else {
      return [];
    }
  }

  calcularTotal() {
    this.precioTotal = 0;
    this.productosCesta.forEach(prod => {
      this.precioTotal += prod.precioCantidadTotal;
    });
    this.precioTotal = parseFloat(this.precioTotal.toFixed(2));
  }

  confirmarPedido() {
    if (this.form.valid && this.form.controls.nombre.value && this.form.controls.telefono.value
      && this.form.controls.direccion.value && this.form.controls.codigoPostal.value && this.form.controls.envio
      && this.usuarioLoggeado) {

      this.spinner.show();

      const ped = new Pedido();
      ped.nombre = this.form.controls.nombre.value;
      ped.telefono = this.form.controls.telefono.value;
      ped.direccionEntrega = this.form.controls.direccion.value;
      ped.codigoPostal = this.form.controls.codigoPostal.value;
      ped.observaciones = this.form.controls.observaciones.value;

      ped.listaProductos = this.productosCesta;
      ped.precioFinal = this.precioTotal;
      ped.idUsuario = this.usuarioLoggeado.id;

      if (this.form.controls.envio.value === 'estandar') {
        ped.tipoEnvio = 14;
      } else if (this.form.controls.envio.value === 'rapido') {
        ped.tipoEnvio = 15;
      }

      this.pedidoService.insertPedido(ped).subscribe((response) => {
        if (response) {
          this.toastr.success(response.message, 'ACCIÓN COMPLETADA CORRECAMENTE', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
          this.productosCesta = [];
          localStorage.removeItem('carrito');
          this.desplegableGestionPedido = false;
          this.form.reset();
          this.precioTotal = 0
        }
        this.spinner.hide();
      }, (error) => {
        this.toastr.error(error.error.message, 'ERROR', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      });
    } else {
      this.toastr.error('Algo salió mal', 'ERROR', {
        timeOut: 3000, positionClass: 'toast-top-center'
      });
    }

  }

  calcularFecha(tipoEnvio: number): Date {
    const hoy = new Date();
    const diaEnvio = new Date(hoy);
    diaEnvio.setDate(hoy.getDate() + tipoEnvio);
    return diaEnvio;
  }

  navigateToCatalogo(): void {
    this.router.navigate(['/catalogo']);
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'AZ68N-OSOATVCVQPS198NbiOek4uSjEG04COlojOpvorkqYrTgQ7HJtIl9cAQz7tmctoGNhR3EK-skLS',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'EUR',
            value: this.precioTotal.toString(),
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: this.precioTotal.toString(),
              }
            }
          },
          items: this.getItemsList()
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        this.spinner.show();
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });

      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.spinner.hide();
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);

      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      }
    };
  }

  getItemsList(): any[] {
    const items: any[] = [];
    let item = {};
    this.productosCesta.forEach((it: Producto) => {
      item = {
        name: it.nombre,
        quantity: it.cantidadProductoPedido,
        unit_amount: { value: it.precio, currency_code: 'EUR' }
      };
      items.push(item);
    });
    return items;
  }
}
