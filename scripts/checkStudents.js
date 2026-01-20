const { MongoClient } = require('mongodb');

async function checkStudents() {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  const db = client.db('school');

  console.log('=== Checking for test@school.com student ===');
  const student = await db.collection('students').findOne({ email: 'test@school.com' });

  if (student) {
    console.log('✅ Student found:');
    console.log('  Email:', student.email);
    console.log('  isActive:', student.isActive);
    console.log('  Has password:', !!student.password);
    console.log('  Classes:', student.classes ? student.classes.length : 0);
  } else {
    console.log('❌ Student NOT found');

    console.log('\n=== All students in database ===');
    const allStudents = await db.collection('students').find({}).toArray();
    console.log('Total students:', allStudents.length);
    allStudents.forEach(s => {
      console.log('  -', s.email, '| isActive:', s.isActive, '| hasPassword:', !!s.password);
    });
  }

  await client.close();
}

checkStudents();
