import { Http, RequestOptions, Headers } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import { Global } from '../login/global.service';

@Component({
    selector: 'settings-app',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
    
    name:string="";
    lastName: string="";
    email: string="";
    password:string="";
    repPassword:string="";
    verifier:boolean = false;


    constructor(private global : Global , private http: Http)
    {
        this.name = global.user_name;
        this.lastName = global.user_LastName;
        this.email = global.user_mail;
    }
    
    ngOnInit(){
        
    }

    verifierPassword()
    {
        if(this.password == "" && this.repPassword == "")
            this.verifier= true;
        else if(this.password != this.repPassword)
            this.verifier= true;
        else if(this.password == this.repPassword)
            this.verifier= false;
    }

    resetPanel()
    {
       this.verifier = false;
    }
    
    savePassword()
    {
        this.resetPanel();
        this.verifierPassword();
        if( !this.verifier)
        {
            let body = new URLSearchParams();
            body.set('password',this.password);
           let headers = new Headers({
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization':localStorage.getItem('token')
            });
            let options = new RequestOptions({ headers: headers });
            this.http.put('http://localhost:8080/api/users/password/'+this.global.id_user,body.toString(),options)
            .subscribe(result=>{
                $('#success').delay(5000).show().fadeOut('slow');
                this.password="";
                this.repPassword="";
            });
        }
    }

    saveChange()
    {
        let body = new URLSearchParams();
        body.set('nom',this.name);
        body.set('prenom',this.lastName);
        body.set('mail',this.email);
        
        let headers = new Headers({
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization':localStorage.getItem('token')
        });
        let options = new RequestOptions({ headers: headers });
        this.http.put('http://localhost:8080/api/users/connected/'+this.global.id_user,body.toString(),options)
        .subscribe(result=>{
            this.global.saveToken(result.text());
            $('#success1').delay(5000).show().fadeOut('slow');
        });
    }

}