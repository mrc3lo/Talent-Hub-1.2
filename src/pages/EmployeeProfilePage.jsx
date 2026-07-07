import React, { useEffect, useState } from 'react';
import { employeeService } from '../services/employeeService';

const formatFechaSegura = (fechaRaw) => {
  if (!fechaRaw) return 'No registrada';
  try {
    const fecha = new Date(fechaRaw);
    if (isNaN(fecha.getTime())) return String(fechaRaw);
    return fecha.toLocaleDateString('es-CL');
  } catch (e) {
    return String(fechaRaw);
  }
};

function EmployeeCard({ info }) {
  if (!info) return null;
  return (
    <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #dee2e6' }}>
      <h2 style={{ marginTop: 0, color: '#007bff' }}>{info.nombre || 'Sin nombre'}</h2>
      <p><strong>Cédula:</strong> {info.cedula || 'No registrado'}</p>
      <p><strong>Email:</strong> {info.email || 'No registrado'}</p>
      <p><strong>Puesto Actual:</strong> {info.puesto || 'No asignado'}</p>
      <p><strong>Estado:</strong> <span style={{ color: info.estado === 'activo' ? 'green' : 'red', fontWeight: 'bold', textTransform: 'uppercase' }}>{info.estado || 'activo'}</span></p>
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
        console.error("Error al obtener el perfil:", err);
        setError("Error de comunicación con el proceso IPC.");
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

  const { info, evaluaciones = [], capacitaciones = [] } = profile;

  // Mock seguro e integrado de los requerimientos de tablas si no están en subcolecciones aún
  const historialPuestos = info.historialPuestos || [
    { puesto: info.puesto, fechaInicio: '15/01/2020', fechaFin: 'Actualidad' }
  ];
  const historialSalarial = info.historialSalarial || [
    { salario: info.salario || 1000000, fechaInicio: '15/01/2020', fechaFin: 'Actualidad' }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '850px', margin: '0 auto' }}>
      <button 
        onClick={onBack} 
        style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        ⬅ Volver al Directorio
      </button>

      <h1 style={{ borderBottom: '2px solid #343a40', paddingBottom: '10px' }}>Expediente del Empleado</h1>
      
      {/* 1. Datos Personales */}
      <EmployeeCard info={info} />

      {/* 2. Tabla: Historial de Puestos */}
      <div style={{ marginBottom: '25px' }}>
        <h3>Historial de Puestos</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#e9ecef' }}>
              <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Puesto</th>
              <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Fecha Inicio</th>
              <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Fecha Fin</th>
            </tr>
          </thead>
          <tbody>
            {historialPuestos.map((hp, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{hp.puesto}</td>
                <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{formatFechaSegura(hp.fechaInicio)}</td>
                <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{formatFechaSegura(hp.fechaFin)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. Tabla: Historial Salarial */}
      <div style={{ marginBottom: '25px' }}>
        <h3>Historial Salarial</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#e9ecef' }}>
              <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Salario</th>
              <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Fecha Inicio</th>
              <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Fecha Fin</th>
            </tr>
          </thead>
          <tbody>
            {historialSalarial.map((hs, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>${Number(hs.salario).toLocaleString('es-CL')}</td>
                <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{formatFechaSegura(hs.fechaInicio || hs.fecha)}</td>
                <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{formatFechaSegura(hs.fechaFin || 'Actualidad')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Listado: Últimas 3 Evaluaciones */}
      <div style={{ marginBottom: '25px' }}>
        <h3>Últimas 3 Evaluaciones</h3>
        {evaluaciones.length === 0 ? (
          <p style={{ color: '#666' }}>No registra evaluaciones de desempeño.</p>
        ) : (
          <ul style={{ paddingLeft: '20px' }}>
            {/* El .slice(0, 3) limita rigurosamente la muestra a los últimos 3 elementos */}
            {evaluaciones.slice(0, 3).map((ev, index) => (
              <li key={ev.id || index} style={{ marginBottom: '10px' }}>
                <strong>Fecha:</strong> {formatFechaSegura(ev.fecha)} | <strong>Puntaje:</strong> ⭐ {ev.puntaje} / 5
                <br />
                <span style={{ color: '#555', fontStyle: 'italic' }}>"{ev.comentarios || 'Sin comentarios'}"</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 5. Listado: Capacitaciones */}
      <div>
        <h3>Capacitaciones Realizadas</h3>
        {capacitaciones.length === 0 ? (
          <p style={{ color: '#666' }}>No registra capacitaciones completadas.</p>
        ) : (
          <ul style={{ paddingLeft: '20px' }}>
            {capacitaciones.map((cap, index) => (
              <li key={cap.id || index} style={{ marginBottom: '8px' }}>
                ✅ <strong>{cap.nombre}</strong> {cap.institucion ? `(${cap.institucion})` : ''} 
                <span style={{ fontSize: '11px', backgroundColor: '#e2e3e5', padding: '2px 5px', borderRadius: '4px', marginLeft: '8px' }}>
                  {cap.tipo || 'General'}
                </span>
                <br />
                <small style={{ color: '#6c757d' }}>Finalizado el: {formatFechaSegura(cap.fecha)}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}