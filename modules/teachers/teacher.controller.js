import {
    createTeacherService,
    deleteTeacherService,
    getTeacherDetailsService,
    getTeachersService,
    updateTeacherService,
} from './index.js';

const createTeacher = async (req, res) => {
    try {
        const teacher = await createTeacherService(req.body);
        return {
            statusCode: 201,
            message: 'Teacher created successfully',
            data: teacher,
        };
    } catch (error) {
        res.code(error.status || 400).send({
            message: error.message,
        });
    }
};

const getTeachersController = async (req, res) => {
    try {
        const teachers = await getTeachersService();
        return {
            statusCode: 200,
            message: 'Teachers fetched successfully',
            data: teachers,
        };
    } catch (error) {
        res.code(error.status || 400).send({
            message: error.message,
        });
    }
};

const getTeacherDetailsController = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await getTeacherDetailsService(id);
        return {
            statusCode: 200,
            message: 'Teacher details fetched successfully',
            data: teacher,
        };
    } catch (error) {
        res.code(error.status || 400).send({
            message: error.message,
        });
    }
};

const updateTeacherController = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await updateTeacherService(id, req.body);
        return {
            statusCode: 200,
            message: 'Teacher updated successfully',
            data: teacher,
        };
    } catch (error) {
        res.code(error.status || 400).send({
            message: error.message,
        });
    }
};

const deleteTeacherController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteTeacherService(id);
        return {
            statusCode: 200,
            message: 'Teacher deleted successfully',
            data: result,
        };
    } catch (error) {
        res.code(error.status || 400).send({
            message: error.message,
        });
    }
};

export {
    createTeacher,
    createTeacher as createTeacherController,
    getTeachersController,
    getTeacherDetailsController,
    updateTeacherController,
    deleteTeacherController,
};
