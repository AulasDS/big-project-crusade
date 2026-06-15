const express = require('express');
const router = express.Router();
const JogoController = require('../controllers/JogoController');

router.post('/', JogoController.create);
router.get('/', JogoController.getAll);
router.get('/:id', JogoController.getById);
router.put('/:id', JogoController.update);
router.delete('/:id', JogoController.delete);

module.exports = router;