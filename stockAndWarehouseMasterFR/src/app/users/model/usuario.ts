import { Pedido } from "../../pedidos/model/pedido";
import { Producto } from "../../productos/model/producto";

export interface Usuario {
    id: number;
    nombre: string;
    username: string;
    contrasena: string;
    email: string;
    telefono: string;
    fechaAlta: Date;
    roles: Role[];
    photo?: Uint8Array;

    ubicacion: string;

    productosCesta: Producto[];
    listadoPedidos: Pedido[];
}

export interface Role {
    name : string;
}
