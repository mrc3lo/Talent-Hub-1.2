// Busca tu componente App en App.jsx y estructúralo exactamente así:
import React, { useState } from 'react';
import EmployeesPage from './pages/EmployeesPage';
import EmployeeProfilePage from './pages/EmployeeProfilePage';

export default function App() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh' }}>
      <nav style={{ backgroundColor: '#343a40', padding: '15px', color: 'white' }}>
        <strong>TalentHub v1.0</strong>
      </nav>

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
  );
}