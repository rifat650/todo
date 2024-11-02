import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
@Injectable()
export class AuthGuard implements CanActivate{
   router=inject(Router);
authService=inject(AuthService);
 canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean | Observable<boolean> | Promise <boolean> {
  const isAuth=this.authService.getIsAuth();

  if(!isAuth){
this.router.navigate(['/auth/login'])
  }
   return isAuth;
 }

}