import Attendance from './attendance.schema.js';

export const findAttendanceByClassAndDate = async (classId, date) => {
    try {
        return await Attendance.findOne({ class_id: classId, date })
            .populate('class_id', 'name section room_number')
            .populate('marked_by', 'full_name employee_id')
            .populate('records.student_id', 'full_name admission_number');
    } catch (error) {
        throw error;
    }
};

export const createAttendanceRepository = async (data, options = {}) => {
    try {
        const attendance = Array.isArray(data)
            ? await Attendance.create(data, options)
            : await Attendance.create([data], options);
        return Array.isArray(data) ? attendance : attendance[0];
    } catch (error) {
        throw error;
    }
};

export const updateAttendanceRepository = async (classId, date, updateData, options = {}) => {
    try {
        return await Attendance.findOneAndUpdate(
            { class_id: classId, date },
            updateData,
            { upsert: true, new: true, setDefaultsOnInsert: true, ...options }
        )
            .populate('class_id', 'name section room_number')
            .populate('marked_by', 'full_name employee_id')
            .populate('records.student_id', 'full_name admission_number');
    } catch (error) {
        throw error;
    }
};

export const findStudentAttendanceRecords = async (studentId, fromDate, toDate) => {
    try {
        return await Attendance.find({
            date: { $gte: fromDate, $lte: toDate },
            'records.student_id': studentId,
        }).sort({ date: 1 });
    } catch (error) {
        throw error;
    }
};

export const getAttendanceListRepository = async (filter = {}) => {
    try {
        return await Attendance.find(filter)
            .populate('class_id', 'name section room_number')
            .populate('marked_by', 'full_name employee_id')
            .sort({ date: -1 });
    } catch (error) {
        throw error;
    }
};

export const getAttendanceDetailRepository = async (attendanceId) => {
    try {
        return await Attendance.findById(attendanceId)
            .populate('class_id', 'name section room_number')
            .populate('marked_by', 'full_name employee_id')
            .populate('records.student_id', 'full_name admission_number');
    } catch (error) {
        throw error;
    }
};

export const deleteAttendanceRepository = async (attendanceId) => {
    try {
        return await Attendance.deleteOne({ _id: attendanceId });
    } catch (error) {
        throw error;
    }
};
