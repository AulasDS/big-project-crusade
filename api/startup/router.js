const express = require('express');
const usuarioRouter = require('../src/routes/UsuarioRouter');
const jogoRouter = require('../src/routes/JogoRouter');
const avaliacaoRouter = require('../src/routes/AvaliacaoRoutes');
const carrinhoRouter = require('../src/routes/CarrinhoRouter');
const bibliotecaRouter = require('../src/routes/BibliotecaRouter');

module.exports = (app) => {
    app.use(express.json());
    app.use('/usuario', usuarioRouter);
    app.use('/jogo', jogoRouter);
    app.use('/avaliacao', avaliacaoRouter);
    app.use('/carrinho', carrinhoRouter);
    app.use('/biblioteca', bibliotecaRouter);
};
