import type { Class, CreateClassData } from '../types/classes.types';

export type ClassesStatusFilter = 'all' | 'active' | 'inactive';

export interface ClassesPageStat {
  label: string;
  value: number;
}

export interface ClassCardViewModel {
  teacherName: string;
  teacherInitials: string;
  className: string;
  classInitials: string;
  classSection: string;
  studentCount: number;
  isActive: boolean;
  avatarStyle: {
    background: string;
    color: string;
  };
}

export interface UseClassesPageResult {
  error: unknown;
  showForm: boolean;
  editingClass: Class | undefined;
  searchTerm: string;
  statusFilter: ClassesStatusFilter;
  statusTabs: readonly ClassesStatusFilter[];
  isLoading: boolean;
  isLoadingClassDetails: boolean;
  isFormLoading: boolean;
  currentPage: number;
  paginatedClasses: Class[];
  stats: ClassesPageStat[];
  visiblePages: number[];
  totalPages: number;
  startItem: number;
  endItem: number;
  filteredClassesCount: number;
  handleSearchChange: (value: string) => void;
  handleStatusFilterChange: (value: ClassesStatusFilter) => void;
  handleSubmit: (data: CreateClassData) => void;
  handleCancel: () => void;
  handleAddNew: () => void;
  handleEdit: (classItem: Class) => void;
  handleView: (classItem: Class) => void;
  handleDelete: (id: string) => void;
  handlePageChange: (page: number) => void;
  getClassCardViewModel: (classItem: Partial<Class> | null | undefined, index: number) => ClassCardViewModel;
}

export function useClassesPage(): UseClassesPageResult;
