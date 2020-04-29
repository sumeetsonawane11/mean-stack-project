import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {
  public isLoading = false;
  public authStatusSub : Subscription;
  constructor(public authService : AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener()
    .subscribe(() => {
       this.isLoading = false;
    });
  }

  onLogin(form: NgForm){
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
    console.log(form.value);
  }

    ngOnDestroy(){
      this.authStatusSub.unsubscribe();
    }
}
