import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { POST } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit, OnDestroy {
  userId: string;
  userIsAuthenticated = false;
  authService: AuthService = inject(AuthService);
  authStatusSub: Subscription;
  totalPosts = 0;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;
  isLoading = false;
  posts: POST[] = [];
  postService: PostService = inject(PostService);
  private postSub: Subscription;

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.loadPosts();
  }

  private loadPosts() {
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnInit() {
    this.isLoading = true;
    this.loadPosts();

    this.userId = this.authService.getUserId();

    this.postSub = this.postService.getPostUpdateListener()
      .subscribe((postData: { post: POST[], postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.post;
      },
        error => {
          this.isLoading = false;
          console.error('Error in post subscription:', error);
        }
      );

    this.userIsAuthenticated = this.authService.getIsAuth()
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId()
    })

  }


  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.authStatusSub.unsubscribe()
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage)
    }, () => {
      this.isLoading = false;
    })
  }

}
