import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import  { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId: string;
  constructor(private http:HttpClient, private router: Router) { }
  
  getUserId(){
    return this.userId;
  }
  getToken(){
    return this.token;
  }

  getAuth(){
    return this.isAuthenticated;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  autoAuthUser(){// After refreshing the page, check wether token is still valid
    const authInformation = this.getAuthData();
    if( !authInformation ) return;
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if(expiresIn > 0){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.saveAuthTimer(expiresIn / 1000);// converting milliseconds to seconds by dividing by 1000
      this.authStatusListener.next(true);
    }

  }
  createUser(email: string, password: string){
    const authData : AuthData = { email : email , password: password};
    this.http.post(BACKEND_URL +'/signup' , authData)
      .subscribe((response) => {
         this.router.navigate(['/']);
      }, error => {
        this.authStatusListener.next(false);// Telling the whole app that we are not authenticated
      });
  }

  login(email: string, password:string){
    const authData : AuthData = { email : email , password: password};
    this.http.post<{token: string, expiresIn: number, userId: string}>(BACKEND_URL +'login' , authData)
      .subscribe((response) => {
          console.log(response);
          this.token = response.token;
          const expiresInDuration = response.expiresIn;
          this.saveAuthTimer(expiresInDuration);
          if(this.token){
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);
            const currentDate = new Date();
            const expirationDate = new Date(currentDate.getTime() + expiresInDuration * 1000); // Should be passed in milliseconds
            this.saveAuthData(this.token, expirationDate, this.userId);
            console.log(expirationDate);
            this.router.navigate(['/']);
          }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearInterval(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/auth/login']);
  }

  private getAuthData(){
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiresInDuration');
    const userId = localStorage.getItem('userId');
    if(!token || !expirationDate){
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
  
  private saveAuthData(token: string, expiresInDuration: Date, userId: string){
    localStorage.setItem('token', token);
    localStorage.setItem('expiresInDuration', expiresInDuration.toISOString());
    localStorage.setItem('userId', userId);

  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiresInDuration');
    localStorage.removeItem('userId');
  }

  private saveAuthTimer(duration: number){
    console.log('Setting TImer' + duration)
    this.tokenTimer = setTimeout(() => {
      this.logout();
    } ,duration * 1000); // duration is converted in seconds
  }
}
