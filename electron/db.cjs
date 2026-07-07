const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'talent_hub'; // El nombre exacto que aparece en tu MongoDB Compass

let db;

function connectDb() {
  try {
    if (!db) {
      client.connect();
      db = client.db(dbName);
      console.log('✔ Electron conectado exitosamente a MongoDB');
    }
    return db;
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB en Electron:', error);
  }
}

function getDb() {
  if (!db) {
    return connectDb();
  }
  return db;
}

module.exports = { connectDb, getDb };