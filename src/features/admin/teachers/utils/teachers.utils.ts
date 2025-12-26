/**
 * Teachers Utility Functions
 */

import type { Teacher, CreateTeacherData, TeacherDTO, CreateTeacherDTO } from '../types/teachers.types';
import { VALIDATION } from '../constants/teachers.constants';

/**
 * Format teacher display name
 */
export const formatTeacherName = (teacher: Teacher): string => {
  return `${teacher.firstName} ${teacher.lastName}`;
};

/**
 * Sort teachers by name
 */
export const sortTeachers = (teachers: Teacher[]): Teacher[] => {
  return [...teachers].sort((a, b) => {
    const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
    const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });
};

/**
 * Filter teachers by search term
 */
export const filterTeachers = (teachers: Teacher[], searchTerm: string): Teacher[] => {
  const term = searchTerm.toLowerCase();
  return teachers.filter((teacher) =>
    teacher.firstName.toLowerCase().includes(term) ||
    teacher.lastName.toLowerCase().includes(term) ||
    teacher.email.toLowerCase().includes(term) ||
    teacher.employeeId.toLowerCase().includes(term) ||
    teacher.phone?.toLowerCase().includes(term) ||
    teacher.department?.toLowerCase().includes(term) ||
    teacher.qualification.toLowerCase().includes(term)
  );
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
 * Get avatar color based on teacher initials
 */
export const getTeacherAvatarColor = (initials: string): string => {
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
export const getDefaultTeacherFormData = (): Partial<CreateTeacherData> => {
  return {
    firstName: '',
    lastName: '',
    email: '',
    employeeId: '',
    phone: '',
    dateOfBirth: undefined,
    gender: undefined,
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
    qualification: '',
    specialization: [],
    subjects: [],
    experience: undefined,
    joiningDate: new Date(),
    employmentType: 'permanent',
    department: undefined,
    salary: undefined,
    status: 'active',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
    },
    documents: [],
    classes: [],
    isActive: true,
  };
};

/**
 * Map TeacherDTO to Teacher
 */
export const teacherDTOToTeacher = (dto: TeacherDTO): Teacher => {
  return {
    id: dto.id,
    firstName: dto.first_name,
    lastName: dto.last_name,
    email: dto.email,
    employeeId: dto.employee_id,
    phone: dto.phone,
    dateOfBirth: dto.date_of_birth ? new Date(dto.date_of_birth) : undefined,
    gender: dto.gender as 'male' | 'female' | 'other' | undefined,
    address: dto.address
      ? {
          street: dto.address.street,
          city: dto.address.city,
          state: dto.address.state,
          zipCode: dto.address.zip_code,
        }
      : undefined,
    qualification: dto.qualification,
    specialization: dto.specialization || [],
    subjects: dto.subjects || [],
    experience: dto.experience,
    joiningDate: new Date(dto.joining_date),
    employmentType: dto.employment_type as 'permanent' | 'contract' | 'part-time' | 'temporary',
    department: dto.department as Teacher['department'],
    salary: dto.salary,
    status: dto.status as 'active' | 'inactive' | 'on-leave',
    emergencyContact: dto.emergency_contact
      ? {
          name: dto.emergency_contact.name,
          relationship: dto.emergency_contact.relationship,
          phone: dto.emergency_contact.phone,
        }
      : undefined,
    documents: dto.documents.map((doc) => ({
      name: doc.name,
      type: doc.type as 'resume' | 'certificate' | 'degree' | 'id-proof' | 'address-proof',
      url: doc.url,
    })),
    classes: dto.classes || [],
    isActive: dto.is_active,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  };
};

/**
 * Map Teacher to CreateTeacherDTO
 */
export const teacherToCreateTeacherDTO = (teacher: CreateTeacherData): CreateTeacherDTO => {
  return {
    first_name: teacher.firstName,
    last_name: teacher.lastName,
    email: teacher.email.toLowerCase(),
    employee_id: teacher.employeeId,
    phone: teacher.phone,
    date_of_birth: teacher.dateOfBirth ? teacher.dateOfBirth.toISOString() : undefined,
    gender: teacher.gender,
    address: teacher.address
      ? {
          street: teacher.address.street,
          city: teacher.address.city,
          state: teacher.address.state,
          zip_code: teacher.address.zipCode,
        }
      : undefined,
    qualification: teacher.qualification,
    specialization: teacher.specialization || [],
    subjects: teacher.subjects || [],
    experience: teacher.experience,
    joining_date: teacher.joiningDate.toISOString(),
    employment_type: teacher.employmentType,
    department: teacher.department,
    salary: teacher.salary,
    status: teacher.status,
    emergency_contact: teacher.emergencyContact
      ? {
          name: teacher.emergencyContact.name,
          relationship: teacher.emergencyContact.relationship,
          phone: teacher.emergencyContact.phone,
        }
      : undefined,
    documents: teacher.documents || [],
    classes: teacher.classes || [],
    is_active: teacher.isActive,
  };
};

/**
 * Generate mock teacher data
 */
export const generateMockTeachers = (): Teacher[] => {
  const firstNames = [
    'John', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'James', 'Emma',
    'William', 'Olivia', 'Robert', 'Sophia', 'Daniel', 'Isabella', 'Matthew', 'Ava',
    'Christopher', 'Mia', 'Andrew', 'Charlotte', 'Joseph', 'Amelia', 'Joshua', 'Harper',
    'Ryan', 'Evelyn', 'Nicholas', 'Abigail', 'Kevin', 'Elizabeth', 'Brandon', 'Sofia'
  ];
  
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor',
    'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Clark',
    'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott'
  ];

  const departments: Teacher['department'][] = [
    'Mathematics', 'English', 'Science', 'Computer Science', 'Physical Education',
    'Arts', 'Music', 'Social Studies', 'Hindi', 'Administration'
  ];

  const qualifications = [
    'Bachelor of Education (B.Ed)',
    'Master of Education (M.Ed)',
    'Bachelor of Science (B.Sc)',
    'Master of Science (M.Sc)',
    'Ph.D in Education',
    'Post Graduate Diploma',
  ];

  const subjects = [
    ['Mathematics', 'Physics'],
    ['English', 'Literature'],
    ['Science', 'Biology', 'Chemistry'],
    ['Computer Science', 'Mathematics'],
    ['Physical Education'],
    ['Arts', 'Music'],
    ['History', 'Geography'],
    ['Hindi', 'English'],
  ];

  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'];
  const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA'];
  
  const mockTeachers: Teacher[] = [];
  let idCounter = 1;

  // Generate 25+ teachers
  for (let i = 0; i < 25; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
    const employeeId = `EMP${String(idCounter).padStart(4, '0')}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@school.com`;
    const department = departments[i % departments.length];
    const gender = ['male', 'female', 'other'][Math.floor(Math.random() * 3)] as 'male' | 'female' | 'other';
    const phone = `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
    const cityIndex = i % cities.length;
    const dateOfBirth = new Date(1970 + Math.floor(Math.random() * 30), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const joiningDate = new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const experience = Math.floor(Math.random() * 20) + 1;
    const salary = Math.floor(Math.random() * 50000) + 40000;
    const status = ['active', 'inactive', 'on-leave'][Math.floor(Math.random() * 10) % 3] as 'active' | 'inactive' | 'on-leave';
    const isActive = status === 'active';
    const employmentType = ['permanent', 'contract', 'part-time', 'temporary'][Math.floor(Math.random() * 4)] as 'permanent' | 'contract' | 'part-time' | 'temporary';
    const qualification = qualifications[Math.floor(Math.random() * qualifications.length)];
    const teacherSubjects = subjects[i % subjects.length];
    const specialization = ['Elementary Education', 'Secondary Education', 'Subject Area'][Math.floor(Math.random() * 3)];

    mockTeachers.push({
      id: `teacher-${idCounter++}`,
      firstName,
      lastName,
      email,
      employeeId,
      phone,
      dateOfBirth,
      gender,
      address: {
        street: `${Math.floor(Math.random() * 9999) + 1} Main St`,
        city: cities[cityIndex],
        state: states[cityIndex],
        zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
      },
      qualification,
      specialization: [specialization],
      subjects: teacherSubjects,
      experience,
      joiningDate,
      employmentType,
      department,
      salary,
      status,
      emergencyContact: {
        name: `${firstNames[(i + 1) % firstNames.length]} ${lastNames[(i + 1) % lastNames.length]}`,
        relationship: ['Spouse', 'Parent', 'Sibling'][Math.floor(Math.random() * 3)],
        phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      },
      documents: [
        {
          name: 'Resume',
          type: 'resume',
          url: `https://example.com/documents/${employeeId}/resume.pdf`,
        },
        {
          name: 'Degree Certificate',
          type: 'degree',
          url: `https://example.com/documents/${employeeId}/degree.pdf`,
        },
      ],
      classes: [],
      isActive,
      createdAt: joiningDate,
      updatedAt: joiningDate,
    });
  }

  return mockTeachers;
};

