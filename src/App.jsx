import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import EmployeesPage from './pages/EmployeesPage';
import { RecruitmentPage } from './pages/RecruitmentPage'; // 📋 Dominio 2
import PayrollPage from './pages/PayrollPage'; // 💰 Dominio de Nómina

function App() {
  // El estado inicial es 'login'. Así la app siempre arranca ahí de forma segura.
  const [currentPage, setCurrentPage] = useState('login');

  // Función para cambiar de pantalla de forma segura
  const navigate = (pageName) => {
    setCurrentPage(pageName);
  };

  return (
    <div className="app-container">
      {/* 1. VISTA DE LOGIN */}
      {currentPage === 'login' && (
        <LoginPage onLoginSuccess={() => navigate('employees')} />
      )}
      
      {/* 2. VISTA DE EMPLEADOS (TU DOMINIO) */}
      {currentPage === 'employees' && (
        <div>
          {/* Barra de navegación unificada */}
          <nav style={{ padding: '10px', background: '#eee', display: 'flex', gap: '15px', alignItems: 'center' }}>
            <strong>TalentHub v1.0</strong>
            <button onClick={() => navigate('employees')} style={{ fontWeight: 'bold' }}>📁 Directorio</button>
            <button onClick={() => navigate('recruitment')}>📋 Reclutamiento (Kanban)</button>
            <button onClick={() => navigate('payroll')}>💰 Nómina</button>
            <button onClick={() => navigate('login')} style={{ marginLeft: 'auto', background: '#ffcccc', border: '1px solid #ff9999', borderRadius: '4px', cursor: 'pointer' }}>🚪 Cerrar Sesión</button>
          </nav>
          
          <EmployeesPage />
        </div>
      )}

      {/* 3. VISTA DE RECLUTAMIENTO / KANBAN (DOMINIO 2) */}
      {currentPage === 'recruitment' && (
        <div>
          <nav style={{ padding: '10px', background: '#eee', display: 'flex', gap: '15px', alignItems: 'center' }}>
            <strong>TalentHub v1.0</strong>
            <button onClick={() => navigate('employees')}>📁 Directorio</button>
            <button onClick={() => navigate('recruitment')} style={{ fontWeight: 'bold' }}>📋 Reclutamiento (Kanban)</button>
            <button onClick={() => navigate('payroll')}>💰 Nómina</button>
            <button onClick={() => navigate('login')} style={{ marginLeft: 'auto', background: '#ffcccc', border: '1px solid #ff9999', borderRadius: '4px', cursor: 'pointer' }}>🚪 Cerrar Sesión</button>
          </nav>
          
          <RecruitmentPage />
        </div>
      )}

      {/* 4. VISTA DE NÓMINA */}
      {currentPage === 'payroll' && (
        <div>
          <nav style={{ padding: '10px', background: '#eee', display: 'flex', gap: '15px', alignItems: 'center' }}>
            <strong>TalentHub v1.0</strong>
            <button onClick={() => navigate('employees')}>📁 Directorio</button>
            <button onClick={() => navigate('recruitment')}>📋 Reclutamiento (Kanban)</button>
            <button onClick={() => navigate('payroll')} style={{ fontWeight: 'bold' }}>💰 Nómina</button>
            <button onClick={() => navigate('login')} style={{ marginLeft: 'auto', background: '#ffcccc', border: '1px solid #ff9999', borderRadius: '4px', cursor: 'pointer' }}>🚪 Cerrar Sesión</button>
          </nav>
          
          <PayrollPage />
        </div>
      )}
    </div>
  );
}

export default App;