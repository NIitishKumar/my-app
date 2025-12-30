const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

// 25 diverse lectures covering different subjects and grade levels
const lectures = [
  // Mathematics Lectures
  {
    title: "Introduction to Numbers and Counting",
    description: "Basic number recognition and counting skills for young learners",
    subject: "Mathematics",
    teacher: {
      firstName: "Priya",
      lastName: "Sharma",
      email: "priya.sharma@school.edu",
      teacherId: "T001"
    },
    schedule: {
      dayOfWeek: "Monday",
      startTime: "09:00",
      endTime: "10:00",
      room: "M-101"
    },
    duration: 60,
    type: "lecture",
    materials: [
      { name: "Number Flashcards", type: "document", url: "/materials/numbers.pdf" },
      { name: "Counting Video", type: "video", url: "/videos/counting.mp4" }
    ]
  },
  {
    title: "Basic Addition and Subtraction",
    description: "Fundamental arithmetic operations with single-digit numbers",
    subject: "Mathematics",
    teacher: {
      firstName: "Ravi",
      lastName: "Kumar",
      email: "ravi.kumar@school.edu",
      teacherId: "T002"
    },
    schedule: {
      dayOfWeek: "Tuesday",
      startTime: "10:00",
      endTime: "11:00",
      room: "M-102"
    },
    duration: 60,
    type: "lecture"
  },
  {
    title: "Multiplication Tables",
    description: "Learning multiplication tables from 1 to 10",
    subject: "Mathematics",
    teacher: {
      firstName: "Anita",
      lastName: "Patel",
      email: "anita.patel@school.edu",
      teacherId: "T003"
    },
    schedule: {
      dayOfWeek: "Wednesday",
      startTime: "09:00",
      endTime: "10:30",
      room: "M-103"
    },
    duration: 90,
    type: "lecture"
  },
  {
    title: "Geometry Basics - Shapes",
    description: "Understanding basic geometric shapes and their properties",
    subject: "Mathematics",
    teacher: {
      firstName: "Vikram",
      lastName: "Singh",
      email: "vikram.singh@school.edu",
      teacherId: "T004"
    },
    schedule: {
      dayOfWeek: "Thursday",
      startTime: "11:00",
      endTime: "12:00",
      room: "M-104"
    },
    duration: 60,
    type: "lecture"
  },
  {
    title: "Introduction to Fractions",
    description: "Basic concepts of fractions and their representations",
    subject: "Mathematics",
    teacher: {
      firstName: "Neha",
      lastName: "Gupta",
      email: "neha.gupta@school.edu",
      teacherId: "T005"
    },
    schedule: {
      dayOfWeek: "Friday",
      startTime: "10:00",
      endTime: "11:30",
      room: "M-105"
    },
    duration: 90,
    type: "lecture"
  },

  // English Lectures
  {
    title: "Alphabet and Phonics",
    description: "Learning English alphabet and basic phonetic sounds",
    subject: "English",
    teacher: {
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@school.edu",
      teacherId: "T006"
    },
    schedule: {
      dayOfWeek: "Monday",
      startTime: "11:00",
      endTime: "12:00",
      room: "E-101"
    },
    duration: 60,
    type: "lecture"
  },
  {
    title: "Basic Sentence Structure",
    description: "Understanding subject-verb-object structure in simple sentences",
    subject: "English",
    teacher: {
      firstName: "Mary",
      lastName: "Johnson",
      email: "mary.johnson@school.edu",
      teacherId: "T007"
    },
    schedule: {
      dayOfWeek: "Tuesday",
      startTime: "09:00",
      endTime: "10:30",
      room: "E-102"
    },
    duration: 90,
    type: "lecture"
  },
  {
    title: "Reading Comprehension Skills",
    description: "Developing basic reading and comprehension abilities",
    subject: "English",
    teacher: {
      firstName: "David",
      lastName: "Brown",
      email: "david.brown@school.edu",
      teacherId: "T008"
    },
    schedule: {
      dayOfWeek: "Wednesday",
      startTime: "10:00",
      endTime: "11:00",
      room: "E-103"
    },
    duration: 60,
    type: "lecture"
  },
  {
    title: "Creative Writing Workshop",
    description: "Introduction to creative writing and storytelling",
    subject: "English",
    teacher: {
      firstName: "Emma",
      lastName: "Wilson",
      email: "emma.wilson@school.edu",
      teacherId: "T009"
    },
    schedule: {
      dayOfWeek: "Thursday",
      startTime: "14:00",
      endTime: "15:30",
      room: "E-104"
    },
    duration: 90,
    type: "seminar"
  },
  {
    title: "Public Speaking Basics",
    description: "Building confidence in public speaking and presentation skills",
    subject: "English",
    teacher: {
      firstName: "Robert",
      lastName: "Miller",
      email: "robert.miller@school.edu",
      teacherId: "T010"
    },
    schedule: {
      dayOfWeek: "Friday",
      startTime: "13:00",
      endTime: "14:00",
      room: "E-105"
    },
    duration: 60,
    type: "seminar"
  },

  // Hindi Lectures
  {
    title: "हिंदी वर्णमाला (Hindi Alphabet)",
    description: "Learning Hindi alphabet and basic pronunciation",
    subject: "Hindi",
    teacher: {
      firstName: "Amit",
      lastName: "Sharma",
      email: "amit.sharma@school.edu",
      teacherId: "T011"
    },
    schedule: {
      dayOfWeek: "Monday",
      startTime: "10:00",
      endTime: "11:00",
      room: "H-101"
    },
    duration: 60,
    type: "lecture"
  },
  {
    title: "सरल शब्द और वाक्य (Simple Words and Sentences)",
    description: "Building basic Hindi vocabulary and sentence formation",
    subject: "Hindi",
    teacher: {
      firstName: "Sunita",
      lastName: "Verma",
      email: "sunita.verma@school.edu",
      teacherId: "T012"
    },
    schedule: {
      dayOfWeek: "Tuesday",
      startTime: "14:00",
      endTime: "15:00",
      room: "H-102"
    },
    duration: 60,
    type: "lecture"
  },
  {
    title: "हिंदी कविता (Hindi Poetry)",
    description: "Introduction to Hindi poetry and rhymes for children",
    subject: "Hindi",
    teacher: {
      firstName: "Rajesh",
      lastName: "Kumar",
      email: "rajesh.kumar@school.edu",
      teacherId: "T013"
    },
    schedule: {
      dayOfWeek: "Wednesday",
      startTime: "11:00",
      endTime: "12:00",
      room: "H-103"
    },
    duration: 60,
    type: "lecture"
  },
  {
    title: "गिनती हिंदी में (Counting in Hindi)",
    description: "Learning numbers and counting in Hindi",
    subject: "Hindi",
    teacher: {
      firstName: "Pooja",
      lastName: "Singh",
      email: "pooja.singh@school.edu",
      teacherId: "T014"
    },
    schedule: {
      dayOfWeek: "Thursday",
      startTime: "09:00",
      endTime: "10:00",
      room: "H-104"
    },
    duration: 60,
    type: "lecture"
  },
  {
    title: "हिंदी लेखन कौशल (Hindi Writing Skills)",
    description: "Practice of Hindi writing and basic grammar",
    subject: "Hindi",
    teacher: {
      firstName: "Anjali",
      lastName: "Mishra",
      email: "anjali.mishra@school.edu",
      teacherId: "T015"
    },
    schedule: {
      dayOfWeek: "Friday",
      startTime: "09:00",
      endTime: "10:30",
      room: "H-105"
    },
    duration: 90,
    type: "tutorial"
  },

  // Science Lectures
  {
    title: "Plants and Their Parts",
    description: "Understanding different parts of plants and their functions",
    subject: "Science",
    teacher: {
      firstName: "Dr. Sarah",
      lastName: "Anderson",
      email: "sarah.anderson@school.edu",
      teacherId: "T016"
    },
    schedule: {
      dayOfWeek: "Monday",
      startTime: "14:00",
      endTime: "15:30",
      room: "S-101"
    },
    duration: 90,
    type: "lecture"
  },
  {
    title: "Animals and Their Habitats",
    description: "Exploring different animals and their natural habitats",
    subject: "Science",
    teacher: {
      firstName: "Dr. Michael",
      lastName: "Clark",
      email: "michael.clark@school.edu",
      teacherId: "T017"
    },
    schedule: {
      dayOfWeek: "Tuesday",
      startTime: "11:00",
      endTime: "12:30",
      room: "S-102"
    },
    duration: 90,
    type: "lecture"
  },
  {
    title: "Water Cycle",
    description: "Understanding the water cycle and its importance",
    subject: "Science",
    teacher: {
      firstName: "Dr. Lisa",
      lastName: "White",
      email: "lisa.white@school.edu",
      teacherId: "T018"
    },
    schedule: {
      dayOfWeek: "Wednesday",
      startTime: "14:00",
      endTime: "15:00",
      room: "S-103"
    },
    duration: 60,
    type: "lecture"
  },
  {
    title: "Solar System Basics",
    description: "Introduction to planets, stars, and our solar system",
    subject: "Science",
    teacher: {
      firstName: "Dr. James",
      lastName: "Harris",
      email: "james.harris@school.edu",
      teacherId: "T019"
    },
    schedule: {
      dayOfWeek: "Thursday",
      startTime: "10:00",
      endTime: "11:30",
      room: "S-104"
    },
    duration: 90,
    type: "lecture"
  },
  {
    title: "Human Body Basics",
    description: "Learning about major organs and systems of the human body",
    subject: "Science",
    teacher: {
      firstName: "Dr. Jennifer",
      lastName: "Martin",
      email: "jennifer.martin@school.edu",
      teacherId: "T020"
    },
    schedule: {
      dayOfWeek: "Friday",
      startTime: "14:00",
      endTime: "15:30",
      room: "S-105"
    },
    duration: 90,
    type: "lecture"
  },

  // Social Studies/Geography Lectures
  {
    title: "Our Country - India",
    description: "Introduction to Indian geography, states, and culture",
    subject: "Social Studies",
    teacher: {
      firstName: "Rahul",
      lastName: "Sharma",
      email: "rahul.sharma@school.edu",
      teacherId: "T021"
    },
    schedule: {
      dayOfWeek: "Monday",
      startTime: "13:00",
      endTime: "14:00",
      room: "SS-101"
    },
    duration: 60,
    type: "lecture"
  },
  {
    title: "Continents and Oceans",
    description: "Understanding the world's geography - continents and oceans",
    subject: "Geography",
    teacher: {
      firstName: "Divya",
      lastName: "Patel",
      email: "divya.patel@school.edu",
      teacherId: "T022"
    },
    schedule: {
      dayOfWeek: "Tuesday",
      startTime: "13:00",
      endTime: "14:30",
      room: "G-101"
    },
    duration: 90,
    type: "lecture"
  },
  {
    title: "Our Environment",
    description: "Learning about environmental conservation and sustainability",
    subject: "Environmental Studies",
    teacher: {
      firstName: "Kavita",
      lastName: "Reddy",
      email: "kavita.reddy@school.edu",
      teacherId: "T023"
    },
    schedule: {
      dayOfWeek: "Wednesday",
      startTime: "13:00",
      endTime: "14:00",
      room: "EV-101"
    },
    duration: 60,
    type: "lecture"
  },
  {
    title: "Indian Festivals and Culture",
    description: "Exploring diverse Indian festivals and cultural traditions",
    subject: "Social Studies",
    teacher: {
      firstName: "Anand",
      lastName: "Gupta",
      email: "anand.gupta@school.edu",
      teacherId: "T024"
    },
    schedule: {
      dayOfWeek: "Thursday",
      startTime: "13:00",
      endTime: "14:30",
      room: "SS-102"
    },
    duration: 90,
    type: "seminar"
  },
  {
    title: "Community Helpers",
    description: "Understanding different professions and their importance in society",
    subject: "Social Studies",
    teacher: {
      firstName: "Meena",
      lastName: "Nair",
      email: "meena.nair@school.edu",
      teacherId: "T025"
    },
    schedule: {
      dayOfWeek: "Friday",
      startTime: "15:00",
      endTime: "16:00",
      room: "SS-103"
    },
    duration: 60,
    type: "lecture"
  }
];

