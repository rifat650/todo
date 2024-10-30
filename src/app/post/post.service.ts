import { Injectable } from '@angular/core';
import { POST } from './post.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor() { }
  private posts: POST[] = [];
  private postUpdated=new Subject<POST[]>()
  getPosts() {
    return [...this.posts]
  }
  getPostUpdateListener(){
    return this.postUpdated.asObservable();
  }
  addPost(title: string, content: string) {
    const post: POST = {
      title, content
    }
    this.posts.push(post);
    this.postUpdated.next([...this.posts])
  }

}
