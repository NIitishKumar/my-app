/**
 * StudentsPage Component
 */

import { useState, useMemo } from 'react';
import { useStudents } from '../hooks/useStudents';
import { useCreateStudent } from '../hooks/useCreateStudent';
import { useUpdateStudent } from '../hooks/useUpdateStudent';
import { useDeleteStudent } from '../hooks/useDeleteStudent';
import { StudentForm } from '../components/StudentForm';
import { filterStudents } from '../utils/students.utils';
import { StudentListSkeleton } from '../../../../shared/components/skeletons';
import type { Student, CreateStudentData } from '../types/students.types';

const ITEMS_PER_PAGE = 10;
const AVATAR_PALETTE = [
  { background: '#EEEDFE', color: '#534AB7' },
  { background: '#E1F5EE', color: '#1F6A47' },
  { background: '#E6F1FB', color: '#245A9F' },
  { background: '#FAECE7', color: '#9A512B' },
  { background: '#EAF3DE', color: '#4C6E16' },
  { background: '#FBEAF0', color: '#A33C65' },
];

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
  </svg>
);

const IdCardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
    <rect x="3.5" y="5" width="17" height="14" rx="2" />
    <circle cx="9" cy="12" r="2" />
    <path d="M13 10h4M13 14h4" strokeLinecap="round" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
    <path d="M16 19v-1.2a3.8 3.8 0 0 0-3.8-3.8H7.8A3.8 3.8 0 0 0 4 17.8V19" strokeLinecap="round" />
    <circle cx="10" cy="8" r="3" />
    <path d="M20 19v-1a3 3 0 0 0-2.2-2.9" strokeLinecap="round" />
    <path d="M15 5.3A3 3 0 0 1 15 11" strokeLinecap="round" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const PencilIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
    <path d="M4 20l4.2-.8L19 8.4a1.9 1.9 0 0 0 0-2.8l-.6-.6a1.9 1.9 0 0 0-2.8 0L4.8 15.8 4 20Z" strokeLinejoin="round" />
    <path d="M13.5 6.5l4 4" strokeLinecap="round" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
    <path d="M4 7h16" strokeLinecap="round" />
    <path d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7" strokeLinecap="round" />
    <path d="M6 7l1 11a2 2 0 0 0 2 1.8h6a2 2 0 0 0 2-1.8L18 7" strokeLinecap="round" />
    <path d="M10 11v5M14 11v5" strokeLinecap="round" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const getSafeText = (value?: string | null, fallback = '') => value?.trim() || fallback;

const getStudentName = (student?: Partial<Student> | null) => {
  const firstName = getSafeText(student?.firstName);
  const lastName = getSafeText(student?.lastName);
  return `${firstName} ${lastName}`.trim() || 'Unnamed Student';
};

