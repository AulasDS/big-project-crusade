const Jogo = require('../models/Jogo');

class JogoController {
    static async create(req, res) {
        try {
            const { iduser, idbiblioteca } = req.body;

            if (!iduser || !idbiblioteca) {
                return res.status(400).json({ message: "Dados inválidos. Certifique-se de enviar iduser e idbiblioteca." });
            }

            const clienteData = {
                iduser,
                idbiblioteca
            };

            const newJogo = await Jogo.create(clienteData);
            return res.status(201).json({ message: 'Jogo criado com sucesso', data: newJogo });

        } catch (error) {
            return res.status(500).json({ message: 'Erro ao criar cliente', error: error.message });
        }
    }

    static async getAll(req, res) {
        try {
            const clientes = await Jogo.find();
            return res.status(200).json({ data: clientes });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao encontrar clientes', error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const cliente = await Jogo.findById(id);
            
            if (!cliente) {
                return res.status(404).json({ message: 'Jogo não encontrado' });
            }
            return res.status(200).json({ data: cliente });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao encontrar cliente', error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const deletedJogo = await Jogo.findByIdAndDelete(id);
            
            if (!deletedJogo) {
                return res.status(404).json({ message: 'Jogo não encontrado' });
            }
            return res.status(200).json({ message: 'Jogo deletado com sucesso' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao deletar cliente', error: error.message });
        }
    }
}

module.exports = JogoController;
