// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { authService } from '../services/authService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await authService.login(email, password);

    if (result.success) {
      alert('¡Bienvenido a TalentHub!');
      // Aquí redirigiríamos al Dashboard
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Login - TalentHub</h1>
      <form onSubmit={handleLogin}>
        <input 
          type="email" placeholder="Correo" 
          value={email} onChange={(e) => setEmail(e.target.value)} required 
        />
        <br />
        <input 
          type="password" placeholder="Contraseña" 
          value={password} onChange={(e) => setPassword(e.target.value)} required 
        />
        <br />
        <button type="submit">Ingresar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default LoginPage;