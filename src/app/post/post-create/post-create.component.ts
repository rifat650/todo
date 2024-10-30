import { Component, EventEmitter, inject, Output } from '@angular/core';
import { POST } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css'
})
export class PostCreateComponent {
  postService: PostService = inject(PostService);
  onAddPost(postForm: NgForm) {
    if (postForm.invalid) {
      return;
    }
    this.postService.addPost(postForm.value.title, postForm.value.content);
    postForm.resetForm()

  }


}
