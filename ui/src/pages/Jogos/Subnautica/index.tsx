import React from 'react';
import { Link } from 'react-router-dom';
import styles from './style.module.scss'; 

const Subnautica: React.FC = () => {
  return (
    <div className={styles.gamePageContainer}>
      <Link to="/Biblioteca" className={styles.backButton}>◀ VOLTAR PARA A BIBLIOTECA</Link>

      <header className={styles.heroBanner}>
        <div className={styles.headerContent}>
          {/* Mudou o Título */}
          <h1 className={styles.gameTitle}>Subnautica</h1>
          {/* Mudou o Espaço */}
          <p className={styles.gameStatus}>ESPAÇO NECESSÁRIO: 20,00 GB</p>
        </div>
      </header>

      <section className={styles.actionBar}>
        <div className={styles.leftActions}>
          <button className={styles.playButton}>JOGAR</button>
          <div className={styles.playtimeInfo}>
            <span>TEMPO DE JOGO</span>
            {/* Mudou o Tempo */}
            <strong>12 h</strong>
          </div>
        </div>
        <div className={styles.actionIcons}>
          <button title="Configurações">⚙</button>
          <button title="Informações">ⓘ</button>
          <button title="Favoritar">❤</button>
        </div>
      </section>

      <nav className={styles.gameNav}>
        <span className={styles.active}>Página na loja</span>
        <span>Conteúdo adicional</span>
        <span>Central da Comunidade</span>
      </nav>

      <main className={styles.mainLayout}>
        <div className={styles.contentArea}>
          <div className={styles.eventBox}>
             <p>Nenhum evento recente disponível para este jogo.</p>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <h3>AMIGOS QUE JOGAM</h3>
          <p className={styles.friendSummary}>1 amigo jogou recentemente</p>
          <div className={styles.friendList}>
            <div className={styles.friendItem}>
              <div className={styles.avatarPlaceholder}></div>
              <div>
                <strong>metronyt21</strong>
                <span>jogou por 2,4 h</span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Subnautica;