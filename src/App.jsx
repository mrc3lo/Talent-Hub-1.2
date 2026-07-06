import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import EmployeesPage from './pages/EmployeesPage';
import PayrollPage from './pages/PayrollPage';

function App() {
  // El estado inicial es 'login'. Así la app siempre arranca ahí.
  const [currentPage, setCurrentPage] = useState('login');

  // Función para cambiar de pantalla de forma segura desde cualquier componente
  const navigate = (pageName) => {
    setCurrentPage(pageName);
  };

  // Renderizado condicional según la página activa
  return (
    <div className="app-container">
      {currentPage === 'login' && (
        <LoginPage onLoginSuccess={() => navigate('employees')} />
      )}
      
      {currentPage === 'employees' && (
        <div>
          {/* Barra de navegación superior temporal para saltar entre módulos */}
          <nav style={{ padding: '10px', background: '#eee', display: 'flex', gap: '15px' }}>
            <button onClick={() => navigate('employees')}>📁 Directorio</button>
            <button onClick={() => navigate('payroll')}>💰 Nómina (Mi Módulo)</button>
            <button onClick={() => navigate('login')} style={{ marginLeft: 'auto' }}>🚪 Cerrar Sesión</button>
          </nav>
          
          <EmployeesPage />
        </div>
      )}

      {currentPage === 'payroll' && (
        <div>
          <nav style={{ padding: '10px', background: '#eee', display: 'flex', gap: '15px' }}>
            <button onClick={() => navigate('employees')}>📁 Directorio</button>
            <button onClick={() => navigate('payroll')}>💰 Nómina (Mi Módulo)</button>
            <button onClick={() => navigate('login')} style={{ marginLeft: 'auto' }}>🚪 Cerrar Sesión</button>
          </nav>
          
          <PayrollPage />
        </div>
      )}
    </div>
  );
}

export default App;