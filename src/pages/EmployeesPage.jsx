import React, { useEffect, useState } from 'react';
import { employeeService } from '../services/employeeService';
import SearchBar from '../components/SearchBar';
import DepartmentFilter from '../components/DepartmentFilter';
import EmployeeTable from '../components/EmployeeTable';

export default function EmployeesPage({ onViewProfile }) {
  const [allEmployees, setAllEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [departments, setDepartments] = useState([]); // 💡 Nuevo: Lista de departamentos únicos de la BD
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeService.getAll();
      setAllEmployees(data);
      setFilteredEmployees(data);
      
      // 💡 EXTRAER DEPARTAMENTOS ÚNICOS: 
      // Mapeamos los departamentos de los empleados, limpiamos espacios/nulos y eliminamos duplicados
      const deptsUnicos = [
        ...new Set(
          data
            .map(emp => emp.departamento || emp.puesto || '')
            .filter(dept => dept.trim() !== '')
        )
      ];
      setDepartments(deptsUnicos);

    } catch (error) {
      console.error("Error cargando empleados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const aplicarFiltrosCombinados = (busqueda, departamento) => {
    let resultado = [...allEmployees];

    if (busqueda.trim()) {
      resultado = resultado.filter(emp => 
        emp.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    if (departamento) {
      resultado = resultado.filter(emp => {
        const valorDept = emp.departamento || emp.puesto || '';
        return String(valorDept).toLowerCase() === String(departamento).toLowerCase();
      });
    }

    setFilteredEmployees(resultado);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    aplicarFiltrosCombinados(query, selectedDept);
  };

  const handleFilterChange = (departmentId) => {
    setSelectedDept(departmentId);
    aplicarFiltrosCombinados(searchQuery, departmentId);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Directorio de Empleados</h1>
      
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <SearchBar onSearch={handleSearch} />
        {/* 💡 Le pasamos la lista dinámica de departamentos al componente */}
        <DepartmentFilter 
          departments={departments} 
          onFilterChange={handleFilterChange} 
        />
      </div>

      {loading ? (
        <p>Cargando empleados...</p>
      ) : (
        <EmployeeTable employees={filteredEmployees} onViewProfile={onViewProfile} />
      )}
    </div>
  );
}