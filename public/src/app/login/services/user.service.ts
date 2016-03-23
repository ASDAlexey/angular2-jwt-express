import {Injectable} from 'angular2/core';
import {Http, Headers} from "angular2/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx'
import {AppSettings} from "../../app.settings";
import {AuthTokenService} from "./auth-token.service";
@Injectable()
export class UserService {
    constructor(private _http:Http, private _authTokenService:AuthTokenService) {
    }

    getPosts():Observable<any> {
        return this._http.get('http://jsonplaceholder.typicode.com/posts')
            .map(res => res.json())
    }

    login(user:{username:string,password:string}):Observable<any> {
        const body = JSON.stringify(user);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(`${AppSettings.API_URL}/login`, body, {
            headers: headers
        }).map((res)=> {
            this._authTokenService.setToken(res.json().token);
            return res.json();
        })
    }

    logout() {
        this._authTokenService.setToken();
    }

    getUser(){
        if (this._authTokenService.getToken()) {
            return this._http.get(AppSettings.API_URL + '/me')
        } else {
            return $q.reject({data: 'Client has no auth token'});
        }
    }
}
