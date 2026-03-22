import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SERVER_LOCAL, SERVER_USAL } from "../../utils/model/constantes";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private authenticationURL = SERVER_USAL + '/api/auth/';

    constructor(private httpClient: HttpClient) { }

    signup(name: string, username: string, password: string, email: string) {
        var roles = ["user"];
        var nuevoUsuario = {
            name, username, password, email, roles: roles
        };

        console.table(nuevoUsuario)
        return this.httpClient.post(this.authenticationURL + 'signup', nuevoUsuario);
    }

    login(username: string, password: string) {
        var loginUsuarioRegistrado = {
            username, password
        };

        console.table(loginUsuarioRegistrado)
        return this.httpClient.post(this.authenticationURL + 'login', loginUsuarioRegistrado, { observe: 'response' });
    }
}
