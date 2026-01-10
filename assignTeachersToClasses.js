const { connectToDatabase, getDatabase } = require('./db');

async function assignTeachersToClasses() {
  try {
    await connectToDatabase();
    const db = getDatabase();

    console.log('Starting teacher-class assignment...\n');

    // Get all teachers
    const teachers = await db.collection('teachers').find({ isActive: true }).toArray();
    console.log(`Found ${teachers.length} active teachers\n`);

    // Get all classes
    const classes = await db.collection('classes').find({ isActive: true }).toArray();
    console.log(`Found ${classes.length} active classes\n`);

    // Assign teachers to classes based on department/subject matching
    let assignmentCount = 0;

    for (const classItem of classes) {
      const assignedTeachers = [];

      // Find teachers whose department matches the class subjects
      for (const teacher of teachers) {
        // Check if teacher's department matches any of the class subjects
        const subjectMatch = classItem.subjects.some(subject => {
          const lowerSubject = subject.toLowerCase();
          const lowerDept = teacher.department.toLowerCase();
          return lowerSubject.includes(lowerDept) || lowerDept.includes(lowerSubject);
        });

        if (subjectMatch) {
          // Check if teacher is already assigned
          const alreadyAssigned = assignedTeachers.some(at => at.teacherId.toString() === teacher._id.toString());

          if (!alreadyAssigned) {
            assignedTeachers.push({
              teacherId: teacher._id,
              subject: teacher.department, // Use department as the subject
              role: 'primary'
            });
          }
        }
      }

      // If no subject match found, assign the first teacher (fallback)
      if (assignedTeachers.length === 0 && teachers.length > 0) {
        assignedTeachers.push({
          teacherId: teachers[0]._id,
          subject: teachers[0].department,
          role: 'primary'
        });
      }

      // Update class with assigned teachers
      if (assignedTeachers.length > 0) {
        await db.collection('classes').updateOne(
          { _id: classItem._id },
          { $set: { assignedTeachers } }
        );

        console.log(`✅ Class: ${classItem.className}`);
        console.log(`   Assigned Teachers: ${assignedTeachers.length}`);
        assignedTeachers.forEach(at => {
          const teacher = teachers.find(t => t._id.toString() === at.teacherId.toString());
          console.log(`   - ${teacher.firstName} ${teacher.lastName} (${at.subject})`);
        });
        console.log('');
        assignmentCount++;
      }
    }

    console.log(`\n✅ Successfully assigned teachers to ${assignmentCount} classes!`);

    // Summary
    const totalAssignments = await db.collection('classes').countDocuments({
      isActive: true,
      'assignedTeachers.0': { $exists: true }
    });

    console.log(`\n📊 Summary:`);
    console.log(`   - Total classes with assigned teachers: ${totalAssignments}`);
    console.log(`   - Total teachers: ${teachers.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

assignTeachersToClasses();
