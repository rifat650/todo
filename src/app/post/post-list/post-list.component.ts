import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { POST } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit,OnDestroy {
  postService:PostService=inject(PostService);
posts:POST[]=[];
private postSub:Subscription;
ngOnInit(){
this.posts=this.postService.getPosts();
this.postSub=this.postService.getPostUpdateListener()
.subscribe({
  next:(posts:POST[])=>{this.posts=posts}
})
}

  ngOnDestroy(){
    this.postSub.unsubscribe()
  }

}
