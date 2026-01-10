const bcrypt = require('bcryptjs');
const { connectToDatabase, getDatabase } = require('./db');

async function setupTeacherPasswords() {
  try {
    await connectToDatabase();
    const db = getDatabase();

    // Get all teachers
    const teachers = await db.collection('teachers').find({}).toArray();

    console.log(`Found ${teachers.length} teachers`);

    // Set a default password for each teacher
    const defaultPassword = 'Teacher@123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    for (const teacher of teachers) {
      await db.collection('teachers').updateOne(
        { _id: teacher._id },
        { $set: { password: hashedPassword } }
      );
      console.log(`✅ Password set for: ${teacher.email} (${teacher.firstName} ${teacher.lastName})`);
      console.log(`   Employee ID: ${teacher.employeeId}`);
      console.log(`   Default Password: ${defaultPassword}`);
      console.log('');
    }

    console.log('\n✅ All teacher passwords have been set!');
    console.log('\nPlease change passwords after first login using: POST /api/auth/change-password');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setupTeacherPasswords();
