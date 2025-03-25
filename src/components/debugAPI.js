import React, { useState, useEffect } from 'react';
import { fetchPlanos } from '../api/veiculos';

const DebugAPI = ({ veiculo, onClose }) => {
  const [parcelasComSeguro, setParcelasComSeguro] = useState([]);
  const [parcelasSemSeguro, setParcelasSemSeguro] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPlanos = async () => {
      try {
        const estado = "ES"; // Substitua pelo estado desejado
        const modelo = veiculo.slug; // Usa o slug do veículo

        console.log("Estado:", estado); // Log do estado
        console.log("Modelo:", modelo); // Log do modelo

        const data = await fetchPlanos(estado, modelo);
        console.log("Dados retornados pela API:", data); // Log para depuração

        // Verifica se os dados e o caminho estão corretos
        if (data.plans && data.plans.length > 0 && data.plans[0].options) {
          setParcelasComSeguro(data.plans[0].options.withInsurance || []); // Parcelas com seguro
          setParcelasSemSeguro(data.plans[0].options.noInsurance || []); // Parcelas sem seguro
        } else {
          console.error("Estrutura da API inesperada ou sem dados:", data);
          setParcelasComSeguro([]); // Define como array vazio em caso de erro
          setParcelasSemSeguro([]); // Define como array vazio em caso de erro
        }
      } catch (error) {
        console.error("Erro ao buscar planos:", error);
        setError(error.message); // Armazena o erro no estado
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    getPlanos();
  }, [veiculo.slug]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Erro: {error}</p>;
  }

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2>Depuração da API para {veiculo.name}</h2>

        {/* Exibe as parcelas com seguro */}
        <h3>Parcelas com Seguro:</h3>
        {parcelasComSeguro.length > 0 ? (
          <ul>
            {parcelasComSeguro.map((plano) => (
              <li key={plano.uniqueId}>
                <p><strong>Valor:</strong> R$ {plano.value}</p>
                <p><strong>Prazo:</strong> {plano.numberInstallments} meses</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma parcela com seguro disponível.</p>
        )}

        {/* Exibe as parcelas sem seguro */}
        <h3>Parcelas sem Seguro:</h3>
        {parcelasSemSeguro.length > 0 ? (
          <ul>
            {parcelasSemSeguro.map((plano) => (
              <li key={plano.uniqueId}>
                <p><strong>Valor:</strong> R$ {plano.value}</p>
                <p><strong>Prazo:</strong> {plano.numberInstallments} meses</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma parcela sem seguro disponível.</p>
        )}

        {/* Botão para fechar */}
        <button style={styles.closeButton} onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  closeButton: {
    backgroundColor: '#ff4d4d',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
    marginTop: '16px',
  },
};

export default DebugAPI;