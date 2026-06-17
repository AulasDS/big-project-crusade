import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ListaProdutos from './pages/ListaProdutos';
import NavBar from './components/navBar';
import InserirProduto from './pages/InserirProduto';
import EditarProduto from './pages/EditarProduto';
import Compras from './pages/Compras';
import InserirCliente from './pages/InserirClientes';
import Clientes from './pages/Clientes';
import Biblioteca from './pages/Biblioteca';
import Rocket from './pages/Jogos/Rocket';
import Login from './pages/login'; 
import JogoDetalhes from './pages/jogoDetalhes'; // 💡 IMPORTADO AQUI: A nova página dinâmica padrão Steam

function App() {

  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/produtos' element={<ListaProdutos />} />
        <Route path='/inserir-produto' element={<InserirProduto />} />
        <Route path='/editar-produto/:id' element={<EditarProduto />} />
        <Route path='/compras/' element={<Compras />} />
        <Route path='/clientes/' element={<Clientes />} />
        <Route path='/inserir-cliente/' element={<InserirCliente />} />
        <Route path='/Biblioteca/' element={<Biblioteca />} />
        <Route path='/Rocket/' element={<Rocket/>} />
        
        {/* 💡 ADICIONADO AQUI: Rota dinâmica que recebe o ID do Mongo e abre os detalhes de qualquer jogo */}
        <Route path='/jogo/:id' element={<JogoDetalhes />} /> 
        
        <Route path='/login' element={<Login />} /> 
      </Routes>
    </>
  )
}

export default App;