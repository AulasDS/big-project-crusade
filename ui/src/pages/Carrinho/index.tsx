import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.scss';

// Interfaces para o TypeScript entender o formato dos dados
interface ItemCarrinho {
  id: number;
  id_usuario: number;
  id_jogo: number;
  titulo_jogo?: string; 
  cover_jogo?: string;
  preco_jogo?: number;
}

interface Biblioteca {
  id: number;
  id_usuario: number;
  jogos: number[]; // Array com os IDs dos jogos
}

export default function Carrinho() {
  const navigate = useNavigate();
  const [itensCarrinho, setItensCarrinho] = useState<ItemCarrinho[]>([]);
  const [loading, setLoading] = useState(true);
  const [idUsuarioLogado, setIdUsuarioLogado] = useState<number | null>(null);

  // 1. Carrega os itens do carrinho do usuário logado assim que a página abre
  useEffect(() => {
    const buscarCarrinho = async () => {
      try {
        const dadosLocais = localStorage.getItem('usuarioLogado');
        if (!dadosLocais) {
          alert("Você precisa estar logado para ver o carrinho!");
          navigate('/login');
          return;
        }

        const usuario = JSON.parse(dadosLocais);
        setIdUsuarioLogado(usuario.id);

        // Busca os itens do carrinho filtrando pelo ID do usuário logado
        const resposta = await axios.get<ItemCarrinho[]>(`http://localhost:3000/carrinho?id_usuario=${usuario.id}`);
        
        // SEGURANÇA: Garante que itensCarrinho sempre receba um Array, evitando erro de .map()
        setItensCarrinho(Array.isArray(resposta.data) ? resposta.data : []);
      } catch (error) {
        console.error("Erro ao buscar itens do carrinho:", error);
        setItensCarrinho([]);
      } finally {
        setLoading(false);
      }
    };

    buscarCarrinho();
  }, [navigate]);

  // Função que será chamada quando o botão for clicado
  async function handleFinalizarCompra(idItemCarrinho: number) {
    try {
      // 1. GET por ID na tabela carrinho para achar os dados do item
      const respostaCarrinho = await axios.get<ItemCarrinho>(`http://localhost:3000/carrinho/${idItemCarrinho}`);
      const item = respostaCarrinho.data;
      
      if (!item) {
        alert("Erro: Item não encontrado no carrinho.");
        return;
      }

      const idUsuario = item.id_usuario;
      const idJogoNovo = item.id_jogo;

      // 2. GET para buscar a biblioteca atual do usuário
      const respostaBiblioteca = await axios.get<Biblioteca[]>(`http://localhost:3000/biblioteca?id_usuario=${idUsuario}`);
      const bibliotecaAtual = respostaBiblioteca.data[0]; 

      // SEGURANÇA: Se o usuário não tiver biblioteca criada no banco, interrompe antes de quebrar
      if (!bibliotecaAtual) {
        alert("Erro: Biblioteca do usuário não encontrada no servidor!");
        return;
      }

      // SEGURANÇA: Garante que a propriedade jogos seja tratada como array antes do .includes()
      const jogosDaBiblioteca = Array.isArray(bibliotecaAtual.jogos) ? bibliotecaAtual.jogos : [];

      // Validação: Evitar duplicidade de jogo na biblioteca
      if (jogosDaBiblioteca.includes(idJogoNovo)) {
        alert("Você já possui esse jogo na sua biblioteca!");
        return;
      }

      // 3. Monta a nova lista de jogos incluindo o novo ID
      const listaJogosAtualizada = [...jogosDaBiblioteca, idJogoNovo];

      // 4. PUT para atualizar a biblioteca do usuário
      await axios.put(`http://localhost:3000/biblioteca/${bibliotecaAtual.id}`, {
        ...bibliotecaAtual,
        jogos: listaJogosAtualizada
      });

      // 5. DELETE para tirar do carrinho
      await axios.delete(`http://localhost:3000/carrinho/${idItemCarrinho}`);

      alert("Jogo adicionado à biblioteca com sucesso!");
      
      // Atualização em tempo real na tela
      setItensCarrinho(prevItens => prevItens.filter(i => i.id !== idItemCarrinho));

    } catch (error) {
      console.error("Erro ao processar a compra:", error);
      alert("Houve um erro ao processar sua compra. Verifique o console.");
    }
  }

  if (loading) {
    return <div style={{ color: '#fff', padding: '50px', textAlign: 'center' }}>Carregando carrinho...</div>;
  }

  return (
    <div className={styles.cartPageWrapper}>
      <h1 className={styles.cartTitle}>SEU CARRINHO DE COMPRAS</h1>

      {itensCarrinho.length === 0 ? (
        <div className={styles.emptyCart}>
          <p>Seu carrinho está vazio.</p>
          <button onClick={() => navigate('/biblioteca')} className={styles.backBtn}>Ver minha Biblioteca</button>
        </div>
      ) : (
        <div className={styles.cartContainer}>
          {/* Lista de Itens do Carrinho */}
          <div className={styles.itemsList}>
            {itensCarrinho.map((item) => (
              <div key={item.id} className={styles.cartItemCard}>
                <div 
                  className={styles.gameCover} 
                  style={{ backgroundImage: `url(${item.cover_jogo || '/capas/default.png'})` }}
                ></div>
                
                <div className={styles.gameInfo}>
                  <h3>{item.titulo_jogo || `Jogo ID: ${item.id_jogo}`}</h3>
                  <span className={styles.platformBadge}>PC / STEAM LINK</span>
                </div>

                <div className={styles.priceAction}>
                  <span className={styles.price}>
                    {/* SEGURANÇA: Evita que o toFixed() quebre caso o preço venha nulo ou indefinido */}
                    {item.preco_jogo && Number(item.preco_jogo) > 0 
                      ? `R$ ${Number(item.preco_jogo).toFixed(2)}` 
                      : 'Gratuito'
                    }
                  </span>
                  <button 
                    onClick={() => handleFinalizarCompra(item.id)} 
                    className={styles.buyBtn}
                  > 
                    COMPRAR
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumo lateral do Carrinho */}
          <div className={styles.cartSummary}>
            <h3>Resumo do Pedido</h3>
            <div className={styles.summaryRow}>
              <span>Quantidade de jogos:</span>
              <span>{itensCarrinho.length}</span>
            </div>
            <div className={styles.divider}></div>
            <button onClick={() => navigate('/biblioteca')} className={styles.keepShoppingBtn}>
              VOLTAR PARA A BIBLIOTECA
            </button>
          </div>
        </div>
      )}
    </div>
  );
}