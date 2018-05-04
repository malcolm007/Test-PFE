import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { Role } from './role.model';


@Component({
    selector: 'diagramRole-app',
    templateUrl:'./diagramRole.component.html'
})

export class DiagramRoleComponent implements OnInit{


    add_role : Role = new Role();
    active_role : Role = new Role();
    reload_page: boolean = false;
    roles : Role[];
    readDroit: boolean;
    writeDroit: boolean;
    updateDroit: boolean;
    readDroitUpdate: boolean;
    writeDroitUpdate: boolean;
    updateDroitUpdate: boolean;


    constructor(private http : Http){
        this.getAll();
    }

    ngOnInit()
    {

    }

    load(role)
    {
        this.active_role.id = role.id;
        this.active_role.name = role.name;
        this.active_role.droits = role.droits;

        this.writeDroitUpdate = false;
        this.readDroitUpdate = false;
        this.updateDroitUpdate= false;

        for(var i=0 ; i<this.active_role.droits.length ; i++)
        {
            if(this.active_role.droits[i].droit.id === 1)
            {
                this.writeDroitUpdate = true;
            }
            if(this.active_role.droits[i].droit.id === 2)
            {
                this.readDroitUpdate = true;
            }
            if(this.active_role.droits[i].droit.id === 3)
            {
                this.updateDroitUpdate= true;
            }
        }
    }

    getDroits()
    {
        var droit:number[]=[];
        if(this.readDroit)
        {
            droit.push(2);
        }
        if(this.writeDroit)
        {
            droit.push(1);
        }
        if(this.updateDroit)
        {
            droit.push(3);
        }

        return droit;
    }
    

    reload()
    {
      return this.reload_page;
    }

    getAll()
    {
        this.reload_page=false;
        let headers = new Headers({
            'Authorization':localStorage.getItem('token')
        });
        let options = new RequestOptions({ headers: headers });
        this.http.get('http://localhost:8080/api/diagramme/role',options)
        .subscribe(Response =>{
            console.log(Response.json());
            this.roles = Response.json();
            console.log(this.roles);
            this.reload_page=true;
        })
    }

    save()
    {
        
        let body = new URLSearchParams();
        body.set('nom',this.add_role.name);
        let headers = new Headers({
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization':localStorage.getItem('token')
        });
        let options = new RequestOptions({ headers: headers });
        this.http.post('http://localhost:8080/api/diagramme/role',body.toString(),options)
        .subscribe(response =>{
            this.add_role = response.json();
            console.log(this.add_role.id);
            this.saveAffectation();
            $('#closeButtonAdd').click();
        });
    }

    saveAffectation()
    {
        var droits = this.getDroits();
        for(var i=0 ; i< droits.length ; i++)
        {
            let body = new URLSearchParams();
            body.set('droit',droits[i]+'');
            body.set('role',this.add_role.id+'');
            let headers = new Headers({
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization':localStorage.getItem('token')
            });
            let options = new RequestOptions({ headers: headers });
            this.http.post('http://localhost:8080/api/diagramme/roleDroit',body.toString(),options)
            .subscribe(response =>{
                this.getAll();
            });
        }
        
    }

    save1Affectation(id)
    {
        
            let body = new URLSearchParams();
            body.set('droit',id+'');
            body.set('role',this.active_role.id+'');
            let headers = new Headers({
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization':localStorage.getItem('token')
            });
            let options = new RequestOptions({ headers: headers });
            this.http.post('http://localhost:8080/api/diagramme/roleDroit',body.toString(),options)
            .subscribe(response =>{
                this.getAll();
            });
        
        
    }

    deleteAffectation(id)
    {
        let headers = new Headers({
            'Authorization':localStorage.getItem('token')
        });
        let options = new RequestOptions({ headers: headers });
        this.http.delete('http://localhost:8080/api/diagramme/roleDroit/'+this.active_role.id+'/'+id,options)
        .subscribe(response =>{
            this.getAll();
        });
    }

    delete()
    {
        let headers = new Headers({
            'Authorization':localStorage.getItem('token')
        });
        let options = new RequestOptions({ headers: headers });
        this.http.delete('http://localhost:8080/api/diagramme/roleDroit/'+this.active_role.id,options)
        .subscribe(response =>{
            this.getAll();
            $('#closeButtonDelete').click();
        });
    }

    update()
    {
        let body = new URLSearchParams();
        body.set('nom',this.active_role.name);
        let headers = new Headers({
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization':localStorage.getItem('token')
        });
        let options = new RequestOptions({ headers: headers });
        this.http.put('http://localhost:8080/api/diagramme/role/'+this.active_role.id,body.toString(),options)
        .subscribe(response =>{
            this.updateAll();
            this.getAll();

            $('#closeButtonUpdate').click();
        });
    }

    updateAll()
    {
        if(this.writeDroitUpdate === true)
        {
            this.save1Affectation(1);
        }
        else {
            this.deleteAffectation(1);
        }
        if(this.readDroitUpdate === true)
        {
            this.save1Affectation(2);
        }
        else {
            this.deleteAffectation(2);
        }
        if(this.updateDroitUpdate === true)
        {
            this.save1Affectation(3);
        }
        else {
            this.deleteAffectation(3);
        }
    }
}