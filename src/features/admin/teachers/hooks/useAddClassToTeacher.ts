import { useMutation, useQueryClient } from '@tanstack/react-query';
import { teachersApi } from '../api/teachers.api';
import { teachersQueryKeys } from '../constants/teachers.constants';

export const useAddClassToTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teacherId, classId }: { teacherId: string; classId: string }) =>
      teachersApi.addClass(teacherId, classId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teachersQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: teachersQueryKeys.detail(variables.teacherId) });
      queryClient.invalidateQueries({ 
        queryKey: [...teachersQueryKeys.detail(variables.teacherId), 'classes'] 
      });
    },
  });
};

