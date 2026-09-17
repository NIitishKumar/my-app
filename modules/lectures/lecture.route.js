import {
    createLectureController,
    deleteLectureController,
    getLectureDetailsController,
    getLecturesController,
    updateLectureController,
} from './index.js';

export default async function lectureRoutes(fastify, options) {
    fastify.post('/lecture', createLectureController);
    fastify.get('/lecture', getLecturesController);
    fastify.get('/lecture/:id', getLectureDetailsController);
    fastify.put('/lecture/:id', updateLectureController);
    fastify.patch('/lecture/:id', updateLectureController);
    fastify.delete('/lecture/:id', deleteLectureController);
}
