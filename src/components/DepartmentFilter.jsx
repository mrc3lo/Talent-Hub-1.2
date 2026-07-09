import React from 'react';

export default function DepartmentFilter({ departments = [], onFilterChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <select
        onChange={(e) => onFilterChange(e.target.value)}
        style={{
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          //backgroundColor: '#fff',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        <option value="">Todos los departamentos</option>
        
        {/* 💡 Sincronización con la BD: Renderiza dinámicamente las opciones reales */}
        {departments.map((dept, index) => (
          <option key={index} value={dept}>
            {/* Capitalizamos la primera letra para que se vea ordenado en la interfaz */}
            {dept.charAt(0).toUpperCase() + dept.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}