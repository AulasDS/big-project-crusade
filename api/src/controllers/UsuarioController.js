const Usuario = require('../models/Usuario');

class UsuarioController {
    static async create(req, res) {
        try {
            const { nome, email, nascimento, senha } = req.body;
            
            if (!nome || !email || !nascimento || !senha) {
                return res.status(400).json({ message: "Dados inválidos. Certifique-se de enviar nome, email e nascimento." });
            }

            const clienteData = {
                nome,
                email,
                nascimento,
                senha
            };

            const newUsuario = await Usuario.create(clienteData);
            return res.status(201).json({ message: 'Usuario criado com sucesso', data: newUsuario });

        } catch (error) {
            return res.status(500).json({ message: 'Erro ao criar cliente', error: error.message });
        }
    }

    static async getAll(req, res) {
        try {
            const clientes = await Usuario.find();
            return res.status(200).json({ data: clientes });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao encontrar clientes', error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const cliente = await Usuario.findById(id);
            
            if (!cliente) {
                return res.status(404).json({ message: 'Usuario não encontrado' });
            }
            return res.status(200).json({ data: cliente });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao encontrar cliente', error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nome, email, nascimento } = req.body;
            
            const updatedData = {
                nome,
                email,
                nascimento
            };
            
            const updatedUsuario = await Usuario.findByIdAndUpdate(id, updatedData, { new: true });
            
            if (!updatedUsuario) {
                return res.status(404).json({ message: 'Usuario não encontrado' });
            }
            return res.status(200).json({ message: 'Usuario atualizado com sucesso', data: updatedUsuario });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao atualizar cliente', error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const deletedUsuario = await Usuario.findByIdAndDelete(id);
            
            if (!deletedUsuario) {
                return res.status(404).json({ message: 'Usuario não encontrado' });
            }
            return res.status(200).json({ message: 'Usuario deletado com sucesso' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao deletar cliente', error: error.message });
        }
    }
}

module.exports = UsuarioController;
