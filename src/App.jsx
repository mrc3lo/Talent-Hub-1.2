import React from 'react';
import EmployeesPage from './pages/EmployeesPage';

/* 
  Por ahora renderizamos directamente la página de empleados aquí.
  Más adelante, el Integrante C colocará el "Router" en este archivo 
  para manejar el Login y las demás secciones.
*/
function App() {
  return (
    <>
      <EmployeesPage />
    </>
  );
}

export default App;