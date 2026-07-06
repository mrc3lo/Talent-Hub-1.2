import React from 'react';

export const CandidateCard = ({ candidate }) => {
  
  // 1. Función que se ejecuta al empezar a arrastrar
  const handleDragStart = (e) => {
    // Guardamos el ID del candidato en el "portapapeles" del evento de arrastre
    e.dataTransfer.setData('candidateId', candidate.id || candidate._id);
  };

  return (
    <div 
      draggable // <-- 2. Esto le dice al navegador "se puede arrastrar"
      onDragStart={handleDragStart} // <-- 3. Al arrastrar, ejecutamos la función
      style={{
        backgroundColor: 'white',
        padding: '12px',
        marginBottom: '10px',
        borderRadius: '6px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        cursor: 'grab',
        borderLeft: '4px solid #3b82f6'
      }}>
      <h4 style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#333' }}>
        {candidate.nombre}
      </h4>
      <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
        {candidate.puesto || candidate.puesto_aplicado_id}
      </p>
    </div>
  );
};