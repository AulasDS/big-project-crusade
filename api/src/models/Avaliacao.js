const mongoose = require('mongoose');

const Avaliacao = mongoose.model('Avaliacao', {
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    jogo: { type: mongoose.Schema.Types.ObjectId, ref: 'Jogo' },
    nota: { type: Number, min: 0, max: 5 },
    comentario: { type: String, maxlength: 500 }
});
module.exports = Avaliacao;
