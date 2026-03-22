import { Almacen } from "src/app/almacen/model/almacen";
import { Producto } from "../../productos/model/producto";

export class Pedido {
    id!: number;
    idUsuario!: number;
    nombre!: string;
    precioFinal!: number;
    fechaPedido!: Date;
    fechaEntrega?: Date;
    fechaDevolucion?: Date;
    direccionEntrega!: string;
    codigoPostal!: number;
    telefono!: string;
    observaciones?: string | null;
    estado!: number;
    estadoString!: string;
    tipoEnvio!: number;
    tipoEnvioString!: string;
    
    listaAlmacenesProducto?:Almacen[];
    listaProductos!: Producto[];
}