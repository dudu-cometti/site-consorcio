import React, { useState } from 'react';
import { cadastrarUsuario } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const Cadastro = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [dadosUsuario, setDadosUsuario] = useState({
    nome: '',
    telefone: '',
    empresa: '',
    instagram: '',
    foto: '',
    classe: '',
  });
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      await cadastrarUsuario(email, senha, dadosUsuario);
      navigate('/perfil'); // Redireciona para a página de perfil
    } catch (error) {
      setErro("Erro ao cadastrar. Tente novamente.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Cadastro</h2>
      <form onSubmit={handleCadastro} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Nome"
          value={dadosUsuario.nome}
          onChange={(e) => setDadosUsuario({ ...dadosUsuario, nome: e.target.value })}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Telefone"
          value={dadosUsuario.telefone}
          onChange={(e) => setDadosUsuario({ ...dadosUsuario, telefone: e.target.value })}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Empresa"
          value={dadosUsuario.empresa}
          onChange={(e) => setDadosUsuario({ ...dadosUsuario, empresa: e.target.value })}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Instagram"
          value={dadosUsuario.instagram}
          onChange={(e) => setDadosUsuario({ ...dadosUsuario, instagram: e.target.value })}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Foto (URL)"
          value={dadosUsuario.foto}
          onChange={(e) => setDadosUsuario({ ...dadosUsuario, foto: e.target.value })}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Classe (ex: Vendedor Externo)"
          value={dadosUsuario.classe}
          onChange={(e) => setDadosUsuario({ ...dadosUsuario, classe: e.target.value })}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Cadastrar</button>
      </form>
      {erro && <p style={styles.erro}>{erro}</p>}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  erro: {
    color: 'red',
  },
};

export default Cadastro;