const Carrinho = require('../models/Carrinho');

class CarrinhoController {
    static async create(req, res) {
        try {
            const { iduser, idjogo } = req.body;

            if (!iduser || !idjogo) {
                return res.status(400).json({ message: "Dados inválidos. Certifique-se de enviar iduser e idjogo." });
            }

            const CarrinhoData = {
                usuario: iduser,
                jogos: [idjogo]
            };

            const newCarrinho = await Carrinho.create(CarrinhoData);
            return res.status(201).json({ message: 'Carrinho criado com sucesso', data: newCarrinho });

        } catch (error) {
            return res.status(500).json({ message: 'Erro ao criar Carrinho', error: error.message });
        }
    }

    static async getAll(req, res) {
        try {
            const Carrinhos = await Carrinho.find().populate('usuario').populate('jogos');
            return res.status(200).json({ data: Carrinhos });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao encontrar Carrinhos', error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params; 

            const carrinho = await Carrinho.findOne({ usuario: id })
                .populate('usuario')
                .populate('jogos');

            if (!carrinho) {
                return res.status(404).json({ 
                    message: 'Carrinho não encontrado'
                });
            }

            return res.status(200).json({ 
                data: carrinho 
            });

        } catch (error) {
            return res.status(500).json({ 
                message: 'Erro ao encontrar Carrinho', 
                error: error.message 
            });
        }
    }

    
    static async update(req, res) {
        try {
            const { id } = req.params; 
            const { idjogo } = req.body;

            if (!idjogo) {
                return res.status(400).json({
                    message: "Envie o id do jogo."
                });
            }

            const updatedCarrinho = await Carrinho.findOneAndUpdate(
                { usuario: id }, 
                {
                    $addToSet: {
                        jogos: idjogo 
                    }
                },
                { 
                    returnDocument: 'after' 
                }
            ).populate('jogos');

            if (!updatedCarrinho) {
                return res.status(404).json({
                    message: 'Carrinho não encontrado para este usuário.'
                });
            }

            return res.status(200).json({
                message: 'Jogo adicionado ao carrinho com sucesso',
                data: updatedCarrinho
            });

        } catch (error) {
            return res.status(500).json({
                message: 'Erro ao atualizar carrinho',
                error: error.message
            });
        }
    }

  
    static async removerJogo(req, res) {
    try {
        const { id } = req.params; 
       
        const idjogo = req.body.idjogo || req.query.idjogo; 

        console.log(`[Carrinho] Tentando remover o jogo ${idjogo} do usuário ${id}`);

        if (!idjogo) {
            return res.status(400).json({ message: "Envie o id do jogo para remoção." });
        }

        const updatedCarrinho = await Carrinho.findOneAndUpdate(
            { usuario: id },
            {
                $pull: { jogos: idjogo } 
            },
            { returnDocument: 'after' }
        ).populate('jogos');

        if (!updatedCarrinho) {
            return res.status(404).json({ message: "Carrinho não encontrado para este usuário." });
        }

        return res.status(200).json({
            message: "Jogo removido do carrinho com sucesso",
            data: updatedCarrinho
        });
    } catch (error) {
        console.error("Erro interno ao remover jogo:", error.message);
        return res.status(500).json({ message: "Erro ao remover jogo do carrinho", error: error.message });
    }
}

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const deletedCarrinho = await Carrinho.findByIdAndDelete(id);
            
            if (!deletedCarrinho) {
                return res.status(404).json({ message: 'Carrinho não encontrado' });
            }
            return res.status(200).json({ message: 'Carrinho deletado com sucesso' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao deletar Carrinho', error: error.message });
        }
    }
}

module.exports = CarrinhoController;