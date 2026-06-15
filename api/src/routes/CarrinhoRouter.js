const express = require('express');
const router = express.Router();
const CarrinhoController = require('../controllers/CarrinhoController');

router.post('/', CarrinhoController.create);
router.get('/', CarrinhoController.getAll);
router.get('/:id', CarrinhoController.getById);
router.delete('/:id', CarrinhoController.delete);

module.exports = router;