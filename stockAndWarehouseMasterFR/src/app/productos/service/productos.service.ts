import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Producto } from "../model/producto";
import { Observable } from "rxjs";
import { SERVER_LOCAL, SERVER_USAL } from "../../utils/model/constantes";

@Injectable({
    providedIn: 'root'
})
export class ProductosService {

    private productoURL = SERVER_USAL + '/api/producto/';

    constructor(private httpClient: HttpClient) { }

    public insertProducto(formData: FormData): Observable<any> {
        return this.httpClient.post<any>(this.productoURL + 'newProducto', formData);
    }

    public updateProducto(producto: Producto): Observable<any> {
        return this.httpClient.post<any>(this.productoURL + 'update', producto);
    }

    public lista(): Observable<Producto[]> {
        return this.httpClient.get<Producto[]>(this.productoURL + 'listaProductos');
    }

    public listaFabrica(username: string): Observable<Producto[]> {
        return this.httpClient.get<Producto[]>(this.productoURL + `listaProductosFabrica/${username}`);
    }

    public detail(id: number): Observable<Producto> {
        return this.httpClient.get<Producto>(this.productoURL + `detail/${id}`);
    }

    public delete(prod: Producto): Observable<any> {
        return this.httpClient.post<any>(this.productoURL + 'deleteProducto', prod);
    }

    public darStock(prod: Producto): Observable<any> {
        return this.httpClient.post<any>(this.productoURL + 'darStockAlmacen', prod);
    }

}
