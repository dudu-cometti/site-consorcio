import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { gerarSubdominio } from '../api/subdominio'; // Criaremos esta função

const Profile = ({ nome, foto, classe }) => {
  const [linkGerado, setLinkGerado] = useState('');
  const auth = getAuth();

  const handleGerarLink = async () => {
    try {
      const user = auth.currentUser;
      const subdominio = await gerarSubdominio(user.uid, nome);
      setLinkGerado(`https://${subdominio}.comettidigital.com`);
    } catch (error) {
      console.error("Erro ao gerar link:", error);
    }
  };

  return (
    <div style={styles.profile}>
      <img src={foto} alt={nome} style={styles.foto} />
      <h3 style={styles.nome}>{nome}</h3>
      <p style={styles.classe}>{classe}</p>
      
      <button onClick={handleGerarLink} style={styles.botao}>
        Gerar Meu Link de Vendas
      </button>

      {linkGerado && (
        <div style={styles.linkContainer}>
          <p>Seu link personalizado:</p>
          <a href={linkGerado} target="_blank" rel="noopener noreferrer" style={styles.link}>
            {linkGerado}
          </a>
        </div>
      )}
    </div>
  );
};

const styles = {
  // ... (seus estilos existentes)
  botao: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '15px'
  },
  linkContainer: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px'
  },
  link: {
    color: '#007bff',
    wordBreak: 'break-all'
  }
};

export default Profile;