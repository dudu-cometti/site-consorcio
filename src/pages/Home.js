import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Bem-vindo ao Site de Consórcio</h1>
      <p>Escolha uma categoria para começar:</p>
      <ul>
        <li>
          <Link to="/veiculos/ES/motos">Ver Motos no ES</Link>
        </li>
        <li>
          <Link to="/veiculos/SP/carros">Ver Carros em SP</Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;