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
}

export default function Loja() {
  const [hovered, setHovered] = useState<string | number | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados originais para guardar o que veio do banco (filtrado da biblioteca)
  const [todosJogosFiltrados, setTodosJogosFiltrados] = useState<Game[]>([]);

  // 💡 NOVO ESTADO: Guarda a categoria selecionada (null significa "Todos")
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
          const jogosNaoComprados = jogosDoBanco.filter((item: any) => {
            const idDoJogo = String(item._id || item.id);
            return !idsJogosBiblioteca.includes(idDoJogo);
          });

          const jogosFormatados: Game[] =  jogosNaoComprados.map((item: any) => ({
            _id: item._id,
            id: item.id,
            title: item.titulo, 
            price: typeof item.preco === 'number' ? `R$ ${item.preco.toFixed(2).replace('.', ',')}` : item.preco, 
            image: item.cover,  
            rating: "Muito Positivo", 
            tags: item.genero ? item.genero.split('/').map((t: string) => t.trim()) : ["Jogo"], 
            discount: item.discount 
          }));

          // Guarda a lista total limpa da biblioteca para usarmos no filtro de clique
          setTodosJogosFiltrados(jogosFormatados);

          // Inicializa as seções com todos os jogos disponíveis
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

  // 💡 FUNÇÃO AUXILIAR: Fatia e distribui os jogos de acordo com o filtro ativo
  const distribuirJogosNasSecoes = (listaDeJogos: Game[]) => {
    setFeaturedGames(listaDeJogos.slice(0, 4)); 
    setTopSellers(listaDeJogos.slice(0, 4));
    setDiscountGames(listaDeJogos.filter(g => g.discount && g.discount > 0).length > 0 ? listaDeJogos.filter(g => g.discount && g.discount > 0) : listaDeJogos.slice(0, 4)); 
    setRecommendedGames(listaDeJogos.slice(0, 6));
  };

  // 💡 LÓGICA DE FILTRAGEM AO CLICAR NO BOTÃO
  const lidarComFiltroCategoria = (categoria: string) => {
    if (categoria === "Todos") {
      setCategoriaSelecionada(null);
      distribuirJogosNasSecoes(todosJogosFiltrados); // Mostra tudo de novo
    } else {
      setCategoriaSelecionada(categoria);
      // Filtra os jogos onde a tag inclui o nome da categoria clicada
      const jogosFiltradosPorGenero = todosJogosFiltrados.filter(jogo => 
        jogo.tags.some(tag => tag.toLowerCase().includes(categoria.toLowerCase()))
      );
      distribuirJogosNasSecoes(jogosFiltradosPorGenero);
    }
  };

  async function adicionarAoCarrinho(jogo: Game) {
    try {
      const dadosLocais = localStorage.getItem('usuarioLogado');
      if (!dadosLocais) {
        alert("Você precisa estar logado para adicionar itens ao carrinho!");
        return;
      }

      const usuario = JSON.parse(dadosLocais);
      const idJogoReal = jogo._id || jogo.id; 

      const precoNumerico = jogo.price.toLowerCase().includes('gratis') 
        ? 0 
        : parseFloat(jogo.price.replace("R$", "").replace(",", ".").trim());

      const novoItemCarrinho = {
        id_usuario: usuario.id,
        id_jogo: idJogoReal,
        titulo_jogo: jogo.title,
        cover_jogo: jogo.image,
        preco_jogo: precoNumerico
      };

      await axios.post("http://localhost:3000/carrinho", novoItemCarrinho);
      alert(`${jogo.title} foi adicionado ao seu carrinho!`);
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      alert("Não foi possível adicionar o jogo ao carrinho.");
    }
  }

  if (loading) {
    return <div style={{ color: '#fff', textAlign: 'center', padding: '50px' }}>Carregando jogos da Loja Steam...</div>;
  }

  return (
    <div className={styles.storeContainer}>
      
      {/* 💡 MENU DE FILTROS POR CATEGORIA NA HOME */}
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
                          {game.discount && <div className={styles.discount}>-{game.discount}%</div>}
                          
                          <div className={styles.priceRow}>
                            <div className={styles.price}>
                              {game.oldPrice && <s>{game.oldPrice}</s>}
                              <span>{game.price}</span>
                            </div>
                            <button onClick={() => adicionarAoCarrinho(game)} className={styles.steamCartBtn}>
                              🛒+
                            </button>
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
                            <div className={styles.price}>{game.price}</div>
                            <button onClick={() => adicionarAoCarrinho(game)} className={styles.steamCartBtn}>🛒+</button>
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
                            <div className={styles.price}>
                              {game.oldPrice && <s>{game.oldPrice}</s>}
                              <strong>{game.price}</strong>
                            </div>
                            <button onClick={() => adicionarAoCarrinho(game)} className={styles.steamCartBtn}>🛒+</button>
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
                            <div className={styles.price}>{game.price}</div>
                            <button onClick={() => adicionarAoCarrinho(game)} className={styles.steamCartBtn}>🛒+</button>
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