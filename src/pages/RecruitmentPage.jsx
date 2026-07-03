import { useEffect, useState } from 'react';
import { candidateService } from '../services/candidateService.js';

export const RecruitmentPage = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        // Llamamos al puente que se construyo
        const data = await candidateService.getAll();
        setCandidates(data);
      } catch (error) {
        console.error("Falló la carga de candidatos:", error);
      }
    };

    loadCandidates();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Tablero de Selección</h1>
      <p>Total de postulantes obtenidos desde Electron: <strong>{candidates.length}</strong></p>
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e2e8f0', borderRadius: '8px' }}>
        <h2>Datos en crudo (Prueba de conexión):</h2>
        <pre>{JSON.stringify(candidates, null, 2)}</pre>
      </div>
    </div>
  );
};