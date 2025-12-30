const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'testdb';

let db;
let client;

async function connectToDatabase() {
  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected successfully to MongoDB');
    db = client.db(dbName);
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
}

function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase first.');
  }
  return db;
}

async function closeConnection() {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

module.exports = {
  connectToDatabase,
  getDatabase,
  closeConnection,
  ObjectId
};