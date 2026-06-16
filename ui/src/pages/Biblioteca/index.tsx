import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importação necessária para o roteamento
import styles from './style.module.scss';

// Interface com o campo 'cover' e 'path' obrigatórios
export interface Game {
  id: number;
  title: string;
  genre: string;
  playtime: string;
  lastPlayed: string;
  achievementProgress: string;
  cover: string; 
  path: string; // Caminho da página interna do jogo
}

// Dados com os paths alinhados PERFEITAMENTE com o seu App.tsx
const gamesList: Game[] = [
  { 
    id: 1, 
    title: "Rocket League", 
    genre: "Esporte, Corrida", 
    playtime: "108min", 
    lastPlayed: "Setembro", 
    achievementProgress: "4/5",
    cover: "/capas/rocket.png",
    path: "/Rocket"
  },
  { 
    id: 2, 
    title: "Subnautica", 
    genre: "Sobrevivencia, Exploração, Aventura", 
    playtime: "12 h", 
    lastPlayed: "Setembro", 
    achievementProgress: "1/5",
    cover: "/capas/subnautica.png",
    path: "/Subnautica"
  },
  { 
    id: 3, 
    title: "Celeste", 
    genre: "Plataforma, Aventura", 
    playtime: "108 min", 
    lastPlayed: "Esta semana", 
    achievementProgress: "1/3",
    cover: "/capas/celeste.png",
    path: "/Celeste"
  },
  { 
    id: 4, 
    title: "Cuphead", 
    genre: "MOBA, Hero Shooter", 
    playtime: "512 h", 
    lastPlayed: "Setembro", 
    achievementProgress: "12/30",
    cover: "/capas/cuphead.png",
    path: "/Cuphead"
  },
  { 
    id: 5, 
    title: "Forza Horizon 6", 
    genre: "Corrida, Mundo aberto", 
    playtime: "250 h", 
    lastPlayed: "Agosto", 
    achievementProgress: "1/1",
    cover: "/capas/forza.png",
    path: "/Forza"
  },
  { 
    id: 6, 
    title: "Grand Theft Auto V", 
    genre: "Mundo Aberto", 
    playtime: "340 h", 
    lastPlayed: "Agosto", 
    achievementProgress: "2/3",
    cover: "/capas/gta.png",
    path: "/Gta"
  },
  { 
    id: 7, 
    title: "Persona 3 Reload", 
    genre: "RPG", 
    playtime: "42 h", 
    lastPlayed: "Ontem", 
    achievementProgress: "2/3",
    cover: "/capas/persona.png",
    path: "/Persona3"
  },
  { 
    id: 8, 
    title: "Counter Strike 2", 
    genre: "FPS", 
    playtime: "3000 h", 
    lastPlayed: "Setembro", 
    achievementProgress: "1/2",
    cover: "/capas/cs.png",
    path: "/Cs2"
  },
  { 
    id: 9, 
    title: "Dragon Ball FighterZ", 
    genre: "Ação, Luta", 
    playtime: "35 h", 
    lastPlayed: "Agosto", 
    achievementProgress: "2/2",
    cover: "/capas/db.png",
    path: "/Dbfz"
  },
  { 
    id: 10, 
    title: "Devil May Cry 5", 
    genre: "Ação, Hack 'n Slash, Ação de Personagem", 
    playtime: "14 h", 
    lastPlayed: "Há meses", 
    achievementProgress: "1/2",
    cover: "/capas/dmc.png",
    path: "/Dmc5"
  },
  { 
    id: 11, 
    title: "The Forest", 
    genre: "Sobrevivencia, Exploração, Aventura", 
    playtime: "94 h", 
    lastPlayed: "Julho", 
    achievementProgress: "0/2",
    cover: "/capas/forest.png",
    path: "/TheForest"
  }
];

export const Biblioteca: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGames = gamesList.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentGames = gamesList.slice(0, 6);

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
        {/* SEÇÃO 1: JOGOS RECENTES */}
        <section className={styles.homeSection}>
          <h2 className={styles.sectionTitle}>
            JOGOS RECENTES <span className={styles.arrow}>▼</span>
          </h2>
          <div className={styles.gameGrid}>
            {recentGames.map(game => (
              <Link 
                to={game.path} 
                key={`recent-${game.id}`} 
                className={styles.gameCard}
                style={{ backgroundImage: `url(${game.cover})` }}
              >
                {game.id === 1 && (
                  <div className={styles.playtimeBadge}>
                    <button className={styles.miniPlayBtn}>▶</button>
                    <div className={styles.playtimeText}>
                      <span>TEMPO DE JOGO</span>
                      <strong>{game.playtime}</strong>
                    </div>
                  </div>
                )}
                <span className={styles.cardTitle}>{game.title}</span>
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
                to={game.path} 
                key={`all-${game.id}`} 
                className={styles.gameCard}
                style={{ backgroundImage: `url(${game.cover})` }}
              >
                <span className={styles.cardTitle}>{game.title}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

    </div>
  );
};

export default Biblioteca;