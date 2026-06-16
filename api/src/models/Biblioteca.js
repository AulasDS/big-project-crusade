const mongoose = require('mongoose');

const BibliotecaSchema = new mongoose.Schema({

    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },

    jogos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Jogo'
        }
    ]

});

module.exports = mongoose.model('Biblioteca', BibliotecaSchema);