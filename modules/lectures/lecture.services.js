import { Class } from '../classes/index.js';
import { Teacher } from '../teachers/index.js';
import { Lecture } from './index.js';
import {
    findConflictingLectureRepository,
    getLectureDetailRepository,
    getLecturesRepository,
} from './lecture.repository.js';

export async function getLectures(filters = {}) {
    try {
        const query = {};
        if (filters.class_id) query.class_id = filters.class_id;
        if (filters.teacher_id) query.teacher_id = filters.teacher_id;
        if (filters.day_of_week) query.day_of_week = filters.day_of_week.toLowerCase();
        if (filters.subject) query.subject = { $regex: filters.subject, $options: 'i' };

        const lectures = await getLecturesRepository(query);
        return lectures || [];
    } catch (error) {
        throw error;
    }
}

export async function getLectureDetails(lectureId) {
    try {
        const lecture = await getLectureDetailRepository(lectureId);
        if (!lecture) {
            const err = new Error('Lecture not found!');
            err.status = 404;
            throw err;
        }
        return lecture;
    } catch (error) {
        throw error;
    }
}

export async function createLecture(payload) {
    const {
        class_id,
        teacher_id,
        subject,
        day_of_week,
        start_time,
        end_time,
        room_number = null,
    } = payload;

    if (!class_id) {
        const err = new Error('class_id is required');
        err.status = 400;
        throw err;
    }
    if (!teacher_id) {
        const err = new Error('teacher_id is required');
        err.status = 400;
        throw err;
    }
    if (!subject) {
        const err = new Error('subject is required');
        err.status = 400;
        throw err;
    }
    if (!day_of_week) {
        const err = new Error('day_of_week is required');
        err.status = 400;
        throw err;
    }
    if (!start_time) {
        const err = new Error('start_time is required');
        err.status = 400;
        throw err;
    }
    if (!end_time) {
        const err = new Error('end_time is required');
        err.status = 400;
        throw err;
    }

    if (start_time >= end_time) {
        const err = new Error('start_time must be strictly earlier than end_time');
        err.status = 400;
        throw err;
    }

    const normalizedDay = day_of_week.toLowerCase();

    // Verify class exists
    const classExists = await Class.findById(class_id);
    if (!classExists) {
        const err = new Error('Class not found!');
        err.status = 404;
        throw err;
    }

    // Verify teacher exists
    const teacherExists = await Teacher.findById(teacher_id);
    if (!teacherExists) {
        const err = new Error('Teacher not found!');
        err.status = 404;
        throw err;
    }

    // Check conflict for class or teacher
    const conflict = await findConflictingLectureRepository({
        class_id,
        teacher_id,
        day_of_week: normalizedDay,
        start_time,
        end_time,
    });

    if (conflict) {
        if (conflict.class_id.toString() === class_id.toString()) {
            const err = new Error(
                `Class already has lecture '${conflict.subject}' scheduled on ${normalizedDay} between ${conflict.start_time} and ${conflict.end_time}`
            );
            err.status = 409;
            throw err;
        }
        if (conflict.teacher_id.toString() === teacher_id.toString()) {
            const err = new Error(
                `Teacher is already assigned to a lecture on ${normalizedDay} between ${conflict.start_time} and ${conflict.end_time}`
            );
            err.status = 409;
            throw err;
        }
    }

    const [lecture] = await Lecture.create([
        {
            class_id,
            teacher_id,
            subject,
            day_of_week: normalizedDay,
            start_time,
            end_time,
            room_number,
        },
    ]);

    return lecture;
}

export async function updateLecture(lectureId, payload) {
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
        const err = new Error('Lecture not found!');
        err.status = 404;
        throw err;
    }

    const effectiveClassId = payload.class_id || lecture.class_id;
    const effectiveTeacherId = payload.teacher_id || lecture.teacher_id;
    const effectiveDay = (payload.day_of_week || lecture.day_of_week).toLowerCase();
    const effectiveStartTime = payload.start_time || lecture.start_time;
    const effectiveEndTime = payload.end_time || lecture.end_time;

    if (effectiveStartTime >= effectiveEndTime) {
        const err = new Error('start_time must be strictly earlier than end_time');
        err.status = 400;
        throw err;
    }

    if (payload.class_id && payload.class_id.toString() !== lecture.class_id.toString()) {
        const classExists = await Class.findById(payload.class_id);
        if (!classExists) {
            const err = new Error('Class not found!');
            err.status = 404;
            throw err;
        }
    }

    if (payload.teacher_id && payload.teacher_id.toString() !== lecture.teacher_id.toString()) {
        const teacherExists = await Teacher.findById(payload.teacher_id);
        if (!teacherExists) {
            const err = new Error('Teacher not found!');
            err.status = 404;
            throw err;
        }
    }

    // Check schedule conflicts
    const conflict = await findConflictingLectureRepository({
        class_id: effectiveClassId,
        teacher_id: effectiveTeacherId,
        day_of_week: effectiveDay,
        start_time: effectiveStartTime,
        end_time: effectiveEndTime,
        excludeLectureId: lecture._id,
    });

    if (conflict) {
        if (conflict.class_id.toString() === effectiveClassId.toString()) {
            const err = new Error(
                `Class already has lecture '${conflict.subject}' scheduled on ${effectiveDay} between ${conflict.start_time} and ${conflict.end_time}`
            );
            err.status = 409;
            throw err;
        }
        if (conflict.teacher_id.toString() === effectiveTeacherId.toString()) {
            const err = new Error(
                `Teacher is already assigned to a lecture on ${effectiveDay} between ${conflict.start_time} and ${conflict.end_time}`
            );
            err.status = 409;
            throw err;
        }
    }

    const allowedFields = [
        'class_id',
        'teacher_id',
        'subject',
        'day_of_week',
        'start_time',
        'end_time',
        'room_number',
    ];

    allowedFields.forEach((field) => {
        if (payload[field] !== undefined) {
            lecture[field] = field === 'day_of_week' ? payload[field].toLowerCase() : payload[field];
        }
    });

    await lecture.save();
    return lecture;
}

export async function deleteLecture(lectureId) {
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
        const err = new Error('Lecture not found!');
        err.status = 404;
        throw err;
    }

    await Lecture.deleteOne({ _id: lectureId });
    return true;
}
