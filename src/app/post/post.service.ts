import { inject, Injectable } from '@angular/core';
import { POST } from './post.model';
import { map, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  router: Router = inject(Router)
  constructor() { }
  private posts: POST[] = [];
  http: HttpClient = inject(HttpClient);
  private postUpdated = new Subject<{post:POST[],postCount:number}>()


  getPosts(postsPerPage:number,currentPage:number) {
    // return [...this.posts]
    const QueryParams = `?pagesize=${postsPerPage}&page=${currentPage}`
    this.http.get<{ massage: string, posts: any, maxPosts:number }>('http://localhost:3000/api/posts/'+QueryParams)
      .pipe( map((data) => {
        return {posts:data.posts.map((post) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath:post.imagePath
          }
        }),
        maxPosts:data.maxPosts
      }

      }))
      .subscribe({
        next: (transformedPostData) => {
          this.posts = transformedPostData.posts;
          this.postUpdated.next({post:[...this.posts],postCount:transformedPostData.maxPosts});
        },
        // error: () => { },
        // complete: () => { }
      })
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }
  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{ message: string, post: POST }>('http://localhost:3000/api/posts', postData)
      .subscribe({
        next: (data) => {
          this.router.navigate(['/'])
        },
        // error: () => { },
        // complete: () => { }
      })

  }

  deletePost(postId: string) {
    return this.http.delete(`http://localhost:3000/api/posts/${postId}`)
  }


  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath:string }>(`http://localhost:3000/api/posts/${id}`)
  }

  updatePost(id: string, title: string, content: string,image:File|string) {
    let postData:POST | FormData;
if(typeof image === 'object'){
postData=new FormData();
postData.append('id',id)
postData.append('title',title);
  postData.append('content', content);
  postData.append('image', image,title);
}else{
postData={
  id:id,
  title:title,
  content:content,
  imagePath:image
}
}
    this.http.put(`http://localhost:3000/api/posts/${id}`, postData).subscribe((response) => {
      this.router.navigate(['/'])
    })
  }

}
