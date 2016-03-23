import {Injectable} from 'angular2/core';
@Injectable()
export class AuthTokenService {
    private store;
    private key;

    constructor() {
        this.store = window.localStorage;
        this.key = 'auth-token';
    }

    getToken() {
        return this.store.getItem(this.key);
    }

    setToken(token = null) {
        if (token)
            this.store.setItem(this.key, token);
        else
            this.store.removeItem(this.key);
    }
}
