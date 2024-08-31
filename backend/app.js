const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');   //importazione di mongoose
const Post = require('./models/post'); //importazione del modello post per mongoose

//connessione db
mongoose.connect("mongodb+srv://giannozcydia:4zFBSyTD1w0UjhFO@cluster0.a71qy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    console.log('Connesso al database!')
})
.catch(() => {
    console.log('Connessione al database fallita!')
});


const app = express();

app.use(bodyParser.json()); //per la codifica del corpo delle richieste POST
app.use(bodyParser.urlencoded({ extended: false})); //per la codifica del corpo negli url

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");      //risoluzione CORS da qualsiasi origine
    res.setHeader(                                          //risoluzione CORS dalle intestazioni indicate
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(                                          //risoluzione CORS per i metodi indicati
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"     //OPTIONS viene inviata implicitamente dal browser, fondamentale autorizzarla
    );
    next();
});

app.post("/api/posts", (req, res, next) => {
    const post = new Post({         //per database
        title: req.body.title,
        content: req.body.content
    });
        post.save().then(createdPost => {   //metodo di salvataggio su db, con then recuperiamo l'oggetto passato ed estraiamo _id
            res.status(201).json({
            message: "Post aggiunto con successo!",
            postId: createdPost._id //passiamo _id a service per poter eliminare il post anche appena inserito
            /* senza questo passaggio il post si puo eliminare solo se ricarichiamo i dati dal db
            prima, altrimenti non abbiamo un id da passare poichè quello viene 
            assegnato dinamicamente dal db */
        });                         
    }); 
});

app.get("/api/posts", (req, res, next) => {
    Post.find()  //fetcha i dati dal database
    .then(documents => {
        res.status(200).json(
            {
                message: 'post caricati con successo',
                posts: documents
            });
    });
});

app.delete("/api/posts/:id", (req, res, next) => {
    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({message: 'Post eliminato!'});
    })
});

module.exports = app;