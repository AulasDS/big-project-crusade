import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/loja';
import NavBar from './components/navBar';
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

        <Route path='/Biblioteca/' element={<Biblioteca />} />
        
        
        <Route path='/loja/jogo/:id' element={<JogoLoja />} />
        
       
        <Route path='/jogo-loja/:id' element={<JogoLoja />} />
        
       
        <Route path='/jogo/:id' element={<JogoDetalhes />} /> 
        
        <Route path='/login' element={<Login />} /> 
        <Route path='/Carrinho/' element={<Carrinho/>} />
      </Routes>
    </>
  )
}

export default App;