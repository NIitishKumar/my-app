import { createUserControler, loginUser } from "./index.js";

export default async function userRoutes(fastify, options) {
    fastify.post('/user', createUserControler);
    fastify.post('/login', loginUser);
}