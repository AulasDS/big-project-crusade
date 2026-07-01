import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  requisitos?: string; // 💡 Atualizado na interface para receber do banco
}

export const JogoDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [jogo, setJogo] = useState<Jogo | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados da Avaliação
  const [nota, setNota] = useState<number>(5);
  const [comentario, setComentario] = useState<string>('');
  const [idUsuario, setIdUsuario] = useState<string>('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const dadosLocais = localStorage.getItem('usuarioLogado');
    if (dadosLocais) {
      const usuario = JSON.parse(dadosLocais);
      setIdUsuario(usuario.id);
    }

    const carregarDados = async () => {
      try {
        console.log("Buscando dados para o ID do jogo:", id);
        
        const resJogo = await fetch(`http://localhost:3000/jogo/${id}`);
        const dataJogo = await resJogo.json();
        
        console.log("Resposta bruta da API de Jogo:", dataJogo);

        if (dataJogo.data) {
          setJogo(dataJogo.data);
        } else if (dataJogo && dataJogo.titulo) {
          setJogo(dataJogo);
        } else {
          console.error("Formato de resposta inesperado do Back-end:", dataJogo);
        }

        if (dadosLocais) {
          const usuario = JSON.parse(dadosLocais);
          const resAval = await fetch(`http://localhost:3000/avaliacoes/${usuario.id}/${id}`);
          if (resAval.ok) {
            const dataAval = await resAval.json();
            if (dataAval.data) {
              setNota(dataAval.data.nota);
              setComentario(dataAval.data.comentario);
            }
          }
        }
      } catch (err) {
        console.error("Erro fatal ao carregar dados na página:", err);
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, [id]);

  const salvarAvaliacao = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await fetch('http://localhost:3000/avaliacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ iduser: idUsuario, idjogo: id, nota, comentario })
      });
      alert("Avaliação salva com sucesso!");
    } catch (err) {
      alert("Erro ao salvar.");
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return <div style={{ color: '#fff', textAlign: 'center', padding: '100px' }}>Carregando dados da Steam...</div>;
  }

  if (!jogo) {
    return (
      <div style={{ color: '#fff', textAlign: 'center', padding: '100px' }}>
        <h2>Jogo não encontrado ou erro na API!</h2>
        <p>Verifique o console do navegador (F12) para ver os logs do fetch.</p>
        <button onClick={() => navigate('/biblioteca')} style={{ padding: '10px', marginTop: '20px', cursor: 'pointer' }}>
          Voltar para Biblioteca
        </button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper} style={{ backgroundImage: `linear-gradient(to bottom, rgba(27, 40, 56, 0.8), #1b2838), url(${jogo.cover})` }}>
      
      <button className={styles.backButton} onClick={() => navigate('/biblioteca')}>
        ← VOLTAR PARA A BIBLIOTECA
      </button>

      <div className={styles.container}>
        {/* COLUNA ESQUERDA */}
        <div className={styles.leftCol}>
          <h1 className={styles.title}>{jogo.titulo}</h1>
          
          <div className={styles.banner} style={{ backgroundImage: `url(${jogo.cover})` }}></div>

          <div className={styles.playBar}>
            <button className={styles.playBtn}>▶ JOGAR</button>
            <div className={styles.stats}>
              <span>TEMPO JOGADO</span>
              <strong>0 horas (Pronto para iniciar)</strong>
            </div>
          </div>

          <div className={styles.section}>
            <h3>SOBRE O JOGO</h3>
            <p>{jogo.descricao}</p>
          </div>

          {/* BOX DE AVALIAÇÃO */}
          <div className={styles.reviewBox}>
            <h3>SUA ANÁLISE</h3>
            <form onSubmit={salvarAvaliacao}>
              <div className={styles.inputGroup}>
                <label>O que achou do jogo?</label>
                <select value={nota} onChange={(e) => setNota(Number(e.target.value))}>
                  <option value={5}>⭐⭐⭐⭐⭐ Excelente</option>
                  <option value={4}>⭐⭐⭐⭐ Muito Bom</option>
                  <option value={3}>⭐⭐⭐ Regular</option>
                  <option value={2}>⭐⭐ Ruim</option>
                  <option value={1}>⭐ Péssimo</option>
                </select>
              </div>
              <textarea 
                placeholder="Escreva aqui sua opinião sobre o jogo..." 
                value={comentario} 
                onChange={(e) => setComentario(e.target.value)}
              />
              <button type="submit" disabled={enviando}>
                {enviando ? 'Salvando...' : 'PUBLICAR ANÁLISE'}
              </button>
            </form>
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

          {/* 💡 BOX DE REQUISITOS TOTALMENTE DINÂMICO */}
          <div className={styles.requirementsBox}>
            <h4>Requisitos do Sistema</h4>
            {jogo.requisitos && jogo.requisitos.trim() !== "" ? (
              // O whiteSpace: 'pre-line' quebra as linhas certinho igual você digitar no banco
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

export default JogoDetalhes;