import { useState } from 'react';
import { cadastrarUsuario, loginComGoogle } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthForms.css'

export default function Cadastro() {
  const [dados, setDados] = useState({
    nome: '',
    telefone: '',
    email: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    
    try {
      await cadastrarUsuario(dados.email, dados.senha, {
        nome: dados.nome,
        telefone: dados.telefone
      });
      navigate('/perfil'); // Redireciona após cadastro
    } catch (error) {
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await loginComGoogle();
      navigate('/perfil');
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Criar Conta</h2>
      
      {erro && <div className="auth-feedback error">{erro}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Nome completo"
            value={dados.nome}
            onChange={(e) => setDados({...dados, nome: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="tel"
            className="form-control"
            placeholder="Telefone (11) 99999-9999"
            value={dados.telefone}
            onChange={(e) => setDados({...dados, telefone: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            className="form-control"
            placeholder="E-mail"
            value={dados.email}
            onChange={(e) => setDados({...dados, email: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            className="form-control"
            placeholder="Senha (mínimo 6 caracteres)"
            value={dados.senha}
            onChange={(e) => setDados({...dados, senha: e.target.value})}
            minLength="6"
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="auth-loading"></span>
              Cadastrando...
            </>
          ) : 'Cadastrar'}
        </button>
      </form>

      <div className="auth-divider">ou</div>

      <button 
        onClick={handleGoogleSignUp} 
        className="btn-google"
        disabled={loading}
      >
        <img 
          src="https://img.icons8.com/color/48/000000/google-logo.png" 
          alt="Google" 
          width="20"
          height="20"
        />
        Cadastre-se com Google
      </button>
    </div>
  );
}