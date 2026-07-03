/**
 * useClassForm
 * ---------------------------------------------------------------------------
 * Drives the ClassForm UI for both create and edit flows.
 *
 * Edit-mode notes (matters for how `initialData` is mapped below):
 * - The GET /classes/:id response returns a populated `classHead` object
 *   (firstName, lastName, email, employeeId) instead of a `classHeadId`.
 *   We resolve the real `classHeadId` once the teachers list has loaded by
 *   matching on `employeeId`.
 * - `students` on the response is an array of student ID strings, not full
 *   student objects. `selectedStudents` (used for the chips) is derived by
 *   cross-referencing those IDs against the fetched students list.
 * - `initialData` can arrive asynchronously (e.g. from a `useClassDetails`
 *   query that resolves after mount), so the formik instance uses
 *   `enableReinitialize: true` to re-populate once the real data lands.
 *
 * TODO: `fetchStudents` / `fetchTeachers` below use plain `fetch` against
 * placeholder endpoints. Swap their bodies for your existing service calls
 * (e.g. `studentService.getAll()`, `teacherService.getAll()`) if you already
 * have a service layer for these.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFormik, type FormikHelpers } from 'formik';
import * as Yup from 'yup';

import type { Class, CreateClassData } from '../index.types';
import type { StudentOption } from './components/StudentSelector';
import type { TeacherOption } from './components/TeacherSelector';
import { useStudents } from '../classDetails/index.hook';
import { useRemoveStudentFromClass } from '../useClassesQueries';

// ---------------------------------------------------------------------------
// Data fetching (replace with your real API layer)
// ---------------------------------------------------------------------------

const API_BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL ?? '';

const fetchStudents = async (): Promise<StudentOption[]> => {
  const response = await fetch(`${API_BASE_URL}/api/students`, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch students');
  const payload = await response.json();
  return payload?.data ?? payload ?? [];
};

const fetchTeachers = async (): Promise<TeacherOption[]> => {
  const response = await fetch(`${API_BASE_URL}/api/teachers`, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch teachers');
  const payload = await response.json();
  return payload?.data ?? payload ?? [];
};

// ---------------------------------------------------------------------------
// Static options / validation
// ---------------------------------------------------------------------------

const EMPTY_FORM_VALUES: CreateClassData = {
  className: '',
  grade: '',
  roomNo: '',
  capacity: 0,
  subjects: [],
  students: [],
  classHeadId: '',
  schedule: {
    academicYear: '',
    semester: '',
    startDate: '',
    endDate: '',
  },
  isActive: true,
};

const validationSchema = Yup.object({
  className: Yup.string().trim().required('Class name is required'),
  grade: Yup.string().required('Grade is required'),
  roomNo: Yup.string().trim().required('Room number is required'),
  capacity: Yup.number()
    .typeError('Capacity must be a number')
    .required('Capacity is required')
    .min(1, 'Capacity must be at least 1')
    .max(200, 'Capacity cannot exceed 200'),
  subjects: Yup.array().of(Yup.string()).min(1, 'Select at least one subject'),
  classHeadId: Yup.string().required('Class head is required'),
  students: Yup.array().of(Yup.string()),
  isActive: Yup.boolean().required(),
  schedule: Yup.object({
    academicYear: Yup.string().required('Academic year is required'),
    semester: Yup.string().required('Semester is required'),
    startDate: Yup.date().typeError('Invalid start date').required('Start date is required'),
    endDate: Yup.date()
      .typeError('Invalid end date')
      .required('End date is required')
      .min(Yup.ref('startDate'), 'End date must be on or after the start date'),
  }),
});

/** Builds a rolling window of "YYYY-YYYY" academic years around the current one. */
const buildAcademicYearOptions = (span = 3): string[] => {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let offset = -1; offset <= span; offset += 1) {
    const start = currentYear + offset;
    years.push(`${start}-${start + 1}`);
  }
  return years;
};

/** Reads a possibly-nested value ("schedule.academicYear") off an object. */
const getNestedValue = (source: unknown, path: string): unknown =>
  path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);

