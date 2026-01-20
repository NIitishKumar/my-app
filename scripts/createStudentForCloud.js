const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createStudentForCloud() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME;
  const client = new MongoClient(uri);

  console.log('Connecting to MongoDB Atlas...');
  console.log('Database:', dbName);

  try {
    await client.connect();
    const db = client.db(dbName);

    // Check if class exists
    let classDoc = await db.collection('classes').findOne({ name: 'Grade 10 - Section A' });

    if (!classDoc) {
      console.log('Creating class...');
      const classId = new ObjectId();
      await db.collection('classes').insertOne({
        _id: classId,
        name: 'Grade 10 - Section A',
        grade: '10',
        section: 'A',
        academicYear: '2024-2025',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      classDoc = await db.collection('classes').findOne({ _id: classId });
      console.log('Class created:', classDoc.name);
    } else {
      console.log('Class exists:', classDoc.name);
    }

    // Check if teacher exists
    let teacherDoc = await db.collection('teachers').findOne({ email: 'john.smith@school.com' });

    if (!teacherDoc) {
      console.log('Creating teacher...');
      const teacherId = new ObjectId();
      const hashedPassword = await bcrypt.hash('teacher123', 10);
      await db.collection('teachers').insertOne({
        _id: teacherId,
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@school.com',
        password: hashedPassword,
        employeeId: 'TEA001',
        role: 'TEACHER',
        department: 'Mathematics',
        subjects: ['Mathematics', 'Physics'],
        isActive: true,
        createdAt: new Date()
      });
      teacherDoc = await db.collection('teachers').findOne({ _id: teacherId });
      console.log('Teacher created:', teacherDoc.email);
    } else {
      console.log('Teacher exists:', teacherDoc.email);
    }

    // Create timetable entries
    console.log('Creating timetable entries...');
    const existingTimetables = await db.collection('timetables').countDocuments({ classId: classDoc._id });

    if (existingTimetables === 0) {
      const days = [
        { day: 1, name: 'Monday' },
        { day: 2, name: 'Tuesday' },
        { day: 3, name: 'Wednesday' },
        { day: 4, name: 'Thursday' },
        { day: 5, name: 'Friday' }
      ];

      const timetableEntries = [];

      days.forEach(d => {
        const slots = [
          { subject: 'Mathematics', subjectCode: 'MATH101', startTime: '09:00', endTime: '10:00', room: 'Room 101' },
          { subject: 'English', subjectCode: 'ENG101', startTime: '10:15', endTime: '11:15', room: 'Room 102' },
          { subject: 'Physics', subjectCode: 'PHY101', startTime: '11:30', endTime: '12:30', room: 'Room 201' },
          { subject: 'Chemistry', subjectCode: 'CHEM101', startTime: '14:00', endTime: '15:00', room: 'Room 202' }
        ];

        slots.forEach(slot => {
          timetableEntries.push({
            classId: classDoc._id,
            subject: slot.subject,
            subjectCode: slot.subjectCode,
            teacherId: teacherDoc._id,
            startTime: slot.startTime,
            endTime: slot.endTime,
            dayOfWeek: d.day,
            room: slot.room,
            type: 'lecture',
            createdAt: new Date(),
            updatedAt: new Date()
          });
        });
      });

      await db.collection('timetables').insertMany(timetableEntries);
      console.log('Timetable entries created:', timetableEntries.length);
    } else {
      console.log('Timetable entries exist:', existingTimetables);
    }

    // Create student
    console.log('Creating student...');
    const existingStudent = await db.collection('students').findOne({ email: 'john.doe@school.com' });

    if (!existingStudent) {
      const hashedPassword = await bcrypt.hash('student123', 10);
      const studentId = new ObjectId();

      await db.collection('students').insertOne({
        _id: studentId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@school.com',
        password: hashedPassword,
        studentId: 'STU002',
        dateOfBirth: new Date('2005-05-15'),
        gender: 'male',
        address: '123 Main St, City',
        classes: [classDoc._id],
        isActive: true,
        enrollmentDate: new Date('2024-01-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('\n========================================');
      console.log('STUDENT CREATED IN CLOUD DATABASE');
      console.log('========================================');
      console.log('');
      console.log('Login Credentials:');
      console.log('Email: john.doe@school.com');
      console.log('Password: student123');
      console.log('');
      console.log('Student Details:');
      console.log('Name: John Doe');
      console.log('Student ID: STU002');
      console.log('Class: ' + classDoc.name);
      console.log('Grade: ' + classDoc.grade);
      console.log('Section: ' + classDoc.section);
      console.log('');
      console.log('This student has:');
      console.log('- 1 class enrolled');
      console.log('- 20 timetable entries (4 classes/day for 5 days)');
      console.log('- Subjects: Mathematics, English, Physics, Chemistry');
      console.log('========================================');
    } else {
      console.log('Student already exists:', existingStudent.email);
      console.log('Password:', existingStudent.password ? 'Set' : 'NOT SET');
    }

  } finally {
    await client.close();
    console.log('\nConnection closed');
  }
}

createStudentForCloud().catch(console.error);
