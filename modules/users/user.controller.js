import { createUser as createUserServices } from './user.services.js'

const createUser = async (req, res) => {
    try {
        const user = await createUserServices(req.body);

        res.code(201).send({
            message: "User created successfully",
            user
        })
    } catch (error) {
        res.code(400).send({
            message: error.message
        })
    }
}

export { createUser }