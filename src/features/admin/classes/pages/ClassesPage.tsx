/**
 * ClassesPage Component
 */

import { ClassForm } from '../components/ClassForm';
import { useClassesPage } from './index.hook.js';

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
  </svg>
);

const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
    <rect x="4" y="4" width="6" height="6" rx="1.2" />
    <rect x="14" y="4" width="6" height="6" rx="1.2" />
    <rect x="4" y="14" width="6" height="6" rx="1.2" />
    <rect x="14" y="14" width="6" height="6" rx="1.2" />
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

export const ClassesPage = () => {
  const {
    error,
    showForm,
    editingClass,
    searchTerm,
    statusFilter,
    statusTabs,
    isLoading,
    isLoadingClassDetails,
    isFormLoading,
    paginatedClasses,
    stats,
    visiblePages,
    currentPage,
    totalPages,
    startItem,
    endItem,
    filteredClassesCount,
    handleSearchChange,
    handleStatusFilterChange,
    handleSubmit,
    handleCancel,
    handleAddNew,
    handleEdit,
    handleView,
    handleDelete,
    handlePageChange,
    getClassCardViewModel,
  } = useClassesPage();

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center">Loading classes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center text-red-600">Error loading classes: {error instanceof Error ? error.message : 'Unknown error'}</div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] p-4 lg:p-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-medium text-gray-900 lg:text-3xl">All Classes</h1>
        <p className="text-[14px] leading-[1.6] text-gray-600">Manage class records</p>
      </div>

      {showForm ? (
        <div className="mb-6">
          {isLoadingClassDetails && !editingClass ? (
            <div className="text-center py-8">Loading class details...</div>
          ) : (
            <ClassForm
              initialData={editingClass}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isFormLoading}
            />
          )}
        </div>
      ) : (
        <>
          {/* Search and Filter Bar */}
          <div className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search by class name or section..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="block h-11 w-full rounded-2xl border border-gray-200 bg-white pl-11 pr-4 text-[14px] leading-[1.6] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#534AB7]"
              />
            </div>
            <div className="inline-flex w-full flex-wrap items-center gap-2 rounded-2xl bg-white p-1 xl:w-auto">
              {statusTabs.map((tab) => {
                const isActiveTab = statusFilter === tab;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => handleStatusFilterChange(tab)}
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
              + Add Class
            </button>
          </div>

          {/* Stats */}
          <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <div key={item.label} className="rounded-2xl bg-[#F3F4F6] px-4 py-4">
                <p className="text-[12px] text-gray-500">{item.label}</p>
                <p className="mt-2 text-[22px] font-semibold leading-none text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Cards */}
          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm lg:p-5">
            {paginatedClasses && paginatedClasses.length > 0 ? (
              <>
                <div
                  className="grid gap-4"
                  style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
                >
                  {paginatedClasses.map((classItem, index) => {
                    const {
                      teacherName,
                      teacherInitials,
                      className,
                      classInitials,
                      classSection,
                      studentCount,
                      isActive,
                      avatarStyle,
                    } = getClassCardViewModel(classItem, index);

                    return (
                      <div
                        key={classItem?.id ?? `class-card-${index}`}
                        onClick={() => handleView(classItem)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            handleView(classItem);
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
                            {classInitials}
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
                          <h3 className="text-[15px] font-medium text-gray-900">{className}</h3>
                          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-[13px] text-gray-600">
                            <GridIcon />
                            <span>Section {classSection}</span>
                          </div>
                        </div>

                        <div className="my-4 border-t border-gray-200" />

                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold"
                            style={{ backgroundColor: avatarStyle.background, color: avatarStyle.color }}
                          >
                            {teacherInitials}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[14px] font-medium text-gray-900">{teacherName}</p>
                            <p className="text-[12px] leading-[1.6] text-gray-500">Class teacher</p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="inline-flex items-center gap-2 rounded-full bg-[#F5F3FF] px-3 py-2 text-[13px] text-[#534AB7]">
                            <UsersIcon />
                            <span>{studentCount} students</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              title="View"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleView(classItem);
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
                                handleEdit(classItem);
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
                                handleDelete(classItem?.id ?? '');
                              }}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                <div className="mt-6 flex flex-col gap-4 border-t border-gray-200 px-1 pt-4 md:flex-row md:items-center md:justify-between">
                  <div className="text-[14px] leading-[1.6] text-gray-700">
                    Showing <span className="font-medium">{startItem}</span> to{' '}
                    <span className="font-medium">{endItem}</span> of{' '}
                    <span className="font-medium">{filteredClassesCount}</span> results
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`inline-flex h-10 items-center gap-2 rounded-xl border border-gray-300 px-3 text-sm font-medium ${
                        currentPage === 1
                          ? 'text-gray-400 cursor-not-allowed bg-gray-50'
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
                          ? 'text-gray-400 cursor-not-allowed bg-gray-50'
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
