// src/components/LoadingScreen.js
import React from 'react';
import '../styles/LoadingScreen.css'; // Criaremos este CSS depois

export default function LoadingScreen({ mensagem }) {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <p className="loading-text">{mensagem || 'Carregando...'}</p>
      </div>
    </div>
  );
}