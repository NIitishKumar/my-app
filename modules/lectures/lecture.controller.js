import {
    createLectureService,
    deleteLectureService,
    getLectureDetailsService,
    getLecturesService,
    updateLectureService,
} from './index.js';

const createLecture = async (req, res) => {
    try {
        const lecture = await createLectureService(req.body);
        return {
            statusCode: 201,
            message: 'Lecture created successfully',
            data: lecture,
        };
    } catch (error) {
        res.code(error.status || 400).send({
            message: error.message,
        });
    }
};

const getLecturesController = async (req, res) => {
    try {
        const lectures = await getLecturesService(req.query || {});
        return {
            statusCode: 200,
            message: 'Lectures fetched successfully',
            data: lectures,
        };
    } catch (error) {
        res.code(error.status || 400).send({
            message: error.message,
        });
    }
};

const getLectureDetailsController = async (req, res) => {
    try {
        const { id } = req.params;
        const lecture = await getLectureDetailsService(id);
        return {
            statusCode: 200,
            message: 'Lecture details fetched successfully',
            data: lecture,
        };
    } catch (error) {
        res.code(error.status || 400).send({
            message: error.message,
        });
    }
};

const updateLectureController = async (req, res) => {
    try {
        const { id } = req.params;
        const lecture = await updateLectureService(id, req.body);
        return {
            statusCode: 200,
            message: 'Lecture updated successfully',
            data: lecture,
        };
    } catch (error) {
        res.code(error.status || 400).send({
            message: error.message,
        });
    }
};

const deleteLectureController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteLectureService(id);
        return {
            statusCode: 200,
            message: 'Lecture deleted successfully',
            data: result,
        };
    } catch (error) {
        res.code(error.status || 400).send({
            message: error.message,
        });
    }
};

export {
    createLecture,
    createLecture as createLectureController,
    getLecturesController,
    getLectureDetailsController,
    updateLectureController,
    deleteLectureController,
};
