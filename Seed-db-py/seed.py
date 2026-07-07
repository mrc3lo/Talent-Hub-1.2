import datetime
from pymongo import MongoClient
from bson import ObjectId

def run_seed():
    # 1. Conexión local a MongoDB (TalentHub usa la base de datos 'talent_hub')
    MONGO_URI = "mongodb://localhost:27017"
    client = MongoClient(MONGO_URI)
    db = client["talent_hub"]
    
    print("--- Iniciando proceso de seeding para TalentHub ---")

    # 2. Borrar colecciones anteriores para limpiar datos corruptos
    collections_to_drop = [
        "usuarios", "departamentos", "puestos", "empleados", 
        "evaluaciones", "capacitaciones", "nomina", "candidatos"
    ]
    for col in collections_to_drop:
        db[col].drop()
    print("✔ Colecciones anteriores eliminadas de la base de datos.")

    # 3. Definición de IDs fijos (ObjectIds idénticos a tu versión JS)
    deptoTec = ObjectId("507f191e810c19729de88101")
    deptoVen = ObjectId("507f191e810c19729de88102")
    deptoRrhh = ObjectId("507f191e810c19729de88103")
    deptoFin = ObjectId("507f191e810c19729de88104")

    pDev = ObjectId("507f191e810c19729de88a01")
    pVen = ObjectId("507f191e810c19729de88a02")
    pRrhh = ObjectId("507f191e810c19729de88a03")
    pCont = ObjectId("507f191e810c19729de88a04")

    empJuan = ObjectId("507f191e810c19729de88201")
    empMaria = ObjectId("507f191e810c19729de88202")
    empCarlos = ObjectId("507f191e810c19729de88203")
    empAna = ObjectId("507f191e810c19729de88204")
    empLuis = ObjectId("507f191e810c19729de88205")

    # 4. Inserción de Departamentos
    db["departamentos"].insert_many([
        { "_id": deptoTec, "nombre": "Tecnología", "descripcion": "Departamento de TI" },
        { "_id": deptoVen, "nombre": "Ventas", "descripcion": "Equipo de ventas" },
        { "_id": deptoRrhh, "nombre": "Recursos Humanos", "descripcion": "Gestión de personal" },
        { "_id": deptoFin, "nombre": "Finanzas", "descripcion": "Contabilidad" }
    ])
    print("✔ Colección 'departamentos' poblada.")

    # 5. Inserción de Puestos
    db["puestos"].insert_many([
        { "_id": pDev, "nombre": "Desarrollador", "salario_minimo": 800000, "salario_maximo": 1500000 },
        { "_id": pVen, "nombre": "Gerente de Ventas", "salario_minimo": 1200000, "salario_maximo": 2000000 },
        { "_id": pRrhh, "nombre": "Coordinador RR.HH.", "salario_minimo": 600000, "salario_maximo": 1000000 },
        { "_id": pCont, "nombre": "Contador", "salario_minimo": 700000, "salario_maximo": 1200000 }
    ])
    print("✔ Colección 'puestos' poblada.")

    # 6. Inserción de Empleados
    db["empleados"].insert_many([
        { "_id": empJuan, "cedula": "11111111-1", "nombre": "Juan Pérez", "email": "juan@company.com", "puesto_id": pDev, "departamento_id": deptoTec, "fecha_ingreso": datetime.datetime(2020, 1, 15), "salario": 1000000, "estado": "activo" },
        { "_id": empMaria, "cedula": "22222222-2", "nombre": "María García", "email": "maria@company.com", "puesto_id": pVen, "departamento_id": deptoVen, "fecha_ingreso": datetime.datetime(2019, 6, 20), "salario": 1500000, "estado": "activo" },
        { "_id": empCarlos, "cedula": "33333333-3", "nombre": "Carlos López", "email": "carlos@company.com", "puesto_id": pRrhh, "departamento_id": deptoRrhh, "fecha_ingreso": datetime.datetime(2021, 3, 10), "salario": 750000, "estado": "activo" },
        { "_id": empAna, "cedula": "44444444-4", "nombre": "Ana Rodríguez", "email": "ana@company.com", "puesto_id": pDev, "departamento_id": deptoTec, "fecha_ingreso": datetime.datetime(2020, 8, 5), "salario": 950000, "estado": "activo" },
        { "_id": empLuis, "cedula": "55555555-5", "nombre": "Luis Martínez", "email": "luis@company.com", "puesto_id": pCont, "departamento_id": deptoFin, "fecha_ingreso": datetime.datetime(2018, 11, 30), "salario": 800000, "estado": "activo" }
    ])
    print("✔ Colección 'empleados' poblada.")

    # 7. Inserción de Capacitaciones
    db["capacitaciones"].insert_many([
        { "empleadoId": empJuan, "nombre": "React Avanzado", "tipo": "Técnica", "fecha": datetime.datetime(2024, 6, 15), "institucion": "Platzi" },
        { "empleadoId": empJuan, "nombre": "Liderazgo", "tipo": "Soft Skills", "fecha": datetime.datetime(2024, 9, 20), "institucion": "Udemy" },
        { "empleadoId": empMaria, "nombre": "Ventas B2B", "tipo": "Especializada", "fecha": datetime.datetime(2024, 8, 10), "institucion": "LinkedIn Learning" }
    ])
    print("✔ Colección 'capacitaciones' poblada.")

    # 8. Datos iniciales para Evaluaciones (Para alimentar tu Vista 3 de Perfiles)
    db["evaluaciones"].insert_many([
        { "empleadoId": empJuan, "fecha": datetime.datetime(2025, 12, 1), "evaluador": "Carlos López", "puntaje": 5, "comentarios": "Excelente desempeño técnico y proactividad." },
        { "empleadoId": empJuan, "fecha": datetime.datetime(2025, 6, 15), "evaluador": "Marta Gómez", "puntaje": 4, "comentarios": "Gran trabajo en equipo, cumplió todas las metas." },
        { "empleadoId": empJuan, "fecha": datetime.datetime(2024, 12, 10), "evaluador": "Carlos López", "puntaje": 4, "comentarios": "Buen inicio en el proyecto, adaptado al flujo." },
        { "empleadoId": empMaria, "fecha": datetime.datetime(2025, 11, 20), "evaluador": "Dirección General", "puntaje": 5, "comentarios": "Líder nata, superó la cuota de ventas del trimestre." }
    ])
    print("✔ Colección 'evaluaciones' poblada (Últimas evaluaciones para expediente).")

    # 9. Datos iniciales para Nómina (Dominio 3)
    db["nomina"].insert_many([
        { "mes": "Julio", "anio": 2026, "empleado": "Juan Pérez", "monto": 1000000, "estado": "Pagado" },
        { "mes": "Julio", "anio": 2026, "empleado": "María García", "monto": 1500000, "estado": "Pagado" }
    ])
    print("✔ Colección 'nomina' poblada.")

    # 10. Datos iniciales para Reclutamiento / Kanban (Dominio 2)
    db["candidatos"].insert_many([
        { "nombre": "Roberto Días", "puesto": "Desarrollador Backend", "estado": "entrevista" },
        { "nombre": "Elena Rostova", "puesto": "Diseñadora UX/UI", "estado": "postulado" },
        { "nombre": "Pedro Cáceres", "puesto": "Contador Senior", "estado": "contratado" }
    ])
    print("✔ Colección 'candidatos' poblada.")

    print("\n🚀 ¡Base de datos TalentHub inicializada con éxito para desarrollo!")

if __name__ == "__main__":
    run_seed()