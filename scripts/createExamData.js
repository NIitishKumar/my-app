const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function createExamData() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME;
  const client = new MongoClient(uri);

  console.log('Connecting to MongoDB Atlas...');
  console.log('Database:', dbName);

  try {
    await client.connect();
    const db = client.db(dbName);

    // Get class
    const classDoc = await db.collection('classes').findOne({ name: 'Grade 10 - Section A' });

    if (!classDoc) {
      console.log('Class not found. Please run createStudentForCloud.js first.');
      return;
    }

    console.log('Creating exam data for class:', classDoc.name);

    // Check if exams already exist
    const existingCount = await db.collection('exams').countDocuments({
      classIds: classDoc._id
    });

    if (existingCount > 0) {
      console.log('Exam data already exists:', existingCount, 'exams');
      return;
    }

    // Get teacher (optional)
    let teacher = null;
    try {
      teacher = await db.collection('teachers').findOne({ email: 'teacher@school.com' });
    } catch (e) {
      console.log('No teacher found, will create exams without assigned teacher');
    }

    // Create sample exams for the next 60 days
    const exams = [];
    const today = new Date();

    const subjects = [
      { name: 'Mathematics', code: 'MATH101', type: 'midterm' },
      { name: 'Physics', code: 'PHY101', type: 'midterm' },
      { name: 'Chemistry', code: 'CHEM101', type: 'quiz' },
      { name: 'English', code: 'ENG101', type: 'assignment' },
      { name: 'Computer Science', code: 'CS101', type: 'midterm' }
    ];

    const rooms = ['Hall A', 'Room 101', 'Room 102', 'Lab 1', 'Lab 2'];

    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + (i * 7) + 5); // One exam per week, starting 5 days from now

      // Skip weekends
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        date.setDate(date.getDate() + (dayOfWeek === 0 ? 1 : 2));
      }

      const subject = subjects[i % subjects.length];
      const startHour = 9 + (i % 4); // Vary start times between 9 AM and 12 PM
      const startTime = `${String(startHour).padStart(2, '0')}:00`;
      const duration = 90 + (i % 3) * 30; // Vary duration: 90, 120, or 150 minutes

      exams.push({
        title: `${subject.name} ${subject.type === 'midterm' ? 'Midterm' : subject.type === 'quiz' ? 'Quiz' : 'Assignment'}`,
        subject: subject.name,
        subjectCode: subject.code,
        classIds: [classDoc._id],
        date: date,
        startTime: startTime,
        duration: duration,
        totalMarks: 100,
        room: rooms[i % rooms.length],
        instructions: 'Bring necessary materials. No calculators allowed unless specified.',
        examType: subject.type,
        status: i < 3 ? 'completed' : 'scheduled', // First 3 are completed
        createdBy: new ObjectId('696f0c221796cf1028d2245e'), // Admin ID
        teacherIds: teacher ? [teacher._id] : [],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Mark completed exams as completed
      if (i < 3) {
        exams[exams.length - 1].completedAt = new Date(date);
      }
    }

    await db.collection('exams').insertMany(exams);

    // Create some exam results for completed exams
    const students = await db.collection('students').find({ classes: classDoc._id }).toArray();
    const completedExams = exams.filter(e => e.status === 'completed');

    const examResults = [];

    for (const exam of completedExams) {
      for (const student of students) {
        const obtainedMarks = Math.floor(Math.random() * 40) + 60; // 60-100
        const percentage = (obtainedMarks / exam.totalMarks) * 100;

        let grade;
        if (percentage >= 90) grade = 'A';
        else if (percentage >= 80) grade = 'B';
        else if (percentage >= 70) grade = 'C';
        else if (percentage >= 60) grade = 'D';
        else grade = 'F';

        examResults.push({
          examId: exam._id,
          studentId: student._id,
          obtainedMarks: obtainedMarks,
          grade: grade,
          percentage: parseFloat(percentage.toFixed(2)),
          publishedAt: new Date(exam.date),
          publishedBy: new ObjectId('696f0c221796cf1028d2245e'),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    if (examResults.length > 0) {
      await db.collection('examResults').insertMany(examResults);
    }

    console.log('\n========================================');
    console.log('EXAM DATA CREATED');
    console.log('========================================');
    console.log('');
    console.log('Class:', classDoc.name);
    console.log('');
    console.log('Exams Created:', exams.length);
    console.log('- Completed:', completedExams.length);
    console.log('- Scheduled:', exams.length - completedExams.length);
    console.log('');
    console.log('Results Created:', examResults.length);
    console.log('========================================');

  } finally {
    await client.close();
    console.log('\nConnection closed');
  }
}

createExamData().catch(console.error);
