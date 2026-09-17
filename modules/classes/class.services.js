import { Class, deleteClassRepository, getClassDetailRepository, getClassRepository } from './index.js'

const createClassServices = async (body) => {
    try {
        const newClass = await Class.create(body);
        return newClass
    } catch (error) {
        throw error
    }
}

const getAllClassesService = async (body) => {
    try {
        const classes = await getClassRepository();
        return classes || [];
    } catch (error) {
        throw error;
    }
}

const getAllClassDetailService = async (classId) => {
    try {
        const classes = await getClassDetailRepository(classId);
        return classes || [];
    } catch (error) {
        throw error;
    }
}

const deleteClassService = async (id) => {
    try {
        const classes = await deleteClassRepository(id);
        return classes || {};
    } catch (error) {
        throw error;
    }
}

export { createClassServices, getAllClassesService, deleteClassService, getAllClassDetailService }