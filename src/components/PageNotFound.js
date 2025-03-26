import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/PageNotFound.css';

export default function PageNotFound() {
  return (
    <div className="not-found-container">
      <h1>404 - Página Não Encontrada</h1>
      <p>A página que você está procurando não existe.</p>
      <Link to="/" className="home-link">
        Voltar para a página inicial
      </Link>
    </div>
  );
}