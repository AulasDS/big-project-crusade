import { useState } from "react";
import styles from "./style.module.scss";

interface Game {
  id: number;
  title: string;
  price: string;
  oldPrice?: string;
  discount?: number;
  rating: string;
  image: string;
  tags: string[];
}

// MUITOS JOGOS - Agora com os que você pediu
const featuredGames: Game[] = [
  { id: 1, title: "ELDEN RING", price: "R$ 199,90", oldPrice: "R$ 299,90", discount: 33, rating: "Muito Positivo", image: "https://i.pinimg.com/1200x/f2/f1/cd/f2f1cd9d86b932cc10194d91af30bcf1.jpg", tags: ["Souls-like", "Open World"] },
  { id: 2, title: "Dark Souls III", price: "R$ 119,90", oldPrice: "R$ 199,90", discount: 40, rating: "Muito Positivo", image: "https://i.pinimg.com/736x/cc/59/1b/cc591bb1f24a03668aeebd5e8af9953e.jpg", tags: ["Souls-like"] },
  { id: 3, title: "BLACK MYTH: WUKONG", price: "R$ 249,90", rating: "Muito Positivo", image: "https://i.pinimg.com/736x/cb/c2/b8/cbc2b811eac0e8e90ceb4c25062bf492.jpg", tags: ["Souls-like"] },
  { id: 4, title: "Bloodborne", price: "R$ 199,90", rating: "Muito Positivo", image: "https://i.pinimg.com/736x/26/9e/4c/269e4cb6d4395f802e9a66571580256b.jpg", tags: ["Souls-like"] },
];

const topSellers: Game[] = [
  { id: 5, title: "Arma Reforger", price: "R$ 204,04", rating: "Muito Positivo", image: "https://i.pinimg.com/1200x/23/7e/60/237e60be4d644784b238ef4dd5dd2107.jpg", tags: ["FPS"] },
  { id: 6, title: "Yandere Simulator", price: "Gratis", rating: "Muito Positivo", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg", tags: ["Souls-like"] },
  { id: 7, title: "Mortal Kombat 1", price: "R$ 139,90", rating: "Muito Positivo", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1971870/header.jpg", tags: ["Fighting"] },
  { id: 8, title: "Resident Evil 4", price: "R$ 79,90", rating: "Muito Positivo", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2050650/header.jpg", tags: ["Horror"] },
];

const discountGames: Game[] = [
  { id: 9, title: "Dark Souls Remastered", price: "R$ 59,90", oldPrice: "R$ 129,90", discount: 54, rating: "Muito Positivo", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/570940/header.jpg", tags: ["Souls-like"] },
  { id: 10, title: "Dark Souls III", price: "R$ 119,90", oldPrice: "R$ 199,90", discount: 40, rating: "Muito Positivo", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/374320/header.jpg", tags: ["Souls-like"] },
  { id: 11, title: "Bloodborne", price: "R$ 199,90", rating: "Muito Positivo", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1283290/header.jpg", tags: ["Souls-like"] },
  { id: 12, title: "Resident Evil 4", price: "R$ 79,90", oldPrice: "R$ 199,90", discount: 60, rating: "Muito Positivo", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2050650/header.jpg", tags: ["Horror"] },
  { id: 13, title: "Mortal Kombat 1", price: "R$ 139,90", oldPrice: "R$ 279,90", discount: 50, rating: "Muito Positivo", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1971870/header.jpg", tags: ["Fighting"] },
  { id: 14, title: "Cuphead", price: "R$ 39,90", oldPrice: "R$ 79,90", discount: 50, rating: "Muito Positivo", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/268910/header.jpg", tags: ["Indie", "Run & Gun"] },
  { id: 15, title: "Nioh 2", price: "R$ 99,90", oldPrice: "R$ 199,90", discount: 50, rating: "Muito Positivo", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1325200/header.jpg", tags: ["Souls-like"] },
];

const recommendedGames: Game[] = [
  ...discountGames,
  { id: 16, title: "Sekiro: Shadows Die Twice", price: "R$ 179,90", rating: "Muito Positivo", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/814380/header.jpg", tags: ["Souls-like"] },
  { id: 17, title: "Resident Evil Village", price: "R$ 89,90", oldPrice: "R$ 159,90", discount: 44, rating: "Muito Positivo", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1196590/header.jpg", tags: ["Horror"] },
  { id: 18, title: "My Femboy Roommate", price: "R$ 24,90", rating: "Positivo", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2486320/header.jpg", tags: ["Indie"] },
  { id: 19, title: "Lies of P", price: "R$ 149,90", oldPrice: "R$ 249,90", discount: 40, rating: "Muito Positivo", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1627720/header.jpg", tags: ["Souls-like"] },
  { id: 20, title: "God of War", price: "R$ 159,90", rating: "Muito Positivo", image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1593500/header.jpg", tags: ["Action"] },
];

export default function Loja() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className={styles.storeContainer}>
      <main>
        <section className={styles.featuredSection}>
          <h2>EM DESTAQUE</h2>
          <div className={styles.featuredGrid}>
            {featuredGames.map((game) => (
              <div key={game.id} className={styles.featuredCard}
                onMouseEnter={() => setHovered(game.id)}
                onMouseLeave={() => setHovered(null)}>
                <img src={game.image} alt={game.title} />
                <div className={styles.gameInfo}>
                  <h3>{game.title}</h3>
                  <div className={styles.tags}>{game.tags.join(" • ")}</div>
                  {game.discount && <div className={styles.discount}>-{game.discount}%</div>}
                  <div className={styles.price}>
                    {game.oldPrice && <s>{game.oldPrice}</s>}
                    <span>{game.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>MAIS VENDIDOS</h2>
          <div className={styles.gamesGrid}>
            {topSellers.map(game => (
              <div key={game.id} className={styles.gameCard}>
                <img src={game.image} alt={game.title} />
                <div className={styles.gameInfo}>
                  <h4>{game.title}</h4>
                  <div className={styles.price}>{game.price}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>DESCONTOS E EVENTOS</h2>
          <div className={styles.gamesGrid}>
            {discountGames.map(game => (
              <div key={game.id} className={styles.gameCard}>
                <img src={game.image} alt={game.title} />
                <div className={styles.gameInfo}>
                  <h4>{game.title}</h4>
                  <p className={styles.rating}>{game.rating}</p>
                  <div className={styles.price}>
                    {game.oldPrice && <s>{game.oldPrice}</s>}
                    <strong>{game.price}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>RECOMENDADOS PARA VOCÊ</h2>
          <div className={styles.gamesGrid}>
            {recommendedGames.map(game => (
              <div key={game.id} className={styles.gameCard}>
                <img src={game.image} alt={game.title} />
                <div className={styles.gameInfo}>
                  <h4>{game.title}</h4>
                  <div className={styles.tags}>{game.tags.join(" • ")}</div>
                  <div className={styles.price}>{game.price}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}