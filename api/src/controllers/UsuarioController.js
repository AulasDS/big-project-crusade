const Usuario = require('../models/Usuario');
// 💡 Tentamos puxar a biblioteca de forma segura para não quebrar caso o arquivo não exista
let Biblioteca;
try {
    Biblioteca = require('../models/Biblioteca');
} catch (e) {
    console.log("Aviso: O Model de Biblioteca não foi encontrado em '../models/Biblioteca'.");
}

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
            return res.status(200).json({ message: 'Usuario updatedUsuario com sucesso', data: updatedUsuario });
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

    // ========================================================
    // 💡 NOVO MÉTODO: LOGIN DINÂMICO E PROTEGIDO CONTRA CRASH
    // ========================================================
    static async login(req, res) {
        const { email, senha } = req.body;

        try {
            // 1. Valida se o usuário existe
            const usuario = await Usuario.findOne({ email });
            if (!usuario) {
                return res.status(400).json({ message: 'E-mail ou senha incorretos.' });
            }

            // 2. Valida se a senha bate
            if (usuario.senha !== senha) {
                return res.status(400).json({ message: 'E-mail ou senha incorretos.' });
            }

            let jogosDoUsuario = [];

            // 3. Busca os jogos na tabela externa de Biblioteca de forma ultra segura
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

            // 4. Devolve a resposta limpa em JSON para o React ler sem quebrar
            return res.status(200).json({
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
                foto: usuario.foto || 'https://api.dicebear.com/7.x/pixel-art/svg?seed=guest',
                jogos: jogosDoUsuario 
            });

        } catch (error) {
            return res.status(500).json({ message: 'Erro interno no servidor ao tentar logar.', error: error.message });
        }
    }
}

module.exports = UsuarioController;