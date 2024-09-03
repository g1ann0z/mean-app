import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PostsService } from '../../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../../post.model';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css'
})
export class PostCreateComponent implements OnInit {
  enteredContent = '';
  enteredTitle = '';
  private mode = 'create'; //4Edit; modalità creata con default create in base alla presenza o meno di un id (check con paramMap)
  private postId!: string | null; //tricky
  post!: Post | null; //tricky
  isLoading = false; //4Spinner

  constructor(public postsService: PostsService, public route: ActivatedRoute) {} //4Edit; inj di route per poter estrarre eventuale id

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => { //4Edit; check su presenza o meno del paramentro id per determinare mode create o edit
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true; //4Spinner
        this.postsService.getPost(this.postId!).subscribe(postData => {
            this.post = { id: postData._id, title: postData.title, content: postData.content}
            this.isLoading = false; //4Spinner
        });
      } else {
        this.mode = 'create';
        this.postId = null;
        /* this.post = null; */
      }
    });
  }

  onSavePost(form: NgForm){
    if (form.invalid){
      return;
    }
    this.isLoading = true; //4Spinner
    if (this.mode === 'create'){
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      this.postsService.updatePost(
        this.postId!, 
        form.value.title, 
        form.value.content
      );
    }
    form.resetForm(); /* ripristina il form dopo l'invio di un post compresa la validità */
  }
}
