import React, { useState } from 'react';

const DetalhesMoto = ({ features, onClose, nomeMoto }) => {
  const [showContatoModal, setShowContatoModal] = useState(false);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');

  // Função para abrir o WhatsApp
  const handleWhatsAppClick = () => {
    if (!nome || !telefone) {
      alert("Por favor, preencha seu nome e telefone.");
      return;
    }

    const phoneNumber = "5527996474724"; // Substitua pelo número desejado
    const message = `Olá, meu nome é ${nome} (${telefone}). Gostaria de mais informações sobre a moto ${nomeMoto}.`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  // Função para formatar o telefone
  const handleTelefoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número
    if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos

    if (value.length > 10) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }

    setTelefone(value);
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2 style={styles.modalTitle}>Detalhes da Moto: {nomeMoto}</h2>
        <hr style={styles.hr} />

        {/* Exibir as features */}
        {features && features.length > 0 ? (
          <div style={styles.featuresContainer}>
            <h3>Características</h3>
            <ul>
              {features.map((feature, index) => (
                <li key={index} style={styles.featureItem}>
                  <div style={styles.featureHeader}>
                    <img
                      src={`https:${feature.icon}`} // Adiciona "https:" para formar a URL completa
                      alt={feature.name}
                      style={styles.featureIcon}
                      onError={(e) => {
                        console.error("Erro ao carregar o ícone:", e.target.src);
                        e.target.src = "https://via.placeholder.com/30"; // Ícone de fallback
                      }}
                    />
                    <strong>{feature.name}:</strong>
                  </div>
                  <p>{feature.value.replace(/<[^>]+>/g, '')}</p> {/* Remove tags HTML */}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Nenhuma característica disponível.</p>
        )}

        {/* Botão de Contato */}
        <button
          style={{ ...styles.button, ...styles.greenButton }}
          onClick={() => setShowContatoModal(true)}
        >
          Entrar em Contato
        </button>

        {/* Botão Fechar */}
        <button
          style={{ ...styles.button, ...styles.redButton }}
          onClick={onClose}
        >
          Fechar
        </button>

        {/* Modal de Contato */}
        {showContatoModal && (
          <div style={styles.contatoModalOverlay}>
            <div style={styles.contatoModalContent}>
              <h3>Entrar em Contato</h3>
              <input
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Seu telefone"
                value={telefone}
                onChange={handleTelefoneChange}
                style={styles.input}
                maxLength="15" // Limita para evitar bugs
              />
              <button
                style={{ ...styles.button, ...styles.greenButton }}
                onClick={handleWhatsAppClick}
              >
                Enviar
              </button>
              <button
                style={{ ...styles.button, ...styles.redButton }}
                onClick={() => setShowContatoModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Estilos
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
    padding: '20px',
    boxSizing: 'border-box',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    maxHeight: '90vh',
    overflow: 'hidden',
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  hr: {
    width: '80%',
    margin: '10px auto',
    border: 'none',
    borderTop: '1px solid #ccc',
  },
  featuresContainer: {
    margin: '10px 0',
  },
  featureItem: {
    marginBottom: '10px',
  },
  featureHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  featureIcon: {
    width: '24px',
    height: '24px',
  },
  button: {
    padding: '12px 16px',
    borderRadius: '4px',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.9rem',
    width: '100%',
    marginBottom: '8px',
  },
  greenButton: {
    backgroundColor: '#28a745',
  },
  redButton: {
    backgroundColor: '#ff4d4d',
  },
  contatoModalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001,
  },
  contatoModalContent: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '300px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  input: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '94%',
    marginBottom: '8px',
  },
  
};

export default DetalhesMoto;
