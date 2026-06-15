import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function InserirCliente() {

    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        
        const nome = formData.get('nome') as string;
        const email = formData.get('email') as string;
        const nascimento = formData.get('nascimento') as string;

        axios.post('http://localhost:3000/cliente', { nome, email, nascimento })
            .then(() => {
                navigate('/clientes');
            })
            .catch((error) => {
                alert("Erro ao inserir cliente. Verifique o console.");
                console.error(error);
            });
    }

    return (
        <div className="d-flex justify-content-center mt-5 align-items-center">
            <div className="card shadow-sm p-4 w-100" style={{ maxWidth: '450px', borderRadius: '12px' }}>
                <h2 className="text-center mb-4 text-secondary fw-semibold">Inserir Cliente</h2>

                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                    
                    <div>
                        <label className="form-label text-muted small fw-medium">Nome Completo</label>
                        <input
                            type="text"
                            className="form-control form-control-lg fs-6"
                            placeholder="Ex: João da Silva"
                            name="nome"
                            required
                        />
                    </div>

                    <div>
                        <label className="form-label text-muted small fw-medium">E-mail</label>
                        <input
                            type="email"
                            className="form-control form-control-lg fs-6"
                            placeholder="Ex: joao@email.com"
                            name="email"
                            required
                        />
                    </div>

                    <div>
                        <label className="form-label text-muted small fw-medium">Data de Nascimento</label>
                        <input
                            type="date"
                            className="form-control form-control-lg fs-6"
                            name="nascimento"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100 mt-2 fw-medium"
                        style={{ borderRadius: '8px', backgroundColor: '#4F46E5', borderColor: '#4F46E5' }}
                    >
                        Salvar Cliente
                    </button>
                </form>
            </div>
        </div>
    )
}