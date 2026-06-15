const Carrinho = mongoose.model('Carrinho', {
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
      jogos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Jogo' }]
});