// src/pages/Cadastro.js
import { useState } from 'react';
import { auth, cadastrarUsuario, loginComGoogle } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthForms.css';

export default function Cadastro() {
  // Estado para armazenar os dados do formulário
  const [dados, setDados] = useState({
    nome: '',
    telefone: '',
    email: '',
    senha: ''
  });

  // Estados para controlar carregamento e erros
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  // Função para lidar com o cadastro por email/senha
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    
    try {
      // 1. Tenta cadastrar o usuário (a função atualizada já faz login automático)
      const user = await cadastrarUsuario(dados.email, dados.senha, {
        nome: dados.nome,
        telefone: dados.telefone
      });

      // 2. Verificação extra de segurança
      if (!user || !auth.currentUser) {
        throw new Error('Falha na autenticação automática');
      }

      // 3. DEBUG: Mostra no console para verificar se está tudo ok
      console.log('Usuário cadastrado e autenticado:', {
        uid: user.uid,
        email: user.email
      });

      // 4. Redireciona para o perfil após 1 segundo (para visualização)
      setTimeout(() => {
        navigate('/perfil');
      }, 1000);

    } catch (error) {
      // Trata erros específicos do Firebase para mensagens mais amigáveis
      let mensagemErro = error.message;
      
      if (error.message.includes('auth/email-already-in-use')) {
        mensagemErro = 'Este e-mail já está cadastrado';
      } else if (error.message.includes('auth/weak-password')) {
        mensagemErro = 'A senha deve ter pelo menos 6 caracteres';
      }

      setErro(mensagemErro);
      console.error('Erro detalhado:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para cadastro com Google
  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      setErro('');
      
      // Chama a função de login com Google
      await loginComGoogle();
      
      // DEBUG
      console.log('Usuário Google:', auth.currentUser);
      
      // Redireciona para o perfil
      navigate('/perfil');
    } catch (error) {
      setErro('Erro ao cadastrar com Google: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar os dados do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Criar Conta</h2>
      
      {/* Exibe erros se existirem */}
      {erro && <div className="auth-feedback error">{erro}</div>}

      {/* Formulário de cadastro tradicional */}
      <form onSubmit={handleSubmit} className="auth-form">
        {/* Campo Nome */}
        <div className="form-group">
          <input
            type="text"
            name="nome"
            className="form-control"
            placeholder="Nome completo"
            value={dados.nome}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        {/* Campo Telefone */}
        <div className="form-group">
          <input
            type="tel"
            name="telefone"
            className="form-control"
            placeholder="Telefone (11) 99999-9999"
            value={dados.telefone}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        {/* Campo Email */}
        <div className="form-group">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="E-mail"
            value={dados.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        {/* Campo Senha */}
        <div className="form-group">
          <input
            type="password"
            name="senha"
            className="form-control"
            placeholder="Senha (mínimo 6 caracteres)"
            value={dados.senha}
            onChange={handleChange}
            minLength="6"
            required
            disabled={loading}
          />
        </div>

        {/* Botão de Submit */}
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

      {/* Divisor visual */}
      <div className="auth-divider">ou</div>

      {/* Botão de cadastro com Google */}
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

      {/* Link para login (opcional) */}
      <div className="auth-footer">
        Já tem uma conta? <a href="/login">Faça login</a>
      </div>
    </div>
  );
}