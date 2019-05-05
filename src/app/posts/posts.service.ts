import { Post } from "./post.model";
import { Subject, ReplaySubject } from 'rxjs';
import * as Rx from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
// Below code for Angular 6 - > to create singleton service in the application
//@Injectable({providedIn : 'root'})
@Injectable()
export class PostsService {

    constructor(private http : HttpClient){

    }
    
    // don want to edit posts array from outside, so making it private 
   private  posts : Post[] = [];
   postsUpdated = new Rx.Subject<Post[]>();

   // if postsUpdated is declared as private, use below and assign it .asObservable()
   //private postsUpdated = new Subject<Post[]>();  - >  To subscribe this component,  use getPostUpdateListener().subscribe

   getPosts(){

    // Array in javascript are reference type
    //Creating a copy, 
    // if other components edit this array -> original array will not get affected.
       //return [...this.posts];

    this.http.get<{message:string, posts: Post[]}>('http://localhost:3000/api/posts')
    .pipe(map((postData)=>{
        return postData.posts.map(post=>{
            return {
                title: post.title,
                content: post.content,
                id: post.id
            }
        })
    }))
    .subscribe((transformedData) =>{
        debugger;
        this.posts  = transformedData;
        this.postsUpdated.next([...this.posts]);
    });

   }

    // getPosts() {
    // this.http
    //   .get<{ message: string; posts: any }>("http://localhost:3000/api/posts")
    //   .pipe(
    //     map(postData => {
    //       return postData.posts.map(post => {
    //         return {
    //           title: post.title,
    //           content: post.content,
    //           id: post._id
    //         };
    //       });
    //     })
    //   )
    //   .subscribe(transformedPosts => {

   addPost(title: string, content: string ){
    const post = {
        id : '',
        title : title,
        content : content
    }
    debugger;
    this.http.post<{message: string}>('http://localhost:3000/api/posts',post)
    .subscribe(response =>{ 
        console.log('SAVE POST!!!!!!!!!!!!!!!',response.message);
        this.posts.push(post);
        debugger;
        this.postsUpdated.next([...this.posts]); // to listen to this subject, making this subject observable below
    });
   }

   getPostUpdateListener(){
       return this.postsUpdated.asObservable();
   }
}