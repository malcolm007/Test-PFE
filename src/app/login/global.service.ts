import { Http, RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { User } from './../users/user.model';
import { Injectable } from "@angular/core";
import { JwtHelper } from "angular2-jwt";


@Injectable()
export class Global{

    
    jwtToken : string;
    currentUser : User;
    roles: Array<any>=[];
    id_user: string;
    user_name: string;
    user_LastName: string;
    user_mail: string;

    constructor(private http: Http)
    {
        if(localStorage.getItem('token')){
            this.jwtToken = localStorage.getItem('token');
            let jwtHelper: JwtHelper = new JwtHelper();
            this.roles = jwtHelper.decodeToken(this.jwtToken).roles;
            this.id_user = jwtHelper.decodeToken(this.jwtToken).id;
            this.user_name = jwtHelper.decodeToken(this.jwtToken).nom;
            this.user_LastName = jwtHelper.decodeToken(this.jwtToken).prenom;
            this.user_mail = jwtHelper.decodeToken(this.jwtToken).sub;
        }
    }

    saveToken(token){
        this.jwtToken = token;
        localStorage.setItem('token',this.jwtToken);
        let jwtHelper: JwtHelper = new JwtHelper();
        this.roles = jwtHelper.decodeToken(this.jwtToken).roles;
        this.id_user = jwtHelper.decodeToken(this.jwtToken).id;
        localStorage.setItem('IdUser',this.id_user);
        this.user_name = jwtHelper.decodeToken(this.jwtToken).nom;
        this.user_LastName = jwtHelper.decodeToken(this.jwtToken).prenom;
        this.user_mail = jwtHelper.decodeToken(this.jwtToken).sub;
        sessionStorage.setItem('IdUser',this.id_user);
    }

    saveCurrentUser(user)
    {
        this.currentUser = user;
    }

    logout()
    {
        localStorage.removeItem('token');
        sessionStorage.removeItem('IdUser');
        this.jwtToken=null;
        this.roles = null;
        window.location.href="/login";
    }

    isAdmin()
    {
        for(let r of this.roles)
            if(r.authority =='ADMIN') return true;
        return false;
    }

    connected()
    {
        if(sessionStorage.getItem('IdUser'))
            return true;
        else return false;
    }


    getUserName()
    {
        return this.user_name;
    }
    getUserLastName()
    {
        return this.user_LastName;
    }

    getRole()
    {
        return this.roles[0].authority;
    }

    getUserId()
    {
        return this.id_user;
    }
}