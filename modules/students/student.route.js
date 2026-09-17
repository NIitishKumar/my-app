import { createStudentController } from "./index.js";

export default async function studnetRoutes(fastify, options) {
    fastify.post('/student', createStudentController)
}