const express = require('express');
const usuarioRouter = require('../src/routes/UsuarioRouter');


module.exports = (app) => {
    app.use(express.json());
    app.use('/usuario', usuarioRouter);
};
