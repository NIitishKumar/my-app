import Lecture from './lecture.schema.js';

export const getLecturesRepository = async (filter = {}) => {
    try {
        return await Lecture.find(filter)
            .populate('class_id', 'name section room_number')
            .populate('teacher_id', 'full_name employee_id subjects qualification phone')
            .sort({ day_of_week: 1, start_time: 1 });
    } catch (error) {
        throw error;
    }
};

export const getLectureDetailRepository = async (lectureId) => {
    try {
        return await Lecture.findById(lectureId)
            .populate('class_id', 'name section room_number')
            .populate('teacher_id', 'full_name employee_id subjects qualification phone');
    } catch (error) {
        throw error;
    }
};

export const findConflictingLectureRepository = async ({
    class_id,
    teacher_id,
    day_of_week,
    start_time,
    end_time,
    excludeLectureId = null,
}) => {
    try {
        const query = {
            day_of_week,
            $and: [
                { start_time: { $lt: end_time } },
                { end_time: { $gt: start_time } },
            ],
            $or: [],
        };

        if (class_id) {
            query.$or.push({ class_id });
        }
        if (teacher_id) {
            query.$or.push({ teacher_id });
        }

        if (query.$or.length === 0) {
            return null;
        }

        if (excludeLectureId) {
            query._id = { $ne: excludeLectureId };
        }

        return await Lecture.findOne(query);
    } catch (error) {
        throw error;
    }
};

export const createLectureRepository = async (data, options = {}) => {
    try {
        const [lecture] = await Lecture.create([data], options);
        return lecture;
    } catch (error) {
        throw error;
    }
};

export const updateLectureRepository = async (lectureId, updateData, options = {}) => {
    try {
        return await Lecture.findByIdAndUpdate(
            lectureId,
            updateData,
            { new: true, runValidators: true, ...options }
        );
    } catch (error) {
        throw error;
    }
};

export const deleteLectureRepository = async (lectureId, options = {}) => {
    try {
        return await Lecture.deleteOne({ _id: lectureId }, options);
    } catch (error) {
        throw error;
    }
};