/** Maps an existing Class (edit mode) into the shape formik works with. */
const mapClassToFormValues = (classData?: Class): CreateClassData => {
  if (!classData) return EMPTY_FORM_VALUES;

  return {
    className: classData.className ?? '',
    grade: classData.grade ?? '',
    roomNo: classData.roomNo ?? '',
    capacity: classData.capacity ?? 0,
    subjects: classData.subjects ?? [],
    students: classData.students ?? [],
    // The detail endpoint returns a populated `classHead` object rather than
    // an id; if a real classHeadId/id is already present on it, use that.
    // Otherwise this stays blank until it's resolved against the teachers
    // list by employeeId (see the effect below).
    classHeadId: (classData as any)?.classHeadId ?? (classData as any)?.classHead?.id ?? '',
    schedule: {
      academicYear: classData.schedule?.academicYear ?? '',
      semester: classData.schedule?.semester ?? '',
      startDate: classData.schedule?.startDate ?? '',
      endDate: classData.schedule?.endDate ?? '',
    },
    isActive: classData.isActive ?? true,
  };
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

interface UseClassFormArgs {
  initialData?: Class;
  onSubmit: (data: CreateClassData) => void | Promise<void>;
  isEditMode: any;
}

export const useClassForm = ({ initialData, onSubmit, isEditMode }: UseClassFormArgs) => {
  // ---- Students / teachers data -------------------------------------------------
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);

  const { data: students = [] } = useStudents();

  useEffect(() => {
    let isMounted = true;
    setIsLoadingTeachers(true);
    fetchTeachers()
      .then((data) => isMounted && setTeachers(data))
      .catch((error) => console.error('Failed to load teachers', error))
      .finally(() => isMounted && setIsLoadingTeachers(false));
    return () => {
      isMounted = false;
    };
  }, []);

  // ---- Formik ---------------------------------------------------------------
  const formik = useFormik<CreateClassData>({
    initialValues: mapClassToFormValues(initialData),
    validationSchema,
    enableReinitialize: true, // repopulate once async `initialData` arrives
    onSubmit: async (values, helpers: FormikHelpers<CreateClassData>) => {
      try {
        await onSubmit(values);
        helpers.setStatus({ showSuccess: true });
      } catch (error) {
        console.error('Failed to save class', error);
        helpers.setStatus({ showSuccess: false });
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  // Resolve classHeadId by employeeId once teachers have loaded, for the case
  // where the detail response only gave us a populated `classHead` object.
  useEffect(() => {
    if (formik.values.classHeadId || teachers.length === 0) return;

    const classHead = (initialData as any)?.classHead;
    if (!classHead?.employeeId) return;

    const matchedTeacher = teachers.find((teacher) => teacher.employeeId === classHead.employeeId);
    if (matchedTeacher) {
      formik.setFieldValue('classHeadId', matchedTeacher.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teachers, initialData]);

  // ---- Academic year options --------------------------------------------------
  const academicYearOptions = useMemo(() => {
    const options = buildAcademicYearOptions();
    const currentValue = formik.values.schedule?.academicYear;
    if (currentValue && !options.includes(currentValue)) {
      return [...options, currentValue].sort();
    }
    return options;
  }, [formik.values.schedule?.academicYear]);

  // ---- Student search / select -------------------------------------------------
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false);
  const studentDropdownRef = useRef<HTMLDivElement>(null);

  const selectedStudentIds = formik.values.students ?? [];

  const selectedStudents = useMemo(() => students.filter((student) => selectedStudentIds.includes(student.id)), [students, selectedStudentIds]);

  // useEffect(()=> {

  // }, [filteredStudents])

  const filteredStudents = useMemo(() => {
    const term = studentSearchTerm.trim().toLowerCase();
    console.log({ students, term, initialData });
    if (!term) return students?.filter((student) => !initialData?.students?.includes(student.id));
    return students.filter(
      (student) =>
        `${student.firstName} ${student.lastName} ${student.email} ${student.studentId}`.toLowerCase().includes(term) &&
        !initialData?.students?.includes(student.id),
    );
  }, [students, studentSearchTerm]);

  const handleStudentToggle = useCallback(
    (studentId: string) => {
      const current = formik.values.students ?? [];
      const next = current.includes(studentId) ? current.filter((id) => id !== studentId) : [...current, studentId];
      formik.setFieldValue('students', next);
    },
    [formik],
  );

  const handleRemoveStudent = (studentId) => {
    console.log({ studentId });
    removeStudentMutation.mutate({
      classId: initialData?.id,
      studentId: studentId,
    });
  };

  const removeStudentMutation = useRemoveStudentFromClass();

  // ---- Teacher (class head) search / select ------------------------------------
  const [teacherSearchTerm, setTeacherSearchTerm] = useState('');
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false);
  const teacherDropdownRef = useRef<HTMLDivElement>(null);
  const hasSeededTeacherSearch = useRef(false);

  const selectedTeacherId = formik.values.classHeadId || null;

  const filteredTeachers = useMemo(() => {
    const term = teacherSearchTerm.trim().toLowerCase();
    if (!term) return teachers;
    return teachers.filter((teacher) =>
      `${teacher.firstName ?? ''} ${teacher.lastName ?? ''} ${teacher.email ?? ''} ${teacher.employeeId ?? ''}`.toLowerCase().includes(term),
    );
  }, [teachers, teacherSearchTerm]);

  // Once we know who the class head is (edit mode), show their name in the
  // search box instead of leaving it blank, without fighting user typing.
  useEffect(() => {
    if (hasSeededTeacherSearch.current || !selectedTeacherId || teachers.length === 0) return;
    const teacher = teachers.find((item) => item.id === selectedTeacherId);
    if (teacher) {
      setTeacherSearchTerm(`${teacher.firstName ?? ''} ${teacher.lastName ?? ''}`.trim());
      hasSeededTeacherSearch.current = true;
    }
  }, [selectedTeacherId, teachers]);

  const handleTeacherToggle = useCallback(
    (teacher: TeacherOption) => {
      formik.setFieldValue('classHeadId', teacher.id);
      setTeacherSearchTerm(`${teacher.firstName ?? ''} ${teacher.lastName ?? ''}`.trim());
      setIsTeacherDropdownOpen(false);
      hasSeededTeacherSearch.current = true;
    },
    [formik],
  );

  // ---- Subjects -----------------------------------------------------------------
  const handleSubjectToggle = useCallback(
    (subject: string) => {
      const current = formik.values.subjects ?? [];
      const next = current.includes(subject) ? current.filter((item) => item !== subject) : [...current, subject];
      formik.setFieldValue('subjects', next);
    },
    [formik],
  );

  // ---- Close dropdowns on outside click ------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (studentDropdownRef.current && !studentDropdownRef.current.contains(event.target as Node)) {
        setIsStudentDropdownOpen(false);
      }
      if (teacherDropdownRef.current && !teacherDropdownRef.current.contains(event.target as Node)) {
        setIsTeacherDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ---- Field validation helpers ---------------------------------------------------
  const getFieldError = useCallback(
    (field: string): string | undefined => {
      const touched = getNestedValue(formik.touched, field);
      const error = getNestedValue(formik.errors, field);
      return touched && error ? String(error) : undefined;
    },
    [formik.touched, formik.errors],
  );

  const isFieldInvalid = useCallback((field: string): boolean => Boolean(getFieldError(field)), [getFieldError]);

  const isFieldValid = useCallback(
    (field: string): boolean => {
      const touched = getNestedValue(formik.touched, field);
      const error = getNestedValue(formik.errors, field);
      const value = getNestedValue(formik.values, field);
      return Boolean(touched) && !error && value !== '' && value !== undefined && value !== null;
    },
    [formik.touched, formik.errors, formik.values],
  );

  // ---- Save button -----------------------------------------------------------------
  // Touches every top-level + schedule field on click so validation messages
  // appear immediately, then lets the <form onSubmit> (formik.handleSubmit)
  // run the actual validation + submit.
  const handleSaveClick = useCallback(() => {
    formik.setTouched(
      {
        className: true,
        grade: true,
        roomNo: true,
        capacity: true,
        subjects: true,
        classHeadId: true,
        students: true,
        isActive: true,
        schedule: {
          academicYear: true,
          semester: true,
          startDate: true,
          endDate: true,
        },
      },
      false,
    );
  }, [formik]);

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
