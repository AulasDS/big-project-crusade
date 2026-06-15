import React, { useState } from 'react';
import styles from './style.module.scss';

// 1. Interface com o campo 'cover' obrigatório para as URLs das imagens
export interface Game {
  id: number;
  title: string;
  genre: string;
  playtime: string;
  lastPlayed: string;
  achievementProgress: string;
  cover: string; 
}

// 2. Dados atualizados com links diretos para as imagens de capa
const gamesList: Game[] = [
  { 
    id: 1, 
    title: "Rocket League", 
    genre: "RPG", 
    playtime: "108min", 
    lastPlayed: "Setembro", 
    achievementProgress: "4/5",
    cover: "" 
  },
  { 
    id: 2, 
    title: "Subnautica", 
    genre: "RPG", 
    playtime: "12 h", 
    lastPlayed: "Setembro", 
    achievementProgress: "1/5",
    cover: "https://images.tcdn.com.br/img/img_prod/461111/game_south_park_the_fractured_but_whole_ps4_midia_fisica_38363_1_ee6fa8a7ee4fb512965bfcdbc5480521.jpg"
  },
  { 
    id: 3, 
    title: "Celeste", 
    genre: "Plataforma", 
    playtime: "108 min", 
    lastPlayed: "Esta semana", 
    achievementProgress: "1/3",
    cover: "https://upload.wikimedia.org/wikipedia/pt/f/f3/Celeste_capa.jpg"
  },
  { 
    id: 4, 
    title: "Deadlock", 
    genre: "Battle Royale", 
    playtime: "512 h", 
    lastPlayed: "Setembro", 
    achievementProgress: "12/30",
    cover: "https://upload.wikimedia.org/wikipedia/pt/7/70/PlayerUnknown%27s_Battlegrounds_capa.jpg"
  },
  { 
    id: 5, 
    title: "Forza Horizon 6", 
    genre: "Competitivo", 
    playtime: "2.450 h", 
    lastPlayed: "Agosto", 
    achievementProgress: "1/1",
    cover: "https://upload.wikimedia.org/wikipedia/pt/e/e9/Counter-Strike_Global_Offensive_capa.jpg"
  },
  { 
    id: 6, 
    title: "Grand Theft Auto V", 
    genre: "Mundo Aberto", 
    playtime: "340 h", 
    lastPlayed: "Agosto", 
    achievementProgress: "2/3",
    cover: "https://upload.wikimedia.org/wikipedia/pt/8/80/Grand_Theft_Auto_V_capa.png"
  },
  { 
    id: 7, 
    title: "Persona 3 Reload", 
    genre: "Simulação", 
    playtime: "42 h", 
    lastPlayed: "Ontem", 
    achievementProgress: "2/3",
    cover: "https://upload.wikimedia.org/wikipedia/pt/a/ab/Ace_Combat_7_Skies_Unknown_capa.jpg"
  },
  { 
    id: 8, 
    title: "Type Son :sob:", 
    genre: "FPS", 
    playtime: "Infinito", 
    lastPlayed: "Setembro", 
    achievementProgress: "1/2",
    cover: "https://upload.wikimedia.org/wikipedia/pt/3/30/Battlefield_Bad_Company_2_capa.jpg"
  },
  { 
    id: 9, 
    title: "Dragon Ball FighterZ", 
    genre: "Tiro", 
    playtime: "35 h", 
    lastPlayed: "Agosto", 
    achievementProgress: "2/2",
    cover: "https://upload.wikimedia.org/wikipedia/pt/4/4e/Bioshock_Infinite_Capa.jpg"
  },
  { 
    id: 10, 
    title: "Devil May Cry 5", 
    genre: "Hack 'n Slash", 
    playtime: "14 h", 
    lastPlayed: "Há meses", 
    achievementProgress: "1/2",
    cover: "https://upload.wikimedia.org/wikipedia/pt/1/1a/Brutal_legend_capa.jpg"
  },
  { 
    id: 11, 
    title: "The Forest", 
    genre: "Simulação", 
    playtime: "94 h", 
    lastPlayed: "Julho", 
    achievementProgress: "0/2",
    cover: "https://upload.wikimedia.org/wikipedia/pt/4/42/Cities_Skylines_capa.jpg"
  }
];

export const Biblioteca: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGames = gamesList.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pega os 6 primeiros da lista para a prateleira de recentes
  const recentGames = gamesList.slice(0, 6);

  return (
    <div className={styles.libraryPageWrapper}>
      
      {/* Menu Interno da Biblioteca */}
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
              <div 
                key={`recent-${game.id}`} 
                className={styles.gameCard}
                style={{ backgroundImage: `url(${game.cover})` }} // Injeta o link no plano de fundo
              >
                {/* Badge de tempo de jogo exclusivo do South Park Stick of Truth */}
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
              <div 
                key={`all-${game.id}`} 
                className={styles.gameCard}
                style={{ backgroundImage: `url(${game.cover})` }} // Injeta o link no plano de fundo
              >
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