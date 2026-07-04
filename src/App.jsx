import React from 'react';
import LoginPage from './pages/LoginPage';

// Comentamos temporalmente las páginas que no estamos usando para evitar conflictos
// import PayrollPage from './pages/PayrollPage'; 
// import EmployeesPage from './pages/EmployeesPage';

function App() {
  return (
    <>
      {/* Renderizamos únicamente tu pantalla de Login */}
      <LoginPage />
    </>
  );
}

export default App;