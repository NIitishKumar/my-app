import { deleteClassController } from "./class.controller.js";
import { createClass, getAllClassesController, getAllClassDetailController } from "./index.js";

export default async function classRoutes(fastify, option) {
    fastify.post('/class', createClass);
    fastify.get('/class', getAllClassesController);
    fastify.get('/class/:id', getAllClassDetailController);
    fastify.delete('/class/:id', deleteClassController);
}