// Create all lectures
async function createAllLectures() {
  console.log('🎓 Creating 25 Diverse Lectures\n');

  const createdLectures = [];

  for (let i = 0; i < lectures.length; i++) {
    const lecture = lectures[i];
    try {
      const response = await axios.post(`${API_BASE}/lectures`, lecture);
      createdLectures.push({
        id: response.data.data._id,
        subject: lecture.subject,
        title: lecture.title,
        grade: lecture.grade || 'All Grades'
      });
      console.log(`✅ Created ${i + 1}/25: ${lecture.title} (${lecture.subject})`);

      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`❌ Failed to create lecture: ${lecture.title}`, error.response?.data || error.message);
    }
  }

  console.log(`\n📊 Created ${createdLectures.length} out of ${lectures.length} lectures`);
  return createdLectures;
}

// Group lectures by subject and assign to appropriate classes
function assignLecturesToClasses(createdLectures) {
  const lecturesBySubject = {};

  // Group lectures by subject
  createdLectures.forEach(lecture => {
    if (!lecturesBySubject[lecture.subject]) {
      lecturesBySubject[lecture.subject] = [];
    }
    lecturesBySubject[lecture.subject].push(lecture);
  });

  console.log('\n📚 Lectures by Subject:');
  Object.entries(lecturesBySubject).forEach(([subject, subjectLectures]) => {
    console.log(`  ${subject}: ${subjectLectures.length} lectures`);
  });

  return lecturesBySubject;
}

