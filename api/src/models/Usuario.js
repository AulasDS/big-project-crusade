const mongoose = require('mongoose');

const Usuario = mongoose.model('Usuario', {
    nome: String,
    email: String,
    nascimento: Date,
    senha: String
});
module.exports = Usuario;
