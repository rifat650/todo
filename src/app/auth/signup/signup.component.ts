import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit,OnDestroy {

  private authStatusSub:Subscription;
  isLoading = false;
  authService=inject(AuthService);
  onSignUp(form: NgForm) {
    if(form.invalid){
      return;
    }
this.isLoading=true;
    this.authService.createUser(form.value.email, form.value.password)
  }

  ngOnInit() {

   this.authStatusSub=this.authService.getAuthStatusListener().subscribe({
    next:(authStatus)=>{
      this.isLoading=false;
    }
   }) 
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe()
  }
}
