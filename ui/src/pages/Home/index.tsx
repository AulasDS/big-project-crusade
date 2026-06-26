import { useState, useEffect } from "react"; 
import axios from "axios";
import styles from "./style.module.scss";

interface Game {
  id?: number;
  _id?: string; 
  title: string;     
  price: string;     
  oldPrice?: string;
  discount?: number;
  rating: string;
  image: string;     
  tags: string[];    
  jaPossui?: boolean; // 💡 Nova propriedade para controlar o aviso de posse
}

export default function Loja() {
  const [hovered, setHovered] = useState<string | number | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados originais para guardar o que veio do banco
  const [todosJogosFiltrados, setTodosJogosFiltrados] = useState<Game[]>([]);

  // Guarda a categoria selecionada (null significa "Todos")
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);

  // Estados das seções da vitrine
  const [featuredGames, setFeaturedGames] = useState<Game[]>([]);
  const [topSellers, setTopSellers] = useState<Game[]>([]);
  const [discountGames, setDiscountGames] = useState<Game[]>([]);
  const [recommendedGames, setRecommendedGames] = useState<Game[]>([]);

  // Lista de categorias fixas para os botões do filtro
  const categorias = ["Todos", "RPG", "Ação", "FPS", "Mundo Aberto", "Estratégia", "Competitivo"];

  useEffect(() => {
    const buscarDadosDaLoja = async () => {
      try {
        const dadosLocais = localStorage.getItem('usuarioLogado');
        let idsJogosBiblioteca: string[] = [];

        if (dadosLocais) {
          const usuario = JSON.parse(dadosLocais);
          
          try {
            const respostaBiblioteca = await axios.get(`http://localhost:3000/biblioteca/${usuario.id}`);
            const biblioteca = respostaBiblioteca.data;
            
            if (biblioteca && biblioteca.data && Array.isArray(biblioteca.data.jogos)) {
              idsJogosBiblioteca = biblioteca.data.jogos.map((itemDoJogo: any) => 
                String(itemDoJogo._id || itemDoJogo.id || itemDoJogo)
              );
            }
          } catch (err) {
            console.warn("Usuário não tem biblioteca ou rota não encontrada.");
          }
        }

        const respostaJogos = await axios.get("http://localhost:3000/jogo");
        let jogosDoBanco = respostaJogos.data;

        if (jogosDoBanco && !Array.isArray(jogosDoBanco)) {
          jogosDoBanco = jogosDoBanco.jogos || jogosDoBanco.data || [];
        }

        if (Array.isArray(jogosDoBanco)) {
          // 💡 IMPORTANTE: Removido o filtro que excluía os jogos já comprados!
          
          // Remove duplicatas de IDs vindas do banco de dados para evitar repetições visuais
          const mapaJogosUnicos = new Map();
          jogosDoBanco.forEach((item: any) => {
            const idReal = String(item._id || item.id);
            if (!mapaJogosUnicos.has(idReal)) {
              mapaJogosUnicos.set(idReal, item);
            }
          });
          const listaSemDuplicados = Array.from(mapaJogosUnicos.values());

          const jogosFormatados: Game[] = listaSemDuplicados.map((item: any) => {
            const idDoJogo = String(item._id || item.id);
            return {
              _id: item._id,
              id: item.id,
              title: item.titulo, 
              price: typeof item.preco === 'number' ? `R$ ${item.preco.toFixed(2).replace('.', ',')}` : item.preco, 
              image: item.cover,  
              rating: "Muito Positivo", 
              tags: item.genero ? item.genero.split('/').map((t: string) => t.trim()) : ["Jogo"], 
              discount: item.discount,
              jaPossui: idsJogosBiblioteca.includes(idDoJogo) // 💡 Marcamos true se o id estiver na biblioteca
            };
          });

          setTodosJogosFiltrados(jogosFormatados);
          distribuirJogosNasSecoes(jogosFormatados);
        }
      } catch (error) {
        console.error("Erro ao carregar dados da loja:", error);
      } finally {
        setLoading(false);
      }
    };

    buscarDadosDaLoja();
  }, []);

  const distribuirJogosNasSecoes = (listaDeJogos: Game[]) => {
    setFeaturedGames(listaDeJogos.slice(0, 4)); 
    setTopSellers(listaDeJogos.length > 4 ? listaDeJogos.slice(4, 8) : listaDeJogos);
    
    const comDesconto = listaDeJogos.filter(g => g.discount && g.discount > 0);
    setDiscountGames(comDesconto.length > 0 ? comDesconto : listaDeJogos.slice(0, 4)); 
    
    setRecommendedGames(listaDeJogos.length > 6 ? listaDeJogos.slice(6, 12) : listaDeJogos.slice(0, 6));
  };

  const lidarComFiltroCategoria = (categoria: string) => {
    if (categoria === "Todos") {
      setCategoriaSelecionada(null);
      distribuirJogosNasSecoes(todosJogosFiltrados);
    } else {
      setCategoriaSelecionada(categoria);
      const jogosFiltradosPorGenero = todosJogosFiltrados.filter(jogo => 
        jogo.tags.some(tag => tag.toLowerCase().includes(categoria.toLowerCase()))
      );
      distribuirJogosNasSecoes(jogosFiltradosPorGenero);
    }
  };

  async function adicionarAoCarrinho(jogo: Game) {
    if (jogo.jaPossui) return; // Trava de segurança extra

    try {
      const dadosLocais = localStorage.getItem('usuarioLogado');
      if (!dadosLocais) {
        alert("Você precisa estar logado para adicionar itens ao carrinho!");
        return;
      }

      const usuario = JSON.parse(dadosLocais);
      const idJogoReal = jogo._id || jogo.id; 

      let precoNumerico = 0;
      if (jogo.price && !jogo.price.toLowerCase().includes('gratis')) {
        const apenasNumerosESinais = jogo.price.replace(/[^\d,.-]/g, '').replace(',', '.');
        precoNumerico = parseFloat(apenasNumerosESinais);
        if (isNaN(precoNumerico)) precoNumerico = 0;
      }

      const novoItemCarrinho = {
        id_usuario: usuario.id,
        id_jogo: idJogoReal,
        titulo_jogo: jogo.title, 
        cover_jogo: jogo.image,
        preco_jogo: precoNumerico
      };

      await axios.post("http://localhost:3000/carrinho", novoItemCarrinho);
      alert(`${jogo.title} foi adicionado ao seu carrinho!`);
    } catch (error: any) {
      console.error("Erro detalhado do Backend:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Não foi possível adicionar o jogo ao carrinho.");
    }
  }

  if (loading) {
    return <div style={{ color: '#fff', textAlign: 'center', padding: '50px' }}>Carregando jogos da Loja Steam...</div>;
  }

  return (
    <div className={styles.storeContainer}>
      
      <div className={styles.filterContainer} style={{ display: 'flex', gap: '10px', padding: '20px 0', justifyContent: 'center' }}>
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => lidarComFiltroCategoria(cat)}
            style={{
              padding: '8px 16px',
              backgroundColor: (categoriaSelecionada === cat || (cat === "Todos" && categoriaSelecionada === null)) ? '#1a9fff' : '#2a3f5a',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.2s'
            }}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <main>
        {featuredGames.length > 0 ? (
          <>
            {featuredGames.length > 0 && (
              <section className={styles.featuredSection}>
                <h2>EM DESTAQUE</h2>
                <div className={styles.featuredGrid}>
                  {featuredGames.map((game) => {
                    const gameId = game._id || game.id || '';
                    return (
                      <div key={gameId} className={styles.featuredCard}
                        onMouseEnter={() => setHovered(gameId)}
                        onMouseLeave={() => setHovered(null)}>
                        <img src={game.image} alt={game.title} />
                        <div className={styles.gameInfo}>
                          <h3>{game.title}</h3>
                          <div className={styles.tags}>{game.tags?.join(" • ")}</div>
                          {game.discount && !game.jaPossui && <div className={styles.discount}>-{game.discount}%</div>}
                          
                          <div className={styles.priceRow}>
                            <div className={styles.price} style={{ opacity: game.jaPossui ? 0.5 : 1 }}>
                              {game.oldPrice && <s>{game.oldPrice}</s>}
                              <span>{game.price}</span>
                            </div>
                            
                            {/* 💡 Condicional de aviso visual */}
                            {game.jaPossui ? (
                              <span style={{ backgroundColor: '#2f4153', color: '#66c0f4', padding: '4px 8px', borderRadius: '2px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                NA BIBLIOTECA
                              </span>
                            ) : (
                              <button onClick={() => adicionarAoCarrinho(game)} className={styles.steamCartBtn}>
                                🛒+
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {topSellers.length > 0 && (
              <section className={styles.section}>
                <h2>MAIS VENDIDOS</h2>
                <div className={styles.gamesGrid}>
                  {topSellers.map(game => {
                    const gameId = game._id || game.id || '';
                    return (
                      <div key={gameId} className={styles.gameCard}>
                        <img src={game.image} alt={game.title} />
                        <div className={styles.gameInfo}>
                          <h4>{game.title}</h4>
                          <div className={styles.priceRow}>
                            <div className={styles.price} style={{ opacity: game.jaPossui ? 0.5 : 1 }}>{game.price}</div>
                            
                            {/* 💡 Condicional de aviso visual */}
                            {game.jaPossui ? (
                              <span style={{ color: '#66c0f4', fontSize: '0.8rem', fontWeight: 'bold' }}>NA BIBLIOTECA</span>
                            ) : (
                              <button onClick={() => adicionarAoCarrinho(game)} className={styles.steamCartBtn}>🛒+</button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {discountGames.length > 0 && (
              <section className={styles.section}>
                <h2>DESCONTOS E EVENTOS</h2>
                <div className={styles.gamesGrid}>
                  {discountGames.map(game => {
                    const gameId = game._id || game.id || '';
                    return (
                      <div key={gameId} className={styles.gameCard}>
                        <img src={game.image} alt={game.title} />
                        <div className={styles.gameInfo}>
                          <h4>{game.title}</h4>
                          <p className={styles.rating}>{game.rating}</p>
                          <div className={styles.priceRow}>
                            <div className={styles.price} style={{ opacity: game.jaPossui ? 0.5 : 1 }}>
                              {game.oldPrice && <s>{game.oldPrice}</s>}
                              <strong>{game.price}</strong>
                            </div>
                            
                            {/* 💡 Condicional de aviso visual */}
                            {game.jaPossui ? (
                              <span style={{ color: '#66c0f4', fontSize: '0.8rem', fontWeight: 'bold' }}>NA BIBLIOTECA</span>
                            ) : (
                              <button onClick={() => adicionarAoCarrinho(game)} className={styles.steamCartBtn}>🛒+</button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {recommendedGames.length > 0 && (
              <section className={styles.section}>
                <h2>RECOMENDADOS PARA VOCÊ</h2>
                <div className={styles.gamesGrid}>
                  {recommendedGames.map(game => {
                    const gameId = game._id || game.id || '';
                    return (
                      <div key={gameId} className={styles.gameCard}>
                        <img src={game.image} alt={game.title} />
                        <div className={styles.gameInfo}>
                          <h4>{game.title}</h4>
                          <div className={styles.tags}>{game.tags?.join(" • ")}</div>
                          <div className={styles.priceRow}>
                            <div className={styles.price} style={{ opacity: game.jaPossui ? 0.5 : 1 }}>{game.price}</div>
                            
                            {/* 💡 Condicional de aviso visual */}
                            {game.jaPossui ? (
                              <span style={{ color: '#66c0f4', fontSize: '0.8rem', fontWeight: 'bold' }}>NA BIBLIOTECA</span>
                            ) : (
                              <button onClick={() => adicionarAoCarrinho(game)} className={styles.steamCartBtn}>🛒+</button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        ) : (
          <div style={{ color: '#aaa', textAlign: 'center', padding: '100px 0', fontSize: '1.2rem' }}>
            Nenhum jogo disponível nesta categoria no momento.
          </div>
        )}
      </main>
    </div>
  );
}