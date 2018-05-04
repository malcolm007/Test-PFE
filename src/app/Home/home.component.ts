import {Component, ViewEncapsulation, OnInit} from '@angular/core'
import { JwtHelper } from 'angular2-jwt';
import { Global } from '../login/global.service';

@Component({
    selector:'home-app',
    templateUrl:'./home.component.html',
    styleUrls: [
         './home.component.css'       
]
})

export class HomeComponent implements OnInit{
    ngOnInit(): void {
       
    }
    
    
    


}