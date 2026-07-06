import { MongoClient } from 'mongodb';

const uri = 'mongodb://127.0.0.1:27017'; 
const dbName = 'talenthub'; 

let db;

export async function connectDB() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Conexión exitosa a MongoDB (TalentHub)');
    db = client.db(dbName);
    
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
  }
}

export function getDb() {
  if (!db) {
    throw new Error('La base de datos no está inicializada. Llama a connectDB primero.');
  }
  return db;
}