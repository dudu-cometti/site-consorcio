import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importe suas páginas
import Home from './pages/Home';
import Veiculos from './pages/Veiculos';
import DetalhesVeiculo from './pages/DetalhesVeiculo';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Perfil from './pages/Perfil';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/veiculos/:estado/:categoria" element={<Veiculos />} />
          <Route path="/veiculo/:id" element={<DetalhesVeiculo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/perfil" element={
            <PrivateRoute>
              <Perfil />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;