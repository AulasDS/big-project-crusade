    const Biblioteca = require('../models/Biblioteca');

    class BibliotecaController {
        static async create(req, res) {
            try {
                const { iduser, idjogo } = req.body;

                if (!iduser || !idjogo) {
                    return res.status(400).json({ message: "Dados inválidos. Certifique-se de enviar iduser e idjogo." });
                }

        
                const bibliotecaAtualizada = await Biblioteca.findOneAndUpdate(
                    { usuario: iduser }, 
                    {
                        $addToSet: {
                            jogos: idjogo 
                        }
                    },
                    { 
                        new: true,      
                        upsert: true,    
                        returnDocument: 'after'
                    }
                ).populate('usuario').populate('jogos');

                return res.status(200).json({ 
                    message: 'Jogo processado na biblioteca com sucesso', 
                    data: bibliotecaAtualizada 
                });

            } catch (error) {
                return res.status(500).json({ message: 'Erro ao processar Biblioteca', error: error.message });
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

                const biblioteca = await Biblioteca.findOne({ usuario: id })
                    .populate('usuario')
                    .populate('jogos');

                if (!biblioteca) {
                    return res.status(404).json({ 
                        message: 'Biblioteca não encontrada'
                    });
                }

                return res.status(200).json({ 
                    data: biblioteca 
                });

            } catch (error) {
                return res.status(500).json({ 
                    message: 'Erro ao encontrar Biblioteca', 
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

                const updatedBiblioteca = await Biblioteca.findByIdAndUpdate(
                    id,
                    {
                        $addToSet: {
                            jogos: idjogo
                        }
                    },
                    { 
                        returnDocument: 'after' 
                    }
                ).populate('usuario').populate('jogos');

                if (!updatedBiblioteca) {
                    return res.status(404).json({
                        message: 'Biblioteca não encontrada'
                    });
                }

                return res.status(200).json({
                    message: 'Jogo adicionado à biblioteca com sucesso',
                    data: updatedBiblioteca
                });

            } catch (error) {
                return res.status(500).json({
                    message: 'Erro ao atualizar biblioteca',
                    error: error.message
                });
            }
        }

        static async delete(req, res) {
            try {
                console.log("PARAMS:", req.params);
                console.log("BODY:", req.body);
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