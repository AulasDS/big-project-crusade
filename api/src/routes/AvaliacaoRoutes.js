const express = require('express');
const router = express.Router();
const AvaliacaoController = require('../controllers/AvaliacaoController');

router.post('/', AvaliacaoController.create);
router.get('/', AvaliacaoController.getAll);
router.get('/:id', AvaliacaoController.getById);
router.delete('/:id', AvaliacaoController.delete);

module.exports = router;