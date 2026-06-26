const mongoose = require('mongoose');

const Jogo = mongoose.model('Jogo', {
    titulo: String,
    descricao: String,
    anoLancamento: Date,
    preco: Number,
    tipo: String,
    genero: String,
    plataforma: String,
    desenvolvedora: String,
    publicadora: String,
    cover: String,
    requisitos: String 
});

module.exports = Jogo;