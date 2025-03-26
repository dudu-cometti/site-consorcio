// src/pages/Perfil.js
import React, { useEffect, useState, useRef } from 'react';
import { auth, buscarDadosUsuario, db, uploadFotoPerfil, gerarLinkVendas } from '../api/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingScreen from '../components/LoadingScreen';
import '../styles/Perfil.css';

const Perfil = () => {
  const [dados, setDados] = useState({
    nome: '',
    concessionaria: '',
    instagram: '',
    whatsapp: '',
    cargo: '',
    fotoURL: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [linkGerado, setLinkGerado] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        
        if (!user) {
          navigate('/login');
          return;
        }

        const userData = await buscarDadosUsuario(user.uid);
        setDados(userData || {
          nome: '',
          concessionaria: '',
          instagram: '',
          whatsapp: '',
          cargo: '',
          fotoURL: ''
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    carregarPerfil();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const fotoURL = await uploadFotoPerfil(auth.currentUser.uid, file);
      setDados(prev => ({ ...prev, fotoURL }));
    } catch (err) {
      setError("Erro ao enviar foto: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateDoc(doc(db, "usuarios", auth.currentUser.uid), dados);
      setEditMode(false);
      alert("Perfil atualizado com sucesso!");
    } catch (err) {
      setError("Erro ao atualizar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const gerarLink = async () => {
    try {
      setLoading(true);
      const result = await gerarLinkVendas({
        vendedorId: auth.currentUser.uid,
        ...dados
      });
      setLinkGerado(result.data.link);
    } catch (err) {
      setError("Erro ao gerar link: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen mensagem="Carregando seu perfil..." />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="perfil-container">
      <Header />
      
      <main>
        <h1>Meu Perfil</h1>
        
        {!editMode ? (
          <div className="perfil-view">
            <div className="perfil-header">
              {dados.fotoURL ? (
                <img src={dados.fotoURL} alt="Foto de perfil" className="perfil-foto" />
              ) : (
                <div className="perfil-foto-placeholder">
                  <i className="fas fa-user"></i>
                </div>
              )}
              <h2>{dados.nome || 'Nome não informado'}</h2>
              <p className="perfil-cargo">{dados.cargo || 'Cargo não informado'}</p>
            </div>

            <div className="perfil-info">
              <p><strong>Concessionária:</strong> {dados.concessionaria || 'Não informada'}</p>
              <p><strong>WhatsApp:</strong> {dados.whatsapp || 'Não informado'}</p>
              <p><strong>Instagram:</strong> {dados.instagram ? `@${dados.instagram}` : 'Não informado'}</p>
            </div>

            <div className="perfil-actions">
              <button onClick={() => setEditMode(true)} className="btn-edit">
                Alterar Dados
              </button>
              
              <button onClick={gerarLink} className="btn-generate-link">
                Gerar Link de Vendas
              </button>
            </div>

            {linkGerado && (
              <div className="link-container">
                <h3>Seu Link Personalizado:</h3>
                <input type="text" value={linkGerado} readOnly />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(linkGerado);
                    alert('Link copiado!');
                  }}
                  className="btn-copy"
                >
                  Copiar Link
                </button>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="perfil-form">
            <div className="form-group photo-upload">
              <label>
                Foto de Perfil:
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <div className="photo-preview" onClick={() => fileInputRef.current.click()}>
                  {dados.fotoURL ? (
                    <img src={dados.fotoURL} alt="Preview" />
                  ) : (
                    <div className="photo-placeholder">
                      <i className="fas fa-camera"></i>
                      <span>Selecionar Foto</span>
                    </div>
                  )}
                </div>
              </label>
            </div>

            <div className="form-group">
              <label>Nome Completo*</label>
              <input
                type="text"
                name="nome"
                value={dados.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Concessionária*</label>
              <input
                type="text"
                name="concessionaria"
                value={dados.concessionaria}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>WhatsApp* (com DDD)</label>
              <input
                type="tel"
                name="whatsapp"
                value={dados.whatsapp}
                onChange={handleChange}
                placeholder="11987654321"
                required
              />
            </div>

            <div className="form-group">
              <label>Instagram (sem @)</label>
              <input
                type="text"
                name="instagram"
                value={dados.instagram}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Cargo*</label>
              <select
                name="cargo"
                value={dados.cargo}
                onChange={handleChange}
                required
              >
                <option value="">Selecione</option>
                <option value="Vendedor">Vendedor</option>
                <option value="Gerente">Gerente</option>
                <option value="Proprietário">Proprietário</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setEditMode(false)} className="btn-cancel">
                Cancelar
              </button>
              <button type="submit" disabled={loading} className="btn-save">
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Perfil;