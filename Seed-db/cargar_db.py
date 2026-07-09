from pymongo import MongoClient
from bson import json_util
import json

cliente = MongoClient("mongodb://localhost:27017")

db = cliente["talent_hub"]

with open("./Seed-db/Talent_Hub.json", encoding="utf8") as archivo:
    datos = json.load(archivo,
                      object_hook=json_util.object_hook)

for coleccion, documentos in datos.items():
    if documentos:
        db[coleccion].insert_many(documentos)

print("Base restaurada.")