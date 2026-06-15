const express = require('express');
const router = express.Router();
const BibliotecaController = require('../controllers/BibliotecaController');

router.post('/', BibliotecaController.create);
router.get('/', BibliotecaController.getAll);
router.get('/:id', BibliotecaController.getById);
router.delete('/:id', BibliotecaController.delete);

module.exports = router;