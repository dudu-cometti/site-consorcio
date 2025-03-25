import React from 'react';

const Header = ({ empresa, telefone, instagram }) => {
  return (
    <div style={styles.header}>
      <p style={styles.text}>{empresa} | {telefone} | {instagram}</p>
    </div>
  );
};

const styles = {
  header: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px',
    textAlign: 'center',
  },
  text: {
    margin: 0,
    fontSize: '14px',
  },
};

export default Header;