import React, { useEffect, useState } from 'react';
import { employeeService } from '../services/employeeService';
// Importamos los componentes según tu arquitectura de archivos
import SearchBar from '../components/SearchBar';
import DepartmentFilter from '../components/DepartmentFilter';
import EmployeeTable from '../components/EmployeeTable';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para cargar todos los empleados
  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (error) {
      console.error("Error cargando empleados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // Manejador para la búsqueda (Paso 4 del flujo de trabajo)
  const handleSearch = async (query) => {
    if (!query.trim()) {
      loadEmployees(); // Si limpia el buscador, recargamos todos
      return;
    }
    
    try {
      const data = await employeeService.search(query);
      setEmployees(data);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
    }
  };

  // Manejador para el filtro de departamentos (Próximo paso)
  const handleFilterChange = (departmentId) => {
    // Aquí puedes aplicar lógica de filtrado en el estado o crear un IPC dedicado
    console.log("Filtrar por departamento:", departmentId);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Directorio de Empleados</h1>
      
      {/* Contenedor de filtros */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <SearchBar onSearch={handleSearch} />
        <DepartmentFilter onFilterChange={handleFilterChange} />
      </div>

      {/* Tabla de datos que reemplaza a la lista <ul> */}
      {loading ? (
        <p>Cargando empleados...</p>
      ) : (
        <EmployeeTable employees={employees} />
      )}
    </div>
  );
}