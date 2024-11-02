import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit,OnDestroy {
  authService:AuthService=inject(AuthService)
isLoading=false;
  private authStatusSub: Subscription;
onLogin(form:NgForm){
  if(form.invalid){
    return;
  }
  this.isLoading=true;
  this.authService.login(form.value.email,form.value.password);
}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe({
      next: (authStatus) => {
        this.isLoading = false;
      }
    })
  };


  ngOnDestroy() {
    this.authStatusSub.unsubscribe()
  }

}
