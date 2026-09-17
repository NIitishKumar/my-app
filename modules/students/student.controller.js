import { createStudentService, deleteStudent, getStudentDetails, getStudents } from "./index.js"

const createStudent = async (req, res) => {
    try {
        const student = await createStudentService(req.body);
        return {
            statusCode: 201,
            message: "Student created successfully",
            data: student
        }
    } catch (error) {
        res.code(400).send({
            message: error.message
        })
    }
}

const getStudentsController = async (req, res) => {
    try {
        const student = await getStudents(req.body);
        return {
            statusCode: 201,
            message: "Student created successfully",
            data: student
        }
    } catch (error) {
        res.code(400).send({
            message: error.message
        })
    }
}

const getStudentDetailsController = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await getStudentDetails(id);
        return {
            statusCode: 201,
            message: "Student details fetched successfully",
            data: student
        }
    } catch (error) {
        res.code(400).send({
            message: error.message
        })
    }
}

const deleteStudentController = async (req, res) => {
    try {
        const student = await deleteStudent(req.params.id);
        return {
            statusCode: 201,
            message: "Student deleted successfully",
            data: student
        }
    } catch (error) {
        res.code(400).send({
            message: error.message
        })
    }
}

export { createStudent, getStudentsController, deleteStudentController, getStudentDetailsController }