/**
 * ClassForm Component
 * ---------------------------------------------------------------------------
 * Add/Edit form for a Class record.
 *
 * Edit mode is driven by the route: if a `:id` param is present, we call
 * `useClassDetails(id)` to fetch the class and feed it into `useClassForm`
 * as `initialData`. An explicitly-passed `initialData` prop still wins (so
 * this component can be reused outside routing, e.g. in a modal), but the
 * common case — navigating to `/classes/:id/edit` — resolves automatically.
 */

import { useParams } from 'react-router-dom';

import { GRADE_OPTIONS, SEMESTER_OPTIONS, SUBJECT_OPTIONS } from '../index.constant.js';
import type { Class, CreateClassData } from '../index.types.js';
import { useClassForm } from './index.hook';
// TODO: point this at wherever useClassDetails actually lives in your app.

import { StudentSelector } from './components/StudentSelector';
import { SubjectsSection } from './components/SubjectsSection';
import { TeacherSelector } from './components/TeacherSelector';
import { ScheduleSection } from './components/ScheduleSection';
import { StatusSection } from './components/StatusSection';
import { FormTips } from './components/FormTips';
import { FormFooter } from './components/FormFooter';
import { SuccessBanner } from './components/SuccessBanner.js';
import { BasicInfoFields } from './components/BasicInfoField.js';
import { useClasses, useClassesDetails } from '../index.hook.js';
import { FormLoadingState } from './components/FormLoadingState.js';

interface ClassFormProps {
  initialData?: Class;
  onSubmit: (data: CreateClassData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const ClassForm = ({ initialData: initialDataProp, onSubmit, onCancel, isLoading }: ClassFormProps) => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  // Only fetch when there's actually an id to edit. If your useClassDetails
  // hook doesn't support an `enabled` option, it's safe to drop it as long
  // as the hook itself no-ops on an empty id.
  const { data: classDetailsResponse, isLoading: isLoadingClassDetails } = useClassesDetails(id ?? '', { enabled: isEditMode });

  // Explicit prop wins (e.g. reused in a modal); otherwise fall back to
  // whatever the route resolved. API responses come back as { id, data }.
  const initialData = initialDataProp ?? classDetailsResponse;

  const {
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
  } = useClassForm({ initialData, onSubmit, isEditMode, classId: id });

  const isFormDisabled = Boolean(isLoading || formik.isSubmitting);

  // Don't render the form with empty values while the real class data is
  // still in flight — avoids a flash of blank fields that then pop-fill.
  if (isEditMode && isLoadingClassDetails) {
    return <FormLoadingState message="Loading class details..." />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">{isEditMode ? 'Edit Class' : 'Add Class'}</h3>
          <p className="text-sm text-gray-600 mt-1">Enter class information below</p>
        </div>

        <SuccessBanner visible={Boolean(formik.status?.showSuccess)} onDismiss={() => formik.setStatus({ ...formik.status, showSuccess: false })} />

        <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
          <div className="space-y-6">
            <BasicInfoFields
              formik={formik}
              isLoading={isLoading}
              gradeOptions={GRADE_OPTIONS}
              getFieldError={getFieldError}
              isFieldValid={isFieldValid}
              isFieldInvalid={isFieldInvalid}
            />

            <StudentSelector
              isDisabled={isFormDisabled}
              isLoadingStudents={isLoadingStudents}
              searchTerm={studentSearchTerm}
              onSearchTermChange={setStudentSearchTerm}
              isDropdownOpen={isStudentDropdownOpen}
              onDropdownOpenChange={setIsStudentDropdownOpen}
              dropdownRef={studentDropdownRef}
              filteredStudents={filteredStudents}
              selectedStudentIds={selectedStudentIds}
              selectedStudents={selectedStudents}
              onToggleStudent={handleStudentToggle}
              onRemoveStudent={handleRemoveStudent}
            />
          </div>

          <SubjectsSection
            subjectOptions={SUBJECT_OPTIONS}
            selectedSubjects={formik.values.subjects || []}
            onToggleSubject={handleSubjectToggle}
            errorMessage={getFieldError('subjects')}
            hasError={isFieldInvalid('subjects')}
          />

          <TeacherSelector
            isDisabled={isFormDisabled}
            isLoadingTeachers={isLoadingTeachers}
            searchTerm={teacherSearchTerm}
            onSearchTermChange={setTeacherSearchTerm}
            isDropdownOpen={isTeacherDropdownOpen}
            onDropdownOpenChange={setIsTeacherDropdownOpen}
            dropdownRef={teacherDropdownRef}
            filteredTeachers={filteredTeachers}
            selectedTeacherId={selectedTeacherId}
            onSelectTeacher={handleTeacherToggle}
            errorMessage={getFieldError('classHeadId')}
            hasError={isFieldInvalid('classHeadId')}
          />

          <ScheduleSection
            formik={formik}
            academicYearOptions={academicYearOptions}
            semesterOptions={SEMESTER_OPTIONS}
            getFieldError={getFieldError}
            isFieldInvalid={isFieldInvalid}
          />

          <StatusSection isActive={formik.values.isActive} onChange={(value) => formik.setFieldValue('isActive', value)} onBlur={formik.handleBlur} />

          <FormTips />
        </form>

        <FormFooter onCancel={onCancel} onSave={handleSaveClick} isSaving={Boolean(formik.isSubmitting)} isDisabled={isFormDisabled} />
      </div>
    </div>
  );
};

// Keeping both exports: named `ClassForm` for direct imports elsewhere in the
// app, and `default` for wherever this page is loaded via `React.lazy()` or
// a router that expects a default export (e.g. src/pages/classes/classForm).
export default ClassForm;
