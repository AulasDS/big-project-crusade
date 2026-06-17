import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ListaProdutos from './pages/ListaProdutos';
import NavBar from './components/navBar';
import InserirProduto from './pages/InserirProduto';
import EditarProduto from './pages/EditarProduto';
import Compras from './pages/Compras';
import InserirCompra from './pages/InserirCompra';
import InserirCliente from './pages/InserirClientes';
import Clientes from './pages/Clientes';
import Biblioteca from './pages/Biblioteca';
import Rocket from './pages/Jogos/Rocket';
import Carrinho from './pages/Carrinho';

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
        <Route path='/inserir-compra/' element={<InserirCompra />} />
        <Route path='/clientes/' element={<Clientes />} />
        <Route path='/inserir-cliente/' element={<InserirCliente />} />
        <Route path='/Biblioteca/' element={<Biblioteca />} />
        <Route path='/Rocket/' element={<Rocket/>} />
        <Route path='/Carrinho/' element={<Carrinho/>} />
      </Routes>
    </>
  )
}

export default App