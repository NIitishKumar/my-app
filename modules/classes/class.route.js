import { createClass } from "./index.js";

export default async function classRoutes(fastify, option) {
    fastify.post('/class', createClass);
}