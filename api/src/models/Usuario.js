const mongoose = require('mongoose');

// Criamos uma estrutura para os jogos que ficarão dentro do usuário
const JogoSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    genre: { type: String },
    playtime: { type: String, default: "0 min" },
    lastPlayed: { type: String, default: "Nunca" },
    achievementProgress: { type: String, default: "0/0" },
    cover: { type: String, required: true },
    path: { type: String, required: true }
});

const UsuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    foto: { type: String },
    // 💡 CADA USUÁRIO TERÁ SUA PRÓPRIA LISTA DE JOGOS AQUI!
    jogos: [JogoSchema] 
});

module.exports = mongoose.model('Usuario', UsuarioSchema);