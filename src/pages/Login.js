import { useState } from 'react';
import { fazerLogin, loginComGoogle } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/AuthForms.css'

export default function Login() {
  const [credenciais, setCredenciais] = useState({
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
      await fazerLogin(credenciais.email, credenciais.senha);
      navigate('/perfil');
    } catch (error) {
      setErro('E-mail ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginComGoogle();
      navigate('/perfil');
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Entrar</h2>
      
      {erro && <div className="auth-feedback error">{erro}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            placeholder="E-mail"
            value={credenciais.email}
            onChange={(e) => setCredenciais({...credenciais, email: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            className="form-control"
            placeholder="Senha"
            value={credenciais.senha}
            onChange={(e) => setCredenciais({...credenciais, senha: e.target.value})}
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
              Entrando...
            </>
          ) : 'Entrar'}
        </button>
      </form>

      <div className="auth-options">
        <Link to="/recuperar-senha" className="auth-link">
          Esqueceu a senha?
        </Link>
        <Link to="/cadastro" className="auth-link">
          Criar nova conta
        </Link>
      </div>

      <div className="auth-divider">ou</div>

      <button 
        onClick={handleGoogleLogin} 
        className="btn-google"
        disabled={loading}
      >
        <img 
          src="https://img.icons8.com/color/48/000000/google-logo.png" 
          alt="Google" 
          width="20"
          height="20"
        />
        Entrar com Google
      </button>
    </div>
  );
}