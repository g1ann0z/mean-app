import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  form!: FormGroup;
  imagePreview!: string;


  constructor(public postsService: PostsService, public route: ActivatedRoute) {} //4Edit; inj di route per poter estrarre eventuale id

  ngOnInit(): void {
    this.form = new FormGroup({ //creazione del reactive form
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      'content': new FormControl(null, {validators: [Validators.required]}),
      'image': new FormControl(null, {validators: [Validators.required]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => { //4Edit; check su presenza o meno del paramentro id per determinare mode create o edit
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true; //4Spinner
        this.postsService.getPost(this.postId!).subscribe(postData => {
            this.post = { 
              id: postData._id, 
              title: postData.title, 
              content: postData.content
            };
            this.form.setValue({  //popola form in caso di edit
              'title': this.post.title, 
              'content': this.post.content
            });
            this.isLoading = false; //4Spinner
        });
      } else {
        this.mode = 'create';
        this.postId = null;
        /* this.post = null; */
      }
    });
  }

  onSavePost(){
    if (this.form.invalid){
      return;
    }
    this.isLoading = true; //4Spinner
    if (this.mode === 'create'){
      this.postsService.addPost(this.form.value.title, this.form.value.content);
    } else {
      this.postsService.updatePost(
        this.postId!, 
        this.form.value.title, 
        this.form.value.content
      );
    }
    this.form.reset(); /* ripristina il form dopo l'invio di un post compresa la validità */
  }

  /* onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files; //tolto [0], casting per comunicare ad typescript che l'elemento sarà un file
    this.form.patchValue({image: file});
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader(); //parte per la creazione della image preview
    reader.onload = () => {
      this.imgePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  } */

    onImagePicked(event: Event){
      const input = (event.target as HTMLInputElement); //casting per comunicare ad typescript che l'elemento sarà un file

      if (input && input.files && input.files.length > 0){ //verifica file not null e che ci sia almeno un file
        const file = input.files[0]; //seleziona primo file
        this.form.patchValue({image: file});
        this.form.get('image')?.updateValueAndValidity();

        const reader = new FileReader(); //parte per la creazione della image preview
        reader.onload = () => {
          this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file); //passa il singolo file
      }
    }
}
