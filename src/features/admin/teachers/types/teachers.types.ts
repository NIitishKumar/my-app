/**
 * Teachers Domain Types
 */

export interface TeacherAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface EmergencyContact {
  name?: string;
  relationship?: string;
  phone?: string;
}

export interface TeacherDocument {
  name: string;
  type: 'resume' | 'certificate' | 'degree' | 'id-proof' | 'address-proof';
  url: string;
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  address?: TeacherAddress;
  qualification: string;
  specialization: string[];
  subjects: string[];
  experience?: number; // in years
  joiningDate: Date;
  employmentType: 'permanent' | 'contract' | 'part-time' | 'temporary';
  department?: 'Mathematics' | 'English' | 'Hindi' | 'Science' | 'Social Studies' | 'Computer Science' | 'Physical Education' | 'Arts' | 'Music' | 'Administration';
  salary?: number;
  status: 'active' | 'inactive' | 'on-leave';
  emergencyContact?: EmergencyContact;
  documents: TeacherDocument[];
  classes: string[]; // ObjectId references
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTeacherData {
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  address?: TeacherAddress;
  qualification: string;
  specialization: string[];
  subjects: string[];
  experience?: number;
  joiningDate: Date;
  employmentType: 'permanent' | 'contract' | 'part-time' | 'temporary';
  department?: 'Mathematics' | 'English' | 'Hindi' | 'Science' | 'Social Studies' | 'Computer Science' | 'Physical Education' | 'Arts' | 'Music' | 'Administration';
  salary?: number;
  status: 'active' | 'inactive' | 'on-leave';
  emergencyContact?: EmergencyContact;
  documents: TeacherDocument[];
  classes?: string[];
  isActive: boolean;
}

export interface UpdateTeacherData extends Partial<CreateTeacherData> {
  id: string;
}

// API DTOs
export interface TeacherAddressDTO {
  street?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

export interface EmergencyContactDTO {
  name?: string;
  relationship?: string;
  phone?: string;
}

export interface TeacherDocumentDTO {
  name: string;
  type: string;
  url: string;
}

export interface TeacherDTO {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  employee_id: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  address?: TeacherAddressDTO;
  qualification: string;
  specialization: string[];
  subjects: string[];
  experience?: number;
  joining_date: string;
  employment_type: string;
  department?: string;
  salary?: number;
  status: string;
  emergency_contact?: EmergencyContactDTO;
  documents: TeacherDocumentDTO[];
  classes: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTeacherDTO {
  first_name: string;
  last_name: string;
  email: string;
  employee_id: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  address?: TeacherAddressDTO;
  qualification: string;
  specialization: string[];
  subjects: string[];
  experience?: number;
  joining_date: string;
  employment_type: string;
  department?: string;
  salary?: number;
  status: string;
  emergency_contact?: EmergencyContactDTO;
  documents: TeacherDocumentDTO[];
  classes?: string[];
  is_active: boolean;
}
