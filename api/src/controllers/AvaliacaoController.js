const Avaliacao = require('../models/Avaliacao');

class AvaliacaoController {
    static async create(req, res) {
        try {
            const { iduser, idjogo, nota, comentario } = req.body;

            if (!iduser || !idjogo || !nota || nota < 0 || nota > 5 || comentario.length > 500) {
                return res.status(400).json({ message: "Dados inválidos. Certifique-se de enviar iduser e ." });
            }

            const AvaliacaoData = {
                iduser,
                idjogo,
                nota,
                comentario
            };

            const newAvaliacao = await Avaliacao.create(AvaliacaoData);
            return res.status(201).json({ message: 'Avaliacao criado com sucesso', data: newAvaliacao });

        } catch (error) {
            return res.status(500).json({ message: 'Erro ao criar Avaliacao', error: error.message });
        }
    }

    static async getAll(req, res) {
        try {
            const Avaliacoes = await Avaliacao.find();
            return res.status(200).json({ data: Avaliacoes });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao encontrar Avaliacoes', error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const Avaliacao = await Avaliacao.findById(id);
            
            if (!Avaliacao) {
                return res.status(404).json({ message: 'Avaliacao não encontrado' });
            }
            return res.status(200).json({ data: Avaliacao });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao encontrar Avaliacao', error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const deletedAvaliacao = await Avaliacao.findByIdAndDelete(id);
            
            if (!deletedAvaliacao) {
                return res.status(404).json({ message: 'Avaliacao não encontrado' });
            }
            return res.status(200).json({ message: 'Avaliacao deletado com sucesso' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao deletar Avaliacao', error: error.message });
        }
    }
}

module.exports = AvaliacaoController;
