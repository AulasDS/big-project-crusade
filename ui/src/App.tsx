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
        <Route path='/inserir-compra/' element={<InserirCompra />} />
        <Route path='/clientes/' element={<Clientes />} />
        <Route path='/inserir-cliente/' element={<InserirCliente />} />
      </Routes>
    </>
  )
}

export default App