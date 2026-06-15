import React, { useState } from 'react';
import styles from './style.module.scss';

// 1. Definição Unificada da Interface do Jogo
export interface Game {
  id: number;
  title: string;
  genre: string;
  playtime: string;
  lastPlayed: string;
  achievementProgress: string;
  cover?: string;
}

// 2. Dados Reais Extraídos do seu Acervo da Steam
const gamesList: Game[] = [
  { id: 1, title: "South Park: The Stick of Truth", genre: "RPG", playtime: "108min", lastPlayed: "Setembro", achievementProgress: "4/5" },
  { id: 2, title: "South Park: The Fractured But Whole", genre: "RPG", playtime: "12 h", lastPlayed: "Setembro", achievementProgress: "1/5" },
  { id: 3, title: "Celeste", genre: "Plataforma", playtime: "108 min", lastPlayed: "Esta semana", achievementProgress: "1/3" },
  { id: 4, title: "PUBG: BATTLEGROUNDS", genre: "Battle Royale", playtime: "512 h", lastPlayed: "Setembro", achievementProgress: "12/30" },
  { id: 5, title: "Counter-Strike: Global Offensive", genre: "Competitivo", playtime: "2.450 h", lastPlayed: "Agosto", achievementProgress: "1/1" },
  { id: 6, title: "Grand Theft Auto V", genre: "Mundo Aberto", playtime: "340 h", lastPlayed: "Agosto", achievementProgress: "2/3" },
  { id: 7, title: "ACE COMBAT™ 7: SKIES UNKNOWN", genre: "Simulação", playtime: "42 h", lastPlayed: "Ontem", achievementProgress: "2/3" },
  { id: 8, title: "Battlefield: Bad Company 2", genre: "FPS", playtime: "118 h", lastPlayed: "Setembro", achievementProgress: "1/2" },
  { id: 9, title: "BioShock Infinite", genre: "Tiro", playtime: "35 h", lastPlayed: "Agosto", achievementProgress: "2/2" },
  { id: 10, title: "Brütal Legend", genre: "Hack 'n Slash", playtime: "14 h", lastPlayed: "Há meses", achievementProgress: "1/2" },
  { id: 11, title: "Cities: Skylines", genre: "Simulação", playtime: "94 h", lastPlayed: "Julho", achievementProgress: "0/2" }
];

export const Biblioteca: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtro de pesquisa acoplado à listagem geral
  const filteredGames = gamesList.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mapeia os 6 primeiros para exibição em destaque na prateleira de recentes
  const recentGames = gamesList.slice(0, 6);

  return (
    <div className={styles.libraryPageWrapper}>
      
      {/* Menu Interno de Sub-Navegação da Biblioteca */}
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
              <div key={`recent-${game.id}`} className={styles.gameCard}>
                {/* Exibe o overlay de tempo de jogo se for o South Park Stick of Truth (ID 1) */}
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
              </div>
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
              <div key={`all-${game.id}`} className={styles.gameCard}>
                <span className={styles.cardTitle}>{game.title}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

    </div>
  );
};

export default Biblioteca;