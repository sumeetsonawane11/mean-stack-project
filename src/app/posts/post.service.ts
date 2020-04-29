import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import  { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({
    providedIn:'root'
})
export class PostService {
    private posts:Post[] = [];
    private postUpdated = new Subject<{ posts: Post[] , postCount: number}>();
    constructor(private http : HttpClient, private router: Router){}

    getPosts(postPerPage: number, currentPage: number){
        const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;

        this.http.get<{message : string, posts: any, maxPosts:number}>( BACKEND_URL + queryParams)
        .pipe(map((postData) => { 
            // Transform the response data in pipe map before it is passed to subscription
            return  { posts : postData.posts.map((post) => {
                return {
                    title:  post.title,
                    content: post.content,
                    id : post._id,
                    imagePath: post.imagePath,
                    creator: post.creator
                };
            }),
            maxposts: postData.maxPosts
            }
        }))
        .subscribe((transformedPostData) => {
            this.posts = transformedPostData.posts;
            this.postUpdated.next({posts: [...this.posts], postCount: transformedPostData.maxposts});
        });
    }

    getPostUpdatedHandler(){
        return this.postUpdated.asObservable();
    }   

    getPost(id: string){
        // return {... this.posts.find(post => post.id === id)}
        return this.http.get<{ _id: string, title:string, content:string, imagePath: string, creator: string}>(BACKEND_URL + id);
    }

    addPost(title: string, content: string, image: File){
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);
        this.http.post<{message:string , post: Post}>(BACKEND_URL, postData)
        .subscribe((responseData)=>{
        //     console.log(responseData.message)
        //    const post: Post  = {
        //        id: responseData.post.id,
        //        title: title,
        //        content: content,
        //        imagePath: responseData.post.imagePath
        //    }
        //     this.posts.push(post);
        //     this.postUpdated.next([...this.posts]);
            this.router.navigate(['/']);
        })
       
    }

    deletePost(postId: string){
        return this.http.delete<{ message: string, posts: Post[]}>('http://localhost:3000/api/posts/' + postId)
        .pipe(map((updatedPostsRes) => {
            return updatedPostsRes.posts
        }));
    }
    
    updatePost(id: string, title: string, content: string, image: File | string){
        let postData : Post | FormData;
        if(typeof(image) ==='object'){// if users updated the new file, we will do with formData
            postData = new FormData();
            postData.append('id', id);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image, title);
        }else{ // If user doesn't update and keep the same image, its a normal string path
            postData = { id: id, title: title, content: content, imagePath: image, creator: null};
        }
        this.http.put(BACKEND_URL + id, postData ) 
        .subscribe((updatedData) => {
            console.log(updatedData);
            // const updatedPost = [...this.posts];
            // const oldPostIndex = updatedPost.findIndex(p => p.id === id);
            // const post : Post = { id: id, title: title, content: content, imagePath: "image"};
            // updatedPost[oldPostIndex] = post;
            // this.posts = updatedPost;
            // this.postUpdated.next([...this.posts]);
            this.router.navigate(['/']);
        });
    }
}