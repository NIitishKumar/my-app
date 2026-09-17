import { createClassServices, deleteClassService, getAllClassDetailService, getAllClassesService } from './index.js';

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

export async function getAllClassesController(req, res) {
    try {
        const classes = await getAllClassesService();
        return {
            statusCode: 200,
            message: "Classes fetched successfully",
            data: classes
        }
    } catch (error) {
        res.code(400).send({
            message: error.message
        })
    }
}

export async function getAllClassDetailController(req, res) {
    try {
        const classDetails = await getAllClassDetailService(req.params.id);
        return {
            statusCode: 200,
            message: "Class details fetched successfully",
            data: classDetails
        }
    } catch (error) {
        res.code(400).send({
            message: error.message
        })
    }
}

export async function deleteClassController(req, res) {
    try {
        const classes = await deleteClassService(req.params.id);
        return {
            statusCode: 200,
            message: "Class deleted successfully",
            data: classes
        }
    } catch (error) {
        res.code(400).send({
            message: error.message
        })
    }
}