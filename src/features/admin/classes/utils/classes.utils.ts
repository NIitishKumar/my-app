/**
 * Classes Utility Functions
 */

import type { Class, CreateClassData, ClassSchedule } from '../types/classes.types';
import { VALIDATION } from '../constants/classes.constants';

/**
 * Format class display name
 */
export const formatClassName = (classItem: Class): string => {
  return `${classItem.className} - Grade ${classItem.grade}`;
};

/**
 * Sort classes by grade
 */
export const sortClasses = (classes: Class[]): Class[] => {
  return [...classes].sort((a, b) => {
    // First sort by grade
    const gradeCompare = parseInt(a.grade) - parseInt(b.grade);
    if (gradeCompare !== 0) return gradeCompare;
    
    // Then sort by class name
    return a.className.localeCompare(b.className);
  });
};

/**
 * Filter classes by search term
 */
export const filterClasses = (classes: Class[], searchTerm: string): Class[] => {
  const term = searchTerm.toLowerCase();
  return classes.filter((classItem) =>
    classItem.className.toLowerCase().includes(term) ||
    classItem.grade.includes(term) ||
    (classItem.section && classItem.section.toLowerCase().includes(term)) ||
    classItem.roomNo.toLowerCase().includes(term) ||
    `${classItem.classHead.firstName} ${classItem.classHead.lastName}`.toLowerCase().includes(term)
  );
};

/**
 * Validation functions
 */
export interface ValidationErrors {
  className?: string;
  subjects?: string;
  grade?: string;
  roomNo?: string;
  capacity?: string;
  classHead?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    employeeId?: string;
  };
  schedule?: {
    academicYear?: string;
    semester?: string;
    startDate?: string;
    endDate?: string;
  };
  isActive?: string;
}

export const validateClassForm = (data: Partial<CreateClassData>): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Class Name validation
  if (!data.className || data.className.trim().length === 0) {
    errors.className = 'Class name is required';
  } else if (data.className.length < VALIDATION.CLASS_NAME_MIN_LENGTH) {
    errors.className = `Class name must be at least ${VALIDATION.CLASS_NAME_MIN_LENGTH} characters`;
  } else if (data.className.length > VALIDATION.CLASS_NAME_MAX_LENGTH) {
    errors.className = `Class name must not exceed ${VALIDATION.CLASS_NAME_MAX_LENGTH} characters`;
  }

  // Subjects validation
  if (!data.subjects || data.subjects.length === 0) {
    errors.subjects = 'At least one subject is required';
  }

  // Grade validation
  if (!data.grade || data.grade.trim().length === 0) {
    errors.grade = 'Grade is required';
  }

  // Room Number validation
  if (!data.roomNo || data.roomNo.trim().length === 0) {
    errors.roomNo = 'Room number is required';
  } else if (data.roomNo.length < VALIDATION.ROOM_NO_MIN_LENGTH) {
    errors.roomNo = `Room number must be at least ${VALIDATION.ROOM_NO_MIN_LENGTH} character`;
  } else if (data.roomNo.length > VALIDATION.ROOM_NO_MAX_LENGTH) {
    errors.roomNo = `Room number must not exceed ${VALIDATION.ROOM_NO_MAX_LENGTH} characters`;
  }

  // Capacity validation
  if (data.capacity === undefined || data.capacity === null) {
    errors.capacity = 'Capacity is required';
  } else if (data.capacity < VALIDATION.CAPACITY_MIN) {
    errors.capacity = `Capacity must be at least ${VALIDATION.CAPACITY_MIN}`;
  } else if (data.capacity > VALIDATION.CAPACITY_MAX) {
    errors.capacity = `Capacity must not exceed ${VALIDATION.CAPACITY_MAX}`;
  }

  // Class Head validation
  if (data.classHead) {
    errors.classHead = {};
    if (!data.classHead.firstName || data.classHead.firstName.trim().length === 0) {
      errors.classHead.firstName = 'First name is required';
    }
    if (!data.classHead.lastName || data.classHead.lastName.trim().length === 0) {
      errors.classHead.lastName = 'Last name is required';
    }
    if (!data.classHead.email || data.classHead.email.trim().length === 0) {
      errors.classHead.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.classHead.email)) {
      errors.classHead.email = 'Please enter a valid email address';
    }
    if (!data.classHead.employeeId || data.classHead.employeeId.trim().length === 0) {
      errors.classHead.employeeId = 'Employee ID is required';
    } else if (data.classHead.employeeId.length < VALIDATION.EMPLOYEE_ID_MIN_LENGTH) {
      errors.classHead.employeeId = `Employee ID must be at least ${VALIDATION.EMPLOYEE_ID_MIN_LENGTH} characters`;
    } else if (data.classHead.employeeId.length > VALIDATION.EMPLOYEE_ID_MAX_LENGTH) {
      errors.classHead.employeeId = `Employee ID must not exceed ${VALIDATION.EMPLOYEE_ID_MAX_LENGTH} characters`;
    }
  } else {
    errors.classHead = {
      firstName: 'Class head information is required',
    };
  }

  // Schedule validation
  if (data.schedule) {
    errors.schedule = {};
    if (!data.schedule.academicYear || data.schedule.academicYear.trim().length === 0) {
      errors.schedule.academicYear = 'Academic year is required';
    }
    if (!data.schedule.semester || data.schedule.semester.trim().length === 0) {
      errors.schedule.semester = 'Semester is required';
    }
    if (!data.schedule.startDate) {
      errors.schedule.startDate = 'Start date is required';
    }
    if (!data.schedule.endDate) {
      errors.schedule.endDate = 'End date is required';
    } else if (data.schedule.startDate && data.schedule.endDate) {
      const startDate = new Date(data.schedule.startDate);
      const endDate = new Date(data.schedule.endDate);
      if (endDate <= startDate) {
        errors.schedule.endDate = 'End date must be after start date';
      }
    }
  } else {
    errors.schedule = {
      academicYear: 'Schedule information is required',
    };
  }

  return errors;
};

