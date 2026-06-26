import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './style.module.scss';

export default function NavBar() {
    const [showMenu, setShowMenu] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Estado inicial padrão (Garante o Convidado caso não ache ninguém)
    const [usuario, setUsuario] = useState<any>({
        nome: 'CONVIDADO',
        foto: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=guest'
    });

    useEffect(() => {
        const dadosLocais = localStorage.getItem('usuarioLogado');
        if (dadosLocais) {
            const dadosConvertidos = JSON.parse(dadosLocais);
            setUsuario(dadosConvertidos);
            
            // 💡 DICA DE OURO: Olhe esse log no F12 do navegador. Se o campo "foto" estiver undefined ou vazio,
            // significa que você precisa atualizar o cadastro do Gabriel no banco ou ajustar a rota de Login no Back-end!
            console.log("Mongoose Usuario carregado na NavBar:", dadosConvertidos);
        }
    }, [location]);

    const handleTrocarConta = () => {
        localStorage.removeItem('usuarioLogado');
        setShowMenu(false);
        navigate('/login');
    };

    // Se o Gabriel tiver uma URL no campo 'foto', usa ela. Senão, puxa um pixel-art com o nome dele!
    const avatarFinal = usuario.foto && usuario.foto.trim() !== "" 
        ? usuario.foto 
        : `https://api.dicebear.com/7.x/pixel-art/svg?seed=${usuario.nome || 'Gabriel'}`;

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>

                <div className={styles.menu}>
                    <Link to="/Home" className={styles.navLink}>
                        LOJA
                    </Link>
                    
                    <Link 
                        to="/Biblioteca" 
                        className={`${styles.navLink} ${location.pathname === '/Biblioteca' ? styles.active : ''}`}
                    >
                        BIBLIOTECA
                    </Link>

                    {/* 💡 NOVO LINK DO CARRINHO ADICIONADO NA NAVBAR */}
                    <Link 
                        to="/carrinho" 
                        className={`${styles.navLink} ${location.pathname === '/carrinho' ? styles.active : ''}`}
                    >
                        🛒 CARRINHO
                    </Link>

                    {/* Área de Perfil */}
                    <div className={styles.profileContainer}>
                        <button
                            className={styles.profileButton}
                            onClick={() => setShowMenu(!showMenu)}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                        >
                            <span>{usuario.nome ? usuario.nome.toUpperCase() : 'GABRIEL'}</span>
                            <span className={styles.arrow}>▼</span>
                            
                            {/* Moldura da foto respeitando o UsuarioSchema */}
                            <div style={{ border: '2px solid #4c6c8c', padding: '1px', display: 'flex', background: '#171a21' }}>
                                <img 
                                    src={avatarFinal} 
                                    alt="Avatar do Usuário" 
                                    style={{ 
                                        width: '32px', 
                                        height: '32px', 
                                        display: 'block', 
                                        imageRendering: 'pixelated',
                                        objectFit: 'cover'
                                    }} 
                                />
                            </div>
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

            </div>
        </nav>
    );
}