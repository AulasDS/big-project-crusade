const Jogo = require('../models/Jogo');

class JogoController {
    // Dentro do JogoController.js:
static async create(req, res) {
    try {
        // 1. Pegue o 'cover' de dentro do req.body
        const { titulo, descricao, anoLancamento, preco, tipo, genero, plataforma, desenvolvedora, publicadora, cover } = req.body;

        // 2. Se quiser que a foto seja obrigatória, coloque !cover no if:
        if (!titulo || !descricao || !anoLancamento || !cover) {
            return res.status(400).json({ 
                message: "Dados inválidos. Certifique-se de enviar titulo, descricao, anoLancamento e cover." 
            });
        }

        const novoJogoData = {
            titulo,
            descricao,
            anoLancamento,
            preco,
            tipo,
            genero,
            plataforma,
            desenvolvedora,
            publicadora,
            cover // 💡 Inclua a variável aqui para ela ir pro banco!
        };

        const newJogo = await Jogo.create(novoJogoData);
        return res.status(201).json({ message: 'Jogo criado com sucesso', data: newJogo });

    } catch (error) {
        return res.status(500).json({ message: 'Erro ao criar jogo', error: error.message });
    }
}

    static async getAll(req, res) {
        try {
            const jogo = await Jogo.find();
            return res.status(200).json({ data: jogo });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao encontrar jogo', error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const jogo = await Jogo.findById(id);
            
            if (!jogo) {
                return res.status(404).json({ message: 'Jogo não encontrado' });
            }
            return res.status(200).json({ data: jogo });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao encontrar jogo', error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { titulo, descricao, anoLancamento, preco, tipo, genero, plataforma, desenvolvedora, publicadora } = req.body;
            
            const updatedData = {
                titulo,
                descricao,
                anoLancamento,
                preco,
                tipo,
                genero,
                plataforma,
                desenvolvedora,
                publicadora
            };
            
            const updatedJogo = await Jogo.findByIdAndUpdate(id, updatedData, { new: true });
            
            if (!updatedJogo) {
                return res.status(404).json({ message: 'Jogo não encontrado' });
            }
            return res.status(200).json({ message: 'Jogo atualizado com sucesso', data: updatedJogo });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao atualizar jogo', error: error.message });
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
            return res.status(500).json({ message: 'Erro ao deletar jogo', error: error.message });
        }
    }
}

module.exports = JogoController;
