import { useMutation, useQueryClient } from '@tanstack/react-query';
import { teachersApi } from '../api/teachers.api';
import { teachersQueryKeys } from '../constants/teachers.constants';

export const useRemoveClassFromTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teacherId, classId }: { teacherId: string; classId: string }) =>
      teachersApi.removeClass(teacherId, classId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teachersQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: teachersQueryKeys.detail(variables.teacherId) });
      queryClient.invalidateQueries({ 
        queryKey: [...teachersQueryKeys.detail(variables.teacherId), 'classes'] 
      });
    },
  });
};

