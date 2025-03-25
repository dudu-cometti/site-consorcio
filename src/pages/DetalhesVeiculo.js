import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchVeiculos } from '../api/veiculos';

const DetalhesVeiculo = () => {
  const [veiculo, setVeiculo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getVeiculo = async () => {
      try {
        const data = await fetchVeiculos('ES', 'motos');
        const veiculoSelecionado = data.find((v) => v.id === Number(id));

        if (veiculoSelecionado) {
          setVeiculo(veiculoSelecionado);
        } else {
          setError('Veículo não encontrado');
        }
      } catch (err) {
        setError('Erro ao buscar os detalhes do veículo');
      } finally {
        setLoading(false);
      }
    };

    getVeiculo();
  }, [id]);

  if (loading) return <div>Carregando detalhes do veículo...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <button onClick={() => navigate(-1)}>← Voltar</button>
      {veiculo ? (
        <div>
          <h1>{veiculo.name}</h1>
          <p>{veiculo.descricao}</p>
          <p><strong>Modelo:</strong> {veiculo.modelo}</p>
          <p><strong>Ano:</strong> {veiculo.ano}</p>
          <p><strong>Preço:</strong> R$ {veiculo.preçoParcelamento}</p>
        </div>
      ) : (
        <p>Veículo não encontrado.</p>
      )}
    </div>
  );
};

export default DetalhesVeiculo;
