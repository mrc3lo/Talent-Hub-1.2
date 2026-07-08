import React, { useState } from 'react';

export default function LoginPage({ onLoginSuccess }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);

    if (!username || !password) {
      setMessage('Por favor, complete todos los campos.');
      return;
    }

    if (isRegisterMode) {
      try {
        const response = await window.api.invoke('auth:register', { username, password });
        setMessage(response.message);
        setIsSuccess(response.success);
        
        if (response.success) {
          setUsername('');
          setPassword('');
        }
      } catch (error) {
        setMessage('Error al intentar registrar el usuario.');
      }
    } else {
      try {
        const response = await window.api.invoke('auth:login', { username, password });
        setIsSuccess(response.success);
        setMessage(response.message);
        if (response.success) {
          onLoginSuccess();
        }
      } catch (error) {
        setMessage('Error al intentar iniciar sesión.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f4f6f9' }}>
      <div style={{ padding: '30px', width: '100%', maxWidth: '360px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginTop: 0, color: '#333' }}>
          {isRegisterMode ? 'Crear Cuenta' : 'TalentHub Login'}
        </h2>
        
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>Correo Electrónico:</label>
            <input 
              type="text" 
              placeholder="ejemplo@correo.com" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#000' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>Contraseña:</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#000' }}
            />
          </div>

          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: isRegisterMode ? '#198754' : '#0d6efd', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}>
            {isRegisterMode ? 'Registrar Usuario' : 'Iniciar Sesión'}
          </button>
        </form>

        {message && (
          <div style={{ marginTop: '15px', padding: '10px', fontSize: '13px', borderRadius: '4px', backgroundColor: isSuccess ? '#d1e7dd' : '#f8d7da', color: isSuccess ? '#0f5132' : '#842029', textAlign: 'center' }}>
            {message}
          </div>
        )}

        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'center', fontSize: '13px' }}>
          <span 
            onClick={() => { 
              setIsRegisterMode(!isRegisterMode); 
              setMessage(''); 
              setIsSuccess(false); 
              setUsername(''); 
              setPassword(''); 
            }} 
            style={{ color: '#0d6efd', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isRegisterMode ? '¿Ya tienes cuenta? Inicia sesión aquí' : '¿No tienes cuenta? Regístrate aquí'}
          </span>
        </div>
      </div>
    </div>
  );
}