import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UsuariosDetailsService } from "../usuarios-detail/service/usuarios-detail.service";
import { Role } from "../users/model/usuario";

@Injectable({
    providedIn: 'root'
})
export class RolesUserComboResolver {

    constructor(private readonly service: UsuariosDetailsService){
    }

    resolve(): Observable<Role[]>{
        return this.service.getComboRoles();
    }
}
