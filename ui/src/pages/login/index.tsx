import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.scss'; // Crie um estilo básico para a tela

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');

        try {
            // Faz a chamada para a sua API (ajuste a porta se não for 3000)
            const response = await fetch('http://localhost:3000/api/usuario/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao fazer login');
            }

            // Login com sucesso! Salva o usuário no localStorage para a NavBar saber quem está logado
            localStorage.setItem('usuarioLogado', JSON.stringify(data));
            
            // Redireciona de volta para a biblioteca ou loja
            navigate('/Biblioteca');

        } catch (err: any) {
            setErro(err.message);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <h2>INICIAR SESSÃO</h2>
                
                {erro && <p className={styles.erro}>{erro}</p>}

                <label>E-mail</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                <label>Senha</label>
                <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />

                <button type="submit">Iniciar sessão</button>
            </form>
        </div>
    );
}