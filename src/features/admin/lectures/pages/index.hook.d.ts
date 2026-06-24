import type { CreateLectureData, Lecture } from '../types/lectures.types';
import type { Class } from '../../classes/types/classes.types';

export type LecturesPageView = 'classes' | 'class-lectures' | 'form';

export interface UseLecturesPageResult {
  view: LecturesPageView;
  selectedClass: Class | undefined;
  editingLecture: Lecture | undefined;
  classSearchTerm: string;
  lectureSearchTerm: string;
  filteredClasses: Class[];
  classLectures: Lecture[];
  allClassesCount: number;
  isLoading: boolean;
  isFormLoading: boolean;
  error: { message?: string } | null | undefined;
  setClassSearchTerm: (value: string) => void;
  setLectureSearchTerm: (value: string) => void;
  getLectureCountForClass: (classId: string) => number;
  handleSelectClass: (classItem: Class) => void;
  handleBackToClasses: () => void;
  handleAddLecture: () => void;
  handleEditLecture: (lecture: Lecture) => void;
  handleCancelForm: () => void;
  handleSubmit: (data: CreateLectureData) => void;
  handleView: (lecture: Lecture) => void;
  handleDelete: (id: string) => void;
}

export function useLecturesPage(): UseLecturesPageResult;