// Assign 5 appropriate lectures to each class based on grade level
function getLecturesForClass(grade, lecturesBySubject) {
  const classLectures = [];

  // Different subjects for different grade levels
  const subjectsByGrade = {
    "1st": ["Mathematics", "English", "Hindi", "Science", "Environmental Studies"],
    "2nd": ["Mathematics", "English", "Hindi", "Science", "Social Studies"],
    "3rd": ["Mathematics", "English", "Hindi", "Science", "Geography"],
    "4th": ["Mathematics", "English", "Hindi", "Science", "Social Studies"],
    "5th": ["Mathematics", "English", "Hindi", "Science", "Geography"]
  };

  const targetSubjects = subjectsByGrade[grade] || ["Mathematics", "English", "Science", "Social Studies"];

  // Get one lecture from each target subject
  targetSubjects.forEach(subject => {
    if (lecturesBySubject[subject] && lecturesBySubject[subject].length > 0) {
      const lecture = lecturesBySubject[subject].shift(); // Take the first lecture
      if (lecture) {
        classLectures.push(lecture.id);
      }
    }
  });

  // If we need more lectures to reach 5, add from any subject
  while (classLectures.length < 5) {
    let added = false;
    for (const [subject, subjectLectures] of Object.entries(lecturesBySubject)) {
      if (subjectLectures.length > 0) {
        const lecture = subjectLectures.shift();
        if (lecture) {
          classLectures.push(lecture.id);
          added = true;
          break;
        }
      }
    }
    if (!added) break; // No more lectures available
  }

  return classLectures.slice(0, 5); // Ensure exactly 5 lectures
}

