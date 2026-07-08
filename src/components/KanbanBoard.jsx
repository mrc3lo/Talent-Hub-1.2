import React, { useState } from 'react';
import { KanbanColumn } from './KanbanColumn';
import { candidateService } from '../services/candidateService';

export const KanbanBoard = ({ candidates, onStatusChange, onRefresh }) => {
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoPuesto, setNuevoPuesto] = useState('');

  // 1. Filtramos los 4 estados exactos
  const aplicados = candidates.filter(c => c.estado?.toLowerCase() === 'aplicado' || c.estado?.toLowerCase() === 'postulado');
  const enEntrevista = candidates.filter(c => c.estado?.toLowerCase() === 'entrevista');
  const conOferta = candidates.filter(c => c.estado?.toLowerCase() === 'oferta');
  const rechazados = candidates.filter(c => c.estado?.toLowerCase() === 'rechazado'); // <-- LA NUEVA FILA

  const handleCrearCandidato = async (e) => {
    e.preventDefault();
    if (!nuevoNombre.trim() || !nuevoPuesto.trim()) return;

    try {
      await candidateService.create({
        nombre: nuevoNombre,
        puesto: nuevoPuesto
      });

      setNuevoNombre('');
      setNuevoPuesto('');

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Hubo un error al guardar el candidato:", error);
    }
  };

  return (
    <div>
      <form 
        onSubmit={handleCrearCandidato} 
        style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          background: '#f8f9fa', 
          borderRadius: '8px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}
      >
        <span style={{ fontWeight: 'bold' }}>Nuevo Postulante:</span>
        <input 
          type="text" 
          placeholder="Nombre completo" 
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input 
          type="text" 
          placeholder="Puesto (ej. Desarrollador)" 
          value={nuevoPuesto}
          onChange={(e) => setNuevoPuesto(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button 
          type="submit" 
          style={{ padding: '8px 16px', borderRadius: '4px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Agregar
        </button>
      </form>

      {/* 2. Renderizamos las 4 columnas con los nombres y estados correctos */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginTop: '10px',
        overflowX: 'auto',
        paddingBottom: '10px'
      }}>
        <KanbanColumn 
          title="Aplicados" 
          status="aplicado" 
          candidates={aplicados} 
          onDropCandidate={onStatusChange} 
        />
        <KanbanColumn 
          title="En entrevista" 
          status="entrevista" 
          candidates={enEntrevista} 
          onDropCandidate={onStatusChange} 
        />
        <KanbanColumn 
          title="Con oferta" 
          status="oferta" 
          candidates={conOferta} 
          onDropCandidate={onStatusChange} 
        />
        <KanbanColumn 
          title="Rechazados" 
          status="rechazado" 
          candidates={rechazados} 
          onDropCandidate={onStatusChange} 
        />
      </div>
    </div>
  );
};