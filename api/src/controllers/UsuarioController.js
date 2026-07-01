const Usuario = require('../models/Usuario');
const Carrinho = require('../models/Carrinho'); // 💡 PASSO 1: Importar o modelo do Carrinho aqui no topo

let Biblioteca;
try {
    Biblioteca = require('../models/Biblioteca');
} catch (e) {
    console.log("Aviso: O Model de Biblioteca não foi encontrado em '../models/Biblioteca'.");
}

class UsuarioController {
    static async create(req, res) {
        try {
            const { nome, email, senha, nascimento, foto } = req.body;
            
            if (!nome || !email || !senha || !nascimento) {
                return res.status(400).json({ message: "Dados inválidos. Certifique-se de enviar nome, email, senha e nascimento." });
            }

            const clienteData = {
                nome,
                email,
                senha,
                nascimento,
                foto: foto || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${nome}`
            };

            const newUsuario = await Usuario.create(clienteData);

            // 💡 PASSO 2: Criar o carrinho automaticamente assim que o usuário é salvo no banco
            await Carrinho.create({
                usuario: newUsuario._id,
                jogos: [] // Começa completamente vazio para o cliente adicionar itens depois
            });

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
            const { nome, email, nascimento, foto } = req.body;
            
            const updatedData = {
                nome,
                email,
                nascimento,
                foto
            };
            
            const updatedUsuario = await Usuario.findByIdAndUpdate(id, updatedData, { new: true });
            
            if (!updatedUsuario) {
                return res.status(404).json({ message: 'Usuario não encontrado' });
            }
            return res.status(200).json({ message: 'Usuario updated com sucesso', data: updatedUsuario });
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

    static async login(req, res) {
        const { email, senha } = req.body;

        try {
            const usuario = await Usuario.findOne({ email });
            if (!usuario) {
                return res.status(400).json({ message: 'E-mail ou senha incorretos.' });
            }

            if (usuario.senha !== senha) {
                return res.status(400).json({ message: 'E-mail ou senha incorretos.' });
            }

            let jogosDoUsuario = [];

            if (Biblioteca) {
                try {
                    const bibliotecaUsuario = await Biblioteca.findOne({ usuario: usuario._id }).populate('jogos');
                    if (bibliotecaUsuario && bibliotecaUsuario.jogos) {
                        jogosDoUsuario = bibliotecaUsuario.jogos;
                    }
                } catch (err) {
                    console.log("Aviso: Não foi possível carregar a biblioteca deste usuário:", err.message);
                }
            }

            return res.status(200).json({
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
                nascimento: usuario.nascimento,
                foto: usuario.foto || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${usuario.nome}`,
                jogos: jogosDoUsuario 
            });

        } catch (error) {
            return res.status(500).json({ message: 'Erro interno no servidor ao tentar logar.', error: error.message });
        }
    }
}

module.exports = UsuarioController;