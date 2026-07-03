/**
 * Teachers Domain Types
 */

// Domain Types (used in the application)
export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  phone?: string;
  department?: string;
  qualification?: string;
  specialization?: string; // String, not array
  subjects: string[];
  status: 'active' | 'inactive' | 'on-leave';
  employmentType: 'full-time' | 'part-time' | 'contract';
  experience?: number; // in years
  joiningDate?: Date;
  isActive: boolean;
  classes: string[] | ClassReference[]; // Can be IDs or full class objects
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ClassReference {
  _id: string;
  className: string;
  grade: string;
  roomNo: string;
  subjects: string[];
  schedule?: {
    academicYear: string;
    semester: string;
    startDate: string;
    endDate: string;
  };
}

export interface CreateTeacherData {
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  phone?: string;
  department?: string;
  qualification?: string;
  specialization?: string; // String, not array
  subjects: string[];
  status?: 'active' | 'inactive' | 'on-leave';
  employmentType?: 'full-time' | 'part-time' | 'contract';
  experience?: number;
  joiningDate?: string; // ISO date string
}

export interface UpdateTeacherData extends Partial<CreateTeacherData> {
  id: string;
}

// API Response Types (camelCase with _id)
export interface TeacherApiDTO {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  phone?: string;
  department?: string;
  qualification?: string;
  specialization?: string; // String from API
  subjects: string[];
  status: 'active' | 'inactive' | 'on-leave';
  employmentType: 'full-time' | 'part-time' | 'contract';
  experience?: number;
  joiningDate?: string; // ISO date string
  isActive?: boolean;
  classes?: string[] | ClassReference[];
  createdAt?: string;
  updatedAt?: string;
}

// API Response Wrappers
export interface TeachersApiResponse {
  success: boolean;
  count?: number;
  total?: number;
  page?: number;
  limit?: number;
  pages?: number;
  data: TeacherApiDTO[];
}

export interface TeacherApiResponse {
  success: boolean;
  data: TeacherApiDTO;
  message?: string;
}

export interface TeachersByDepartmentResponse {
  success: boolean;
  count: number;
  data: TeacherApiDTO[];
}

export interface TeachersStatsResponse {
  success: boolean;
  data: {
    totalTeachers: number;
    teachersByDepartment: Array<{
      _id: string;
      count: number;
    }>;
    teachersByStatus: Array<{
      _id: string;
      count: number;
    }>;
    averageExperience: string;
  };
}

export interface TeacherWithClassesResponse {
  success: boolean;
  data: TeacherApiDTO & {
    classes: ClassReference[];
  };
}

export interface AddClassToTeacherRequest {
  classId: string;
}

export interface RemoveClassFromTeacherRequest {
  classId: string;
}

export interface AddClassToTeacherResponse {
  success: boolean;
  message: string;
}

export interface RemoveClassFromTeacherResponse {
  success: boolean;
  message: string;
}

// Query Parameters
export interface TeachersQueryParams {
  page?: number;
  limit?: number;
  department?: string;
  status?: 'active' | 'inactive' | 'on-leave';
  search?: string;
}
