import { createStudentController, deleteStudentController, getStudentDetailsController, getStudentsController } from "./index.js";

export default async function studnetRoutes(fastify, options) {
    fastify.post('/student', createStudentController);
    fastify.get('/student', getStudentsController);
    fastify.get('/student/:id', getStudentDetailsController);
    fastify.delete('/student/:id', deleteStudentController);
};