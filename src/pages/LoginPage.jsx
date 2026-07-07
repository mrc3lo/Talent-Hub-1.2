// src/pages/LoginPage.jsx
import React, { useState } from 'react';

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Limpiamos el texto ingresado para evitar fallas por espacios o mayúsculas
    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Validación ultra segura que acepta tanto el identificador como el correo simulado
    if (
      (cleanUsername === 'admin') && 
      cleanPassword === 'admin123'
    ) {
      onLoginSuccess(); 
    } else {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Login - TalentHub</h1>
      
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="text" 
            placeholder="Usuario" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Ingresar
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '15px', fontWeight: 'bold' }}>{error}</p>}
    </div>
  );
};

export default LoginPage;