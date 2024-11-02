import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { POST } from '../post.model';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css'
})
export class PostCreateComponent implements OnInit,OnDestroy {
  private authStatusSub:Subscription;
  authService:AuthService=inject(AuthService)
  imagePreview:string;
  isLoading = false;
  post: POST;
  postService: PostService = inject(PostService);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private mode = 'create';
  private postId: string;
  form: FormGroup;




  ngOnInit() {
 this.authStatusSub=this.authService.getAuthStatusListener().subscribe({
  next:()=>{
    this.isLoading=false;
  }
 })
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators:[mimeType]
      }),
      'content': new FormControl(null, {
        validators: [Validators.required]
      }),
    })

    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true
        this.postService.getPost(this.postId).subscribe((data) => {
          this.isLoading = false
          this.post = {
            id: data._id,
            title: data.title,
            content: data.content,
            imagePath:data.imagePath,
            creator:data.creator
          }
          this.form.setValue({
            'title': this.post.title, 'content': this.post.content,
            'image':this.post.imagePath
          });

          this.imagePreview = data.imagePath
        })

      } else {
        this.mode = 'create';
        this.postId = null;
      }
    })
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }else{
      this.isLoading = true;
      if (this.mode === 'create') {
        this.postService.addPost(this.form.value.title, this.form.value.content,this.form.value.image);
      } else {
        this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content,this.form.value.image)
      }
      this.form.reset()
    }

  }

  onImagePicked(event:Event){
  const file=(event.target as HTMLInputElement).files[0];
  this.form.patchValue({'image':file});
  this.form.get('image').updateValueAndValidity()

  const reader=new FileReader();
  reader.onload=()=>{
    this.imagePreview=reader.result as string
  }
  reader.readAsDataURL(file)
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe()
  }
}
