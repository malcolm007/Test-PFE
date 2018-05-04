import { Global } from './login/global.service';
import { Component } from '@angular/core';


var id_user:any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor(public global : Global ){
    id_user = global.id_user;
  }
  title = 'Angular app';
}
