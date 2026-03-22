import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { Utilidad } from "../../utils/model/utilidades";
import { Almacen } from "../model/almacen";
import { SERVER_LOCAL, SERVER_USAL } from "../../utils/model/constantes";

@Injectable({
    providedIn: 'root'
  })
export class AlmacenService{

    private productoURL = SERVER_USAL + '/api/almacen/';

    constructor(private httpClient : HttpClient) { }

    public getDesplegables(utilidad: number):Observable<Utilidad[]>{
        return this.httpClient.post<Utilidad[]>(this.productoURL + 'getDesplegables', utilidad);
    }


    public insertAlmacen(insertAlmacen: Almacen): Observable<any> {
        return this.httpClient.post<any>(this.productoURL + 'newAlmacen',insertAlmacen);
    }

    public lista(): Observable<Almacen[]> {
        return this.httpClient.get<Almacen[]>(this.productoURL + 'listaAlmacenesActivos');
    }

    public listaTodos(): Observable<Almacen[]> {
        return this.httpClient.get<Almacen[]>(this.productoURL + 'listaCompletaAlmacenes');
    }

    public detail(id: number): Observable<Almacen> {
        return this.httpClient.get<Almacen>(this.productoURL + `detail/${id}`);
    }


}
