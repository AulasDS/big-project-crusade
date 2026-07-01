import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.scss';

interface Jogo {
  _id: string;
  titulo: string;
  descricao?: string;
  preco: number;
  cover: string;
  genero?: string;
}

interface CarrinhoData {
  _id: string;
  usuario: string;
  jogos: Jogo[];
}

export default function Carrinho() {
  const navigate = useNavigate();
  const [carrinhoId, setCarrinhoId] = useState<string | null>(null);
  const [jogosCarrinho, setJogosCarrinho] = useState<Jogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [idUsuarioLogado, setIdUsuarioLogado] = useState<string | null>(null);

  // 1. Carrega o carrinho populado usando o ID do usuário logado
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
        const idUsuarioReal = usuario.id || usuario._id;
        setIdUsuarioLogado(idUsuarioReal);

        const resposta = await axios.get(`http://localhost:3000/carrinho/${idUsuarioReal}`);
        
        if (resposta.data && resposta.data.data) {
          const carrinho: CarrinhoData = resposta.data.data;
          setCarrinhoId(carrinho._id);
          setJogosCarrinho(carrinho.jogos || []);
        }
      } catch (error: any) {
        console.error("Erro ao buscar itens do carrinho:", error);
        setJogosCarrinho([]); 
      } finally {
        setLoading(false);
      }
    };

    buscarCarrinho();
  }, [navigate]);

  // 2. Finaliza a compra: Adiciona à biblioteca e limpa do carrinho no Banco de Dados
  async function handleFinalizarCompra(idJogo: string) {
    if (!idUsuarioLogado) return;

    try {
      // 🎯 PASSO 1: Adiciona o jogo na biblioteca do usuário
      await axios.post(`http://localhost:3000/biblioteca`, {
        iduser: idUsuarioLogado,
        idjogo: idJogo
      });

      // 🎯 PASSO 2: Remove o jogo do carrinho (Envia via body E via query string para garantir)
      await axios.put(`http://localhost:3000/carrinho/remover/${idUsuarioLogado}?idjogo=${idJogo}`, {
        idjogo: idJogo
      });
      
      // Se os dois passos acima deram certo, exibe o sucesso!
      alert("Compra realizada com sucesso! O jogo foi adicionado à sua biblioteca.");
      
      // 🎯 PASSO 3: Remove o jogo do estado para ele sumir da tela imediatamente
      setJogosCarrinho(prevJogos => prevJogos.filter(j => j._id !== idJogo));

    } catch (error: any) {
      console.error("Erro detalhado na compra:", error);
      // Exibe na tela a mensagem exata de erro que o back-end devolveu
      alert(`Erro ao processar: ${error.response?.data?.message || error.message}`);
    }
  }

  // 3. Calcula o valor total somando os preços de todos os jogos no carrinho
  const calcularTotal = () => {
    return jogosCarrinho.reduce((total, jogo) => total + (jogo.preco || 0), 0);
  };

  if (loading) {
    return <div style={{ color: '#fff', padding: '50px', textAlign: 'center' }}>Carregando carrinho...</div>;
  }

  return (
    <div className={styles.cartPageWrapper}>
      <h1 className={styles.cartTitle}>SEU CARRINHO DE COMPRAS</h1>

      {jogosCarrinho.length === 0 ? (
        <div className={styles.emptyCart}>
          <p>Seu carrinho está vazio.</p>
          <button onClick={() => navigate('/loja')} className={styles.backBtn}>Ir para a Loja</button>
        </div>
      ) : (
        <div className={styles.cartContainer}>
          {/* Lista de Itens do Carrinho */}
          <div className={styles.itemsList}>
            {jogosCarrinho.map((jogo) => (
              <div key={jogo._id} className={styles.cartItemCard}>
                <div 
                  className={styles.gameCover} 
                  style={{ 
                    backgroundImage: `url(${jogo.cover || 'https://placehold.co/150x200/222/fff?text=Sem+Foto'})` 
                  }}
                ></div>
                
                <div className={styles.gameInfo}>
                  <h3>{jogo.titulo}</h3>
                  <span className={styles.platformBadge}>{jogo.genero || 'PC / STEAM LINK'}</span>
                </div>

                <div className={styles.priceAction}>
                  <span className={styles.price}>
                    {jogo.preco && Number(jogo.preco) > 0 
                      ? `R$ ${Number(jogo.preco).toFixed(2).replace('.', ',')}` 
                      : 'Gratuito'
                    }
                  </span>
                  <button 
                    onClick={() => handleFinalizarCompra(jogo._id)} 
                    className={styles.buyBtn}
                  > 
                    COMPRAR
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumo lateral */}
          <div className={styles.cartSummary}>
            <h3>Resumo do Pedido</h3>
            <div className={styles.summaryRow}>
              <span>Quantidade de jogos:</span>
              <span>{jogosCarrinho.length}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Total estimado:</span>
              <span style={{ color: '#a3ff00', fontWeight: 'bold' }}>
                R$ {calcularTotal().toFixed(2).replace('.', ',')}
              </span>
            </div>
            <div className={styles.divider}></div>
            <button onClick={() => navigate('/loja')} className={styles.keepShoppingBtn}>
              CONTINUAR COMPRANDO
            </button>
          </div>
        </div>
      )}
    </div>
  );
}