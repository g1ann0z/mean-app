import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { PostsService } from '../../posts.service';
import { Post } from '../../post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit, OnDestroy {
  //testing posts
  /* posts = [
    {title: 'First Post', content: 'This is a first post\'s content'},
    {title: 'Second Post', content: 'This is a second post\'s content'},
    {title: 'Third Post', content: 'This is a third post\'s content'}
  ] */

  posts: Post[] = [];
  private postsSub!: Subscription;

  constructor(public postsService: PostsService){} //injection del service e grazie alla keyword public si crea in automatico anche la varaibile postsService senza instanziarla manualmente

  ngOnInit() {
    this.posts = this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdatedListener() //sottoscrizione all'observable creato per monitorare aggiunta di nuovi post
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

}
