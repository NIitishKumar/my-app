const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');

async function fixStudentPassword() {
  const client = new MongoClient('mongodb://localhost:27017');

  try {
    await client.connect();
    const db = client.db('school');

    // Test password comparison
    const testPassword = 'student123';

    // Hash using the exact method from authController
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    console.log('Testing bcrypt...');
    console.log('Original password:', testPassword);
    console.log('Hashed password:', hashedPassword);

    // Test the comparison
    const isValid = await bcrypt.compare(testPassword, hashedPassword);
    console.log('Comparison result:', isValid);

    // Update the student with the correct hash
    const result = await db.collection('students').updateOne(
      { email: 'jane.smith@school.com' },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );

    console.log('\nStudent password updated!');
    console.log('Matched count:', result.matchedCount);
    console.log('Modified count:', result.modifiedCount);

    // Verify by finding the student
    const student = await db.collection('students').findOne({ email: 'jane.smith@school.com' });
    console.log('\nStudent verified:');
    console.log('Email:', student.email);
    console.log('Password hash exists:', !!student.password);
    console.log('isActive:', student.isActive);
    console.log('Has classes:', student.classes && student.classes.length > 0);

  } finally {
    await client.close();
  }
}

fixStudentPassword().catch(console.error);
