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
<<<<<<< HEAD
import Login from './pages/login'; 
import JogoDetalhes from './pages/jogoDetalhes'; // 💡 IMPORTADO AQUI: A nova página dinâmica padrão Steam
=======
import Carrinho from './pages/Carrinho';
>>>>>>> 9e67a8462c8ffcd4b76a7aa3d3f4d018e5b4b5dd

function App() {

  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/Home' element={<Home />} />
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
        <Route path='/Carrinho/' element={<Carrinho/>} />
      </Routes>
    </>
  )
}

export default App;