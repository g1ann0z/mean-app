const express = require('express');

const app = express();

app.use('/api/posts', (req, res, next) => {
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