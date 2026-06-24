import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useClasses } from '../hooks/useClasses';
import { useCreateClass } from '../hooks/useCreateClass';
import { useUpdateClass } from '../hooks/useUpdateClass';
import { useDeleteClass } from '../hooks/useDeleteClass';
import { useClassDetails } from '../hooks/useClassDetails';
import { filterClasses, getTeacherInitials } from '../utils/classes.utils';
import { useUIStore } from '../../../../store/ui.store';

const ITEMS_PER_PAGE = 10;
const STATUS_TABS = ['all', 'active', 'inactive'];
const AVATAR_PALETTE = [
  { background: '#EEEDFE', color: '#534AB7' },
  { background: '#E1F5EE', color: '#1F6A47' },
  { background: '#E6F1FB', color: '#245A9F' },
  { background: '#FAECE7', color: '#9A512B' },
  { background: '#EAF3DE', color: '#4C6E16' },
  { background: '#FBEAF0', color: '#A33C65' },
];

const getClassInitials = (className = '') => {
  const words = String(className).trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return 'CL';
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0] ?? ''}${words[1][0] ?? ''}`.toUpperCase();
};

const getSafeText = (value, fallback = '') => value?.trim() || fallback;

const getTeacherName = (classItem) => {
  const firstName = getSafeText(classItem?.classHead?.firstName);
  const lastName = getSafeText(classItem?.classHead?.lastName);
  return `${firstName} ${lastName}`.trim() || 'Unassigned Teacher';
};

const getTeacherBadgeInitials = (classItem) => {
  const firstName = getSafeText(classItem?.classHead?.firstName);
  const lastName = getSafeText(classItem?.classHead?.lastName);
  const initials = getTeacherInitials(firstName, lastName);
  return initials || 'UT';
};

const getVisiblePages = (currentPage, totalPages) => {
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

const getClassCardViewModel = (classItem, index) => {
  const teacherName = getTeacherName(classItem);
  const teacherInitials = getTeacherBadgeInitials(classItem);
  const className = getSafeText(classItem?.className, 'Untitled Class');
  const classInitials = getClassInitials(className);
  const classSection = getSafeText(classItem?.section, 'N/A');
  const studentCount = classItem?.students?.length ?? 0;
  const isActive = Boolean(classItem?.isActive);
  const avatarStyle = AVATAR_PALETTE[index % AVATAR_PALETTE.length];

  return {
    teacherName,
    teacherInitials,
    className,
    classInitials,
    classSection,
    studentCount,
    isActive,
    avatarStyle,
  };
};

export const useClassesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationState = location.state || null;
  const [showForm, setShowForm] = useState(false);
  const [editingClassId, setEditingClassId] = useState(undefined);
  const [editingClass, setEditingClass] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: classesData, isLoading, error } = useClasses();
  const allClasses = useMemo(() => classesData ?? [], [classesData]);

  useEffect(() => {
    const editClassId = navigationState?.editClassId;
    if (editClassId) {
      const classToEdit = allClasses.find((item) => item.id === editClassId);
      if (classToEdit) {
        queueMicrotask(() => {
          setEditingClass(classToEdit);
          setEditingClassId(classToEdit.id);
          setShowForm(true);
        });
        window.history.replaceState({}, document.title);
      }
    }
  }, [navigationState, allClasses]);

  useEffect(() => {
    const shouldOpenForm = navigationState?.openForm;
    if (shouldOpenForm) {
      queueMicrotask(() => {
        setEditingClass(undefined);
        setEditingClassId(undefined);
        setShowForm(true);
      });
      window.history.replaceState({}, document.title);
    }
  }, [navigationState]);

  const {
    data: fetchedClassData,
    isLoading: isLoadingClassDetails,
    error: classDetailsError,
  } = useClassDetails(editingClassId || '');

  useEffect(() => {
    if (editingClassId) {
      if (fetchedClassData) {
        queueMicrotask(() => {
          setEditingClass(fetchedClassData);
        });
      } else if (classDetailsError && allClasses.length > 0) {
        const classFromTable = allClasses.find((item) => item.id === editingClassId);
        if (classFromTable) {
          queueMicrotask(() => {
            setEditingClass(classFromTable);
          });
        }
      }
    }
  }, [editingClassId, fetchedClassData, classDetailsError, allClasses]);

  const createClass = useCreateClass();
  const updateClass = useUpdateClass();
  const deleteClass = useDeleteClass();
  const addToast = useUIStore((state) => state.addToast);

  const filteredClasses = useMemo(() => {
    let filtered = allClasses || [];

    if (searchTerm?.trim()) {
      filtered = filterClasses(filtered, searchTerm);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((classItem) =>
        statusFilter === 'active' ? classItem.isActive : !classItem.isActive
      );
    }

    return filtered;
  }, [allClasses, searchTerm, statusFilter]);

  const paginatedClasses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredClasses.slice(startIndex, endIndex);
  }, [filteredClasses, currentPage]);

  const totalPages = Math.ceil(filteredClasses.length / ITEMS_PER_PAGE);
  const startItem = filteredClasses.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endItem = filteredClasses.length > 0 ? Math.min(currentPage * ITEMS_PER_PAGE, filteredClasses.length) : 0;
  const stats = useMemo(() => {
    const activeClasses = filteredClasses.filter((classItem) => Boolean(classItem?.isActive)).length;
    const totalStudents = filteredClasses.reduce((sum, classItem) => sum + (classItem?.enrolled ?? 0), 0);
    const assignedTeachers = new Set(filteredClasses.map((classItem) => getTeacherName(classItem))).size;

    return [
      { label: 'Total Classes', value: filteredClasses.length },
      { label: 'Active Classes', value: activeClasses },
      { label: 'Total Students', value: totalStudents },
      { label: 'Teachers Assigned', value: assignedTeachers },
    ];
  }, [filteredClasses]);
  const visiblePages = useMemo(() => getVisiblePages(currentPage, totalPages), [currentPage, totalPages]);
  const filteredClassesCount = filteredClasses.length;
  const isFormLoading =
    createClass.isPending || updateClass.isPending || (isLoadingClassDetails && Boolean(editingClassId));

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleSubmit = (data) => {
    console.log('handleSubmit called with data:', data);
    console.log('editingClassId:', editingClassId);
    console.log('editingClass:', editingClass);

    if (editingClassId || editingClass) {
      const classId = editingClass?.id || editingClassId;
      if (!classId) {
        console.error('Cannot update: missing class ID');
        alert('Error: Missing class ID. Please try again.');
        return;
      }

      console.log('Submitting update for class ID:', classId);
      console.log('Update data:', data);

      updateClass.mutate(
        { id: classId, ...data },
        {
          onSuccess: (result) => {
            console.log('Class updated successfully:', result);
            setShowForm(false);
            setEditingClass(undefined);
            setEditingClassId(undefined);
          },
          onError: (updateError) => {
            console.error('Error updating class:', updateError);
            alert(`Error updating class: ${updateError instanceof Error ? updateError.message : 'Unknown error'}`);
          },
        }
      );
    } else {
      console.log('Creating new class');
      createClass.mutate(data, {
        onSuccess: (result) => {
          console.log('Class created successfully:', result);
          addToast({
            type: 'success',
            message: 'Class created successfully!',
            duration: 3000,
          });
          setShowForm(false);
          setEditingClass(undefined);
          setEditingClassId(undefined);
        },
        onError: (createError) => {
          console.error('Error creating class:', createError);
          addToast({
            type: 'error',
            message: `Error creating class: ${createError instanceof Error ? createError.message : 'Unknown error'}`,
            duration: 5000,
          });
        },
      });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingClass(undefined);
    setEditingClassId(undefined);
  };

  const handleAddNew = () => {
    setEditingClass(undefined);
    setEditingClassId(undefined);
    setShowForm(true);
  };

  const handleEdit = (classItem) => {
    if (!classItem?.id) {
      return;
    }

    setEditingClass(classItem);
    setEditingClassId(classItem.id);
    setShowForm(true);
  };

  const handleView = (classItem) => {
    if (!classItem?.id) {
      return;
    }

    navigate(`/admin/classes/${classItem.id}`);
  };

  const handleDelete = (id) => {
    if (!id) {
      return;
    }

    if (confirm('Are you sure you want to delete this class?')) {
      deleteClass.mutate(id);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    error,
    showForm,
    editingClass,
    searchTerm,
    statusFilter,
    statusTabs: STATUS_TABS,
    isLoading,
    isLoadingClassDetails,
    isFormLoading,
    currentPage,
    paginatedClasses,
    stats,
    visiblePages,
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
  };
};
