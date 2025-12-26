/**
 * Classes Domain Types
 */

export interface ClassHead {
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
}

export interface ClassSchedule {
  academicYear: string;
  semester: 'Fall' | 'Spring' | 'Summer' | 'Winter';
  startDate: Date;
  endDate: Date;
}

export interface Class {
  id: string;
  className: string;
  subjects: string[];
  grade: string;
  section?: string; // Optional section field for display
  roomNo: string;
  capacity: number;
  enrolled: number;
  students: string[]; // ObjectId references
  classHead: ClassHead;
  lectures: string[]; // ObjectId references
  schedule: ClassSchedule;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClassData {
  className: string;
  subjects: string[];
  grade: string;
  roomNo: string;
  capacity: number;
  enrolled?: number;
  students?: string[];
  classHead: ClassHead;
  lectures?: string[];
  schedule: ClassSchedule;
  isActive: boolean;
}

export interface UpdateClassData extends Partial<CreateClassData> {
  id: string;
}

// API DTOs
export interface ClassHeadDTO {
  first_name: string;
  last_name: string;
  email: string;
  employee_id: string;
}

export interface ClassScheduleDTO {
  academic_year: string;
  semester: string;
  start_date: string;
  end_date: string;
}

export interface ClassDTO {
  id: string;
  class_name: string;
  subjects: string[];
  grade: string;
  room_no: string;
  capacity: number;
  enrolled: number;
  students: string[];
  class_head: ClassHeadDTO;
  lectures: string[];
  schedule: ClassScheduleDTO;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateClassDTO {
  class_name: string;
  subjects: string[];
  grade: string;
  room_no: string;
  capacity: number;
  enrolled?: number;
  students?: string[];
  class_head: ClassHeadDTO;
  lectures?: string[];
  schedule: ClassScheduleDTO;
  is_active: boolean;
}


