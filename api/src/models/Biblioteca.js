const mongoose = require('mongoose');

const Biblioteca = mongoose.model('Biblioteca', {
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    jogos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Jogo' }]
});
module.exports = Biblioteca;
