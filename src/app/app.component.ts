import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
authService=inject(AuthService)
ngOnInit() {
  this.authService.autoAuthUser()
}
}
