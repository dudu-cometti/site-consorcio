import React, { useState, useEffect } from 'react';
import { auth, buscarDadosUsuario, db } from '../api/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './EditarPerfil.css'; // CSS que vamos criar depois

const EditarPerfil = () => {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    empresa: '',
    instagram: '',
    classe: '',
    foto: ''
  });
  const [fotoPreview, setFotoPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Carrega dados atuais
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("Faça login para acessar");

        const dados = await buscarDadosUsuario(user.uid);
        if (dados) {
          setFormData(dados);
          setFotoPreview(dados.foto || '');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  // Manipulador de arquivo de foto
  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Verifica tamanho (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("A foto deve ter no máximo 2MB");
      return;
    }

    try {
      setLoading(true);
      const storage = getStorage();
      const storageRef = ref(storage, `perfil_photos/${auth.currentUser.uid}/${file.name}`);
      
      // Faz upload
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      // Atualiza preview e formData
      setFotoPreview(url);
      setFormData(prev => ({ ...prev, foto: url }));
      setSuccess("Foto carregada com sucesso!");
      setError('');
    } catch (err) {
      setError("Falha no upload: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Atualiza perfil
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) throw new Error("Sessão expirada");

      await updateDoc(doc(db, "usuarios", user.uid), formData);
      setSuccess("Perfil atualizado com sucesso!");
      setTimeout(() => navigate('/perfil'), 1500);
    } catch (err) {
      setError("Erro ao atualizar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !fotoPreview) return (
    <div className="loading-container">
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="editar-perfil-container">
      <Header />
      
      <main className="editar-perfil-content">
        <h1>Editar Perfil</h1>
        
        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Seção Foto */}
          <div className="photo-section">
            <div className="photo-preview">
              {fotoPreview ? (
                <img src={fotoPreview} alt="Preview" />
              ) : (
                <div className="photo-placeholder">
                  <i className="fas fa-user"></i>
                </div>
              )}
            </div>
            <label className="photo-upload-btn">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFotoChange} 
                disabled={loading}
              />
              {loading ? 'Enviando...' : 'Alterar Foto'}
            </label>
          </div>

          {/* Campos do Formulário */}
          <div className="form-group">
            <label>Nome Completo*</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Telefone*</label>
            <input
              type="tel"
              value={formData.telefone}
              onChange={(e) => setFormData({...formData, telefone: e.target.value})}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Empresa</label>
            <input
              type="text"
              value={formData.empresa}
              onChange={(e) => setFormData({...formData, empresa: e.target.value})}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Instagram</label>
            <input
              type="text"
              value={formData.instagram}
              onChange={(e) => setFormData({...formData, instagram: e.target.value})}
              placeholder="@seuuser"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Categoria</label>
            <select
              value={formData.classe}
              onChange={(e) => setFormData({...formData, classe: e.target.value})}
              disabled={loading}
            >
              <option value="">Selecione</option>
              <option value="Bronze">Bronze</option>
              <option value="Prata">Prata</option>
              <option value="Ouro">Ouro</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="save-btn"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default EditarPerfil;