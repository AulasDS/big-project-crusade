import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './style.module.scss';

export interface Game {
  _id: string; // Garantido o uso do ID do MongoDB como string
  titulo: string;
  descricao?: string;
  anoLancamento?: string;
  preco?: number;
  tipo?: string;
  genero: string;
  cover?: string;
  path?: string;
  playtime?: string;
}

export const Biblioteca: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gamesList, setGamesList] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca os jogos atualizados direto do Banco de Dados sempre que a tela abre
  useEffect(() => {
    const carregarBiblioteca = async () => {
      try {
        const dadosLocais = localStorage.getItem('usuarioLogado');
        if (!dadosLocais) {
          setGamesList([]);
          setLoading(false);
          return;
        }

        const usuario = JSON.parse(dadosLocais);
        
        // Faz a requisição para a rota que busca a biblioteca pelo ID do usuário
        const response = await fetch(`http://localhost:3000/biblioteca/${usuario.id}`);
        const resultado = await response.json();

        // Mapeia o array de jogos que veio de dentro de data.jogos
        if (resultado.data && resultado.data.jogos) {
          setGamesList(resultado.data.jogos);
        } else {
          setGamesList([]);
        }
      } catch (error) {
        console.error("Erro ao buscar jogos da biblioteca:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarBiblioteca();
  }, []);

  const filteredGames = gamesList.filter(game =>
    game.titulo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentGames = gamesList.slice(0, 6);

  // Tela de transição rápida enquanto a API responde
  if (loading) {
    return (
      <div style={{ 
        color: '#8f98a0', 
        textAlign: 'center', 
        padding: '100px 20px', 
        backgroundColor: '#1b2838', 
        height: '100vh',
        fontSize: '18px' 
      }}>
        Carregando biblioteca em tempo real...
      </div>
    );
  }

  return (
    <div className={styles.libraryPageWrapper}>
      
      <nav className={styles.innerNav}>
        <div className={styles.navLinks}>
          <button className={`${styles.navBtn} ${styles.active}`}>PÁGINA INICIAL</button>
          <button className={`${styles.navBtn} ${styles.disabled}`}>COLEÇÕES</button>
        </div>
        <div className={styles.searchBox}>
          <input 
            type="text" 
            placeholder="Buscar por nome..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </nav>

      <div className={styles.scrollableContent}>
        
        {gamesList.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#8f98a0', padding: '100px 20px', fontSize: '18px' }}>
            <p>Nenhum jogo nesta biblioteca.</p>
            <span style={{ fontSize: '14px', color: '#555' }}>Adicione jogos via API para vê-los aqui.</span>
          </div>
        ) : (
          <>
            {/* SEÇÃO 1: JOGOS RECENTES */}
            <section className={styles.homeSection}>
              <h2 className={styles.sectionTitle}>
                JOGOS RECENTES <span className={styles.arrow}>▼</span>
              </h2>
              <div className={styles.gameGrid}>
                {recentGames.map(game => (
                  <Link 
                    to={`/jogo/${game._id}`} // 💡 CORRIGIDO: Agora envia para /jogo/ID_DO_MONGO
                    key={`recent-${game._id}`} 
                    className={styles.gameCard}
                    style={{ backgroundImage: `url(${game.cover || '/capas/default.png'})` }}
                  >
                    {game.titulo === "Counter-Strike 2" && (
                      <div className={styles.playtimeBadge}>
                        <button className={styles.miniPlayBtn}>▶</button>
                        <div className={styles.playtimeText}>
                          <span>TEMPO DE JOGO</span>
                          <strong>{game.playtime || "2300 h"}</strong>
                        </div>
                      </div>
                    )}
                    <span className={styles.cardTitle}>{game.titulo}</span>
                  </Link>
                ))}
              </div>
            </section>

            <div className={styles.divider}></div>

            {/* SEÇÃO 2: TODOS OS JOGOS */}
            <section className={styles.homeSection}>
              <div className={styles.sectionHeaderRow}>
                <h2 className={styles.sectionTitle}>
                  TODOS OS JOGOS <span className={styles.count}>({filteredGames.length})</span> <span className={styles.arrow}>▼</span>
                </h2>
                <div className={styles.sortContainer}>
                  <span>ORDENAR:</span>
                  <button className={styles.sortButton}>Alfabeticamente ▼</button>
                </div>
              </div>
              
              <div className={styles.gameGrid}>
                {filteredGames.map(game => (
                  <Link 
                    to={`/jogo/${game._id}`} // 💡 CORRIGIDO: Agora envia para /jogo/ID_DO_MONGO
                    key={`all-${game._id}`} 
                    className={styles.gameCard}
                    style={{ backgroundImage: `url(${game.cover || '/capas/default.png'})` }}
                  >
                    <span className={styles.cardTitle}>{game.titulo}</span>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Biblioteca;