import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/loja';
import ListaProdutos from './pages/ListaProdutos';
import NavBar from './components/navBar';
import Compras from './pages/Compras';
import InserirCliente from './pages/InserirClientes';
import Biblioteca from './pages/Biblioteca';
import JogoLoja from './pages/lojaJogo';
import Login from './pages/login'; 
import JogoDetalhes from './pages/jogoBiblioteca'; 
import Carrinho from './pages/Carrinho';

function App() {

  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/Home' element={<Home />} />
        <Route path='/produtos' element={<ListaProdutos />} />
        <Route path='/compras/' element={<Compras />} />
        <Route path='/inserir-cliente/' element={<InserirCliente />} />
        <Route path='/Biblioteca/' element={<Biblioteca />} />
        
        {/* CORREÇÃO AQUI: Adicionada a rota exata que o seu card da loja está chamando */}
        <Route path='/loja/jogo/:id' element={<JogoLoja />} />
        
        {/* Mantida caso você use em outro lugar */}
        <Route path='/jogo-loja/:id' element={<JogoLoja />} />
        
        {/* Rota dinâmica da biblioteca */}
        <Route path='/jogo/:id' element={<JogoDetalhes />} /> 
        
        <Route path='/login' element={<Login />} /> 
        <Route path='/Carrinho/' element={<Carrinho/>} />
      </Routes>
    </>
  )
}

export default App;