/**
 * Format date to YYYY-MM-DD for input fields
 */
export const formatDateForInput = (date: Date | string | undefined): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
};

/**
 * Parse date string to Date object
 */
export const parseDateFromInput = (dateString: string): Date | undefined => {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? undefined : date;
};

/**
 * Get default form values
 */
export const getDefaultClassFormData = (): Partial<CreateClassData> => {
  const currentYear = new Date().getFullYear();
  return {
    className: '',
    subjects: [],
    grade: '',
    roomNo: '',
    capacity: 30,
    enrolled: 0,
    students: [],
    classHead: {
      firstName: '',
      lastName: '',
      email: '',
      employeeId: '',
    },
    lectures: [],
    schedule: {
      academicYear: `${currentYear}-${currentYear + 1}`,
      semester: 'Fall',
      startDate: new Date(),
      endDate: new Date(),
    },
    isActive: true,
  };
};

/**
 * Get teacher initials from name
 */
export const getTeacherInitials = (firstName: string, lastName: string): string => {
  const first = firstName.charAt(0).toUpperCase();
  const last = lastName.charAt(0).toUpperCase();
  return `${first}${last}`;
};

/**
 * Get teacher prefix (Mr., Dr., Ms., etc.)
 */
export const getTeacherPrefix = (name: string): string => {
  if (name.startsWith('Dr.')) return 'Dr.';
  if (name.startsWith('Mr.')) return 'Mr.';
  if (name.startsWith('Ms.')) return 'Ms.';
  if (name.startsWith('Mrs.')) return 'Mrs.';
  return '';
};

/**
 * Get teacher name without prefix
 */
export const getTeacherNameWithoutPrefix = (name: string): string => {
  return name.replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.)\s+/, '');
};

/**
 * Get avatar color based on teacher initials
 */
export const getAvatarColor = (initials: string): string => {
  const colors = [
    'bg-purple-500',
    'bg-indigo-500',
    'bg-blue-500',
    'bg-cyan-500',
    'bg-teal-500',
    'bg-green-500',
  ];
  const index = initials.charCodeAt(0) % colors.length;
  return colors[index];
};

/**
 * Generate mock class data
 */
