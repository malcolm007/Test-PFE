import { HttpModule, Http } from '@angular/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../users/user.model';
import {JwtHelper} from 'angular2-jwt';
import { Global } from './global.service';


@Component({
    selector: 'login-app',
    templateUrl:'./login.component.html',
    styleUrls:['./login.component.css']
})
export class LoginComponent{

    constructor(private http : Http , private  router: Router , private global : Global)
    {

    }

    email: string;
    password: string;
    isLoggedIn : boolean = true;


    getLoggedIn()
    {
        return this.isLoggedIn;
    }

    login()
    {
        var obj = {'mail':this.email , 'password' : this.password};
        this.http.post('http://localhost:8080/login',obj)
        .subscribe(response =>{
            console.log(response);
            let jwtToken = response.headers.get('authorization');
            if(jwtToken && response.status === 200){
                this.global.saveToken(jwtToken);
                var user : User  = response.json();
                this.global.saveCurrentUser(user);
                this.isLoggedIn = true;
                //this.router.navigate(['/home']);
                window.location.href="/home";
                
            }
            else {
                this.isLoggedIn = false;
            }
        }, error => {
            console.log('error');
            this.isLoggedIn = false;
        });
    }
}