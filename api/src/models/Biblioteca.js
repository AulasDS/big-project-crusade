const mongoose = require('mongoose');
const Jogo = require('./Jogo');

const Biblioteca = mongoose.model('Jogo', {
    titulo: String,
    descricao: String,
    anoLancamento: Date,
    preco: Number,
    tipo: String,
    genero: String,
    plataforma: String,
    desenvolvedora: String,
    publicadora: String,
    Jogo: { type: mongoose.Schema.Types.ObjectId, ref: 'Jogo' }
});
module.exports = Biblioteca;
