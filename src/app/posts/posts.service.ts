import { Injectable } from "@angular/core";
import { Subject } from "rxjs"; //importazione di subject da rxjs
import { map } from "rxjs";
import { Router } from "@angular/router";

import { Post } from "./post.model";
import { HttpClient } from "@angular/common/http";
import { response } from "express";


@Injectable({ providedIn: 'root' })
export class PostsService {
    private posts: Post[] = [];
    private postUpdated = new Subject<Post[]>; //creazione di un nuovo oggetto

    constructor(private http: HttpClient, private router: Router) { }

    getPosts() {
        /* return [...this.posts]; */ /* spread operator per copiare in un nuovo array il contenuto di posts e non puntare direttamente a quella reference */
        this.http.get<{ message: string, posts: any[] }>('http://localhost:3000/api/posts')
            .pipe(map((postData) => {           //aggiunto operator map per rimappare l'oggetto ed eliminare underscore da id (_id)
                return postData.posts.map(post => {
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id,
                        imagePath: post.imagePath
                    };
                });
            }))
            .subscribe(transformedPosts => {
                this.posts = transformedPosts;
                this.postUpdated.next([...this.posts]);
            });
    }

    getPostUpdatedListener() {
        return this.postUpdated.asObservable(); //restituisce un oggetto che possiamo ascoltare
    }

    getPost(id: string) {
        return this.http.get<{ _id: string, title: string, content: string }>("http://localhost:3000/api/posts/" + id);
    }

    addPost(title: string, content: string, image: File) {
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);
        this.http
        .post<{ message: string, post: Post }>(
            "http://localhost:3000/api/posts", postData)
            .subscribe((responseData) => {
                const post: Post = { 
                    id: responseData.post.id, 
                    title: title, 
                    content: content,
                    imagePath: responseData.post.imagePath 
                };
                /* recuperiamo id del post appena inserito per poterlo cancellare anche appena inserito,
                senza prima fetchare i dati dal DB */
                const id = responseData.post.id;
                post.id = id;
                this.posts.push(post);
                this.postUpdated.next([...this.posts]); //ogni volta che c'è un nuovo post, aggiorna la copia dell'array
                this.router.navigate(["/"]); //redirect in radice
            });
    }

    updatePost(id: string, title: string, content: string) {
        const post: Post = { id: id, title: title, content: content, imagePath: null };
        this.http
            .put("http://localhost:3000/api/posts/" + id, post)
            .subscribe(response => {
                const updatedPosts = [...this.posts]; //clona array in un'altra variabile
                const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id); //trova indice del vecchio post
                updatedPosts[oldPostIndex] = post; //quindi lo aggiorno con post modificato nell'array copia
                this.posts = updatedPosts; //aggiorno array principale con la modifica
                this.postUpdated.next([...this.posts]); //aggiorno la copia dell'array principale
                this.router.navigate(["/"]); //redirect in radice
            });
    }

    deletePost(postId: string) {
        this.http.delete("http://localhost:3000/api/posts/" + postId)
            .subscribe(() => {
                const updatedPosts = this.posts.filter(post => post.id !== postId); //filtra i post trattenendo tutti quelli diversi dall'id passato da cancellare
                this.posts = updatedPosts; // aggiorna l'array posts
                this.postUpdated.next([...this.posts]); //aggiorna l'array copia
            });
    }

}