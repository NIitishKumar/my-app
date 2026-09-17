import { createStudentService } from "./index.js"

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

export { createStudent }