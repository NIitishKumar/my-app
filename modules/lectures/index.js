export {
    createLecture as createLectureController,
    getLecturesController,
    getLectureDetailsController,
    updateLectureController,
    deleteLectureController,
} from './lecture.controller.js';

export {
    createLecture as createLectureService,
    getLectures as getLecturesService,
    getLectureDetails as getTeacherDetailsService,
    getLectureDetails as getLectureDetailsService,
    updateLecture as updateLectureService,
    deleteLecture as deleteLectureService,
    createLecture,
    getLectures,
    getLectureDetails,
    updateLecture,
    deleteLecture,
} from './lecture.services.js';

export {
    getLecturesRepository,
    getLectureDetailRepository,
    findConflictingLectureRepository,
    createLectureRepository,
    updateLectureRepository,
    deleteLectureRepository,
} from './lecture.repository.js';

export { default as Lecture } from './lecture.schema.js';
