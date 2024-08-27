import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css'
})
export class PostCreateComponent {
  enteredContent = '';
  enteredTitle = '';
  @Output() postCreated = new EventEmitter(); //creazione di evento da emettere all'aggiunta di un post da inserire in un array e da passare a post-list

  onAddPost(){
    /* this.newPost = this.enteredContent; */ //trasferisce con 2way bind. il valore di textarea a newpost
    const post = {
      title: this.enteredTitle,
      content: this.enteredContent
    }
    this.postCreated.emit(post); //onAddPost crea il post e lo passa come arg a postCreated

  }
}
