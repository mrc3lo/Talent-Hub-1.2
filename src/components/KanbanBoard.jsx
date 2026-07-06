import React, { useState } from 'react';
import { KanbanColumn } from './KanbanColumn';
// Importamos el servicio para guardar en la base de datos
import { candidateService } from '../services/candidateService';

export const KanbanBoard = ({ candidates, onStatusChange, onRefresh }) => {
  // Estados locales para los inputs del formulario
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoPuesto, setNuevoPuesto] = useState('');

  // Separación de los candidatos por columna
  const postulados = candidates.filter(c => c.estado?.toLowerCase() === 'aplicado' || c.estado?.toLowerCase() === 'postulado');
  const enEntrevista = candidates.filter(c => c.estado?.toLowerCase() === 'entrevista');
  const enOferta = candidates.filter(c => c.estado?.toLowerCase() === 'oferta');

  // Función que se ejecuta al enviar el formulario
  const handleCrearCandidato = async (e) => {
    e.preventDefault();
    
    // Validación simple para no enviar datos vacíos
    if (!nuevoNombre.trim() || !nuevoPuesto.trim()) return;

    try {
      // 1. Guardamos en la base de datos
      await candidateService.create({
        nombre: nuevoNombre,
        puesto: nuevoPuesto
      });

      // 2. Limpiamos los campos visualmente
      setNuevoNombre('');
      setNuevoPuesto('');

      // 3. Avisamos al componente padre que recargue la lista
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Hubo un error al guardar el candidato:", error);
    }
  };

  return (
    <div>
      {/* SECCIÓN DEL FORMULARIO */}
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

      {/* SECCIÓN DE LAS COLUMNAS KANBAN */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginTop: '10px',
        overflowX: 'auto',
        paddingBottom: '10px'
      }}>
        <KanbanColumn 
          title="Nuevas Postulaciones" 
          status="postulado" // Ajustado para coincidir con tu backend
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
    </div>
  );
};