import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './style.module.scss'; 

interface Jogo {
  _id: string;
  titulo: string;
  descricao: string;
  genero: string;
  tipo: string;
  desenvolvedora: string;
  publicadora: string;
  plataforma: string;
  cover?: string;
  requisitos?: string;
  preco?: number;
  discount?: number;
}

interface Avaliacao {
  _id: string;
  usuario: {
    nome: string;
    foto?: string;
  };
  recomenda: boolean;
  comentario: string;
  createdAt?: string;
}

export const JogoLoja: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [jogo, setJogo] = useState<Jogo | null>(null);
  const [loading, setLoading] = useState(true);
  const [jaPossui, setJaPossui] = useState(false);
  const [comprando, setComprando] = useState(false);

  // Estados do Sistema de Avaliação
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [recomenda, setRecomenda] = useState<boolean | null>(null);
  const [comentario, setComentario] = useState('');
  const [enviandoAvaliacao, setEnviandoAvaliacao] = useState(false);
  const [idUsuarioLogado, setIdUsuarioLogado] = useState<string | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // 1. Carrega dados do Jogo
        const resJogo = await fetch(`http://localhost:3000/jogo/${id}`);
        const dataJogo = await resJogo.json();

        if (dataJogo.data) {
          setJogo(dataJogo.data);
        } else if (dataJogo && dataJogo.titulo) {
          setJogo(dataJogo);
        } else {
          console.error('Formato de resposta inesperado do Back-end:', dataJogo);
        }

        // 2. Carrega as Avaliações do Jogo
        try {
          const resAvaliacoes = await axios.get(`http://localhost:3000/avaliacao/jogo/${id}`);
          if (resAvaliacoes.data && resAvaliacoes.data.data) {
            setAvaliacoes(resAvaliacoes.data.data);
          }
        } catch (err) {
          console.warn('Nenhuma avaliação encontrada ou erro ao carregar avaliações.');
        }

        // 3. Verifica biblioteca do usuário logado
        const dadosLocais = localStorage.getItem('usuarioLogado');
        if (dadosLocais) {
          try {
            const usuario = JSON.parse(dadosLocais);
            const idUsuarioReal = usuario?.id || usuario?._id;
            setIdUsuarioLogado(idUsuarioReal);

            if (idUsuarioReal) {
              const respostaBiblioteca = await axios.get(
                `http://localhost:3000/biblioteca/${idUsuarioReal}`
              );
              const biblioteca = respostaBiblioteca.data;

              if (biblioteca?.data?.jogos && Array.isArray(biblioteca.data.jogos)) {
                const idsJogosBiblioteca = biblioteca.data.jogos.map((item: any) =>
                  String(item._id || item.id || item)
                );
                setJaPossui(idsJogosBiblioteca.includes(String(id)));
              }
            }
          } catch (err) {
            console.warn('Usuário não tem biblioteca ou erro ao ler o localStorage.');
          }
        }
      } catch (err) {
        console.error('Erro fatal ao carregar dados na página da loja:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) carregarDados();
  }, [id]);

  const adicionarAoCarrinho = async () => {
    const dadosLocais = localStorage.getItem('usuarioLogado');
    if (!dadosLocais) {
      alert('Você precisa estar logado para adicionar itens ao carrinho!');
      return;
    }

    setComprando(true);
    try {
      const usuario = JSON.parse(dadosLocais);
      const idUsuarioReal = usuario.id || usuario._id;

      await axios.put(`http://localhost:3000/carrinho/${idUsuarioReal}`, {
        idjogo: id,
      });

      alert(`${jogo?.titulo} foi adicionado ao seu carrinho!`);
    } catch (error: any) {
      console.error('Erro ao adicionar ao carrinho:', error);
      alert('Erro ao adicionar ao carrinho. Verifique o console.');
    } finally {
      setComprando(false);
    }
  };

  // Enviar nova avaliação para o Back-end
  const handleEnviarAvaliacao = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idUsuarioLogado) {
      alert('Você precisa estar logado para avaliar este jogo!');
      return;
    }

    if (recomenda === null) {
      alert('Por favor, selecione se você Recomenda 👍 ou Não Recomenda 👎 o jogo.');
      return;
    }

    if (!comentario.trim()) {
      alert('Por favor, escreva um breve comentário sobre a sua experiência.');
      return;
    }

    setEnviandoAvaliacao(true);
    try {
      const resposta = await axios.post(`http://localhost:3000/avaliacao`, {
        iduser: idUsuarioLogado,
        idjogo: id,
        recomenda: recomenda,
        comentario: comentario
      });

      alert('Avaliação enviada com sucesso!');
      
      // Adiciona a nova avaliação na lista da tela na hora
      if (resposta.data && resposta.data.data) {
        setAvaliacoes(prev => [resposta.data.data, ...prev]);
      }

      // Limpa os campos do formulário
      setComentario('');
      setRecomenda(null);

    } catch (error: any) {
      console.error('Erro ao enviar avaliação:', error);
      alert(error.response?.data?.message || 'Erro ao processar sua avaliação.');
    } finally {
      setEnviandoAvaliacao(false);
    }
  };

  if (loading) {
    return (
      <div style={{ color: '#fff', textAlign: 'center', padding: '100px' }}>
        Carregando dados da loja...
      </div>
    );
  }

  if (!jogo) {
    return (
      <div style={{ color: '#fff', textAlign: 'center', padding: '100px' }}>
        <h2>Jogo não encontrado ou erro na API!</h2>
        <button
          onClick={() => navigate('/loja')}
          style={{ padding: '10px', marginTop: '20px', cursor: 'pointer' }}
        >
          Voltar para Loja
        </button>
      </div>
    );
  }

  const precoFormatado =
    typeof jogo.preco === 'number'
      ? `R$ ${jogo.preco.toFixed(2).replace('.', ',')}`
      : jogo.preco;

  return (
    <div
      className={styles.wrapper}
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(27, 40, 56, 0.8), #1b2838), url(${jogo.cover})`,
      }}
    >
      <button className={styles.backButton} onClick={() => navigate('/loja')}>
        ← VOLTAR PARA A LOJA
      </button>

      <div className={styles.containerLoja}>
        {/* COLUNA ESQUERDA */}
        <div className={styles.leftCol}>
          <h1 className={styles.title}>{jogo.titulo}</h1>

          <div className={styles.banner} style={{ backgroundImage: `url(${jogo.cover})` }}></div>

          {/* BARRA DE COMPRA */}
          <div className={styles.buyBar}>
            {jaPossui ? (
              <>
                <div className={styles.ownedTag}>VOCÊ JÁ POSSUI ESTE JOGO</div>
                <button className={styles.playBtn} onClick={() => navigate('/biblioteca')}>
                  ▶ IR PARA BIBLIOTECA
                </button>
              </>
            ) : (
              <>
                <div className={styles.priceTag}>
                  {jogo.discount ? <span className={styles.discountBadge}>-{jogo.discount}%</span> : null}
                  <strong>{precoFormatado}</strong>
                </div>
                <button
                  className={styles.buyBtn}
                  onClick={adicionarAoCarrinho}
                  disabled={comprando}
                >
                  {comprando ? 'Adicionando...' : '🛒 ADICIONAR AO CARRINHO'}
                </button>
              </>
            )}
          </div>

          <div className={styles.section}>
            <h3>SOBRE O JOGO</h3>
            <p>{jogo.descricao}</p>
          </div>

          <div className={styles.divider} style={{ margin: '30px 0', borderBottom: '1px solid #233c51' }}></div>

          {/* 🎯 SEÇÃO DE AVALIAÇÃO */}
          <div className={styles.reviewSection}>
            <h3>AVALIE ESTE JOGO</h3>
            
            {idUsuarioLogado ? (
              <form onSubmit={handleEnviarAvaliacao} className={styles.reviewForm}>
                <p style={{ color: '#c6d4df', marginBottom: '10px' }}>Você recomenda este jogo?</p>
                
                <div className={styles.voteButtons} style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                  <button
                    type="button"
                    onClick={() => setRecomenda(true)}
                    style={{
                      padding: '10px 20px',
                      background: recomenda === true ? '#66c0f4' : '#2a475e',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '3px',
                      fontWeight: 'bold'
                    }}
                  >
                    👍 Sim
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecomenda(false)}
                    style={{
                      padding: '10px 20px',
                      background: recomenda === false ? '#a34c4c' : '#2a475e',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '3px',
                      fontWeight: 'bold'
                    }}
                  >
                    👎 Não
                  </button>
                </div>

                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Escreva sua análise aqui..."
                  rows={4}
                  style={{
                    width: '100%',
                    background: '#233c51',
                    color: '#fff',
                    border: '1px solid #4582a5',
                    padding: '10px',
                    borderRadius: '3px',
                    resize: 'vertical',
                    marginBottom: '15px'
                  }}
                />

                <button
                  type="submit"
                  disabled={enviandoAvaliacao}
                  style={{
                    padding: '10px 25px',
                    background: '#a3ff00',
                    color: '#000',
                    border: 'none',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    borderRadius: '3px'
                  }}
                >
                  {enviandoAvaliacao ? 'Enviando...' : 'Postar Análise'}
                </button>
              </form>
            ) : (
              <p style={{ color: '#ffb700' }}>⚠️ Faça login para poder avaliar este jogo.</p>
            )}

            <h3 style={{ marginTop: '40px', marginBottom: '20px' }}>Análises dos Usuários</h3>
            
            {avaliacoes.length === 0 ? (
              <p style={{ color: '#8f98a0' }}>Este jogo ainda não possui análises escritas. Seja o primeiro!</p>
            ) : (
              <div className={styles.reviewsList} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {avaliacoes.map((av) => (
                  <div 
                    key={av._id} 
                    className={styles.reviewCard} 
                    style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '15px', borderRadius: '4px', borderLeft: av.recomenda ? '4px solid #66c0f4' : '4px solid #a34c4c' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <strong>{av.usuario?.nome || 'Usuário Anônimo'}</strong>
                      <span style={{ color: av.recomenda ? '#66c0f4' : '#a34c4c', fontWeight: 'bold' }}>
                        {av.recomenda ? '👍 Recomendado' : '👎 Não Recomendado'}
                      </span>
                    </div>
                    <p style={{ color: '#acb2b8', whiteSpace: 'pre-wrap' }}>{av.comentario}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* COLUNA DIREITA (Sidebar) */}
        <div className={styles.rightCol}>
          <img src={jogo.cover} alt="Capa" className={styles.sideImage} />

          <div className={styles.infoList}>
            <div className={styles.infoRow}><span>Gênero:</span> <strong>{jogo.genero}</strong></div>
            <div className={styles.infoRow}><span>Desenvolvedor:</span> <strong>{jogo.desenvolvedora}</strong></div>
            <div className={styles.infoRow}><span>Distribuidora:</span> <strong>{jogo.publicadora}</strong></div>
            <div className={styles.infoRow}><span>Plataforma:</span> <strong>{jogo.plataforma}</strong></div>
          </div>

          <div className={styles.requirementsBox}>
            <h4>Requisitos do Sistema</h4>
            {jogo.requisitos && jogo.requisitos.trim() !== '' ? (
              <p style={{ whiteSpace: 'pre-line' }}>{jogo.requisitos}</p>
            ) : (
              <div>
                <p style={{ color: '#e44c4c', marginBottom: '8px' }}>⚠️ Requisitos não informados no banco.</p>
                <p><strong>SO:</strong> Windows 10/11 (64-bit)</p>
                <p><strong>Processador:</strong> Intel Core i5 ou equivalente</p>
                <p><strong>Memória:</strong> 8 GB de RAM</p>
                <p><strong>Armazenamento:</strong> 50 GB de espaço disponível</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JogoLoja;