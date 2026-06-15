const express = require('express');
const usuarioRouter = require('../src/routes/UsuarioRouter');
const jogoRouter = require('../src/routes/JogoRouter');

module.exports = (app) => {
    app.use(express.json());
    app.use('/usuario', usuarioRouter);
    app.use('/jogo', jogoRouter);
};
