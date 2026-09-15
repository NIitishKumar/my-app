import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
const dbName = process.env.DB_NAME || 'testdb';
const connectionString = uri.endsWith('/') ? `${uri}${dbName}` : `${uri}/${dbName}`;

export async function connectToDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected successfully to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
}

export async function closeConnection() {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
}