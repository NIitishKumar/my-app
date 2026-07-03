import { httpClient } from '../../services/http/httpClient';
import { classesEndpoints } from './api/classes.endpoints';
import type { Class, ClassApiDTO, ClassApiResponse, ClassesApiResponse } from './index.types';

const mapClassApiToDomain = (api: ClassApiDTO): Class => ({
  id: api._id,
  className: api.className,
  subjects: api.subjects ?? [],
  grade: api.grade,
  roomNo: api.roomNo,
  capacity: api.capacity,
  enrolled: api.enrolled,

  students: api.students?.map(({ _id }) => _id) ?? [],

  classHead: {
    id: api?.classHead?._id,
    firstName: '',
    lastName: '',
    email: '',
    employeeId: '',
  },

  lectures: api.lectures?.map(({ _id }) => _id) ?? [],

  schedule: {
    academicYear: api?.schedule?.academicYear,
    startDate: new Date(),
    endDate: new Date(),
  },

  isActive: api.isActive,

  createdAt: new Date(api.createdAt),
  updatedAt: new Date(api.updatedAt),
});

const getClassesData = (response: ClassesApiResponse | ClassApiDTO[]): ClassApiDTO[] => {
  if (Array.isArray(response)) {
    return response;
  }

  return Array.isArray(response.data) ? response.data : [];
};

export const classesApi = {
  async getAll(): Promise<Class[]> {
    const response = await httpClient.get<ClassesApiResponse | ClassApiDTO[]>(classesEndpoints.list());

    return getClassesData(response).map(mapClassApiToDomain);
  },
  getById: async (id: string): Promise<Class> => {
    try {
      const response = await httpClient.get<ClassApiResponse>(classesEndpoints.detail(id));

      if (!response || !response.data) {
        throw new Error('Invalid API response: missing data');
      }

      return mapClassApiToDomain(response.data);
    } catch (error) {
      console.error('Error fetching class by ID:', error);
      throw error;
    }
  },

  removeStudent: async (classId: string, studentId: string): Promise<Class> => {
    try {
      const response = await httpClient.patch<ClassApiResponse>(classesEndpoints.removeStudent(classId), {
        studentId,
      });

      return mapClassApiToDomain(response.data);
    } catch (error) {
      console.error('Error removing student from class:', error);
      throw error;
    }
  },
};

import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useRemoveStudentFromClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, studentId }: { classId: string; studentId: string }) => classesApi.removeStudent(classId, studentId),

    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({
        queryKey: ['classes'],
      });

      queryClient.invalidateQueries({
        queryKey: ['classes', classId],
      });
    },
  });
};
