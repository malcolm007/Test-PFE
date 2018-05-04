import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import {Project} from './project.model';
import { Http, RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { Global } from '../login/global.service';
import { User } from '../users/user.model';
import { Role } from '../diagramRole/role.model';


@Component({
    selector: 'projectList-app',
    templateUrl: './projectList.component.html',
    styleUrls: ['./projectList.component.css'],
})
export class ProjectListComponent implements OnInit {

  reload_page: boolean = false;
  projects: Project[];
  active_project: Project = new Project();
  add_project: Project = new Project();
  users: User[];
  roles: Role[];
  id_role: number;
  id_user: number;

  constructor(private http : Http , private global: Global) { 
    this.getAll();
  }
  
  ngOnInit() {
    $.getScript('./assets/select2.js');
    this.getUsers();
    this.getRoles();
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
        this.http.get('http://localhost:8080/api/'+this.global.getUserId()+'/projects',options)
        .subscribe(Response =>{
            this.projects = Response.json();
            this.reload_page=true;
        })
    }
    getRoles()
    {
        let headers = new Headers({
            'Authorization': this.global.jwtToken
        });
        let options = new RequestOptions({ headers: headers });
        this.http.get('http://localhost:8080/api/projets/role',options)
        .subscribe(Response =>{
            this.roles = Response.json();
        })
    }
    share()
    {
        var user = $('#users').val();
        var role = $('#roles').val();
        let body = new URLSearchParams();
        body.set('user',user+'');
        body.set('projet',this.active_project.id);
        body.set('role',role+'');
        let headers = new Headers({
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.global.jwtToken
        });
        let options = new RequestOptions({ headers: headers });
        this.http.post('http://localhost:8080/api/affectation/projet',body.toString(),options)
        .subscribe(response =>{
            this.getAll();
            $('#closeButtonShare').click();
        });
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
    add()
    {
        console.log(this.add_project.name);
        let body = new URLSearchParams();
        body.set('name',this.add_project.name);
        body.set('description',this.add_project.description);
        body.set('user',this.global.getUserId());
        let headers = new Headers({
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization':localStorage.getItem('token')
        });
        let options = new RequestOptions({ headers: headers });
        this.http.post('http://localhost:8080/api/projects',body.toString(),options)
        .subscribe(response =>{
            this.getAll();
            $('#closeButtonAdd').click();
        });
    }

    load(project)
    {
        this.active_project.id = project.id;
        this.active_project.name = project.name;
        this.active_project.description = project.description;
    }

    update()
    {
        console.log(this.active_project.name +' '+this.active_project.description+' '+this.active_project.id);
        let body = new URLSearchParams();
        body.set('name',this.active_project.name);
        body.set('description',this.active_project.description);
        let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization':localStorage.getItem('token')
        });
        let options = new RequestOptions({ headers: headers });
        this.http.put('http://localhost:8080/api/projects/'+this.active_project.id,body.toString(),options)
        .subscribe(response =>{
            console.log(response.json());
            this.getAll();
            $('#closeButtonUpdate').click();
        });
    }

    

    delete()
    {
        let headers = new Headers({
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization':localStorage.getItem('token')
        });
        let options = new RequestOptions({ headers: headers });
        this.http.delete('http://localhost:8080/api/projects/'+this.active_project.id,options)
        .subscribe(response =>{
            this.getAll();
            $('#closeButtonDelete').click();
        });
    }

    verifierEditMetaData(diagram: Project){
        if(diagram.user.id === this.global.getUserId()  )
            return true;
        for(let i=0 ; i<diagram.affectations.length ; i++)
        {
            for(let j = 0 ; j<diagram.affectations[i].role.droits.length ; j++)
                if(diagram.affectations[i].role.droits[j].droit.name == "EDIT_METADATA")
                    return true;
        }
        return false;
    }

    verifierDelete(diagram: Project)
    {
        if(diagram.user.id === this.global.getUserId()  )
            return true;
        for(let i=0 ; i<diagram.affectations.length ; i++)
        {
            for(let j = 0 ; j<diagram.affectations[i].role.droits.length ; j++)
                if(diagram.affectations[i].role.droits[j].droit.name == "DELETE")
                    return true;
        }
        return false;
    }

    verifierRead(diagram: Project)
    {
        if(diagram.user.id == this.global.getUserId())
            return true;
        for(let i=0 ; i<diagram.affectations.length ; i++)
        {
            for(let j = 0 ; j<diagram.affectations[i].role.droits.length ; j++)
                if(diagram.affectations[i].role.droits[j].droit.name == "READ")
                    return true;
        }
        return false;
    }

    verifierShare(diagram: Project)
    {
        if(diagram.user.id == this.global.getUserId())
            return true;
        return false;
    }

}