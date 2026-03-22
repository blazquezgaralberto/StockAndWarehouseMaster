import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { Role, Usuario } from "../../users/model/usuario";
import { SERVER_LOCAL, SERVER_USAL } from "../../utils/model/constantes";

@Injectable({
    providedIn: 'root'
  })
export class UsuariosDetailsService{

    private usuariosURL = SERVER_USAL + '/api/users/';

    constructor(private httpClient : HttpClient) { }


    public listadoUsuariosTipo(id: number): Observable<Usuario[]> {
        return this.httpClient.get<Usuario[]>(this.usuariosURL + `listaUsuariosTipo/${id}`);
    }

    public getUserByUsername(username: String): Observable<Usuario> {
        return this.httpClient.get<Usuario>(this.usuariosURL + `userByUsername/${username}`);
    }

    public lista(): Observable<Usuario[]> {
        return this.httpClient.get<Usuario[]>(this.usuariosURL + 'listaUsuarios');
    }

    public getComboRoles():Observable<Role[]>{
        return this.httpClient.get<Role[]>(this.usuariosURL + 'getComboRoles');
    }

    public insertRoles(usuarioCambioRoles: Usuario): Observable<any> {
        return this.httpClient.post<any>(this.usuariosURL + 'changeRoles',usuarioCambioRoles);
    }

    public delete(usuario: Usuario): Observable<any> {
        return this.httpClient.post<any>(this.usuariosURL + 'deleteUsuario', usuario);
    }

    public updateUserPhoto(formData: FormData): Observable<any> {
        return this.httpClient.post<any>(this.usuariosURL + 'updateUserPhoto', formData);
    }

    public updateUser(user: Usuario): Observable<any> {
        return this.httpClient.post<any>(this.usuariosURL + 'update', user);
    }
}
