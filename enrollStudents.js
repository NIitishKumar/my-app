const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

// Class mapping from our existing classes
const gradeToClassMap = {
  "1st": "Primary 1A",
  "2nd": "Primary 2A",
  "3rd": "Primary 3A",
  "4th": "Primary 4A",
  "5th": "Primary 5A"
};

// Student IDs we created earlier
const studentsByGrade = {
  "1st": ["STU001", "STU002", "STU003", "STU004", "STU005"],
  "2nd": ["STU006", "STU007", "STU008", "STU009", "STU010"],
  "3rd": ["STU011", "STU012", "STU013", "STU014", "STU015"],
  "4th": ["STU016", "STU017", "STU018", "STU019", "STU020"],
  "5th": ["STU021", "STU022", "STU023", "STU024", "STU025"]
};

async function getClasses() {
  try {
    const response = await axios.get(`${API_BASE}/classes`);
    const classes = response.data.data;
    const classMap = {};

    for (const cls of classes) {
      console.log(`Found class: ${cls.className} (${cls.grade}) - ID: ${cls._id}`);
      if (cls.grade.includes('1st')) classMap['1st'] = cls._id;
      else if (cls.grade.includes('2nd')) classMap['2nd'] = cls._id;
      else if (cls.grade.includes('3rd')) classMap['3rd'] = cls._id;
      else if (cls.grade.includes('4th')) classMap['4th'] = cls._id;
      else if (cls.grade.includes('5th')) classMap['5th'] = cls._id;
    }

    return classMap;
  } catch (error) {
    console.error('Error fetching classes:', error.response?.data || error.message);
    return {};
  }
}

async function getStudentByStudentId(studentId) {
  try {
    const response = await axios.get(`${API_BASE}/students`);
    const students = response.data.data;
    return students.find(s => s.studentId === studentId);
  } catch (error) {
    console.error(`Error finding student ${studentId}:`, error.response?.data || error.message);
    return null;
  }
}

async function enrollStudents() {
  console.log('🎓 Enrolling Students in Classes\n');

  // Get class IDs
  const classIds = await getClasses();
  console.log('\n=== Class IDs ===');
  Object.entries(classIds).forEach(([grade, id]) => {
    console.log(`${grade} Grade: ${id}`);
  });

  // Enroll each student
  for (const [grade, studentIds] of Object.entries(studentsByGrade)) {
    const classId = classIds[grade];
    if (!classId) {
      console.log(`❌ No class found for ${grade} grade`);
      continue;
    }

    console.log(`\n=== Enrolling ${grade} Grade Students ===`);

    for (const studentId of studentIds) {
      try {
        // First find the student to get their _id
        const student = await getStudentByStudentId(studentId);
        if (!student) {
          console.log(`❌ Student ${studentId} not found`);
          continue;
        }

        // Enroll the student
        await axios.post(`${API_BASE}/classes/${classId}/students`, {
          studentId: student._id
        });

        console.log(`✅ Enrolled ${student.firstName} ${student.lastName} (${studentId}) in ${grade} grade`);

        // Small delay
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`❌ Failed to enroll ${studentId}:`, error.response?.data || error.message);
      }
    }
  }

  console.log('\n✅ Student enrollment completed!');
}

async function verifyEnrollment() {
  console.log('\n=== Verifying Enrollment ===');

  try {
    const classes = await getClasses();

    for (const [grade, classId] of Object.entries(classes)) {
      const classResponse = await axios.get(`${API_BASE}/classes/${classId}`);
      const classData = classResponse.data.data;

      console.log(`${grade} Grade (${classData.className}):`);
      console.log(`  - Capacity: ${classData.capacity}`);
      console.log(`  - Enrolled: ${classData.enrolled}`);
      console.log(`  - Students: ${classData.students ? classData.students.length : 0}`);
    }
  } catch (error) {
    console.error('Error verifying enrollment:', error.response?.data || error.message);
  }
}

async function main() {
  try {
    await enrollStudents();
    await verifyEnrollment();
  } catch (error) {
    console.error('❌ Error in main process:', error.message);
  }
}

if (require.main === module) {
  main();
}

module.exports = { enrollStudents, verifyEnrollment };