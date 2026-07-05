import React, { useEffect, useState } from 'react';
import { employeeService } from '../services/employeeService';

// Función auxiliar para formatear fechas de manera segura sin romper la app
const formatFechaSegura = (fechaRaw) => {
  if (!fechaRaw) return 'No registrada';
  try {
    const fecha = new Date(fechaRaw);
    // Si la fecha no es válida, devolver el texto tal cual
    if (isNaN(fecha.getTime())) return String(fechaRaw);
    return fecha.toLocaleDateString('es-CL'); // Formato Chileno DD-MM-AAAA
  } catch (e) {
    return String(fechaRaw);
  }
};

function EmployeeCard({ info }) {
  if (!info) return null;
  return (
    <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #dee2e6' }}>
      <h2 style={{ marginTop: 0, color: '#007bff' }}>{info.nombre || 'Sin nombre'}</h2>
      <p><strong>RUT/Cédula:</strong> {info.cedula || 'No registrado'}</p>
      <p><strong>Email:</strong> {info.email || 'No registrado'}</p>
      <p><strong>Teléfono:</strong> {info.telefono || 'No registrado'}</p>
      <p><strong>País:</strong> {info.pais || 'Chile'} {info.remoto ? '(Remoto)' : '(Presencial)'}</p>
      <p><strong>Estado:</strong> <span style={{ color: info.estado === 'activo' ? 'green' : 'red', fontWeight: 'bold' }}>{info.estado || 'activo'}</span></p>
    </div>
  );
}

function PerformanceHistory({ evaluaciones = [] }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>Historial de Evaluaciones</h3>
      {!evaluaciones || evaluaciones.length === 0 ? (
        <p style={{ color: '#666' }}>No registra evaluaciones de desempeño.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#e9ecef' }}>
              <th style={{ padding: '10px' }}>Fecha</th>
              <th style={{ padding: '10px' }}>Evaluador</th>
              <th style={{ padding: '10px' }}>Puntaje</th>
              <th style={{ padding: '10px' }}>Comentarios</th>
            </tr>
          </thead>
          <tbody>
            {evaluaciones.map((ev, index) => (
              <tr key={ev.id || index} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '10px' }}>{formatFechaSegura(ev.fecha)}</td>
                <td style={{ padding: '10px' }}>{ev.evaluador || 'N/A'}</td>
                <td style={{ padding: '10px' }}>⭐ {ev.puntaje || 0} / 5</td>
                <td style={{ padding: '10px' }}>{ev.comentarios || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function TrainingList({ capacitaciones = [] }) {
  return (
    <div>
      <h3>Capacitaciones e Historial Formativo</h3>
      {!capacitaciones || capacitaciones.length === 0 ? (
        <p style={{ color: '#666' }}>No registra capacitaciones completadas.</p>
      ) : (
        <ul style={{ paddingLeft: '20px' }}>
          {capacitaciones.map((cap, index) => (
            <li key={cap.id || index} style={{ marginBottom: '12px' }}>
              <strong>{cap.nombre || 'Curso sin nombre'}</strong> {cap.institucion ? ` - ${cap.institucion}` : ''} 
              <span style={{ fontSize: '12px', backgroundColor: '#e2e3e5', padding: '3px 6px', borderRadius: '4px', marginLeft: '10px' }}>
                {cap.tipo || 'General'}
              </span>
              <br />
              <small style={{ color: '#6c757d' }}>Completado el: {formatFechaSegura(cap.fecha)}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function EmployeeProfilePage({ employeeId, onBack }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!employeeId) return;

    setLoading(true);
    setError(null);
    
    employeeService.getProfileData(employeeId)
      .then(data => {
        if (!data) {
          setError("No se encontraron registros vinculados a este ID en MongoDB.");
        } else {
          setProfile(data);
        }
      })
      .catch(err => {
        console.error("Error al obtener el perfil en React:", err);
        setError("Error de comunicación con el proceso IPC de Electron.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [employeeId]);

  if (loading) return <p style={{ padding: '20px' }}>Cargando expediente de la base de datos...</p>;
  
  if (error) return (
    <div style={{ padding: '20px' }}>
      <p style={{ color: 'red', fontWeight: 'bold' }}>⚠️ Ocurrió un inconveniente: {error}</p>
      <button onClick={onBack} style={{ padding: '8px 16px', cursor: 'pointer' }}>Volver al Directorio</button>
    </div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <button 
        onClick={onBack} 
        style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        ⬅ Volver al Directorio
      </button>

      <h1 style={{ borderBottom: '2px solid #343a40', paddingBottom: '10px' }}>Expediente del Empleado</h1>
      
      <EmployeeCard info={profile?.info} />
      <PerformanceHistory evaluaciones={profile?.evaluaciones} />
      <TrainingList capacitaciones={profile?.capacitaciones} />
    </div>
  );
}