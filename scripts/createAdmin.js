const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'attendance';

async function createAdminUser() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const teachersCollection = db.collection('teachers');

    // Check if admin already exists
    const existingAdmin = await teachersCollection.findOne({ email: 'admin@school.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:');
      console.log('Email: admin@school.com');
      console.log('Password: admin123');
      console.log('Role: ADMIN');
      return;
    }

    // Hash password
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user in teachers collection
    const adminUser = {
      email: 'admin@school.com',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      employeeId: 'ADMIN001',
      role: 'ADMIN',
      department: 'Administration',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await teachersCollection.insertOne(adminUser);
    console.log('✅ Admin user created successfully!');
    console.log('\n--- ADMIN LOGIN CREDENTIALS ---');
    console.log('Email:', adminUser.email);
    console.log('Password:', password);
    console.log('Role: ADMIN');
    console.log('User ID:', result.insertedId);
    console.log('-------------------------------\n');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await client.close();
  }
}

createAdminUser();
