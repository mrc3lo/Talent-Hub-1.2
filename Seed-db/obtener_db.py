from pymongo import MongoClient
from bson import json_util
import json

cliente = MongoClient("mongodb://localhost:27017")

db = cliente["talent_hub"]

respaldo = {}

for nombre in db.list_collection_names():
    respaldo[nombre] = list(db[nombre].find())

with open("TalentHub.json", "w", encoding="utf8") as archivo:
    json.dump(respaldo, archivo,
              default=json_util.default,
              indent=4,
              ensure_ascii=False)