import React, { useState, useEffect } from 'react';

export default function PayrollPage() {
  const [nominas, setNominas] = useState([]);
  const [paises, setPaises] = useState([]);
  
  // Filtros de la Vista
  const [filtroMes, setFiltroMes] = useState('Todos');
  const [filtroAno, setFiltroAno] = useState('Todos');

  // Estado unificado del formulario
  const [form, setForm] = useState({
    empleado: '',
    mes: 'Julio',
    ano: '2026',
    salarioBase: '',
    bonos: '',
    descuentos: '',
    country: 'ARG',
    estado: 'Pendiente'
  });
  
  const [message, setMessage] = useState('');

  // Control del Detalle Internacional
  const [selectedPaisDetalle, setSelectedPaisDetalle] = useState(null);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [apiDataResult, setApiDataResult] = useState(null);

  // Estado para el modal de confirmación de borrado de nómina
  const [idALiquidarEliminar, setIdALiquidarEliminar] = useState(null);

  // Arreglos fijos para los meses y años
  const listaMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const listaAnos = ['2024', '2025', '2026', '2027'];

  // Diccionario de países
  const localCountriesDict = {
    ARG: { flag: 'https://flagcdn.com/w320/ar.png', currency: 'Peso Argentino (ARS)', lang: 'Español' },
    BOL: { flag: 'https://flagcdn.com/w320/bo.png', currency: 'Boliviano (BOB)', lang: 'Español, Quechua' },
    BRA: { flag: 'https://flagcdn.com/w320/br.png', currency: 'Real Brasileño (BRL)', lang: 'Portugués' },
    CAN: { flag: 'https://flagcdn.com/w320/ca.png', currency: 'Dólar Canadiense (CAD)', lang: 'Inglés, Francés' },
    CHL: { flag: 'https://flagcdn.com/w320/cl.png', currency: 'Peso Chileno (CLP)', lang: 'Español' },
    COL: { flag: 'https://flagcdn.com/w320/co.png', currency: 'Peso Colombiano (COP)', lang: 'Español' },
    CRI: { flag: 'https://flagcdn.com/w320/cr.png', currency: 'Colón Costarricense (CRC)', lang: 'Español' },
    ECU: { flag: 'https://flagcdn.com/w320/ec.png', currency: 'Dólar Americano (USD)', lang: 'Español' },
    SLV: { flag: 'https://flagcdn.com/w320/sv.png', currency: 'Dólar Americano (USD)', lang: 'Español' },
    ESP: { flag: 'https://flagcdn.com/w320/es.png', currency: 'Euro (EUR)', lang: 'Español' },
    GTM: { flag: 'https://flagcdn.com/w320/gt.png', currency: 'Quetzal (GTQ)', lang: 'Español' },
    HND: { flag: 'https://flagcdn.com/w320/hn.png', currency: 'Lempira (HNL)', lang: 'Español' },
    MEX: { flag: 'https://flagcdn.com/w320/mx.png', currency: 'Peso Mexicano (MXN)', lang: 'Español' },
    NIC: { flag: 'https://flagcdn.com/w320/ni.png', currency: 'Córdoba (NIO)', lang: 'Español' },
    PAN: { flag: 'https://flagcdn.com/w320/pa.png', currency: 'Balboa (PAB) / USD', lang: 'Español' },
    PRY: { flag: 'https://flagcdn.com/w320/py.png', currency: 'Guaraní (PYG)', lang: 'Español' },
    PER: { flag: 'https://flagcdn.com/w320/pe.png', currency: 'Sol (PEN)', lang: 'Español' },
    PRI: { flag: 'https://flagcdn.com/w320/pr.png', currency: 'Dólar Americano (USD)', lang: 'Español' },
    URY: { flag: 'https://flagcdn.com/w320/uy.png', currency: 'Peso Uruguayo (UYU)', lang: 'Español' },
    USA: { flag: 'https://flagcdn.com/w320/us.png', currency: 'Dólar Americano (USD)', lang: 'Inglés' },
    VEN: { flag: 'https://flagcdn.com/w320/ve.png', currency: 'Bolívar Soberano (VES)', lang: 'Español' }
  };

  useEffect(() => {
    cargarPaises();
    obtenerNominasFiltradas();
  }, []);

  useEffect(() => {
    obtenerNominasFiltradas();
  }, [filtroMes, filtroAno]);

  const cargarPaises = async () => {
    const lista = await window.api.invoke('nomina:getCountries');
    if (lista && lista.length > 0) {
      setPaises(lista);
      setForm(prev => ({ ...prev, country: lista[0].code }));
    }
  };

  const obtenerNominasFiltradas = async () => {
    const res = await window.api.invoke('nomina:filterAdvanced', { mes: filtroMes, ano: filtroAno });
    if (res && res.success) setNominas(res.data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVerInfo = (codigoPais) => {
    setSelectedPaisDetalle(codigoPais);
    setIsApiLoading(true);
    setApiDataResult(null);

    setTimeout(() => {
      const datos = localCountriesDict[codigoPais.toUpperCase()];
      setApiDataResult(datos);
      setIsApiLoading(false);
    }, 1200); 
  };

  const ejecutarBorradoSeguro = async () => {
    if (!idALiquidarEliminar) return;

    const res = await window.api.invoke('nomina:delete', idALiquidarEliminar);
    if (res && res.success) {
      setSelectedPaisDetalle(null);
      setApiDataResult(null);
      
      setForm({
        empleado: '',
        mes: 'Julio',
        ano: '2026',
        salarioBase: '',
        bonos: '',
        descuentos: '',
        country: paises.length > 0 ? paises[0].code : 'ARG',
        estado: 'Pendiente'
      });

      setMessage('Registro eliminado correctamente.');
      setIdALiquidarEliminar(null);
      await obtenerNominasFiltradas();
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage('');

    const payload = {
      ...form,
      salarioBase: parseFloat(form.salarioBase || 0),
      bonos: parseFloat(form.bonos || 0),
      descuentos: parseFloat(form.descuentos || 0),
      fecha: new Date().toISOString().split('T')[0]
    };

    const res = await window.api.invoke('nomina:create', payload);
    if (res && res.success) {
      setForm({
        empleado: '',
        mes: 'Julio',
        ano: '2026',
        salarioBase: '',
        bonos: '',
        descuentos: '',
        country: paises.length > 0 ? paises[0].code : 'ARG',
        estado: 'Pendiente'
      });
      setMessage('Nómina guardada con éxito.');
      obtenerNominasFiltradas();
    }
  };

  return (
    <div style={{ padding: '30px', 
    fontFamily: 'sans-serif', 
    //backgroundColor: '#f4f6f9', 
    minHeight: '100vh' }}>
      <h2 style={{ marginBottom: '20px', 
        //color: '#333' 
        }}>Nómina / Liquidaciones</h2>

      {/* DIÁLOGO EMBEBIDO DE CONFIRMACIÓN DE BORRADO DE NÓMINA */}
      {idALiquidarEliminar && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '350px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Confirmar Eliminación</h4>
            <p style={{ color: '#555', fontSize: '14px', marginBottom: '20px' }}>¿Seguro que deseas eliminar esta liquidación?</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={ejecutarBorradoSeguro} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Eliminar</button>
              <button onClick={() => setIdALiquidarEliminar(null)} style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* FORMULARIO */}
      <div style={{ 
        //backgroundColor: '#fff', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '25px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)' 
        }}>
        <h4 style={{ marginTop: 0 }}>Registrar Nueva Liquidación de Sueldo</h4>
        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Empleado:</label>
            <input type="text" name="empleado" value={form.empleado} onChange={handleInputChange} placeholder="Nombre del trabajador" required style={{ width: '100%', padding: '6px', boxSizing:'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Mes:</label>
            <select name="mes" value={form.mes} onChange={handleInputChange} style={{ width: '100%', padding: '6px' }}>
              {listaMeses.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Año:</label>
            <select name="ano" value={form.ano} onChange={handleInputChange} style={{ width: '100%', padding: '6px' }}>
              {listaAnos.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Salario Base:</label>
            <input type="number" name="salarioBase" value={form.salarioBase} onChange={handleInputChange} placeholder="Ej. 1000000" required style={{ width: '100%', padding: '6px', boxSizing:'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Bonos (+):</label>
            <input type="number" name="bonos" value={form.bonos} onChange={handleInputChange} placeholder="Ej. 150000" style={{ width: '100%', padding: '6px', boxSizing:'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Descuentos (-):</label>
            <input type="number" name="descuentos" value={form.descuentos} onChange={handleInputChange} placeholder="Ej. 80000" style={{ width: '100%', padding: '6px', boxSizing:'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>País Destino:</label>
            <select name="country" value={form.country} onChange={handleInputChange} style={{ width: '100%', padding: '6px' }}>
              {paises.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Estado Pago:</label>
            <select name="estado" value={form.estado} onChange={handleInputChange} style={{ width: '100%', padding: '6px' }}>
              <option value="Pendiente">Pendiente</option>
              <option value="Pagado">Pagado</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" style={{ width: '100%', padding: '8px', 
              //backgroundColor: '#198754', 
              //color: '#fff', 
              border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Guardar Nómina</button>
          </div>
        </form>
        {message && <p style={{ color: '#0d6efd', fontSize: '13px', margin: '10px 0 0 0' }}>{message}</p>}
      </div>

      {/* FILTROS */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', 
        //backgroundColor: '#fff', 
        padding: '12px', borderRadius: '6px' }}>
        <span style={{ fontWeight: 'bold', alignSelf: 'center', fontSize: '14px' }}>🔍 Filtros de Vista:</span>
        <select value={filtroMes} onChange={e => setFiltroMes(e.target.value)} style={{ padding: '5px' }}>
          <option value="Todos">Todos los Meses</option>
          {listaMeses.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={filtroAno} onChange={e => setFiltroAno(e.target.value)} style={{ padding: '5px' }}>
          <option value="Todos">Todos los Años</option>
          {listaAnos.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {/* TABLA */}
      <div style={{ //backgroundColor: '#fff', 
        borderRadius: '8px', 
        overflow: 'hidden', 
        //boxShadow: '0 2px 8px rgba(0,0,0,0.05)' 
        }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ 
              //backgroundColor: '#0d6efd', 
              //color: '#fff', 
              fontSize: '14px' 
              }}>
              <th style={{ padding: '12px' }}>Empleado</th>
              <th style={{ padding: '12px' }}>Mes</th>
              <th style={{ padding: '12px' }}>Año</th>
              <th style={{ padding: '12px' }}>Salario Base</th>
              <th style={{ padding: '12px' }}>Bonos</th>
              <th style={{ padding: '12px' }}>Descuentos</th>
              <th style={{ padding: '12px' }}>Neto</th>
              <th style={{ padding: '12px' }}>Estado</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {nominas.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ padding: '20px', textAlign: 'center', color: '#777' }}>
                  No hay liquidaciones registradas para el filtro seleccionado.
                </td>
              </tr>
            ) : (
              nominas.map(n => {
                const codigoPais = n.country ? n.country.toUpperCase() : 'ARG';
                return (
                  <tr key={n.id} style={{ borderBottom: '1px solid #eee', fontSize: '13px' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{n.empleado}</td>
                    <td style={{ padding: '12px' }}>{n.mes}</td>
                    <td style={{ padding: '12px' }}>{n.ano}</td>
                    <td style={{ padding: '12px' }}>${(n.salarioBase || 0).toLocaleString()}</td>
                    <td style={{ padding: '12px', color: 'green' }}>+${(n.bonos || 0).toLocaleString()}</td>
                    <td style={{ padding: '12px', color: 'red' }}>-${(n.descuentos || 0).toLocaleString()}</td>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>${(n.monto + (n.bonos || 0) - (n.descuentos || 0) || 0).toLocaleString()}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '3px 6px', borderRadius: '4px', fontSize: '11px', backgroundColor: n.estado === 'Pagado' ? '#d1e7dd' : '#fff3cd', color: n.estado === 'Pagado' ? '#0f5132' : '#664d03' }}>
                        {n.estado}
                      </span>
                    </td>
                    <td style={{ padding: '12px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button type="button" onClick={() => handleVerInfo(codigoPais)} style={{ padding: '4px 10px', fontSize: '11px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', 
                        //backgroundColor: '#f8f9fa' 
                        }}>
                        🌍 Ver Info {codigoPais}
                      </button>
                      <button type="button" onClick={() => setIdALiquidarEliminar(n.id)} title="Eliminar liquidación" style={{ padding: '4px 8px', fontSize: '12px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #dc3545', backgroundColor: '#fff', color: '#dc3545' }}>
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* DETALLES INTERNACIONALES */}
      {selectedPaisDetalle && (
        <div style={{ marginTop: '25px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e9ecef', paddingBottom: '10px', marginBottom: '15px' }}>
            <h4 style={{ margin: 0, color: '#495057', fontSize: '15px' }}>📋 Detalles de Cumplimiento Internacional ({selectedPaisDetalle})</h4>
            <button onClick={() => setSelectedPaisDetalle(null)} style={{ cursor: 'pointer', border: 'none', background: 'transparent', fontWeight: 'bold', fontSize: '16px', color: '#6c757d' }}>✕</button>
          </div>
          
          {isApiLoading ? (
            <div style={{ fontSize: '13px', color: '#495057', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 0' }}>
              ⌛ <strong>Cargando informacion en tiempo real, espere un momento...</strong>
            </div>
          ) : (
            apiDataResult && (
              <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                <img src={apiDataResult.flag} alt={`Bandera de ${selectedPaisDetalle}`} style={{ width: '70px', borderRadius: '4px', border: '1px solid #ced4da', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} />
                <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.6' }}>
                  <p style={{ margin: '3px 0' }}><strong>Moneda Homologada de Remesa:</strong> {apiDataResult.currency}</p>
                  <p style={{ margin: '3px 0' }}><strong>Idioma del Contrato Adicional:</strong> {apiDataResult.lang}</p>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}