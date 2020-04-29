import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state:RouterStateSnapshot): boolean  | Promise<boolean> | Observable<boolean>{
    const isAuth = this.authService.getAuth();
    if(!isAuth){
      this.router.navigate(['/auth/login']);
    }
    return true;
  }
}
