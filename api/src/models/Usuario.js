const mongoose = require('mongoose');
const Jogo = require('./Jogo');

const Usuario = mongoose.model('Usuario', {
    nome: String,
    email: String,
    nascimento: Date,
    senha: String,
    jogoID: { type: mongoose.Schema.Types.ObjectId, ref: 'Jogo' }
});
module.exports = Usuario;
