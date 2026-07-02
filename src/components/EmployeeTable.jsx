import React from 'react';

export default function EmployeeTable({ employees }) {
  
  // Función para manejar cuando se hace clic en un empleado y abrir su perfil
  const handleOpenProfile = (employeeId) => {
    // Por ahora, para probar localmente, haremos un console.log
    // En la integración, aquí usarás el Router para ir a /profile/:id
    console.log("Abriendo perfil del empleado con ID:", employeeId);
    alert(`Redireccionando al perfil del empleado ID: ${employeeId}`);
  };

  if (employees.length === 0) {
    return <p style={{ color: '#666', marginTop: '10px' }}>No se encontraron empleados.</p>;
  }

  return (
    <div style={{ marginTop: '15px', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '12px' }}>Nombre</th>
            <th style={{ padding: '12px' }}>Puesto</th>
            <th style={{ padding: '12px' }}>Departamento</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr 
              key={emp.id || emp._id} 
              style={{ borderBottom: '1px solid #eee', transition: 'background 0.2s' }}
              // Efecto hover simple con JS para no depender de librerías aún
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <td style={{ padding: '12px' }}>{emp.nombre}</td>
              <td style={{ padding: '12px' }}>{emp.puesto || 'No asignado'}</td>
              <td style={{ padding: '12px' }}>{emp.departamento || 'General'}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <button 
                  onClick={() => handleOpenProfile(emp.id || emp._id)}
                  style={{
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Ver Perfil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}