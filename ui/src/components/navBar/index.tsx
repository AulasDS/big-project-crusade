import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './style.module.scss';

export default function NavBar() {
    const [showMenu, setShowMenu] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Estado para guardar o usuário vindo do banco (via localStorage)
    const [usuario, setUsuario] = useState({
        nome: 'CONVIDADO',
        foto: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=guest'
    });

    // useEffect busca os dados assim que a barra carrega ou muda de página
    useEffect(() => {
        const dadosLocais = localStorage.getItem('usuarioLogado');
        if (dadosLocais) {
            setUsuario(JSON.parse(dadosLocais));
        }
    }, [location]); // Fica de olho na rota caso o usuário mude de conta

    const handleTrocarConta = () => {
        localStorage.removeItem('usuarioLogado'); // Limpa a sessão
        setShowMenu(false);
        navigate('/login'); // Redireciona para a página de login criada
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>

                <Link to="/Home" className={styles.logo}>
                    Steam
                </Link>

                <div className={styles.menu}>
                    <Link 
                        to="/Home" 
                        className={styles.navLink}
                    >
                        LOJA
                    </Link>
                    <Link 
                        to="/Biblioteca" 
                        className={`${styles.navLink} ${location.pathname === '/Biblioteca' ? styles.active : ''}`}
                    >
                        BIBLIOTECA
                    </Link>

                    <div className={styles.profileContainer}>
                        <button
                            className={styles.profileButton}
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            <span>{usuario.nome.toUpperCase()}</span>
                            <span className={styles.arrow}>▼</span>
                        </button>

                        {showMenu && (
                            <div className={styles.profileMenu}>
                                <div className={styles.menuHeader}>
                                    Conta: <strong>{usuario.nome}</strong>
                                </div>
                                <hr className={styles.divider} />
                                <button className={styles.profileItem} onClick={handleTrocarConta}>
                                    Trocar de conta...
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.rightAvatarContainer}>
                    <img src={usuario.foto} alt={usuario.nome} className={styles.topAvatar} />
                </div>

            </div>
        </nav>
    );
}