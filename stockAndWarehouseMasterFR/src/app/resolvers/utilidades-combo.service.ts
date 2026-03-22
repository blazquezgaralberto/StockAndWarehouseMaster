import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Utilidad } from "../utils/model/utilidades";
import { AlmacenService } from "../almacen/service/almacen.service";

@Injectable({
    providedIn: 'root'
})
export class UtilidadesComboResolver {

    constructor(private readonly service: AlmacenService){
    }

    resolve(utilidad: number): Observable<Utilidad[]>{
        return this.service.getDesplegables(utilidad);
    }
}
