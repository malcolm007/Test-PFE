import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Global } from './global.service';

@Injectable()
export class AuthGuard implements CanActivate {

  
  constructor(private global: Global , private router: Router) { }

  canActivate() {
    if(this.global.connected())
      return true;
    
      this.router.navigate(['/login']);
      return false;
  }
}
