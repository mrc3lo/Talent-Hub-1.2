import React from 'react';
import { CandidateCard } from './CandidateCard';

// 1. Ahora la columna recibe un "status" y una función "onDropCandidate"
export const KanbanColumn = ({ title, status, candidates, onDropCandidate }) => {
  
  // 2. Esta función permite que el área sea "soltable" (por defecto HTML no lo permite)
  const handleDragOver = (e) => {
    e.preventDefault(); 
  };

  // 3. Esta función se ejecuta cuando soltamos la tarjeta
  const handleDrop = (e) => {
    e.preventDefault();
    // Recuperamos el ID que guardamos en la tarjeta
    const candidateId = e.dataTransfer.getData('candidateId'); 
    
    // Si hay un ID y tenemos la función, avisamos hacia arriba que hubo un movimiento
    if (candidateId && onDropCandidate) {
      onDropCandidate(candidateId, status); 
    }
  };

  return (
    <div 
      onDragOver={handleDragOver} // <-- Activamos la zona de caída
      onDrop={handleDrop} // <-- Capturamos la tarjeta soltada
      style={{
        backgroundColor: '#343b80',
        borderRadius: '8px',
        padding: '15px',
        width: '280px',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column'
      }}>
      <h3 style={{ marginTop: 0, fontSize: '16px', 
        //color: '#475569', 
        marginBottom: '15px' }}>
        {title} ({candidates.length})
      </h3>
      
      <div style={{ flex: 1 }}>
        {candidates.map((candidate) => (
          <CandidateCard key={candidate.id || candidate._id} candidate={candidate} />
        ))}
      </div>
    </div>
  );
};