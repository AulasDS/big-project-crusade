import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.scss';

// Interfaces para o TypeScript entender o formato dos dados
interface ItemCarrinho {
  id: number;
  id_usuario: number | string;
  id_jogo: number;
  titulo_jogo?: string; 
  cover_jogo?: string;
  preco_jogo?: number | string;
}

interface Biblioteca {
  id: number | string;
  id_usuario: number | string;
  jogos: number[];
}

export default function Carrinho() {
  const navigate = useNavigate();
  const [itensCarrinho, setItensCarrinho] = useState<ItemCarrinho[]>([]);
  const [loading, setLoading] = useState(true);
  const [idUsuarioLogado, setIdUsuarioLogado] = useState<number | string | null>(null);

  // 1. Carrega os itens do carrinho tratando os dados para evitar erros de array (.map)
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

        // Busca geral do carrinho
        const resposta = await axios.get(`http://localhost:3000/carrinho`);
        let dadosBrutos = resposta.data;

        let listaTratada: ItemCarrinho[] = [];

        // Proteção contra erro de .map is not a function
        if (Array.isArray(dadosBrutos)) {
          listaTratada = dadosBrutos;
        } else if (dadosBrutos && typeof dadosBrutos === 'object') {
          const chaves = Object.values(dadosBrutos);
          const possivelLista = chaves.find(valor => Array.isArray(valor));
          if (possivelLista) {
            listaTratada = possivelLista as ItemCarrinho[];
          }
        }

        // Filtra os itens do usuário logado (usando '==' para ignorar se um é string e o outro é número)
        const itensDoUsuario = listaTratada.filter(item => item && item.id_usuario == usuario.id);
        
        setItensCarrinho(itensDoUsuario);
      } catch (error) {
        console.error("Erro ao buscar itens do carrinho:", error);
        setItensCarrinho([]); 
      } finally {
        setLoading(false);
      }
    };

    buscarCarrinho();
  }, [navigate]);

  // 2. Finaliza a compra tratando erros de id e evitando o Erro 404
  async function handleFinalizarCompra(idItemCarrinho: number) {
    try {
      // Busca os dados do item do carrinho clicado
      const respostaCarrinho = await axios.get<ItemCarrinho>(`http://localhost:3000/carrinho/${idItemCarrinho}`);
      const item = respostaCarrinho.data;
      
      if (!item) {
        alert("Erro: Item não encontrado no carrinho.");
        return;
      }

      const idUsuario = item.id_usuario;
      const idJogoNovo = item.id_jogo;

      // Busca a biblioteca atual do usuário por id_usuario
      const respostaBiblioteca = await axios.get<Biblioteca[]>(`http://localhost:3000/biblioteca?id_usuario=${idUsuario}`);
      let bibliotecaAtual = respostaBiblioteca.data[0]; 

      // Fallback: tenta buscar varrendo todas as bibliotecas manualmente
      if (!bibliotecaAtual) {
        const todasBibliotecas = await axios.get<Biblioteca[]>(`http://localhost:3000/biblioteca`);
        bibliotecaAtual = todasBibliotecas.data.find(b => b.id_usuario == idUsuario)!;
      }

      // CORREÇÃO DO 404: Se a biblioteca do usuário não existir no db.json, cria uma nova
      if (!bibliotecaAtual) {
        console.log("Biblioteca inexistente. Criando nova biblioteca para o usuário...");
        const novaBiblioteca = {
          id_usuario: idUsuario,
          jogos: [idJogoNovo]
        };
        await axios.post(`http://localhost:3000/biblioteca`, novaBiblioteca);
      } else {
        // Se já existir, valida e atualiza usando o ID do registro retornado
        const jogosDaBiblioteca = Array.isArray(bibliotecaAtual.jogos) ? bibliotecaAtual.jogos : [];

        if (jogosDaBiblioteca.includes(idJogoNovo)) {
          alert("Você já possui esse jogo na sua biblioteca!");
          return;
        }

        const listaJogosAtualizada = [...jogosDaBiblioteca, idJogoNovo];

        // Atualiza usando o ID próprio do objeto encontrado no banco de dados (bibliotecaAtual.id)
        await axios.put(`http://localhost:3000/biblioteca/${bibliotecaAtual.id}`, {
          ...bibliotecaAtual,
          jogos: listaJogosAtualizada
        });
      }

      // Deleta do carrinho
      await axios.delete(`http://localhost:3000/carrinho/${idItemCarrinho}`);

      alert("Jogo adicionado à biblioteca com sucesso!");
      
      // Atualiza o estado local para remover o item comprado em tempo real
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
                  style={{ 
                    backgroundImage: `url(${item.cover_jogo || 'https://placehold.co/150x200/222/fff?text=Sem+Foto'})` 
                  }}
                ></div>
                
                <div className={styles.gameInfo}>
                  <h3>{item.titulo_jogo || `Jogo (ID: ${item.id_jogo})`}</h3>
                  <span className={styles.platformBadge}>PC / STEAM LINK</span>
                </div>

                <div className={styles.priceAction}>
                  <span className={styles.price}>
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