import { useState, useEffect } from "react"; 
import axios from "axios";
import styles from "./style.module.scss";
import { Link } from "react-router-dom";

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
  jaPossui?: boolean;
}

export default function Loja() {
  const [hovered, setHovered] = useState<string | number | null>(null);
  const [loading, setLoading] = useState(true);

  const [todosJogosFiltrados, setTodosJogosFiltrados] = useState<Game[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);

  const [featuredGames, setFeaturedGames] = useState<Game[]>([]);
  const [topSellers, setTopSellers] = useState<Game[]>([]);
  const [discountGames, setDiscountGames] = useState<Game[]>([]);
  const [recommendedGames, setRecommendedGames] = useState<Game[]>([]);

  const categorias = ["Todos", "RPG", "Ação", "FPS", "Mundo Aberto", "Estratégia", "Competitivo"];

  useEffect(() => {
    const buscarDadosDaLoja = async () => {
      try {
        const dadosLocais = localStorage.getItem('usuarioLogado');
        let idsJogosBiblioteca: string[] = [];

        if (dadosLocais) {
          const usuario = JSON.parse(dadosLocais);
          const idUsuarioReal = usuario.id || usuario._id;

          try {
            const respostaBiblioteca = await axios.get(`http://localhost:3000/biblioteca/${idUsuarioReal}`);
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
              jaPossui: idsJogosBiblioteca.includes(idDoJogo)
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
    if (jogo.jaPossui) return;

    try {
      const dadosLocais = localStorage.getItem('usuarioLogado');
      if (!dadosLocais) {
        alert("Você precisa estar logado para adicionar itens ao carrinho!");
        return;
      }

      const usuario = JSON.parse(dadosLocais);

      const idJogoReal = jogo._id || jogo.id;
      const idUsuarioReal = usuario.id || usuario._id;

      if (!idUsuarioReal || !idJogoReal) {
        alert("Erro interno ao identificar usuário ou jogo.");
        return;
      }

      await axios.put(`http://localhost:3000/carrinho/${idUsuarioReal}`, {
        idjogo: idJogoReal
      });

      alert(`${jogo.title} foi adicionado ao seu carrinho!`);
    } catch (error: any) {
      console.error("====== 🔍 RELATÓRIO DE ERRO DO CARRINHO ======");
      if (error.response) {
        console.error("Status HTTP do Backend:", error.response.status);
        console.error("Dados/Mensagem da API:", error.response.data);
      } else {
        console.error("Erro na comunicação/Network:", error.message);
      }
      alert("Erro ao adicionar ao carrinho. Verifique o console.");
    }
  }

  if (loading) {
    return <div style={{ color: '#fff', textAlign: 'center', padding: '50px' }}>Carregando jogos da Loja Steam...</div>;
  }

  return (
    <div className={styles.storeContainer}>

      {/* MENU DE FILTROS POR CATEGORIA */}
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
            <section className={styles.featuredSection}>
              <h2>EM DESTAQUE</h2>
              <div className={styles.featuredGrid}>
                {featuredGames.map((game) => {
                  const gameId = game._id || game.id || '';
                  return (
                    <Link
                      to={`/loja/jogo/${gameId}`}
                      key={gameId}
                      className={styles.featuredCard}
                      onMouseEnter={() => setHovered(gameId)}
                      onMouseLeave={() => setHovered(null)}
                    >
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

                          {game.jaPossui ? (
                            <span style={{ backgroundColor: '#2f4153', color: '#66c0f4', padding: '4px 8px', borderRadius: '2px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                              NA BIBLIOTECA
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                adicionarAoCarrinho(game);
                              }}
                              className={styles.steamCartBtn}
                            >
                              🛒+
                            </button>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {topSellers.length > 0 && (
              <section className={styles.section}>
                <h2>MAIS VENDIDOS</h2>
                <div className={styles.gamesGrid}>
                  {topSellers.map(game => {
                    const gameId = game._id || game.id || '';
                    return (
                      <Link to={`/loja/jogo/${gameId}`} key={gameId} className={styles.gameCard}>
                        <img src={game.image} alt={game.title} />
                        <div className={styles.gameInfo}>
                          <h4>{game.title}</h4>
                          <div className={styles.priceRow}>
                            <div className={styles.price} style={{ opacity: game.jaPossui ? 0.5 : 1 }}>{game.price}</div>
                            {game.jaPossui ? (
                              <span style={{ color: '#66c0f4', fontSize: '0.8rem', fontWeight: 'bold' }}>NA BIBLIOTECA</span>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  adicionarAoCarrinho(game);
                                }}
                                className={styles.steamCartBtn}
                              >
                                🛒+
                              </button>
                            )}
                          </div>
                        </div>
                      </Link>
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
                      <Link to={`/loja/jogo/${gameId}`} key={gameId} className={styles.gameCard}>
                        <img src={game.image} alt={game.title} />
                        <div className={styles.gameInfo}>
                          <h4>{game.title}</h4>
                          <p className={styles.rating}>{game.rating}</p>
                          <div className={styles.priceRow}>
                            <div className={styles.price} style={{ opacity: game.jaPossui ? 0.5 : 1 }}>
                              {game.oldPrice && <s>{game.oldPrice}</s>}
                              <strong>{game.price}</strong>
                            </div>
                            {game.jaPossui ? (
                              <span style={{ color: '#66c0f4', fontSize: '0.8rem', fontWeight: 'bold' }}>NA BIBLIOTECA</span>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  adicionarAoCarrinho(game);
                                }}
                                className={styles.steamCartBtn}
                              >
                                🛒+
                              </button>
                            )}
                          </div>
                        </div>
                      </Link>
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
                      <Link to={`/loja/jogo/${gameId}`} key={gameId} className={styles.gameCard}>
                        <img src={game.image} alt={game.title} />
                        <div className={styles.gameInfo}>
                          <h4>{game.title}</h4>
                          <div className={styles.tags}>{game.tags?.join(" • ")}</div>
                          <div className={styles.priceRow}>
                            <div className={styles.price} style={{ opacity: game.jaPossui ? 0.5 : 1 }}>{game.price}</div>
                            {game.jaPossui ? (
                              <span style={{ color: '#66c0f4', fontSize: '0.8rem', fontWeight: 'bold' }}>NA BIBLIOTECA</span>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  adicionarAoCarrinho(game);
                                }}
                                className={styles.steamCartBtn}
                              >
                                🛒+
                              </button>
                            )}
                          </div>
                        </div>
                      </Link>
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