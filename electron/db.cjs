const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; 
const client = new MongoClient(uri);

let dbConection = null;

async function connectDB() {
    if (dbConection) return dbConection;

    try {
        await client.connect();
        console.log('Conectado a la base de datos MongoDB');
        dbConection = client.db('talent_hub');
        return dbConection;
    }
    catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        throw error;
    }
}
module.exports = { connectDB };
