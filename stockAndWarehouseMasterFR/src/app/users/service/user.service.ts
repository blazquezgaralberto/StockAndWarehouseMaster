import { Injectable } from "@angular/core";
import { TokenUsuario } from "../../utils/model/tokenUsuario";

const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUserName';
const AUTHORITIES_KEY = 'AuthAuthorities';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    roles: Array<string> = [];

    isLogged = false;
    admin = false;
    almacen = false;
    fabricante = false;

    constructor() { }

    setToken(token: string): void {
        window.sessionStorage.removeItem(TOKEN_KEY);
        window.sessionStorage.setItem(TOKEN_KEY, token);
    }

    getToken(): string {
        var userAuthToken = sessionStorage.getItem(TOKEN_KEY);
        if (null !== userAuthToken) {
            return userAuthToken;
        }
        return "";
    }

    setUserName(userName: string): void {
        window.sessionStorage.removeItem(USERNAME_KEY);
        window.sessionStorage.setItem(USERNAME_KEY, userName);
    }

    getUserName(): string {
        var userAuthToken = sessionStorage.getItem(USERNAME_KEY);
        if (null !== userAuthToken) {
            return userAuthToken;
        }
        return "username";
    }


    setAuthorities(rolesAuthorities: string[]): void {
        window.sessionStorage.removeItem(AUTHORITIES_KEY);
        window.sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(rolesAuthorities));
    }

    getAuthorities(): string[] {
        var rolesAuthorities = sessionStorage.getItem(AUTHORITIES_KEY);
        this.roles = [];
        if (null !== rolesAuthorities) {
            JSON.parse(rolesAuthorities).forEach((authority: string) => {
                this.roles.push(authority);
            });
        }
        return this.roles;
    }

    getRoleAuth() {
        const info = sessionStorage.getItem(AUTHORITIES_KEY);
        var usuario: TokenUsuario;

        if (info != null) {
            usuario = JSON.parse(info);
            this.updateRoles(usuario.roles);
        } else {
            return "";
        }

        if (this.admin) {
            return "Admin";
        }

        if (this.almacen) {
            return "Alamcen";
        }

        if (this.fabricante) {
            return "Fabricante";
        }

        if (this.isLogged) {
            return "User";
        }

        return "";
    }

    updateRoles(newValue: string[]) {

        for (let i = 0; i < newValue.length; i++) {
            switch (newValue[i]) {
                case 'ROLE_USER':
                    this.isLogged = true;
                    break;
                case 'ROLE_ADMIN':
                    this.admin = true;
                    break;
                case 'ROLE_ALMACEN':
                    this.almacen = true;
                    break;
                case 'ROLE_FABRICANTE':
                    this.fabricante = true;
                    break;
                default:
                    break;
            }
        }
    }

    public deleteSession(): void {
        this.isLogged = false;
        this.admin = false;
        this.fabricante = false;
        this.almacen = false;
        sessionStorage.clear();
        window.sessionStorage.clear();
    }

}
