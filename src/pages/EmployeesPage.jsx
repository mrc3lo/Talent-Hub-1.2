import React, { useEffect, useState } from 'react';
import { employeeService } from '../services/employeeService';
import SearchBar from '../components/SearchBar';
import DepartmentFilter from '../components/DepartmentFilter';
import EmployeeTable from '../components/EmployeeTable';

export default function EmployeesPage({ onViewProfile }) {
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [departments, setDepartments] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  // Cargar departamentos únicos al inicio
  useEffect(() => {
    async function loadInitialDepartments() {
      try {
        const data = await employeeService.getAll();
        const deptsUnicos = [
          ...new Set(
            data
              .map(emp => emp.departamento || '')
              .filter(dept => dept.trim() !== '')
          )
        ];
        setDepartments(deptsUnicos);
      } catch (error) {
        console.error("Error cargando departamentos iniciales:", error);
      }
    }
    loadInitialDepartments();
  }, []);

  // Efecto que controla la búsqueda en tiempo real (Base de Datos) + Filtro (Local)
  useEffect(() => {
    async function obtenerYFiltrarEmpleados() {
      setLoading(true);
      try {
        let resultados = [];
        
        // Si no hay texto, trae todos de la BD; si hay texto, usa el IPC de búsqueda por RegExp
        if (!searchQuery.trim()) {
          resultados = await employeeService.getAll();
        } else {
          resultados = await employeeService.search(searchQuery);
        }

        // Aplicar el filtro de departamento de forma local sobre los resultados de la BD
        if (selectedDept) {
          resultados = resultados.filter(emp => 
            String(emp.departamento).toLowerCase() === String(selectedDept).toLowerCase()
          );
        }

        setFilteredEmployees(resultados);
      } catch (error) {
        console.error("Error al filtrar empleados:", error);
      } finally {
        setLoading(false);
      }
    }

    obtenerYFiltrarEmpleados();
  }, [searchQuery, selectedDept]); // Se ejecuta cada vez que cambia la búsqueda o el selector

  return (
    <div style={{ padding: '20px' }}>
      <h1>Directorio de Empleados</h1>
      
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <SearchBar onSearch={(query) => setSearchQuery(query)} />
        <DepartmentFilter 
          departments={departments} 
          onFilterChange={(deptId) => setSelectedDept(deptId)} 
        />
      </div>

      {loading ? (
        <p>Procesando directorio...</p>
      ) : (
        <EmployeeTable employees={filteredEmployees} onViewProfile={onViewProfile} />
      )}
    </div>
  );
}