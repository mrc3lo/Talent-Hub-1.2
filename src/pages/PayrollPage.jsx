import React, { useState, useEffect } from 'react';
import { countryService } from '../services/countryService';
import { payrollService } from '../services/payrollService';

export default function PayrollPage() {
  const [countries, setCountries] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [loading, setLoading] = useState(true);

  // Estados para el formulario de nueva nómina
  const [formMonto, setFormMonto] = useState('');
  const [formFecha, setFormFecha] = useState('');
  const [formMessage, setFormMessage] = useState('');

  useEffect(() => {
    async function loadCountries() {
      try {
        setLoading(true);
        const countriesList = await countryService.getAllCountries();
        setCountries(countriesList);
      } catch (error) {
        console.error("Error al cargar los países:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCountries();
  }, []);

  const handleCountryChange = async (event) => {
    const countryCode = event.target.value;
    setSelectedCountry(countryCode);
    setFormMessage('');
    
    // Limpiar formulario al cambiar de país
    setFormMonto('');
    setFormFecha('');

    if (countryCode) {
      const filteredData = await payrollService.getNominaByCountry(countryCode);
      setPayrolls(filteredData);
    } else {
      setPayrolls([]);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormMessage('');

    if (!formMonto || !formFecha) {
      setFormMessage('Por favor, rellene todos los campos del formulario.');
      return;
    }

    const payload = {
      country: selectedCountry,
      monto: formMonto,
      fecha: formFecha
    };

    const response = await payrollService.createNomina(payload);

    if (response.success) {
      setPayrolls(response.data); // El backend nos devuelve la lista actualizada del país
      setFormMonto('');
      setFormFecha('');
      setFormMessage('Nómina registrada exitosamente.');
    } else {
      setFormMessage('Hubo un error al registrar la nómina.');
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>Cargando módulo...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Gestión de Nóminas Internacionales</h2>

      {/* Selector de Países */}
      <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
        <label htmlFor="country-select" style={{ marginRight: '10px', fontWeight: 'bold' }}>
          Seleccione un país para gestionar:
        </label>
        <select 
          id="country-select"
          value={selectedCountry} 
          onChange={handleCountryChange}
          style={{ padding: '6px 12px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">-- Seleccione un país --</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* Si no se ha elegido país, mostramos un mensaje amistoso y cortamos la renderización de abajo */}
      {!selectedCountry ? (
        <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#e9ecef', borderRadius: '6px', color: '#495057' }}>
          <h3>Por favor, elija un país del menú superior para desplegar el historial y las acciones de nómina.</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '30px', marginTop: '20px' }}>
          
          {/* LADO IZQUIERDO: Formulario de Registro (Opción B) */}
          <div style={{ flex: '1', padding: '20px', border: '1px solid #dee2e6', borderRadius: '6px', backgroundColor: '#fff' }}>
            <h4 style={{ marginTop: 0, marginBottom: '15px' }}>Registrar Nueva Nómina</h4>
            
            <form onSubmit={handleFormSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>Monto Total:</label>
                <input 
                  type="number" 
                  placeholder="Ej: 2500" 
                  value={formMonto}
                  onChange={(e) => setFormMonto(e.target.value)}
                  style={{ width: '100%', padding: '6px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>Fecha de Cierre:</label>
                <input 
                  type="date" 
                  value={formFecha}
                  onChange={(e) => setFormFecha(e.target.value)}
                  style={{ width: '100%', padding: '6px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <button type="submit" style={{ width: '100%', padding: '8px', backgroundColor: '#0d6efd', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                Guardar Nómina
              </button>
            </form>

            {formMessage && (
              <div style={{ marginTop: '15px', padding: '8px', fontSize: '13px', borderRadius: '4px', backgroundColor: formMessage.includes('exitosamente') ? '#d1e7dd' : '#f8d7da', color: formMessage.includes('exitosamente') ? '#0f5132' : '#842029' }}>
                {formMessage}
              </div>
            )}
          </div>

          {/* LADO DERECHO: Tabla de Historial */}
          <div style={{ flex: '2' }}>
            <h4 style={{ marginTop: 0, marginBottom: '15px' }}>Historial del País</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #dee2e6', textAlign: 'left', backgroundColor: '#f1f3f5' }}>
                  <th style={{ padding: '10px' }}>Fecha</th>
                  <th style={{ padding: '10px' }}>Monto</th>
                  <th style={{ padding: '10px' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {payrolls.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#6c757d', italic: 'true' }}>
                      No existen registros previos para este país. ¡Cree el primero!
                    </td>
                  </tr>
                ) : (
                  payrolls.map((payroll) => (
                    <tr key={payroll.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '10px' }}>{payroll.fecha}</td>
                      <td style={{ padding: '10px' }}>${payroll.monto}</td>
                      <td style={{ padding: '10px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          backgroundColor: payroll.estado === 'Pagado' ? '#d1e7dd' : '#fff3cd',
                          color: payroll.estado === 'Pagado' ? '#0f5132' : '#664d03',
                          fontWeight: 'bold'
                        }}>
                          {payroll.estado}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );
}