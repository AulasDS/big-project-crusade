import { Link } from 'react-router-dom';
import styles from './style.module.scss';

export default function NavBar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>

                <Link to="/loja" className={styles.logo}>
                    Steam
                </Link>

                <div className={styles.menu}>
                    <Link 
                        to="/loja" 
                        className={styles.navLink}
                    >
                        Loja
                    </Link>

                    <Link 
                        to="/Biblioteca" 
                        className={styles.navLink}
                    >
                        Biblioteca
                    </Link>
                </div>


                <div className={styles.profile}>
                    <Link 
                        to="/perfil" 
                        className={styles.profileLink}
                    >
                        Perfil
                    </Link>
                </div>

            </div>
        </nav>
    );
}