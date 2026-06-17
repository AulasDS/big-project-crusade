const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');

// 💡 NOVA ROTA: Adicionada especificamente para o endpoint de autenticação
router.post('/login', UsuarioController.login);

// Suas rotas que já existiam:
router.post('/', UsuarioController.create);
router.get('/', UsuarioController.getAll);
router.get('/:id', UsuarioController.getById);
router.put('/:id', UsuarioController.update);
router.delete('/:id', UsuarioController.delete);

module.exports = router;