// Update classes with lectures
async function updateClassesWithLectures(lecturesBySubject) {
  console.log('\n📝 Adding 5 Lectures to Each Class\n');

  try {
    // Get all classes
    const response = await axios.get(`${API_BASE}/classes`);
    const classes = response.data.data;

    for (const cls of classes) {
      const lectureIds = getLecturesForClass(cls.grade, { ...lecturesBySubject });

      if (lectureIds.length > 0) {
        try {
          await axios.put(`${API_BASE}/classes/${cls._id}`, {
            lectures: lectureIds
          });
          console.log(`✅ Updated ${cls.className} (${cls.grade}) with ${lectureIds.length} lectures`);
        } catch (error) {
          console.error(`❌ Failed to update ${cls.className}:`, error.response?.data || error.message);
        }
      } else {
        console.log(`⚠️  No lectures available for ${cls.className}`);
      }
    }
  } catch (error) {
    console.error('❌ Error updating classes:', error.response?.data || error.message);
  }
}

// Main execution
async function main() {
  try {
    console.log('🚀 Starting Lecture Creation Process\n');

    // Step 1: Create all lectures
    const createdLectures = await createAllLectures();

    // Step 2: Group lectures by subject
    const lecturesBySubject = assignLecturesToClasses(createdLectures);

    // Step 3: Update classes with lectures
    await updateClassesWithLectures(lecturesBySubject);

    console.log('\n✅ Lecture creation and assignment completed successfully!');

  } catch (error) {
    console.error('\n❌ Error in main process:', error.message);
  }
}

if (require.main === module) {
  main();
}

module.exports = { createAllLectures, assignLecturesToClasses, getLecturesForClass };