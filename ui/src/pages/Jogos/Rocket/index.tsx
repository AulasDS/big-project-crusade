import React from 'react';
import { Link } from 'react-router-dom';
import styles from './style.module.scss';

const Rocket: React.FC = () => {
  return (
    <div className={styles.gamePageContainer}>
      {/* Corrigido: O link agora aponta para '/Biblioteca', combinando com seu App.tsx */}
      <Link to="/Biblioteca" className={styles.backButton}>◀ VOLTAR PARA A BIBLIOTECA</Link>

      {/* Banner Superior com Imagem do Jogo */}
      <header className={styles.heroBanner}>
        <div className={styles.headerContent}>
          <h1 className={styles.gameTitle}>Rocket League</h1>
          <p className={styles.gameStatus}>ESPAÇO NECESSÁRIO: 67,33 GB</p>
        </div>
      </header>

      {/* Barra de Ações Verde (Padrão Steam) */}
      <section className={styles.actionBar}>
        <div className={styles.leftActions}>
          <button className={styles.playButton}>JOGAR</button>
          <div className={styles.playtimeInfo}>
            <span>TEMPO DE JOGO</span>
            <strong>108 min</strong>
          </div>
        </div>
        <div className={styles.actionIcons}>
          <button title="Configurações">⚙</button>
          <button title="Informações">ⓘ</button>
          <button title="Favoritar">❤</button>
        </div>
      </section>

      {/* Navegação Secundária */}
      <nav className={styles.gameNav}>
        <span className={styles.active}>Página na loja</span>
        <span>Conteúdo adicional</span>
        <span>Central da Comunidade</span>
        <span>Discussões</span>
        <span>Guias</span>
      </nav>

      {/* Conteúdo Principal */}
      <main className={styles.mainLayout}>
        <div className={styles.contentArea}>
          <div className={styles.eventBox}>
             <p>Nenhum evento recente disponível para este jogo.</p>
          </div>
        </div>

        {/* Sidebar Lateral (Amigos) */}
        <aside className={styles.sidebar}>
          <h3>AMIGOS QUE JOGAM</h3>
          <p className={styles.friendSummary}>5 amigos jogaram recentemente</p>
          <div className={styles.friendList}>
            <div className={styles.friendItem}>
              <div className={styles.avatarPlaceholder}></div>
              <div>
                <strong>metronyt21</strong>
                <span>jogou por 18,1 h</span>
              </div>
            </div>
            <div className={styles.friendItem}>
              <div className={styles.avatarPlaceholder}></div>
              <div>
                <strong>Patoo</strong>
                <span>jogou por 6 min</span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Rocket;