import { MongoClient } from 'mongodb';
import dotenv from 'dotenv'

//Conexão com dotenv
dotenv.config();

//Conexão com o mongodb
const mongoClient = new MongoClient(process.env.MONGO_URI);

try {
    await mongoClient.connect();
    console.log("MongoDB conectado!")
} catch (error) {
    console.log(error.message)
}

let db;
db = mongoClient.db('Teste');

export { db };