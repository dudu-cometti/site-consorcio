// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { auth, db, functions } from '../api/auth';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Dashboard.css';

const Dashboard = () => {
  const [clientes, setClientes] = useState([]);
  const [metricas, setMetricas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [linkPersonalizado, setLinkPersonalizado] = useState('');

  // Busca clientes e métricas
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        // Busca clientes
        const q = query(
          collection(db, "clientes"),
          where("vendedorId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        setClientes(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Busca métricas
        const metricaRef = doc(db, "metricas_vendedores", user.uid);
        const metricaSnap = await getDoc(metricaRef);
        if (metricaSnap.exists()) {
          setMetricas(metricaSnap.data());
        }

        // Gera link personalizado
        const generateLink = httpsCallable(functions, 'generateVendedorLink');
        const result = await generateLink({ userId: user.uid });
        setLinkPersonalizado(result.data.link);
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="loading">
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <Header />
      
      <main className="dashboard-content">
        <section className="metrics-section">
          <h2>Meu Desempenho</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>Contatos</h3>
              <p>{metricas?.contatos || 0}</p>
            </div>
            <div className="metric-card">
              <h3>Vendas</h3>
              <p>{metricas?.vendas || 0}</p>
            </div>
            <div className="metric-card">
              <h3>Modelo Top</h3>
              <p>{metricas?.modeloTop || "N/A"}</p>
            </div>
          </div>
        </section>

        <section className="link-section">
          <h3>Seu Link Exclusivo</h3>
          <div className="link-box">
            <input 
              type="text" 
              value={linkPersonalizado} 
              readOnly 
            />
            <button 
              onClick={() => {
                navigator.clipboard.writeText(linkPersonalizado);
                alert('Link copiado!');
              }}
            >
              Copiar
            </button>
          </div>
          <p className="link-help">Compartilhe este link para clientes direcionados a você</p>
        </section>

        <section className="clientes-section">
          <h2>Últimos Clientes</h2>
          <div className="clientes-list">
            {clientes.length > 0 ? (
              clientes.map(cliente => (
                <div key={cliente.id} className="cliente-card">
                  <p><strong>Nome:</strong> {cliente.nome || "Não informado"}</p>
                  <p><strong>Modelo:</strong> {cliente.modeloInteresse}</p>
                  <p><strong>Contato:</strong> {cliente.telefone}</p>
                  <p><strong>Status:</strong> 
                    <span className={`status-${cliente.status}`}>
                      {cliente.status || "Novo"}
                    </span>
                  </p>
                </div>
              ))
            ) : (
              <p>Nenhum cliente registrado ainda</p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;