/**
 * Test utilities and mock data
 * Mock data for testing frontend components
 */

export const mockTeacherClasses = [
  {
    _id: 'class-1',
    className: 'Grade 10-A',
    subjects: ['Mathematics', 'Physics'],
    grade: '10',
    roomNo: 'A101',
    capacity: 30,
    enrolled: 25,
    isActive: true,
    subject: 'Mathematics',
    attendanceRate: 85.5,
    lastAttendanceDate: '2024-01-15T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    classHead: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@school.com',
      employeeId: 'EMP001',
    },
    schedule: {
      academicYear: '2024-2025',
      semester: 'Fall',
      startDate: '2024-09-01T00:00:00Z',
      endDate: '2024-12-31T00:00:00Z',
    },
    students: [],
    lectures: [],
  },
  {
    _id: 'class-2',
    className: 'Grade 10-B',
    subjects: ['Mathematics'],
    grade: '10',
    roomNo: 'A102',
    capacity: 30,
    enrolled: 28,
    isActive: true,
    subject: 'Mathematics',
    attendanceRate: 92.0,
    lastAttendanceDate: '2024-01-15T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    classHead: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@school.com',
      employeeId: 'EMP002',
    },
    schedule: {
      academicYear: '2024-2025',
      semester: 'Fall',
      startDate: '2024-09-01T00:00:00Z',
      endDate: '2024-12-31T00:00:00Z',
    },
    students: [],
    lectures: [],
  },
];

export const mockAttendanceRecord = {
  _id: 'attendance-1',
  classId: 'class-1',
  className: 'Grade 10-A',
  date: '2024-01-15T00:00:00Z',
  students: [
    {
      studentId: 'student-1',
      studentName: 'Alice Smith',
      status: 'present' as const,
      remarks: '',
    },
    {
      studentId: 'student-2',
      studentName: 'Bob Johnson',
      status: 'absent' as const,
      remarks: 'Sick leave',
    },
    {
      studentId: 'student-3',
      studentName: 'Charlie Brown',
      status: 'late' as const,
      remarks: 'Traffic',
    },
  ],
  submittedBy: 'teacher-1',
  submittedAt: '2024-01-15T10:00:00Z',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
};

export const mockStudent = {
  _id: 'student-1',
  firstName: 'Alice',
  lastName: 'Smith',
  studentId: 'STU001',
  email: 'alice.smith@school.com',
  age: 16,
  grade: '10',
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

