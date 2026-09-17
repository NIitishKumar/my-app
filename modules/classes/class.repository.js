import Class from "./class.schema.js";

export const getClassRepository = async () => {
    try {
        return Class.find();
    } catch (error) {
        throw error;
    }
}

export const getClassDetailRepository = async (classId) => {
    try {
        return Class.find({ _id: classId });
    } catch (error) {
        throw error;
    }
}

export const deleteClassRepository = async (id) => {
    try {
        return Class.deleteOne({ _id: id })
    } catch (error) {
        throw error;
    }
}