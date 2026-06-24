import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLectures } from '../hooks/useLectures';
import { useCreateLecture } from '../hooks/useCreateLecture';
import { useUpdateLecture } from '../hooks/useUpdateLecture';
import { useDeleteLecture } from '../hooks/useDeleteLecture';
import { useClasses } from '../../classes/hooks/useClasses';
import { filterClasses } from '../../classes/utils/classes.utils';
import { filterLectures } from '../utils/lectures.utils';

export const useLecturesPage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('classes');
  const [selectedClass, setSelectedClass] = useState(undefined);
  const [editingLecture, setEditingLecture] = useState(undefined);
  const [classSearchTerm, setClassSearchTerm] = useState('');
  const [lectureSearchTerm, setLectureSearchTerm] = useState('');

  const { data: lectures, isLoading: isLoadingLectures, error: lecturesError } = useLectures();
  const { data: classesData, isLoading: isLoadingClasses, error: classesError } = useClasses();

  const allLectures = useMemo(() => lectures ?? [], [lectures]);
  const allClasses = useMemo(() => classesData ?? [], [classesData]);

  const createLecture = useCreateLecture();
  const updateLecture = useUpdateLecture();
  const deleteLecture = useDeleteLecture();

  const filteredClasses = useMemo(() => {
    if (!classSearchTerm.trim()) {
      return allClasses;
    }
    return filterClasses(allClasses, classSearchTerm);
  }, [allClasses, classSearchTerm]);

  const classLectures = useMemo(() => {
    if (!selectedClass) {
      return [];
    }

    let lecturesForClass = allLectures.filter((lecture) => lecture.classId === selectedClass.id);

    if (lectureSearchTerm.trim()) {
      lecturesForClass = filterLectures(lecturesForClass, lectureSearchTerm);
    }

    return lecturesForClass;
  }, [allLectures, selectedClass, lectureSearchTerm]);

  const getLectureCountForClass = (classId) =>
    allLectures.filter((lecture) => lecture.classId === classId).length;

  const isFormLoading = createLecture.isPending || updateLecture.isPending;
  const isLoading = isLoadingLectures || isLoadingClasses;
  const error = lecturesError || classesError;

  const handleSelectClass = (classItem) => {
    setSelectedClass(classItem);
    setLectureSearchTerm('');
    setView('class-lectures');
  };

  const handleBackToClasses = () => {
    setView('classes');
    setSelectedClass(undefined);
    setEditingLecture(undefined);
    setLectureSearchTerm('');
  };

  const handleAddLecture = () => {
    setEditingLecture(undefined);
    setView('form');
  };

  const handleEditLecture = (lecture) => {
    setEditingLecture(lecture);
    setView('form');
  };

  const handleCancelForm = () => {
    setEditingLecture(undefined);
    setView('class-lectures');
  };

  const handleSubmit = (data) => {
    const payload = {
      ...data,
      classId: selectedClass?.id || data.classId,
    };

    if (editingLecture) {
      updateLecture.mutate(
        { id: editingLecture.id, ...payload },
        {
          onSuccess: () => {
            setEditingLecture(undefined);
            setView('class-lectures');
          },
        }
      );
    } else {
      createLecture.mutate(payload, {
        onSuccess: () => {
          setView('class-lectures');
        },
      });
    }
  };

  const handleView = (lecture) => {
    navigate(`/admin/lectures/${lecture.id}`);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this lecture?')) {
      deleteLecture.mutate(id);
    }
  };

  return {
    view,
    selectedClass,
    editingLecture,
    classSearchTerm,
    lectureSearchTerm,
    filteredClasses,
    classLectures,
    allClassesCount: allClasses.length,
    isLoading,
    isFormLoading,
    error,
    setClassSearchTerm,
    setLectureSearchTerm,
    getLectureCountForClass,
    handleSelectClass,
    handleBackToClasses,
    handleAddLecture,
    handleEditLecture,
    handleCancelForm,
    handleSubmit,
    handleView,
    handleDelete,
  };
};
