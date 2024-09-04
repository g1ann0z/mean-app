const express = require("express");
const multer = require("multer"); //package per poter caricare un file sul backend

const Post = require('../models/post'); //importazione del modello post per mongoose

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({  //creazione di una costante dove immagazzinare il file immagine
    destination: (req, file, cb) => { 
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Tipo del file non valido (mime type)!");
        if (isValid){
            error = null;
        }
        cb(error, "backend/images"); //la callback ha 2 arg, errore e path dove memorizzare il file
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-'); //normalize name togliendo spazie e mettendo -
        const ext = MIME_TYPE_MAP[file.mimetype]; //normalizza estensione file
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.post("", multer({storage: storage}).single("image"), (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({         //per database
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename
    });
        post.save().then(createdPost => {   //metodo di salvataggio su db, con then recuperiamo l'oggetto passato ed estraiamo _id
            res.status(201).json({
            message: "Post aggiunto con successo!",
            /* postId: createdPost._id */ //passiamo _id a service per poter eliminare il post anche appena inserito
            /* senza questo passaggio il post si puo eliminare solo se ricarichiamo i dati dal db
            prima, altrimenti non abbiamo un id da passare poichè quello viene 
            assegnato dinamicamente dal db */
            post: { //non restituiamo più solo _id ma tutto l'oggetto js e sovrascriviamo _id
                ...createdPost, //spread operator
                id: createdPost._id
            }
        });                         
    }); 
});

// la prima parte dell'url per gli end-point è già compresa nella variabile in app.js
router.get("", (req, res, next) => {
    Post.find()  //fetcha i dati dal database
    .then(documents => {
        res.status(200).json(
            {
                message: 'post caricati con successo',
                posts: documents
            });
    });
});

router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post){
            res.status(200).json(post);
        } else {
            res.status(404).json({message: 'Post non trovato!'});
        }
    });
});

router.put("/:id", (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({ _id: req.params.id }, post).then(result => {
        res.status(200).json({ message: "Modifica effettuata!" });
    });
});

router.delete("/:id", (req, res, next) => {
    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({message: 'Post eliminato!'});
    })
});

module.exports = router;