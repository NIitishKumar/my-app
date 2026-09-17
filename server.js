import Fastify from 'fastify'
import userRoutes from './modules/users/user.route.js'
import { connectToDatabase } from './config/db.js'
import cors from '@fastify/cors'
import classRoutes from './modules/classes/class.route.js'
import studnetRoutes from './modules/students/student.route.js'
import teacherRoutes from './modules/teachers/teacher.route.js'
const fastify = Fastify({
    logger: true
})

await fastify.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
});

connectToDatabase();

fastify.register(userRoutes);
fastify.register(classRoutes);
fastify.register(studnetRoutes);
fastify.register(teacherRoutes);

fastify.get('/', (req, res) => {
    return 'Server is running';
})

// Run the server!
fastify.listen({ port: 3000 }, (err, address) => {
    if (err) throw err
    console.log(`Server is now listening on ${address}`)
})
