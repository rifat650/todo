import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterCeptor implements HttpInterceptor {
   authService: AuthService = inject(AuthService)

   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      const authToken = this.authService.getToken();
      const authRequest= req.clone({
         headers: req.headers.set('authorization',"Bearer "+authToken)
      });


      return next.handle(authRequest)
   }
}