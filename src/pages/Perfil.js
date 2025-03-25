import React, { useEffect, useState } from 'react';
import { buscarDadosUsuario } from '../api/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Profile from '../components/Profile';

const Perfil = () => {
  const [dadosUsuario, setDadosUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const carregarDadosUsuario = async () => {
      try {
        const userId = "ID_DO_USUARIO"; // Substitua pelo ID do usuário logado
        const dados = await buscarDadosUsuario(userId);
        setDadosUsuario(dados);
      } catch (error) {
        setError("Erro ao carregar dados do usuário.");
      } finally {
        setLoading(false);
      }
    };

    carregarDadosUsuario();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Header empresa={dadosUsuario.empresa} telefone={dadosUsuario.telefone} instagram={dadosUsuario.instagram} />
      <Profile nome={dadosUsuario.nome} foto={dadosUsuario.foto} classe={dadosUsuario.classe} />
      <Footer />
    </div>
  );
};

export default Perfil;