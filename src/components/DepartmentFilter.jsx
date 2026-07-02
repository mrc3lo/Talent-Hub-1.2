import React from 'react';

export default function DepartmentFilter({ onFilterChange }) {
  // Lista temporal para pruebas locales según tu arquitectura
  const departments = [
    { id: '1', nombre: 'Recursos Humanos' },
    { id: '2', nombre: 'Tecnología' },
    { id: '3', nombre: 'Finanzas' }
  ];

  return (
    <select
      onChange={(e) => onFilterChange(e.target.value)}
      style={{
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        backgroundColor: 'white'
      }}
    >
      <option value="">Todos los departamentos</option>
      {departments.map((dept) => (
        <option key={dept.id} value={dept.id}>
          {dept.nombre}
        </option>
      ))}
    </select>
  );
}