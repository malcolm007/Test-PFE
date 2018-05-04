import { Component } from "@angular/core";
import { Global } from "../login/global.service";


@Component({
selector : 'Header-app',
templateUrl : './header.component.html',
styleUrls: ['./header.component.css']

})

export class HeaderComponent{
    constructor(public global: Global)
    {

    }
} 