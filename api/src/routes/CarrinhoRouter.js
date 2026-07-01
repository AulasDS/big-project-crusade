const express = require('express');
const router = express.Router();
const CarrinhoController = require('../controllers/CarrinhoController');

// Rota para buscar o carrinho de um usuário específico pelo ID do usuário
router.get('/:id', CarrinhoController.getById);

// Rota para criar um novo carrinho (caso seu sistema use no primeiro acesso)
router.post('/', CarrinhoController.create);

// Rota para buscar todos os carrinhos (geralmente usado em painel admin)
router.get('/', CarrinhoController.getAll);

// Rota para adicionar um jogo ao carrinho (atualizar o array existente)
router.put('/:id', CarrinhoController.update);

// 🎯 A CORREÇÃO QUE RESOLVE O ERRO 404:
// Essa rota precisa ser .put e conter o '/remover/:id' para casar com o seu front-end
router.put('/remover/:id', CarrinhoController.removerJogo);

// Rota para deletar o carrinho por completo (ID do documento do carrinho)
router.delete('/:id', CarrinhoController.delete);

module.exports = router;