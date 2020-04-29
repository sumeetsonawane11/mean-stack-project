import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  'providedIn': 'root'
})

export class AuthInterceptorService implements HttpInterceptor {
  constructor(public authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler){
    const authToken = this.authService.getToken();
    const authRequest = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' +authToken) // This will override the Authorization header value
    });
    
    return next.handle(authRequest);
  }
}
