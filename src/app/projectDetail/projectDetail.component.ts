import { AffectationDiagram } from './../diagramDetail/affectation.model';
import { User } from './../users/user.model';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../projectList/project.model';
import { Diagram } from './diagram.model';
import { Http, RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { DataTableDirective } from 'angular-datatables';
import { Role } from '../diagramRole/role.model';
import { Global } from '../login/global.service';

@Component({
    selector: 'projectDetail-app',
    templateUrl: './projectDetail.component.html',
    styleUrls: ['./projectDetail.component.css']
})
export class ProjectDetailComponent implements OnInit {
    @ViewChild(DataTableDirective)
    private datatableElement: DataTableDirective;
    reload_page_affectations: boolean = false;
    reload_page_diagrams: boolean = false;
    dtOptions: DataTables.Settings = {};
    active_project: Project = new Project();
    affectations: AffectationDiagram[];
    diagrams: Diagram[];
    active_diagram: Diagram = new Diagram();
    add_diagram: Diagram = new Diagram();
    users: User[];
    roles: Role[];
    id_role: number;
    id_user: number;

    constructor(private route: ActivatedRoute , private http : Http ,private global: Global){
        
    }
    
    ngOnInit(){
        $.getScript('./assets/select2.js');
        this.dtOptions = {
            pagingType: 'full_numbers'
          };
          this.route.paramMap.subscribe(params => {
            let id = +params.get('id_project');
            this.getProjectById(id);
            this.getUsers();
            this.getRoles();
       });
    }

    getAffectationsByProjet()
    {
        this.reload_page_affectations = false;
        let headers = new Headers({
            'Authorization':localStorage.getItem('token')
        });
        let options = new RequestOptions({ headers: headers });
        this.http.get('http://localhost:8080/api/affectation/projet/'+this.active_project.id,options)
        .subscribe(Response =>{
            this.affectations = Response.json();
            console.log(this.affectations);
            this.reload_page_affectations = true;
        })
    }

    share()
    {
        var user = $('#users').val();
        var role = $('#roles').val();
        let body = new URLSearchParams();
        body.set('user',user+'');
        body.set('diagramme',this.active_diagram.id);
        body.set('role',role+'');
        let headers = new Headers({
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.global.jwtToken
        });
        let options = new RequestOptions({ headers: headers });
        this.http.post('http://localhost:8080/api/affectation/diagramme',body.toString(),options)
        .subscribe(response =>{
            this.get();
            $('#closeButtonShare').click();
        });
    }
    getRoles()
    {
        let headers = new Headers({
            'Authorization': this.global.jwtToken
        });
        let options = new RequestOptions({ headers: headers });
        this.http.get('http://localhost:8080/api/diagramme/role',options)
        .subscribe(Response =>{
            this.roles = Response.json();
        })
    }

    getUsers()
    {
        let headers = new Headers({
            'Authorization': this.global.jwtToken
        });
        let options = new RequestOptions({ headers: headers });
        this.http.get('http://localhost:8080/api/users/',options)
        .subscribe(Response =>{
            this.users = Response.json();
        })
    }
    reload_affectations()
    {
        return this.reload_page_affectations;
    }
    reload_diagrams()
    {
        return this.reload_page_diagrams;
    }
    getProjectById(id)
    {
        let headers = new Headers({
            'Authorization':localStorage.getItem('token')
        });
        let options = new RequestOptions({ headers: headers });
        this.http.get('http://localhost:8080/api/projects/'+id,options)
        .subscribe(Response =>{
            this.active_project = Response.json();
            this.get();
            this.getAffectationsByProjet();
        })
    }

    get()
    {
        this.reload_page_diagrams=false;
        let headers = new Headers({
            'Authorization':localStorage.getItem('token')
        });
        let options = new RequestOptions({ headers: headers });
        this.http.get('http://localhost:8080/api/'+this.global.id_user+'/diagrammes/project/'+this.active_project.id , options)
        .subscribe(Response =>{
            this.diagrams = Response.json();
            console.log(this.diagrams);
           this.reload_page_diagrams=true;
        })
    }

    add()
    {
        let body = new URLSearchParams();
        body.set('name',this.add_diagram.name);
        body.set('description',this.add_diagram.description);
        body.set('project_id',this.active_project.id);
        body.set('creator',this.global.getUserId());
        let headers = new Headers({
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.global.jwtToken
        });
        let options = new RequestOptions({ headers: headers });
        this.http.post('http://localhost:8080/api/diagrammes',body.toString(),options)
        .subscribe(response =>{
            this.get();
            this.getAffectationsByProjet();
            $('#closeButtonAdd').click();
        });
    }

    update()
    {
        let body = new URLSearchParams();
        body.set('name',this.active_diagram.name);
        body.set('description',this.active_diagram.description);
        let headers = new Headers({
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.global.jwtToken
        });
        let options = new RequestOptions({ headers: headers });
        this.http.put('http://localhost:8080/api/diagrammes/'+this.active_diagram.id,body.toString(),options)
        .subscribe(response =>{
            this.get();
            this.getAffectationsByProjet();
            $('#closeButtonUpdate').click();
        });
    }

    load(diagram)
    {
        this.active_diagram.id = diagram.id;
        this.active_diagram.name = diagram.name;
        this.active_diagram.description = diagram.description;
    }

    delete()
    {
        let headers = new Headers({
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.global.jwtToken
        });
        let options = new RequestOptions({ headers: headers });
        this.http.delete('http://localhost:8080/api/diagrammes/'+this.active_diagram.id,options)
        .subscribe(response =>{
            this.get();
            this.getAffectationsByProjet();
            $('#closeButtonDelete').click();
        });
    }

    verifierOpenInEditor(diagram: Diagram){
        if(diagram.creator.id == this.global.getUserId())
            return true;
        if(diagram.projet.user.id == this.global.getUserId())
            return true;
        for(let i=0 ; i<diagram.affectations.length ; i++)
        {
            for(let j = 0 ; j<diagram.affectations[i].role.droits.length ; j++)
                if(diagram.affectations[i].role.droits[j].droit.name == "WRITE")
                    return true;
        }
        return false;
    }

    verifierEditMetaData(diagram: Diagram){
        if(diagram.creator.id == this.global.getUserId())
            return true;
        if(diagram.projet.user.id == this.global.getUserId())
            return true;
        for(let i=0 ; i<diagram.affectations.length ; i++)
        {
            for(let j = 0 ; j<diagram.affectations[i].role.droits.length ; j++)
                if(diagram.affectations[i].role.droits[j].droit.name == "EDIT_METADATA")
                    return true;
        }
        return false;
    }

    verifierShare(diagram: Diagram)
    {
        if(diagram.creator.id == this.global.getUserId())
            return true;
        return false;
    }

    verifierRead(diagram: Diagram)
    {
        if(diagram.creator.id == this.global.getUserId())
            return true;
        if(diagram.projet.user.id == this.global.getUserId())
            return true;
        for(let i=0 ; i<diagram.affectations.length ; i++)
        {
            for(let j = 0 ; j<diagram.affectations[i].role.droits.length ; j++)
                if(diagram.affectations[i].role.droits[j].droit.name == "READ")
                    return true;
        }
        return false;
    }
}