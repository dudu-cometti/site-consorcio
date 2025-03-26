import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth, db, monitorarAuthState } from './api/auth';
import { doc, onSnapshot } from 'firebase/firestore';

// Componentes de páginas
import Home from './pages/Home';
import Veiculos from './pages/Veiculos';
import DetalhesVeiculo from './pages/DetalhesVeiculo';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Perfil from './pages/Perfil';

// Componentes utilitários
import PrivateRoute from './components/PrivateRoute';
import LoadingScreen from './components/LoadingScreen';
import PageNotFound from './components/PageNotFound';

// Configuração de debug
const DEBUG_MODE = process.env.NODE_ENV === 'development';

function App() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let unsubscribeFirestore = () => {};
    let authTimeout = setTimeout(() => {
      console.warn('[DEBUG] Timeout atingido! Removendo tela de loading.');
      setInitialLoading(false);
    }, 5000); // Força a remoção do loading após 5s

    const unsubscribeAuth = monitorarAuthState(async (currentUser) => {
      clearTimeout(authTimeout); // Cancela o timeout se o Firebase responder antes

      if (currentUser) {
        setUser({ ...currentUser });

        unsubscribeFirestore = onSnapshot(
          doc(db, "usuarios", currentUser.uid),
          (doc) => {
            if (doc.exists()) {
              if (DEBUG_MODE) console.log('[DEBUG] Dados Firestore:', doc.data());
            } else {
              console.warn('[DEBUG] Usuário sem perfil no Firestore');
            }
          },
          (error) => {
            console.error('[DEBUG] Erro no Firestore:', error);
            setInitialLoading(false);
          }
        );
      } else {
        setUser(null);
      }
      setInitialLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeFirestore();
      if (DEBUG_MODE) console.log('[DEBUG] Listeners removidos');
    };
  }, []);

  if (initialLoading) {
    return <LoadingScreen mensagem="Carregando sua experiência..." fullScreen={true} />;
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Home user={user} />} />
          <Route path="/veiculos/:estado/:categoria" element={<Veiculos user={user} />} />
          <Route path="/veiculo/:id" element={<DetalhesVeiculo user={user} />} />
          <Route path="/login" element={<Login user={user} />} />
          <Route path="/cadastro" element={user ? <Perfil /> : <Cadastro />} />

          {/* Rotas privadas */}
          <Route path="/perfil" element={<PrivateRoute user={user}><Perfil /></PrivateRoute>} />

          {/* Rota para página não encontrada */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
