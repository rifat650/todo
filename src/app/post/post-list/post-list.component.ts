import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { POST } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit,OnDestroy {

totalPosts=0;
postsPerPage=2;
pageSizeOptions=[1,2,5,10];
currentPage=1;

  onChangedPAge(pageData:PageEvent){
    this.isLoading = true;
this.currentPage=pageData.pageIndex+1;
this.postsPerPage=pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage)
  }

  postService:PostService=inject(PostService);
posts:POST[]=[];
isLoading=false;
private postSub:Subscription;
ngOnInit(){
  this.isLoading=true;
this.postService.getPosts(this.postsPerPage,this.currentPage);
this.postSub=this.postService.getPostUpdateListener()
  .subscribe((postData: { post: POST[], postCount:number})=>{
    this.isLoading=false;
    this.totalPosts=postData.postCount;
    this.posts=postData.post;
  })
}

  ngOnDestroy(){
    this.postSub.unsubscribe()
  }

onDelete(postId:string){
  this.isLoading = true;
this.postService.deletePost(postId).subscribe(()=>{
  this.postService.getPosts(this.postsPerPage,this.currentPage)
})
}

}
