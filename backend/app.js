const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');   //importazione di mongoose
const postsRoutes = require("./routes/posts");

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
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"     //OPTIONS viene inviata implicitamente dal browser, fondamentale autorizzarla
    );
    next();
});

app.use("/api/posts", postsRoutes); //primo argomento la parte statica dell'end point, secondo, richiamo al file esterno posts in routes

module.exports = app;