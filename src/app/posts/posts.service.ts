import { Injectable } from "@angular/core";
import { Subject } from "rxjs"; //importazione di subject da rxjs

import { Post } from "./post.model";


@Injectable({providedIn: 'root'})
export class PostsService {
    private posts: Post[] = [];
    private postUpdated = new Subject<Post[]>; //creazione di un nuovo oggetto

    getPosts(){
       return [...this.posts]; /* spread operator per copiare in un nuovo array il contenuto di posts e non puntare direttamente a quella reference */
    }

    getPostUpdatedListener(){
        return this.postUpdated.asObservable(); //restituisce un oggetto che possiamo ascoltare
    }

    addPost(title: string, content: string){
    const post: Post = { title: title, content: content };
    this.posts.push(post);
    this.postUpdated.next([...this.posts]); //ogni volta che c'è un nuovo post, aggiorna la copia dell'array
    }
}