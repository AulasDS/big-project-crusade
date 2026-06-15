const Carrinho = require('../models/Carrinho');

class CarrinhoController {
    static async create(req, res) {
        try {
            const { iduser, idbiblioteca } = req.body;

            if (!iduser || !idbiblioteca) {
                return res.status(400).json({ message: "Dados inválidos. Certifique-se de enviar iduser e idbiblioteca." });
            }

            const CarrinhoData = {
                iduser,
                idbiblioteca
            };

            const newCarrinho = await Carrinho.create(CarrinhoData);
            return res.status(201).json({ message: 'Carrinho criado com sucesso', data: newCarrinho });

        } catch (error) {
            return res.status(500).json({ message: 'Erro ao criar Carrinho', error: error.message });
        }
    }

    static async getAll(req, res) {
        try {
            const Carrinhos = await Carrinho.find();
            return res.status(200).json({ data: Carrinhos });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao encontrar Carrinhos', error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const Carrinho = await Carrinho.findById(id);
            
            if (!Carrinho) {
                return res.status(404).json({ message: 'Carrinho não encontrado' });
            }
            return res.status(200).json({ data: Carrinho });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao encontrar Carrinho', error: error.message });
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
