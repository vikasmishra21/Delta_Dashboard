import { Injectable } from '@angular/core';
import { Router,CanActivate } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{
  constructor(private route:Router) { }
  canActivate():boolean{
    const EncCode:any = sessionStorage.getItem('x-rc-project_auth_token');
    let userDetail = JSON.parse(atob(EncCode.split('.')[1]));
    if(userDetail.Roleid == 16){
      this.route.navigate(['home/Overallsnapshot']);
      return false;
    }
    return true;
  }
}
