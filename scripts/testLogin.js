const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');

async function testLogin() {
  const client = new MongoClient('mongodb://localhost:27017');
  try {
    await client.connect();
    const db = client.db('school');

    const email = 'test@school.com';
    const password = 'test123';

    // Find student exactly as authController does
    const user = await db.collection('students').findOne({
      email: email,
      isActive: true
    });

    if (!user) {
      console.log('User NOT found!');
      return;
    }

    console.log('User found:');
    console.log('Email:', user.email);
    console.log('Has password:', !!user.password);
    console.log('Password hash:', user.password.substring(0, 30) + '...');

    // Test bcrypt.compare exactly as authController does
    console.log('\nTesting password comparison...');
    console.log('Input password:', password);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid);

    if (isPasswordValid) {
      console.log('\n✅ LOGIN WOULD SUCCEED!');
    } else {
      console.log('\n❌ LOGIN WOULD FAIL!');

      // Try re-hashing and comparing
      console.log('\nTrying to re-hash password...');
      const newHash = await bcrypt.hash(password, 10);
      console.log('New hash:', newHash.substring(0, 30) + '...');
      const newCompare = await bcrypt.compare(password, newHash);
      console.log('New hash comparison:', newCompare);
    }

  } finally {
    await client.close();
  }
}

testLogin().catch(console.error);
