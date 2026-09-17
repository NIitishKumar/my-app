export {
    createTeacher as createTeacherController,
    getTeachersController,
    getTeacherDetailsController,
    updateTeacherController,
    deleteTeacherController,
} from './teacher.controller.js';

export {
    createTeacher as createTeacherService,
    getTeachers as getTeachersService,
    getTeacherDetails as getTeacherDetailsService,
    updateTeacher as updateTeacherService,
    deleteTeacher as deleteTeacherService,
    getTeachers,
    getTeacherDetails,
    updateTeacher,
    deleteTeacher,
} from './teacher.services.js';

export {
    getTeachersRepository,
    getTeacherDetailRepository,
    findTeacherByEmployeeIdRepository,
    createTeacherRepository,
    updateTeacherRepository,
    deleteTeacherRepository,
} from './teacher.repository.js';

export { default as Teacher } from './teacher.schema.js';
