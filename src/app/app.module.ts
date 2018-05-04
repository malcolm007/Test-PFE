import { AuthGuard } from './login/auth-guard.service';
import { Global } from './login/global.service';
import { LoginComponent } from './login/login.component';
import { DiagramRoleComponent } from './diagramRole/diagramRole.component';
import { DiagramDetailComponent } from './diagramDetail/diagramDetail.component';
import { ProjectListComponent } from './projectList/projectList.component';
import { SettingsComponent } from './settings/settings.component';
import { Component } from '@angular/core';
import { EditorComponent } from './Editor/editor.component';
import { ProjectDetailComponent } from './projectDetail/projectDetail.component';
import { FooterComponent } from './Footer/footer.component';
import { NavComponent } from './Navigation/nav.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import { HeaderComponent } from './Header/header.component';
import { DataTablesModule } from 'angular-datatables';
import * as $ from 'jquery';
import { HomeComponent } from './Home/home.component';
import { UserComponent } from './users/user.component';
import {HttpModule} from '@angular/http'
import { FormsModule } from '@angular/forms';
import { ProjectRoleComponent } from './projectRole/projectRole.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavComponent,
    FooterComponent,
    ProjectDetailComponent,
    EditorComponent,
    HomeComponent,
    SettingsComponent,
    ProjectListComponent,
    DiagramDetailComponent,
    UserComponent,
    DiagramRoleComponent,
    ProjectRoleComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,DataTablesModule,FormsModule,
    RouterModule.forRoot([
      {path: 'editor/:id' , component: EditorComponent ,canActivate: [AuthGuard]},
      {path: 'login' , component: LoginComponent},
      {path: '' , component: HomeComponent,canActivate: [AuthGuard],
        children :[
          {
            path: 'home',
            component: ProjectListComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'projectDetail/:id_project',
            component: ProjectDetailComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'DiagramDetail/:id_diagram',
            component: DiagramDetailComponent,
            canActivate: [AuthGuard]
          },
          {
            path :'settings',
            component : SettingsComponent,
            canActivate: [AuthGuard]
          },
          {
            path :'users',
            component : UserComponent,
            canActivate: [AuthGuard]
          },
          {
            path :'diagramRole',
            component : DiagramRoleComponent,
            canActivate: [AuthGuard]
          },
          {
            path :'projectRole',
            component : ProjectRoleComponent,
            canActivate: [AuthGuard]
          }
      ]
    
    }
    ]),HttpModule
  ],
  providers: [Global, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
