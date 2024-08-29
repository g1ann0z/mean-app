const express = require('express');
const bodyParser = require('body-parser');

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
    const post = req.body;
    console.log(post);
    res.status(201).json({
        message: "Post aggiunto con successo!"
    });
});

app.get("/api/posts", (req, res, next) => {
    const posts = [
        {
            id: "dajshda76", 
            title: "primo post dal server", 
            content: "ecco il primo contenuto"
        },
        {
            id: "jhkgk565", 
            title: "second post dal server", 
            content: "ecco il secondo contenuto"
        }
    ];
    res.status(200).json(
        {
            message: 'post caricati con successo',
            posts: posts
        });
});

module.exports = app;