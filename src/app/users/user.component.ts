import { User } from './user.model';
import { Component } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';

@Component({
    selector : 'user-app',
    templateUrl:'./user.component.html'
})
export class UserComponent{
    reload_page: boolean = false;
    users: User[];
    active_user: User = new User();
    constructor(private http : Http ){
        this.getAll();
    }
    getAll()
    {
        this.reload_page=false;
        let headers = new Headers({
            'Authorization':localStorage.getItem('token')
        });
        let options = new RequestOptions({ headers: headers });
        this.http.get('http://localhost:8080/api/users',options)
        .subscribe(Response =>{
            this.users = Response.json();
            this.reload_page=true;
        })
    }
    reload()
    {
        return this.reload_page;
    }
    
    submit(f,nom, prenom , email , password)
    {
        let body = new URLSearchParams();
        body.set('nom',nom.value);
        body.set('prenom',prenom.value);
        body.set('mail',email.value);
        body.set('password',password.value);
        let headers = new Headers({
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization':localStorage.getItem('token')
        });
        let options = new RequestOptions({ headers: headers });
        this.http.post('http://localhost:8080/api/users',body.toString(),options)
        .subscribe(response =>{
            this.getAll();
            $('#closeButtonAdd').click();
        });
    }

    load(user)
    {
        this.active_user.id = user.id;
        this.active_user.nom = user.nom;
        this.active_user.prenom = user.prenom;
        this.active_user.mail = user.mail;
        this.active_user.password = user.password;
    }

    update(f,nomUpdate,prenomUpdate,mailUpdate,idUpdate)
    {
        let body = new URLSearchParams();
        body.set('nom',(nomUpdate.value!=="" ? nomUpdate.value : this.active_user.nom));
        body.set('prenom',(prenomUpdate.value!=="" ? prenomUpdate.value : this.active_user.prenom));
        body.set('mail',(mailUpdate.value!=="" ? mailUpdate.value : this.active_user.mail));
        let headers = new Headers({
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization':localStorage.getItem('token')
        });
        let options = new RequestOptions({ headers: headers });
        this.http.put('http://localhost:8080/api/users/'+this.active_user.id,body.toString(),options)
        .subscribe(response =>{
            this.getAll();
            $('#closeButtonUpdate').click();
        });
    }

    delete(f)
    {
        let headers = new Headers({
            'Authorization':localStorage.getItem('token')
        });
        let options = new RequestOptions({ headers: headers });
        this.http.delete('http://localhost:8080/api/users/'+this.active_user.id,options)
        .subscribe(response =>{
            this.getAll();
            $('#closeButtonDelete').click();
        });
    }
}