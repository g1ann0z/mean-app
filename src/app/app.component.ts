import { Component } from '@angular/core';

import { Post } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent {
  /* title = 'mean-app'; */

  storedPosts: Post[] = []; //trick per evitare il problema di undefined non essendo eplicitata una interface sulla struttura del post

  onPostAdded(post: Post){
    this.storedPosts.push(post);
  }
}
