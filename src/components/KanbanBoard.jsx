import React from 'react';
import { KanbanColumn } from './KanbanColumn';

export const KanbanBoard = ({ candidates, onStatusChange }) => {
  const postulados = candidates.filter(c => c.estado?.toLowerCase() === 'aplicado' || c.estado?.toLowerCase() === 'postulado');
  const enEntrevista = candidates.filter(c => c.estado?.toLowerCase() === 'entrevista');
  const enOferta = candidates.filter(c => c.estado?.toLowerCase() === 'oferta');

  return (
    <div style={{ 
      display: 'flex', 
      gap: '20px', 
      marginTop: '20px',
      overflowX: 'auto',
      paddingBottom: '10px'
    }}>
      {/* Pasamos el "status" correspondiente y la función para escuchar la caída */}
      <KanbanColumn 
        title="Nuevas Postulaciones" 
        status="aplicado" 
        candidates={postulados} 
        onDropCandidate={onStatusChange} 
      />
      <KanbanColumn 
        title="En Entrevista" 
        status="entrevista" 
        candidates={enEntrevista} 
        onDropCandidate={onStatusChange} 
      />
      <KanbanColumn 
        title="Ofertas de Trabajo" 
        status="oferta" 
        candidates={enOferta} 
        onDropCandidate={onStatusChange} 
      />
    </div>
  );
};