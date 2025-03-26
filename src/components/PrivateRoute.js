// src/components/PrivateRoute.js
import { Navigate } from 'react-router-dom';
import { auth } from '../api/auth';
import LoadingScreen from './LoadingScreen';
import { useEffect, useState } from 'react';

export default function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen mensagem="Verificando autenticação..." />;
  }

  return user ? children : <Navigate to="/login" replace />;
}