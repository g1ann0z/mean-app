import { Injectable } from "@angular/core";
import { Subject } from "rxjs"; //importazione di subject da rxjs
import { map } from "rxjs";

import { Post } from "./post.model";
import { HttpClient } from "@angular/common/http";


@Injectable({providedIn: 'root'})
export class PostsService {
    private posts: Post[] = [];
    private postUpdated = new Subject<Post[]>; //creazione di un nuovo oggetto

    constructor(private http: HttpClient ) {}

    getPosts(){
       /* return [...this.posts]; */ /* spread operator per copiare in un nuovo array il contenuto di posts e non puntare direttamente a quella reference */
        this.http.get<{message: string, posts: any[]}>('http://localhost:3000/api/posts')
        .pipe(map((postData) => {           //aggiunto operator map per rimappare l'oggetto ed eliminare underscore da id (_id)
            return postData.posts.map(post => {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id
                };
            });
        }))
        .subscribe(transformedPosts => {
            this.posts = transformedPosts;
            this.postUpdated.next([...this.posts]);
        });
    }

    getPostUpdatedListener(){
        return this.postUpdated.asObservable(); //restituisce un oggetto che possiamo ascoltare
    }

    addPost(title: string, content: string){
    const post: Post = { id: null, title: title, content: content };
    this.http.post<{message: string}>("http://localhost:3000/api/posts", post)
        .subscribe((responseData) => {
            console.log(responseData.message)
            this.posts.push(post);
            this.postUpdated.next([...this.posts]); //ogni volta che c'è un nuovo post, aggiorna la copia dell'array
        });
    }

    deletePost(postId: string){
        this.http.delete("http://localhost:3000/api/posts/" + postId)
        .subscribe(() => {
            const updatedPosts = this.posts.filter(post => post.id !== postId ); //filtra i post trattenendo tutti quelli diversi dall'id passato da cancellare
            this.posts = updatedPosts; // aggiorna l'array posts
            this.postUpdated.next([...this.posts]); //aggiorna l'array copia
        });
    }

}