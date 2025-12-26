/**
 * Admin Lectures Feature - Public Exports
 */

export { LecturesPage } from './pages/LecturesPage';
export { LectureForm } from './components/LectureForm';
export { LectureTable } from './components/LectureTable';
export { useLectures } from './hooks/useLectures';
export { useLectureDetails } from './hooks/useLectureDetails';
export { useCreateLecture } from './hooks/useCreateLecture';
export { useUpdateLecture } from './hooks/useUpdateLecture';
export { useDeleteLecture } from './hooks/useDeleteLecture';
export type { Lecture, CreateLectureData, UpdateLectureData } from './types/lectures.types';
