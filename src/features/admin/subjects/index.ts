/**
 * Admin Subjects Feature - Public Exports
 */

// Pages
export { SubjectsPage } from './pages/SubjectsPage';
export { SubjectDetailsPage } from './pages/SubjectDetailsPage';

// Components
export { SubjectTable } from './components/SubjectTable';
export { SubjectForm } from './components/SubjectForm';
export { SubjectSidebar } from './components/SubjectSidebar';
export { SubjectTableView } from './components/SubjectTableView';
export { SubjectDetailsView } from './components/SubjectDetailsView';

// Hooks
export { useSubjects } from './hooks/useSubjects';
export { useSubject } from './hooks/useSubject';
export { useCreateSubject } from './hooks/useCreateSubject';
export { useUpdateSubject } from './hooks/useUpdateSubject';
export { useDeleteSubject } from './hooks/useDeleteSubject';
export { useSubjectsView } from './hooks/useSubjectsView';
export { useSubjectView } from './hooks/useSubjectView';

// Types
export type { Subject, CreateSubjectData, UpdateSubjectData } from './types/subjects.types';

// Constants
export { subjectsQueryKeys, SUBJECT_STATUS, VALIDATION } from './constants/subjects.constants';

// Utils
export {
  formatPrice,
  parsePrice,
  filterSubjects,
  filterSubjectsByClass,
  filterSubjectsByStatus,
  sortSubjects,
  formatDate,
  validateSubjectForm,
  getDefaultSubjectFormData,
} from './utils/subjects.utils';

// API
export { subjectsApi } from './api/subjects.api';
export { subjectsViewApi } from './api/subjects-view.api';

