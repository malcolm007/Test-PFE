import { Droit } from './../diagramRole/Droit.model';
import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { Role } from '../diagramRole/role.model';


@Component({
    selector: 'projectRole-app',
    templateUrl:'./projectRole.component.html'
})

export class ProjectRoleComponent implements OnInit{


    add_role : Role = new Role();
    active_role : Role = new Role();
    reload_page: boolean = false;
    roles : Role[];
    loadedDroits : Droit[];
    readDroit: boolean;
    deleteDroit: boolean;
    updateDroit: boolean;
    createDroit: boolean;
    readDroitUpdate: boolean;
    deleteDroitUpdate: boolean;
    updateDroitUpdate: boolean;
    createDroitUpdate : boolean;


    constructor(private http : Http){
        this.loadDroits();
        this.getAll();
    }

    ngOnInit()
    {

    }

    loadDroits()
    {
        let headers = new Headers({
            'Authorization':localStorage.getItem('token')
        });
        let options = new RequestOptions({ headers: headers });
        this.http.get('http://localhost:8080/api/projets/droit',options)
        .subscribe(Response =>{
            this.loadedDroits = Response.json();
        })
    }

    load(role)
    {
        this.active_role.id = role.id;
        this.active_role.name = role.name;
        this.active_role.droits = role.droits;

        this.deleteDroitUpdate = false;
        this.readDroitUpdate = false;
        this.updateDroitUpdate= false;
        this.createDroitUpdate = false;    
        console.log(this.active_role.droits);
        for(var i=0 ; i<this.active_role.droits.length ; i++)
        {
            if(this.active_role.droits[i].droit.name === "DELETE")
            {
                console.log("DELETE TRUE");
                this.deleteDroitUpdate = true;
            }
            else if(this.active_role.droits[i].droit.name === "READ")
            {
                console.log("READ TRUE");
                this.readDroitUpdate = true;
            }
            else if(this.active_role.droits[i].droit.name === "EDIT_METADATA")
            {
                console.log("EDIT_METADATA TRUE");
                this.updateDroitUpdate= true;
            }
            else if(this.active_role.droits[i].droit.name === "CREATE_DIAGRAM")
            {
                console.log("CREATE_DIAGRAM TRUE");
                this.createDroitUpdate = true;
            }

            console.log(this.active_role.id);
            console.log("DELETE : "+this.deleteDroitUpdate);
            console.log("READ : "+this.readDroitUpdate);
            console.log("EDIT : "+this.updateDroitUpdate);
            console.log("CREATE : "+this.createDroitUpdate);
        }
    }

    getDroits()
    {
        var droit:number[]=[];
        if(this.readDroit)
        {
            droit.push(this.getIdDroitByName("READ"));
        }
        if(this.createDroit)
        {
            droit.push(this.getIdDroitByName("CREATE_DIAGRAM"));
        }
        if(this.updateDroit)
        {
            droit.push(this.getIdDroitByName("EDIT_METADATA"));
        }
        if(this.deleteDroit)
        {
            droit.push(this.getIdDroitByName("DELETE"));
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
        this.http.get('http://localhost:8080/api/projets/role',options)
        .subscribe(Response =>{
            this.roles = Response.json();
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
        this.http.post('http://localhost:8080/api/projets/role',body.toString(),options)
        .subscribe(response =>{
            this.add_role = response.json();
            this.saveAffectation();
            $('#closeButtonAdd').click();
        });
    }

    saveAffectation()
    {
        var droits = this.getDroits();
        for(var i=0 ; i< droits.length ; i++)
        {
            console.log(droits);
            let body = new URLSearchParams();
            body.set('droit',droits[i]+'');
            body.set('role',this.add_role.id+'');
            let headers = new Headers({
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization':localStorage.getItem('token')
            });
            let options = new RequestOptions({ headers: headers });
            this.http.post('http://localhost:8080/api/projets/roleDroit',body.toString(),options)
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
            this.http.post('http://localhost:8080/api/projets/roleDroit',body.toString(),options)
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
        this.http.delete('http://localhost:8080/api/projets/roleDroit/'+this.active_role.id+'/'+id,options)
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
        this.http.delete('http://localhost:8080/api/projets/roleDroit/'+this.active_role.id,options)
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
        this.http.put('http://localhost:8080/api/projets/role/'+this.active_role.id,body.toString(),options)
        .subscribe(response =>{
            this.updateAll();
            this.getAll();

            $('#closeButtonUpdate').click();
        });
    }

    updateAll()
    {
        if(this.createDroitUpdate === true)
        {
            this.save1Affectation(this.getIdDroitByName("CREATE_DIAGRAM"));
        }
        else {
            this.deleteAffectation(this.getIdDroitByName("CREATE_DIAGRAM"));
        }
        if(this.readDroitUpdate === true)
        {
            this.save1Affectation(this.getIdDroitByName("READ"));
        }
        else {
            this.deleteAffectation(this.getIdDroitByName("READ"));
        }
        if(this.updateDroitUpdate === true)
        {
            this.save1Affectation(this.getIdDroitByName("EDIT_METADATA"));
        }
        else {
            this.deleteAffectation(this.getIdDroitByName("EDIT_METADATA"));
        }
        if(this.deleteDroitUpdate === true)
        {
            this.save1Affectation(this.getIdDroitByName("DELETE"));
        }
        else {
            this.deleteAffectation(this.getIdDroitByName("DELETE"));
        }
    }

    getIdDroitByName(name : string)
    {
        for(var i=0 ; i<this.loadedDroits.length ; i++)
        {
            if(this.loadedDroits[i].name === name)
                return this.loadedDroits[i].id;
        }
        return -1;
    }
}