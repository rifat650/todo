import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit,OnDestroy {
  userIsAuthenticated=false;
authService:AuthService=inject(AuthService);
private authListenerSubs:Subscription;
ngOnInit() {
  this.userIsAuthenticated=this.authService.getIsAuth()
  this.authListenerSubs=this.authService.getAuthStatusListener().subscribe((isAuthenticated)=>{
this.userIsAuthenticated=isAuthenticated
  })

}

ngOnDestroy(){
  this.authListenerSubs.unsubscribe()
}

  onLogout(){
    this.authService.logOut()
  }
}
