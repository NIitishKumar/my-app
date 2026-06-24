import type { RefObject } from 'react';
import type { FormikProps } from 'formik';
import type { CreateClassData, Class } from '../../types/classes.types';
import type { Student } from '../../../students/types/students.types';
import type { Teacher } from '../../../teachers/types/teachers.types';

type ClassFormValues = Partial<CreateClassData> & {
  classHeadId?: string;
};

export interface UseClassFormParams {
  initialData?: Class;
  onSubmit: (data: CreateClassData) => void;
}

export interface UseClassFormResult {
  formik: FormikProps<ClassFormValues>;
  isLoadingStudents: boolean;
  isLoadingTeachers: boolean;
  studentSearchTerm: string;
  setStudentSearchTerm: (value: string) => void;
  isStudentDropdownOpen: boolean;
  setIsStudentDropdownOpen: (value: boolean) => void;
  studentDropdownRef: RefObject<HTMLDivElement | null>;
  teacherSearchTerm: string;
  setTeacherSearchTerm: (value: string) => void;
  isTeacherDropdownOpen: boolean;
  setIsTeacherDropdownOpen: (value: boolean) => void;
  teacherDropdownRef: RefObject<HTMLDivElement | null>;
  getFieldError: (field: string) => string | undefined;
  isFieldValid: (field: string) => boolean;
  isFieldInvalid: (field: string) => boolean;
  academicYearOptions: string[];
  selectedStudentIds: string[];
  selectedStudents: Student[];
  filteredStudents: Student[];
  filteredTeachers: Teacher[];
  selectedTeacherId: string | undefined;
  handleTeacherToggle: (teacher: Teacher) => void;
  handleStudentToggle: (studentId: string) => void;
  handleRemoveStudent: (studentId: string) => void;
  handleSubjectToggle: (subject: string) => void;
  handleSaveClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function useClassForm(params: UseClassFormParams): UseClassFormResult;
