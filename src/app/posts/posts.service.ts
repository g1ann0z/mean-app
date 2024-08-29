import { Injectable } from "@angular/core";
import { Subject } from "rxjs"; //importazione di subject da rxjs

import { Post } from "./post.model";
import { HttpClient } from "@angular/common/http";


@Injectable({providedIn: 'root'})
export class PostsService {
    private posts: Post[] = [];
    private postUpdated = new Subject<Post[]>; //creazione di un nuovo oggetto

    constructor(private http: HttpClient ) {}

    getPosts(){
       /* return [...this.posts]; */ /* spread operator per copiare in un nuovo array il contenuto di posts e non puntare direttamente a quella reference */
        this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
        .subscribe((postData) => {
            this.posts = postData.posts;
            this.postUpdated.next([...this.posts]);
        });
    }

    getPostUpdatedListener(){
        return this.postUpdated.asObservable(); //restituisce un oggetto che possiamo ascoltare
    }

    addPost(title: string, content: string){
    const post: Post = { id: null, title: title, content: content };
    this.http.post<{message: string}>('http://localhost:3000/api/posts', post)
        .subscribe((responseData) => {
            console.log(responseData.message)
            this.posts.push(post);
            this.postUpdated.next([...this.posts]); //ogni volta che c'è un nuovo post, aggiorna la copia dell'array
        });
    }
}