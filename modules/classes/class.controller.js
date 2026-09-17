import { createClassServices } from './index.js';

export const createClass = async function createClass(req, res) {
    try {
        const newClass = await createClassServices(req.body);
        return {
            statusCode: 201,
            message: "Class created successfully",
            data: newClass
        }
    } catch (error) {
        res.code(400).send({
            message: error.message
        })
    }
}