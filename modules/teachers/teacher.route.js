import {
    createTeacherController,
    deleteTeacherController,
    getTeacherDetailsController,
    getTeachersController,
    updateTeacherController,
} from './index.js';

export default async function teacherRoutes(fastify, options) {
    fastify.post('/teacher', createTeacherController);
    fastify.get('/teacher', getTeachersController);
    fastify.get('/teacher/:id', getTeacherDetailsController);
    fastify.put('/teacher/:id', updateTeacherController);
    fastify.patch('/teacher/:id', updateTeacherController);
    fastify.delete('/teacher/:id', deleteTeacherController);
}
