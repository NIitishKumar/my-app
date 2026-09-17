import Teacher from './teacher.schema.js';

export const getTeachersRepository = async (filter = {}) => {
    try {
        return await Teacher.find(filter)
            .populate('user_id', 'name email role isActive')
            .sort({ created_at: -1 });
    } catch (error) {
        throw error;
    }
};

export const getTeacherDetailRepository = async (teacherId) => {
    try {
        return await Teacher.findById(teacherId)
            .populate('user_id', 'name email role isActive');
    } catch (error) {
        throw error;
    }
};

export const findTeacherByEmployeeIdRepository = async (employeeId) => {
    try {
        return await Teacher.findOne({ employee_id: employeeId });
    } catch (error) {
        throw error;
    }
};

export const createTeacherRepository = async (data, options = {}) => {
    try {
        const [teacher] = await Teacher.create([data], options);
        return teacher;
    } catch (error) {
        throw error;
    }
};

export const updateTeacherRepository = async (teacherId, updateData, options = {}) => {
    try {
        return await Teacher.findByIdAndUpdate(
            teacherId,
            updateData,
            { new: true, runValidators: true, ...options }
        );
    } catch (error) {
        throw error;
    }
};

export const deleteTeacherRepository = async (teacherId, options = {}) => {
    try {
        return await Teacher.deleteOne({ _id: teacherId }, options);
    } catch (error) {
        throw error;
    }
};
