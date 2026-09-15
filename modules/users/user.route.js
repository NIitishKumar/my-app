import { createUser } from './user.controller.js';

export default async function userRoutes(fastify, options) {
    fastify.post('/user', createUser);
}