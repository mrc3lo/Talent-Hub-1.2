import { useEffect, useState } from 'react';
import { candidateService } from '../services/candidateService.js';
import { KanbanBoard } from '../components/KanbanBoard';

export const RecruitmentPage = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        const data = await candidateService.getAll();
        setCandidates(data);
      } catch (error) {
        console.error("Falló la carga de candidatos:", error);
      }
    };

    loadCandidates();
  }, []);

  // Función que se ejecuta al soltar la tarjeta en una nueva columna
  const handleStatusChange = async (candidateId, newStatus) => {
    // 1. Actualización visual instantánea en React
    setCandidates(prevCandidates => 
      prevCandidates.map(c => 
        // Comparamos usando == por si el ID viene como texto o número
        (c.id == candidateId || c._id == candidateId) 
          ? { ...c, estado: newStatus } 
          : c
      )
    );

    // 2. Aquí preparas la conexión con el Backend (Electron/MongoDB)
    try {
      // Cuando tengas el update listo en tu Service, descomentas esta línea:
      // await candidateService.updateStatus(candidateId, newStatus);
      console.log(`Exito: Candidato ${candidateId} movido a la fase '${newStatus}'`);
    } catch (error) {
      console.error("Error al actualizar en la base de datos:", error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Tablero de Selección</h1>
      <p style={{ color: '#666' }}>
        Total de postulantes activos: <strong>{candidates.length}</strong>
      </p>
      
      {/* Le pasamos la nueva función al tablero */}
      <KanbanBoard 
        candidates={candidates} 
        onStatusChange={handleStatusChange} 
      />
    </div>
  );
};