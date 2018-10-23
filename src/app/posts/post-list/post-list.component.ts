import { PostsService } from './../posts.service';
import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { Post } from "../post.model";
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
   
    storedPosts : Post[] = [];
    private postsSub : Subscription;
    // function which is called whenever angular creates new instance of this component
    //private/public -> typescript automatically creates a property and assigns to this component 
    //( this.postService can be used directly now)
    constructor(public postService : PostsService){

    }

    
    ngOnInit(): void {
     // 1. Getting storedPosts directly from the service
       // this.storedPosts = this.postService.getPosts();

     // 2.  

        // subscribe has 3 arguments : 1st arg -> function that gets executed when new data is emitted
        //2nd arg -  will be called when error is emitted
        // 3rd arg - function is called when observable is completed &  no event is expected

      this.postService.getPosts();
      this.postsSub = this.postService.postsUpdated.subscribe((posts : Post[]) => {
        this.storedPosts = posts;
      });
    }


    // function which is called when this component is about to be removed
    // better to unsubscribe when we navigate to other pages, to avoid memory leaks
    ngOnDestroy(): void {
       this.postsSub.unsubscribe();
    }
}