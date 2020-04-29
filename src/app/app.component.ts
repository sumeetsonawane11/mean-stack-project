import { Component, OnInit } from '@angular/core';
import { Post } from './posts/post.model';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  storedPosts:Post[] = [];
  constructor( private authService: AuthService){}

  ngOnInit(){
    // If we refresh the page , to not lose the authentication info, we are again calling autoAuthUser to fetch the latest information
    this.authService.autoAuthUser();
  }
  onPostAdded(post:Post){
    this.storedPosts.push(post);
  }
}
