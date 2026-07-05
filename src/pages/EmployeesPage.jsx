import React, { useEffect, useState } from 'react';
import { employeeService } from '../services/employeeService';
import SearchBar from '../components/SearchBar';
import DepartmentFilter from '../components/DepartmentFilter';
import EmployeeTable from '../components/EmployeeTable';

export default function EmployeesPage({ onViewProfile }) { // ← Recibe la propiedad aquí
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleSearch = async (query) => {
    if (!query.trim()) {
      loadEmployees();
      return;
    }
    try {
      const data = await employeeService.search(query);
      setEmployees(data);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
    }
  };

  const handleFilterChange = (departmentId) => {
    console.log("Filtrar por departamento:", departmentId);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Directorio de Empleados</h1>
      
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <SearchBar onSearch={handleSearch} />
        <DepartmentFilter onFilterChange={handleFilterChange} />
      </div>

      {loading ? (
        <p>Cargando empleados...</p>
      ) : (
        <EmployeeTable 
          employees={employees} 
          onViewProfile={(id) => {
            console.log("2. Recibido en EmployeesPage. Enviando a App.jsx:", id);
            onViewProfile(id);
          }} 
        /> // ← Se la pasa a la tabla
      )}
    </div>
  );
}