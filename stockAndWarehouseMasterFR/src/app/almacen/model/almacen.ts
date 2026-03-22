import { Producto } from "../../productos/model/producto";

export class Almacen {
    id!: number;
    nombre!: string;
    ubicacion!: string;
    activo!:boolean;
    userId!:number;

    listaProductos!: Producto[];
}