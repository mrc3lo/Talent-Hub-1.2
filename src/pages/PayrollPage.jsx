import React, { useEffect, useState } from 'react'; // 1. Agregamos hooks aquí
import { payrollService } from '../services/payrollService'; // 2. Importamos el servicio

function PayrollPage() {
  // 3. Definimos el estado para guardar los datos
  const [data, setData] = useState([]);

  // 4. Creamos la conexión con el backend al cargar la página
  useEffect(() => {
    payrollService.getAll().then((response) => {
      console.log("Datos recibidos:", response);
      if (response && response.success) {
        setData(response.data);
      }
    });
  }, []);

  return (
    <div>
      <h1>Módulo de Nómina</h1>
      <p>Espacio de trabajo temporal para las liquidaciones.</p>
      
      {/* 5. Mostramos los datos para verificar que llegan */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default PayrollPage;