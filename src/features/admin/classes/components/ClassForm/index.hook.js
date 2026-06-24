import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { getAcademicYearOptions } from '../../constants/classes.constants';
import { validateClassForm, getDefaultClassFormData } from '../../utils/classes.utils';
import { useStudents } from '../../../students/hooks/useStudents';
import { useTeachers } from '../../../teachers';

const normalizeTeacherList = (allTeachers) => {
  if (Array.isArray(allTeachers)) {
    return allTeachers;
  }

  if (Array.isArray(allTeachers?.teachers)) {
    return allTeachers.teachers;
  }

  return [];
};

export const useClassForm = ({ initialData, onSubmit }) => {
  const { data: allStudents, isLoading: isLoadingStudents } = useStudents();
  const { data: allTeachers, isLoading: isLoadingTeachers } = useTeachers();
  const students = useMemo(() => allStudents || [], [allStudents]);
  const teacherList = useMemo(() => normalizeTeacherList(allTeachers), [allTeachers]);

  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false);
  const studentDropdownRef = useRef(null);

  const [teacherSearchTerm, setTeacherSearchTerm] = useState('');
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false);
  const teacherDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (studentDropdownRef.current && !studentDropdownRef.current.contains(event.target)) {
        setIsStudentDropdownOpen(false);
      }
    };

    if (isStudentDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isStudentDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (teacherDropdownRef.current && !teacherDropdownRef.current.contains(event.target)) {
        setIsTeacherDropdownOpen(false);
      }
    };

    if (isTeacherDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTeacherDropdownOpen]);

  const initialClassHeadId = useMemo(() => {
    if (!initialData?.classHead || teacherList.length === 0) {
      return '';
    }

    const matchedTeacher = teacherList.find(
      (teacher) => teacher.employeeId === initialData.classHead.employeeId
    );

    return matchedTeacher?.id || '';
  }, [initialData, teacherList]);

  const initialValues = useMemo(() => {
    if (initialData) {
      return {
        className: initialData.className,
        subjects: initialData.subjects,
        grade: initialData.grade,
        roomNo: initialData.roomNo,
        capacity: initialData.capacity,
        enrolled: initialData.enrolled,
        students: initialData.students,
        classHeadId: initialClassHeadId,
        schedule: {
          academicYear: initialData.schedule.academicYear,
          semester: initialData.schedule.semester,
          startDate: initialData.schedule.startDate,
          endDate: initialData.schedule.endDate,
        },
        isActive: initialData.isActive,
      };
    }

    return getDefaultClassFormData();
  }, [initialData, initialClassHeadId]);

  useEffect(() => {
    if (!initialData?.classHead || !initialClassHeadId) {
      return;
    }

    const matchedTeacher = teacherList.find((teacher) => teacher.id === initialClassHeadId);
    if (matchedTeacher) {
      setTeacherSearchTerm(`${matchedTeacher.firstName} ${matchedTeacher.lastName}`.trim());
    }
  }, [initialData, initialClassHeadId, teacherList]);

  const formik = useFormik({
    initialValues,
    validate: (values) => {
      const errors = validateClassForm({ ...values, classHead: values.classHeadId });
      const formikErrors = {};

      Object.keys(errors).forEach((key) => {
        const error = errors[key];
        if (typeof error === 'string') {
          formikErrors[key] = error;
        } else if (error && typeof error === 'object') {
          const nestedErrors = error;
          const hasNestedErrors = Object.keys(nestedErrors).some(
            (nestedKey) => nestedErrors[nestedKey] !== undefined && nestedErrors[nestedKey] !== ''
          );
          if (hasNestedErrors) {
            formikErrors[key] = nestedErrors;
          }
        }
      });

      return formikErrors;
    },
    validateOnChange: false,
    validateOnBlur: false,
    validateOnMount: false,
    onSubmit: (values, { setSubmitting }) => {
      try {
        const { classHeadId, ...rest } = values;
        onSubmit({
          ...rest,
          classHead: classHeadId,
        });
        formik.setStatus({ showSuccess: true });
        setTimeout(() => {
          formik.setStatus({ showSuccess: false });
        }, 3000);
      } catch (error) {
        console.error('Error in onSubmit callback:', error);
      } finally {
        setSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

  const getFieldError = (field) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const parentError = formik.errors[parent];
      if (parentError && typeof parentError === 'object') {
        return parentError?.[child];
      }
      return undefined;
    }
    return formik.errors[field];
  };

  const isFieldTouched = (field) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const parentTouched = formik.touched[parent];
      if (parentTouched && typeof parentTouched === 'object') {
        return parentTouched?.[child] || false;
      }
      return false;
    }
    return formik.touched[field] || false;
  };

  const isFieldValid = (field) => {
    const error = getFieldError(field);
    return isFieldTouched(field) && !error;
  };

  const isFieldInvalid = (field) => {
    const error = getFieldError(field);
    return isFieldTouched(field) && !!error;
  };

  const academicYearOptions = useMemo(() => getAcademicYearOptions(), []);

  const selectedStudentIds = useMemo(() => formik.values.students || [], [formik.values.students]);
  const selectedStudents = useMemo(() => {
    return students.filter((student) => selectedStudentIds.includes(student.id));
  }, [students, selectedStudentIds]);

  const filteredStudents = useMemo(() => {
    if (!studentSearchTerm.trim()) {
      return students;
    }
    const searchLower = studentSearchTerm.toLowerCase();
    return students.filter(
      (student) =>
        student.firstName.toLowerCase().includes(searchLower) ||
        student.lastName.toLowerCase().includes(searchLower) ||
        student.email.toLowerCase().includes(searchLower) ||
        student.studentId.toLowerCase().includes(searchLower)
    );
  }, [students, studentSearchTerm]);

  const filteredTeachers = useMemo(() => {
    const searchLower = teacherSearchTerm?.toLowerCase()?.trim() || '';

    if (!searchLower) {
      return teacherList;
    }

    return teacherList.filter((teacher) => {
      const firstName = teacher?.firstName?.toLowerCase?.() || '';
      const lastName = teacher?.lastName?.toLowerCase?.() || '';
      const email = teacher?.email?.toLowerCase?.() || '';
      const employeeId = teacher?.employeeId?.toLowerCase?.() || '';

      return (
        firstName.includes(searchLower) ||
        lastName.includes(searchLower) ||
        email.includes(searchLower) ||
        employeeId.includes(searchLower)
      );
    });
  }, [teacherList, teacherSearchTerm]);

  const selectedTeacherId = formik.values?.classHeadId;

  const handleTeacherToggle = useCallback(
    (teacher) => {
      if (!teacher) return;

      formik.setFieldValue('classHeadId', teacher.id);
      formik.setFieldTouched('classHeadId', true);
      setTeacherSearchTerm(`${teacher?.firstName ?? ''} ${teacher?.lastName ?? ''}`.trim());
      setIsTeacherDropdownOpen(false);
    },
    [formik]
  );

  const handleStudentToggle = useCallback(
    (studentId) => {
      const currentIds = formik.values.students || [];
      const newIds = currentIds.includes(studentId)
        ? currentIds.filter((id) => id !== studentId)
        : [...currentIds, studentId];
      formik.setFieldValue('students', newIds);
    },
    [formik]
  );

  const handleRemoveStudent = useCallback(
    (studentId) => {
      const currentIds = formik.values.students || [];
      formik.setFieldValue(
        'students',
        currentIds.filter((id) => id !== studentId)
      );
    },
    [formik]
  );

  const handleSubjectToggle = (subject) => {
    const currentSubjects = formik.values.subjects || [];
    const newSubjects = currentSubjects.includes(subject)
      ? currentSubjects.filter((s) => s !== subject)
      : [...currentSubjects, subject];
    formik.setFieldValue('subjects', newSubjects);
    formik.setFieldTouched('subjects', true);
  };

  const handleSaveClick = (event) => {
    event.preventDefault();
    formik.setFieldTouched('classHeadId', true);
    formik.validateForm().then(() => {
      formik.submitForm();
    });
  };

  return {
    formik,
    isLoadingStudents,
    isLoadingTeachers,
    studentSearchTerm,
    setStudentSearchTerm,
    isStudentDropdownOpen,
    setIsStudentDropdownOpen,
    studentDropdownRef,
    teacherSearchTerm,
    setTeacherSearchTerm,
    isTeacherDropdownOpen,
    setIsTeacherDropdownOpen,
    teacherDropdownRef,
    getFieldError,
    isFieldValid,
    isFieldInvalid,
    academicYearOptions,
    selectedStudentIds,
    selectedStudents,
    filteredStudents,
    filteredTeachers,
    selectedTeacherId,
    handleTeacherToggle,
    handleStudentToggle,
    handleRemoveStudent,
    handleSubjectToggle,
    handleSaveClick,
  };
};
