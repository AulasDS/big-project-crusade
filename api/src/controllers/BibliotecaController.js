const Biblioteca = require('../models/Biblioteca');

class BibliotecaController {
    static async create(req, res) {
        try {
            const { iduser, idjogo } = req.body;

            if (!iduser || !idjogo) {
                return res.status(400).json({ message: "Dados inválidos. Certifique-se de enviar iduser e idjogo." });
            }

            const BibliotecaData = {
                usuario: iduser,
                jogos: idjogo
            };

            const newBiblioteca = await Biblioteca.create(BibliotecaData);
            return res.status(201).json({ message: 'Biblioteca criado com sucesso', data: newBiblioteca });

        } catch (error) {
            return res.status(500).json({ message: 'Erro ao criar Biblioteca', error: error.message });
        }
    }

    static async getAll(req, res) {
        try {
            const Bibliotecas = await Biblioteca.find().populate('usuario').populate('jogos');
            return res.status(200).json({ data: Bibliotecas });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao encontrar Bibliotecas', error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const Biblioteca = await Biblioteca.findById(id);
            
            if (!Biblioteca) {
                return res.status(404).json({ message: 'Biblioteca não encontrado' });
            }
            return res.status(200).json({ data: Biblioteca });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao encontrar Biblioteca', error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { iduser, idjogo } = req.body;

            if (!iduser || !idjogo) {
                return res.status(400).json({ message: "Dados inválidos. Certifique-se de enviar iduser e idjogo." });
            }

            const BibliotecaData = {
                usuario: iduser,
                jogos: idjogo
            };

            const updatedBiblioteca = await Biblioteca.findByIdAndUpdate(id, BibliotecaData, { new: true });
            
            if (!updatedBiblioteca) {
                return res.status(404).json({ message: 'Biblioteca não encontrado' });
            }
            return res.status(200).json({ message: 'Biblioteca atualizado com sucesso', data: updatedBiblioteca });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao atualizar Biblioteca', error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const deletedBiblioteca = await Biblioteca.findByIdAndDelete(id);
            
            if (!deletedBiblioteca) {
                return res.status(404).json({ message: 'Biblioteca não encontrado' });
            }
            return res.status(200).json({ message: 'Biblioteca deletado com sucesso' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao deletar Biblioteca', error: error.message });
        }
    }
}

module.exports = BibliotecaController;
