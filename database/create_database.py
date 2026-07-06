from config import get_db

db = get_db()

collections = [
    "usuarios",
    "departamentos",
    "puestos",
    "empleados",
    "evaluaciones",
    "capacitaciones",
    "nominas",
    "candidatos",
    "historial_puestos"
]

existing = db.list_collection_names()

for c in collections:
    if c not in existing:
        db.create_collection(c)
        print(f"✔ creada: {c}")
    else:
        print(f"• existe: {c}")

print("\nBase de datos lista.")