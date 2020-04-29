import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  @Input() posts:Post[] = [];
  postSub : Subscription;
  isLoading = false;
  userId: string;
  totalPosts = 10;
  currentPage = 1;
  postsPerPage = 2;
  pageSizeOptions = [1,2,5,10];
  private authStatusSub: Subscription;
  isUserAuthenticated = false;
  constructor(public postService : PostService, private authService: AuthService) { }

  ngOnInit() {
    this.postService.getPosts(this.postsPerPage,this.currentPage);
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.isUserAuthenticated = this.authService.getAuth();
    
    this.postSub = this.postService.getPostUpdatedHandler()
    .subscribe((postData : { posts : Post[], postCount: number}) => {
      this.isLoading = false;
      this.posts = postData.posts;
      this.totalPosts = postData.postCount;
    });
    
    this.authStatusSub = this.authService.getAuthStatusListener()
    .subscribe((isAuthenticated) => {
      this.isUserAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    })
  }

  onChangedPage(pageData: PageEvent){
    console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize
    this.postService.getPosts(this.postsPerPage, this.currentPage);

  }

  onDeletePost(postId: string){
   this.isLoading = true;
    this.postService.deletePost(postId)
    .subscribe((deletedPosts) => {
        console.log('Deleted');
        this.postService.getPosts(this.postsPerPage, this.currentPage);
    },
    (err) => {
      this.isLoading = false;
    });
  }

  ngOnDestroy(){
    this.postSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
