// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { authService } from '../services/authService';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    // --- ATRAVESAMOS EL LOGIN TEMPORALMENTE PARA PROBAR LA NAVEGACIÓN ---
    // En lugar de llamar a authService.login, forzamos un resultado exitoso
    const result = { success: true }; 
    // --------------------------------------------------------------------

    if (result.success) {
      // Invocamos la función para cambiar de pantalla al directorio de empleados
      onLoginSuccess(); 
    } else {
      setError('No se pudo conectar con el servicio de autenticación');
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