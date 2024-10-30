import { inject, Injectable } from '@angular/core';
import { POST } from './post.model';
import { map, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor() { }
  private posts: POST[] = [];
  http: HttpClient = inject(HttpClient);
  private postUpdated = new Subject<POST[]>()
  getPosts() {
    // return [...this.posts]
    this.http.get<{ massage: string, posts: any }>('http://localhost:3000/api/posts')
      .pipe(map((data) => {
        return data.posts.map((post) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          }
        })
      }))
      .subscribe({
        next: (transformedPost) => {
          this.posts = transformedPost;
          this.postUpdated.next([...this.posts]);
        },
        // error: () => { },
        // complete: () => { }
      })
  }
  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }
  addPost(title: string, content: string) {
    const post: POST = {
      id: null,
      title, content
    }
    this.http.post<{ message: string,postId:string }>('http://localhost:3000/api/posts', post)
      .subscribe({
        next: (data) => {
          const id = data.postId;
          post.id=id;
          this.posts.push(post);
          this.postUpdated.next([...this.posts])
        },
        // error: () => { },
        // complete: () => { }
      })

  }

  deletePost(postId: string) {
    this.http.delete(`http://localhost:3000/api/posts/${postId}`)
      .subscribe((value) => {
        const updatedPost = this.posts.filter(post => post.id !== postId)
        this.posts = updatedPost;
        this.postUpdated.next([...this.posts])
      })
  }

}
