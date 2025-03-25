import React, { useState } from 'react';
import ParcelasModal from './ParcelasModal';
import DetalhesMoto from './DetalhesMoto';
import { fetchPlanos } from '../api/veiculos';

const VeiculoCard = ({ veiculo }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDetalhesModal, setShowDetalhesModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [features, setFeatures] = useState([]);
  const [loadingDetalhes, setLoadingDetalhes] = useState(false);
  const [errorDetalhes, setErrorDetalhes] = useState(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");

  // Função para buscar os detalhes da moto
  const handleDetalhesClick = async () => {
    setLoadingDetalhes(true);
    setErrorDetalhes(null);

    try {
      const estado = "ES"; // Substitua pelo estado desejado
      const data = await fetchPlanos(estado, veiculo.slug);

      if (data.features) {
        setFeatures(data.features);
        setShowDetalhesModal(true);
      } else {
        throw new Error("Nenhuma feature encontrada.");
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes da moto:", error);
      setErrorDetalhes("Erro ao carregar os detalhes. Tente novamente mais tarde.");
    } finally {
      setLoadingDetalhes(false);
    }
  };

  // Função para abrir WhatsApp após preencher Nome e Telefone
  const handleWhatsAppSubmit = () => {
    if (!nome.trim() || !telefone.trim()) {
      alert("Por favor, preencha seu nome e telefone.");
      return;
    }

    const phoneNumber = "5527996474724"; // Substitua pelo número desejado
    const message = `Olá, meu nome é ${nome}. Gostaria de mais informações sobre o veículo ${veiculo.name}. Meu telefone: ${telefone}`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(url, "_blank");
    setShowWhatsAppModal(false);
    setNome("");
    setTelefone("");
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>{veiculo.name}</h2>
      <p style={styles.details}></p>
      <img src={`https:${veiculo.photo}`} alt={veiculo.name} style={styles.image} />
      <p style={styles.price}>
        <strong>Parcelas a Partir de:</strong> R$ {veiculo.priceInstallment}
      </p>

      {/* Botões */}
      <div style={styles.buttonContainer}>
        <button style={{ ...styles.button, ...styles.redButton }} onClick={() => setShowModal(true)}>
          Ver Parcelas
        </button>
        <button
          style={{ ...styles.button, ...styles.blueButton }}
          onClick={handleDetalhesClick}
          disabled={loadingDetalhes}
        >
          {loadingDetalhes ? 'Carregando...' : 'Detalhes do Veículo'}
        </button>
        <button style={{ ...styles.button, ...styles.greenButton }} onClick={() => setShowWhatsAppModal(true)}>
          WhatsApp
        </button>
      </div>

      {/* Modal de Parcelas */}
      {showModal && <ParcelasModal veiculo={veiculo} onClose={() => setShowModal(false)} />}

      {/* Modal de Detalhes */}
      {showDetalhesModal && (
        <DetalhesMoto features={features} nomeMoto={veiculo.name} onClose={() => setShowDetalhesModal(false)} />
      )}

      {/* Modal de WhatsApp */}
      {showWhatsAppModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Fale no WhatsApp</h3>
            <label>Nome:</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} style={styles.input} />

            <label>Telefone:</label>
            <input
              type="text"
              value={telefone}
              onChange={(e) => {
                // Permite apenas números e formata como telefone
                let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não for número
                if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos
                setTelefone(value);
              }}
              placeholder="Ex: 11999999999"
              style={styles.input}
            />

            <button style={{ ...styles.button, ...styles.greenButton }} onClick={handleWhatsAppSubmit}>
              Continuar para WhatsApp
            </button>
            <button style={{ ...styles.button, ...styles.redButton }} onClick={() => setShowWhatsAppModal(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {errorDetalhes && <p style={styles.error}>{errorDetalhes}</p>}
    </div>
  );
};

// Estilos
const styles = {
      card: {
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '16px',
      margin: '16px auto',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#f9f9f9',
      width: '90%', // Ocupa 90% da largura da tela
      maxWidth: '400px', // Define uma largura máxima para telas maiores
      overflow: 'hidden', // Impede que qualquer conteúdo ultrapasse o cartão
      boxSizing: 'border-box', // Garante que padding e borda não aumentem a largura
    },
    // Outros estilos...
  title: {
    fontSize: '1.5rem',
    margin: '0 0 8px 0',
    color: '#333',
    maxWidth: '100%',
    height: 'auto',

  },
  details: {
    fontSize: '0.9rem',
    margin: '0 0 8px 0',
    color: '#444',
  },
    image: {
      width: '100%',
      maxWidth: '100%', // Garante que a imagem não ultrapasse a largura do contêiner
      height: 'auto',
      margin: '16px 0',
      borderRadius: '8px', // Adiciona bordas arredondadas (opcional)
    },
    
  price: {
    fontSize: '0.9rem',
    margin: '0 0 16px 0',
    color: '#444',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column', // Coloca os botões em coluna
    gap: '8px',
    marginTop: '16px',
  },
  button: {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.9rem',
    width: '100%', // Ocupa 100% da largura do contêiner
    whiteSpace: 'nowrap', // Impede que o texto do botão quebre em várias linhas
  },
  redButton: {
    backgroundColor: '#ff4d4d',
  },
  blueButton: {
    backgroundColor: '#007bff',
  },
  greenButton: {
    backgroundColor: '#28a745',
   
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: '10px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '8px',
    textAlign: 'center',
    width: '90%',
    maxWidth: '400px',
  },
  input: {
    width: '90%',
    padding: '8px',
    margin: '8px 0',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
};

export default VeiculoCard;