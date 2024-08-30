const mongoose = require('mongoose');

const postSchema = mongoose.Schema({        //creazione dello schema progetto post per mongoDB
    title: { type: String, required: true}, //qui usiamo javascript quindi String con S maiuscola
    content: { type: String, required: true}
});

module.exports = mongoose.model('Post', postSchema); /*creiamo il modello da utilizzare che chiamiamo Post e si basa
                                                        sul progetto di postSchema ed si esporta */