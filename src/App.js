import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Veiculos from "./pages/Veiculos";
import DetalhesVeiculo from "./pages/DetalhesVeiculo";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Perfil from "./pages/Perfil";
import PrivateRoute from "./components/PrivateRoute"; // Criaremos este componente

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rota de Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Rota de Cadastro */}
        <Route path="/cadastro" element={<Cadastro />} />
        
        {/* Rota principal redireciona para login (ou veículos se autenticado) */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Rotas protegidas (requerem autenticação) */}
        <Route element={<PrivateRoute />}>
          <Route path="/veiculos/:estado/:categoria" element={<Veiculos />} />
          <Route path="/veiculo/:id" element={<DetalhesVeiculo />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>
        
        {/* Fallback para rotas não encontradas */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;