import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import EmployeesPage from './pages/EmployeesPage';
import EmployeeProfilePage from './pages/EmployeeProfilePage'; // 👥 Tu vista de perfil detallado
import { RecruitmentPage } from './pages/RecruitmentPage'; // 📋 Dominio 2
import PayrollPage from './pages/PayrollPage'; // 💰 Dominio de Nómina

export default function App() {
  // El estado inicial es 'login'. Así la app siempre arranca ahí de forma segura.
  const [currentPage, setCurrentPage] = useState('login');
  
  // Tu estado para controlar si estamos viendo el detalle de un empleado en tu directorio
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  // Función para cambiar de pantalla de forma segura
  const navigate = (pageName) => {
    setCurrentPage(pageName);
  };

  return (
    <div className="app-container" style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh' }}>
      
      {/* 1. VISTA DE LOGIN */}
      {currentPage === 'login' && (
        <LoginPage onLoginSuccess={() => navigate('employees')} />
      )}
      
      {/* 2. VISTA DE EMPLEADOS (TU DOMINIO CON PERFIL DETALLADO) */}
      {currentPage === 'employees' && (
        <div>
          {/* Barra de navegación unificada */}
          <nav style={{ padding: '10px', background: '#eee', display: 'flex', gap: '15px', alignItems: 'center' }}>
            <strong>TalentHub v1.0</strong>
            <button onClick={() => { setSelectedEmployeeId(null); navigate('employees'); }} style={{ fontWeight: 'bold' }}>📁 Directorio</button>
            <button onClick={() => navigate('recruitment')}>📋 Reclutamiento (Kanban)</button>
            <button onClick={() => navigate('payroll')}>💰 Nómina</button>
            <button onClick={() => navigate('login')} style={{ marginLeft: 'auto', background: '#ffcccc', border: '1px solid #ff9999', borderRadius: '4px', cursor: 'pointer' }}>🚪 Cerrar Sesión</button>
          </nav>
          
          {/* Lógica integrada de tu módulo: Si hay ID seleccionado muestra perfil, sino el listado */}
          <div style={{ padding: '20px' }}>
            {selectedEmployeeId ? (
              <EmployeeProfilePage 
                employeeId={selectedEmployeeId} 
                onBack={() => setSelectedEmployeeId(null)} 
              />
            ) : (
              <EmployeesPage 
                onViewProfile={(id) => {
                  console.log("3. LLEGÓ A APP.JSX. Guardando en estado:", id);
                  setSelectedEmployeeId(id);
                }} 
              />
            )}
          </div>
        </div>
      )}

      {/* 3. VISTA DE RECLUTAMIENTO / KANBAN (DOMINIO 2) */}
      {currentPage === 'recruitment' && (
        <div>
          <nav style={{ padding: '10px', background: '#eee', display: 'flex', gap: '15px', alignItems: 'center' }}>
            <strong>TalentHub v1.0</strong>
            <button onClick={() => { setSelectedEmployeeId(null); navigate('employees'); }}>📁 Directorio</button>
            <button onClick={() => navigate('recruitment')} style={{ fontWeight: 'bold' }}>📋 Reclutamiento (Kanban)</button>
            <button onClick={() => navigate('payroll')}>💰 Nómina</button>
            <button onClick={() => navigate('login')} style={{ marginLeft: 'auto', background: '#ffcccc', border: '1px solid #ff9999', borderRadius: '4px', cursor: 'pointer' }}>🚪 Cerrar Sesión</button>
          </nav>
          
          <div style={{ padding: '20px' }}>
            <RecruitmentPage />
          </div>
        </div>
      )}

      {/* 4. VISTA DE NÓMINA */}
      {currentPage === 'payroll' && (
        <div>
          <nav style={{ padding: '10px', background: '#eee', display: 'flex', gap: '15px', alignItems: 'center' }}>
            <strong>TalentHub v1.0</strong>
            <button onClick={() => { setSelectedEmployeeId(null); navigate('employees'); }}>📁 Directorio</button>
            <button onClick={() => navigate('recruitment')}>📋 Reclutamiento (Kanban)</button>
            <button onClick={() => navigate('payroll')} style={{ fontWeight: 'bold' }}>💰 Nómina</button>
            <button onClick={() => navigate('login')} style={{ marginLeft: 'auto', background: '#ffcccc', border: '1px solid #ff9999', borderRadius: '4px', cursor: 'pointer' }}>🚪 Cerrar Sesión</button>
          </nav>
          
          <div style={{ padding: '20px' }}>
            <PayrollPage />
          </div>
        </div>
      )}
    </div>
  );
}