import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import { classesApi } from './useClassesQueries';
import type { Class } from './index.types';

export const useClasses = () => {
  return useQuery({
    queryKey: ['classes'],
    queryFn: classesApi.getAll,
  });
};

export const useClassesDetails = (id, options = {}) => {
  return useQuery({
    queryKey: ['classes', id], // ✅ unique per class
    queryFn: () => classesApi.getById(id), // ✅ lazy, only called by React Query
    enabled: Boolean(id), // ✅ never fires with an empty id
    ...options,
  });
};

export const filterClasses = (classes: Class[], searchTerm: string): Class[] => {
  const term = searchTerm.toLowerCase();
  return classes.filter(
    (classItem) =>
      classItem.className.toLowerCase().includes(term) ||
      classItem.grade.includes(term) ||
      (classItem.section && classItem.section.toLowerCase().includes(term)) ||
      classItem.roomNo.toLowerCase().includes(term) ||
      `${classItem.classHead.firstName} ${classItem.classHead.lastName}`.toLowerCase().includes(term),
  );
};

export const useClassesPage = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  // const navigationState = location.state || null;
  const [showForm, setShowForm] = useState(false);
  const [editingClassId, setEditingClassId] = useState(undefined);
  const [editingClass, setEditingClass] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: classesData, isLoading, error } = useClasses();
  const allClasses = useMemo(() => classesData ?? [], [classesData]);

  const getTeacherInitials = (firstName: string, lastName: string): string => {
    const first = firstName.charAt(0).toUpperCase();
    const last = lastName.charAt(0).toUpperCase();
    return `${first}${last}`;
  };
  const getTeacherName = (classItem) => {
    const firstName = classItem?.classHead?.firstName;
    const lastName = classItem?.classHead?.lastName;
    return `${firstName} ${lastName}`.trim() || 'Unassigned Teacher';
  };
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
  const getClassCardViewModel = (classItem, index) => {
    const teacherName = getTeacherName(classItem);
    const teacherInitials = getTeacherInitials(classItem?.classHead?.firstName, classItem?.classHead?.lastName);
    const className = classItem?.className;
    const classInitials = getClassInitials(className);
    const classSection = classItem?.section;
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

  const filteredClasses = useMemo(() => {
    let filtered = allClasses || [];

    if (searchTerm?.trim()) {
      filtered = filterClasses(filtered, searchTerm);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((classItem) => (statusFilter === 'active' ? classItem.isActive : !classItem.isActive));
    }

    return filtered;
  }, [allClasses, searchTerm, statusFilter]);
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
    //   const assignedTeachers = new Set(filteredClasses.map((classItem) => getTeacherName(classItem))).size;

    return [
      { label: 'Total Classes', value: filteredClasses.length },
      { label: 'Active Classes', value: activeClasses },
      { label: 'Total Students', value: totalStudents },
      // { label: 'Teachers Assigned', value: assignedTeachers },
    ];
  }, [filteredClasses]);
  // const visiblePages = useMemo(() => getVisiblePages(currentPage, totalPages), [currentPage, totalPages]);
  const filteredClassesCount = filteredClasses.length;
  // const isFormLoading =
  //   createClass.isPending || updateClass.isPending || (isLoadingClassDetails && Boolean(editingClassId));

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleSubmit = (data) => {};

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
      // deleteClass.mutate(id);
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
    //   isLoadingClassDetails,
    //   isFormLoading,
    currentPage,
    paginatedClasses,
    stats,
    //   visiblePages,
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
