import { createUserServices, findUser } from "./index.js";

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

const loginUser = async (req, res) => {
    try {
        const user = await findUser(req.body);
        res.code(200).send({
            message: "User found successfully",
            user
        })
    } catch (error) {
        res.code(400).send({
            message: error.message
        })
    }
}

export { createUser, findUser, loginUser }