export const generateMockClasses = (): Class[] => {
  const currentYear = new Date().getFullYear();
  const sections = ['A', 'B', 'C'];
  const teachers = [
    { firstName: 'John', lastName: 'Anderson', prefix: 'Mr.', email: 'john.anderson@school.com', employeeId: 'EMP001' },
    { firstName: 'Sarah', lastName: 'Miller', prefix: 'Dr.', email: 'sarah.miller@school.com', employeeId: 'EMP002' },
    { firstName: 'Emily', lastName: 'Davis', prefix: 'Ms.', email: 'emily.davis@school.com', employeeId: 'EMP003' },
    { firstName: 'Michael', lastName: 'Brown', prefix: 'Mr.', email: 'michael.brown@school.com', employeeId: 'EMP004' },
    { firstName: 'Jessica', lastName: 'Wilson', prefix: 'Ms.', email: 'jessica.wilson@school.com', employeeId: 'EMP005' },
    { firstName: 'David', lastName: 'Taylor', prefix: 'Mr.', email: 'david.taylor@school.com', employeeId: 'EMP006' },
    { firstName: 'Lisa', lastName: 'Martinez', prefix: 'Ms.', email: 'lisa.martinez@school.com', employeeId: 'EMP007' },
  ];

  const mockClasses: Class[] = [];
  let idCounter = 1;

  // Add the exact classes from the image first
  mockClasses.push(
    {
      id: `class-${idCounter++}`,
      className: 'Grade 10',
      section: 'Section A',
      subjects: ['Mathematics', 'English', 'Science'],
      grade: '10',
      roomNo: 'Room 201',
      capacity: 50,
      enrolled: 42,
      students: [],
      classHead: {
        firstName: 'John',
        lastName: 'Anderson',
        email: 'john.anderson@school.com',
        employeeId: 'EMP001',
      },
      lectures: [],
      schedule: {
        academicYear: `${currentYear}-${currentYear + 1}`,
        semester: 'Fall',
        startDate: new Date(currentYear, 8, 1),
        endDate: new Date(currentYear + 1, 5, 30),
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: `class-${idCounter++}`,
      className: 'Grade 10',
      section: 'Section B',
      subjects: ['Mathematics', 'English', 'Science'],
      grade: '10',
      roomNo: 'Room 202',
      capacity: 50,
      enrolled: 38,
      students: [],
      classHead: {
        firstName: 'Sarah',
        lastName: 'Miller',
        email: 'sarah.miller@school.com',
        employeeId: 'EMP002',
      },
      lectures: [],
      schedule: {
        academicYear: `${currentYear}-${currentYear + 1}`,
        semester: 'Fall',
        startDate: new Date(currentYear, 8, 1),
        endDate: new Date(currentYear + 1, 5, 30),
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: `class-${idCounter++}`,
      className: 'Grade 11',
      section: 'Section A',
      subjects: ['Mathematics', 'English', 'Science'],
      grade: '11',
      roomNo: 'Room 301',
      capacity: 50,
      enrolled: 35,
      students: [],
      classHead: {
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@school.com',
        employeeId: 'EMP003',
      },
      lectures: [],
      schedule: {
        academicYear: `${currentYear}-${currentYear + 1}`,
        semester: 'Fall',
        startDate: new Date(currentYear, 8, 1),
        endDate: new Date(currentYear + 1, 5, 30),
      },
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );

  // Generate additional classes for pagination
  for (let grade = 9; grade <= 12; grade++) {
    sections.forEach((section, sectionIndex) => {
      // Skip the ones we already added
      if (grade === 10 && (section === 'A' || section === 'B')) return;
      if (grade === 11 && section === 'A') return;

      const teacher = teachers[(grade * 3 + sectionIndex) % teachers.length];
      const studentCount = 30 + Math.floor(Math.random() * 15);
      const isActive = Math.random() > 0.2;

      mockClasses.push({
        id: `class-${idCounter++}`,
        className: `Grade ${grade}`,
        section: `Section ${section}`,
        subjects: ['Mathematics', 'English', 'Science'],
        grade: grade.toString(),
        roomNo: `Room ${200 + idCounter}`,
        capacity: 50,
        enrolled: studentCount,
        students: [],
        classHead: {
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          email: teacher.email,
          employeeId: teacher.employeeId,
        },
        lectures: [],
        schedule: {
          academicYear: `${currentYear}-${currentYear + 1}`,
          semester: 'Fall',
          startDate: new Date(currentYear, 8, 1),
          endDate: new Date(currentYear + 1, 5, 30),
        },
        isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  }

  return mockClasses;
};


