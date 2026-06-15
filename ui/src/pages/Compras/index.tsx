import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

interface Produto {
    _id: string;
    nome: string;
}

interface Cliente {
    _id: string;
    nome: string;
}

interface Compra {
    _id: string;
    produtoId: Produto | string;
    clienteId: Cliente | string;
    quantidade: number;
    data: string;
}

export default function Compras() {
    const [compras, setCompras] = useState<Compra[]>([]);

    useEffect(() => {
        const buscarCompras = async () => {
            try {
                const response = await axios.get('http://localhost:3000/compra');
                const listaCompras = response.data.data || response.data;
                setCompras(listaCompras);
            } catch (error) {
                console.error("Erro ao buscar compras:", error);
                alert("Erro ao carregar a lista de compras.");
            }
        };

        buscarCompras();
    }, []);

    const renderizarNome = (dado: any) => {
        if (!dado) return "Não informado";
        return dado.nome ? dado.nome : dado; 
    };

    const formatarData = (dataIso?: string) => {
        if (!dataIso) return "Sem data";
        return new Date(dataIso).toLocaleDateString('pt-BR');
    };

    return (
        <div className="container py-4">
            <h1 className="text-center mb-4 text-secondary" style={{ fontWeight: 600 }}>Compras Realizadas</h1>
            
            <div className="d-flex gap-2 mb-4 justify-content-center">
                <Link className="btn btn-primary px-4 fw-medium" to="/inserir-compra/">+ Inserir Compra</Link>
                <Link className="btn btn-outline-primary px-4 fw-medium" to="/inserir-cliente/">+ Inserir Cliente</Link>
            </div>

            <div className="table-responsive shadow-sm rounded">
                <table className="table table-striped table-hover mb-0 align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Produto</th>
                            <th>Cliente</th>
                            <th>Quantidade</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {compras.length > 0 ? (
                            compras.map((compra) => (
                                <tr key={compra._id}>
                                    <td className="fw-medium">{renderizarNome(compra.produtoId)}</td>
                                    <td>{renderizarNome(compra.clienteId)}</td>
                                    <td>{compra.quantidade}</td>
                                    <td>{formatarData(compra.data)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-4 text-muted">
                                    Nenhuma compra registrada ainda.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}