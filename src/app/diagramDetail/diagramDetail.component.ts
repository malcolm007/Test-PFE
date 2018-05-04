import { AffectationDiagram } from './affectation.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http, RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { Diagram } from '../projectDetail/diagram.model';
import { Role } from '../diagramRole/role.model';

@Component({
    selector:'diagramDetail-app',
    templateUrl:'./diagramDetail.component.html',
    styleUrls:['./diagramDetail.component.css']
})

export class DiagramDetailComponent implements OnInit{

    reload_page: boolean = false;
    active_diagram : Diagram;
    affectations: AffectationDiagram[];
    active_affectation: AffectationDiagram = new AffectationDiagram();
    roles: Role[];
    id_role: number;

    constructor(private route: ActivatedRoute , private http : Http)
    {
        
    }
    ngOnInit(){
        this.route.paramMap.subscribe(params => {
            let id = +params.get('id_diagram');
            
            this.getDiagramById(id);
            this.getRoles();
       });
    }
    getRoles()
    {
        let headers = new Headers({
            'Authorization':localStorage.getItem('token')
        });
        let options = new RequestOptions({ headers: headers });
        this.http.get('http://localhost:8080/api/diagramme/role',options)
        .subscribe(Response =>{
            this.roles = Response.json();
        })
    }
    getDiagramById(id)
    {
        let headers = new Headers({
            'Authorization':localStorage.getItem('token')
        });
        let options = new RequestOptions({ headers: headers });
        this.http.get('http://localhost:8080/api/diagrammes/'+id,options)
        .subscribe(Response =>{
            this.active_diagram = Response.json();
           
            this.getAffectationsByDiagram();
           
        })
    }

    reload()
  {
      return this.reload_page;
  }

    getAffectationsByDiagram()
    {
        let headers = new Headers({
            'Authorization':localStorage.getItem('token')
        });
        let options = new RequestOptions({ headers: headers });
        this.http.get('http://localhost:8080/api/affectation/diagramme/'+this.active_diagram.id,options)
        .subscribe(Response =>{
            this.affectations = Response.json();
            this.reload_page = true;
        })
    }

    load(affectation)
    {
        this.active_affectation.id = affectation.id;
        this.active_affectation.role = affectation.role;
        this.active_affectation.user = affectation.user;
    }

    update()
    {
        var role = $('#roles').val();
        console.log(role+' ');
        let body = new URLSearchParams();
        body.set('role',role+'');
        let headers = new Headers({
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization':localStorage.getItem('token')
        });
        let options = new RequestOptions({ headers: headers });
        this.http.put('http://localhost:8080/api/affectation/diagramme/'+this.active_affectation.id,body.toString(),options)
        .subscribe(response =>{
            console.log(response);
            this.reload_page = false;
            this.getAffectationsByDiagram();
            $('#closeButtonUpdate').click();
        });
    }

    delete()
    {
        let headers = new Headers({
            'Authorization':localStorage.getItem('token')
        });
        let options = new RequestOptions({ headers: headers });
        this.http.delete('http://localhost:8080/api/affectation/diagramme/'+this.active_affectation.id,options)
        .subscribe(response =>{
            this.reload_page = false;
            this.getAffectationsByDiagram();
            $('#closeButtonDelete').click();
        });
    }
}