// src/pages/Veiculos.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchVeiculos } from '../api/veiculos';
import VeiculoCard from '../components/VeiculoCard';


const Veiculos = () => {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { estado, categoria } = useParams();

  useEffect(() => {
    const getVeiculos = async () => {
      try {
        const data = await fetchVeiculos(estado, categoria);
        setVeiculos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getVeiculos();
  }, [estado, categoria]);

  if (loading) return <div>Carregando veículos...</div>;
  if (error) return <div>Erro ao carregar veículos: {error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Veículos Disponíveis em {estado} - Categoria: {categoria}</h1>
      <div style={styles.grid}>
        {veiculos.length > 0 ? (
          veiculos.map((veiculo) => (
            <VeiculoCard key={veiculo.id} veiculo={veiculo} />
          ))
        ) : (
          <p>Nenhum veículo encontrado.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto', // Centraliza o conteúdo na tela
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    width: '100%',
    paddingRight: '16px', // Adiciona espaçamento no lado direito
  },
  '@media (max-width: 600px)': {
    grid: {
      gridTemplateColumns: 'repeat(2, 1fr))',
      paddingRight: '8px', // Espaçamento menor no celular
    },
  },
};

export default Veiculos;