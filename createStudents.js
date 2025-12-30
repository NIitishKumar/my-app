const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

// Student data for 1st - 5th grades
const studentsByGrade = {
  "1st": [
    { firstName: "Emma", lastName: "Thompson", email: "emma.t@school.edu", studentId: "STU001", age: 6, gender: "female" },
    { firstName: "Liam", lastName: "Johnson", email: "liam.j@school.edu", studentId: "STU002", age: 6, gender: "male" },
    { firstName: "Olivia", lastName: "Williams", email: "olivia.w@school.edu", studentId: "STU003", age: 6, gender: "female" },
    { firstName: "Noah", lastName: "Brown", email: "noah.b@school.edu", studentId: "STU004", age: 6, gender: "male" },
    { firstName: "Ava", lastName: "Davis", email: "ava.d@school.edu", studentId: "STU005", age: 6, gender: "female" }
  ],
  "2nd": [
    { firstName: "Sophia", lastName: "Miller", email: "sophia.m@school.edu", studentId: "STU006", age: 7, gender: "female" },
    { firstName: "Mason", lastName: "Wilson", email: "mason.w@school.edu", studentId: "STU007", age: 7, gender: "male" },
    { firstName: "Isabella", lastName: "Moore", email: "isabella.m@school.edu", studentId: "STU008", age: 7, gender: "female" },
    { firstName: "William", lastName: "Taylor", email: "william.t@school.edu", studentId: "STU009", age: 7, gender: "male" },
    { firstName: "Mia", lastName: "Anderson", email: "mia.a@school.edu", studentId: "STU010", age: 7, gender: "female" }
  ],
  "3rd": [
    { firstName: "Charlotte", lastName: "Thomas", email: "charlotte.t@school.edu", studentId: "STU011", age: 8, gender: "female" },
    { firstName: "James", lastName: "Jackson", email: "james.j@school.edu", studentId: "STU012", age: 8, gender: "male" },
    { firstName: "Amelia", lastName: "White", email: "amelia.w@school.edu", studentId: "STU013", age: 8, gender: "female" },
    { firstName: "Benjamin", lastName: "Harris", email: "benjamin.h@school.edu", studentId: "STU014", age: 8, gender: "male" },
    { firstName: "Harper", lastName: "Martin", email: "harper.m@school.edu", studentId: "STU015", age: 8, gender: "female" }
  ],
  "4th": [
    { firstName: "Evelyn", lastName: "Garcia", email: "evelyn.g@school.edu", studentId: "STU016", age: 9, gender: "female" },
    { firstName: "Lucas", lastName: "Martinez", email: "lucas.m@school.edu", studentId: "STU017", age: 9, gender: "male" },
    { firstName: "Abigail", lastName: "Robinson", email: "abigail.r@school.edu", studentId: "STU018", age: 9, gender: "female" },
    { firstName: "Henry", lastName: "Clark", email: "henry.c@school.edu", studentId: "STU019", age: 9, gender: "male" },
    { firstName: "Emily", lastName: "Rodriguez", email: "emily.r@school.edu", studentId: "STU020", age: 9, gender: "female" }
  ],
  "5th": [
    { firstName: "Elizabeth", lastName: "Lewis", email: "elizabeth.l@school.edu", studentId: "STU021", age: 10, gender: "female" },
    { firstName: "Alexander", lastName: "Lee", email: "alexander.l@school.edu", studentId: "STU022", age: 10, gender: "male" },
    { firstName: "Sofia", lastName: "Walker", email: "sofia.w@school.edu", studentId: "STU023", age: 10, gender: "female" },
    { firstName: "Michael", lastName: "Hall", email: "michael.h@school.edu", studentId: "STU024", age: 10, gender: "male" },
    { firstName: "Avery", lastName: "Allen", email: "avery.a@school.edu", studentId: "STU025", age: 10, gender: "female" }
  ]
};

async function createStudents() {
  const createdStudents = {};

  for (const [grade, students] of Object.entries(studentsByGrade)) {
    console.log(`Creating ${students.length} students for ${grade} grade...`);
    createdStudents[grade] = [];

    for (const student of students) {
      try {
        const response = await axios.post(`${API_BASE}/students`, student);
        console.log(`✅ Created: ${student.firstName} ${student.lastName} (${student.studentId})`);
        createdStudents[grade].push(response.data.data._id);

        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`❌ Failed to create ${student.firstName} ${student.lastName}:`, error.response?.data || error.message);
      }
    }
  }

  console.log('\n=== Student Creation Summary ===');
  for (const [grade, studentIds] of Object.entries(createdStudents)) {
    console.log(`${grade} Grade: ${studentIds.length} students created`);
  }

  return createdStudents;
}

// Get class IDs from existing classes
async function getClassIds() {
  try {
    const response = await axios.get(`${API_BASE}/classes`);
    const classes = response.data.data;
    const classMap = {};

    for (const cls of classes) {
      if (cls.grade.includes('1st')) classMap['1st'] = cls._id;
      else if (cls.grade.includes('2nd')) classMap['2nd'] = cls._id;
      else if (cls.grade.includes('3rd')) classMap['3rd'] = cls._id;
      else if (cls.grade.includes('4th')) classMap['4th'] = cls._id;
      else if (cls.grade.includes('5th')) classMap['5th'] = cls._id;
    }

    return classMap;
  } catch (error) {
    console.error('Error fetching classes:', error.message);
    return {};
  }
}

// Enroll students in their respective classes
async function enrollStudents(createdStudents, classIds) {
  console.log('\n=== Enrolling Students in Classes ===');

  for (const [grade, studentIds] of Object.entries(createdStudents)) {
    const classId = classIds[grade];
    if (!classId) {
      console.log(`❌ No class found for ${grade} grade`);
      continue;
    }

    console.log(`Enrolling ${studentIds.length} students in ${grade} grade class...`);

    for (const studentId of studentIds) {
      try {
        await axios.post(`${API_BASE}/classes/${classId}/students`, {
          studentId: studentId
        });
        console.log(`✅ Enrolled student in ${grade} grade class`);

        // Small delay
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`❌ Failed to enroll student:`, error.response?.data || error.message);
      }
    }
  }
}

async function main() {
  console.log('🎓 Creating Students for Grades 1-5\n');

  try {
    // Step 1: Create all students
    const createdStudents = await createStudents();

    // Step 2: Get class IDs
    const classIds = await getClassIds();

    // Step 3: Enroll students
    await enrollStudents(createdStudents, classIds);

    console.log('\n✅ Student creation and enrollment completed!');

  } catch (error) {
    console.error('❌ Error in main process:', error.message);
  }
}

if (require.main === module) {
  main();
}

module.exports = { createStudents, getClassIds, enrollStudents };