const getInitials = (student?: Partial<Student> | null) => {
  const firstName = getSafeText(student?.firstName);
  const lastName = getSafeText(student?.lastName);
  const combined = `${firstName} ${lastName}`.trim();

  if (!combined) {
    return 'ST';
  }

  const words = combined.split(/\s+/).filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0] ?? ''}${words[1][0] ?? ''}`.toUpperCase();
};

const getVisiblePages = (currentPage: number, totalPages: number) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5];
  }

  if (currentPage >= totalPages - 2) {
    return Array.from({ length: 5 }, (_, index) => totalPages - 4 + index);
  }

  return Array.from({ length: 5 }, (_, index) => currentPage - 2 + index);
};

export const StudentsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: students, isLoading, error } = useStudents();
  const allStudents = useMemo(() => students ?? [], [students]);

  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();

  // Filter students based on search and status
  const filteredStudents = useMemo(() => {
    let filtered = allStudents || [];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filterStudents(filtered, searchTerm);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((student) =>
        statusFilter === 'active' ? student.isActive : !student.isActive
      );
    }

    return filtered;
  }, [allStudents, searchTerm, statusFilter]);

  // Paginate filtered students
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredStudents.slice(startIndex, endIndex);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const startItem = filteredStudents.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endItem = filteredStudents.length > 0 ? Math.min(currentPage * ITEMS_PER_PAGE, filteredStudents.length) : 0;
  const stats = useMemo(() => {
    const activeStudents = filteredStudents.filter((student) => Boolean(student?.isActive)).length;
    const inactiveStudents = filteredStudents.filter((student) => !student?.isActive).length;
    const gradesCovered = new Set(
      filteredStudents
        .map((student) => getSafeText(student?.grade))
        .filter(Boolean)
    ).size;

    return [
      { label: 'Total Students', value: filteredStudents.length },
      { label: 'Active Students', value: activeStudents },
      { label: 'Inactive Students', value: inactiveStudents },
      { label: 'Grades Covered', value: gradesCovered },
    ];
  }, [filteredStudents]);
  const visiblePages = useMemo(() => getVisiblePages(currentPage, totalPages), [currentPage, totalPages]);

  const handleSubmit = (data: CreateStudentData) => {
    if (editingStudent) {
      updateStudent.mutate(
        { id: editingStudent.id, ...data },
        {
          onSuccess: () => {
            setShowForm(false);
            setEditingStudent(undefined);
          },
        }
      );
    } else {
      createStudent.mutate(data, {
        onSuccess: () => {
          setShowForm(false);
        },
      });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingStudent(undefined);
  };

  const handleAddNew = () => {
    setEditingStudent(undefined);
    setShowForm(true);
  };

  const handleEdit = (student: Student) => {
    if (!student?.id) {
      return;
    }

    setEditingStudent(student);
    setShowForm(true);
  };

  const handleView = (student: Student) => {
    if (!student) {
      return;
    }

    // TODO: Implement view functionality (maybe show details modal)
    console.log('View student:', student);
  };

  const handleDelete = (id: string) => {
    if (!id) {
      return;
    }

    if (confirm('Are you sure you want to delete this student?')) {
      deleteStudent.mutate(id);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading && allStudents.length === 0) {
    return (
      <div className="p-4 lg:p-6">
        <StudentListSkeleton />
      </div>
    );
  }

  if (error && allStudents.length === 0) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center text-red-600">Error loading students: {error.message || 'Unknown error'}</div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] p-4 lg:p-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-medium text-gray-900 lg:text-3xl">All Students</h1>
        <p className="text-[14px] leading-[1.6] text-gray-600">Manage student records</p>
      </div>

      {showForm ? (
        <div className="mb-6">
          <StudentForm
            initialData={editingStudent}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={createStudent.isPending || updateStudent.isPending}
          />
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search by name, email, or student ID..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="block h-11 w-full rounded-2xl border border-gray-200 bg-white pl-11 pr-4 text-[14px] leading-[1.6] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#534AB7]"
              />
            </div>

            <div className="inline-flex w-full flex-wrap items-center gap-2 rounded-2xl bg-white p-1 xl:w-auto">
              {(['all', 'active', 'inactive'] as const).map((tab) => {
                const isActiveTab = statusFilter === tab;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setStatusFilter(tab);
                      setCurrentPage(1); // Reset to first page on filter change
                    }}
                    className={`rounded-xl px-4 py-2 text-[14px] font-medium capitalize transition-colors ${
                      isActiveTab ? 'bg-[#534AB7] text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleAddNew}
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#534AB7] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[#463ea0]"
            >
              + Add Student
            </button>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <div key={item.label} className="rounded-2xl bg-[#F3F4F6] px-4 py-4">
                <p className="text-[12px] text-gray-500">{item.label}</p>
                <p className="mt-2 text-[22px] font-semibold leading-none text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm lg:p-5">
            {paginatedStudents && paginatedStudents.length > 0 ? (
              <>
                <div
                  className="grid gap-4"
                  style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
                >
                  {paginatedStudents.map((student, index) => {
                    const studentName = getStudentName(student);
                    const studentInitials = getInitials(student);
                    const studentIdentifier = getSafeText(student?.studentId, 'No ID');
                    const studentEmail = getSafeText(student?.email, 'No email available');
                    const studentGrade = getSafeText(student?.grade, 'N/A');
                    const studentAge = student?.age ?? 'N/A';
                    const studentGender = getSafeText(student?.gender, 'N/A');
                    const isActive = Boolean(student?.isActive);
                    const avatarStyle = AVATAR_PALETTE[index % AVATAR_PALETTE.length];

                    return (
                      <div
                        key={student?.id ?? `student-card-${index}`}
                        onClick={() => handleView(student)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            handleView(student);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        className="cursor-pointer rounded-2xl border border-[#e5e7eb] bg-white p-4 text-left transition-colors hover:border-[#9ca3af]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div
                            className="flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-semibold"
                            style={{ backgroundColor: avatarStyle.background, color: avatarStyle.color }}
                          >
                            {studentInitials}
                          </div>
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                              isActive
                                ? 'bg-[#EAF3DE] text-[#3B6D11]'
                                : 'bg-[#FAEEDA] text-[#854F0B]'
                            }`}
                          >
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        <div className="mt-4">
                          <h3 className="text-[15px] font-medium text-gray-900">{studentName}</h3>
                          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-[13px] text-gray-600">
                            <IdCardIcon />
                            <span>{studentIdentifier}</span>
                          </div>
                        </div>

                        <div className="my-4 border-t border-gray-200" />

                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold"
                            style={{ backgroundColor: avatarStyle.background, color: avatarStyle.color }}
                          >
                            {studentInitials}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[14px] font-medium text-gray-900">{studentEmail}</p>
                            <p className="text-[12px] leading-[1.6] text-gray-500">Student email</p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="inline-flex items-center gap-2 rounded-full bg-[#F5F3FF] px-3 py-2 text-[13px] text-[#534AB7]">
                            <UsersIcon />
                            <span>Grade {studentGrade} • Age {studentAge}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              title="View"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleView(student);
                              }}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                            >
                              <EyeIcon />
                            </button>
                            <button
                              type="button"
                              title="Edit"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleEdit(student);
                              }}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                            >
                              <PencilIcon />
                            </button>
                            <button
                              type="button"
                              title="Delete"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDelete(student?.id ?? '');
                              }}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 text-[12px] leading-[1.6] text-gray-500">
                          Gender: <span className="text-gray-700">{studentGender}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-col gap-4 border-t border-gray-200 px-1 pt-4 md:flex-row md:items-center md:justify-between">
                  <div className="text-[14px] leading-[1.6] text-gray-700">
                    Showing <span className="font-medium">{startItem}</span> to{' '}
                    <span className="font-medium">{endItem}</span> of{' '}
                    <span className="font-medium">{filteredStudents.length}</span> results
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`inline-flex h-10 items-center gap-2 rounded-xl border border-gray-300 px-3 text-sm font-medium ${
                        currentPage === 1
                          ? 'cursor-not-allowed bg-gray-50 text-gray-400'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <ChevronLeftIcon />
                      <span>Prev</span>
                    </button>
                    {totalPages > 1 && (
                      visiblePages.map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-medium ${
                            currentPage === page
                              ? 'border-[#534AB7] bg-[#534AB7] text-white'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))
                    )}
                    {totalPages === 1 && (
                      <button className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#534AB7] bg-[#534AB7] px-3 text-sm font-medium text-white">
                        1
                      </button>
                    )}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className={`inline-flex h-10 items-center gap-2 rounded-xl border border-gray-300 px-3 text-sm font-medium ${
                        currentPage === totalPages || totalPages === 0
                          ? 'cursor-not-allowed bg-gray-50 text-gray-400'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>Next</span>
                      <ChevronRightIcon />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center text-gray-500">
                <p className="text-[15px] font-medium text-gray-900">No records found</p>
                <p className="mt-2 text-[14px] leading-[1.6] text-gray-500">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Start by adding your first record using the form above'}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
