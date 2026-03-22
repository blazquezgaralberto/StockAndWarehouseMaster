import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { Pedido } from "../model/pedido";
import { SERVER_LOCAL, SERVER_USAL } from "../../utils/model/constantes";

@Injectable({
    providedIn: 'root'
})
export class PedidosService {

    private pedidoURL = SERVER_USAL + '/api/pedido/';

    constructor(private httpClient: HttpClient) { }

    public insertPedido(insertPedido: Pedido): Observable<any> {
        return this.httpClient.post<any>(this.pedidoURL + 'newPedido',insertPedido);
    }

    public getPedidosByUsername(username: String): Observable<Pedido[]> {
        return this.httpClient.get<Pedido[]>(this.pedidoURL + `listaPedidosUsuario/${username}`);
    }

    public getPedidosUserAlmacen(username: String): Observable<Pedido[]> {
        return this.httpClient.get<Pedido[]>(this.pedidoURL + `listaPedidosAlmacen/${username}`);
    }

    public getAllPedidos(): Observable<Pedido[]> {
        return this.httpClient.get<Pedido[]>(this.pedidoURL + 'listaPedidosTotales');
    }

    public detail(id: number): Observable<Pedido> {
        return this.httpClient.get<Pedido>(this.pedidoURL + `detail/${id}`);
    }

    public aceptarPedido(pedidoAceptar: Pedido): Observable<any> {
        return this.httpClient.post<any>(this.pedidoURL + 'aceptarPedido',pedidoAceptar);
    }
}
