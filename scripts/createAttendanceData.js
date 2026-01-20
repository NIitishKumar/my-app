const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function createAttendanceData() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME;
  const client = new MongoClient(uri);

  console.log('Connecting to MongoDB Atlas...');
  console.log('Database:', dbName);

  try {
    await client.connect();
    const db = client.db(dbName);

    // Get student
    const student = await db.collection('students').findOne({ email: 'john.doe@school.com' });

    if (!student) {
      console.log('Student not found. Please run createStudentForCloud.js first.');
      return;
    }

    console.log('Creating attendance data for student:', student.email);

    // Get class
    const classDoc = await db.collection('classes').findOne({ _id: { $in: student.classes } });

    if (!classDoc) {
      console.log('Class not found for student.');
      return;
    }

    // Check if attendance already exists
    const existingCount = await db.collection('attendance').countDocuments({
      studentId: student._id
    });

    if (existingCount > 0) {
      console.log('Attendance data already exists:', existingCount, 'records');
      return;
    }

    // Create attendance records for the last 90 days
    const attendanceRecords = [];
    const today = new Date();

    for (let i = 0; i < 90; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      // Skip weekends
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      // Skip holidays (random dates)
      if (Math.random() < 0.05) continue;

      // Random status with realistic distribution
      const rand = Math.random();
      let status;

      if (rand < 0.85) {
        status = 'present';
      } else if (rand < 0.92) {
        status = 'absent';
      } else if (rand < 0.97) {
        status = 'late';
      } else {
        status = 'excused';
      }

      attendanceRecords.push({
        studentId: student._id,
        classId: classDoc._id,
        date: date,
        status: status,
        remarks: status !== 'present' ? `${status.charAt(0).toUpperCase() + status.slice(1)} marked` : '',
        submittedBy: new ObjectId('696f0c221796cf1028d2245e'), // Teacher ID
        submittedAt: date,
        createdAt: date,
        updatedAt: date
      });
    }

    await db.collection('attendance').insertMany(attendanceRecords);

    // Calculate statistics
    const stats = {
      total: attendanceRecords.length,
      present: attendanceRecords.filter(r => r.status === 'present').length,
      absent: attendanceRecords.filter(r => r.status === 'absent').length,
      late: attendanceRecords.filter(r => r.status === 'late').length,
      excused: attendanceRecords.filter(r => r.status === 'excused').length
    };

    const attendanceRate = ((stats.present + stats.late + stats.excused) / stats.total * 100).toFixed(1);

    console.log('\n========================================');
    console.log('ATTENDANCE DATA CREATED');
    console.log('========================================');
    console.log('');
    console.log('Student:', `${student.firstName} ${student.lastName}`);
    console.log('Class:', classDoc.name);
    console.log('');
    console.log('Records Created:', stats.total);
    console.log('- Present:', stats.present);
    console.log('- Absent:', stats.absent);
    console.log('- Late:', stats.late);
    console.log('- Excused:', stats.excused);
    console.log('');
    console.log('Attendance Rate:', attendanceRate + '%');
    console.log('========================================');

  } finally {
    await client.close();
    console.log('\nConnection closed');
  }
}

createAttendanceData().catch(console.error);
