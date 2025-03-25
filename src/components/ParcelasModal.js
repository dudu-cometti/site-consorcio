import React, { useState, useEffect } from 'react';
import { fetchPlanos } from '../api/veiculos';

const ParcelasModal = ({ veiculo, onClose }) => {
  const [planos, setPlanos] = useState([]);
  const [selectedPlano, setSelectedPlano] = useState(null);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    veiculo.colors && veiculo.colors.length > 0 ? veiculo.colors[0] : null
  ); // Define a primeira cor como padrão

  // Função para obter as imagens da cor selecionada
  const getImagesForSelectedColor = () => {
    if (!selectedColor || !veiculo.carrossel) return [];
    const colorCarrossel = veiculo.carrossel.find(
      (item) => item.colorId === selectedColor.id
    );
    return colorCarrossel ? colorCarrossel.images : [];
  };

  useEffect(() => {
    const getPlanos = async () => {
      try {
        const estado = "ES"; // Substitua pelo estado desejado
        const modelo = veiculo.slug; // Usa o slug do veículo
        const data = await fetchPlanos(estado, modelo);
        console.log("Dados retornados pela API:", data); // Log para depuração

        if (data.plans && data.plans.length > 0) {
          const planosComSeguro = data.plans.map((plano) => ({
            nome: plano.name,
            parcelas: plano.options.withInsurance || [],
          }));
          setPlanos(planosComSeguro);
        } else {
          console.error("Estrutura da API inesperada ou sem dados:", data);
          setPlanos([]);
        }
      } catch (error) {
        console.error("Erro ao buscar planos:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getPlanos();
  }, [veiculo.slug]);

  // Função para abrir o WhatsApp após o preenchimento dos dados
  const handleWhatsAppRedirect = (nome, telefone) => {
    const phoneNumber = "5527996474724"; // Substitua pelo número desejado
    const message = `Olá, meu nome é ${nome} (${telefone}). Tenho interesse no modelo de moto ${veiculo.name} com o valor de parcela R$ ${selectedPlano.value}, no plano ${selectedPlano.planoNome}.`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  // Funções para o carrossel
  const nextImage = () => {
    const images = getImagesForSelectedColor();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    const images = getImagesForSelectedColor();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Função para formatar o telefone
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, ''); // Remove tudo que não é número
    const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/); // Aplica a máscara (XX) XXXXX-XXXX
    if (match) {
      return !match[2]
        ? match[1]
        : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
    }
    return cleaned;
  };

  // Modal de contato
  const ContactModal = ({ onClose, onSubmit }) => {
    const [localNome, setLocalNome] = useState('');
    const [localTelefone, setLocalTelefone] = useState('');

    const handleSubmit = () => {
      if (!localNome || !localTelefone) {
        alert("Por favor, preencha seu nome e telefone.");
        return;
      }
      onSubmit(localNome, localTelefone);
    };

    return (
      <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
          <h2 style={styles.modalTitle}>Informe seus dados</h2>
          <hr style={styles.hr} />
          <div style={styles.formContainer}>
          <div style={styles.formContainer}>
            <input
              type="text"
              placeholder="Seu nome"
              value={localNome}
              onChange={(e) => setLocalNome(e.target.value)}
              style={{ ...styles.input, fontSize: '16px' }} // Adicione fontSize: '16px'
            />
            <input
              type="text"
              placeholder="Seu telefone"
              value={localTelefone}
              onChange={(e) => setLocalTelefone(formatPhoneNumber(e.target.value))}
              maxLength={15}
              style={{ ...styles.input, fontSize: '16px' }} // Adicione fontSize: '16px'
            />
          </div>
          </div>
          <button style={styles.whatsappButton} onClick={handleSubmit}>
            Continuar
          </button>
          <button style={styles.closeButton} onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Erro: {error}</p>;
  }

  const images = getImagesForSelectedColor();

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2 style={styles.modalTitle}>Planos de Parcelas para {veiculo.name}</h2>
        <hr style={styles.hr} />

        {/* Carrossel de fotos da moto */}
        {images.length > 0 ? (
          <div style={styles.carrosselContainer}>
            <button onClick={prevImage} style={styles.carrosselButton}>
              &lt;
            </button>
            <img
              src={`https:${images[currentImageIndex]}`}
              alt={veiculo.name}
              style={styles.carrosselImage}
            />
            <button onClick={nextImage} style={styles.carrosselButton}>
              &gt;
            </button>
          </div>
        ) : (
          <p>Nenhuma imagem disponível.</p>
        )}

        {/* Bolinhas de cores */}
        {veiculo.colors && veiculo.colors.length > 0 && (
          <div style={styles.colorsContainer}>
            {veiculo.colors.map((color) => (
              <div
                key={color.id}
                style={{
                  ...styles.colorCircle,
                  backgroundColor: `#${color.primary}`,
                  border: selectedColor?.id === color.id ? '2px solid #007bff' : '1px solid #ccc',
                }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        )}

        {/* Nome da cor selecionada */}
        {selectedColor && <p style={styles.colorName}>{selectedColor.name}</p>}

        {/* Planos e parcelas */}
        <div style={styles.planosContainer}>
          {planos.length > 0 ? (
            planos.map((plano) => (
              <div key={plano.nome} style={styles.planoItem}>
                <h3>
                  {plano.nome}{' '}
                  {plano.nome.includes('+') ? (
                    <span style={{ color: 'green', fontSize: '12px' }}>(com emplacamento)</span>
                  ) : (
                    <span style={{ color: 'red', fontSize: '12px' }}>(sem emplacamento)</span>
                  )}
                </h3>
                <div style={styles.parcelasContainer}>
                  {plano.parcelas.map((parcela) => (
                    <div
                      key={parcela.uniqueId}
                      style={{
                        ...styles.parcelaCard,
                        border:
                          selectedPlano?.uniqueId === parcela.uniqueId
                            ? '2px solid #007bff'
                            : '1px solid #ccc',
                      }}
                      onClick={() => setSelectedPlano({ ...parcela, planoNome: plano.nome })}
                    >
                      <p>
                        <strong>{parcela.numberInstallments}x</strong> de R$ {parcela.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum plano disponível.</p>
          )}
        </div>

        {/* Botões */}
        <button
          style={styles.whatsappButton}
          onClick={() => {
            if (!selectedPlano) {
              alert("Selecione um plano antes de continuar.");
              return;
            }
            setShowContactModal(true); // Abre o modal de contato
          }}
        >
          WhatsApp
        </button>
        <button style={styles.closeButton} onClick={onClose}>
          Fechar
        </button>
      </div>

      {/* Modal de contato */}
      {showContactModal && (
        <ContactModal
          onClose={() => setShowContactModal(false)}
          onSubmit={(nome, telefone) => {
            setNome(nome);
            setTelefone(telefone);
            handleWhatsAppRedirect(nome, telefone);
          }}
        />
      )}
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
  carrosselContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    margin: '10px 0',
  },
  carrosselImage: {
    width: '100%',
    maxWidth: '300px',
    height: 'auto',
    borderRadius: '8px',
  },
  carrosselButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  colorsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    margin: '10px 0',
  },
  colorCircle: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  colorName: {
    textAlign: 'center',
    fontSize: '14px',
    marginBottom: '10px',
  },
  planosContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    margin: '10px 0',
  },
  planoItem: {
    flex: 1,
    minWidth: '120px',
  },
  parcelasContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  },
  parcelaCard: {
    border: '1px solid #ccc',
    borderRadius: '6px',
    padding: '0px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'border-color 0.3s ease',
    fontSize: '12px',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    margin: '10px 0',
  },
  input: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '12px',
  },
  whatsappButton: {
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '8px',
    fontSize: '12px',
  },
  closeButton: {
    backgroundColor: '#ff4d4d',
    color: '#fff',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '12px',
  },
};

export default ParcelasModal;