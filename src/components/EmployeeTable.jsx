import React from 'react';

export default function EmployeeTable({ employees, onViewProfile }) {
  
  if (employees.length === 0) {
    return <p style={{ color: '#666', marginTop: '10px' }}>No se encontraron empleados.</p>;
  }

  return (
    <div style={{ marginTop: '15px', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '12px' }}>Nombre</th>
            <th style={{ padding: '12px' }}>RUT/Cédula</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px' }}>{emp.nombre}</td>
              <td style={{ padding: '12px' }}>{emp.cedula}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <button 
                  onClick={() => {
                    const idFinal = emp.id || emp._id;
                    console.log("1. Clic en Tabla. ID capturado:", idFinal);
                    onViewProfile(idFinal);
                  }}
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