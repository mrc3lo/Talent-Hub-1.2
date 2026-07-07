import React, { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // Dispara la búsqueda automáticamente en cada pulsación
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <input
        type="text"
        placeholder="Buscar por nombre o cédula..."
        value={query}
        onChange={handleChange}
        style={{
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          width: '280px',
          fontSize: '14px'
        }}
      />
    </div>
  );
}