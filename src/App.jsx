import React from 'react';
import EmployeesPage from './pages/EmployeesPage';
import { RecruitmentPage } from './pages/RecruitmentPage'; // <-- 1. Importación de mi página

/* 
  Por ahora renderizamos directamente la página aquí.
  Más adelante, el Integrante C colocará el "Router" en este archivo 
  para manejar el Login y las demás secciones.
*/
function App() {
  return (
    <>
      {/* <EmployeesPage />  <-- 2. Se oculta temporalmente la vista de compañero */}
      
      <RecruitmentPage /> {/* <-- 3. Se muestra mi pagina (B) PARA PODER TRABAJAR */}
    </>
  );
}

export default App;