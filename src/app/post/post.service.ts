import { inject, Injectable } from '@angular/core';
import { POST } from './post.model';
import { map, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { response } from 'express';

const BACKEND_URL ='http://localhost:3000/api/posts/'
@Injectable({
  providedIn: 'root'
})
export class PostService {

  router: Router = inject(Router)
  constructor() { }
  private posts: POST[] = [];
  http: HttpClient = inject(HttpClient);
  private postUpdated = new Subject<{post:POST[],postCount:number}>()


  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    return this.http
      .get<{ message: string, posts: any, maxPosts: number }>(BACKEND_URL + queryParams)
      .pipe(
        map(data => {
          return {
            posts: data.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }),
            maxPosts: data.maxPosts
          };
        })
      )
      .subscribe({
        next: (transformedPostData) => {
          this.posts = transformedPostData.posts;
          this.postUpdated.next({
            post: [...this.posts],
            postCount: transformedPostData.maxPosts
          });
        },
        error: (error) => {
          console.error('Error fetching posts:', error);
        }
      });
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }
  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{ message: string, post: POST }>(BACKEND_URL, postData)
      .subscribe({
        next: (data) => {
          this.router.navigate(['/'])
        },
        // error: () => { },
        // complete: () => { }
      })

  }

  deletePost(postId: string) {
    return this.http.delete(`${BACKEND_URL}${postId}`)
  }


  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string, creator: string }>(`${BACKEND_URL}${id}`)
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: POST | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id)
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      }
    }
    this.http.put(`${BACKEND_URL}${id}`, postData).subscribe((response) => {
      this.router.navigate(['/'])
    })
  }

}
