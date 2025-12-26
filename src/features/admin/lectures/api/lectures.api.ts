/**
 * Lectures API Service
 */

import { httpClient } from '../../../../services/http/httpClient';
import { lecturesEndpoints } from './lectures.endpoints';
import { lectureDTOToLecture, lectureToCreateLectureDTO } from '../utils/lectures.utils';
import type { Lecture, CreateLectureData, UpdateLectureData, LectureDTO, CreateLectureDTO } from '../types/lectures.types';

export const lecturesApi = {
  getAll: async (): Promise<Lecture[]> => {
    const response = await httpClient.get<LectureDTO[]>(lecturesEndpoints.list());
    return response.map(lectureDTOToLecture);
  },

  getById: async (id: string): Promise<Lecture> => {
    const response = await httpClient.get<LectureDTO>(lecturesEndpoints.detail(id));
    return lectureDTOToLecture(response);
  },

  create: async (data: CreateLectureData): Promise<Lecture> => {
    const dto = lectureToCreateLectureDTO(data);
    const response = await httpClient.post<LectureDTO>(lecturesEndpoints.create(), dto);
    return lectureDTOToLecture(response);
  },

  update: async (data: UpdateLectureData): Promise<Lecture> => {
    const { id, ...updateData } = data;
    const dto = lectureToCreateLectureDTO(updateData as CreateLectureData);
    const response = await httpClient.put<LectureDTO>(lecturesEndpoints.update(id), dto);
    return lectureDTOToLecture(response);
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(lecturesEndpoints.delete(id));
  },
};

