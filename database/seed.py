from config import get_db
from datetime import datetime
from bson import ObjectId

db = get_db()

usuarios = db["usuarios"]
departamentos = db["departamentos"]
puestos = db["puestos"]
empleados = db["empleados"]
evaluaciones = db["evaluaciones"]
capacitaciones = db["capacitaciones"]
nominas = db["nominas"]
candidatos = db["candidatos"]
historial = db["historial_puestos"]

# -------------------------
# LIMPIEZA OPCIONAL
# -------------------------
# db.drop_collection("usuarios")
# db.drop_collection("departamentos")
# db.drop_collection("puestos")
# db.drop_collection("empleados")
# db.drop_collection("evaluaciones")
# db.drop_collection("capacitaciones")
# db.drop_collection("nominas")
# db.drop_collection("candidatos")
# db.drop_collection("historial_puestos")

# -------------------------
# USUARIOS
# -------------------------
if usuarios.count_documents({}) == 0:
    rrhh_id = usuarios.insert_one({
        "nombre": "Marcelo Díaz",
        "email": "rrhh@talenthub.cl",
        "password": "hash",
        "rol": "rrhh"
    }).inserted_id

# -------------------------
# DEPARTAMENTOS
# -------------------------
if departamentos.count_documents({}) == 0:
    tech_id = departamentos.insert_one({
        "nombre": "Tecnología",
        "descripcion": "Departamento TI"
    }).inserted_id

# -------------------------
# PUESTOS
# -------------------------
if puestos.count_documents({}) == 0:
    dev_id = puestos.insert_one({
        "nombre": "Desarrollador",
        "descripcion": "Backend",
        "salarioMinimo": 900000,
        "salarioMaximo": 1800000
    }).inserted_id

# -------------------------
# EMPLEADOS
# -------------------------
if empleados.count_documents({}) == 0:
    emp_id = empleados.insert_one({
        "cedula": "11111111-1",
        "nombre": "Juan Pérez",
        "email": "juan@talenthub.cl",
        "telefono": "+56912345678",
        "fechaIngreso": datetime(2025, 1, 10),
        "departamentoId": tech_id,
        "puestoId": dev_id,
        "estado": "activo",
        "remoto": True,
        "pais": "Chile"
    }).inserted_id

# -------------------------
# EVALUACIONES
# -------------------------
if evaluaciones.count_documents({}) == 0:
    evaluaciones.insert_one({
        "empleadoId": emp_id,
        "fecha": datetime(2026, 6, 1),
        "evaluador": "María González",
        "puntaje": 5,
        "comentarios": "Excelente trabajo."
    })

# -------------------------
# CAPACITACIONES
# -------------------------
if capacitaciones.count_documents({}) == 0:
    capacitaciones.insert_one({
        "empleadoId": emp_id,
        "nombre": "React Avanzado",
        "tipo": "Técnica",
        "institucion": "Udemy",
        "fecha": datetime(2026, 2, 10)
    })

# -------------------------
# NOMINA
# -------------------------
if nominas.count_documents({}) == 0:
    nominas.insert_one({
        "empleadoId": emp_id,
        "mes": 12,
        "ano": 2025,
        "salarioBase": 1200000,
        "bonos": 150000,
        "descuentos": 50000,
        "neto": 1300000
    })

# -------------------------
# CANDIDATOS
# -------------------------
if candidatos.count_documents({}) == 0:
    candidatos.insert_one({
        "nombre": "Pedro Soto",
        "email": "pedro@gmail.com",
        "puestoId": dev_id,
        "estado": "entrevista",
        "fechaAplicacion": datetime(2026, 1, 15)
    })

# -------------------------
# HISTORIAL PUESTOS
# -------------------------
if historial.count_documents({}) == 0:
    historial.insert_one({
        "empleadoId": emp_id,
        "puestoId": dev_id,
        "fechaInicio": datetime(2025, 1, 10),
        "fechaFin": None
    })

print("✔ Seed completado correctamente")