import { PostsService } from './../posts.service';
import { Component, EventEmitter, Output } from "@angular/core";

import { NgForm } from "@angular/forms";
import { Post } from "../post.model";

@Component({
    selector : 'app-post-create',
    templateUrl : './post-create.component.html',
    styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent {
   
    enteredTitle = '';
    enteredContent = '';
    //@Output() postCreated = new EventEmitter<Post>();

    constructor(public postService : PostsService){

    }
    onSavePost(postForm: NgForm){

        //Do not emit the post if title / content is invalid

        if(postForm.invalid){
            return;
        }

      /*  const post : Post = {
            title: postForm.value.title,
            content: postForm.value.content
        }
 */
        this.postService.addPost(postForm.value.title,postForm.value.content);
        postForm.resetForm();
        //this.postCreated.emit(post);
    }
}