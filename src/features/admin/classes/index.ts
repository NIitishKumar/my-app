/**
 * Admin Classes Feature - Public Exports
 */

// Pages
export { ClassesPage } from './pages/ClassesPage';

// Components
export { ClassTable } from './components/ClassTable';
export { ClassForm } from './components/ClassForm';

// Hooks
export { useClasses } from './hooks/useClasses';
export { useClassDetails } from './hooks/useClassDetails';
export { useCreateClass } from './hooks/useCreateClass';
export { useUpdateClass } from './hooks/useUpdateClass';
export { useDeleteClass } from './hooks/useDeleteClass';

// Types
export type { Class, CreateClassData, UpdateClassData } from './types/classes.types';

// Constants
export { classesQueryKeys, GRADE_OPTIONS, SECTION_OPTIONS } from './constants/classes.constants';

// Utils
export { formatClassName, sortClasses, filterClasses } from './utils/classes.utils';

// API
export { classesApi } from './api/classes.api';


