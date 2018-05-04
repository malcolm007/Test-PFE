import { Component } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';
import { Global } from '../login/global.service';


@Component({
    selector:'nav-app',
    templateUrl:'./nav.component.html',
    styleUrls: ['./nav.component.css']

})

export class NavComponent{

    constructor(public global: Global){
           
    }

    
}