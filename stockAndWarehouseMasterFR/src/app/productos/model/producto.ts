export class Producto {
    id!: number;
    nombre!: string;
    precio!: number;
    stock!: number;
    idFabricante!: number;
    disponible!: boolean;
    categoria!: number;
    photo?: Uint8Array;
    categoriaString?: string;
    descripcion!: string;

    idAlmacen?:number;
    stockParaAlmacen?:number;

    cantidadProductoPedido!: number;
    precioCantidadTotal!: number;
}
