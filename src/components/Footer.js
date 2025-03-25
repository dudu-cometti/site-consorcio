import React from 'react';

const Footer = () => {
  return (
    <div style={styles.footer}>
      <p style={styles.text}>
        Desenvolvido por Cometti Digital. <a href="#" style={styles.link}>Clique aqui e adquira o seu catálogo digital também!</a>
      </p>
    </div>
  );
};

const styles = {
  footer: {
    backgroundColor: '#000',
    color: '#fff',
    padding: '10px',
    textAlign: 'center',
  },
  text: {
    margin: 0,
    fontSize: '14px',
  },
  link: {
    color: '#fff',
    textDecoration: 'underline',
  },
};

export default Footer;